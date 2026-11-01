// Version history. Newest first. The top entry is the current version.
window.ATLAS_CHANGELOG = [
  {
    version: "1.1.0", date: "2026-11-01", title: "Inside the console",
    changes: [
      ["New", "Inside view: each console drawn with the top cover off — shell, circuit board, real-looking chip packages with their markings, copper traces, capacitors and red callout bubbles with a Ref / Function legend."],
      ["New", "Real board photo mode: import a photo of the actual board and drag a box around each part. Boxes become clickable hotspots with callouts, and the crop becomes that part's picture."],
      ["New", "How to replace it: difficulty, time, tools, numbered steps and safety warnings for every part, with specific procedures for common repairs (NES 72-pin connector and lockout chip, PS1 laser, PS4/PS5 HDMI port, Switch M92T36, Xbox clock capacitor, Xbox 360 X-clamps, Genesis regulator, N64 Expansion Pak)."],
      ["New", "PS2 GH-019 board fuses F1 and PS1–PS14 with rating, SMD marking and what each protects. Pre-placed hotspots for the common 988×697 GH-019 reference photo."],
      ["New", "Version number in the title bar and this What's new window."],
      ["Improved", "Fuses appear in search and in the parts list."],
      ["Improved", "External AC adapters are drawn as a DC-in jack on the board."],
      ["Changed", "The original line schematic is still available as the “Line schematic” mode."]
    ]
  },
  {
    version: "1.0.0", date: "2026-11-01", title: "First release",
    changes: [
      ["New", "24 consoles from the NES (1985) to the Steam Machine (2026), 297 components."],
      ["New", "Interactive block diagram, simplified schematic and parts list for each console."],
      ["New", "Part details: illustration, part number, what it does, repair notes, connections."],
      ["New", "Replacement-part search buttons (eBay, AliExpress, Amazon, Mouser, Digi-Key, iFixit, Console5, Stone Age Gamer, Hand Held Legend)."],
      ["New", "Search across all consoles (Ctrl+K), your own part photos and notes."],
      ["Fixed", "Corrected the original Xbox DVD-drive repair note."]
    ]
  }
];
window.ATLAS_VERSION = window.ATLAS_CHANGELOG[0].version;
