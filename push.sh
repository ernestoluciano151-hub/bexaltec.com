#!/bin/bash
# Run this from the bexaltec folder: bash push.sh
cd "$(dirname "$0")"
rm -f .git/index.lock 2>/dev/null
git add -A
git commit -m "fix: add 'use client' to Footer.tsx — resolves build error and /_not-found timeout"
git push origin main
echo "✅ Push completo!"
