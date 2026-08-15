#!/bin/sh
set -eu

usage()
{
	printf 'Usage: %s EXTRACTED-CONFIG-DIR REPORT-DIR\n' "$0" >&2
	exit 2
}

[ "$#" -eq 2 ] || usage
config=$1
report=$2
[ -d "$config" ] || { printf 'missing extracted config directory: %s\n' "$config" >&2; exit 1; }
[ ! -e "$report" ] || { printf 'report directory exists: %s\n' "$report" >&2; exit 1; }
mkdir -p "$report"
for name in main backup failsafe; do
	[ -d "$config/$name" ] || { printf 'missing extracted config: %s\n' "$config/$name" >&2; exit 1; }
	(
		cd "$config/$name"
		find . -type f -print | LC_ALL=C sort | while IFS= read -r file; do sha256sum "$file"; done
	) > "$report/$name.sha256"
done

if cmp -s "$report/main.sha256" "$report/backup.sha256"; then
	printf '%s\n' 'main and backup file content: identical' > "$report/summary.txt"
else
	printf '%s\n' 'main and backup file content: different' > "$report/summary.txt"
fi
if cmp -s "$report/main.sha256" "$report/failsafe.sha256"; then
	printf '%s\n' 'main and failsafe file content: identical' >> "$report/summary.txt"
else
	printf '%s\n' 'main and failsafe file content: different' >> "$report/summary.txt"
fi
diff -ru "$config/main" "$config/backup" > "$report/main-vs-backup.diff" || true
diff -ru "$config/main" "$config/failsafe" > "$report/main-vs-failsafe.diff" || true
cat "$report/summary.txt"
