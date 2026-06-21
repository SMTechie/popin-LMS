#!/usr/bin/env bash
set -euo pipefail

MANIFEST=${1:-release-manifest.previous.json}

if [ ! -f "$MANIFEST" ]; then
  echo "No previous manifest available"
  exit 1
fi

cp "$MANIFEST" release-manifest.json
./scripts/deploy.sh release-manifest.json
