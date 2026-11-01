#!/bin/bash
# Builds dist/Console Repair Atlas and ConsoleRepairAtlas-v<version>-win64.zip
set -e
cd "$(dirname "$0")/.."
python3 tools/data.py
VER=$(node -e 'global.window={};require("./app/changelog.js");console.log(window.ATLAS_VERSION)')
node -e "const f='app/package.json',p=require('./'+f);p.version='$VER';require('fs').writeFileSync(f,JSON.stringify(p,null,2))"
node -e '
global.window={}; require("./app/changelog.js"); const L=window.ATLAS_CHANGELOG, fs=require("fs");
let t="CONSOLE REPAIR ATLAS - CHANGELOG\n================================\n";
for (const r of L){ t+=`\nv${r.version}  (${r.date})  ${r.title}\n`+"-".repeat(40)+"\n"; for(const [k,d] of r.changes) t+=`  [${k}] ${d}\n`; }
fs.writeFileSync("CHANGELOG.txt", t);
let m="# Console Repair Atlas — Changelog\n"; for (const r of L){ m+=`\n## v${r.version} — ${r.date} — ${r.title}\n`; for(const [k,d] of r.changes) m+=`- **${k}:** ${d}\n`; }
fs.writeFileSync("CHANGELOG.md", m);'
sed -i "1s/.*/CONSOLE REPAIR ATLAS  v$VER/" README.txt
D="dist/Console Repair Atlas"
rm -rf dist && mkdir -p "$D" && cp -r build_base/. "$D/" && rm -f "$D/resources/default_app.asar"
mkdir -p "$D/resources/app" && cp app/*.js app/*.html app/*.css app/package.json app/icon.png "$D/resources/app/"
mv "$D/electron.exe" "$D/Console Repair Atlas.exe"
for f in README.txt CHANGELOG.txt; do sed 's/$/\r/' $f > "$D/$f"; done
rm -f "ConsoleRepairAtlas-v$VER-win64.zip"
(cd dist && zip -qr -9 "../ConsoleRepairAtlas-v$VER-win64.zip" "Console Repair Atlas")
echo "Built v$VER"; ls -la ConsoleRepairAtlas-v$VER-win64.zip

# ---- Windows installer (NSIS). Set NSIS_DIR to an NSIS 3 folder containing linux/makensis (or makensis on PATH).
NSIS_DIR=${NSIS_DIR:-/home/claude/dl/nsis/nsis}
MAKENSIS=$(command -v makensis || echo "$NSIS_DIR/linux/makensis")
if [ -x "$MAKENSIS" ]; then
  SETUP="ConsoleRepairAtlas-Setup-v$VER.exe"; rm -f "$SETUP"
  ( cd "$D" && for f in *; do if [ -d "$f" ]; then echo "  RMDir /r \"\$INSTDIR\\$f\""; else echo "  Delete \"\$INSTDIR\\$f\""; fi; done ) > tools/installer/uninstall_files.nsh
  ( cd tools/installer && NSISDIR="$NSIS_DIR" "$MAKENSIS" -V2 -DVERSION="$VER" -DSRCDIR="$(cd ../.. && pwd)/$D" -DOUTFILE="$(cd ../.. && pwd)/$SETUP" installer.nsi )
  ls -la "$SETUP"
else
  echo "makensis not found - skipped installer"
fi
