# Console Repair Atlas v1.0.0 (previous version)

The first release, kept here for anyone who wants the older version. **For the latest version, use the [Releases](https://github.com/phillipjhowe-hue/interactive-video-game-console-schematics-and-parts/releases) page or the main [README](../../README.md).**

The Windows zip is 136 MB, larger than GitHub's 100 MB file limit, so it's stored in three parts.

## Download and rebuild

1. Download all four files in this folder into the same folder on your PC:
   - `ConsoleRepairAtlas-v1.0.0-win64.zip.001`
   - `ConsoleRepairAtlas-v1.0.0-win64.zip.002`
   - `ConsoleRepairAtlas-v1.0.0-win64.zip.003`
   - `JOIN-PARTS.bat`

   (Click each file, then the **Download raw file** button.)
2. Double-click **JOIN-PARTS.bat**. It rebuilds `ConsoleRepairAtlas-v1.0.0-win64.zip` and checks it is intact.
3. Unzip it and run `Console Repair Atlas.exe`.

**Manual alternative** (Command Prompt in that folder):

```
copy /b ConsoleRepairAtlas-v1.0.0-win64.zip.001+ConsoleRepairAtlas-v1.0.0-win64.zip.002+ConsoleRepairAtlas-v1.0.0-win64.zip.003 ConsoleRepairAtlas-v1.0.0-win64.zip
```

SHA-256 of the rebuilt zip: `5c2b9beebd15d192799ad6995ec0ed95efaf6a2d60d5151b72380fa3423897cb`

## What's in v1.0.0

See the v1.0.0 section of [CHANGELOG.md](../../CHANGELOG.md). Source code for this version: commit [2b44f41](https://github.com/phillipjhowe-hue/interactive-video-game-console-schematics-and-parts/commit/2b44f41) (“Console Repair Atlas v1.0.0 — first release”).
