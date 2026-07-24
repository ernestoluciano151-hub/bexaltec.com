#!/bin/bash
# Run this from the bexaltec folder: bash push.sh
cd "$(dirname "$0")"
rm -f .git/index.lock 2>/dev/null
git add -A
git commit -m "feat: Phase 2+3 — premium homepage, 11 service pages, NavBar/Footer/Sidebar, middleware, 21 portal+admin modules"
git push origin main
echo "✅ Push completo!"
