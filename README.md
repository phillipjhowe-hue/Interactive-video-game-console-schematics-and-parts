# Console Repair Atlas

Interactive Windows app with block diagrams, board views, part numbers, repair steps and replacement-part sources for video game consoles, from the Nintendo Entertainment System (1985) to the Valve Steam Machine (2026).

## Download

Get the latest Windows build from **[Releases](../../releases)**: download `ConsoleRepairAtlas-vX.Y.Z-win64.zip`, unzip the whole folder and run `Console Repair Atlas.exe`. Windows 10/11 64-bit, nothing to install. The exe isn't code-signed, so SmartScreen may ask you to click **More info → Run anyway**.

## Features

- 24 consoles, 297 components: NES, Master System, TurboGrafx-16, Genesis, SNES, Saturn, PlayStation, N64, Dreamcast, PS2, Xbox, GameCube, Xbox 360, PS3, Wii, Wii U, PS4, Xbox One, Switch, Xbox Series X, Xbox Series S, PS5, Switch 2, Steam Machine
- Clickable block diagram, schematic and parts list for every console
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
| `CHANGELOG.md` | Version history. |

## Running from source

```bash
python3 tools/data.py          # regenerate app/data.js
npx electron app               # run with Electron
```

Opening `app/index.html` in a browser also works for the UI; photo storage then falls back to browser storage.

## Building the Windows zip

Download the Electron Windows x64 release zip, unzip it into `build_base/`, put the contents of `app/` into `resources/app/`, and rename `electron.exe` to `Console Repair Atlas.exe`.
