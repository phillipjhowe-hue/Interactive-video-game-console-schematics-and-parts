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
rm -f ConsoleRepairAtlas-*win64.zip
(cd dist && zip -qr -9 "../ConsoleRepairAtlas-v$VER-win64.zip" "Console Repair Atlas")
echo "Built v$VER"; ls -la ConsoleRepairAtlas-v$VER-win64.zip
