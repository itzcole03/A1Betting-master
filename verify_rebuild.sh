#!/usr/bin/env bash
# verify_rebuild.sh: Automated verification script for legacy vs rebuilt app
set -euo pipefail

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <old_app_abs_path> <new_app_abs_path>"
  exit 2
fi

OLD="$1"
NEW="$2"

# 1. Inventory and diff
find "$OLD" -type f | sed "s|$OLD/||" | sort > /tmp/old_inventory.txt
find "$NEW" -type f | sed "s|$NEW/||" | sort > /tmp/new_inventory.txt
diff -u /tmp/old_inventory.txt /tmp/new_inventory.txt | grep '^-' | grep -v '^---' | sed 's/^-/<missing> /' && exit 1 || true

# 2. Large-asset folders
for d in assets static media models data; do
  find "$OLD" -type d -name "$d" >> /tmp/old_asset_dirs.txt || true
  find "$NEW" -type d -name "$d" >> /tmp/new_asset_dirs.txt || true
done

for dirlist in old new; do
  > /tmp/${dirlist}_asset_files.txt
  while read -r assetdir; do
    [ -d "$assetdir" ] && find "$assetdir" -type f | while read -r f; do sha256sum "$f"; done
  done < /tmp/${dirlist}_asset_dirs.txt | sort > /tmp/${dirlist}_asset_files.txt
done

diff -u /tmp/old_asset_files.txt /tmp/new_asset_files.txt && true || { echo "Large-asset file checksum mismatch"; exit 1; }

# 3. Build frontend and diff build/dist
for app in "$OLD" "$NEW"; do
  FE=$(find "$app" -type d -name frontend | head -n1)
  if [ -z "$FE" ]; then echo "No frontend found in $app"; exit 1; fi
  cd "$FE"
  yarn install
  yarn build
  cd - >/dev/null
done

OLDFE=$(find "$OLD" -type d -name frontend | head -n1)
NEWFE=$(find "$NEW" -type d -name frontend | head -n1)
OLDBUILD=$(find "$OLDFE" -type d \( -name build -o -name dist \) | head -n1)
NEWBUILD=$(find "$NEWFE" -type d \( -name build -o -name dist \) | head -n1)
if [ -z "$OLDBUILD" ] || [ -z "$NEWBUILD" ]; then echo "Build/dist folder missing after build"; exit 1; fi
diff -r "$OLDBUILD" "$NEWBUILD" || { echo "Frontend build/dist output differs"; exit 1; }

# 4. Backend tests
if [ -d "$NEW/tests" ]; then
  cd "$NEW"
  python -m unittest discover tests || { echo "Backend tests failed"; exit 1; }
  cd - >/dev/null
fi

# 5. Start backend and check endpoints
cd "$NEW"
if [ -f backend/main.py ]; then
  uvicorn backend.main:app --host 127.0.0.1 --port 8000 &
  UVIP=$!
elif [ -f backend/main:app ]; then
  uvicorn backend.main:app --host 127.0.0.1 --port 8000 &
  UVIP=$!
else
  echo "No backend/main.py or backend/main:app found"; exit 1
fi
cd - >/dev/null
sleep 5

check() {
  local url="$1" expected="$2"
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:8000$url")
  if [ "$code" = "$expected" ]; then
    echo "✓ $url → $code"
  else
    echo "✗ $url returned $code (expected $expected)"
    kill $UVIP; exit 1
  fi
}
check /health/ 200
check /api/status/ 200
check /login 401
kill $UVIP

# 6. Success
echo "ALL CHECKS PASSED"
exit 0

# Make executable
chmod +x "$0"
