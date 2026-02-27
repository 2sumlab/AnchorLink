#!/bin/bash
set -e

VERSION=$(node -p "require('./package.json').version")
TAG="v${VERSION}"
ZIP="out/make/zip/darwin/arm64/AnchorLink-darwin-arm64-${VERSION}.zip"

echo "▶ Building AnchorLink ${TAG}..."
npm run make

if gh release view "$TAG" &>/dev/null; then
  echo "▶ Replacing existing release ${TAG}..."
  gh release delete "$TAG" --yes --cleanup-tag
fi

echo "▶ Publishing GitHub release ${TAG}..."
gh release create "$TAG" "$ZIP" \
  --title "AnchorLink ${TAG}" \
  --generate-notes

echo "✓ Release ${TAG} published."
