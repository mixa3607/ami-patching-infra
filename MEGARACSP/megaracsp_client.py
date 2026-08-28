#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
MegaRAC SP (AMI) BMC web-API client - config backup download / upload only.

Target: Axiomtek IMB760 / DPC627-A, AST2500, MegaRAC SP (FW 2.02.76714).
Protocol was reverse engineered from the web UI sources in
MEGARACSP/EXTRACTED/70_web-data/ and verified against a live BMC:

  * Login   : POST /rpc/WEBSES/create.asp
              (WEBVAR_USERNAME, WEBVAR_PASSWORD) -> SESSION_COOKIE, SESSION_ID,
              CSRFTOKEN, HAPI_STATUS.
  * Session : cookies "SessionCookie=<SESSION_COOKIE>; SESSION_ID=<n>" must be
              sent with every request. All /rpc/*.asp calls (except /rpc/WEBSES/*)
              and the file upload additionally require the header
              "CSRFTOKEN: <token>" (verified: upload without it is rejected).
  * Download: trigger a backup via
                POST /rpc/setbackupcfg.asp          BACKUP_SELECTOR=<bitmask>
                POST /rpc/setbackuprestorecfg.asp   CONFIG_STATUS=1
                poll /rpc/backuprestorestatus.asp   until STATUS == 0
              then GET /config.bak (serves the generated backup, attachment).
  * Upload  : POST /page/file_upload.html?SOURCE=ConfigFile  (multipart,
              field "restoreconf" -> saved to /tmp/conf.bak on the BMC),
              then POST /rpc/setbackuprestorecfg.asp CONFIG_STATUS=2 and poll.

Dependencies: Python 3 standard library only.
"""

import argparse
import gzip
import re
import sys
import time
import uuid
import urllib.error
import urllib.parse
import urllib.request

DEFAULT_HOST = "192.168.1.146"
DEFAULT_USER = "admin"
DEFAULT_PASS = "admin"

STATUS_BUSY = 0x0F        # 15 : operation still in progress
STATUS_OK = 0x0           #  0 : done

# HAPI status codes decoded from impl/login_imp.js / lib/xmit.js
LOGIN_ERRORS = {
    0x3: "maximum number of web sessions already in use",
    0xD4: "no access privilege for this user",
    -6: "invalid username or password",
}


class HapiError(Exception):
    """An RPC returned a non-zero HAPI_STATUS."""

    def __init__(self, status, detail=""):
        super().__init__("HAPI_STATUS=%s %s" % (status, detail))
        self.status = status


class SessionExpiredError(Exception):
    """The BMC rejected our session cookie / CSRF token."""


class MegaRacSPClient:
    def __init__(self, host=DEFAULT_HOST, user=DEFAULT_USER, password=DEFAULT_PASS,
                 timeout=30):
        self.host = host
        self.user = user
        self.password = password
        self.timeout = timeout
        self.cookies = {}
        self.csrf = None
        self._http = urllib.request.build_opener()
        self._http.addheaders = [
            ("User-Agent", "Mozilla/5.0 (X11; Linux x86_64) megaracsp-client/1.0"),
        ]

    # ------------------------------------------------------------------ HTTP
    def _request(self, method, path, data=None, headers=None, csrf=True):
        """Low-level HTTP request. Returns (status, dict_of_headers, body_bytes).

        Sends session cookies always; adds the CSRFTOKEN header unless csrf=False.
        """
        url = "http://%s%s" % (self.host, path)
        req_headers = {}
        if self.cookies:
            req_headers["Cookie"] = "; ".join(
                "%s=%s" % (k, v) for k, v in self.cookies.items())
        if csrf and self.csrf:
            req_headers["CSRFTOKEN"] = self.csrf
        if headers:
            req_headers.update(headers)
        body = data.encode("utf-8") if isinstance(data, str) else data
        req = urllib.request.Request(url, data=body, headers=req_headers,
                                     method=method)
        try:
            resp = self._http.open(req, timeout=self.timeout)
        except urllib.error.HTTPError as exc:
            return exc.code, dict(exc.headers), exc.read()
        except urllib.error.URLError as exc:
            raise SystemExit("network error talking to %s: %s" % (self.host, exc))
        return resp.getcode(), dict(resp.headers), resp.read()

    @staticmethod
    def _decode(headers, body):
        headers = {str(k).lower(): v for k, v in (headers or {}).items()}
        enc = (headers.get("content-encoding") or "").lower()
        if enc in ("gzip", "x-gzip"):
            body = gzip.decompress(body)
        elif enc == "deflate":
            try:
                body = gzip.decompress(body)
            except OSError:
                body = body
        ctype = headers.get("content-type") or ""
        if "application/json" in ctype or "javascript" in ctype:
            try:
                return body.decode("utf-8", "replace")
            except UnicodeDecodeError:
                return body.decode("latin-1", "replace")
        return body.decode("utf-8", "replace")

    # ---------------------------------------------------------------- parsing
    @staticmethod
    def _hapi_status(text):
        m = re.search(r"HAPI_STATUS\s*:\s*(-?\d+)", text)
        return int(m.group(1)) if m else None

    @staticmethod
    def _extract(text, key):
        """Pull 'KEY' : value from the JS-style JSON the BMC returns.

        Handles 'string' values and bare integers; the value is returned as a
        python str (already unquoted).
        """
        m = re.search(
            r"['\"]%s['\"]\s*:\s*" % re.escape(key) +
            r"(?:'((?:\\.|[^'])*)'|\"((?:\\.|[^\"])*)\"|(-?\d+))", text)
        if not m:
            return None
        if m.group(1) is not None:
            return m.group(1)
        if m.group(2) is not None:
            return m.group(2)
        return m.group(3)

    def _rpc(self, path, params=None):
        """Form-POST an RPC endpoint, return the parsed JS JSON text."""
        data = urllib.parse.urlencode(params or {})
        status, headers, body = self._request(
            "POST", path, data=data, csrf=True,
            headers={"Content-Type": "application/x-www-form-urlencoded"})
        text = self._decode(headers, body)
        if "session_expired.html" in text or \
                ("expired" in text.lower() and "<html>" in text.lower()):
            raise SessionExpiredError("BMC redirected to session_expired page")
        hapi = self._hapi_status(text)
        if hapi is None:
            raise HapiError(-1, "unparsable RPC response from %s" % path)
        if 7000 <= hapi <= 7009:
            raise SessionExpiredError("session rejected by BMC (HAPI_STATUS=%d)" % hapi)
        if hapi != 0:
            raise HapiError(hapi, "from %s" % path)
        return text

    # ----------------------------------------------------------------- login
    def login(self):
        """Create a web session; store cookies + CSRF token."""
        self.cookies = {}
        self.csrf = None
        data = urllib.parse.urlencode({
            "WEBVAR_USERNAME": self.user,
            "WEBVAR_PASSWORD": self.password,
        })
        status, headers, body = self._request(
            "POST", "/rpc/WEBSES/create.asp", data=data, csrf=False,
            headers={"Content-Type": "application/x-www-form-urlencoded"})
        text = self._decode(headers, body)
        hapi = self._hapi_status(text)
        if hapi is None:
            raise HapiError(-1, "login endpoint returned an unparsable response")
        if hapi != 0:
            raise HapiError(hapi, LOGIN_ERRORS.get(
                hapi, "login refused"))
        session_cookie = self._extract(text, "SESSION_COOKIE")
        session_id = self._extract(text, "SESSION_ID")
        csrf = self._extract(text, "CSRFTOKEN")
        if not session_cookie or session_cookie.startswith("Failure"):
            raise HapiError(hapi, "login failed")
        self.cookies = {
            "SessionCookie": session_cookie,
            "SESSION_ID": session_id or "0",
            "BMC_IP_ADDR": self._extract(text, "BMC_IP_ADDR") or self.host,
            "Language": "EN",
        }
        self.csrf = csrf or ""

    # ---------------------------------------------------------------- backup
    def get_backup_cfg(self):
        """Return the list of backup sections: [(SELECTOR:int, NAME:str), ...]."""
        text = self._rpc("/rpc/getbackupcfg.asp")
        items = []
        for sel, name in re.findall(
                r"\{[^{}]*'SELECTOR'\s*:\s*(\d+)[^{}]*'NAME'\s*:\s*'([^']*)'",
                text):
            items.append((int(sel), name))
        return items

    def _set_backup_selector(self, selector):
        self._rpc("/rpc/setbackupcfg.asp", {"BACKUP_SELECTOR": str(selector)})

    def _start_operation(self, config_status):
        # 1 = backup, 2 = restore
        self._rpc("/rpc/setbackuprestorecfg.asp", {"CONFIG_STATUS": str(config_status)})

    def _backuprestore_status(self):
        text = self._rpc("/rpc/backuprestorestatus.asp")
        status = self._extract(text, "STATUS")
        return int(status) if status is not None else None

    def _wait_ready(self, op_name, timeout=180, interval=2):
        deadline = time.time() + timeout
        transient = 0
        while True:
            try:
                st = self._backuprestore_status()
                transient = 0
            except urllib.error.HTTPError as exc:
                # The BMC may drop the web server momentarily around the
                # operation; tolerate a few transient failures.
                transient += 1
                if transient > 5 or time.time() > deadline:
                    raise HapiError(-1, "connection lost while waiting for %s "
                                        "(HTTP %s)" % (op_name, exc.code))
                time.sleep(interval)
                continue
            except (urllib.error.URLError, OSError) as exc:
                transient += 1
                if transient > 5 or time.time() > deadline:
                    raise HapiError(-1, "connection lost while waiting for %s "
                                        "(%s)" % (op_name, exc))
                time.sleep(interval)
                continue
            if st is None:
                raise HapiError(-1, "no status while waiting for %s" % op_name)
            if st == STATUS_OK:
                return
            if st != STATUS_BUSY:
                raise HapiError(st, "while waiting for %s" % op_name)
            if time.time() > deadline:
                raise HapiError(-1, "timed out waiting for %s" % op_name)
            time.sleep(interval)

    # -------------------------------------------------------------- download
    def download(self, out_path, selector=None, tries=2):
        for attempt in range(tries):
            try:
                return self._download_once(out_path, selector)
            except SessionExpiredError:
                if attempt + 1 >= tries:
                    raise
                print("session expired, re-logging in and retrying...", file=sys.stderr)
                self.login()

    def _download_once(self, out_path, selector):
        # Some boards keep the last backup around; use it if present.
        status, headers, body = self._request("GET", "/config.bak", csrf=True)
        if status == 200 and body[:11] == b"$$$Version=":
            self._save(out_path, body)
            print("saved backup to %s" % out_path)
            return

        items = self.get_backup_cfg()
        if selector is None:
            selector = 0
            for sel, _name in items:
                selector |= 1 << sel
        print("backing up config sections 0x%x (%s)" %
              (selector, ", ".join(name for _s, name in items) or "all"))
        self._set_backup_selector(selector)
        self._start_operation(1)          # CONFIG_STATUS = 1 (backup)
        self._wait_ready("backup")
        status, headers, body = self._request("GET", "/config.bak", csrf=True)
        if status != 200:
            raise HapiError(-1, "GET /config.bak returned HTTP %d" % status)
        if body[:11] != b"$$$Version=":
            raise HapiError(-1, "GET /config.bak did not return a backup file")
        self._save(out_path, body)
        print("saved backup to %s (%d bytes)" % (out_path, len(body)))

    @staticmethod
    def _save(out_path, body):
        with open(out_path, "wb") as fh:
            fh.write(body)

    # ---------------------------------------------------------------- upload
    def upload(self, in_path, tries=2):
        for attempt in range(tries):
            try:
                self._upload_once(in_path)
                return
            except SessionExpiredError:
                if attempt + 1 >= tries:
                    raise
                print("session expired, re-logging in and retrying...", file=sys.stderr)
                self.login()

    def _upload_once(self, in_path):
        with open(in_path, "rb") as fh:
            file_bytes = fh.read()
        self._validate_backup(file_bytes, in_path)

        boundary = "----megaracsp-" + uuid.uuid4().hex
        parts = []
        parts.append(("--" + boundary).encode())
        parts.append(('Content-Disposition: form-data; name="restoreconf"; '
                      'filename="%s"' % urllib.parse.quote(
                          in_path.rsplit("/", 1)[-1])).encode())
        parts.append(b"Content-Type: application/octet-stream")
        parts.append(b"")
        parts.append(file_bytes)
        parts.append(("--" + boundary + "--").encode())
        parts.append(b"")
        body = b"\r\n".join(parts)

        path = "/page/file_upload.html?SOURCE=ConfigFile"
        status, headers, body_resp = self._request(
            "POST", path, data=body, csrf=True,
            headers={"Content-Type":
                     "multipart/form-data; boundary=%s" % boundary})
        text = self._decode(headers, body_resp)
        if "session_expired.html" in text:
            raise SessionExpiredError("upload rejected: session expired")
        if status == 404:
            raise HapiError(-1, "upload endpoint returned 404 (bad field name / URL)")
        # On success the handler answers with the file_upload.html page
        # (it references ../impl/file_upload_imp.js).
        if status != 200 or "file_upload_imp.js" not in text:
            raise HapiError(-1, "upload failed with HTTP %d" % status)

        print("uploaded %s to the BMC (%d bytes)" % (in_path, len(file_bytes)))
        print("applying configuration restore...")
        self._start_operation(2)          # CONFIG_STATUS = 2 (restore)
        self._wait_ready("restore", timeout=300)
        print("restore completed: configuration has been applied")

    @staticmethod
    def _validate_backup(file_bytes, in_path):
        if file_bytes[:11] != b"$$$Version=":
            print("warning: %s does not look like a MegaRAC SP backup "
                  "(missing '$$$Version=1$' header)" % in_path, file=sys.stderr)
        if not re.search(rb"\$\$\$CheckSumKeyIndex=\d+\$", file_bytes[:256]):
            print("warning: %s has no CheckSumKeyIndex line" % in_path,
                  file=sys.stderr)

    # ---------------------------------------------------------------- misc
    def logout(self):
        try:
            self._request("GET", "/rpc/WEBSES/logout.asp", csrf=False)
        except Exception:
            pass


def add_common(parser, suppress=False):
    """--host/--user/--pass/--timeout/--no-logout on a parser.

    With suppress=True the arguments use argparse.SUPPRESS as their default so
    that a subparser never clobbers values already set on the main parser.
    """
    kw = {"default": argparse.SUPPRESS} if suppress else {}
    parser.add_argument("--host", **kw, help="BMC host[:port]")
    parser.add_argument("--user", **kw, help="web user")
    parser.add_argument("--pass", dest="password", **kw, help="web password")
    parser.add_argument("--timeout", type=int, **kw, help="HTTP timeout, seconds")
    parser.add_argument("--no-logout", action="store_true",
                        help="keep the web session alive instead of logging out")


def build_parser():
    p = argparse.ArgumentParser(
        prog="megaracsp_client.py",
        description="AMI MegaRAC SP BMC - config backup download/upload client")
    add_common(p)
    sub = p.add_subparsers(dest="command", required=True)

    dl = sub.add_parser("download", help="download the config backup")
    add_common(dl, suppress=True)
    dl.add_argument("--out", default="config.bak",
                    help="output file (default %(default)s)")
    dl.add_argument("--selector", type=lambda s: int(s, 0), default=None,
                    help="BACKUP_SELECTOR bitmask; default: all known sections")

    up = sub.add_parser("upload", help="upload and apply a config backup")
    add_common(up, suppress=True)
    up.add_argument("--in", dest="infile", required=True,
                    help="backup .bak file to upload")
    return p


def main(argv=None):
    args = build_parser().parse_args(argv)
    client = MegaRacSPClient(args.host, args.user, args.password, args.timeout)
    try:
        print("logging in to %s ..." % args.host, flush=True)
        client.login()
        print("login OK")
        if args.command == "download":
            client.download(args.out, selector=args.selector)
        elif args.command == "upload":
            client.upload(args.infile)
        else:
            build_parser().error("unknown command %r" % args.command)
    except SessionExpiredError as exc:
        print("error: session rejected by BMC: %s" % exc, file=sys.stderr)
        return 1
    except HapiError as exc:
        print("error: %s" % exc, file=sys.stderr)
        return 1
    except OSError as exc:
        print("error: %s" % exc, file=sys.stderr)
        return 1
    finally:
        if "client" in locals() and not args.no_logout:
            client.logout()
    return 0


if __name__ == "__main__":
    sys.exit(main())
