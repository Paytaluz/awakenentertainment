#!/usr/bin/env bash
# Builds MCDB and syncs it into this site's mcdb/ folder, then regenerates
# _redirects so the new build's hashed filenames are routed correctly.
#
# This does NOT commit or push — review `git status`/`git diff` in this repo
# afterwards, then commit and push (to gh-pages) yourself. Never push the
# MCDB project's own repo; only this site repo's mcdb/ copy gets deployed.
set -euo pipefail

MCDB_DIR="/Users/nyinyisoewin/PR/MCDB"
SITE_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "Building MCDB..."
cd "$MCDB_DIR"
npm run build

echo "Syncing dist/ into $SITE_DIR/mcdb/ (removing files from old builds)..."
rsync -a --delete "$MCDB_DIR/dist/" "$SITE_DIR/mcdb/"

echo "Regenerating _redirects..."
"$SITE_DIR/scripts/update-mcdb-redirects.sh"

echo
echo "Done. Review changes with: git -C \"$SITE_DIR\" status"
