#!/bin/bash
# Run this from the bexaltec folder: bash push.sh
cd "$(dirname "$0")"
rm -f .git/index.lock 2>/dev/null
git add -A
git commit -m "feat: Neon DB + Drizzle ORM + cache layer + secure JWT auth — full database integration"
git push origin main
echo "✅ Push completo!"
