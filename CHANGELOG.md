# Console Repair Atlas — Changelog

## v1.3.0 — 2026-11-01 — Windows installer
- **New:** Windows installer (ConsoleRepairAtlas-Setup-v1.3.0.exe). It asks whether you want a desktop icon and a Start menu shortcut, lets you choose the install folder, and offers to launch the app when it finishes.
- **New:** Installs for your user account only, so no administrator prompt.
- **New:** Uninstall from Windows Settings › Apps. The uninstaller removes the shortcuts and asks whether to keep or delete your photos and notes.
- **New:** Installing a newer version over an older one upgrades it in place and keeps your photos and notes.
- **Improved:** Shortcuts and the Apps list use the Console Repair Atlas icon.
- **Note:** The portable zip is still available for running without installing.

## v1.2.0 — 2026-11-01 — Clickable resistors & capacitors
- **New:** Every resistor and capacitor in the Inside view is clickable, with its reference (R12, C34), value, rating, package, color bands or SMD code, what it does in that circuit, how to test it, how to replace it and where to buy it.
- **New:** Era-accurate parts: axial color-banded resistors and ceramic disc capacitors on 1980s–early-90s boards, SMD chips on later boards, radial electrolytics up to 2004 and solid polymer capacitors on modern boards.
- **New:** Recap-kit button on electrolytic capacitors.
- **New:** Resistors & capacitors section in the Parts list.
- **Fixed:** Power supply reference is now PSU1 so it no longer clashes with fuse PS1 on the PS2.
- **Note:** Resistor and capacitor values are representative for each circuit (no per-board parts lists). Each one says so — read the value on your actual part before ordering.

## v1.1.0 — 2026-11-01 — Inside the console
- **New:** Inside view: each console drawn with the top cover off — shell, circuit board, real-looking chip packages with their markings, copper traces, capacitors and red callout bubbles with a Ref / Function legend.
- **New:** Real board photo mode: import a photo of the actual board and drag a box around each part. Boxes become clickable hotspots with callouts, and the crop becomes that part's picture.
- **New:** How to replace it: difficulty, time, tools, numbered steps and safety warnings for every part, with specific procedures for common repairs (NES 72-pin connector and lockout chip, PS1 laser, PS4/PS5 HDMI port, Switch M92T36, Xbox clock capacitor, Xbox 360 X-clamps, Genesis regulator, N64 Expansion Pak).
- **New:** PS2 GH-019 board fuses F1 and PS1–PS14 with rating, SMD marking and what each protects. Pre-placed hotspots for the common 988×697 GH-019 reference photo.
- **New:** Version number in the title bar and this What's new window.
- **Improved:** Fuses appear in search and in the parts list.
- **Improved:** External AC adapters are drawn as a DC-in jack on the board.
- **Changed:** The original line schematic is still available as the “Line schematic” mode.

## v1.0.0 — 2026-11-01 — First release
- **New:** 24 consoles from the NES (1985) to the Steam Machine (2026), 297 components.
- **New:** Interactive block diagram, simplified schematic and parts list for each console.
- **New:** Part details: illustration, part number, what it does, repair notes, connections.
- **New:** Replacement-part search buttons (eBay, AliExpress, Amazon, Mouser, Digi-Key, iFixit, Console5, Stone Age Gamer, Hand Held Legend).
- **New:** Search across all consoles (Ctrl+K), your own part photos and notes.
- **Fixed:** Corrected the original Xbox DVD-drive repair note.
