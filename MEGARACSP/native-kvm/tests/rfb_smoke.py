#!/usr/bin/env python3
import argparse
import base64
import hashlib
import os
import socket
import struct
import time


class WebSocket:
    def __init__(self, host, port, basic_auth=None):
        self.sock = socket.create_connection((host, port), timeout=10)
        self.buffer = bytearray()
        key = base64.b64encode(os.urandom(16)).decode()
        authorization = ""
        if basic_auth:
            authorization = "Authorization: Basic " + base64.b64encode(basic_auth.encode()).decode() + "\r\n"
        request = (
            f"GET /websockify HTTP/1.1\r\nHost: {host}:{port}\r\n"
            "Upgrade: websocket\r\nConnection: Upgrade\r\n"
            f"Sec-WebSocket-Key: {key}\r\nSec-WebSocket-Version: 13\r\n{authorization}\r\n"
        ).encode()
        self.sock.sendall(request)
        response = self._http_headers()
        expected = base64.b64encode(hashlib.sha1(
            (key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11").encode()
        ).digest()).decode()
        if not response.startswith(b"HTTP/1.1 101 ") or expected.encode() not in response:
            raise RuntimeError(f"WebSocket upgrade failed: {response!r}")

    def _http_headers(self):
        data = bytearray()
        while b"\r\n\r\n" not in data:
            data.extend(self.sock.recv(4096))
        return bytes(data)

    def send(self, payload):
        mask = os.urandom(4)
        length = len(payload)
        if length < 126:
            header = bytes((0x82, 0x80 | length))
        elif length <= 0xffff:
            header = bytes((0x82, 0xfe)) + struct.pack(">H", length)
        else:
            header = bytes((0x82, 0xff)) + struct.pack(">Q", length)
        masked = bytes(value ^ mask[index & 3] for index, value in enumerate(payload))
        self.sock.sendall(header + mask + masked)

    def _frame(self):
        header = self._exact_socket(2)
        opcode = header[0] & 0x0f
        length = header[1] & 0x7f
        if length == 126:
            length = struct.unpack(">H", self._exact_socket(2))[0]
        elif length == 127:
            length = struct.unpack(">Q", self._exact_socket(8))[0]
        payload = self._exact_socket(length)
        if opcode == 8:
            raise EOFError("server closed WebSocket")
        if opcode != 2:
            raise RuntimeError(f"unexpected WebSocket opcode {opcode}")
        return payload

    def _exact_socket(self, length):
        data = bytearray()
        while len(data) < length:
            chunk = self.sock.recv(length - len(data))
            if not chunk:
                raise EOFError("short WebSocket frame")
            data.extend(chunk)
        return bytes(data)

    def read(self, length):
        while len(self.buffer) < length:
            self.buffer.extend(self._frame())
        result = bytes(self.buffer[:length])
        del self.buffer[:length]
        return result


def compact_length(ws):
    first = ws.read(1)[0]
    value = first & 0x7f
    if first & 0x80:
        second = ws.read(1)[0]
        value |= (second & 0x7f) << 7
        if second & 0x80:
            value |= ws.read(1)[0] << 14
    return value


def read_update(ws, width, height):
    update = ws.read(4)
    if update[0] != 0:
        raise RuntimeError(f"unexpected RFB message {update[0]}")
    rectangles = struct.unpack(">H", update[2:4])[0]
    jpeg = None
    jpeg_rect = None
    for _ in range(rectangles):
        rectangle = ws.read(12)
        x, y, rect_width, rect_height, encoding = struct.unpack(">HHHHi", rectangle)
        if encoding == -223:
            width, height = rect_width, rect_height
        elif encoding == 7:
            if ws.read(1) != b"\x90":
                raise RuntimeError("unexpected Tight control byte")
            jpeg = ws.read(compact_length(ws))
            jpeg_rect = (x, y, rect_width, rect_height)
        else:
            raise RuntimeError(f"unexpected encoding {encoding}")
    return width, height, jpeg_rect, jpeg


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("host")
    parser.add_argument("--port", type=int, default=8080)
    parser.add_argument("--output", default="rfb-smoke.jpg")
    parser.add_argument("--send-a", action="store_true")
    parser.add_argument("--repeat-a-down", type=int, default=0)
    parser.add_argument("--send-pointer", action="store_true")
    parser.add_argument("--paste")
    parser.add_argument("--updates", type=int, default=0)
    parser.add_argument("--without-power", action="store_true")
    parser.add_argument("--basic-auth")
    args = parser.parse_args()

    ws = WebSocket(args.host, args.port, args.basic_auth)
    assert ws.read(12) == b"RFB 003.008\n"
    ws.send(b"RFB 003.008\n")
    assert ws.read(2) == b"\x01\x01"
    ws.send(b"\x01")
    assert ws.read(4) == b"\0\0\0\0"
    ws.send(b"\x01")
    server_init = ws.read(24)
    width, height = struct.unpack(">HH", server_init[:4])
    name_length = struct.unpack(">I", server_init[20:24])[0]
    name = ws.read(name_length).decode(errors="replace")

    encodings = (7, -223) if args.without_power else (7, -223, -309)
    ws.send(b"\x02\0" + struct.pack(">H", len(encodings)) +
            b"".join(struct.pack(">i", value) for value in encodings))
    if not args.without_power and ws.read(4) != b"\xfa\0\x01\x01":
        raise RuntimeError("server did not initialize XVP power controls")
    ws.send(b"\x03\0\0\0\0\0" + struct.pack(">HH", width, height))
    width, height, _, jpeg = read_update(ws, width, height)
    if jpeg is None or not jpeg.startswith(b"\xff\xd8") or not jpeg.endswith(b"\xff\xd9"):
        raise RuntimeError("invalid Tight JPEG")
    with open(args.output, "wb") as output:
        output.write(jpeg)

    if args.send_a:
        ws.send(b"\x04\x01\0\0" + struct.pack(">I", ord("a")))
        ws.send(b"\x04\x00\0\0" + struct.pack(">I", ord("a")))
    if args.repeat_a_down:
        for _ in range(args.repeat_a_down):
            ws.send(b"\x04\x01\0\0" + struct.pack(">I", ord("a")))
        ws.send(b"\x04\x00\0\0" + struct.pack(">I", ord("a")))
    if args.send_pointer:
        ws.send(b"\x05\0" + struct.pack(">HH", width // 3, height // 3))
    if args.paste is not None:
        text = args.paste.encode("latin-1", errors="replace")
        ws.send(b"\x06\0\0\0" + struct.pack(">I", len(text)) + text)
    update_sizes = []
    started = time.monotonic()
    for index in range(args.updates):
        keysym = ord("a") + index % 26
        ws.send(b"\x04\x01\0\0" + struct.pack(">I", keysym))
        ws.send(b"\x04\x00\0\0" + struct.pack(">I", keysym))
        ws.send(b"\x03\x01\0\0\0\0" + struct.pack(">HH", width, height))
        width, height, rectangle, update_jpeg = read_update(ws, width, height)
        if rectangle is not None and update_jpeg is not None:
            update_sizes.append((rectangle, len(update_jpeg)))
    if args.updates:
        elapsed = time.monotonic() - started
        print(f"{args.updates} incremental updates in {elapsed:.3f}s ({args.updates / elapsed:.1f} requests/s), "
              f"{len(update_sizes)} changed frames")
    print(f"{name}: {width}x{height}, {len(jpeg)}-byte Tight JPEG -> {args.output}")


if __name__ == "__main__":
    main()
