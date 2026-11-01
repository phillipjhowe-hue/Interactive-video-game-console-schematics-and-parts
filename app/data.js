// Console Repair Atlas database. Edit and restart the app to add consoles or parts.
window.ATLAS_DATA = [
 {
  "id": "nes",
  "name": "Nintendo Entertainment System",
  "maker": "Nintendo",
  "year": 1985,
  "short": "NES",
  "board": "NES-CPU-07 / -11 (front loader, NTSC)",
  "summary": "8-bit 6502-derived console. Most failures are mechanical: the 72-pin cartridge connector, the 10NES lockout chip and aging power parts.",
  "comps": [
   {
    "id": "ctrl",
    "name": "Controller ports",
    "pn": "NES-004 controller, 7-pin port",
    "cat": "io",
    "pkg": "port",
    "x": 0,
    "y": 0,
    "use": "Two 7-pin controller ports feeding serial shift-register data from the gamepads.",
    "notes": "Loose ports cause intermittent input. Replacement port assemblies are cheap.",
    "q": "NES controller port replacement",
    "src": "mech",
    "verify": false
   },
   {
    "id": "buf",
    "name": "Controller buffers",
    "pn": "74HC368 (×2)",
    "cat": "io",
    "pkg": "dip",
    "x": 1,
    "y": 0,
    "use": "Hex inverting tri-state buffers that place controller data on the CPU data bus when $4016/$4017 is read.",
    "notes": "Fails after ESD/hot-plugging; symptoms are dead or erratic controller input.",
    "q": "74HC368",
    "src": "std",
    "verify": false
   },
   {
    "id": "cart",
    "name": "72-pin cartridge connector",
    "pn": "NES 72-pin connector",
    "cat": "media",
    "pkg": "edge",
    "x": 2,
    "y": 0,
    "use": "Edge connector that joins the cartridge's PRG/CHR ROM to the CPU and PPU buses.",
    "notes": "#1 NES failure: the 'blinking red light'. Clean, re-bend (boil) pins, or replace with a new 72-pin connector.",
    "q": "NES 72 pin connector",
    "src": "mech",
    "verify": false
   },
   {
    "id": "psu",
    "name": "AC adapter",
    "pn": "NES-002 (9 V AC, 1.3 A)",
    "cat": "power",
    "pkg": "psu",
    "x": 4,
    "y": 0,
    "use": "External transformer. The NES rectifies the 9 V AC on-board before regulation.",
    "notes": "Any 9 V DC adapter also works because of the on-board bridge rectifier (polarity agnostic).",
    "q": "NES-002 AC adapter",
    "src": "mech",
    "verify": false
   },
   {
    "id": "cic",
    "name": "Lockout chip (10NES)",
    "pn": "Nintendo 3193A (NTSC) / 3195A (PAL)",
    "cat": "security",
    "pkg": "dip",
    "x": 0,
    "y": 1,
    "use": "Region/authenticity lockout. Handshakes with the matching chip in each cartridge and resets the console on mismatch.",
    "notes": "Lifting pin 4 disables it and cures many blinking problems on worn connectors.",
    "q": "NES 3193A CIC",
    "src": "custom",
    "verify": false
   },
   {
    "id": "cpu",
    "name": "CPU + APU",
    "pn": "Ricoh RP2A03 (NTSC) / RP2A07 (PAL)",
    "cat": "cpu",
    "pkg": "dip",
    "x": 1,
    "y": 1,
    "use": "MOS 6502 core (no decimal mode) at 1.79 MHz with on-chip audio: 2 pulse, triangle, noise and DPCM channels.",
    "notes": "Very robust. Dead CPU is rare; check the reset and clock lines first.",
    "q": "RP2A03",
    "src": "custom",
    "verify": false
   },
   {
    "id": "xtal",
    "name": "Master clock crystal",
    "pn": "21.477272 MHz (NTSC) / 26.601712 MHz (PAL)",
    "cat": "clock",
    "pkg": "crystal",
    "x": 2,
    "y": 1,
    "use": "Master oscillator: divided by 12 for the CPU and by 4 for the PPU.",
    "notes": "A cracked crystal gives a black screen with no sound.",
    "q": "21.47727 MHz crystal HC-49",
    "src": "std",
    "verify": false
   },
   {
    "id": "ppu",
    "name": "Picture Processing Unit",
    "pn": "Ricoh RP2C02 (NTSC) / RP2C07 (PAL)",
    "cat": "gpu",
    "pkg": "dip",
    "x": 3,
    "y": 1,
    "use": "Tile/sprite video processor: 256×240, 64 sprites, 25 on-screen colors. Outputs composite video directly.",
    "notes": "Garbled graphics usually come from VRAM, the 74LS373 latch or the connector before the PPU.",
    "q": "RP2C02",
    "src": "custom",
    "verify": false
   },
   {
    "id": "reg",
    "name": "5 V regulator",
    "pn": "7805 (LM7805 / L7805CV)",
    "cat": "power",
    "pkg": "to220",
    "x": 4,
    "y": 1,
    "use": "Linear regulator that produces the 5 V rail from the rectified adapter input.",
    "notes": "Runs hot. A drop-in switching regulator (7805-pinout) runs cooler.",
    "q": "L7805CV",
    "src": "std",
    "verify": false
   },
   {
    "id": "wram",
    "name": "Work RAM (2 KB)",
    "pn": "2K×8 SRAM (LH5116 / µPD4016 / 6116)",
    "cat": "mem",
    "pkg": "dip",
    "x": 1,
    "y": 2,
    "use": "CPU work RAM mapped at $0000-$07FF (mirrored to $1FFF).",
    "notes": "Bad WRAM causes freezes, grey screens or corrupted game logic.",
    "q": "6116 SRAM DIP-24",
    "src": "std",
    "verify": false
   },
   {
    "id": "dec",
    "name": "Address decoder",
    "pn": "74HC139 / 74LS139",
    "cat": "io",
    "pkg": "dip",
    "x": 2,
    "y": 2,
    "use": "Dual 2-to-4 decoder that generates chip-selects for WRAM, the PPU and cartridge PRG ROM.",
    "notes": "",
    "q": "74HC139",
    "src": "std",
    "verify": false
   },
   {
    "id": "latch",
    "name": "PPU address latch",
    "pn": "74HC373 / 74LS373",
    "cat": "io",
    "pkg": "dip",
    "x": 3,
    "y": 2,
    "use": "Latches the low 8 bits of the PPU's multiplexed address/data bus for VRAM and CHR ROM.",
    "notes": "A failing latch produces scrambled tiles across all games.",
    "q": "74HC373",
    "src": "std",
    "verify": false
   },
   {
    "id": "rf",
    "name": "RF modulator / AV out",
    "pn": "RF modulator (ch. 3/4) + composite RCA",
    "cat": "video",
    "pkg": "module",
    "x": 4,
    "y": 2,
    "use": "Converts composite video and mono audio to an RF TV signal; also provides RCA composite and audio out.",
    "notes": "RCA jacks crack from strain. NESRGB-style mods tap the PPU for RGB.",
    "q": "NES RF modulator",
    "src": "mech",
    "verify": false
   },
   {
    "id": "vram",
    "name": "Video RAM (2 KB)",
    "pn": "2K×8 SRAM (LH5116 / 6116)",
    "cat": "mem",
    "pkg": "dip",
    "x": 3,
    "y": 3,
    "use": "Nametable RAM for the PPU. Cartridges can remap it for mirroring modes.",
    "notes": "",
    "q": "6116 SRAM DIP-24",
    "src": "std",
    "verify": false
   }
  ],
  "links": [
   {
    "a": "ctrl",
    "b": "buf",
    "label": "serial pad data"
   },
   {
    "a": "buf",
    "b": "cpu",
    "label": "$4016/$4017"
   },
   {
    "a": "cart",
    "b": "cpu",
    "label": "PRG bus A0-A15 / D0-D7"
   },
   {
    "a": "cart",
    "b": "ppu",
    "label": "CHR bus"
   },
   {
    "a": "cic",
    "b": "cart",
    "label": "lockout handshake"
   },
   {
    "a": "xtal",
    "b": "cpu",
    "label": "÷12"
   },
   {
    "a": "xtal",
    "b": "ppu",
    "label": "÷4"
   },
   {
    "a": "cpu",
    "b": "wram",
    "label": "D0-D7"
   },
   {
    "a": "cpu",
    "b": "dec",
    "label": "A13-A15"
   },
   {
    "a": "dec",
    "b": "wram",
    "label": "/CE"
   },
   {
    "a": "dec",
    "b": "ppu",
    "label": "/CS"
   },
   {
    "a": "ppu",
    "b": "latch",
    "label": "AD0-AD7"
   },
   {
    "a": "latch",
    "b": "vram",
    "label": "A0-A7"
   },
   {
    "a": "psu",
    "b": "reg",
    "label": "9 V"
   },
   {
    "a": "ppu",
    "b": "rf",
    "label": "composite"
   },
   {
    "a": "cpu",
    "b": "rf",
    "label": "audio"
   }
  ]
 },
 {
  "id": "sms",
  "name": "Sega Master System",
  "maker": "Sega",
  "year": 1986,
  "short": "Master System",
  "board": "Model 1 (171-5xxx), NTSC",
  "summary": "Z80-based 8-bit console with a TMS9918-derived VDP. Built-in BIOS/game, cartridge and card slots.",
  "comps": [
   {
    "id": "pad",
    "name": "Controller ports",
    "pn": "DE-9 controller ports",
    "cat": "io",
    "pkg": "port",
    "x": 0,
    "y": 0,
    "use": "Two DE-9 ports for Sega pads (same pinout family as Genesis/Atari).",
    "notes": "",
    "q": "Sega Master System controller port",
    "src": "mech",
    "verify": false
   },
   {
    "id": "cart",
    "name": "Cartridge slot",
    "pn": "50-pin cartridge connector",
    "cat": "media",
    "pkg": "edge",
    "x": 2,
    "y": 0,
    "use": "Connects game ROM (and mapper) to the Z80 bus.",
    "notes": "Clean with isopropyl; dirty slot gives a black screen.",
    "q": "Sega Master System cartridge slot",
    "src": "mech",
    "verify": false
   },
   {
    "id": "card",
    "name": "Sega Card slot",
    "pn": "Sega Card connector",
    "cat": "media",
    "pkg": "edge",
    "x": 3,
    "y": 0,
    "use": "Slot for thin 'My Card' games (32 KB).",
    "notes": "",
    "q": "Sega Master System card slot",
    "src": "mech",
    "verify": false
   },
   {
    "id": "psu",
    "name": "AC adapter",
    "pn": "9 V DC, center-negative (Genesis Model 1 compatible)",
    "cat": "power",
    "pkg": "psu",
    "x": 4,
    "y": 0,
    "use": "External DC adapter.",
    "notes": "Center-NEGATIVE: wrong polarity can damage the console.",
    "q": "Sega Master System power adapter",
    "src": "mech",
    "verify": false
   },
   {
    "id": "cpu",
    "name": "CPU",
    "pn": "Zilog Z80A (Z0840004PSC)",
    "cat": "cpu",
    "pkg": "dip",
    "x": 1,
    "y": 1,
    "use": "8-bit CPU at 3.58 MHz running games and the BIOS.",
    "notes": "Standard part; new Z84C00 CMOS chips are drop-in.",
    "q": "Z84C0004PEC",
    "src": "std",
    "verify": false
   },
   {
    "id": "xtal",
    "name": "Master clock",
    "pn": "53.693175 MHz crystal (NTSC)",
    "cat": "clock",
    "pkg": "crystal",
    "x": 2,
    "y": 1,
    "use": "Master clock divided down for the VDP and Z80 (÷15 = 3.58 MHz).",
    "notes": "",
    "q": "53.693175 MHz crystal",
    "src": "std",
    "verify": false
   },
   {
    "id": "vdp",
    "name": "VDP + PSG",
    "pn": "Sega 315-5124 (Model 1) / 315-5246 (Model 2)",
    "cat": "gpu",
    "pkg": "dip",
    "x": 3,
    "y": 1,
    "use": "Video display processor (tiles, 64 sprites, 32 colors) with built-in SN76489 sound (3 square + noise).",
    "notes": "",
    "q": "Sega 315-5124",
    "src": "custom",
    "verify": false
   },
   {
    "id": "reg",
    "name": "5 V regulator",
    "pn": "7805",
    "cat": "power",
    "pkg": "to220",
    "x": 4,
    "y": 1,
    "use": "Regulates 9 V input to 5 V.",
    "notes": "",
    "q": "L7805CV",
    "src": "std",
    "verify": false
   },
   {
    "id": "bios",
    "name": "BIOS ROM",
    "pn": "Mask ROM (BIOS / built-in game)",
    "cat": "storage",
    "pkg": "dip",
    "x": 0,
    "y": 2,
    "use": "Boot ROM; on later units includes a built-in game (Hang-On, Alex Kidd, etc.).",
    "notes": "",
    "q": "Sega Master System BIOS ROM",
    "src": "custom",
    "verify": false
   },
   {
    "id": "ram",
    "name": "Work RAM (8 KB)",
    "pn": "8K×8 SRAM (6264-type)",
    "cat": "mem",
    "pkg": "dip",
    "x": 1,
    "y": 2,
    "use": "Z80 system RAM.",
    "notes": "",
    "q": "6264 SRAM DIP-28",
    "src": "std",
    "verify": false
   },
   {
    "id": "vram",
    "name": "Video RAM (16 KB)",
    "pn": "16 KB DRAM (2× 16K×4, e.g. µPD41416)",
    "cat": "mem",
    "pkg": "dip",
    "x": 3,
    "y": 2,
    "use": "Tile, sprite and nametable storage for the VDP.",
    "notes": "",
    "q": "uPD41416",
    "src": "custom",
    "verify": true
   },
   {
    "id": "av",
    "name": "RF / AV output",
    "pn": "RF modulator + 8-pin DIN AV",
    "cat": "video",
    "pkg": "module",
    "x": 4,
    "y": 2,
    "use": "RF out plus AV port carrying composite, RGB and audio (Model 1).",
    "notes": "Model 1 AV port gives RGB with the right SCART cable.",
    "q": "Sega Master System AV cable",
    "src": "mech",
    "verify": false
   }
  ],
  "links": [
   {
    "a": "pad",
    "b": "cpu",
    "label": "I/O ports $DC/$DD"
   },
   {
    "a": "cart",
    "b": "cpu",
    "label": "Z80 bus"
   },
   {
    "a": "card",
    "b": "cpu",
    "label": "Z80 bus"
   },
   {
    "a": "bios",
    "b": "cpu",
    "label": "boot"
   },
   {
    "a": "xtal",
    "b": "cpu",
    "label": "÷15"
   },
   {
    "a": "xtal",
    "b": "vdp",
    "label": "clock"
   },
   {
    "a": "cpu",
    "b": "vdp",
    "label": "I/O $BE/$BF"
   },
   {
    "a": "cpu",
    "b": "ram",
    "label": "D0-D7"
   },
   {
    "a": "vdp",
    "b": "vram",
    "label": "VRAM bus"
   },
   {
    "a": "psu",
    "b": "reg",
    "label": "9 V"
   },
   {
    "a": "vdp",
    "b": "av",
    "label": "video + audio"
   }
  ]
 },
 {
  "id": "tg16",
  "name": "TurboGrafx-16 / PC Engine",
  "maker": "NEC / Hudson",
  "year": 1989,
  "short": "TurboGrafx-16",
  "board": "TurboGrafx-16 (NTSC-US)",
  "summary": "8-bit CPU with a 16-bit graphics chipset by Hudson Soft. Games on HuCards; CD-ROM² via the expansion port.",
  "comps": [
   {
    "id": "pad",
    "name": "Controller port",
    "pn": "8-pin DIN controller port",
    "cat": "io",
    "pkg": "port",
    "x": 0,
    "y": 0,
    "use": "Single pad port (TurboTap for 5 players).",
    "notes": "",
    "q": "TurboGrafx-16 controller port",
    "src": "mech",
    "verify": false
   },
   {
    "id": "hucard",
    "name": "HuCard slot",
    "pn": "38-pin HuCard connector",
    "cat": "media",
    "pkg": "edge",
    "x": 2,
    "y": 0,
    "use": "Credit-card-sized ROM card slot.",
    "notes": "Bent/dirty contacts cause boot failures.",
    "q": "TurboGrafx HuCard slot",
    "src": "mech",
    "verify": false
   },
   {
    "id": "exp",
    "name": "Expansion port",
    "pn": "Rear expansion bus (CD-ROM², TurboBooster)",
    "cat": "io",
    "pkg": "edge",
    "x": 3,
    "y": 0,
    "use": "Full bus edge connector for the CD-ROM² unit and AV booster.",
    "notes": "",
    "q": "TurboGrafx expansion port",
    "src": "mech",
    "verify": false
   },
   {
    "id": "psu",
    "name": "AC adapter",
    "pn": "9 V DC (TurboGrafx-16 AC adapter)",
    "cat": "power",
    "pkg": "psu",
    "x": 4,
    "y": 0,
    "use": "External DC adapter.",
    "notes": "",
    "q": "TurboGrafx-16 AC adapter",
    "src": "mech",
    "verify": false
   },
   {
    "id": "cpu",
    "name": "CPU + PSG",
    "pn": "Hudson HuC6280",
    "cat": "cpu",
    "pkg": "qfp",
    "x": 1,
    "y": 1,
    "use": "65C02-based CPU at 7.16 MHz with MMU, timer, I/O port and 6-channel wavetable sound.",
    "notes": "",
    "q": "HuC6280",
    "src": "custom",
    "verify": false
   },
   {
    "id": "xtal",
    "name": "Master clock",
    "pn": "21.47727 MHz",
    "cat": "clock",
    "pkg": "crystal",
    "x": 2,
    "y": 1,
    "use": "Master oscillator (÷3 for the CPU).",
    "notes": "",
    "q": "21.47727 MHz crystal HC-49",
    "src": "std",
    "verify": false
   },
   {
    "id": "vdc",
    "name": "Video Display Controller",
    "pn": "Hudson HuC6270",
    "cat": "gpu",
    "pkg": "qfp",
    "x": 3,
    "y": 1,
    "use": "Tile and sprite engine (64 sprites, scrolling).",
    "notes": "",
    "q": "HuC6270",
    "src": "custom",
    "verify": false
   },
   {
    "id": "reg",
    "name": "5 V regulator",
    "pn": "7805",
    "cat": "power",
    "pkg": "to220",
    "x": 4,
    "y": 1,
    "use": "5 V rail.",
    "notes": "",
    "q": "L7805CV",
    "src": "std",
    "verify": false
   },
   {
    "id": "ram",
    "name": "Work RAM (8 KB)",
    "pn": "8K×8 SRAM",
    "cat": "mem",
    "pkg": "sop",
    "x": 1,
    "y": 2,
    "use": "CPU RAM.",
    "notes": "",
    "q": "6264 SRAM",
    "src": "std",
    "verify": false
   },
   {
    "id": "vce",
    "name": "Video Color Encoder",
    "pn": "Hudson HuC6260",
    "cat": "video",
    "pkg": "qfp",
    "x": 2,
    "y": 2,
    "use": "Palette (512 colors) and sync/timing generation; outputs to the encoder.",
    "notes": "",
    "q": "HuC6260",
    "src": "custom",
    "verify": false
   },
   {
    "id": "vram",
    "name": "Video RAM (64 KB)",
    "pn": "64 KB SRAM",
    "cat": "mem",
    "pkg": "sop",
    "x": 3,
    "y": 2,
    "use": "VDC tile/sprite memory.",
    "notes": "",
    "q": "TurboGrafx VRAM",
    "src": "custom",
    "verify": true
   },
   {
    "id": "rf",
    "name": "RF modulator",
    "pn": "RF modulator (US TG-16)",
    "cat": "video",
    "pkg": "module",
    "x": 4,
    "y": 2,
    "use": "US model outputs RF only; AV needs the TurboBooster.",
    "notes": "",
    "q": "TurboGrafx RF modulator",
    "src": "mech",
    "verify": false
   }
  ],
  "links": [
   {
    "a": "pad",
    "b": "cpu",
    "label": "I/O port"
   },
   {
    "a": "hucard",
    "b": "cpu",
    "label": "CPU bus"
   },
   {
    "a": "exp",
    "b": "cpu",
    "label": "CPU bus"
   },
   {
    "a": "xtal",
    "b": "cpu",
    "label": "÷3"
   },
   {
    "a": "xtal",
    "b": "vce",
    "label": "clock"
   },
   {
    "a": "cpu",
    "b": "ram",
    "label": "D0-D7"
   },
   {
    "a": "cpu",
    "b": "vdc",
    "label": "VDC regs"
   },
   {
    "a": "vdc",
    "b": "vram",
    "label": "16-bit VRAM bus"
   },
   {
    "a": "vdc",
    "b": "vce",
    "label": "pixel bus"
   },
   {
    "a": "psu",
    "b": "reg",
    "label": "9 V"
   },
   {
    "a": "vce",
    "b": "rf",
    "label": "video"
   },
   {
    "a": "cpu",
    "b": "rf",
    "label": "audio"
   }
  ]
 },
 {
  "id": "genesis",
  "name": "Sega Genesis / Mega Drive",
  "maker": "Sega",
  "year": 1989,
  "short": "Genesis",
  "board": "Model 1 (VA0–VA6), NTSC",
  "summary": "16-bit 68000 console with a Z80 sound co-processor, Yamaha YM2612 FM and SN76489 PSG.",
  "comps": [
   {
    "id": "pad",
    "name": "Controller ports",
    "pn": "DE-9 ×2",
    "cat": "io",
    "pkg": "port",
    "x": 0,
    "y": 0,
    "use": "Two DE-9 pad ports (3/6-button).",
    "notes": "",
    "q": "Sega Genesis controller port",
    "src": "mech",
    "verify": false
   },
   {
    "id": "cart",
    "name": "Cartridge slot",
    "pn": "64-pin edge connector (2×32)",
    "cat": "media",
    "pkg": "edge",
    "x": 2,
    "y": 0,
    "use": "Connects cartridge ROM to the 68000 bus; also accepts Power Base Converter.",
    "notes": "Common cause of black screen / 'Producer' lockout errors.",
    "q": "Sega Genesis cartridge slot",
    "src": "mech",
    "verify": false
   },
   {
    "id": "exp",
    "name": "Expansion port",
    "pn": "Side expansion connector",
    "cat": "io",
    "pkg": "edge",
    "x": 3,
    "y": 0,
    "use": "Bus connector for the Sega CD.",
    "notes": "",
    "q": "Sega Genesis expansion port",
    "src": "mech",
    "verify": false
   },
   {
    "id": "psu",
    "name": "AC adapter",
    "pn": "MK-1602 (9 V DC 1.2 A, center-negative)",
    "cat": "power",
    "pkg": "psu",
    "x": 4,
    "y": 0,
    "use": "External adapter for Model 1.",
    "notes": "Model 2 uses 10 V; Model 3 uses 9 V. Center-negative.",
    "q": "Sega Genesis MK-1602 adapter",
    "src": "mech",
    "verify": false
   },
   {
    "id": "m68k",
    "name": "Main CPU",
    "pn": "Motorola MC68000P8 / Hitachi HD68HC000",
    "cat": "cpu",
    "pkg": "dip",
    "x": 1,
    "y": 1,
    "use": "16/32-bit CPU at 7.67 MHz running game logic.",
    "notes": "",
    "q": "MC68000P8",
    "src": "std",
    "verify": false
   },
   {
    "id": "xtal",
    "name": "Master clock",
    "pn": "53.693175 MHz (NTSC)",
    "cat": "clock",
    "pkg": "crystal",
    "x": 2,
    "y": 1,
    "use": "÷7 for the 68000, ÷15 for the Z80.",
    "notes": "",
    "q": "53.693175 MHz crystal",
    "src": "std",
    "verify": false
   },
   {
    "id": "vdp",
    "name": "VDP + PSG",
    "pn": "Yamaha YM7101 (Sega 315-5313)",
    "cat": "gpu",
    "pkg": "qfp",
    "x": 3,
    "y": 1,
    "use": "Video processor: 2 scroll planes, 80 sprites, 64 colors from 512, with integrated SN76489 PSG and DMA.",
    "notes": "",
    "q": "YM7101 315-5313",
    "src": "custom",
    "verify": false
   },
   {
    "id": "reg",
    "name": "5 V regulator",
    "pn": "7805",
    "cat": "power",
    "pkg": "to220",
    "x": 4,
    "y": 1,
    "use": "5 V rail (heatsinked).",
    "notes": "Recapping Model 1 boards improves audio and stability.",
    "q": "L7805CV",
    "src": "std",
    "verify": false
   },
   {
    "id": "z80",
    "name": "Sound CPU",
    "pn": "Zilog Z80 (Z8400A / Z84C00)",
    "cat": "audio",
    "pkg": "dip",
    "x": 0,
    "y": 2,
    "use": "3.58 MHz co-processor that drives the YM2612; also the CPU in Master System mode.",
    "notes": "",
    "q": "Z84C0004PEC",
    "src": "std",
    "verify": false
   },
   {
    "id": "ram",
    "name": "68000 RAM (64 KB)",
    "pn": "64 KB SRAM (2× 32K×8)",
    "cat": "mem",
    "pkg": "dip",
    "x": 1,
    "y": 2,
    "use": "Main CPU work RAM.",
    "notes": "",
    "q": "62256 SRAM",
    "src": "std",
    "verify": false
   },
   {
    "id": "ym",
    "name": "FM synthesizer",
    "pn": "Yamaha YM2612",
    "cat": "audio",
    "pkg": "dip",
    "x": 2,
    "y": 2,
    "use": "6-channel FM synth with built-in DAC (one channel can play PCM).",
    "notes": "",
    "q": "YM2612",
    "src": "custom",
    "verify": false
   },
   {
    "id": "vram",
    "name": "Video RAM (64 KB)",
    "pn": "64 KB dual-port VRAM (2 chips)",
    "cat": "mem",
    "pkg": "dip",
    "x": 3,
    "y": 2,
    "use": "Tile and sprite storage for the VDP.",
    "notes": "",
    "q": "Sega Genesis VRAM",
    "src": "custom",
    "verify": true
   },
   {
    "id": "enc",
    "name": "RGB encoder",
    "pn": "Sony CXA1145",
    "cat": "video",
    "pkg": "dip",
    "x": 4,
    "y": 2,
    "use": "Converts RGB to composite/RF and buffers RGB to the AV port.",
    "notes": "",
    "q": "CXA1145",
    "src": "custom",
    "verify": false
   },
   {
    "id": "zram",
    "name": "Z80 RAM (8 KB)",
    "pn": "8K×8 SRAM",
    "cat": "mem",
    "pkg": "dip",
    "x": 0,
    "y": 3,
    "use": "Sound driver RAM.",
    "notes": "",
    "q": "6264 SRAM",
    "src": "std",
    "verify": false
   }
  ],
  "links": [
   {
    "a": "pad",
    "b": "m68k",
    "label": "I/O"
   },
   {
    "a": "cart",
    "b": "m68k",
    "label": "68K bus"
   },
   {
    "a": "exp",
    "b": "m68k",
    "label": "68K bus"
   },
   {
    "a": "xtal",
    "b": "m68k",
    "label": "÷7"
   },
   {
    "a": "xtal",
    "b": "z80",
    "label": "÷15"
   },
   {
    "a": "xtal",
    "b": "vdp",
    "label": "clock"
   },
   {
    "a": "m68k",
    "b": "vdp",
    "label": "VDP port / DMA"
   },
   {
    "a": "m68k",
    "b": "ram",
    "label": "D0-D15"
   },
   {
    "a": "vdp",
    "b": "vram",
    "label": "VRAM bus"
   },
   {
    "a": "z80",
    "b": "ym",
    "label": "FM regs"
   },
   {
    "a": "z80",
    "b": "zram",
    "label": "Z80 bus"
   },
   {
    "a": "m68k",
    "b": "z80",
    "label": "bus arbiter"
   },
   {
    "a": "vdp",
    "b": "enc",
    "label": "RGB"
   },
   {
    "a": "ym",
    "b": "enc",
    "label": "audio mix"
   },
   {
    "a": "psu",
    "b": "reg",
    "label": "9 V"
   }
  ]
 },
 {
  "id": "snes",
  "name": "Super Nintendo Entertainment System",
  "maker": "Nintendo",
  "year": 1991,
  "short": "SNES",
  "board": "SHVC-CPU-01 (and 1-CHIP-01 later), NTSC",
  "summary": "16-bit 65C816 console with two-chip PPU (Mode 7) and a separate Sony audio subsystem.",
  "comps": [
   {
    "id": "pad",
    "name": "Controller ports",
    "pn": "7-pin SNES ports",
    "cat": "io",
    "pkg": "port",
    "x": 0,
    "y": 0,
    "use": "Two serial pad ports.",
    "notes": "",
    "q": "SNES controller port",
    "src": "mech",
    "verify": false
   },
   {
    "id": "cart",
    "name": "Cartridge slot",
    "pn": "62-pin cartridge connector",
    "cat": "media",
    "pkg": "edge",
    "x": 2,
    "y": 0,
    "use": "Game ROM/SRAM and enhancement chips (Super FX, SA-1) connect here.",
    "notes": "Clean and replace if worn.",
    "q": "SNES cartridge slot 62 pin",
    "src": "mech",
    "verify": false
   },
   {
    "id": "psu",
    "name": "AC adapter",
    "pn": "SNS-002 (10 V DC 850 mA)",
    "cat": "power",
    "pkg": "psu",
    "x": 4,
    "y": 0,
    "use": "External DC adapter.",
    "notes": "",
    "q": "SNES SNS-002 adapter",
    "src": "mech",
    "verify": false
   },
   {
    "id": "cic",
    "name": "Lockout chip",
    "pn": "Nintendo F411 (NTSC) / F413 (PAL)",
    "cat": "security",
    "pkg": "dip",
    "x": 0,
    "y": 1,
    "use": "Region/authenticity lockout paired with the cartridge CIC.",
    "notes": "",
    "q": "SNES F411 CIC",
    "src": "custom",
    "verify": false
   },
   {
    "id": "cpu",
    "name": "CPU",
    "pn": "Ricoh 5A22 (S-CPU)",
    "cat": "cpu",
    "pkg": "qfp",
    "x": 1,
    "y": 1,
    "use": "65C816 core at up to 3.58 MHz with DMA/HDMA, multiplier/divider and joypad auto-read.",
    "notes": "",
    "q": "5A22 S-CPU",
    "src": "custom",
    "verify": false
   },
   {
    "id": "xtal",
    "name": "Master clock",
    "pn": "21.47727 MHz (NTSC)",
    "cat": "clock",
    "pkg": "crystal",
    "x": 2,
    "y": 1,
    "use": "System master clock.",
    "notes": "",
    "q": "21.47727 MHz crystal HC-49",
    "src": "std",
    "verify": false
   },
   {
    "id": "ppu1",
    "name": "PPU 1",
    "pn": "S-PPU1 (5C77)",
    "cat": "gpu",
    "pkg": "qfp",
    "x": 3,
    "y": 1,
    "use": "Picture processing unit #1: backgrounds, sprites, Mode 7 math.",
    "notes": "",
    "q": "SNES S-PPU1 5C77",
    "src": "custom",
    "verify": false
   },
   {
    "id": "reg",
    "name": "5 V regulator",
    "pn": "7805",
    "cat": "power",
    "pkg": "to220",
    "x": 4,
    "y": 1,
    "use": "5 V rail.",
    "notes": "",
    "q": "L7805CV",
    "src": "std",
    "verify": false
   },
   {
    "id": "wram",
    "name": "Work RAM (128 KB)",
    "pn": "S-WRAM",
    "cat": "mem",
    "pkg": "qfp",
    "x": 1,
    "y": 2,
    "use": "128 KB DRAM work RAM with its own DMA port.",
    "notes": "",
    "q": "SNES S-WRAM",
    "src": "custom",
    "verify": false
   },
   {
    "id": "smp",
    "name": "Audio CPU",
    "pn": "S-SMP (Sony SPC700 core)",
    "cat": "audio",
    "pkg": "qfp",
    "x": 2,
    "y": 2,
    "use": "8-bit sound CPU running the audio driver; boots from a 64-byte IPL ROM.",
    "notes": "",
    "q": "SNES S-SMP",
    "src": "custom",
    "verify": false
   },
   {
    "id": "ppu2",
    "name": "PPU 2",
    "pn": "S-PPU2 (5C78)",
    "cat": "gpu",
    "pkg": "qfp",
    "x": 3,
    "y": 2,
    "use": "Picture processing unit #2: color math, windows, output.",
    "notes": "",
    "q": "SNES S-PPU2 5C78",
    "src": "custom",
    "verify": false
   },
   {
    "id": "enc",
    "name": "Video encoder",
    "pn": "S-ENC (Sony) / S-RGB on 1-CHIP",
    "cat": "video",
    "pkg": "qfp",
    "x": 4,
    "y": 2,
    "use": "Encodes RGB to composite and S-Video at the multi-out.",
    "notes": "1-CHIP boards are known for sharp RGB but some need filter mods.",
    "q": "SNES S-ENC",
    "src": "custom",
    "verify": false
   },
   {
    "id": "aram",
    "name": "Audio RAM (64 KB)",
    "pn": "2× 32K×8 SRAM",
    "cat": "mem",
    "pkg": "sop",
    "x": 1,
    "y": 3,
    "use": "Sample and program memory shared by S-SMP and S-DSP.",
    "notes": "",
    "q": "SNES audio RAM",
    "src": "std",
    "verify": false
   },
   {
    "id": "dsp",
    "name": "Audio DSP",
    "pn": "S-DSP (Sony)",
    "cat": "audio",
    "pkg": "qfp",
    "x": 2,
    "y": 3,
    "use": "8-voice ADPCM sample playback with echo and ADSR.",
    "notes": "",
    "q": "SNES S-DSP",
    "src": "custom",
    "verify": false
   },
   {
    "id": "dac",
    "name": "Audio DAC + resonator",
    "pn": "NEC µPD6376 + 24.576 MHz resonator",
    "cat": "audio",
    "pkg": "sop",
    "x": 0,
    "y": 3,
    "use": "16-bit stereo DAC. The APU's ceramic resonator drifts with age, changing music pitch slightly.",
    "notes": "",
    "q": "uPD6376",
    "src": "custom",
    "verify": false
   },
   {
    "id": "vram",
    "name": "Video RAM (64 KB)",
    "pn": "2× 32K×8 SRAM",
    "cat": "mem",
    "pkg": "sop",
    "x": 3,
    "y": 3,
    "use": "Tile, tilemap and Mode 7 data.",
    "notes": "",
    "q": "SNES VRAM",
    "src": "std",
    "verify": false
   }
  ],
  "links": [
   {
    "a": "pad",
    "b": "cpu",
    "label": "$4016/auto-read"
   },
   {
    "a": "cart",
    "b": "cpu",
    "label": "A bus / B bus"
   },
   {
    "a": "cic",
    "b": "cart",
    "label": "lockout"
   },
   {
    "a": "xtal",
    "b": "cpu",
    "label": "clock"
   },
   {
    "a": "xtal",
    "b": "ppu1",
    "label": "clock"
   },
   {
    "a": "cpu",
    "b": "wram",
    "label": "A/B bus"
   },
   {
    "a": "cpu",
    "b": "ppu1",
    "label": "B bus"
   },
   {
    "a": "ppu1",
    "b": "ppu2",
    "label": "pixel bus"
   },
   {
    "a": "ppu1",
    "b": "vram",
    "label": "VRAM (lo)"
   },
   {
    "a": "ppu2",
    "b": "vram",
    "label": "VRAM (hi)"
   },
   {
    "a": "cpu",
    "b": "smp",
    "label": "4 I/O ports"
   },
   {
    "a": "smp",
    "b": "aram",
    "label": "APU bus"
   },
   {
    "a": "dsp",
    "b": "aram",
    "label": "samples"
   },
   {
    "a": "smp",
    "b": "dsp",
    "label": "regs"
   },
   {
    "a": "dsp",
    "b": "dac",
    "label": "serial audio"
   },
   {
    "a": "ppu2",
    "b": "enc",
    "label": "RGB"
   },
   {
    "a": "psu",
    "b": "reg",
    "label": "10 V"
   }
  ]
 },
 {
  "id": "saturn",
  "name": "Sega Saturn",
  "maker": "Sega",
  "year": 1995,
  "short": "Saturn",
  "board": "Model 1 (VA0 / VA1), NTSC",
  "summary": "Dual SH-2 32-bit console with two video processors and a Yamaha sound DSP.",
  "comps": [
   {
    "id": "pad",
    "name": "Controller ports",
    "pn": "Saturn controller ports ×2",
    "cat": "io",
    "pkg": "port",
    "x": 0,
    "y": 0,
    "use": "Pad ports managed by the SMPC.",
    "notes": "",
    "q": "Sega Saturn controller port",
    "src": "mech",
    "verify": false
   },
   {
    "id": "cart",
    "name": "Cartridge slot",
    "pn": "Saturn cartridge slot",
    "cat": "media",
    "pkg": "edge",
    "x": 1,
    "y": 0,
    "use": "Backup RAM, 1 MB/4 MB RAM carts, Action Replay.",
    "notes": "",
    "q": "Sega Saturn cartridge slot",
    "src": "mech",
    "verify": false
   },
   {
    "id": "cd",
    "name": "CD-ROM drive",
    "pn": "2× CD drive (laser commonly Sanyo SF-P101N)",
    "cat": "media",
    "pkg": "drive",
    "x": 2,
    "y": 0,
    "use": "Double-speed CD-ROM drive controlled by the CD Block.",
    "notes": "Laser failure or worn sled gear; check part fits your drive revision.",
    "q": "Sega Saturn laser",
    "src": "mech",
    "verify": true
   },
   {
    "id": "psu",
    "name": "Internal PSU",
    "pn": "Saturn power supply board",
    "cat": "power",
    "pkg": "psu",
    "x": 4,
    "y": 0,
    "use": "Internal AC PSU.",
    "notes": "Region-specific voltage (US 120 V).",
    "q": "Sega Saturn power supply",
    "src": "mech",
    "verify": false
   },
   {
    "id": "smpc",
    "name": "System manager",
    "pn": "SMPC (Hitachi 4-bit MCU, Sega 315-5744)",
    "cat": "io",
    "pkg": "qfp",
    "x": 0,
    "y": 1,
    "use": "Reset/power control, real-time clock, controller polling.",
    "notes": "",
    "q": "Sega Saturn SMPC",
    "src": "custom",
    "verify": true
   },
   {
    "id": "sh2m",
    "name": "Master CPU",
    "pn": "Hitachi SH-2 (HD6417095)",
    "cat": "cpu",
    "pkg": "qfp",
    "x": 1,
    "y": 1,
    "use": "32-bit RISC at 28.6 MHz running game code.",
    "notes": "",
    "q": "HD6417095",
    "src": "custom",
    "verify": false
   },
   {
    "id": "sh2s",
    "name": "Slave CPU",
    "pn": "Hitachi SH-2 (HD6417095)",
    "cat": "cpu",
    "pkg": "qfp",
    "x": 2,
    "y": 1,
    "use": "Second SH-2 sharing the main bus.",
    "notes": "",
    "q": "HD6417095",
    "src": "custom",
    "verify": false
   },
   {
    "id": "vdp1",
    "name": "VDP1 (sprites/polygons)",
    "pn": "Sega 315-5689",
    "cat": "gpu",
    "pkg": "qfp",
    "x": 3,
    "y": 1,
    "use": "Draws sprites and quads into a framebuffer.",
    "notes": "",
    "q": "Sega Saturn VDP1",
    "src": "custom",
    "verify": false
   },
   {
    "id": "batt",
    "name": "Backup battery",
    "pn": "CR2032",
    "cat": "power",
    "pkg": "battery",
    "x": 4,
    "y": 1,
    "use": "Keeps clock and internal save RAM alive.",
    "notes": "Dead battery = 'set clock' every boot and lost saves.",
    "q": "CR2032",
    "src": "std",
    "verify": false
   },
   {
    "id": "scu",
    "name": "System Control Unit",
    "pn": "Sega 315-5688",
    "cat": "cpu",
    "pkg": "qfp",
    "x": 1,
    "y": 2,
    "use": "Bus controller with DMA and a DSP for geometry.",
    "notes": "",
    "q": "Sega Saturn SCU",
    "src": "custom",
    "verify": false
   },
   {
    "id": "wram",
    "name": "Work RAM (2 MB)",
    "pn": "1 MB SDRAM + 1 MB DRAM",
    "cat": "mem",
    "pkg": "sop",
    "x": 2,
    "y": 2,
    "use": "Main memory for the SH-2s.",
    "notes": "",
    "q": "Sega Saturn RAM",
    "src": "custom",
    "verify": true
   },
   {
    "id": "vdp2",
    "name": "VDP2 (backgrounds)",
    "pn": "Sega 315-5690",
    "cat": "gpu",
    "pkg": "qfp",
    "x": 3,
    "y": 2,
    "use": "Background planes, rotation, priority and final video output.",
    "notes": "",
    "q": "Sega Saturn VDP2",
    "src": "custom",
    "verify": false
   },
   {
    "id": "av",
    "name": "AV multi-out",
    "pn": "Saturn AV port",
    "cat": "video",
    "pkg": "port",
    "x": 4,
    "y": 2,
    "use": "Composite / S-Video / RGB output.",
    "notes": "",
    "q": "Sega Saturn AV cable",
    "src": "mech",
    "verify": false
   },
   {
    "id": "cdb",
    "name": "CD Block",
    "pn": "Hitachi SH-1 + YGR019",
    "cat": "media",
    "pkg": "qfp",
    "x": 2,
    "y": 3,
    "use": "Controls the CD drive, decoding and copy protection.",
    "notes": "",
    "q": "Sega Saturn CD block",
    "src": "custom",
    "verify": false
   },
   {
    "id": "scsp",
    "name": "Sound processor",
    "pn": "Yamaha YMF292 (SCSP) + MC68EC000",
    "cat": "audio",
    "pkg": "qfp",
    "x": 3,
    "y": 3,
    "use": "32-voice PCM/FM sound with DSP effects; 68EC000 runs the driver; 512 KB sound RAM.",
    "notes": "",
    "q": "YMF292",
    "src": "custom",
    "verify": false
   }
  ],
  "links": [
   {
    "a": "pad",
    "b": "smpc",
    "label": "polling"
   },
   {
    "a": "smpc",
    "b": "sh2m",
    "label": "reset/INT"
   },
   {
    "a": "sh2m",
    "b": "sh2s",
    "label": "shared bus"
   },
   {
    "a": "sh2m",
    "b": "scu",
    "label": "CPU bus"
   },
   {
    "a": "cart",
    "b": "scu",
    "label": "A-bus"
   },
   {
    "a": "cd",
    "b": "cdb",
    "label": "drive"
   },
   {
    "a": "cdb",
    "b": "scu",
    "label": "A-bus"
   },
   {
    "a": "scu",
    "b": "wram",
    "label": "CPU bus"
   },
   {
    "a": "scu",
    "b": "vdp1",
    "label": "B-bus"
   },
   {
    "a": "scu",
    "b": "vdp2",
    "label": "B-bus"
   },
   {
    "a": "scu",
    "b": "scsp",
    "label": "B-bus"
   },
   {
    "a": "vdp1",
    "b": "vdp2",
    "label": "framebuffer"
   },
   {
    "a": "vdp2",
    "b": "av",
    "label": "video"
   },
   {
    "a": "scsp",
    "b": "av",
    "label": "audio"
   },
   {
    "a": "batt",
    "b": "smpc",
    "label": "RTC"
   }
  ]
 },
 {
  "id": "ps1",
  "name": "Sony PlayStation",
  "maker": "Sony",
  "year": 1995,
  "short": "PS1",
  "board": "SCPH-1001 / 5501 / 7501 (NTSC-U)",
  "summary": "32-bit MIPS R3000A console with Geometry Transformation Engine. The laser and its sled are the common repairs.",
  "comps": [
   {
    "id": "pad",
    "name": "Controller & memory card ports",
    "pn": "PS1 controller/memory card port assembly",
    "cat": "io",
    "pkg": "port",
    "x": 0,
    "y": 0,
    "use": "Two pad + memory card slots on a shared serial bus.",
    "notes": "",
    "q": "PS1 controller port",
    "src": "mech",
    "verify": false
   },
   {
    "id": "cd",
    "name": "CD-ROM drive / laser",
    "pn": "KSM-440ACM / KSM-440ADM / KSM-440AEM / KSM-440BAM (by model)",
    "cat": "media",
    "pkg": "drive",
    "x": 2,
    "y": 0,
    "use": "2× CD-ROM mechanism. Laser model depends on board revision.",
    "notes": "Skipping/no-read = dirty lens, worn laser, or bad sled; KSM-440AEM is the usual replacement for 5501/7501.",
    "q": "KSM-440ADM",
    "src": "mech",
    "verify": true
   },
   {
    "id": "psu",
    "name": "Internal PSU",
    "pn": "PS1 PSU board (7.5 V / 3.5 V)",
    "cat": "power",
    "pkg": "psu",
    "x": 4,
    "y": 0,
    "use": "Internal power supply board.",
    "notes": "",
    "q": "PS1 power supply board",
    "src": "mech",
    "verify": false
   },
   {
    "id": "sub",
    "name": "CD controller MCU",
    "pn": "Motorola MC68HC05 (CD sub-CPU)",
    "cat": "media",
    "pkg": "qfp",
    "x": 1,
    "y": 0,
    "use": "Controls the drive mechanism and region checks. Modchips tap here.",
    "notes": "",
    "q": "PS1 68HC05",
    "src": "custom",
    "verify": false
   },
   {
    "id": "cpu",
    "name": "CPU + GTE",
    "pn": "Sony CXD8530AQ / CXD8530CQ",
    "cat": "cpu",
    "pkg": "qfp",
    "x": 1,
    "y": 1,
    "use": "MIPS R3000A at 33.87 MHz with GTE (3D math) and MDEC (video decompression).",
    "notes": "",
    "q": "CXD8530CQ",
    "src": "custom",
    "verify": false
   },
   {
    "id": "xtal",
    "name": "Master clock",
    "pn": "67.7376 MHz (NTSC)",
    "cat": "clock",
    "pkg": "crystal",
    "x": 2,
    "y": 1,
    "use": "÷2 for the CPU.",
    "notes": "",
    "q": "67.7376 MHz crystal",
    "src": "std",
    "verify": false
   },
   {
    "id": "gpu",
    "name": "GPU",
    "pn": "Sony CXD8514Q (early) / CXD8561Q (later)",
    "cat": "gpu",
    "pkg": "qfp",
    "x": 3,
    "y": 1,
    "use": "2D/3D rasterizer: flat/Gouraud/textured polygons into 1 MB VRAM.",
    "notes": "",
    "q": "CXD8561Q",
    "src": "custom",
    "verify": false
   },
   {
    "id": "bios",
    "name": "BIOS ROM",
    "pn": "512 KB mask ROM (region BIOS)",
    "cat": "storage",
    "pkg": "sop",
    "x": 0,
    "y": 1,
    "use": "Boot code, kernel and memory card manager.",
    "notes": "",
    "q": "PS1 BIOS chip",
    "src": "custom",
    "verify": false
   },
   {
    "id": "ram",
    "name": "Main RAM (2 MB)",
    "pn": "2 MB EDO DRAM",
    "cat": "mem",
    "pkg": "sop",
    "x": 1,
    "y": 2,
    "use": "CPU main memory.",
    "notes": "",
    "q": "PS1 RAM chip",
    "src": "custom",
    "verify": false
   },
   {
    "id": "cddsp",
    "name": "CD DSP / decoder",
    "pn": "Sony CXD2510Q (early) / CXD2545Q",
    "cat": "media",
    "pkg": "qfp",
    "x": 2,
    "y": 2,
    "use": "CD signal processing, EFM decoding and servo.",
    "notes": "",
    "q": "CXD2545Q",
    "src": "custom",
    "verify": false
   },
   {
    "id": "vram",
    "name": "Video RAM (1 MB)",
    "pn": "1 MB VRAM",
    "cat": "mem",
    "pkg": "sop",
    "x": 3,
    "y": 2,
    "use": "Framebuffer and textures.",
    "notes": "",
    "q": "PS1 VRAM",
    "src": "custom",
    "verify": false
   },
   {
    "id": "enc",
    "name": "Video encoder",
    "pn": "Sony CXA1645 / CXA2075",
    "cat": "video",
    "pkg": "sop",
    "x": 4,
    "y": 2,
    "use": "RGB to composite/S-Video encoder.",
    "notes": "",
    "q": "CXA1645",
    "src": "custom",
    "verify": true
   },
   {
    "id": "spu",
    "name": "Sound processor",
    "pn": "Sony CXD2922Q / CXD2925Q (SPU)",
    "cat": "audio",
    "pkg": "qfp",
    "x": 2,
    "y": 3,
    "use": "24-voice ADPCM with reverb; also plays CD audio.",
    "notes": "",
    "q": "CXD2925Q",
    "src": "custom",
    "verify": false
   },
   {
    "id": "sram",
    "name": "Sound RAM (512 KB)",
    "pn": "512 KB DRAM",
    "cat": "mem",
    "pkg": "sop",
    "x": 3,
    "y": 3,
    "use": "SPU sample memory.",
    "notes": "",
    "q": "PS1 SPU RAM",
    "src": "custom",
    "verify": false
   },
   {
    "id": "av",
    "name": "AV multi-out",
    "pn": "PS AV multi-out",
    "cat": "video",
    "pkg": "port",
    "x": 4,
    "y": 3,
    "use": "Composite, S-Video, RGB and stereo audio.",
    "notes": "",
    "q": "PS1 AV cable",
    "src": "mech",
    "verify": false
   }
  ],
  "links": [
   {
    "a": "pad",
    "b": "cpu",
    "label": "SIO"
   },
   {
    "a": "cd",
    "b": "sub",
    "label": "mechanism"
   },
   {
    "a": "cd",
    "b": "cddsp",
    "label": "RF signal"
   },
   {
    "a": "sub",
    "b": "cddsp",
    "label": "control"
   },
   {
    "a": "cddsp",
    "b": "cpu",
    "label": "CD data"
   },
   {
    "a": "bios",
    "b": "cpu",
    "label": "boot"
   },
   {
    "a": "xtal",
    "b": "cpu",
    "label": "÷2"
   },
   {
    "a": "cpu",
    "b": "ram",
    "label": "main bus"
   },
   {
    "a": "cpu",
    "b": "gpu",
    "label": "GP0/GP1"
   },
   {
    "a": "gpu",
    "b": "vram",
    "label": "VRAM bus"
   },
   {
    "a": "cpu",
    "b": "spu",
    "label": "main bus"
   },
   {
    "a": "spu",
    "b": "sram",
    "label": "sound bus"
   },
   {
    "a": "cddsp",
    "b": "spu",
    "label": "CD audio"
   },
   {
    "a": "gpu",
    "b": "enc",
    "label": "RGB"
   },
   {
    "a": "enc",
    "b": "av",
    "label": "video"
   },
   {
    "a": "spu",
    "b": "av",
    "label": "audio"
   }
  ]
 },
 {
  "id": "n64",
  "name": "Nintendo 64",
  "maker": "Nintendo",
  "year": 1996,
  "short": "N64",
  "board": "NUS-CPU-01 … -09, NTSC",
  "summary": "64-bit MIPS console with SGI's Reality Co-Processor and Rambus RDRAM.",
  "comps": [
   {
    "id": "pad",
    "name": "Controller ports",
    "pn": "NUS-005 controller ports ×4",
    "cat": "io",
    "pkg": "port",
    "x": 0,
    "y": 0,
    "use": "Joybus serial ports polled by the PIF.",
    "notes": "Worn analog sticks are the #1 controller repair.",
    "q": "N64 controller port",
    "src": "mech",
    "verify": false
   },
   {
    "id": "cart",
    "name": "Cartridge slot",
    "pn": "50-pin cartridge connector",
    "cat": "media",
    "pkg": "edge",
    "x": 2,
    "y": 0,
    "use": "Cartridge ROM on the PI bus; CIC in the cart talks to the PIF.",
    "notes": "",
    "q": "N64 cartridge slot",
    "src": "mech",
    "verify": false
   },
   {
    "id": "psu",
    "name": "Power supply",
    "pn": "NUS-002 (12 V / 3.3 V)",
    "cat": "power",
    "pkg": "psu",
    "x": 4,
    "y": 0,
    "use": "Plug-in brick providing 12 V and 3.3 V.",
    "notes": "",
    "q": "N64 NUS-002 power supply",
    "src": "mech",
    "verify": false
   },
   {
    "id": "pif",
    "name": "Peripheral interface",
    "pn": "PIF-NUS",
    "cat": "security",
    "pkg": "qfp",
    "x": 0,
    "y": 1,
    "use": "Boot ROM, CIC lockout check and controller polling.",
    "notes": "",
    "q": "N64 PIF-NUS",
    "src": "custom",
    "verify": false
   },
   {
    "id": "cpu",
    "name": "CPU",
    "pn": "NUS-CPU (NEC VR4300)",
    "cat": "cpu",
    "pkg": "qfp",
    "x": 1,
    "y": 1,
    "use": "64-bit MIPS R4300i at 93.75 MHz.",
    "notes": "",
    "q": "N64 NUS-CPU VR4300",
    "src": "custom",
    "verify": false
   },
   {
    "id": "clk",
    "name": "Clock generator",
    "pn": "MX8330MC (NTSC) / MX8350 (PAL)",
    "cat": "clock",
    "pkg": "sop",
    "x": 2,
    "y": 1,
    "use": "Generates RCP/CPU, RDRAM and video clocks.",
    "notes": "",
    "q": "MX8330MC",
    "src": "std",
    "verify": false
   },
   {
    "id": "rcp",
    "name": "Reality Co-Processor",
    "pn": "NUS-RCP (SGI; RSP + RDP)",
    "cat": "gpu",
    "pkg": "qfp",
    "x": 3,
    "y": 1,
    "use": "RSP vector unit (geometry/audio microcode) + RDP rasterizer; also the memory controller.",
    "notes": "",
    "q": "N64 NUS-RCP",
    "src": "custom",
    "verify": false
   },
   {
    "id": "reg",
    "name": "Regulators",
    "pn": "Voltage regulators (on board)",
    "cat": "power",
    "pkg": "to220",
    "x": 4,
    "y": 1,
    "use": "Board-level regulation from the 12 V/3.3 V supply.",
    "notes": "",
    "q": "N64 voltage regulator",
    "src": "custom",
    "verify": true
   },
   {
    "id": "exp",
    "name": "Jumper / Expansion Pak",
    "pn": "NUS-008 Jumper Pak / NUS-007 Expansion Pak",
    "cat": "mem",
    "pkg": "card",
    "x": 0,
    "y": 2,
    "use": "Terminates the RDRAM bus or adds 4 MB (total 8 MB).",
    "notes": "No Jumper Pak = black screen.",
    "q": "N64 Expansion Pak",
    "src": "mech",
    "verify": false
   },
   {
    "id": "rdram",
    "name": "RDRAM (4 MB)",
    "pn": "NUS-RDRAM ×2",
    "cat": "mem",
    "pkg": "sop",
    "x": 1,
    "y": 2,
    "use": "Unified memory on a 9-bit Rambus bus at 500 MHz.",
    "notes": "",
    "q": "N64 RDRAM",
    "src": "custom",
    "verify": false
   },
   {
    "id": "vdc",
    "name": "Video DAC/encoder",
    "pn": "VDC-NUS (early) / DENC-NUS / AVDC-NUS",
    "cat": "video",
    "pkg": "sop",
    "x": 3,
    "y": 2,
    "use": "Converts digital video from the RCP to composite/S-Video.",
    "notes": "Early VDC-NUS boards allow clean RGB mods.",
    "q": "N64 VDC-NUS",
    "src": "custom",
    "verify": false
   },
   {
    "id": "av",
    "name": "AV multi-out",
    "pn": "Nintendo multi-out",
    "cat": "video",
    "pkg": "port",
    "x": 4,
    "y": 2,
    "use": "Composite/S-Video and stereo audio.",
    "notes": "",
    "q": "N64 AV cable",
    "src": "mech",
    "verify": false
   }
  ],
  "links": [
   {
    "a": "pad",
    "b": "pif",
    "label": "Joybus"
   },
   {
    "a": "cart",
    "b": "rcp",
    "label": "PI bus"
   },
   {
    "a": "pif",
    "b": "rcp",
    "label": "SI bus"
   },
   {
    "a": "pif",
    "b": "cpu",
    "label": "reset/NMI"
   },
   {
    "a": "cpu",
    "b": "rcp",
    "label": "SysAD bus"
   },
   {
    "a": "clk",
    "b": "rcp",
    "label": "clocks"
   },
   {
    "a": "clk",
    "b": "rdram",
    "label": "clock"
   },
   {
    "a": "rcp",
    "b": "rdram",
    "label": "Rambus"
   },
   {
    "a": "exp",
    "b": "rdram",
    "label": "RDRAM bus"
   },
   {
    "a": "rcp",
    "b": "vdc",
    "label": "digital video+audio"
   },
   {
    "a": "vdc",
    "b": "av",
    "label": "video"
   },
   {
    "a": "psu",
    "b": "reg",
    "label": "12 V / 3.3 V"
   }
  ]
 },
 {
  "id": "dc",
  "name": "Sega Dreamcast",
  "maker": "Sega",
  "year": 1999,
  "short": "Dreamcast",
  "board": "HKT-3020 (NTSC-U)",
  "summary": "SH-4 + PowerVR2 console with a GD-ROM drive. Drives wear out; optical-drive emulators are a popular replacement.",
  "comps": [
   {
    "id": "pad",
    "name": "Controller ports",
    "pn": "Maple bus ports ×4",
    "cat": "io",
    "pkg": "port",
    "x": 0,
    "y": 0,
    "use": "Maple serial bus for controllers and VMUs.",
    "notes": "",
    "q": "Dreamcast controller port",
    "src": "mech",
    "verify": false
   },
   {
    "id": "gd",
    "name": "GD-ROM drive",
    "pn": "GD-ROM drive (1.2 GB GD discs)",
    "cat": "media",
    "pkg": "drive",
    "x": 2,
    "y": 0,
    "use": "Proprietary high-density CD drive.",
    "notes": "Common failure. Replace laser or install an optical drive emulator (GDEMU-type).",
    "q": "Dreamcast GD-ROM laser",
    "src": "mech",
    "verify": false
   },
   {
    "id": "psu",
    "name": "Power supply",
    "pn": "Dreamcast PSU board (110 V US)",
    "cat": "power",
    "pkg": "psu",
    "x": 4,
    "y": 0,
    "use": "Internal PSU board.",
    "notes": "Region-specific voltage.",
    "q": "Dreamcast power supply",
    "src": "mech",
    "verify": false
   },
   {
    "id": "modem",
    "name": "Modem module",
    "pn": "56K modem (or Broadband Adapter HIT-400)",
    "cat": "io",
    "pkg": "module",
    "x": 0,
    "y": 1,
    "use": "Removable network module.",
    "notes": "",
    "q": "Dreamcast broadband adapter",
    "src": "mech",
    "verify": false
   },
   {
    "id": "cpu",
    "name": "CPU",
    "pn": "Hitachi SH-4 (SH7091, 200 MHz)",
    "cat": "cpu",
    "pkg": "bga",
    "x": 1,
    "y": 1,
    "use": "32-bit RISC with 128-bit SIMD FPU for geometry.",
    "notes": "",
    "q": "Dreamcast SH-4",
    "src": "custom",
    "verify": false
   },
   {
    "id": "holly",
    "name": "GPU / system ASIC",
    "pn": "HOLLY (NEC/VideoLogic PowerVR2 CLX2)",
    "cat": "gpu",
    "pkg": "bga",
    "x": 3,
    "y": 1,
    "use": "Tile-based deferred renderer plus system bus controller.",
    "notes": "",
    "q": "Dreamcast Holly",
    "src": "custom",
    "verify": false
   },
   {
    "id": "fan",
    "name": "Cooling fan",
    "pn": "5 V 50 mm fan",
    "cat": "power",
    "pkg": "fan",
    "x": 4,
    "y": 1,
    "use": "Exhaust fan.",
    "notes": "Noisy stock fan; quiet 5 V replacements are common.",
    "q": "Dreamcast replacement fan",
    "src": "mech",
    "verify": false
   },
   {
    "id": "bios",
    "name": "BIOS / Flash",
    "pn": "2 MB BIOS ROM + 128 KB flash",
    "cat": "storage",
    "pkg": "sop",
    "x": 0,
    "y": 2,
    "use": "Boot ROM and settings flash.",
    "notes": "",
    "q": "Dreamcast BIOS",
    "src": "custom",
    "verify": false
   },
   {
    "id": "ram",
    "name": "Main RAM (16 MB)",
    "pn": "16 MB SDRAM",
    "cat": "mem",
    "pkg": "sop",
    "x": 1,
    "y": 2,
    "use": "System memory.",
    "notes": "",
    "q": "Dreamcast SDRAM",
    "src": "custom",
    "verify": false
   },
   {
    "id": "aica",
    "name": "Sound processor",
    "pn": "Yamaha AICA (ARM7 core) + 2 MB RAM",
    "cat": "audio",
    "pkg": "qfp",
    "x": 2,
    "y": 2,
    "use": "64-channel PCM/ADPCM with DSP effects.",
    "notes": "",
    "q": "Dreamcast AICA",
    "src": "custom",
    "verify": false
   },
   {
    "id": "vram",
    "name": "Video RAM (8 MB)",
    "pn": "8 MB SDRAM",
    "cat": "mem",
    "pkg": "sop",
    "x": 3,
    "y": 2,
    "use": "Textures and framebuffer.",
    "notes": "",
    "q": "Dreamcast VRAM",
    "src": "custom",
    "verify": false
   },
   {
    "id": "av",
    "name": "AV port / VGA",
    "pn": "AV multi-out (VGA capable)",
    "cat": "video",
    "pkg": "port",
    "x": 4,
    "y": 2,
    "use": "Composite/S-Video/RGB/VGA.",
    "notes": "",
    "q": "Dreamcast VGA box",
    "src": "mech",
    "verify": false
   },
   {
    "id": "batt",
    "name": "Clock battery",
    "pn": "Rechargeable 2032-size cell (VL2032/ML2032)",
    "cat": "power",
    "pkg": "battery",
    "x": 0,
    "y": 3,
    "use": "Keeps date/time.",
    "notes": "Dead cell = date prompt on every boot.",
    "q": "ML2032 rechargeable",
    "src": "std",
    "verify": true
   }
  ],
  "links": [
   {
    "a": "pad",
    "b": "holly",
    "label": "Maple"
   },
   {
    "a": "gd",
    "b": "holly",
    "label": "G1 bus"
   },
   {
    "a": "modem",
    "b": "holly",
    "label": "G2 bus"
   },
   {
    "a": "cpu",
    "b": "holly",
    "label": "system bus"
   },
   {
    "a": "bios",
    "b": "holly",
    "label": "G1 bus"
   },
   {
    "a": "cpu",
    "b": "ram",
    "label": "SDRAM bus"
   },
   {
    "a": "holly",
    "b": "vram",
    "label": "64-bit"
   },
   {
    "a": "holly",
    "b": "aica",
    "label": "G2 bus"
   },
   {
    "a": "holly",
    "b": "av",
    "label": "video"
   },
   {
    "a": "aica",
    "b": "av",
    "label": "audio"
   },
   {
    "a": "psu",
    "b": "fan",
    "label": "5 V"
   },
   {
    "a": "batt",
    "b": "aica",
    "label": "RTC"
   }
  ]
 },
 {
  "id": "ps2",
  "name": "Sony PlayStation 2",
  "maker": "Sony",
  "year": 2000,
  "short": "PS2",
  "board": "SCPH-3000x / 5000x (fat); 7000x+ slim",
  "summary": "Emotion Engine + Graphics Synthesizer console with a PS1-compatible I/O processor.",
  "comps": [
   {
    "id": "pad",
    "name": "Controller & memory card ports",
    "pn": "PS2 controller/memory card port assembly",
    "cat": "io",
    "pkg": "port",
    "x": 0,
    "y": 0,
    "use": "Pad/card ports on SIO2, handled by the IOP.",
    "notes": "",
    "q": "PS2 controller port",
    "src": "mech",
    "verify": false
   },
   {
    "id": "dvd",
    "name": "DVD drive / laser",
    "pn": "KHS-400B / KHS-400C (fat); KHM-430 series (slim)",
    "cat": "media",
    "pkg": "drive",
    "x": 2,
    "y": 0,
    "use": "DVD/CD mechanism.",
    "notes": "Disc read errors: clean lens, adjust/replace laser, check MechaCon revision before buying a laser.",
    "q": "KHS-400C",
    "src": "mech",
    "verify": false
   },
   {
    "id": "psu",
    "name": "Power supply",
    "pn": "Internal PSU (fat) / SCPH-70100 AC adapter (slim)",
    "cat": "power",
    "pkg": "psu",
    "x": 4,
    "y": 0,
    "use": "Fat models: internal PSU. Slim models: 8.5 V external adapter.",
    "notes": "",
    "q": "PS2 power supply",
    "src": "mech",
    "verify": false
   },
   {
    "id": "mecha",
    "name": "Mechanism controller",
    "pn": "MechaCon (CXP10xxxx / CXR70xxxx by revision)",
    "cat": "media",
    "pkg": "qfp",
    "x": 1,
    "y": 0,
    "use": "Controls the drive, servo and disc authentication.",
    "notes": "Laser compatibility depends on MechaCon revision.",
    "q": "PS2 MechaCon",
    "src": "custom",
    "verify": true
   },
   {
    "id": "ee",
    "name": "Emotion Engine",
    "pn": "Sony CXD9542GB / CXD9615GB (by revision)",
    "cat": "cpu",
    "pkg": "bga",
    "x": 1,
    "y": 1,
    "use": "R5900 MIPS CPU at 294.9 MHz with two vector units (VU0/VU1) and IPU.",
    "notes": "",
    "q": "PS2 Emotion Engine",
    "src": "custom",
    "verify": true
   },
   {
    "id": "gs",
    "name": "Graphics Synthesizer",
    "pn": "Sony CXD2934GB / CXD2949GB",
    "cat": "gpu",
    "pkg": "bga",
    "x": 3,
    "y": 1,
    "use": "Rasterizer with 4 MB embedded DRAM.",
    "notes": "Later boards merge EE and GS into one chip.",
    "q": "PS2 Graphics Synthesizer",
    "src": "custom",
    "verify": true
   },
   {
    "id": "fan",
    "name": "Cooling fan",
    "pn": "PS2 fan",
    "cat": "power",
    "pkg": "fan",
    "x": 4,
    "y": 1,
    "use": "Cooling.",
    "notes": "",
    "q": "PS2 fan replacement",
    "src": "mech",
    "verify": false
   },
   {
    "id": "iop",
    "name": "I/O processor",
    "pn": "IOP (PS1-derived MIPS R3000A)",
    "cat": "io",
    "pkg": "qfp",
    "x": 0,
    "y": 1,
    "use": "Handles I/O, pads, cards, USB, FireWire, HDD and PS1 back-compat.",
    "notes": "",
    "q": "PS2 IOP",
    "src": "custom",
    "verify": false
   },
   {
    "id": "rdram",
    "name": "Main RAM (32 MB)",
    "pn": "32 MB RDRAM (2 chips)",
    "cat": "mem",
    "pkg": "bga",
    "x": 1,
    "y": 2,
    "use": "Dual-channel Rambus main memory.",
    "notes": "",
    "q": "PS2 RDRAM",
    "src": "custom",
    "verify": false
   },
   {
    "id": "spu2",
    "name": "Sound processor",
    "pn": "SPU2",
    "cat": "audio",
    "pkg": "qfp",
    "x": 0,
    "y": 2,
    "use": "48-voice ADPCM sound (2× PS1 SPU).",
    "notes": "",
    "q": "PS2 SPU2",
    "src": "custom",
    "verify": false
   },
   {
    "id": "hdd",
    "name": "Expansion bay",
    "pn": "Network Adapter SCPH-10281 + 3.5\" IDE HDD",
    "cat": "storage",
    "pkg": "hdd",
    "x": 2,
    "y": 2,
    "use": "Fat models: network adapter and optional IDE hard drive.",
    "notes": "",
    "q": "SCPH-10281 network adapter",
    "src": "mech",
    "verify": false
   },
   {
    "id": "av",
    "name": "AV multi-out",
    "pn": "PS AV multi-out + optical out",
    "cat": "video",
    "pkg": "port",
    "x": 3,
    "y": 2,
    "use": "Composite/S-Video/RGB/component and S/PDIF.",
    "notes": "",
    "q": "PS2 component cable",
    "src": "mech",
    "verify": false
   }
  ],
  "links": [
   {
    "a": "pad",
    "b": "iop",
    "label": "SIO2"
   },
   {
    "a": "dvd",
    "b": "mecha",
    "label": "servo"
   },
   {
    "a": "mecha",
    "b": "iop",
    "label": "CDVD"
   },
   {
    "a": "iop",
    "b": "ee",
    "label": "SBUS"
   },
   {
    "a": "ee",
    "b": "gs",
    "label": "GIF 64-bit"
   },
   {
    "a": "ee",
    "b": "rdram",
    "label": "Rambus"
   },
   {
    "a": "iop",
    "b": "spu2",
    "label": "IOP bus"
   },
   {
    "a": "iop",
    "b": "hdd",
    "label": "DEV9"
   },
   {
    "a": "gs",
    "b": "av",
    "label": "video"
   },
   {
    "a": "spu2",
    "b": "av",
    "label": "audio"
   },
   {
    "a": "psu",
    "b": "fan",
    "label": "12 V"
   }
  ]
 },
 {
  "id": "xbox",
  "name": "Microsoft Xbox",
  "maker": "Microsoft",
  "year": 2001,
  "short": "Xbox",
  "board": "v1.0 – v1.6",
  "summary": "PC-architecture console: Pentium III, NVIDIA GPU and an IDE hard drive. The v1.0/1.1 clock capacitor leaks and must be removed.",
  "comps": [
   {
    "id": "pad",
    "name": "Controller ports",
    "pn": "Xbox controller ports (USB-based)",
    "cat": "io",
    "pkg": "port",
    "x": 0,
    "y": 0,
    "use": "Four ports wired as USB 1.1.",
    "notes": "",
    "q": "Xbox controller port",
    "src": "mech",
    "verify": false
   },
   {
    "id": "dvd",
    "name": "DVD drive",
    "pn": "Thomson TGM-600 / Philips VAD6011 / Samsung SDG-605",
    "cat": "media",
    "pkg": "drive",
    "x": 2,
    "y": 0,
    "use": "IDE DVD-ROM.",
    "notes": "Philips drives often fail to open/read; Samsung is the most durable replacement. DVD drives are not paired to the console.",
    "q": "Xbox DVD drive Samsung SDG-605",
    "src": "mech",
    "verify": false
   },
   {
    "id": "hdd",
    "name": "Hard drive",
    "pn": "8 GB IDE (Seagate ST310211A / WD WD80EB)",
    "cat": "storage",
    "pkg": "hdd",
    "x": 3,
    "y": 0,
    "use": "Locked IDE HDD for saves and cache.",
    "notes": "Drive is password-locked to the motherboard EEPROM.",
    "q": "Xbox original hard drive",
    "src": "mech",
    "verify": false
   },
   {
    "id": "psu",
    "name": "Power supply",
    "pn": "Internal PSU (Foxlink v1.0–1.5 / Delta v1.6)",
    "cat": "power",
    "pkg": "psu",
    "x": 4,
    "y": 0,
    "use": "Internal ATX-like supply.",
    "notes": "Check PSU type before buying; connectors differ by revision.",
    "q": "Xbox power supply",
    "src": "mech",
    "verify": false
   },
   {
    "id": "cpu",
    "name": "CPU",
    "pn": "Intel Pentium III (Coppermine, 733 MHz)",
    "cat": "cpu",
    "pkg": "bga",
    "x": 1,
    "y": 1,
    "use": "x86 CPU with 128 KB L2 cache.",
    "notes": "",
    "q": "Xbox CPU",
    "src": "custom",
    "verify": false
   },
   {
    "id": "nv2a",
    "name": "GPU / northbridge",
    "pn": "NVIDIA NV2A",
    "cat": "gpu",
    "pkg": "bga",
    "x": 2,
    "y": 1,
    "use": "GeForce3-class GPU at 233 MHz; also the memory controller (UMA).",
    "notes": "",
    "q": "Xbox NV2A",
    "src": "custom",
    "verify": false
   },
   {
    "id": "cap",
    "name": "Clock capacitor",
    "pn": "1 F supercapacitor (v1.0–v1.1)",
    "cat": "power",
    "pkg": "battery",
    "x": 3,
    "y": 1,
    "use": "Keeps the clock running briefly when unplugged.",
    "notes": "LEAKS and eats traces. Remove it on every v1.0/1.1 board.",
    "q": "Xbox clock capacitor",
    "src": "std",
    "verify": false
   },
   {
    "id": "smc",
    "name": "System Management Controller",
    "pn": "Microchip PIC16LC63A",
    "cat": "io",
    "pkg": "sop",
    "x": 4,
    "y": 1,
    "use": "Power sequencing, LEDs, fan, tray and video-mode detection.",
    "notes": "",
    "q": "PIC16LC63A",
    "src": "custom",
    "verify": false
   },
   {
    "id": "mcpx",
    "name": "Southbridge + audio",
    "pn": "NVIDIA MCPX",
    "cat": "audio",
    "pkg": "bga",
    "x": 1,
    "y": 2,
    "use": "IDE, USB, Ethernet and APU audio; contains the secret boot ROM.",
    "notes": "",
    "q": "Xbox MCPX",
    "src": "custom",
    "verify": false
   },
   {
    "id": "ram",
    "name": "Main RAM (64 MB)",
    "pn": "64 MB DDR SDRAM (4 chips)",
    "cat": "mem",
    "pkg": "bga",
    "x": 2,
    "y": 2,
    "use": "Unified memory shared by CPU and GPU.",
    "notes": "",
    "q": "Xbox RAM",
    "src": "custom",
    "verify": false
   },
   {
    "id": "flash",
    "name": "BIOS flash",
    "pn": "TSOP flash (1 MB / 256 KB)",
    "cat": "storage",
    "pkg": "sop",
    "x": 0,
    "y": 2,
    "use": "Kernel/BIOS storage (TSOP).",
    "notes": "",
    "q": "Xbox TSOP flash",
    "src": "custom",
    "verify": false
   },
   {
    "id": "enc",
    "name": "Video encoder",
    "pn": "Conexant CX25871 / Focus FS454 / Xcalibur",
    "cat": "video",
    "pkg": "qfp",
    "x": 3,
    "y": 2,
    "use": "Converts GPU output to analog SD/HD.",
    "notes": "Xcalibur (v1.6) is a weaker encoder for HD.",
    "q": "Conexant CX25871",
    "src": "custom",
    "verify": false
   },
   {
    "id": "av",
    "name": "AV port",
    "pn": "Xbox AV multi-out",
    "cat": "video",
    "pkg": "port",
    "x": 4,
    "y": 2,
    "use": "Composite/component/RGB.",
    "notes": "",
    "q": "Xbox component cable",
    "src": "mech",
    "verify": false
   }
  ],
  "links": [
   {
    "a": "pad",
    "b": "mcpx",
    "label": "USB"
   },
   {
    "a": "dvd",
    "b": "mcpx",
    "label": "IDE"
   },
   {
    "a": "hdd",
    "b": "mcpx",
    "label": "IDE"
   },
   {
    "a": "cpu",
    "b": "nv2a",
    "label": "FSB"
   },
   {
    "a": "nv2a",
    "b": "ram",
    "label": "128-bit DDR"
   },
   {
    "a": "nv2a",
    "b": "mcpx",
    "label": "HyperTransport"
   },
   {
    "a": "flash",
    "b": "mcpx",
    "label": "LPC"
   },
   {
    "a": "smc",
    "b": "mcpx",
    "label": "SMBus"
   },
   {
    "a": "nv2a",
    "b": "enc",
    "label": "digital video"
   },
   {
    "a": "enc",
    "b": "av",
    "label": "video"
   },
   {
    "a": "mcpx",
    "b": "av",
    "label": "audio"
   },
   {
    "a": "cap",
    "b": "smc",
    "label": "RTC"
   }
  ]
 },
 {
  "id": "gc",
  "name": "Nintendo GameCube",
  "maker": "Nintendo",
  "year": 2001,
  "short": "GameCube",
  "board": "DOL-001 / DOL-101",
  "summary": "PowerPC Gekko + ATI Flipper console using 1T-SRAM and 8 cm optical discs.",
  "comps": [
   {
    "id": "pad",
    "name": "Controller ports",
    "pn": "GameCube controller ports ×4",
    "cat": "io",
    "pkg": "port",
    "x": 0,
    "y": 0,
    "use": "Joybus-style serial pad ports.",
    "notes": "",
    "q": "GameCube controller port",
    "src": "mech",
    "verify": false
   },
   {
    "id": "odd",
    "name": "Optical drive / laser",
    "pn": "GameCube optical drive (8 cm, laser assembly)",
    "cat": "media",
    "pkg": "drive",
    "x": 2,
    "y": 0,
    "use": "Mini-DVD-based drive.",
    "notes": "Common: weak laser, adjust potentiometer or replace laser; ODEs available.",
    "q": "GameCube laser lens",
    "src": "mech",
    "verify": false
   },
   {
    "id": "psu",
    "name": "AC adapter",
    "pn": "DOL-002 (12 V DC 3.25 A)",
    "cat": "power",
    "pkg": "psu",
    "x": 4,
    "y": 0,
    "use": "External adapter.",
    "notes": "",
    "q": "GameCube DOL-002 power supply",
    "src": "mech",
    "verify": false
   },
   {
    "id": "mc",
    "name": "Memory card slots",
    "pn": "Memory card slots ×2",
    "cat": "io",
    "pkg": "port",
    "x": 0,
    "y": 1,
    "use": "EXI bus card slots.",
    "notes": "",
    "q": "GameCube memory card slot",
    "src": "mech",
    "verify": false
   },
   {
    "id": "cpu",
    "name": "CPU",
    "pn": "IBM Gekko (PowerPC 750CXe, 486 MHz)",
    "cat": "cpu",
    "pkg": "bga",
    "x": 1,
    "y": 1,
    "use": "PowerPC with paired-single SIMD extensions.",
    "notes": "",
    "q": "GameCube Gekko",
    "src": "custom",
    "verify": false
   },
   {
    "id": "flipper",
    "name": "GPU / system LSI",
    "pn": "ATI Flipper (162 MHz, 3 MB embedded 1T-SRAM)",
    "cat": "gpu",
    "pkg": "bga",
    "x": 2,
    "y": 1,
    "use": "GPU, DSP audio, I/O and memory controller in one chip.",
    "notes": "",
    "q": "GameCube Flipper",
    "src": "custom",
    "verify": false
   },
   {
    "id": "fan",
    "name": "Cooling fan",
    "pn": "GameCube fan",
    "cat": "power",
    "pkg": "fan",
    "x": 4,
    "y": 1,
    "use": "Cooling.",
    "notes": "",
    "q": "GameCube fan",
    "src": "mech",
    "verify": false
   },
   {
    "id": "ipl",
    "name": "IPL ROM",
    "pn": "2 MB IPL ROM",
    "cat": "storage",
    "pkg": "sop",
    "x": 0,
    "y": 2,
    "use": "Boot menu, fonts.",
    "notes": "",
    "q": "GameCube IPL",
    "src": "custom",
    "verify": false
   },
   {
    "id": "ram",
    "name": "Main RAM (24 MB)",
    "pn": "24 MB 1T-SRAM (MoSys)",
    "cat": "mem",
    "pkg": "bga",
    "x": 1,
    "y": 2,
    "use": "Low-latency main memory.",
    "notes": "",
    "q": "GameCube 1T-SRAM",
    "src": "custom",
    "verify": false
   },
   {
    "id": "aram",
    "name": "Audio RAM (16 MB)",
    "pn": "16 MB DRAM (ARAM)",
    "cat": "mem",
    "pkg": "sop",
    "x": 2,
    "y": 2,
    "use": "Audio and auxiliary storage.",
    "notes": "",
    "q": "GameCube ARAM",
    "src": "custom",
    "verify": false
   },
   {
    "id": "ave",
    "name": "AV encoder",
    "pn": "AVE-N-DOL (NTSC) / AVE-P-DOL (PAL)",
    "cat": "video",
    "pkg": "qfp",
    "x": 3,
    "y": 2,
    "use": "Video DAC/encoder.",
    "notes": "DOL-001 has the Digital AV port for component (GBS/HDMI adapters).",
    "q": "GameCube AVE-N-DOL",
    "src": "custom",
    "verify": true
   },
   {
    "id": "av",
    "name": "AV ports",
    "pn": "Analog multi-out + Digital AV (DOL-001)",
    "cat": "video",
    "pkg": "port",
    "x": 4,
    "y": 2,
    "use": "Composite/S-Video/RGB; component via Digital AV.",
    "notes": "",
    "q": "GameCube HDMI adapter",
    "src": "mech",
    "verify": false
   },
   {
    "id": "ser",
    "name": "Serial & Hi-Speed ports",
    "pn": "Serial ports (BBA DOL-015) + Hi-Speed port (Game Boy Player)",
    "cat": "io",
    "pkg": "module",
    "x": 2,
    "y": 3,
    "use": "Underside expansion ports.",
    "notes": "",
    "q": "GameCube broadband adapter DOL-015",
    "src": "mech",
    "verify": false
   }
  ],
  "links": [
   {
    "a": "pad",
    "b": "flipper",
    "label": "SI"
   },
   {
    "a": "mc",
    "b": "flipper",
    "label": "EXI"
   },
   {
    "a": "odd",
    "b": "flipper",
    "label": "DI"
   },
   {
    "a": "cpu",
    "b": "flipper",
    "label": "60x bus"
   },
   {
    "a": "flipper",
    "b": "ram",
    "label": "1T-SRAM"
   },
   {
    "a": "flipper",
    "b": "aram",
    "label": "ARAM"
   },
   {
    "a": "ipl",
    "b": "flipper",
    "label": "EXI"
   },
   {
    "a": "flipper",
    "b": "ave",
    "label": "digital video"
   },
   {
    "a": "ave",
    "b": "av",
    "label": "analog"
   },
   {
    "a": "ser",
    "b": "flipper",
    "label": "EXI"
   },
   {
    "a": "psu",
    "b": "fan",
    "label": "12 V"
   }
  ]
 },
 {
  "id": "x360",
  "name": "Microsoft Xbox 360",
  "maker": "Microsoft",
  "year": 2005,
  "short": "Xbox 360",
  "board": "Xenon → Zephyr → Falcon → Jasper → Trinity (S) → Corona (E)",
  "summary": "Tri-core PowerPC console. Early boards suffered 'Red Ring of Death' (BGA solder failure).",
  "comps": [
   {
    "id": "pad",
    "name": "Wireless/RF board",
    "pn": "RF module (front panel)",
    "cat": "io",
    "pkg": "module",
    "x": 0,
    "y": 0,
    "use": "Power button, ring of light and wireless controller radio.",
    "notes": "",
    "q": "Xbox 360 RF module",
    "src": "mech",
    "verify": false
   },
   {
    "id": "dvd",
    "name": "DVD drive",
    "pn": "Hitachi-LG GDR-3120L / Samsung TS-H943 / BenQ VAD6038 / Lite-On DG-16D2S",
    "cat": "media",
    "pkg": "drive",
    "x": 2,
    "y": 0,
    "use": "SATA DVD drive.",
    "notes": "Drive firmware/key is paired to the console; keep the original PCB when swapping.",
    "q": "Xbox 360 Lite-On DG-16D2S",
    "src": "mech",
    "verify": false
   },
   {
    "id": "hdd",
    "name": "Hard drive",
    "pn": "2.5\" SATA in Xbox 360 HDD enclosure",
    "cat": "storage",
    "pkg": "hdd",
    "x": 3,
    "y": 0,
    "use": "20–500 GB removable drive.",
    "notes": "",
    "q": "Xbox 360 hard drive",
    "src": "mech",
    "verify": false
   },
   {
    "id": "psu",
    "name": "Power brick",
    "pn": "External PSU (203 W Xenon / 175 W Falcon / 150 W Jasper)",
    "cat": "power",
    "pkg": "psu",
    "x": 4,
    "y": 0,
    "use": "External 12 V brick; wattage matched to board.",
    "notes": "Use a PSU rated for your board revision.",
    "q": "Xbox 360 power supply brick",
    "src": "mech",
    "verify": true
   },
   {
    "id": "cpu",
    "name": "CPU",
    "pn": "IBM Xenon (3-core PowerPC, 3.2 GHz)",
    "cat": "cpu",
    "pkg": "bga",
    "x": 1,
    "y": 1,
    "use": "Three in-order cores with 2 threads each.",
    "notes": "",
    "q": "Xbox 360 CPU",
    "src": "custom",
    "verify": false
   },
   {
    "id": "xenos",
    "name": "GPU",
    "pn": "ATI Xenos (500 MHz) + 10 MB eDRAM daughter die",
    "cat": "gpu",
    "pkg": "bga",
    "x": 2,
    "y": 1,
    "use": "Unified shader GPU and memory controller; eDRAM for framebuffer.",
    "notes": "Main RROD failure point (GPU BGA).",
    "q": "Xbox 360 GPU",
    "src": "custom",
    "verify": false
   },
   {
    "id": "clamp",
    "name": "X-clamps / heatsinks",
    "pn": "X-clamp and heatsink assembly",
    "cat": "power",
    "pkg": "module",
    "x": 3,
    "y": 1,
    "use": "Holds heatsinks to the CPU/GPU.",
    "notes": "Original X-clamps flex the board; replacement kits help but don't cure RROD.",
    "q": "Xbox 360 X-clamp",
    "src": "mech",
    "verify": false
   },
   {
    "id": "fan",
    "name": "Fans",
    "pn": "Dual 70 mm fans (fat)",
    "cat": "power",
    "pkg": "fan",
    "x": 4,
    "y": 1,
    "use": "Cooling.",
    "notes": "",
    "q": "Xbox 360 fan",
    "src": "mech",
    "verify": false
   },
   {
    "id": "sb",
    "name": "Southbridge + SMC",
    "pn": "Southbridge (with SMC)",
    "cat": "io",
    "pkg": "bga",
    "x": 0,
    "y": 1,
    "use": "USB, SATA, Ethernet, audio and power sequencing.",
    "notes": "",
    "q": "Xbox 360 southbridge",
    "src": "custom",
    "verify": false
   },
   {
    "id": "ram",
    "name": "Main RAM (512 MB)",
    "pn": "512 MB GDDR3",
    "cat": "mem",
    "pkg": "bga",
    "x": 2,
    "y": 2,
    "use": "Unified memory.",
    "notes": "",
    "q": "Xbox 360 GDDR3",
    "src": "custom",
    "verify": false
   },
   {
    "id": "nand",
    "name": "NAND flash",
    "pn": "16 MB NAND (256/512 MB on some Jasper)",
    "cat": "storage",
    "pkg": "sop",
    "x": 0,
    "y": 2,
    "use": "Boot loaders, kernel, keyvault.",
    "notes": "Back up the NAND before repairs; it holds console-unique keys.",
    "q": "Xbox 360 NAND",
    "src": "custom",
    "verify": false
   },
   {
    "id": "ana",
    "name": "Video encoder",
    "pn": "ANA (Xenon) → HANA (HDMI, Zephyr+)",
    "cat": "video",
    "pkg": "qfp",
    "x": 3,
    "y": 2,
    "use": "Analog/HDMI video output.",
    "notes": "",
    "q": "Xbox 360 HANA chip",
    "src": "custom",
    "verify": false
   },
   {
    "id": "av",
    "name": "AV / HDMI ports",
    "pn": "AV port + HDMI (Zephyr+)",
    "cat": "video",
    "pkg": "port",
    "x": 4,
    "y": 2,
    "use": "Component/composite/VGA; HDMI on later units.",
    "notes": "",
    "q": "Xbox 360 HDMI port",
    "src": "mech",
    "verify": false
   }
  ],
  "links": [
   {
    "a": "pad",
    "b": "sb",
    "label": "USB"
   },
   {
    "a": "dvd",
    "b": "sb",
    "label": "SATA"
   },
   {
    "a": "hdd",
    "b": "sb",
    "label": "SATA"
   },
   {
    "a": "cpu",
    "b": "xenos",
    "label": "FSB"
   },
   {
    "a": "xenos",
    "b": "ram",
    "label": "128-bit"
   },
   {
    "a": "xenos",
    "b": "sb",
    "label": "PCIe"
   },
   {
    "a": "nand",
    "b": "sb",
    "label": "flash"
   },
   {
    "a": "xenos",
    "b": "ana",
    "label": "video"
   },
   {
    "a": "ana",
    "b": "av",
    "label": "video"
   },
   {
    "a": "clamp",
    "b": "xenos",
    "label": "mount"
   },
   {
    "a": "psu",
    "b": "fan",
    "label": "12 V"
   }
  ]
 },
 {
  "id": "ps3",
  "name": "Sony PlayStation 3",
  "maker": "Sony",
  "year": 2006,
  "short": "PS3",
  "board": "CECHA (fat) → CECH-2000 (slim) → CECH-4000 (super slim)",
  "summary": "Cell Broadband Engine + NVIDIA RSX. Early fats suffer 'Yellow Light of Death' (BGA/solder and TIM).",
  "comps": [
   {
    "id": "pad",
    "name": "Bluetooth / Wi-Fi",
    "pn": "Bluetooth + Wi-Fi module",
    "cat": "io",
    "pkg": "module",
    "x": 0,
    "y": 0,
    "use": "DualShock 3 connection and wireless networking.",
    "notes": "",
    "q": "PS3 bluetooth wifi module",
    "src": "mech",
    "verify": false
   },
   {
    "id": "bd",
    "name": "Blu-ray drive / laser",
    "pn": "KES-400A (CECHA–E) / KES-410A (CECHG–L) / KES-450A (slim) / KES-850A (super slim)",
    "cat": "media",
    "pkg": "drive",
    "x": 2,
    "y": 0,
    "use": "BD/DVD/CD drive.",
    "notes": "Drive logic board is paired to the motherboard; swap only the laser/deck.",
    "q": "PS3 KES-410A",
    "src": "mech",
    "verify": true
   },
   {
    "id": "hdd",
    "name": "Hard drive",
    "pn": "2.5\" SATA HDD (user-replaceable)",
    "cat": "storage",
    "pkg": "hdd",
    "x": 3,
    "y": 0,
    "use": "Game data and OS.",
    "notes": "Any 2.5\" SATA up to 9.5 mm.",
    "q": "PS3 hard drive",
    "src": "mech",
    "verify": false
   },
   {
    "id": "psu",
    "name": "Power supply",
    "pn": "Internal PSU (APS-2xx fat / APS-250 / APS-270 slim)",
    "cat": "power",
    "pkg": "psu",
    "x": 4,
    "y": 0,
    "use": "Internal supply.",
    "notes": "Match the PSU model printed on the old unit.",
    "q": "PS3 power supply",
    "src": "mech",
    "verify": true
   },
   {
    "id": "cell",
    "name": "CPU",
    "pn": "Cell Broadband Engine (3.2 GHz, PPE + 7 SPE)",
    "cat": "cpu",
    "pkg": "bga",
    "x": 1,
    "y": 1,
    "use": "PowerPC core with 7 active SPE vector cores (1 reserved by OS).",
    "notes": "Delid/TIM replacement is a common fat-model service.",
    "q": "PS3 Cell processor",
    "src": "custom",
    "verify": false
   },
   {
    "id": "rsx",
    "name": "GPU",
    "pn": "NVIDIA RSX 'Reality Synthesizer' (550 MHz)",
    "cat": "gpu",
    "pkg": "bga",
    "x": 2,
    "y": 1,
    "use": "G70-derived GPU.",
    "notes": "Most frequent YLOD source on fat boards.",
    "q": "PS3 RSX",
    "src": "custom",
    "verify": false
   },
   {
    "id": "fan",
    "name": "Fan",
    "pn": "Blower fan",
    "cat": "power",
    "pkg": "fan",
    "x": 4,
    "y": 1,
    "use": "Cooling.",
    "notes": "",
    "q": "PS3 fan",
    "src": "mech",
    "verify": false
   },
   {
    "id": "sb",
    "name": "Southbridge",
    "pn": "Southbridge (Toshiba SCC)",
    "cat": "io",
    "pkg": "bga",
    "x": 0,
    "y": 1,
    "use": "USB, SATA, Ethernet, audio, card readers.",
    "notes": "",
    "q": "PS3 southbridge",
    "src": "custom",
    "verify": false
   },
   {
    "id": "xdr",
    "name": "Main RAM (256 MB)",
    "pn": "256 MB XDR DRAM",
    "cat": "mem",
    "pkg": "bga",
    "x": 1,
    "y": 2,
    "use": "Cell's main memory.",
    "notes": "",
    "q": "PS3 XDR",
    "src": "custom",
    "verify": false
   },
   {
    "id": "gddr",
    "name": "Video RAM (256 MB)",
    "pn": "256 MB GDDR3",
    "cat": "mem",
    "pkg": "bga",
    "x": 2,
    "y": 2,
    "use": "RSX local memory.",
    "notes": "",
    "q": "PS3 GDDR3",
    "src": "custom",
    "verify": false
   },
   {
    "id": "syscon",
    "name": "Syscon / flash",
    "pn": "Syscon MCU + NOR/NAND flash",
    "cat": "security",
    "pkg": "sop",
    "x": 0,
    "y": 2,
    "use": "Power control, error logs, firmware storage.",
    "notes": "Syscon error codes identify YLOD cause.",
    "q": "PS3 syscon",
    "src": "custom",
    "verify": false
   },
   {
    "id": "hdmi",
    "name": "HDMI port",
    "pn": "HDMI port (+ AV multi-out)",
    "cat": "video",
    "pkg": "port",
    "x": 3,
    "y": 2,
    "use": "HDMI 1.3 video/audio out.",
    "notes": "Broken HDMI ports are a common board repair.",
    "q": "PS3 HDMI port",
    "src": "mech",
    "verify": false
   }
  ],
  "links": [
   {
    "a": "pad",
    "b": "sb",
    "label": "USB/PCIe"
   },
   {
    "a": "bd",
    "b": "sb",
    "label": "SATA"
   },
   {
    "a": "hdd",
    "b": "sb",
    "label": "SATA"
   },
   {
    "a": "cell",
    "b": "rsx",
    "label": "FlexIO"
   },
   {
    "a": "cell",
    "b": "xdr",
    "label": "XDR"
   },
   {
    "a": "rsx",
    "b": "gddr",
    "label": "GDDR3"
   },
   {
    "a": "cell",
    "b": "sb",
    "label": "IOIF"
   },
   {
    "a": "syscon",
    "b": "sb",
    "label": "control"
   },
   {
    "a": "rsx",
    "b": "hdmi",
    "label": "video"
   },
   {
    "a": "psu",
    "b": "fan",
    "label": "12 V"
   }
  ]
 },
 {
  "id": "wii",
  "name": "Nintendo Wii",
  "maker": "Nintendo",
  "year": 2006,
  "short": "Wii",
  "board": "RVL-001 (GameCube-compatible), RVL-101",
  "summary": "Evolved GameCube architecture with motion controls via Bluetooth and an IR sensor bar.",
  "comps": [
   {
    "id": "bt",
    "name": "Bluetooth module",
    "pn": "Bluetooth module (Broadcom BCM2045-based)",
    "cat": "io",
    "pkg": "module",
    "x": 0,
    "y": 0,
    "use": "Wii Remote connection.",
    "notes": "",
    "q": "Wii bluetooth module",
    "src": "mech",
    "verify": false
   },
   {
    "id": "dvd",
    "name": "DVD drive / laser",
    "pn": "Wii drive (laser RAF-3350 / RAF-3355 family)",
    "cat": "media",
    "pkg": "drive",
    "x": 2,
    "y": 0,
    "use": "Slot-loading DVD-based drive.",
    "notes": "Check drive chip (D2A/D2B/D2C/D2E/D3) and laser fit before ordering.",
    "q": "Wii laser RAF-3350",
    "src": "mech",
    "verify": true
   },
   {
    "id": "psu",
    "name": "AC adapter",
    "pn": "RVL-002 (12 V DC 3.7 A)",
    "cat": "power",
    "pkg": "psu",
    "x": 4,
    "y": 0,
    "use": "External adapter.",
    "notes": "",
    "q": "Wii RVL-002 power supply",
    "src": "mech",
    "verify": false
   },
   {
    "id": "wifi",
    "name": "Wi-Fi module",
    "pn": "802.11b/g module",
    "cat": "io",
    "pkg": "module",
    "x": 0,
    "y": 1,
    "use": "Wireless networking.",
    "notes": "",
    "q": "Wii wifi module",
    "src": "mech",
    "verify": false
   },
   {
    "id": "cpu",
    "name": "CPU",
    "pn": "IBM Broadway (PowerPC, 729 MHz)",
    "cat": "cpu",
    "pkg": "bga",
    "x": 1,
    "y": 1,
    "use": "Faster Gekko derivative.",
    "notes": "",
    "q": "Wii Broadway",
    "src": "custom",
    "verify": false
   },
   {
    "id": "hollywood",
    "name": "GPU / system LSI",
    "pn": "ATI Hollywood (243 MHz) + 24 MB 1T-SRAM 'Napa'",
    "cat": "gpu",
    "pkg": "bga",
    "x": 2,
    "y": 1,
    "use": "GPU, audio DSP, I/O and Starlet ARM security core in a multi-chip module.",
    "notes": "",
    "q": "Wii Hollywood",
    "src": "custom",
    "verify": false
   },
   {
    "id": "fan",
    "name": "Fan",
    "pn": "Rear exhaust fan",
    "cat": "power",
    "pkg": "fan",
    "x": 4,
    "y": 1,
    "use": "Cooling.",
    "notes": "",
    "q": "Wii fan",
    "src": "mech",
    "verify": false
   },
   {
    "id": "nand",
    "name": "NAND flash (512 MB)",
    "pn": "512 MB NAND",
    "cat": "storage",
    "pkg": "sop",
    "x": 0,
    "y": 2,
    "use": "System menu, channels, saves.",
    "notes": "Back up NAND (BootMii) before repairs.",
    "q": "Wii NAND",
    "src": "custom",
    "verify": false
   },
   {
    "id": "gddr",
    "name": "Main RAM (64 MB)",
    "pn": "64 MB GDDR3",
    "cat": "mem",
    "pkg": "bga",
    "x": 1,
    "y": 2,
    "use": "Additional system memory.",
    "notes": "",
    "q": "Wii GDDR3",
    "src": "custom",
    "verify": false
   },
   {
    "id": "gcp",
    "name": "GameCube ports",
    "pn": "GC controller + memory card ports (RVL-001)",
    "cat": "io",
    "pkg": "port",
    "x": 2,
    "y": 2,
    "use": "Back-compat ports (top flap).",
    "notes": "Removed on RVL-101 Family Edition.",
    "q": "Wii GameCube controller port",
    "src": "mech",
    "verify": false
   },
   {
    "id": "av",
    "name": "AV multi-out",
    "pn": "Wii AV multi-out",
    "cat": "video",
    "pkg": "port",
    "x": 3,
    "y": 2,
    "use": "Composite/component/RGB 480p.",
    "notes": "",
    "q": "Wii component cable",
    "src": "mech",
    "verify": false
   },
   {
    "id": "bar",
    "name": "Sensor bar",
    "pn": "RVL-014 sensor bar",
    "cat": "io",
    "pkg": "controller",
    "x": 4,
    "y": 2,
    "use": "IR LED bar the Wii Remote camera tracks.",
    "notes": "",
    "q": "Wii sensor bar RVL-014",
    "src": "mech",
    "verify": false
   },
   {
    "id": "remote",
    "name": "Wii Remote",
    "pn": "RVL-003",
    "cat": "io",
    "pkg": "controller",
    "x": 0,
    "y": 3,
    "use": "Bluetooth controller with IR camera and accelerometer.",
    "notes": "",
    "q": "Wii Remote RVL-003",
    "src": "mech",
    "verify": false
   }
  ],
  "links": [
   {
    "a": "remote",
    "b": "bt",
    "label": "Bluetooth"
   },
   {
    "a": "bt",
    "b": "hollywood",
    "label": "USB"
   },
   {
    "a": "wifi",
    "b": "hollywood",
    "label": "SDIO"
   },
   {
    "a": "dvd",
    "b": "hollywood",
    "label": "DI"
   },
   {
    "a": "cpu",
    "b": "hollywood",
    "label": "60x bus"
   },
   {
    "a": "hollywood",
    "b": "gddr",
    "label": "GDDR3"
   },
   {
    "a": "nand",
    "b": "hollywood",
    "label": "NAND"
   },
   {
    "a": "gcp",
    "b": "hollywood",
    "label": "SI/EXI"
   },
   {
    "a": "hollywood",
    "b": "av",
    "label": "video+audio"
   },
   {
    "a": "bar",
    "b": "av",
    "label": "power"
   },
   {
    "a": "psu",
    "b": "fan",
    "label": "12 V"
   }
  ]
 },
 {
  "id": "wiiu",
  "name": "Nintendo Wii U",
  "maker": "Nintendo",
  "year": 2012,
  "short": "Wii U",
  "board": "WUP-101 (Basic 8 GB / Deluxe 32 GB)",
  "summary": "Multi-chip module (Espresso CPU + Latte GPU) with a streaming tablet GamePad.",
  "comps": [
   {
    "id": "gp",
    "name": "GamePad",
    "pn": "WUP-010",
    "cat": "io",
    "pkg": "controller",
    "x": 0,
    "y": 0,
    "use": "Tablet controller receiving a 5 GHz video stream.",
    "notes": "Battery WUP-012 (1500 mAh) / WUP-013 (2550 mAh).",
    "q": "Wii U GamePad WUP-010",
    "src": "mech",
    "verify": false
   },
   {
    "id": "odd",
    "name": "Optical drive",
    "pn": "Wii U disc drive (Panasonic-made)",
    "cat": "media",
    "pkg": "drive",
    "x": 2,
    "y": 0,
    "use": "25 GB proprietary disc drive.",
    "notes": "Drive is paired to the console.",
    "q": "Wii U disc drive",
    "src": "mech",
    "verify": false
   },
   {
    "id": "psu",
    "name": "AC adapter",
    "pn": "WUP-002 (15 V DC 5 A)",
    "cat": "power",
    "pkg": "psu",
    "x": 4,
    "y": 0,
    "use": "External adapter.",
    "notes": "",
    "q": "Wii U WUP-002 power supply",
    "src": "mech",
    "verify": false
   },
   {
    "id": "wifi",
    "name": "Wireless modules",
    "pn": "GamePad 5 GHz link + Wi-Fi/Bluetooth",
    "cat": "io",
    "pkg": "module",
    "x": 0,
    "y": 1,
    "use": "GamePad streaming radio, Wi-Fi and Bluetooth.",
    "notes": "",
    "q": "Wii U wifi module",
    "src": "mech",
    "verify": false
   },
   {
    "id": "cpu",
    "name": "CPU",
    "pn": "IBM Espresso (3-core PowerPC, 1.24 GHz)",
    "cat": "cpu",
    "pkg": "bga",
    "x": 1,
    "y": 1,
    "use": "Tri-core Broadway derivative on the MCM.",
    "notes": "",
    "q": "Wii U Espresso",
    "src": "custom",
    "verify": false
   },
   {
    "id": "latte",
    "name": "GPU",
    "pn": "AMD Latte (550 MHz, 32 MB eDRAM)",
    "cat": "gpu",
    "pkg": "bga",
    "x": 2,
    "y": 1,
    "use": "GPU with embedded memory and Wii-mode logic.",
    "notes": "",
    "q": "Wii U Latte",
    "src": "custom",
    "verify": false
   },
   {
    "id": "fan",
    "name": "Fan",
    "pn": "Blower fan",
    "cat": "power",
    "pkg": "fan",
    "x": 4,
    "y": 1,
    "use": "Cooling.",
    "notes": "",
    "q": "Wii U fan",
    "src": "mech",
    "verify": false
   },
   {
    "id": "emmc",
    "name": "eMMC storage",
    "pn": "8 GB / 32 GB eMMC (Samsung or Hynix)",
    "cat": "storage",
    "pkg": "bga",
    "x": 0,
    "y": 2,
    "use": "System storage.",
    "notes": "Hynix eMMC units are failing with age; back up and consider replacement/redirect.",
    "q": "Wii U eMMC",
    "src": "custom",
    "verify": false
   },
   {
    "id": "ram",
    "name": "Main RAM (2 GB)",
    "pn": "2 GB DDR3 (4 chips)",
    "cat": "mem",
    "pkg": "bga",
    "x": 1,
    "y": 2,
    "use": "System memory (1 GB for games).",
    "notes": "",
    "q": "Wii U DDR3",
    "src": "custom",
    "verify": false
   },
   {
    "id": "hdmi",
    "name": "HDMI port",
    "pn": "HDMI + AV multi-out",
    "cat": "video",
    "pkg": "port",
    "x": 3,
    "y": 2,
    "use": "1080p HDMI and analog AV.",
    "notes": "",
    "q": "Wii U HDMI port",
    "src": "mech",
    "verify": false
   },
   {
    "id": "bar",
    "name": "Sensor bar",
    "pn": "RVL-014 sensor bar",
    "cat": "io",
    "pkg": "controller",
    "x": 4,
    "y": 2,
    "use": "Wii Remote IR bar.",
    "notes": "",
    "q": "Wii sensor bar RVL-014",
    "src": "mech",
    "verify": false
   }
  ],
  "links": [
   {
    "a": "gp",
    "b": "wifi",
    "label": "5 GHz stream"
   },
   {
    "a": "wifi",
    "b": "latte",
    "label": "SDIO/USB"
   },
   {
    "a": "odd",
    "b": "latte",
    "label": "SATA"
   },
   {
    "a": "cpu",
    "b": "latte",
    "label": "MCM link"
   },
   {
    "a": "latte",
    "b": "ram",
    "label": "DDR3"
   },
   {
    "a": "emmc",
    "b": "latte",
    "label": "eMMC"
   },
   {
    "a": "latte",
    "b": "hdmi",
    "label": "video"
   },
   {
    "a": "bar",
    "b": "hdmi",
    "label": "power"
   },
   {
    "a": "psu",
    "b": "fan",
    "label": "12 V"
   }
  ]
 },
 {
  "id": "ps4",
  "name": "Sony PlayStation 4",
  "maker": "Sony",
  "year": 2013,
  "short": "PS4",
  "board": "CUH-1000/1100/1200 (original), CUH-2000 (slim), CUH-7000 (Pro)",
  "summary": "AMD Jaguar APU with GDDR5. Common repairs: HDMI port/encoder, disc drive, fan and thermal paste.",
  "comps": [
   {
    "id": "wifi",
    "name": "Wi-Fi / Bluetooth",
    "pn": "Wi-Fi/Bluetooth module",
    "cat": "io",
    "pkg": "module",
    "x": 0,
    "y": 0,
    "use": "DualShock 4 (CUH-ZCT1/ZCT2) and Wi-Fi.",
    "notes": "",
    "q": "PS4 wifi bluetooth module",
    "src": "mech",
    "verify": false
   },
   {
    "id": "bd",
    "name": "Blu-ray drive / laser",
    "pn": "BDP-010/015 (KES-490A laser) / BDP-020/025 (KES-860A laser)",
    "cat": "media",
    "pkg": "drive",
    "x": 2,
    "y": 0,
    "use": "BD drive.",
    "notes": "Drive logic board is paired to the console.",
    "q": "PS4 KES-490A",
    "src": "mech",
    "verify": true
   },
   {
    "id": "hdd",
    "name": "Hard drive",
    "pn": "500 GB 2.5\" SATA (user-replaceable)",
    "cat": "storage",
    "pkg": "hdd",
    "x": 3,
    "y": 0,
    "use": "Game/OS storage.",
    "notes": "Upgrade to SSD or larger HDD (max 9.5 mm).",
    "q": "PS4 hard drive",
    "src": "mech",
    "verify": false
   },
   {
    "id": "psu",
    "name": "Power supply",
    "pn": "Internal PSU (e.g. ADP-200ER / ADP-240CR / ADP-160CR slim)",
    "cat": "power",
    "pkg": "psu",
    "x": 4,
    "y": 0,
    "use": "Internal supply; model depends on CUH revision.",
    "notes": "Match the model printed on the original PSU.",
    "q": "PS4 ADP-240CR power supply",
    "src": "mech",
    "verify": true
   },
   {
    "id": "sb",
    "name": "Southbridge",
    "pn": "Aeolia (CUH-10xx) / Belize / Baikal",
    "cat": "io",
    "pkg": "bga",
    "x": 0,
    "y": 1,
    "use": "ARM-based southbridge: USB, SATA, network, standby downloads.",
    "notes": "",
    "q": "PS4 southbridge",
    "src": "custom",
    "verify": true
   },
   {
    "id": "apu",
    "name": "APU",
    "pn": "AMD 'Liverpool' (8-core Jaguar + 18 CU GCN), Sony CXD9002x",
    "cat": "cpu",
    "pkg": "bga",
    "x": 1,
    "y": 1,
    "use": "CPU and GPU on one die.",
    "notes": "Overheating: replace thermal paste, clean fan.",
    "q": "PS4 APU",
    "src": "custom",
    "verify": true
   },
   {
    "id": "ram",
    "name": "Main RAM (8 GB)",
    "pn": "8 GB GDDR5",
    "cat": "mem",
    "pkg": "bga",
    "x": 2,
    "y": 1,
    "use": "Unified memory at 176 GB/s.",
    "notes": "",
    "q": "PS4 GDDR5",
    "src": "custom",
    "verify": false
   },
   {
    "id": "fan",
    "name": "Fan",
    "pn": "Blower fan",
    "cat": "power",
    "pkg": "fan",
    "x": 4,
    "y": 1,
    "use": "Cooling.",
    "notes": "",
    "q": "PS4 fan",
    "src": "mech",
    "verify": false
   },
   {
    "id": "hdmic",
    "name": "HDMI encoder/retimer",
    "pn": "Panasonic MN86471A (CUH-10xx/11xx) / MN864729 (CUH-12xx+)",
    "cat": "video",
    "pkg": "qfp",
    "x": 2,
    "y": 2,
    "use": "Converts APU display output to HDMI.",
    "notes": "Fails after HDMI cable yanks/surges; 'no video' fix.",
    "q": "MN864729",
    "src": "custom",
    "verify": true
   },
   {
    "id": "hdmi",
    "name": "HDMI port",
    "pn": "PS4 HDMI port",
    "cat": "video",
    "pkg": "port",
    "x": 3,
    "y": 2,
    "use": "HDMI out.",
    "notes": "Most common board repair (bent pins / broken port).",
    "q": "PS4 HDMI port",
    "src": "mech",
    "verify": false
   },
   {
    "id": "flash",
    "name": "System flash",
    "pn": "NOR/NAND system flash",
    "cat": "security",
    "pkg": "sop",
    "x": 0,
    "y": 2,
    "use": "Boot firmware and console keys.",
    "notes": "",
    "q": "PS4 NOR flash",
    "src": "custom",
    "verify": false
   }
  ],
  "links": [
   {
    "a": "wifi",
    "b": "sb",
    "label": "USB/SDIO"
   },
   {
    "a": "bd",
    "b": "sb",
    "label": "SATA"
   },
   {
    "a": "hdd",
    "b": "sb",
    "label": "SATA"
   },
   {
    "a": "sb",
    "b": "apu",
    "label": "PCIe"
   },
   {
    "a": "apu",
    "b": "ram",
    "label": "256-bit GDDR5"
   },
   {
    "a": "apu",
    "b": "hdmic",
    "label": "DisplayPort"
   },
   {
    "a": "hdmic",
    "b": "hdmi",
    "label": "HDMI"
   },
   {
    "a": "flash",
    "b": "sb",
    "label": "SPI"
   },
   {
    "a": "psu",
    "b": "fan",
    "label": "12 V"
   }
  ]
 },
 {
  "id": "xone",
  "name": "Microsoft Xbox One",
  "maker": "Microsoft",
  "year": 2013,
  "short": "Xbox One",
  "board": "Original (2013), One S (2016), One X (2017)",
  "summary": "AMD Jaguar APU with DDR3 + 32 MB ESRAM; HDMI pass-through input on the original model.",
  "comps": [
   {
    "id": "wifi",
    "name": "Wi-Fi / Bluetooth",
    "pn": "Marvell Avastar 88W8897-based module",
    "cat": "io",
    "pkg": "module",
    "x": 0,
    "y": 0,
    "use": "Wi-Fi and controller radio.",
    "notes": "",
    "q": "Xbox One wifi module",
    "src": "mech",
    "verify": true
   },
   {
    "id": "bd",
    "name": "Blu-ray drive",
    "pn": "Lite-On DG-6M1S (original) / DG-6M5S (One S)",
    "cat": "media",
    "pkg": "drive",
    "x": 2,
    "y": 0,
    "use": "BD drive.",
    "notes": "Drive logic board is paired; keep the original board.",
    "q": "Xbox One DG-6M1S",
    "src": "mech",
    "verify": false
   },
   {
    "id": "hdd",
    "name": "Hard drive",
    "pn": "500 GB / 1 TB 2.5\" SATA",
    "cat": "storage",
    "pkg": "hdd",
    "x": 3,
    "y": 0,
    "use": "Internal storage.",
    "notes": "",
    "q": "Xbox One hard drive",
    "src": "mech",
    "verify": false
   },
   {
    "id": "psu",
    "name": "Power supply",
    "pn": "External brick (original) / internal PSU (One S/X)",
    "cat": "power",
    "pkg": "psu",
    "x": 4,
    "y": 0,
    "use": "Power.",
    "notes": "",
    "q": "Xbox One power brick",
    "src": "mech",
    "verify": false
   },
   {
    "id": "sb",
    "name": "Southbridge",
    "pn": "Southbridge (Microsoft)",
    "cat": "io",
    "pkg": "bga",
    "x": 0,
    "y": 1,
    "use": "USB, SATA, Ethernet.",
    "notes": "",
    "q": "Xbox One southbridge",
    "src": "custom",
    "verify": false
   },
   {
    "id": "apu",
    "name": "APU",
    "pn": "AMD 'Durango' (8-core Jaguar 1.75 GHz + 12 CU GCN, 32 MB ESRAM)",
    "cat": "cpu",
    "pkg": "bga",
    "x": 1,
    "y": 1,
    "use": "CPU+GPU with on-die ESRAM.",
    "notes": "",
    "q": "Xbox One APU",
    "src": "custom",
    "verify": false
   },
   {
    "id": "ram",
    "name": "Main RAM (8 GB)",
    "pn": "8 GB DDR3-2133",
    "cat": "mem",
    "pkg": "bga",
    "x": 2,
    "y": 1,
    "use": "System memory.",
    "notes": "",
    "q": "Xbox One DDR3",
    "src": "custom",
    "verify": false
   },
   {
    "id": "fan",
    "name": "Fan",
    "pn": "Axial fan",
    "cat": "power",
    "pkg": "fan",
    "x": 4,
    "y": 1,
    "use": "Cooling.",
    "notes": "",
    "q": "Xbox One fan",
    "src": "mech",
    "verify": false
   },
   {
    "id": "hdmi",
    "name": "HDMI in/out",
    "pn": "HDMI ports + retimer",
    "cat": "video",
    "pkg": "port",
    "x": 3,
    "y": 2,
    "use": "HDMI out and HDMI in (TV pass-through).",
    "notes": "Damaged HDMI port is common.",
    "q": "Xbox One HDMI port",
    "src": "mech",
    "verify": false
   },
   {
    "id": "kinect",
    "name": "Kinect port",
    "pn": "Kinect port (original model)",
    "cat": "io",
    "pkg": "port",
    "x": 0,
    "y": 2,
    "use": "Kinect 2 sensor port (adapter on One S/X).",
    "notes": "",
    "q": "Xbox One Kinect adapter",
    "src": "mech",
    "verify": false
   }
  ],
  "links": [
   {
    "a": "wifi",
    "b": "sb",
    "label": "USB"
   },
   {
    "a": "bd",
    "b": "sb",
    "label": "SATA"
   },
   {
    "a": "hdd",
    "b": "sb",
    "label": "SATA"
   },
   {
    "a": "sb",
    "b": "apu",
    "label": "PCIe"
   },
   {
    "a": "apu",
    "b": "ram",
    "label": "256-bit DDR3"
   },
   {
    "a": "apu",
    "b": "hdmi",
    "label": "video"
   },
   {
    "a": "kinect",
    "b": "sb",
    "label": "USB 3"
   },
   {
    "a": "psu",
    "b": "fan",
    "label": "12 V"
   }
  ]
 },
 {
  "id": "switch",
  "name": "Nintendo Switch",
  "maker": "Nintendo",
  "year": 2017,
  "short": "Switch",
  "board": "HAC-001 (2017), HAC-001(-01) (2019), HEG-001 (OLED)",
  "summary": "Hybrid console on NVIDIA Tegra X1. USB-C power/video ICs are the most common board repairs.",
  "comps": [
   {
    "id": "usbc",
    "name": "USB-C port",
    "pn": "Switch USB-C charging port",
    "cat": "io",
    "pkg": "port",
    "x": 0,
    "y": 0,
    "use": "Charging and dock video/USB.",
    "notes": "Bent or worn port — replace, then check M92T36/BQ24193.",
    "q": "Nintendo Switch USB-C port",
    "src": "mech",
    "verify": false
   },
   {
    "id": "pd",
    "name": "USB-C PD / video controller",
    "pn": "M92T36",
    "cat": "power",
    "pkg": "qfp",
    "x": 1,
    "y": 0,
    "use": "USB Power Delivery and DisplayPort alt-mode controller.",
    "notes": "Notorious failure with third-party docks: no charge / no dock video.",
    "q": "M92T36",
    "src": "custom",
    "verify": false
   },
   {
    "id": "mux",
    "name": "USB-C mux",
    "pn": "PI3USB30532",
    "cat": "video",
    "pkg": "qfp",
    "x": 2,
    "y": 0,
    "use": "Switches USB 3/DisplayPort lanes on the USB-C port.",
    "notes": "Fails alongside M92T36 in dock failures.",
    "q": "PI3USB30532",
    "src": "custom",
    "verify": false
   },
   {
    "id": "chg",
    "name": "Charging IC",
    "pn": "TI BQ24193",
    "cat": "power",
    "pkg": "qfp",
    "x": 3,
    "y": 0,
    "use": "Battery charger.",
    "notes": "Shorts here = no charging / hot board.",
    "q": "BQ24193",
    "src": "std",
    "verify": false
   },
   {
    "id": "batt",
    "name": "Battery",
    "pn": "HAC-003 (4310 mAh)",
    "cat": "power",
    "pkg": "battery",
    "x": 4,
    "y": 0,
    "use": "Li-ion battery.",
    "notes": "",
    "q": "Nintendo Switch HAC-003 battery",
    "src": "mech",
    "verify": false
   },
   {
    "id": "soc",
    "name": "SoC",
    "pn": "NVIDIA Tegra X1 (ODNX02-A2) / Tegra X1+ 'Mariko' (ODNX10)",
    "cat": "cpu",
    "pkg": "bga",
    "x": 1,
    "y": 1,
    "use": "4× Cortex-A57 CPU + 256-core Maxwell GPU.",
    "notes": "",
    "q": "Nintendo Switch Tegra X1",
    "src": "custom",
    "verify": false
   },
   {
    "id": "ram",
    "name": "RAM (4 GB)",
    "pn": "4 GB LPDDR4 (2 chips)",
    "cat": "mem",
    "pkg": "bga",
    "x": 2,
    "y": 1,
    "use": "System memory.",
    "notes": "",
    "q": "Nintendo Switch LPDDR4",
    "src": "custom",
    "verify": false
   },
   {
    "id": "pmic",
    "name": "PMIC",
    "pn": "MAX77620 (+ MAX77621 CPU/GPU regulators)",
    "cat": "power",
    "pkg": "bga",
    "x": 3,
    "y": 1,
    "use": "Power management for the SoC and rails.",
    "notes": "",
    "q": "MAX77620",
    "src": "std",
    "verify": false
   },
   {
    "id": "fan",
    "name": "Fan / heatsink",
    "pn": "Switch cooling fan",
    "cat": "power",
    "pkg": "fan",
    "x": 4,
    "y": 1,
    "use": "Cooling (handheld and dock).",
    "notes": "",
    "q": "Nintendo Switch fan",
    "src": "mech",
    "verify": false
   },
   {
    "id": "cart",
    "name": "Game card slot",
    "pn": "Game card reader slot",
    "cat": "media",
    "pkg": "card",
    "x": 0,
    "y": 1,
    "use": "Reads Switch game cards.",
    "notes": "Bent pins = 'game card could not be read'.",
    "q": "Nintendo Switch game card slot",
    "src": "mech",
    "verify": false
   },
   {
    "id": "emmc",
    "name": "eMMC storage",
    "pn": "32 GB eMMC (64 GB on OLED)",
    "cat": "storage",
    "pkg": "bga",
    "x": 1,
    "y": 2,
    "use": "System/game storage.",
    "notes": "",
    "q": "Nintendo Switch eMMC",
    "src": "custom",
    "verify": false
   },
   {
    "id": "sd",
    "name": "microSD slot",
    "pn": "microSD card reader",
    "cat": "storage",
    "pkg": "card",
    "x": 0,
    "y": 2,
    "use": "Expandable storage (often combined with headphone jack board).",
    "notes": "",
    "q": "Nintendo Switch microSD reader",
    "src": "mech",
    "verify": false
   },
   {
    "id": "lcd",
    "name": "Display",
    "pn": "6.2\" 720p LCD (7\" OLED on HEG-001) + digitizer",
    "cat": "video",
    "pkg": "display",
    "x": 2,
    "y": 2,
    "use": "Screen and touch.",
    "notes": "",
    "q": "Nintendo Switch LCD screen",
    "src": "mech",
    "verify": false
   },
   {
    "id": "joy",
    "name": "Joy-Con rails / Joy-Con",
    "pn": "Joy-Con rail connectors; Joy-Con HAC-015/016",
    "cat": "io",
    "pkg": "controller",
    "x": 3,
    "y": 2,
    "use": "Controller rails and the Joy-Con themselves.",
    "notes": "Stick drift: replace the analog stick module.",
    "q": "Joy-Con analog stick replacement",
    "src": "mech",
    "verify": false
   },
   {
    "id": "adp",
    "name": "AC adapter",
    "pn": "HAC-002 (15 V 2.6 A USB-C)",
    "cat": "power",
    "pkg": "psu",
    "x": 4,
    "y": 2,
    "use": "Official charger.",
    "notes": "Use official or spec-compliant adapters to avoid PD chip damage.",
    "q": "Nintendo Switch HAC-002",
    "src": "mech",
    "verify": false
   }
  ],
  "links": [
   {
    "a": "usbc",
    "b": "pd",
    "label": "CC / PD"
   },
   {
    "a": "usbc",
    "b": "mux",
    "label": "SS lanes"
   },
   {
    "a": "pd",
    "b": "chg",
    "label": "VBUS"
   },
   {
    "a": "chg",
    "b": "batt",
    "label": "charge"
   },
   {
    "a": "mux",
    "b": "soc",
    "label": "DP / USB3"
   },
   {
    "a": "soc",
    "b": "ram",
    "label": "LPDDR4"
   },
   {
    "a": "pmic",
    "b": "soc",
    "label": "rails"
   },
   {
    "a": "cart",
    "b": "soc",
    "label": "game card"
   },
   {
    "a": "soc",
    "b": "emmc",
    "label": "eMMC"
   },
   {
    "a": "sd",
    "b": "soc",
    "label": "SDMMC"
   },
   {
    "a": "soc",
    "b": "lcd",
    "label": "MIPI DSI"
   },
   {
    "a": "joy",
    "b": "soc",
    "label": "UART"
   },
   {
    "a": "adp",
    "b": "usbc",
    "label": "15 V PD"
   }
  ]
 },
 {
  "id": "xsx",
  "name": "Microsoft Xbox Series X",
  "maker": "Microsoft",
  "year": 2020,
  "short": "Xbox Series X",
  "board": "Model 1882",
  "summary": "Zen 2 + RDNA 2 SoC with GDDR6 and a custom NVMe SSD. Internal PSU, 130 mm top fan.",
  "comps": [
   {
    "id": "wifi",
    "name": "Wi-Fi / Bluetooth",
    "pn": "Wi-Fi 5 + Xbox Wireless radio",
    "cat": "io",
    "pkg": "module",
    "x": 0,
    "y": 0,
    "use": "Controller radio and networking.",
    "notes": "",
    "q": "Xbox Series X wifi module",
    "src": "mech",
    "verify": false
   },
   {
    "id": "bd",
    "name": "4K UHD Blu-ray drive",
    "pn": "UHD Blu-ray drive",
    "cat": "media",
    "pkg": "drive",
    "x": 2,
    "y": 0,
    "use": "Disc drive.",
    "notes": "Drive board paired to console.",
    "q": "Xbox Series X disc drive",
    "src": "mech",
    "verify": false
   },
   {
    "id": "ssd",
    "name": "Internal SSD",
    "pn": "1 TB NVMe SSD (M.2 2230 module)",
    "cat": "storage",
    "pkg": "ssd",
    "x": 3,
    "y": 0,
    "use": "System storage.",
    "notes": "",
    "q": "Xbox Series X internal SSD 2230",
    "src": "mech",
    "verify": false
   },
   {
    "id": "psu",
    "name": "Power supply",
    "pn": "Internal 315 W PSU",
    "cat": "power",
    "pkg": "psu",
    "x": 4,
    "y": 0,
    "use": "Internal supply.",
    "notes": "",
    "q": "Xbox Series X power supply",
    "src": "mech",
    "verify": false
   },
   {
    "id": "exp",
    "name": "Storage expansion slot",
    "pn": "Storage Expansion Card slot (CFexpress-based)",
    "cat": "storage",
    "pkg": "card",
    "x": 0,
    "y": 1,
    "use": "Proprietary expansion cards.",
    "notes": "",
    "q": "Xbox Series X storage expansion card",
    "src": "mech",
    "verify": false
   },
   {
    "id": "soc",
    "name": "SoC",
    "pn": "AMD custom 'Scarlett' (8-core Zen 2 3.8 GHz + 52 CU RDNA 2)",
    "cat": "cpu",
    "pkg": "bga",
    "x": 1,
    "y": 1,
    "use": "CPU+GPU, 12 TFLOPS.",
    "notes": "",
    "q": "Xbox Series X APU",
    "src": "custom",
    "verify": false
   },
   {
    "id": "ram",
    "name": "RAM (16 GB)",
    "pn": "16 GB GDDR6 (10 chips, 320-bit)",
    "cat": "mem",
    "pkg": "bga",
    "x": 2,
    "y": 1,
    "use": "10 GB fast + 6 GB standard.",
    "notes": "",
    "q": "Xbox Series X GDDR6",
    "src": "custom",
    "verify": false
   },
   {
    "id": "fan",
    "name": "Fan",
    "pn": "130 mm top fan",
    "cat": "power",
    "pkg": "fan",
    "x": 4,
    "y": 1,
    "use": "Cooling.",
    "notes": "",
    "q": "Xbox Series X fan",
    "src": "mech",
    "verify": false
   },
   {
    "id": "sb",
    "name": "Southbridge",
    "pn": "Southbridge (Microsoft)",
    "cat": "io",
    "pkg": "bga",
    "x": 0,
    "y": 2,
    "use": "USB, network, front panel.",
    "notes": "",
    "q": "Xbox Series X southbridge",
    "src": "custom",
    "verify": false
   },
   {
    "id": "hdmi",
    "name": "HDMI 2.1 port",
    "pn": "HDMI 2.1 port + retimer",
    "cat": "video",
    "pkg": "port",
    "x": 3,
    "y": 2,
    "use": "4K120 output.",
    "notes": "Broken HDMI port is the common board repair.",
    "q": "Xbox Series X HDMI port",
    "src": "mech",
    "verify": false
   }
  ],
  "links": [
   {
    "a": "wifi",
    "b": "sb",
    "label": "PCIe/USB"
   },
   {
    "a": "bd",
    "b": "sb",
    "label": "SATA"
   },
   {
    "a": "ssd",
    "b": "soc",
    "label": "PCIe 4.0 x2"
   },
   {
    "a": "exp",
    "b": "soc",
    "label": "PCIe 4.0"
   },
   {
    "a": "soc",
    "b": "ram",
    "label": "320-bit"
   },
   {
    "a": "sb",
    "b": "soc",
    "label": "PCIe"
   },
   {
    "a": "soc",
    "b": "hdmi",
    "label": "HDMI 2.1"
   },
   {
    "a": "psu",
    "b": "fan",
    "label": "12 V"
   }
  ]
 },
 {
  "id": "xss",
  "name": "Microsoft Xbox Series S",
  "maker": "Microsoft",
  "year": 2020,
  "short": "Xbox Series S",
  "board": "Model 1883",
  "summary": "Smaller digital-only sibling of the Series X with a lower-clocked GPU.",
  "comps": [
   {
    "id": "wifi",
    "name": "Wi-Fi / Bluetooth",
    "pn": "Wi-Fi 5 + Xbox Wireless radio",
    "cat": "io",
    "pkg": "module",
    "x": 0,
    "y": 0,
    "use": "Controller radio and networking.",
    "notes": "",
    "q": "Xbox Series S wifi module",
    "src": "mech",
    "verify": false
   },
   {
    "id": "ssd",
    "name": "Internal SSD",
    "pn": "512 GB (or 1 TB) NVMe SSD (M.2 2230)",
    "cat": "storage",
    "pkg": "ssd",
    "x": 2,
    "y": 0,
    "use": "System storage.",
    "notes": "",
    "q": "Xbox Series S internal SSD",
    "src": "mech",
    "verify": false
   },
   {
    "id": "psu",
    "name": "Power supply",
    "pn": "Internal PSU (~165 W)",
    "cat": "power",
    "pkg": "psu",
    "x": 4,
    "y": 0,
    "use": "Internal supply.",
    "notes": "",
    "q": "Xbox Series S power supply",
    "src": "mech",
    "verify": true
   },
   {
    "id": "exp",
    "name": "Storage expansion slot",
    "pn": "Storage Expansion Card slot",
    "cat": "storage",
    "pkg": "card",
    "x": 0,
    "y": 1,
    "use": "Proprietary expansion.",
    "notes": "",
    "q": "Xbox Series S expansion card",
    "src": "mech",
    "verify": false
   },
   {
    "id": "soc",
    "name": "SoC",
    "pn": "AMD custom 'Lockhart' (8-core Zen 2 3.6 GHz + 20 CU RDNA 2)",
    "cat": "cpu",
    "pkg": "bga",
    "x": 1,
    "y": 1,
    "use": "CPU+GPU, 4 TFLOPS.",
    "notes": "",
    "q": "Xbox Series S APU",
    "src": "custom",
    "verify": false
   },
   {
    "id": "ram",
    "name": "RAM (10 GB)",
    "pn": "10 GB GDDR6",
    "cat": "mem",
    "pkg": "bga",
    "x": 2,
    "y": 1,
    "use": "8 GB fast + 2 GB standard.",
    "notes": "",
    "q": "Xbox Series S GDDR6",
    "src": "custom",
    "verify": false
   },
   {
    "id": "fan",
    "name": "Fan",
    "pn": "Side exhaust fan",
    "cat": "power",
    "pkg": "fan",
    "x": 4,
    "y": 1,
    "use": "Cooling.",
    "notes": "",
    "q": "Xbox Series S fan",
    "src": "mech",
    "verify": false
   },
   {
    "id": "hdmi",
    "name": "HDMI port",
    "pn": "HDMI 2.1 port",
    "cat": "video",
    "pkg": "port",
    "x": 3,
    "y": 2,
    "use": "Video out.",
    "notes": "",
    "q": "Xbox Series S HDMI port",
    "src": "mech",
    "verify": false
   }
  ],
  "links": [
   {
    "a": "wifi",
    "b": "soc",
    "label": "PCIe"
   },
   {
    "a": "ssd",
    "b": "soc",
    "label": "PCIe 4.0"
   },
   {
    "a": "exp",
    "b": "soc",
    "label": "PCIe 4.0"
   },
   {
    "a": "soc",
    "b": "ram",
    "label": "128-bit"
   },
   {
    "a": "soc",
    "b": "hdmi",
    "label": "HDMI"
   },
   {
    "a": "psu",
    "b": "fan",
    "label": "12 V"
   }
  ]
 },
 {
  "id": "ps5",
  "name": "Sony PlayStation 5",
  "maker": "Sony",
  "year": 2020,
  "short": "PS5",
  "board": "CFI-10xx/11xx/12xx (launch), CFI-20xx (slim), CFI-70xx (Pro)",
  "summary": "AMD 'Oberon' SoC with a custom 825 GB SSD and liquid-metal thermal interface.",
  "comps": [
   {
    "id": "wifi",
    "name": "Wi-Fi 6 / Bluetooth 5.1",
    "pn": "Wi-Fi/BT module",
    "cat": "io",
    "pkg": "module",
    "x": 0,
    "y": 0,
    "use": "DualSense (CFI-ZCT1) and networking.",
    "notes": "",
    "q": "PS5 wifi module",
    "src": "mech",
    "verify": false
   },
   {
    "id": "bd",
    "name": "UHD Blu-ray drive",
    "pn": "PS5 Ultra HD Blu-ray drive (detachable on slim)",
    "cat": "media",
    "pkg": "drive",
    "x": 2,
    "y": 0,
    "use": "Disc drive.",
    "notes": "Drive board is paired to the console.",
    "q": "PS5 disc drive",
    "src": "mech",
    "verify": false
   },
   {
    "id": "m2",
    "name": "M.2 expansion slot",
    "pn": "M.2 2230–22110 PCIe 4.0 NVMe",
    "cat": "storage",
    "pkg": "ssd",
    "x": 3,
    "y": 0,
    "use": "User storage expansion.",
    "notes": "Use a heatsinked Gen4 drive (5,500 MB/s+ recommended).",
    "q": "PS5 M.2 SSD heatsink",
    "src": "mech",
    "verify": false
   },
   {
    "id": "psu",
    "name": "Power supply",
    "pn": "Internal PSU (ADP-400DR / ADP-400FR on launch models)",
    "cat": "power",
    "pkg": "psu",
    "x": 4,
    "y": 0,
    "use": "Internal supply.",
    "notes": "Match PSU model to your CFI revision.",
    "q": "PS5 ADP-400DR",
    "src": "mech",
    "verify": true
   },
   {
    "id": "ssdc",
    "name": "SSD controller + NAND",
    "pn": "Custom 12-channel SSD controller + soldered NAND (825 GB)",
    "cat": "storage",
    "pkg": "bga",
    "x": 0,
    "y": 1,
    "use": "5.5 GB/s raw internal storage.",
    "notes": "Soldered; not user-replaceable.",
    "q": "PS5 SSD controller",
    "src": "custom",
    "verify": false
   },
   {
    "id": "soc",
    "name": "SoC",
    "pn": "AMD 'Oberon' (Sony CXD90060GG; 8-core Zen 2 + 36 CU RDNA 2)",
    "cat": "cpu",
    "pkg": "bga",
    "x": 1,
    "y": 1,
    "use": "CPU+GPU, 10.28 TFLOPS.",
    "notes": "Liquid metal TIM — don't remove the shield unless necessary.",
    "q": "PS5 APU CXD90060GG",
    "src": "custom",
    "verify": true
   },
   {
    "id": "ram",
    "name": "RAM (16 GB)",
    "pn": "16 GB GDDR6 (8 chips, 256-bit)",
    "cat": "mem",
    "pkg": "bga",
    "x": 2,
    "y": 1,
    "use": "Unified memory at 448 GB/s.",
    "notes": "",
    "q": "PS5 GDDR6",
    "src": "custom",
    "verify": false
   },
   {
    "id": "fan",
    "name": "Fan",
    "pn": "120 mm blower fan",
    "cat": "power",
    "pkg": "fan",
    "x": 4,
    "y": 1,
    "use": "Cooling.",
    "notes": "",
    "q": "PS5 fan",
    "src": "mech",
    "verify": false
   },
   {
    "id": "hdmic",
    "name": "HDMI retimer",
    "pn": "Panasonic MN864739",
    "cat": "video",
    "pkg": "qfp",
    "x": 2,
    "y": 2,
    "use": "HDMI 2.1 signal conditioning.",
    "notes": "Frequent 'no video' failure with the HDMI port.",
    "q": "MN864739",
    "src": "custom",
    "verify": true
   },
   {
    "id": "hdmi",
    "name": "HDMI 2.1 port",
    "pn": "PS5 HDMI port",
    "cat": "video",
    "pkg": "port",
    "x": 3,
    "y": 2,
    "use": "4K120 / 8K out.",
    "notes": "Most common board repair.",
    "q": "PS5 HDMI port",
    "src": "mech",
    "verify": false
   },
   {
    "id": "sb",
    "name": "Southbridge",
    "pn": "Southbridge (Sony)",
    "cat": "io",
    "pkg": "bga",
    "x": 0,
    "y": 2,
    "use": "USB, LAN, standby.",
    "notes": "",
    "q": "PS5 southbridge",
    "src": "custom",
    "verify": false
   }
  ],
  "links": [
   {
    "a": "wifi",
    "b": "sb",
    "label": "PCIe"
   },
   {
    "a": "bd",
    "b": "sb",
    "label": "SATA"
   },
   {
    "a": "m2",
    "b": "soc",
    "label": "PCIe 4.0 x4"
   },
   {
    "a": "ssdc",
    "b": "soc",
    "label": "PCIe 4.0 x4"
   },
   {
    "a": "soc",
    "b": "ram",
    "label": "256-bit"
   },
   {
    "a": "sb",
    "b": "soc",
    "label": "PCIe"
   },
   {
    "a": "soc",
    "b": "hdmic",
    "label": "video"
   },
   {
    "a": "hdmic",
    "b": "hdmi",
    "label": "HDMI 2.1"
   },
   {
    "a": "psu",
    "b": "fan",
    "label": "12 V"
   }
  ]
 },
 {
  "id": "switch2",
  "name": "Nintendo Switch 2",
  "maker": "Nintendo",
  "year": 2025,
  "short": "Switch 2",
  "board": "BEE-001",
  "summary": "Hybrid console on NVIDIA's custom T239 SoC with magnetic Joy-Con 2 controllers.",
  "comps": [
   {
    "id": "usbc",
    "name": "USB-C ports",
    "pn": "USB-C ports ×2 (bottom + top)",
    "cat": "io",
    "pkg": "port",
    "x": 0,
    "y": 0,
    "use": "Charging, dock video, accessories.",
    "notes": "",
    "q": "Nintendo Switch 2 USB-C port",
    "src": "mech",
    "verify": false
   },
   {
    "id": "chg",
    "name": "Charging / PD",
    "pn": "USB-PD controller + charger",
    "cat": "power",
    "pkg": "qfp",
    "x": 1,
    "y": 0,
    "use": "Power delivery and charging.",
    "notes": "",
    "q": "Nintendo Switch 2 charging IC",
    "src": "custom",
    "verify": true
   },
   {
    "id": "batt",
    "name": "Battery",
    "pn": "5220 mAh Li-ion",
    "cat": "power",
    "pkg": "battery",
    "x": 4,
    "y": 0,
    "use": "Internal battery.",
    "notes": "",
    "q": "Nintendo Switch 2 battery",
    "src": "mech",
    "verify": false
   },
   {
    "id": "cart",
    "name": "Game card slot",
    "pn": "Game card reader (Switch 1 & 2 cards)",
    "cat": "media",
    "pkg": "card",
    "x": 0,
    "y": 1,
    "use": "Reads game cards and Game-Key cards.",
    "notes": "",
    "q": "Nintendo Switch 2 game card slot",
    "src": "mech",
    "verify": false
   },
   {
    "id": "soc",
    "name": "SoC",
    "pn": "NVIDIA T239 (8× Cortex-A78C + Ampere GPU, 1536 CUDA cores)",
    "cat": "cpu",
    "pkg": "bga",
    "x": 1,
    "y": 1,
    "use": "Custom Tegra SoC with DLSS support.",
    "notes": "",
    "q": "Nintendo Switch 2 T239",
    "src": "custom",
    "verify": true
   },
   {
    "id": "ram",
    "name": "RAM (12 GB)",
    "pn": "12 GB LPDDR5X",
    "cat": "mem",
    "pkg": "bga",
    "x": 2,
    "y": 1,
    "use": "System memory.",
    "notes": "",
    "q": "Nintendo Switch 2 LPDDR5X",
    "src": "custom",
    "verify": false
   },
   {
    "id": "fan",
    "name": "Fan",
    "pn": "Cooling fan",
    "cat": "power",
    "pkg": "fan",
    "x": 4,
    "y": 1,
    "use": "Cooling.",
    "notes": "",
    "q": "Nintendo Switch 2 fan",
    "src": "mech",
    "verify": false
   },
   {
    "id": "ufs",
    "name": "Internal storage",
    "pn": "256 GB UFS",
    "cat": "storage",
    "pkg": "bga",
    "x": 1,
    "y": 2,
    "use": "System storage.",
    "notes": "",
    "q": "Nintendo Switch 2 UFS",
    "src": "custom",
    "verify": false
   },
   {
    "id": "sd",
    "name": "microSD Express slot",
    "pn": "microSD Express reader",
    "cat": "storage",
    "pkg": "card",
    "x": 0,
    "y": 2,
    "use": "Expansion (microSD Express only for Switch 2 games).",
    "notes": "",
    "q": "microSD Express card",
    "src": "mech",
    "verify": false
   },
   {
    "id": "lcd",
    "name": "Display",
    "pn": "7.9\" 1080p 120 Hz LCD + touch",
    "cat": "video",
    "pkg": "display",
    "x": 2,
    "y": 2,
    "use": "Screen.",
    "notes": "",
    "q": "Nintendo Switch 2 screen",
    "src": "mech",
    "verify": false
   },
   {
    "id": "joy",
    "name": "Joy-Con 2",
    "pn": "Joy-Con 2 (magnetic) + rails",
    "cat": "io",
    "pkg": "controller",
    "x": 3,
    "y": 2,
    "use": "Magnetic controllers with mouse sensors.",
    "notes": "",
    "q": "Joy-Con 2 replacement",
    "src": "mech",
    "verify": false
   },
   {
    "id": "adp",
    "name": "AC adapter",
    "pn": "USB-C AC adapter",
    "cat": "power",
    "pkg": "psu",
    "x": 4,
    "y": 2,
    "use": "Official charger.",
    "notes": "",
    "q": "Nintendo Switch 2 AC adapter",
    "src": "mech",
    "verify": false
   }
  ],
  "links": [
   {
    "a": "usbc",
    "b": "chg",
    "label": "VBUS / PD"
   },
   {
    "a": "chg",
    "b": "batt",
    "label": "charge"
   },
   {
    "a": "usbc",
    "b": "soc",
    "label": "DP / USB"
   },
   {
    "a": "cart",
    "b": "soc",
    "label": "game card"
   },
   {
    "a": "soc",
    "b": "ram",
    "label": "LPDDR5X"
   },
   {
    "a": "soc",
    "b": "ufs",
    "label": "UFS"
   },
   {
    "a": "sd",
    "b": "soc",
    "label": "PCIe (SD Express)"
   },
   {
    "a": "soc",
    "b": "lcd",
    "label": "display"
   },
   {
    "a": "joy",
    "b": "soc",
    "label": "rails"
   },
   {
    "a": "adp",
    "b": "usbc",
    "label": "PD"
   }
  ]
 },
 {
  "id": "steammachine",
  "name": "Valve Steam Machine",
  "maker": "Valve",
  "year": 2026,
  "short": "Steam Machine",
  "board": "2026 release (512 GB / 2 TB)",
  "summary": "Compact SteamOS gaming PC/console with semi-custom AMD Zen 4 CPU and RDNA 3 GPU. Uses largely standard PC parts.",
  "comps": [
   {
    "id": "wifi",
    "name": "Wireless",
    "pn": "Wi-Fi 6E + Bluetooth 5.3 + Steam Controller radio",
    "cat": "io",
    "pkg": "module",
    "x": 0,
    "y": 0,
    "use": "Networking and controllers.",
    "notes": "",
    "q": "Steam Machine wifi",
    "src": "mech",
    "verify": true
   },
   {
    "id": "ssd",
    "name": "SSD",
    "pn": "512 GB / 2 TB M.2 NVMe SSD",
    "cat": "storage",
    "pkg": "ssd",
    "x": 2,
    "y": 0,
    "use": "System storage (user-replaceable).",
    "notes": "",
    "q": "Steam Machine SSD",
    "src": "mech",
    "verify": true
   },
   {
    "id": "sd",
    "name": "microSD slot",
    "pn": "microSD reader",
    "cat": "storage",
    "pkg": "card",
    "x": 3,
    "y": 0,
    "use": "Expansion storage.",
    "notes": "",
    "q": "microSD card",
    "src": "mech",
    "verify": false
   },
   {
    "id": "psu",
    "name": "Power supply",
    "pn": "Internal PSU",
    "cat": "power",
    "pkg": "psu",
    "x": 4,
    "y": 0,
    "use": "Internal supply.",
    "notes": "",
    "q": "Steam Machine power supply",
    "src": "mech",
    "verify": false
   },
   {
    "id": "cpu",
    "name": "CPU",
    "pn": "AMD semi-custom Zen 4 (6-core / 12-thread)",
    "cat": "cpu",
    "pkg": "bga",
    "x": 1,
    "y": 1,
    "use": "Main processor.",
    "notes": "",
    "q": "Steam Machine CPU",
    "src": "custom",
    "verify": true
   },
   {
    "id": "gpu",
    "name": "GPU",
    "pn": "AMD semi-custom RDNA 3 (28 CU)",
    "cat": "gpu",
    "pkg": "bga",
    "x": 2,
    "y": 1,
    "use": "Graphics, with its own GDDR6.",
    "notes": "",
    "q": "Steam Machine GPU",
    "src": "custom",
    "verify": true
   },
   {
    "id": "vram",
    "name": "Video RAM (8 GB)",
    "pn": "8 GB GDDR6",
    "cat": "mem",
    "pkg": "bga",
    "x": 3,
    "y": 1,
    "use": "GPU memory.",
    "notes": "",
    "q": "Steam Machine GDDR6",
    "src": "custom",
    "verify": true
   },
   {
    "id": "fan",
    "name": "Fan",
    "pn": "Cooling fan",
    "cat": "power",
    "pkg": "fan",
    "x": 4,
    "y": 1,
    "use": "Cooling.",
    "notes": "",
    "q": "Steam Machine fan",
    "src": "mech",
    "verify": false
   },
   {
    "id": "ram",
    "name": "System RAM (16 GB)",
    "pn": "16 GB DDR5",
    "cat": "mem",
    "pkg": "bga",
    "x": 1,
    "y": 2,
    "use": "CPU memory.",
    "notes": "",
    "q": "Steam Machine DDR5",
    "src": "custom",
    "verify": true
   },
   {
    "id": "io",
    "name": "Ports",
    "pn": "DisplayPort 1.4, HDMI 2.0, USB, Ethernet",
    "cat": "video",
    "pkg": "port",
    "x": 2,
    "y": 2,
    "use": "Display and I/O.",
    "notes": "",
    "q": "Steam Machine HDMI port",
    "src": "mech",
    "verify": true
   }
  ],
  "links": [
   {
    "a": "wifi",
    "b": "cpu",
    "label": "PCIe"
   },
   {
    "a": "ssd",
    "b": "cpu",
    "label": "PCIe 4.0"
   },
   {
    "a": "sd",
    "b": "cpu",
    "label": "USB/PCIe"
   },
   {
    "a": "cpu",
    "b": "gpu",
    "label": "PCIe"
   },
   {
    "a": "gpu",
    "b": "vram",
    "label": "GDDR6"
   },
   {
    "a": "cpu",
    "b": "ram",
    "label": "DDR5"
   },
   {
    "a": "gpu",
    "b": "io",
    "label": "display"
   },
   {
    "a": "psu",
    "b": "fan",
    "label": "12 V"
   }
  ]
 }
];
