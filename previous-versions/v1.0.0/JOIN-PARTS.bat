@echo off
rem Rebuilds ConsoleRepairAtlas-v1.0.0-win64.zip from its three parts.
cd /d "%~dp0"
copy /b ConsoleRepairAtlas-v1.0.0-win64.zip.001+ConsoleRepairAtlas-v1.0.0-win64.zip.002+ConsoleRepairAtlas-v1.0.0-win64.zip.003 ConsoleRepairAtlas-v1.0.0-win64.zip >nul
if errorlevel 1 (
  echo Join failed - make sure all three .00x parts are in this folder.
  pause
  exit /b 1
)
echo Checking file integrity...
powershell -NoProfile -Command "if ((Get-FileHash ConsoleRepairAtlas-v1.0.0-win64.zip -Algorithm SHA256).Hash -eq '5c2b9beebd15d192799ad6995ec0ed95efaf6a2d60d5151b72380fa3423897cb') { Write-Host 'OK - ConsoleRepairAtlas-v1.0.0-win64.zip is ready. Unzip it and run Console Repair Atlas.exe.' } else { Write-Host 'WARNING - checksum does not match. Re-download the three parts.' }"
pause
