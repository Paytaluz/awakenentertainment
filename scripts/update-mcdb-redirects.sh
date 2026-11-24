#!/usr/bin/env bash
# Regenerates _redirects from whatever files actually exist under mcdb/.
#
# Why this exists: Cloudflare Workers' _redirects uses first-match-wins, and
# the catch-all SPA rule (`/mcdb/* /mcdb/ 200`) would otherwise intercept
# every request under /mcdb/ — including real asset files — before the
# static-asset binding gets a chance to serve them. Each real file needs its
# own literal "rewrite to itself" rule ahead of the catch-all so that line
# stops the match there and the actual file is served. Vite content-hashes
# its built filenames, so those literal rules go stale on every MCDB build.
# Run this script after copying a new MCDB dist/ into mcdb/ (see
# deploy-mcdb.sh) and it rebuilds that list from what's actually on disk —
# nothing to remember, nothing to hand-edit.
set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -d mcdb ]; then
  echo "error: mcdb/ directory not found (run from the site repo root)" >&2
  exit 1
fi

TMP="$(mktemp)"
trap 'rm -f "$TMP"' EXIT

# Every file under mcdb/ gets a literal self-mapping rule, except index.html
# — that one is reached through the catch-all rewrite below, not directly.
find mcdb -type f ! -name 'index.html' | sort | while IFS= read -r f; do
  printf '/%s /%s 200\n' "$f" "$f"
done > "$TMP"

printf '/mcdb/* /mcdb/ 200\n' >> "$TMP"

mv "$TMP" _redirects
echo "_redirects regenerated: $(wc -l < _redirects | tr -d ' ') rules for $(find mcdb -type f ! -name 'index.html' | wc -l | tr -d ' ') mcdb files."
