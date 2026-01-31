# Intel 4189 P4 microcodes
Extracted from https://github.com/platomav/CPUMicrocodes with command
```bash
git log --all --name-only --diff-filter=A | grep -E "cpu606A" | sort | uniq | while read -r file; do \
  commit=$(git rev-list -1 --all -- "$file");
  mkdir -p "restored/$(dirname "$file")";
  git show "$commit":"$file" > "restored/$file" 2>/dev/null || git show "$commit^1":"$file" > "restored/$file"; 
done
```
