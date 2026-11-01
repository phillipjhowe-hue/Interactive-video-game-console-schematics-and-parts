# Console Repair Atlas

Interactive Windows app with block diagrams, board views, part numbers, repair steps and replacement-part sources for video game consoles, from the Nintendo Entertainment System (1985) to the Valve Steam Machine (2026).

## Download

**[⬇ Download the installer — ConsoleRepairAtlas-Setup-v1.3.0.exe](download/ConsoleRepairAtlas-Setup-v1.3.0.exe)** (96 MB; on that page click **Download raw file**).

Run it, choose where to install, and answer **"Do you want to create a desktop icon?"** (you can also add a Start menu shortcut). No administrator rights needed. Windows 10/11 64-bit. The installer isn't code-signed yet, so SmartScreen may ask you to click **More info → Run anyway**.

Uninstall any time from **Settings › Apps › Console Repair Atlas**; it asks whether to keep your photos and notes. Installing a newer version over an older one upgrades it and keeps them.

### Previous versions

| Version | Download | Notes |
|---|---|---|
| v1.2.0 | [previous-versions/v1.2.0](previous-versions/v1.2.0) | Clickable resistors & capacitors. Portable zip in 3 parts; double-click `JOIN-PARTS.bat`. |
| v1.1.0 | [previous-versions/v1.1.0](previous-versions/v1.1.0) | Inside view, board-photo hotspots, how-to-replace steps, PS2 fuses. Stored as 3 parts; double-click `JOIN-PARTS.bat`. |
| v1.0.0 | [previous-versions/v1.0.0](previous-versions/v1.0.0) | First release. Stored as 3 parts; double-click `JOIN-PARTS.bat` to rebuild the zip. |

## Features

- 24 consoles, 297 components: NES, Master System, TurboGrafx-16, Genesis, SNES, Saturn, PlayStation, N64, Dreamcast, PS2, Xbox, GameCube, Xbox 360, PS3, Wii, Wii U, PS4, Xbox One, Switch, Xbox Series X, Xbox Series S, PS5, Switch 2, Steam Machine
- Clickable block diagram and parts list for every console
- **Inside view**: the open console drawn with the board, chips, traces, red callouts and a Ref / Function legend
- **Real board photo mode**: import a board photo, drag a box around each part, and get clickable hotspots whose crops become the part pictures
- **Clickable resistors & capacitors** on the inside view: value, color bands / SMD code, what it does, how to test and replace it, where to buy (representative values)
- **How to replace it**: difficulty, time, tools, steps and safety warnings for every part
- PS2 GH-019 board fuse map (F1, PS1–PS14)
- Each part shows its picture, part number, what it does, repair notes, and buttons that search replacement-part sellers
- Search across all consoles (Ctrl+K), plus your own photos and notes per part
- See [CHANGELOG.md](CHANGELOG.md) for what each version added

Part numbers marked ⚠ vary by board revision. Check the marking on your own chip or part before ordering.

## Repository layout

| Path | What it is |
|---|---|
| `app/` | The app (HTML/CSS/JS + Electron `main.js`/`preload.js`). `app/data.js` is generated. |
| `tools/data.py` | The console and parts database. Edit this, then regenerate `app/data.js`. |
| `README.txt` | User guide shipped inside the Windows zip. |
| `CHANGELOG.md` | Version history (also shown in the app under the version badge). |
| `app/changelog.js` | Source of the version number and change log. The top entry is the current version. |
| `tools/build.sh` | Builds the versioned Windows zip. |
| `tools/installer/` | NSIS installer script, icon and generated uninstall list. |
| `download/` | The current installer. |
| `tools/archive_version.sh` | Stores a superseded build under `previous-versions/` in parts. |

## Running from source

```bash
python3 tools/data.py          # regenerate app/data.js
npx electron app               # run with Electron
```

Opening `app/index.html` in a browser also works for the UI; photo storage then falls back to browser storage.

## Building the Windows zip

1. Download the Electron Windows x64 release zip and unzip it into `build_base/`.
2. Add a new entry at the top of `app/changelog.js`.
3. Get NSIS 3 (a Linux `makensis` works) and point `NSIS_DIR` at it.
4. Run `tools/build.sh`. It regenerates the data, stamps the version into `package.json`, `README.txt` and `CHANGELOG.md`, and writes both `ConsoleRepairAtlas-v<version>-win64.zip` (portable) and `ConsoleRepairAtlas-Setup-v<version>.exe` (installer).

## Versioning

Semantic versioning: the middle number goes up for new features, the last number for fixes. Every release gets a change-log entry and a commit on `main`; the current installer lives in `download/` and superseded builds move to `previous-versions/`.
