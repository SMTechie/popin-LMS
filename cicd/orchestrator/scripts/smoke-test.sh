#!/usr/bin/env bash
set -euo pipefail

urls=${SMOKE_URLS:-"http://localhost:4000/health,http://localhost:3000"}
IFS=',' read -r -a list <<< "$urls"

for url in "${list[@]}"; do
  echo "Smoke testing $url"
  status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  if [ "$status" -lt 200 ] || [ "$status" -ge 400 ]; then
    echo "Smoke test failed for $url with status $status"
    exit 1
  fi
  echo "OK: $url"
  done
