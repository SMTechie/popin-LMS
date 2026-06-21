#!/usr/bin/env bash
set -euo pipefail

MANIFEST=${1:-release-manifest.json}
GHCR_ORG=${GHCR_ORG:?GHCR_ORG is required}

./scripts/validate-manifest.sh "$MANIFEST"

API_TAG=$(jq -r '.api' "$MANIFEST")
WEB_TAG=$(jq -r '.web' "$MANIFEST")
WORKER_TAG=$(jq -r '.worker' "$MANIFEST")

API_IMAGE="ghcr.io/${GHCR_ORG}/api:${API_TAG}"
WEB_IMAGE="ghcr.io/${GHCR_ORG}/web:${WEB_TAG}"
WORKER_IMAGE="ghcr.io/${GHCR_ORG}/worker:${WORKER_TAG}"

export API_IMAGE WEB_IMAGE WORKER_IMAGE

for image in "$API_IMAGE" "$WEB_IMAGE" "$WORKER_IMAGE"; do
  echo "Pulling $image"
  docker pull "$image"
  echo "Verifying signature for $image"
  cosign verify \
    --certificate-identity-regexp "https://github.com/${GHCR_ORG}/.*/.github/workflows/.*@refs/heads/main" \
    --certificate-oidc-issuer "https://token.actions.githubusercontent.com" \
    "$image"
  echo "Verified $image"
  done

cat > deploy/.env <<EOF
API_IMAGE=$API_IMAGE
WEB_IMAGE=$WEB_IMAGE
WORKER_IMAGE=$WORKER_IMAGE
EOF

# Run migrations placeholder
# docker run --rm "$API_IMAGE" npm run migrate

# Deploy services

docker compose -f deploy/docker-compose.yml up -d
