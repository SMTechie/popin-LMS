#!/usr/bin/env bash
set -euo pipefail

manifest="${1:-release-manifest.json}"

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required"
  exit 1
fi

if [ ! -f "$manifest" ]; then
  echo "Manifest not found: $manifest"
  exit 1
fi

invalid=$(jq -r 'to_entries[] | select(.value | test("^sha-[0-9a-f]{7,40}$") | not) | .key' "$manifest")
if [ -n "$invalid" ]; then
  echo "Invalid tags for: $invalid"
  exit 1
fi

echo "Manifest validated"
