CONSOLE REPAIR ATLAS  v1.1.0
(See CHANGELOG.txt or click the version number next to the app title for what changed.)
==========================

Interactive repair reference for 24 home consoles, from the Nintendo Entertainment
System (1985) to the Valve Steam Machine (2026).

RUN IT
  1. Unzip the whole folder anywhere (e.g. Documents\Console Repair Atlas).
  2. Double-click "Console Repair Atlas.exe".
     Windows 10/11, 64-bit. Nothing to install.
     If SmartScreen warns about an unrecognized app (the exe is not code-signed),
     click "More info" -> "Run anyway".
  Tip: right-click the exe -> "Send to" -> "Desktop (create shortcut)".

USING IT
  - Pick a console on the left (filter by maker at the top).
  - Block diagram tab: click any component. Its connections light up and the right
    panel shows an image of the part, the part number, what it does, repair notes
    and buttons that search replacement-part sellers.
  - Schematic / inside view tab has three modes:
      Inside view       - the open console: shell, circuit board, real-looking chips,
                          copper traces, capacitors, red callout bubbles and a
                          Ref/Function legend (like a repair-forum board photo).
      Real board photo  - import a photo of the actual board (yours, or a reference
                          picture), then "Place hotspots": pick a part in the list
                          and drag a box around it. Every box becomes clickable,
                          gets a red callout, and its crop becomes that part's
                          picture in the side panel.
      Line schematic    - simplified wiring drawing with U1/J1/Y1 references.
  - Every part shows "How to replace it": difficulty, time, tools, numbered steps
    and safety warnings, plus a link to replacement videos.
  - PS2: the 15 board fuses (F1, PS1-PS14 on the GH-019 board) are included with
    rating, SMD marking and what each protects. If you import the common 988x697
    GH-019 fuse reference photo, the fuse hotspots are pre-placed.
  - Parts list tab: every component in a table.
  - Search bar (Ctrl+K): finds a part across all consoles, e.g. "7805", "laser",
    "HDMI", "CIC", "M92T36".
  - Scroll to zoom, drag to pan, "Fit" to reset.
  - "Add your photo": attach a real photo of a part from your own bench. Photos are
    stored in %APPDATA%\Console Repair Atlas\photos.
  - "Your notes": per-part notes saved on this PC.

ABOUT THE DATA
  - Part numbers marked with a yellow warning vary by board revision. Check the
    marking on your chip or the label on your part before ordering.
  - Component pictures are drawn illustrations of each part's package with its
    marking, not photographs. Use "Photos of this part" for real photos, or add
    your own.
  - The schematics are simplified functional drawings that show how the major parts
    connect. They are not the manufacturer's service schematics. "Find full
    schematics" searches the web for those.
  - Seller buttons open a live search on eBay, AliExpress, Amazon, Mouser, Digi-Key,
    iFixit, Console5, Stone Age Gamer or Hand Held Legend, depending on the part.

ADDING CONSOLES OR PARTS
  The database is resources\app\data.js (plain JSON). Edit it in a text editor and
  restart the app. Each component has: id, name, pn (part number), cat (category),
  pkg (package), x/y (grid position), use, notes, q (shop search text), src
  (std / custom / mech), verify (true/false). Links connect components by id.
