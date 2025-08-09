#!/usr/bin/env bash
set -euo pipefail

OUTPUT_FILE="mcp-server/project-structure.mcp.md"
mkdir -p "$(dirname "$OUTPUT_FILE")"

cat > "$OUTPUT_FILE" <<'EOF'
# KahitSan Project Structure

This document reflects the **current folder & file structure** of the KahitSan project.
It is AI-readable for context when creating, modifying, or removing components, layouts, pages, and related assets.

```bash
EOF

# Exclude patterns (directories or files to skip)
EXCLUDES=(
  "./node_modules"
  "./.git"
  "./dist"
  "./build"
  "./.DS_Store"
  "./mcp-docs/project-structure.mcp.md"
)

# Build find prune arguments from EXCLUDES
PRUNE_ARGS=()
for e in "${EXCLUDES[@]}"; do
  PRUNE_ARGS+=(-path "$e" -prune -o)
done

# Use find to output all files/dirs (null-delimited) and process each entry
find . "${PRUNE_ARGS[@]}" -print0 | while IFS= read -r -d '' file; do
  rel="${file#./}"

  if [ -z "$rel" ]; then
    rel="."
    depth=0
    name="."
    indent=""
  else
    IFS='/' read -r -a parts <<< "$rel"
    depth=$(( ${#parts[@]} - 1 ))
    name="${parts[${#parts[@]}-1]}"
    indent=""
    for ((i=0; i<depth; i++)); do
      indent="${indent}│   "
    done
  fi

  if [ -d "$file" ]; then
    name="${name}/"
  fi

  printf "%s├── %s\n" "$indent" "$name"
done >> "$OUTPUT_FILE"

# Close code block
echo "\`\`\`" >> "$OUTPUT_FILE"

echo "✅ Project structure updated at: $OUTPUT_FILE"
