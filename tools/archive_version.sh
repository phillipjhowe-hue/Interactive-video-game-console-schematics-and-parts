#!/bin/bash
# Usage: tools/archive_version.sh <version> <zip> <repo_dir> <commit> <title>
# Stores a Windows build under previous-versions/v<version>/ as <=46 MB parts + JOIN-PARTS.bat + README.md
set -e
VER=$1; ZIP=$2; REPO=$3; COMMIT=$4; TITLE=$5
U=https://github.com/phillipjhowe-hue/interactive-video-game-console-schematics-and-parts
N="ConsoleRepairAtlas-v$VER-win64.zip"; D="$REPO/previous-versions/v$VER"
mkdir -p "$D" && cd "$D" && rm -f "$N".*
split -b 46m -d -a 3 --numeric-suffixes=1 "$ZIP" "$N."
PARTS=$(ls "$N".0* | sort); SHA=$(sha256sum "$ZIP" | cut -d' ' -f1)
[ "$(cat $PARTS | sha256sum | cut -d' ' -f1)" = "$SHA" ] || { echo "checksum mismatch"; exit 1; }
JOIN=$(echo $PARTS | sed 's/ /+/g'); CNT=$(echo $PARTS | wc -w)
printf '@echo off\r\nrem Rebuilds %s from its parts.\r\ncd /d "%%~dp0"\r\ncopy /b %s %s >nul\r\nif errorlevel 1 (\r\n  echo Join failed - make sure all %s .00x parts are in this folder.\r\n  pause\r\n  exit /b 1\r\n)\r\necho Checking file integrity...\r\npowershell -NoProfile -Command "if ((Get-FileHash %s -Algorithm SHA256).Hash -eq '"'"'%s'"'"') { Write-Host '"'"'OK - %s is ready. Unzip it and run Console Repair Atlas.exe.'"'"' } else { Write-Host '"'"'WARNING - checksum does not match. Re-download the parts.'"'"' }"\r\npause\r\n' "$N" "$JOIN" "$N" "$CNT" "$N" "$SHA" "$N" > JOIN-PARTS.bat
{ echo "# Console Repair Atlas v$VER (previous version)"; echo
  echo "$TITLE — kept here for anyone who wants this version. **For the latest version, see the [Releases]($U/releases) page or the main [README]($U#download).**"; echo
  echo "The Windows zip is larger than GitHub's 100 MB file limit, so it's stored in $CNT parts."; echo
  echo "## Download and rebuild"; echo
  echo "1. Download all the files in this folder into the same folder on your PC (click each file, then **Download raw file**):"
  for p in $PARTS; do echo "   - \`$p\`"; done; echo "   - \`JOIN-PARTS.bat\`"
  echo "2. Double-click **JOIN-PARTS.bat**. It rebuilds \`$N\` and checks it is intact."
  echo "3. Unzip it and run \`Console Repair Atlas.exe\`."; echo
  echo "**Manual alternative** (Command Prompt in that folder):"; echo; echo '```'; echo "copy /b $JOIN $N"; echo '```'; echo
  echo "SHA-256 of the rebuilt zip: \`$SHA\`"; echo
  echo "## What's in v$VER"; echo
  echo "See the v$VER section of [CHANGELOG.md](../../CHANGELOG.md). Source code for this version: commit [$COMMIT]($U/commit/$COMMIT)."; } > README.md
echo "archived v$VER ($CNT parts)"
