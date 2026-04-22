#!/usr/bin/env bash
# Build a clean Cloudflare Pages artifact for the github-contribution-graph site.
# Allowlist-based: copies only the live site assets into cf-dist/.
# IMPORTANT: functions/ stays at repo root (CF Pages auto-discovers it there).
# Do NOT copy functions/ into cf-dist/ — if we did, CF would treat them as
# static files and the API route would silently fail.
set -euo pipefail

cd "$(dirname "$0")/.."
rm -rf cf-dist
mkdir -p cf-dist

for item in \
  index.html \
  assets \
  404.html \
  robots.txt \
  favicon.ico \
  favicon.png
do
  if [ -e "$item" ]; then
    cp -R "$item" cf-dist/
  fi
done

echo "cf-dist/ contents (static only, functions/ stays at repo root):"
ls -la cf-dist
