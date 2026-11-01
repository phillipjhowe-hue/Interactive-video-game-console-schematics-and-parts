@echo off
rem Rebuilds ConsoleRepairAtlas-v1.2.0-win64.zip from its parts.
cd /d "%~dp0"
copy /b ConsoleRepairAtlas-v1.2.0-win64.zip.001+ConsoleRepairAtlas-v1.2.0-win64.zip.002+ConsoleRepairAtlas-v1.2.0-win64.zip.003 ConsoleRepairAtlas-v1.2.0-win64.zip >nul
if errorlevel 1 (
  echo Join failed - make sure all 3 .00x parts are in this folder.
  pause
  exit /b 1
)
echo Checking file integrity...
powershell -NoProfile -Command "if ((Get-FileHash ConsoleRepairAtlas-v1.2.0-win64.zip -Algorithm SHA256).Hash -eq 'c71911bfcc46937e6de74a463be39c9eb7b8766464f2abc058be914e1527e0b4') { Write-Host 'OK - ConsoleRepairAtlas-v1.2.0-win64.zip is ready. Unzip it and run Console Repair Atlas.exe.' } else { Write-Host 'WARNING - checksum does not match. Re-download the parts.' }"
pause
