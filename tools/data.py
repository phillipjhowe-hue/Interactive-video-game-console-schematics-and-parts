# Console Repair Atlas - source database.
# Run: python3 data.py  -> writes ../app/data.js
# Component tuple: C(id, name, part_number, category, package, (col,row), use, notes, q=search query, src=vendor class, v=verify flag)
# categories: cpu gpu mem audio video power storage io security clock media
# src: std (commodity part: Mouser/Digi-Key), custom (console-specific IC: donor/pulled), mech (connectors, drives, PSUs, fans...)
import json, os

def C(id, name, pn, cat, pkg, pos, use, notes="", q=None, src=None, v=False):
    if src is None:
        src = {"power": "std", "clock": "std"}.get(cat, "custom")
        if pkg in ("edge", "port", "drive", "hdd", "ssd", "psu", "fan", "battery", "controller", "display", "card", "module"):
            src = "mech"
    return dict(id=id, name=name, pn=pn, cat=cat, pkg=pkg, x=pos[0], y=pos[1], use=use, notes=notes, q=q, src=src, verify=v)

consoles = []
def K(id, name, maker, year, short, board, summary, comps, links):
    consoles.append(dict(id=id, name=name, maker=maker, year=year, short=short, board=board, summary=summary,
                         comps=comps, links=[dict(a=a, b=b, label=l) for a, b, l in links]))

# ---------------------------------------------------------------- NES
K("nes", "Nintendo Entertainment System", "Nintendo", 1985, "NES", "NES-CPU-07 / -11 (front loader, NTSC)",
  "8-bit 6502-derived console. Most failures are mechanical: the 72-pin cartridge connector, the 10NES lockout chip and aging power parts.",
  [C("ctrl", "Controller ports", "NES-004 controller, 7-pin port", "io", "port", (0,0), "Two 7-pin controller ports feeding serial shift-register data from the gamepads.", "Loose ports cause intermittent input. Replacement port assemblies are cheap.", q="NES controller port replacement"),
   C("buf", "Controller buffers", "74HC368 (×2)", "io", "dip", (1,0), "Hex inverting tri-state buffers that place controller data on the CPU data bus when $4016/$4017 is read.", "Fails after ESD/hot-plugging; symptoms are dead or erratic controller input.", q="74HC368", src="std"),
   C("cart", "72-pin cartridge connector", "NES 72-pin connector", "media", "edge", (2,0), "Edge connector that joins the cartridge's PRG/CHR ROM to the CPU and PPU buses.", "#1 NES failure: the 'blinking red light'. Clean, re-bend (boil) pins, or replace with a new 72-pin connector.", q="NES 72 pin connector"),
   C("psu", "AC adapter", "NES-002 (9 V AC, 1.3 A)", "power", "psu", (4,0), "External transformer. The NES rectifies the 9 V AC on-board before regulation.", "Any 9 V DC adapter also works because of the on-board bridge rectifier (polarity agnostic).", q="NES-002 AC adapter", src="mech"),
   C("cic", "Lockout chip (10NES)", "Nintendo 3193A (NTSC) / 3195A (PAL)", "security", "dip", (0,1), "Region/authenticity lockout. Handshakes with the matching chip in each cartridge and resets the console on mismatch.", "Lifting pin 4 disables it and cures many blinking problems on worn connectors.", q="NES 3193A CIC"),
   C("cpu", "CPU + APU", "Ricoh RP2A03 (NTSC) / RP2A07 (PAL)", "cpu", "dip", (1,1), "MOS 6502 core (no decimal mode) at 1.79 MHz with on-chip audio: 2 pulse, triangle, noise and DPCM channels.", "Very robust. Dead CPU is rare; check the reset and clock lines first.", q="RP2A03"),
   C("xtal", "Master clock crystal", "21.477272 MHz (NTSC) / 26.601712 MHz (PAL)", "clock", "crystal", (2,1), "Master oscillator: divided by 12 for the CPU and by 4 for the PPU.", "A cracked crystal gives a black screen with no sound.", q="21.47727 MHz crystal HC-49"),
   C("ppu", "Picture Processing Unit", "Ricoh RP2C02 (NTSC) / RP2C07 (PAL)", "gpu", "dip", (3,1), "Tile/sprite video processor: 256×240, 64 sprites, 25 on-screen colors. Outputs composite video directly.", "Garbled graphics usually come from VRAM, the 74LS373 latch or the connector before the PPU.", q="RP2C02"),
   C("reg", "5 V regulator", "7805 (LM7805 / L7805CV)", "power", "to220", (4,1), "Linear regulator that produces the 5 V rail from the rectified adapter input.", "Runs hot. A drop-in switching regulator (7805-pinout) runs cooler.", q="L7805CV"),
   C("wram", "Work RAM (2 KB)", "2K×8 SRAM (LH5116 / µPD4016 / 6116)", "mem", "dip", (1,2), "CPU work RAM mapped at $0000-$07FF (mirrored to $1FFF).", "Bad WRAM causes freezes, grey screens or corrupted game logic.", q="6116 SRAM DIP-24", src="std"),
   C("dec", "Address decoder", "74HC139 / 74LS139", "io", "dip", (2,2), "Dual 2-to-4 decoder that generates chip-selects for WRAM, the PPU and cartridge PRG ROM.", "", q="74HC139", src="std"),
   C("latch", "PPU address latch", "74HC373 / 74LS373", "io", "dip", (3,2), "Latches the low 8 bits of the PPU's multiplexed address/data bus for VRAM and CHR ROM.", "A failing latch produces scrambled tiles across all games.", q="74HC373", src="std"),
   C("rf", "RF modulator / AV out", "RF modulator (ch. 3/4) + composite RCA", "video", "module", (4,2), "Converts composite video and mono audio to an RF TV signal; also provides RCA composite and audio out.", "RCA jacks crack from strain. NESRGB-style mods tap the PPU for RGB.", q="NES RF modulator"),
   C("vram", "Video RAM (2 KB)", "2K×8 SRAM (LH5116 / 6116)", "mem", "dip", (3,3), "Nametable RAM for the PPU. Cartridges can remap it for mirroring modes.", "", q="6116 SRAM DIP-24", src="std")],
  [("ctrl","buf","serial pad data"),("buf","cpu","$4016/$4017"),("cart","cpu","PRG bus A0-A15 / D0-D7"),("cart","ppu","CHR bus"),
   ("cic","cart","lockout handshake"),("xtal","cpu","÷12"),("xtal","ppu","÷4"),("cpu","wram","D0-D7"),("cpu","dec","A13-A15"),
   ("dec","wram","/CE"),("dec","ppu","/CS"),("ppu","latch","AD0-AD7"),("latch","vram","A0-A7"),("psu","reg","9 V"),
   ("ppu","rf","composite"),("cpu","rf","audio")])

# ---------------------------------------------------------------- Master System
K("sms", "Sega Master System", "Sega", 1986, "Master System", "Model 1 (171-5xxx), NTSC",
  "Z80-based 8-bit console with a TMS9918-derived VDP. Built-in BIOS/game, cartridge and card slots.",
  [C("pad", "Controller ports", "DE-9 controller ports", "io", "port", (0,0), "Two DE-9 ports for Sega pads (same pinout family as Genesis/Atari).", "", q="Sega Master System controller port"),
   C("cart", "Cartridge slot", "50-pin cartridge connector", "media", "edge", (2,0), "Connects game ROM (and mapper) to the Z80 bus.", "Clean with isopropyl; dirty slot gives a black screen.", q="Sega Master System cartridge slot"),
   C("card", "Sega Card slot", "Sega Card connector", "media", "edge", (3,0), "Slot for thin 'My Card' games (32 KB).", "", q="Sega Master System card slot"),
   C("psu", "AC adapter", "9 V DC, center-negative (Genesis Model 1 compatible)", "power", "psu", (4,0), "External DC adapter.", "Center-NEGATIVE: wrong polarity can damage the console.", q="Sega Master System power adapter", src="mech"),
   C("cpu", "CPU", "Zilog Z80A (Z0840004PSC)", "cpu", "dip", (1,1), "8-bit CPU at 3.58 MHz running games and the BIOS.", "Standard part; new Z84C00 CMOS chips are drop-in.", q="Z84C0004PEC", src="std"),
   C("xtal", "Master clock", "53.693175 MHz crystal (NTSC)", "clock", "crystal", (2,1), "Master clock divided down for the VDP and Z80 (÷15 = 3.58 MHz).", "", q="53.693175 MHz crystal"),
   C("vdp", "VDP + PSG", "Sega 315-5124 (Model 1) / 315-5246 (Model 2)", "gpu", "dip", (3,1), "Video display processor (tiles, 64 sprites, 32 colors) with built-in SN76489 sound (3 square + noise).", "", q="Sega 315-5124"),
   C("reg", "5 V regulator", "7805", "power", "to220", (4,1), "Regulates 9 V input to 5 V.", "", q="L7805CV"),
   C("bios", "BIOS ROM", "Mask ROM (BIOS / built-in game)", "storage", "dip", (0,2), "Boot ROM; on later units includes a built-in game (Hang-On, Alex Kidd, etc.).", "", q="Sega Master System BIOS ROM"),
   C("ram", "Work RAM (8 KB)", "8K×8 SRAM (6264-type)", "mem", "dip", (1,2), "Z80 system RAM.", "", q="6264 SRAM DIP-28", src="std"),
   C("vram", "Video RAM (16 KB)", "16 KB DRAM (2× 16K×4, e.g. µPD41416)", "mem", "dip", (3,2), "Tile, sprite and nametable storage for the VDP.", "", q="uPD41416", v=True),
   C("av", "RF / AV output", "RF modulator + 8-pin DIN AV", "video", "module", (4,2), "RF out plus AV port carrying composite, RGB and audio (Model 1).", "Model 1 AV port gives RGB with the right SCART cable.", q="Sega Master System AV cable")],
  [("pad","cpu","I/O ports $DC/$DD"),("cart","cpu","Z80 bus"),("card","cpu","Z80 bus"),("bios","cpu","boot"),("xtal","cpu","÷15"),
   ("xtal","vdp","clock"),("cpu","vdp","I/O $BE/$BF"),("cpu","ram","D0-D7"),("vdp","vram","VRAM bus"),("psu","reg","9 V"),("vdp","av","video + audio")])

# ---------------------------------------------------------------- TurboGrafx-16
K("tg16", "TurboGrafx-16 / PC Engine", "NEC / Hudson", 1989, "TurboGrafx-16", "TurboGrafx-16 (NTSC-US)",
  "8-bit CPU with a 16-bit graphics chipset by Hudson Soft. Games on HuCards; CD-ROM² via the expansion port.",
  [C("pad", "Controller port", "8-pin DIN controller port", "io", "port", (0,0), "Single pad port (TurboTap for 5 players).", "", q="TurboGrafx-16 controller port"),
   C("hucard", "HuCard slot", "38-pin HuCard connector", "media", "edge", (2,0), "Credit-card-sized ROM card slot.", "Bent/dirty contacts cause boot failures.", q="TurboGrafx HuCard slot"),
   C("exp", "Expansion port", "Rear expansion bus (CD-ROM², TurboBooster)", "io", "edge", (3,0), "Full bus edge connector for the CD-ROM² unit and AV booster.", "", q="TurboGrafx expansion port"),
   C("psu", "AC adapter", "9 V DC (TurboGrafx-16 AC adapter)", "power", "psu", (4,0), "External DC adapter.", "", q="TurboGrafx-16 AC adapter", src="mech"),
   C("cpu", "CPU + PSG", "Hudson HuC6280", "cpu", "qfp", (1,1), "65C02-based CPU at 7.16 MHz with MMU, timer, I/O port and 6-channel wavetable sound.", "", q="HuC6280"),
   C("xtal", "Master clock", "21.47727 MHz", "clock", "crystal", (2,1), "Master oscillator (÷3 for the CPU).", "", q="21.47727 MHz crystal HC-49"),
   C("vdc", "Video Display Controller", "Hudson HuC6270", "gpu", "qfp", (3,1), "Tile and sprite engine (64 sprites, scrolling).", "", q="HuC6270"),
   C("reg", "5 V regulator", "7805", "power", "to220", (4,1), "5 V rail.", "", q="L7805CV"),
   C("ram", "Work RAM (8 KB)", "8K×8 SRAM", "mem", "sop", (1,2), "CPU RAM.", "", q="6264 SRAM", src="std"),
   C("vce", "Video Color Encoder", "Hudson HuC6260", "video", "qfp", (2,2), "Palette (512 colors) and sync/timing generation; outputs to the encoder.", "", q="HuC6260"),
   C("vram", "Video RAM (64 KB)", "64 KB SRAM", "mem", "sop", (3,2), "VDC tile/sprite memory.", "", q="TurboGrafx VRAM", v=True),
   C("rf", "RF modulator", "RF modulator (US TG-16)", "video", "module", (4,2), "US model outputs RF only; AV needs the TurboBooster.", "", q="TurboGrafx RF modulator")],
  [("pad","cpu","I/O port"),("hucard","cpu","CPU bus"),("exp","cpu","CPU bus"),("xtal","cpu","÷3"),("xtal","vce","clock"),
   ("cpu","ram","D0-D7"),("cpu","vdc","VDC regs"),("vdc","vram","16-bit VRAM bus"),("vdc","vce","pixel bus"),("psu","reg","9 V"),("vce","rf","video"),("cpu","rf","audio")])

# ---------------------------------------------------------------- Genesis
K("genesis", "Sega Genesis / Mega Drive", "Sega", 1989, "Genesis", "Model 1 (VA0–VA6), NTSC",
  "16-bit 68000 console with a Z80 sound co-processor, Yamaha YM2612 FM and SN76489 PSG.",
  [C("pad", "Controller ports", "DE-9 ×2", "io", "port", (0,0), "Two DE-9 pad ports (3/6-button).", "", q="Sega Genesis controller port"),
   C("cart", "Cartridge slot", "64-pin edge connector (2×32)", "media", "edge", (2,0), "Connects cartridge ROM to the 68000 bus; also accepts Power Base Converter.", "Common cause of black screen / 'Producer' lockout errors.", q="Sega Genesis cartridge slot"),
   C("exp", "Expansion port", "Side expansion connector", "io", "edge", (3,0), "Bus connector for the Sega CD.", "", q="Sega Genesis expansion port"),
   C("psu", "AC adapter", "MK-1602 (9 V DC 1.2 A, center-negative)", "power", "psu", (4,0), "External adapter for Model 1.", "Model 2 uses 10 V; Model 3 uses 9 V. Center-negative.", q="Sega Genesis MK-1602 adapter", src="mech"),
   C("m68k", "Main CPU", "Motorola MC68000P8 / Hitachi HD68HC000", "cpu", "dip", (1,1), "16/32-bit CPU at 7.67 MHz running game logic.", "", q="MC68000P8", src="std"),
   C("xtal", "Master clock", "53.693175 MHz (NTSC)", "clock", "crystal", (2,1), "÷7 for the 68000, ÷15 for the Z80.", "", q="53.693175 MHz crystal"),
   C("vdp", "VDP + PSG", "Yamaha YM7101 (Sega 315-5313)", "gpu", "qfp", (3,1), "Video processor: 2 scroll planes, 80 sprites, 64 colors from 512, with integrated SN76489 PSG and DMA.", "", q="YM7101 315-5313"),
   C("reg", "5 V regulator", "7805", "power", "to220", (4,1), "5 V rail (heatsinked).", "Recapping Model 1 boards improves audio and stability.", q="L7805CV"),
   C("z80", "Sound CPU", "Zilog Z80 (Z8400A / Z84C00)", "audio", "dip", (0,2), "3.58 MHz co-processor that drives the YM2612; also the CPU in Master System mode.", "", q="Z84C0004PEC", src="std"),
   C("ram", "68000 RAM (64 KB)", "64 KB SRAM (2× 32K×8)", "mem", "dip", (1,2), "Main CPU work RAM.", "", q="62256 SRAM", src="std"),
   C("ym", "FM synthesizer", "Yamaha YM2612", "audio", "dip", (2,2), "6-channel FM synth with built-in DAC (one channel can play PCM).", "", q="YM2612"),
   C("vram", "Video RAM (64 KB)", "64 KB dual-port VRAM (2 chips)", "mem", "dip", (3,2), "Tile and sprite storage for the VDP.", "", q="Sega Genesis VRAM", v=True),
   C("enc", "RGB encoder", "Sony CXA1145", "video", "dip", (4,2), "Converts RGB to composite/RF and buffers RGB to the AV port.", "", q="CXA1145"),
   C("zram", "Z80 RAM (8 KB)", "8K×8 SRAM", "mem", "dip", (0,3), "Sound driver RAM.", "", q="6264 SRAM", src="std")],
  [("pad","m68k","I/O"),("cart","m68k","68K bus"),("exp","m68k","68K bus"),("xtal","m68k","÷7"),("xtal","z80","÷15"),
   ("xtal","vdp","clock"),("m68k","vdp","VDP port / DMA"),("m68k","ram","D0-D15"),("vdp","vram","VRAM bus"),("z80","ym","FM regs"),
   ("z80","zram","Z80 bus"),("m68k","z80","bus arbiter"),("vdp","enc","RGB"),("ym","enc","audio mix"),("psu","reg","9 V")])

# ---------------------------------------------------------------- SNES
K("snes", "Super Nintendo Entertainment System", "Nintendo", 1991, "SNES", "SHVC-CPU-01 (and 1-CHIP-01 later), NTSC",
  "16-bit 65C816 console with two-chip PPU (Mode 7) and a separate Sony audio subsystem.",
  [C("pad", "Controller ports", "7-pin SNES ports", "io", "port", (0,0), "Two serial pad ports.", "", q="SNES controller port"),
   C("cart", "Cartridge slot", "62-pin cartridge connector", "media", "edge", (2,0), "Game ROM/SRAM and enhancement chips (Super FX, SA-1) connect here.", "Clean and replace if worn.", q="SNES cartridge slot 62 pin"),
   C("psu", "AC adapter", "SNS-002 (10 V DC 850 mA)", "power", "psu", (4,0), "External DC adapter.", "", q="SNES SNS-002 adapter", src="mech"),
   C("cic", "Lockout chip", "Nintendo F411 (NTSC) / F413 (PAL)", "security", "dip", (0,1), "Region/authenticity lockout paired with the cartridge CIC.", "", q="SNES F411 CIC"),
   C("cpu", "CPU", "Ricoh 5A22 (S-CPU)", "cpu", "qfp", (1,1), "65C816 core at up to 3.58 MHz with DMA/HDMA, multiplier/divider and joypad auto-read.", "", q="5A22 S-CPU"),
   C("xtal", "Master clock", "21.47727 MHz (NTSC)", "clock", "crystal", (2,1), "System master clock.", "", q="21.47727 MHz crystal HC-49"),
   C("ppu1", "PPU 1", "S-PPU1 (5C77)", "gpu", "qfp", (3,1), "Picture processing unit #1: backgrounds, sprites, Mode 7 math.", "", q="SNES S-PPU1 5C77"),
   C("reg", "5 V regulator", "7805", "power", "to220", (4,1), "5 V rail.", "", q="L7805CV"),
   C("wram", "Work RAM (128 KB)", "S-WRAM", "mem", "qfp", (1,2), "128 KB DRAM work RAM with its own DMA port.", "", q="SNES S-WRAM"),
   C("smp", "Audio CPU", "S-SMP (Sony SPC700 core)", "audio", "qfp", (2,2), "8-bit sound CPU running the audio driver; boots from a 64-byte IPL ROM.", "", q="SNES S-SMP"),
   C("ppu2", "PPU 2", "S-PPU2 (5C78)", "gpu", "qfp", (3,2), "Picture processing unit #2: color math, windows, output.", "", q="SNES S-PPU2 5C78"),
   C("enc", "Video encoder", "S-ENC (Sony) / S-RGB on 1-CHIP", "video", "qfp", (4,2), "Encodes RGB to composite and S-Video at the multi-out.", "1-CHIP boards are known for sharp RGB but some need filter mods.", q="SNES S-ENC"),
   C("aram", "Audio RAM (64 KB)", "2× 32K×8 SRAM", "mem", "sop", (1,3), "Sample and program memory shared by S-SMP and S-DSP.", "", q="SNES audio RAM", src="std"),
   C("dsp", "Audio DSP", "S-DSP (Sony)", "audio", "qfp", (2,3), "8-voice ADPCM sample playback with echo and ADSR.", "", q="SNES S-DSP"),
   C("dac", "Audio DAC + resonator", "NEC µPD6376 + 24.576 MHz resonator", "audio", "sop", (0,3), "16-bit stereo DAC. The APU's ceramic resonator drifts with age, changing music pitch slightly.", "", q="uPD6376"),
   C("vram", "Video RAM (64 KB)", "2× 32K×8 SRAM", "mem", "sop", (3,3), "Tile, tilemap and Mode 7 data.", "", q="SNES VRAM", src="std")],
  [("pad","cpu","$4016/auto-read"),("cart","cpu","A bus / B bus"),("cic","cart","lockout"),("xtal","cpu","clock"),("xtal","ppu1","clock"),
   ("cpu","wram","A/B bus"),("cpu","ppu1","B bus"),("ppu1","ppu2","pixel bus"),("ppu1","vram","VRAM (lo)"),("ppu2","vram","VRAM (hi)"),
   ("cpu","smp","4 I/O ports"),("smp","aram","APU bus"),("dsp","aram","samples"),("smp","dsp","regs"),("dsp","dac","serial audio"),
   ("ppu2","enc","RGB"),("psu","reg","10 V")])

# ---------------------------------------------------------------- Saturn
K("saturn", "Sega Saturn", "Sega", 1995, "Saturn", "Model 1 (VA0 / VA1), NTSC",
  "Dual SH-2 32-bit console with two video processors and a Yamaha sound DSP.",
  [C("pad", "Controller ports", "Saturn controller ports ×2", "io", "port", (0,0), "Pad ports managed by the SMPC.", "", q="Sega Saturn controller port"),
   C("cart", "Cartridge slot", "Saturn cartridge slot", "media", "edge", (1,0), "Backup RAM, 1 MB/4 MB RAM carts, Action Replay.", "", q="Sega Saturn cartridge slot"),
   C("cd", "CD-ROM drive", "2× CD drive (laser commonly Sanyo SF-P101N)", "media", "drive", (2,0), "Double-speed CD-ROM drive controlled by the CD Block.", "Laser failure or worn sled gear; check part fits your drive revision.", q="Sega Saturn laser", v=True),
   C("psu", "Internal PSU", "Saturn power supply board", "power", "psu", (4,0), "Internal AC PSU.", "Region-specific voltage (US 120 V).", q="Sega Saturn power supply", src="mech"),
   C("smpc", "System manager", "SMPC (Hitachi 4-bit MCU, Sega 315-5744)", "io", "qfp", (0,1), "Reset/power control, real-time clock, controller polling.", "", q="Sega Saturn SMPC", v=True),
   C("sh2m", "Master CPU", "Hitachi SH-2 (HD6417095)", "cpu", "qfp", (1,1), "32-bit RISC at 28.6 MHz running game code.", "", q="HD6417095"),
   C("sh2s", "Slave CPU", "Hitachi SH-2 (HD6417095)", "cpu", "qfp", (2,1), "Second SH-2 sharing the main bus.", "", q="HD6417095"),
   C("vdp1", "VDP1 (sprites/polygons)", "Sega 315-5689", "gpu", "qfp", (3,1), "Draws sprites and quads into a framebuffer.", "", q="Sega Saturn VDP1"),
   C("batt", "Backup battery", "CR2032", "power", "battery", (4,1), "Keeps clock and internal save RAM alive.", "Dead battery = 'set clock' every boot and lost saves.", q="CR2032", src="std"),
   C("scu", "System Control Unit", "Sega 315-5688", "cpu", "qfp", (1,2), "Bus controller with DMA and a DSP for geometry.", "", q="Sega Saturn SCU"),
   C("wram", "Work RAM (2 MB)", "1 MB SDRAM + 1 MB DRAM", "mem", "sop", (2,2), "Main memory for the SH-2s.", "", q="Sega Saturn RAM", v=True),
   C("vdp2", "VDP2 (backgrounds)", "Sega 315-5690", "gpu", "qfp", (3,2), "Background planes, rotation, priority and final video output.", "", q="Sega Saturn VDP2"),
   C("av", "AV multi-out", "Saturn AV port", "video", "port", (4,2), "Composite / S-Video / RGB output.", "", q="Sega Saturn AV cable"),
   C("cdb", "CD Block", "Hitachi SH-1 + YGR019", "media", "qfp", (2,3), "Controls the CD drive, decoding and copy protection.", "", q="Sega Saturn CD block"),
   C("scsp", "Sound processor", "Yamaha YMF292 (SCSP) + MC68EC000", "audio", "qfp", (3,3), "32-voice PCM/FM sound with DSP effects; 68EC000 runs the driver; 512 KB sound RAM.", "", q="YMF292")],
  [("pad","smpc","polling"),("smpc","sh2m","reset/INT"),("sh2m","sh2s","shared bus"),("sh2m","scu","CPU bus"),("cart","scu","A-bus"),
   ("cd","cdb","drive"),("cdb","scu","A-bus"),("scu","wram","CPU bus"),("scu","vdp1","B-bus"),("scu","vdp2","B-bus"),("scu","scsp","B-bus"),
   ("vdp1","vdp2","framebuffer"),("vdp2","av","video"),("scsp","av","audio"),("batt","smpc","RTC")])

# ---------------------------------------------------------------- PlayStation
K("ps1", "Sony PlayStation", "Sony", 1995, "PS1", "SCPH-1001 / 5501 / 7501 (NTSC-U)",
  "32-bit MIPS R3000A console with Geometry Transformation Engine. The laser and its sled are the common repairs.",
  [C("pad", "Controller & memory card ports", "PS1 controller/memory card port assembly", "io", "port", (0,0), "Two pad + memory card slots on a shared serial bus.", "", q="PS1 controller port"),
   C("cd", "CD-ROM drive / laser", "KSM-440ACM / KSM-440ADM / KSM-440AEM / KSM-440BAM (by model)", "media", "drive", (2,0), "2× CD-ROM mechanism. Laser model depends on board revision.", "Skipping/no-read = dirty lens, worn laser, or bad sled; KSM-440AEM is the usual replacement for 5501/7501.", q="KSM-440ADM", v=True),
   C("psu", "Internal PSU", "PS1 PSU board (7.5 V / 3.5 V)", "power", "psu", (4,0), "Internal power supply board.", "", q="PS1 power supply board", src="mech"),
   C("sub", "CD controller MCU", "Motorola MC68HC05 (CD sub-CPU)", "media", "qfp", (1,0), "Controls the drive mechanism and region checks. Modchips tap here.", "", q="PS1 68HC05"),
   C("cpu", "CPU + GTE", "Sony CXD8530AQ / CXD8530CQ", "cpu", "qfp", (1,1), "MIPS R3000A at 33.87 MHz with GTE (3D math) and MDEC (video decompression).", "", q="CXD8530CQ"),
   C("xtal", "Master clock", "67.7376 MHz (NTSC)", "clock", "crystal", (2,1), "÷2 for the CPU.", "", q="67.7376 MHz crystal"),
   C("gpu", "GPU", "Sony CXD8514Q (early) / CXD8561Q (later)", "gpu", "qfp", (3,1), "2D/3D rasterizer: flat/Gouraud/textured polygons into 1 MB VRAM.", "", q="CXD8561Q"),
   C("bios", "BIOS ROM", "512 KB mask ROM (region BIOS)", "storage", "sop", (0,1), "Boot code, kernel and memory card manager.", "", q="PS1 BIOS chip"),
   C("ram", "Main RAM (2 MB)", "2 MB EDO DRAM", "mem", "sop", (1,2), "CPU main memory.", "", q="PS1 RAM chip"),
   C("cddsp", "CD DSP / decoder", "Sony CXD2510Q (early) / CXD2545Q", "media", "qfp", (2,2), "CD signal processing, EFM decoding and servo.", "", q="CXD2545Q"),
   C("vram", "Video RAM (1 MB)", "1 MB VRAM", "mem", "sop", (3,2), "Framebuffer and textures.", "", q="PS1 VRAM"),
   C("enc", "Video encoder", "Sony CXA1645 / CXA2075", "video", "sop", (4,2), "RGB to composite/S-Video encoder.", "", q="CXA1645", v=True),
   C("spu", "Sound processor", "Sony CXD2922Q / CXD2925Q (SPU)", "audio", "qfp", (2,3), "24-voice ADPCM with reverb; also plays CD audio.", "", q="CXD2925Q"),
   C("sram", "Sound RAM (512 KB)", "512 KB DRAM", "mem", "sop", (3,3), "SPU sample memory.", "", q="PS1 SPU RAM"),
   C("av", "AV multi-out", "PS AV multi-out", "video", "port", (4,3), "Composite, S-Video, RGB and stereo audio.", "", q="PS1 AV cable")],
  [("pad","cpu","SIO"),("cd","sub","mechanism"),("cd","cddsp","RF signal"),("sub","cddsp","control"),("cddsp","cpu","CD data"),
   ("bios","cpu","boot"),("xtal","cpu","÷2"),("cpu","ram","main bus"),("cpu","gpu","GP0/GP1"),("gpu","vram","VRAM bus"),
   ("cpu","spu","main bus"),("spu","sram","sound bus"),("cddsp","spu","CD audio"),("gpu","enc","RGB"),("enc","av","video"),("spu","av","audio")])

# ---------------------------------------------------------------- N64
K("n64", "Nintendo 64", "Nintendo", 1996, "N64", "NUS-CPU-01 … -09, NTSC",
  "64-bit MIPS console with SGI's Reality Co-Processor and Rambus RDRAM.",
  [C("pad", "Controller ports", "NUS-005 controller ports ×4", "io", "port", (0,0), "Joybus serial ports polled by the PIF.", "Worn analog sticks are the #1 controller repair.", q="N64 controller port"),
   C("cart", "Cartridge slot", "50-pin cartridge connector", "media", "edge", (2,0), "Cartridge ROM on the PI bus; CIC in the cart talks to the PIF.", "", q="N64 cartridge slot"),
   C("psu", "Power supply", "NUS-002 (12 V / 3.3 V)", "power", "psu", (4,0), "Plug-in brick providing 12 V and 3.3 V.", "", q="N64 NUS-002 power supply", src="mech"),
   C("pif", "Peripheral interface", "PIF-NUS", "security", "qfp", (0,1), "Boot ROM, CIC lockout check and controller polling.", "", q="N64 PIF-NUS"),
   C("cpu", "CPU", "NUS-CPU (NEC VR4300)", "cpu", "qfp", (1,1), "64-bit MIPS R4300i at 93.75 MHz.", "", q="N64 NUS-CPU VR4300"),
   C("clk", "Clock generator", "MX8330MC (NTSC) / MX8350 (PAL)", "clock", "sop", (2,1), "Generates RCP/CPU, RDRAM and video clocks.", "", q="MX8330MC"),
   C("rcp", "Reality Co-Processor", "NUS-RCP (SGI; RSP + RDP)", "gpu", "qfp", (3,1), "RSP vector unit (geometry/audio microcode) + RDP rasterizer; also the memory controller.", "", q="N64 NUS-RCP"),
   C("reg", "Regulators", "Voltage regulators (on board)", "power", "to220", (4,1), "Board-level regulation from the 12 V/3.3 V supply.", "", q="N64 voltage regulator", src="custom", v=True),
   C("exp", "Jumper / Expansion Pak", "NUS-008 Jumper Pak / NUS-007 Expansion Pak", "mem", "card", (0,2), "Terminates the RDRAM bus or adds 4 MB (total 8 MB).", "No Jumper Pak = black screen.", q="N64 Expansion Pak"),
   C("rdram", "RDRAM (4 MB)", "NUS-RDRAM ×2", "mem", "sop", (1,2), "Unified memory on a 9-bit Rambus bus at 500 MHz.", "", q="N64 RDRAM"),
   C("vdc", "Video DAC/encoder", "VDC-NUS (early) / DENC-NUS / AVDC-NUS", "video", "sop", (3,2), "Converts digital video from the RCP to composite/S-Video.", "Early VDC-NUS boards allow clean RGB mods.", q="N64 VDC-NUS"),
   C("av", "AV multi-out", "Nintendo multi-out", "video", "port", (4,2), "Composite/S-Video and stereo audio.", "", q="N64 AV cable")],
  [("pad","pif","Joybus"),("cart","rcp","PI bus"),("pif","rcp","SI bus"),("pif","cpu","reset/NMI"),("cpu","rcp","SysAD bus"),
   ("clk","rcp","clocks"),("clk","rdram","clock"),("rcp","rdram","Rambus"),("exp","rdram","RDRAM bus"),("rcp","vdc","digital video+audio"),
   ("vdc","av","video"),("psu","reg","12 V / 3.3 V")])

# ---------------------------------------------------------------- Dreamcast
K("dc", "Sega Dreamcast", "Sega", 1999, "Dreamcast", "HKT-3020 (NTSC-U)",
  "SH-4 + PowerVR2 console with a GD-ROM drive. Drives wear out; optical-drive emulators are a popular replacement.",
  [C("pad", "Controller ports", "Maple bus ports ×4", "io", "port", (0,0), "Maple serial bus for controllers and VMUs.", "", q="Dreamcast controller port"),
   C("gd", "GD-ROM drive", "GD-ROM drive (1.2 GB GD discs)", "media", "drive", (2,0), "Proprietary high-density CD drive.", "Common failure. Replace laser or install an optical drive emulator (GDEMU-type).", q="Dreamcast GD-ROM laser"),
   C("psu", "Power supply", "Dreamcast PSU board (110 V US)", "power", "psu", (4,0), "Internal PSU board.", "Region-specific voltage.", q="Dreamcast power supply", src="mech"),
   C("modem", "Modem module", "56K modem (or Broadband Adapter HIT-400)", "io", "module", (0,1), "Removable network module.", "", q="Dreamcast broadband adapter"),
   C("cpu", "CPU", "Hitachi SH-4 (SH7091, 200 MHz)", "cpu", "bga", (1,1), "32-bit RISC with 128-bit SIMD FPU for geometry.", "", q="Dreamcast SH-4"),
   C("holly", "GPU / system ASIC", "HOLLY (NEC/VideoLogic PowerVR2 CLX2)", "gpu", "bga", (3,1), "Tile-based deferred renderer plus system bus controller.", "", q="Dreamcast Holly"),
   C("fan", "Cooling fan", "5 V 50 mm fan", "power", "fan", (4,1), "Exhaust fan.", "Noisy stock fan; quiet 5 V replacements are common.", q="Dreamcast replacement fan"),
   C("bios", "BIOS / Flash", "2 MB BIOS ROM + 128 KB flash", "storage", "sop", (0,2), "Boot ROM and settings flash.", "", q="Dreamcast BIOS"),
   C("ram", "Main RAM (16 MB)", "16 MB SDRAM", "mem", "sop", (1,2), "System memory.", "", q="Dreamcast SDRAM"),
   C("aica", "Sound processor", "Yamaha AICA (ARM7 core) + 2 MB RAM", "audio", "qfp", (2,2), "64-channel PCM/ADPCM with DSP effects.", "", q="Dreamcast AICA"),
   C("vram", "Video RAM (8 MB)", "8 MB SDRAM", "mem", "sop", (3,2), "Textures and framebuffer.", "", q="Dreamcast VRAM"),
   C("av", "AV port / VGA", "AV multi-out (VGA capable)", "video", "port", (4,2), "Composite/S-Video/RGB/VGA.", "", q="Dreamcast VGA box"),
   C("batt", "Clock battery", "Rechargeable 2032-size cell (VL2032/ML2032)", "power", "battery", (0,3), "Keeps date/time.", "Dead cell = date prompt on every boot.", q="ML2032 rechargeable", src="std", v=True)],
  [("pad","holly","Maple"),("gd","holly","G1 bus"),("modem","holly","G2 bus"),("cpu","holly","system bus"),("bios","holly","G1 bus"),
   ("cpu","ram","SDRAM bus"),("holly","vram","64-bit"),("holly","aica","G2 bus"),("holly","av","video"),("aica","av","audio"),("psu","fan","5 V"),("batt","aica","RTC")])

# ---------------------------------------------------------------- PS2
K("ps2", "Sony PlayStation 2", "Sony", 2000, "PS2", "SCPH-3000x / 5000x (fat); 7000x+ slim",
  "Emotion Engine + Graphics Synthesizer console with a PS1-compatible I/O processor.",
  [C("pad", "Controller & memory card ports", "PS2 controller/memory card port assembly", "io", "port", (0,0), "Pad/card ports on SIO2, handled by the IOP.", "", q="PS2 controller port"),
   C("dvd", "DVD drive / laser", "KHS-400B / KHS-400C (fat); KHM-430 series (slim)", "media", "drive", (2,0), "DVD/CD mechanism.", "Disc read errors: clean lens, adjust/replace laser, check MechaCon revision before buying a laser.", q="KHS-400C"),
   C("psu", "Power supply", "Internal PSU (fat) / SCPH-70100 AC adapter (slim)", "power", "psu", (4,0), "Fat models: internal PSU. Slim models: 8.5 V external adapter.", "", q="PS2 power supply", src="mech"),
   C("mecha", "Mechanism controller", "MechaCon (CXP10xxxx / CXR70xxxx by revision)", "media", "qfp", (1,0), "Controls the drive, servo and disc authentication.", "Laser compatibility depends on MechaCon revision.", q="PS2 MechaCon", v=True),
   C("ee", "Emotion Engine", "Sony CXD9542GB / CXD9615GB (by revision)", "cpu", "bga", (1,1), "R5900 MIPS CPU at 294.9 MHz with two vector units (VU0/VU1) and IPU.", "", q="PS2 Emotion Engine", v=True),
   C("gs", "Graphics Synthesizer", "Sony CXD2934GB / CXD2949GB", "gpu", "bga", (3,1), "Rasterizer with 4 MB embedded DRAM.", "Later boards merge EE and GS into one chip.", q="PS2 Graphics Synthesizer", v=True),
   C("fan", "Cooling fan", "PS2 fan", "power", "fan", (4,1), "Cooling.", "", q="PS2 fan replacement"),
   C("iop", "I/O processor", "IOP (PS1-derived MIPS R3000A)", "io", "qfp", (0,1), "Handles I/O, pads, cards, USB, FireWire, HDD and PS1 back-compat.", "", q="PS2 IOP"),
   C("rdram", "Main RAM (32 MB)", "32 MB RDRAM (2 chips)", "mem", "bga", (1,2), "Dual-channel Rambus main memory.", "", q="PS2 RDRAM"),
   C("spu2", "Sound processor", "SPU2", "audio", "qfp", (0,2), "48-voice ADPCM sound (2× PS1 SPU).", "", q="PS2 SPU2"),
   C("hdd", "Expansion bay", "Network Adapter SCPH-10281 + 3.5\" IDE HDD", "storage", "hdd", (2,2), "Fat models: network adapter and optional IDE hard drive.", "", q="SCPH-10281 network adapter"),
   C("av", "AV multi-out", "PS AV multi-out + optical out", "video", "port", (3,2), "Composite/S-Video/RGB/component and S/PDIF.", "", q="PS2 component cable")],
  [("pad","iop","SIO2"),("dvd","mecha","servo"),("mecha","iop","CDVD"),("iop","ee","SBUS"),("ee","gs","GIF 64-bit"),("ee","rdram","Rambus"),
   ("iop","spu2","IOP bus"),("iop","hdd","DEV9"),("gs","av","video"),("spu2","av","audio"),("psu","fan","12 V")])

# ---------------------------------------------------------------- Xbox
K("xbox", "Microsoft Xbox", "Microsoft", 2001, "Xbox", "v1.0 – v1.6",
  "PC-architecture console: Pentium III, NVIDIA GPU and an IDE hard drive. The v1.0/1.1 clock capacitor leaks and must be removed.",
  [C("pad", "Controller ports", "Xbox controller ports (USB-based)", "io", "port", (0,0), "Four ports wired as USB 1.1.", "", q="Xbox controller port"),
   C("dvd", "DVD drive", "Thomson TGM-600 / Philips VAD6011 / Samsung SDG-605", "media", "drive", (2,0), "IDE DVD-ROM.", "Philips drives often fail to open/read; Samsung is the most durable replacement. DVD drives are not paired to the console.", q="Xbox DVD drive Samsung SDG-605"),
   C("hdd", "Hard drive", "8 GB IDE (Seagate ST310211A / WD WD80EB)", "storage", "hdd", (3,0), "Locked IDE HDD for saves and cache.", "Drive is password-locked to the motherboard EEPROM.", q="Xbox original hard drive"),
   C("psu", "Power supply", "Internal PSU (Foxlink v1.0–1.5 / Delta v1.6)", "power", "psu", (4,0), "Internal ATX-like supply.", "Check PSU type before buying; connectors differ by revision.", q="Xbox power supply", src="mech"),
   C("cpu", "CPU", "Intel Pentium III (Coppermine, 733 MHz)", "cpu", "bga", (1,1), "x86 CPU with 128 KB L2 cache.", "", q="Xbox CPU"),
   C("nv2a", "GPU / northbridge", "NVIDIA NV2A", "gpu", "bga", (2,1), "GeForce3-class GPU at 233 MHz; also the memory controller (UMA).", "", q="Xbox NV2A"),
   C("cap", "Clock capacitor", "1 F supercapacitor (v1.0–v1.1)", "power", "battery", (3,1), "Keeps the clock running briefly when unplugged.", "LEAKS and eats traces. Remove it on every v1.0/1.1 board.", q="Xbox clock capacitor", src="std"),
   C("smc", "System Management Controller", "Microchip PIC16LC63A", "io", "sop", (4,1), "Power sequencing, LEDs, fan, tray and video-mode detection.", "", q="PIC16LC63A"),
   C("mcpx", "Southbridge + audio", "NVIDIA MCPX", "audio", "bga", (1,2), "IDE, USB, Ethernet and APU audio; contains the secret boot ROM.", "", q="Xbox MCPX"),
   C("ram", "Main RAM (64 MB)", "64 MB DDR SDRAM (4 chips)", "mem", "bga", (2,2), "Unified memory shared by CPU and GPU.", "", q="Xbox RAM"),
   C("flash", "BIOS flash", "TSOP flash (1 MB / 256 KB)", "storage", "sop", (0,2), "Kernel/BIOS storage (TSOP).", "", q="Xbox TSOP flash"),
   C("enc", "Video encoder", "Conexant CX25871 / Focus FS454 / Xcalibur", "video", "qfp", (3,2), "Converts GPU output to analog SD/HD.", "Xcalibur (v1.6) is a weaker encoder for HD.", q="Conexant CX25871"),
   C("av", "AV port", "Xbox AV multi-out", "video", "port", (4,2), "Composite/component/RGB.", "", q="Xbox component cable")],
  [("pad","mcpx","USB"),("dvd","mcpx","IDE"),("hdd","mcpx","IDE"),("cpu","nv2a","FSB"),("nv2a","ram","128-bit DDR"),("nv2a","mcpx","HyperTransport"),
   ("flash","mcpx","LPC"),("smc","mcpx","SMBus"),("nv2a","enc","digital video"),("enc","av","video"),("mcpx","av","audio"),("cap","smc","RTC")])

# ---------------------------------------------------------------- GameCube
K("gc", "Nintendo GameCube", "Nintendo", 2001, "GameCube", "DOL-001 / DOL-101",
  "PowerPC Gekko + ATI Flipper console using 1T-SRAM and 8 cm optical discs.",
  [C("pad", "Controller ports", "GameCube controller ports ×4", "io", "port", (0,0), "Joybus-style serial pad ports.", "", q="GameCube controller port"),
   C("odd", "Optical drive / laser", "GameCube optical drive (8 cm, laser assembly)", "media", "drive", (2,0), "Mini-DVD-based drive.", "Common: weak laser, adjust potentiometer or replace laser; ODEs available.", q="GameCube laser lens"),
   C("psu", "AC adapter", "DOL-002 (12 V DC 3.25 A)", "power", "psu", (4,0), "External adapter.", "", q="GameCube DOL-002 power supply", src="mech"),
   C("mc", "Memory card slots", "Memory card slots ×2", "io", "port", (0,1), "EXI bus card slots.", "", q="GameCube memory card slot"),
   C("cpu", "CPU", "IBM Gekko (PowerPC 750CXe, 486 MHz)", "cpu", "bga", (1,1), "PowerPC with paired-single SIMD extensions.", "", q="GameCube Gekko"),
   C("flipper", "GPU / system LSI", "ATI Flipper (162 MHz, 3 MB embedded 1T-SRAM)", "gpu", "bga", (2,1), "GPU, DSP audio, I/O and memory controller in one chip.", "", q="GameCube Flipper"),
   C("fan", "Cooling fan", "GameCube fan", "power", "fan", (4,1), "Cooling.", "", q="GameCube fan"),
   C("ipl", "IPL ROM", "2 MB IPL ROM", "storage", "sop", (0,2), "Boot menu, fonts.", "", q="GameCube IPL"),
   C("ram", "Main RAM (24 MB)", "24 MB 1T-SRAM (MoSys)", "mem", "bga", (1,2), "Low-latency main memory.", "", q="GameCube 1T-SRAM"),
   C("aram", "Audio RAM (16 MB)", "16 MB DRAM (ARAM)", "mem", "sop", (2,2), "Audio and auxiliary storage.", "", q="GameCube ARAM"),
   C("ave", "AV encoder", "AVE-N-DOL (NTSC) / AVE-P-DOL (PAL)", "video", "qfp", (3,2), "Video DAC/encoder.", "DOL-001 has the Digital AV port for component (GBS/HDMI adapters).", q="GameCube AVE-N-DOL", v=True),
   C("av", "AV ports", "Analog multi-out + Digital AV (DOL-001)", "video", "port", (4,2), "Composite/S-Video/RGB; component via Digital AV.", "", q="GameCube HDMI adapter"),
   C("ser", "Serial & Hi-Speed ports", "Serial ports (BBA DOL-015) + Hi-Speed port (Game Boy Player)", "io", "module", (2,3), "Underside expansion ports.", "", q="GameCube broadband adapter DOL-015")],
  [("pad","flipper","SI"),("mc","flipper","EXI"),("odd","flipper","DI"),("cpu","flipper","60x bus"),("flipper","ram","1T-SRAM"),
   ("flipper","aram","ARAM"),("ipl","flipper","EXI"),("flipper","ave","digital video"),("ave","av","analog"),("ser","flipper","EXI"),("psu","fan","12 V")])

# ---------------------------------------------------------------- Xbox 360
K("x360", "Microsoft Xbox 360", "Microsoft", 2005, "Xbox 360", "Xenon → Zephyr → Falcon → Jasper → Trinity (S) → Corona (E)",
  "Tri-core PowerPC console. Early boards suffered 'Red Ring of Death' (BGA solder failure).",
  [C("pad", "Wireless/RF board", "RF module (front panel)", "io", "module", (0,0), "Power button, ring of light and wireless controller radio.", "", q="Xbox 360 RF module"),
   C("dvd", "DVD drive", "Hitachi-LG GDR-3120L / Samsung TS-H943 / BenQ VAD6038 / Lite-On DG-16D2S", "media", "drive", (2,0), "SATA DVD drive.", "Drive firmware/key is paired to the console; keep the original PCB when swapping.", q="Xbox 360 Lite-On DG-16D2S"),
   C("hdd", "Hard drive", "2.5\" SATA in Xbox 360 HDD enclosure", "storage", "hdd", (3,0), "20–500 GB removable drive.", "", q="Xbox 360 hard drive"),
   C("psu", "Power brick", "External PSU (203 W Xenon / 175 W Falcon / 150 W Jasper)", "power", "psu", (4,0), "External 12 V brick; wattage matched to board.", "Use a PSU rated for your board revision.", q="Xbox 360 power supply brick", src="mech", v=True),
   C("cpu", "CPU", "IBM Xenon (3-core PowerPC, 3.2 GHz)", "cpu", "bga", (1,1), "Three in-order cores with 2 threads each.", "", q="Xbox 360 CPU"),
   C("xenos", "GPU", "ATI Xenos (500 MHz) + 10 MB eDRAM daughter die", "gpu", "bga", (2,1), "Unified shader GPU and memory controller; eDRAM for framebuffer.", "Main RROD failure point (GPU BGA).", q="Xbox 360 GPU"),
   C("clamp", "X-clamps / heatsinks", "X-clamp and heatsink assembly", "power", "module", (3,1), "Holds heatsinks to the CPU/GPU.", "Original X-clamps flex the board; replacement kits help but don't cure RROD.", q="Xbox 360 X-clamp"),
   C("fan", "Fans", "Dual 70 mm fans (fat)", "power", "fan", (4,1), "Cooling.", "", q="Xbox 360 fan"),
   C("sb", "Southbridge + SMC", "Southbridge (with SMC)", "io", "bga", (0,1), "USB, SATA, Ethernet, audio and power sequencing.", "", q="Xbox 360 southbridge"),
   C("ram", "Main RAM (512 MB)", "512 MB GDDR3", "mem", "bga", (2,2), "Unified memory.", "", q="Xbox 360 GDDR3"),
   C("nand", "NAND flash", "16 MB NAND (256/512 MB on some Jasper)", "storage", "sop", (0,2), "Boot loaders, kernel, keyvault.", "Back up the NAND before repairs; it holds console-unique keys.", q="Xbox 360 NAND"),
   C("ana", "Video encoder", "ANA (Xenon) → HANA (HDMI, Zephyr+)", "video", "qfp", (3,2), "Analog/HDMI video output.", "", q="Xbox 360 HANA chip"),
   C("av", "AV / HDMI ports", "AV port + HDMI (Zephyr+)", "video", "port", (4,2), "Component/composite/VGA; HDMI on later units.", "", q="Xbox 360 HDMI port")],
  [("pad","sb","USB"),("dvd","sb","SATA"),("hdd","sb","SATA"),("cpu","xenos","FSB"),("xenos","ram","128-bit"),("xenos","sb","PCIe"),
   ("nand","sb","flash"),("xenos","ana","video"),("ana","av","video"),("clamp","xenos","mount"),("psu","fan","12 V")])

# ---------------------------------------------------------------- PS3
K("ps3", "Sony PlayStation 3", "Sony", 2006, "PS3", "CECHA (fat) → CECH-2000 (slim) → CECH-4000 (super slim)",
  "Cell Broadband Engine + NVIDIA RSX. Early fats suffer 'Yellow Light of Death' (BGA/solder and TIM).",
  [C("pad", "Bluetooth / Wi-Fi", "Bluetooth + Wi-Fi module", "io", "module", (0,0), "DualShock 3 connection and wireless networking.", "", q="PS3 bluetooth wifi module"),
   C("bd", "Blu-ray drive / laser", "KES-400A (CECHA–E) / KES-410A (CECHG–L) / KES-450A (slim) / KES-850A (super slim)", "media", "drive", (2,0), "BD/DVD/CD drive.", "Drive logic board is paired to the motherboard; swap only the laser/deck.", q="PS3 KES-410A", v=True),
   C("hdd", "Hard drive", "2.5\" SATA HDD (user-replaceable)", "storage", "hdd", (3,0), "Game data and OS.", "Any 2.5\" SATA up to 9.5 mm.", q="PS3 hard drive"),
   C("psu", "Power supply", "Internal PSU (APS-2xx fat / APS-250 / APS-270 slim)", "power", "psu", (4,0), "Internal supply.", "Match the PSU model printed on the old unit.", q="PS3 power supply", src="mech", v=True),
   C("cell", "CPU", "Cell Broadband Engine (3.2 GHz, PPE + 7 SPE)", "cpu", "bga", (1,1), "PowerPC core with 7 active SPE vector cores (1 reserved by OS).", "Delid/TIM replacement is a common fat-model service.", q="PS3 Cell processor"),
   C("rsx", "GPU", "NVIDIA RSX 'Reality Synthesizer' (550 MHz)", "gpu", "bga", (2,1), "G70-derived GPU.", "Most frequent YLOD source on fat boards.", q="PS3 RSX"),
   C("fan", "Fan", "Blower fan", "power", "fan", (4,1), "Cooling.", "", q="PS3 fan"),
   C("sb", "Southbridge", "Southbridge (Toshiba SCC)", "io", "bga", (0,1), "USB, SATA, Ethernet, audio, card readers.", "", q="PS3 southbridge"),
   C("xdr", "Main RAM (256 MB)", "256 MB XDR DRAM", "mem", "bga", (1,2), "Cell's main memory.", "", q="PS3 XDR"),
   C("gddr", "Video RAM (256 MB)", "256 MB GDDR3", "mem", "bga", (2,2), "RSX local memory.", "", q="PS3 GDDR3"),
   C("syscon", "Syscon / flash", "Syscon MCU + NOR/NAND flash", "security", "sop", (0,2), "Power control, error logs, firmware storage.", "Syscon error codes identify YLOD cause.", q="PS3 syscon"),
   C("hdmi", "HDMI port", "HDMI port (+ AV multi-out)", "video", "port", (3,2), "HDMI 1.3 video/audio out.", "Broken HDMI ports are a common board repair.", q="PS3 HDMI port")],
  [("pad","sb","USB/PCIe"),("bd","sb","SATA"),("hdd","sb","SATA"),("cell","rsx","FlexIO"),("cell","xdr","XDR"),("rsx","gddr","GDDR3"),
   ("cell","sb","IOIF"),("syscon","sb","control"),("rsx","hdmi","video"),("psu","fan","12 V")])

# ---------------------------------------------------------------- Wii
K("wii", "Nintendo Wii", "Nintendo", 2006, "Wii", "RVL-001 (GameCube-compatible), RVL-101",
  "Evolved GameCube architecture with motion controls via Bluetooth and an IR sensor bar.",
  [C("bt", "Bluetooth module", "Bluetooth module (Broadcom BCM2045-based)", "io", "module", (0,0), "Wii Remote connection.", "", q="Wii bluetooth module"),
   C("dvd", "DVD drive / laser", "Wii drive (laser RAF-3350 / RAF-3355 family)", "media", "drive", (2,0), "Slot-loading DVD-based drive.", "Check drive chip (D2A/D2B/D2C/D2E/D3) and laser fit before ordering.", q="Wii laser RAF-3350", v=True),
   C("psu", "AC adapter", "RVL-002 (12 V DC 3.7 A)", "power", "psu", (4,0), "External adapter.", "", q="Wii RVL-002 power supply", src="mech"),
   C("wifi", "Wi-Fi module", "802.11b/g module", "io", "module", (0,1), "Wireless networking.", "", q="Wii wifi module"),
   C("cpu", "CPU", "IBM Broadway (PowerPC, 729 MHz)", "cpu", "bga", (1,1), "Faster Gekko derivative.", "", q="Wii Broadway"),
   C("hollywood", "GPU / system LSI", "ATI Hollywood (243 MHz) + 24 MB 1T-SRAM 'Napa'", "gpu", "bga", (2,1), "GPU, audio DSP, I/O and Starlet ARM security core in a multi-chip module.", "", q="Wii Hollywood"),
   C("fan", "Fan", "Rear exhaust fan", "power", "fan", (4,1), "Cooling.", "", q="Wii fan"),
   C("nand", "NAND flash (512 MB)", "512 MB NAND", "storage", "sop", (0,2), "System menu, channels, saves.", "Back up NAND (BootMii) before repairs.", q="Wii NAND"),
   C("gddr", "Main RAM (64 MB)", "64 MB GDDR3", "mem", "bga", (1,2), "Additional system memory.", "", q="Wii GDDR3"),
   C("gcp", "GameCube ports", "GC controller + memory card ports (RVL-001)", "io", "port", (2,2), "Back-compat ports (top flap).", "Removed on RVL-101 Family Edition.", q="Wii GameCube controller port"),
   C("av", "AV multi-out", "Wii AV multi-out", "video", "port", (3,2), "Composite/component/RGB 480p.", "", q="Wii component cable"),
   C("bar", "Sensor bar", "RVL-014 sensor bar", "io", "controller", (4,2), "IR LED bar the Wii Remote camera tracks.", "", q="Wii sensor bar RVL-014"),
   C("remote", "Wii Remote", "RVL-003", "io", "controller", (0,3), "Bluetooth controller with IR camera and accelerometer.", "", q="Wii Remote RVL-003")],
  [("remote","bt","Bluetooth"),("bt","hollywood","USB"),("wifi","hollywood","SDIO"),("dvd","hollywood","DI"),("cpu","hollywood","60x bus"),
   ("hollywood","gddr","GDDR3"),("nand","hollywood","NAND"),("gcp","hollywood","SI/EXI"),("hollywood","av","video+audio"),("bar","av","power"),("psu","fan","12 V")])

# ---------------------------------------------------------------- Wii U
K("wiiu", "Nintendo Wii U", "Nintendo", 2012, "Wii U", "WUP-101 (Basic 8 GB / Deluxe 32 GB)",
  "Multi-chip module (Espresso CPU + Latte GPU) with a streaming tablet GamePad.",
  [C("gp", "GamePad", "WUP-010", "io", "controller", (0,0), "Tablet controller receiving a 5 GHz video stream.", "Battery WUP-012 (1500 mAh) / WUP-013 (2550 mAh).", q="Wii U GamePad WUP-010"),
   C("odd", "Optical drive", "Wii U disc drive (Panasonic-made)", "media", "drive", (2,0), "25 GB proprietary disc drive.", "Drive is paired to the console.", q="Wii U disc drive"),
   C("psu", "AC adapter", "WUP-002 (15 V DC 5 A)", "power", "psu", (4,0), "External adapter.", "", q="Wii U WUP-002 power supply", src="mech"),
   C("wifi", "Wireless modules", "GamePad 5 GHz link + Wi-Fi/Bluetooth", "io", "module", (0,1), "GamePad streaming radio, Wi-Fi and Bluetooth.", "", q="Wii U wifi module"),
   C("cpu", "CPU", "IBM Espresso (3-core PowerPC, 1.24 GHz)", "cpu", "bga", (1,1), "Tri-core Broadway derivative on the MCM.", "", q="Wii U Espresso"),
   C("latte", "GPU", "AMD Latte (550 MHz, 32 MB eDRAM)", "gpu", "bga", (2,1), "GPU with embedded memory and Wii-mode logic.", "", q="Wii U Latte"),
   C("fan", "Fan", "Blower fan", "power", "fan", (4,1), "Cooling.", "", q="Wii U fan"),
   C("emmc", "eMMC storage", "8 GB / 32 GB eMMC (Samsung or Hynix)", "storage", "bga", (0,2), "System storage.", "Hynix eMMC units are failing with age; back up and consider replacement/redirect.", q="Wii U eMMC"),
   C("ram", "Main RAM (2 GB)", "2 GB DDR3 (4 chips)", "mem", "bga", (1,2), "System memory (1 GB for games).", "", q="Wii U DDR3"),
   C("hdmi", "HDMI port", "HDMI + AV multi-out", "video", "port", (3,2), "1080p HDMI and analog AV.", "", q="Wii U HDMI port"),
   C("bar", "Sensor bar", "RVL-014 sensor bar", "io", "controller", (4,2), "Wii Remote IR bar.", "", q="Wii sensor bar RVL-014")],
  [("gp","wifi","5 GHz stream"),("wifi","latte","SDIO/USB"),("odd","latte","SATA"),("cpu","latte","MCM link"),("latte","ram","DDR3"),
   ("emmc","latte","eMMC"),("latte","hdmi","video"),("bar","hdmi","power"),("psu","fan","12 V")])

# ---------------------------------------------------------------- PS4
K("ps4", "Sony PlayStation 4", "Sony", 2013, "PS4", "CUH-1000/1100/1200 (original), CUH-2000 (slim), CUH-7000 (Pro)",
  "AMD Jaguar APU with GDDR5. Common repairs: HDMI port/encoder, disc drive, fan and thermal paste.",
  [C("wifi", "Wi-Fi / Bluetooth", "Wi-Fi/Bluetooth module", "io", "module", (0,0), "DualShock 4 (CUH-ZCT1/ZCT2) and Wi-Fi.", "", q="PS4 wifi bluetooth module"),
   C("bd", "Blu-ray drive / laser", "BDP-010/015 (KES-490A laser) / BDP-020/025 (KES-860A laser)", "media", "drive", (2,0), "BD drive.", "Drive logic board is paired to the console.", q="PS4 KES-490A", v=True),
   C("hdd", "Hard drive", "500 GB 2.5\" SATA (user-replaceable)", "storage", "hdd", (3,0), "Game/OS storage.", "Upgrade to SSD or larger HDD (max 9.5 mm).", q="PS4 hard drive"),
   C("psu", "Power supply", "Internal PSU (e.g. ADP-200ER / ADP-240CR / ADP-160CR slim)", "power", "psu", (4,0), "Internal supply; model depends on CUH revision.", "Match the model printed on the original PSU.", q="PS4 ADP-240CR power supply", src="mech", v=True),
   C("sb", "Southbridge", "Aeolia (CUH-10xx) / Belize / Baikal", "io", "bga", (0,1), "ARM-based southbridge: USB, SATA, network, standby downloads.", "", q="PS4 southbridge", v=True),
   C("apu", "APU", "AMD 'Liverpool' (8-core Jaguar + 18 CU GCN), Sony CXD9002x", "cpu", "bga", (1,1), "CPU and GPU on one die.", "Overheating: replace thermal paste, clean fan.", q="PS4 APU", v=True),
   C("ram", "Main RAM (8 GB)", "8 GB GDDR5", "mem", "bga", (2,1), "Unified memory at 176 GB/s.", "", q="PS4 GDDR5"),
   C("fan", "Fan", "Blower fan", "power", "fan", (4,1), "Cooling.", "", q="PS4 fan"),
   C("hdmic", "HDMI encoder/retimer", "Panasonic MN86471A (CUH-10xx/11xx) / MN864729 (CUH-12xx+)", "video", "qfp", (2,2), "Converts APU display output to HDMI.", "Fails after HDMI cable yanks/surges; 'no video' fix.", q="MN864729", v=True),
   C("hdmi", "HDMI port", "PS4 HDMI port", "video", "port", (3,2), "HDMI out.", "Most common board repair (bent pins / broken port).", q="PS4 HDMI port"),
   C("flash", "System flash", "NOR/NAND system flash", "security", "sop", (0,2), "Boot firmware and console keys.", "", q="PS4 NOR flash")],
  [("wifi","sb","USB/SDIO"),("bd","sb","SATA"),("hdd","sb","SATA"),("sb","apu","PCIe"),("apu","ram","256-bit GDDR5"),("apu","hdmic","DisplayPort"),
   ("hdmic","hdmi","HDMI"),("flash","sb","SPI"),("psu","fan","12 V")])

# ---------------------------------------------------------------- Xbox One
K("xone", "Microsoft Xbox One", "Microsoft", 2013, "Xbox One", "Original (2013), One S (2016), One X (2017)",
  "AMD Jaguar APU with DDR3 + 32 MB ESRAM; HDMI pass-through input on the original model.",
  [C("wifi", "Wi-Fi / Bluetooth", "Marvell Avastar 88W8897-based module", "io", "module", (0,0), "Wi-Fi and controller radio.", "", q="Xbox One wifi module", v=True),
   C("bd", "Blu-ray drive", "Lite-On DG-6M1S (original) / DG-6M5S (One S)", "media", "drive", (2,0), "BD drive.", "Drive logic board is paired; keep the original board.", q="Xbox One DG-6M1S"),
   C("hdd", "Hard drive", "500 GB / 1 TB 2.5\" SATA", "storage", "hdd", (3,0), "Internal storage.", "", q="Xbox One hard drive"),
   C("psu", "Power supply", "External brick (original) / internal PSU (One S/X)", "power", "psu", (4,0), "Power.", "", q="Xbox One power brick", src="mech"),
   C("sb", "Southbridge", "Southbridge (Microsoft)", "io", "bga", (0,1), "USB, SATA, Ethernet.", "", q="Xbox One southbridge"),
   C("apu", "APU", "AMD 'Durango' (8-core Jaguar 1.75 GHz + 12 CU GCN, 32 MB ESRAM)", "cpu", "bga", (1,1), "CPU+GPU with on-die ESRAM.", "", q="Xbox One APU"),
   C("ram", "Main RAM (8 GB)", "8 GB DDR3-2133", "mem", "bga", (2,1), "System memory.", "", q="Xbox One DDR3"),
   C("fan", "Fan", "Axial fan", "power", "fan", (4,1), "Cooling.", "", q="Xbox One fan"),
   C("hdmi", "HDMI in/out", "HDMI ports + retimer", "video", "port", (3,2), "HDMI out and HDMI in (TV pass-through).", "Damaged HDMI port is common.", q="Xbox One HDMI port"),
   C("kinect", "Kinect port", "Kinect port (original model)", "io", "port", (0,2), "Kinect 2 sensor port (adapter on One S/X).", "", q="Xbox One Kinect adapter")],
  [("wifi","sb","USB"),("bd","sb","SATA"),("hdd","sb","SATA"),("sb","apu","PCIe"),("apu","ram","256-bit DDR3"),("apu","hdmi","video"),
   ("kinect","sb","USB 3"),("psu","fan","12 V")])

# ---------------------------------------------------------------- Switch
K("switch", "Nintendo Switch", "Nintendo", 2017, "Switch", "HAC-001 (2017), HAC-001(-01) (2019), HEG-001 (OLED)",
  "Hybrid console on NVIDIA Tegra X1. USB-C power/video ICs are the most common board repairs.",
  [C("usbc", "USB-C port", "Switch USB-C charging port", "io", "port", (0,0), "Charging and dock video/USB.", "Bent or worn port — replace, then check M92T36/BQ24193.", q="Nintendo Switch USB-C port"),
   C("pd", "USB-C PD / video controller", "M92T36", "power", "qfp", (1,0), "USB Power Delivery and DisplayPort alt-mode controller.", "Notorious failure with third-party docks: no charge / no dock video.", q="M92T36", src="custom"),
   C("mux", "USB-C mux", "PI3USB30532", "video", "qfp", (2,0), "Switches USB 3/DisplayPort lanes on the USB-C port.", "Fails alongside M92T36 in dock failures.", q="PI3USB30532"),
   C("chg", "Charging IC", "TI BQ24193", "power", "qfp", (3,0), "Battery charger.", "Shorts here = no charging / hot board.", q="BQ24193"),
   C("batt", "Battery", "HAC-003 (4310 mAh)", "power", "battery", (4,0), "Li-ion battery.", "", q="Nintendo Switch HAC-003 battery"),
   C("soc", "SoC", "NVIDIA Tegra X1 (ODNX02-A2) / Tegra X1+ 'Mariko' (ODNX10)", "cpu", "bga", (1,1), "4× Cortex-A57 CPU + 256-core Maxwell GPU.", "", q="Nintendo Switch Tegra X1"),
   C("ram", "RAM (4 GB)", "4 GB LPDDR4 (2 chips)", "mem", "bga", (2,1), "System memory.", "", q="Nintendo Switch LPDDR4"),
   C("pmic", "PMIC", "MAX77620 (+ MAX77621 CPU/GPU regulators)", "power", "bga", (3,1), "Power management for the SoC and rails.", "", q="MAX77620"),
   C("fan", "Fan / heatsink", "Switch cooling fan", "power", "fan", (4,1), "Cooling (handheld and dock).", "", q="Nintendo Switch fan"),
   C("cart", "Game card slot", "Game card reader slot", "media", "card", (0,1), "Reads Switch game cards.", "Bent pins = 'game card could not be read'.", q="Nintendo Switch game card slot"),
   C("emmc", "eMMC storage", "32 GB eMMC (64 GB on OLED)", "storage", "bga", (1,2), "System/game storage.", "", q="Nintendo Switch eMMC"),
   C("sd", "microSD slot", "microSD card reader", "storage", "card", (0,2), "Expandable storage (often combined with headphone jack board).", "", q="Nintendo Switch microSD reader"),
   C("lcd", "Display", "6.2\" 720p LCD (7\" OLED on HEG-001) + digitizer", "video", "display", (2,2), "Screen and touch.", "", q="Nintendo Switch LCD screen"),
   C("joy", "Joy-Con rails / Joy-Con", "Joy-Con rail connectors; Joy-Con HAC-015/016", "io", "controller", (3,2), "Controller rails and the Joy-Con themselves.", "Stick drift: replace the analog stick module.", q="Joy-Con analog stick replacement"),
   C("adp", "AC adapter", "HAC-002 (15 V 2.6 A USB-C)", "power", "psu", (4,2), "Official charger.", "Use official or spec-compliant adapters to avoid PD chip damage.", q="Nintendo Switch HAC-002", src="mech")],
  [("usbc","pd","CC / PD"),("usbc","mux","SS lanes"),("pd","chg","VBUS"),("chg","batt","charge"),("mux","soc","DP / USB3"),("soc","ram","LPDDR4"),
   ("pmic","soc","rails"),("cart","soc","game card"),("soc","emmc","eMMC"),("sd","soc","SDMMC"),("soc","lcd","MIPI DSI"),("joy","soc","UART"),("adp","usbc","15 V PD")])

# ---------------------------------------------------------------- Xbox Series X
K("xsx", "Microsoft Xbox Series X", "Microsoft", 2020, "Xbox Series X", "Model 1882",
  "Zen 2 + RDNA 2 SoC with GDDR6 and a custom NVMe SSD. Internal PSU, 130 mm top fan.",
  [C("wifi", "Wi-Fi / Bluetooth", "Wi-Fi 5 + Xbox Wireless radio", "io", "module", (0,0), "Controller radio and networking.", "", q="Xbox Series X wifi module"),
   C("bd", "4K UHD Blu-ray drive", "UHD Blu-ray drive", "media", "drive", (2,0), "Disc drive.", "Drive board paired to console.", q="Xbox Series X disc drive"),
   C("ssd", "Internal SSD", "1 TB NVMe SSD (M.2 2230 module)", "storage", "ssd", (3,0), "System storage.", "", q="Xbox Series X internal SSD 2230"),
   C("psu", "Power supply", "Internal 315 W PSU", "power", "psu", (4,0), "Internal supply.", "", q="Xbox Series X power supply", src="mech"),
   C("exp", "Storage expansion slot", "Storage Expansion Card slot (CFexpress-based)", "storage", "card", (0,1), "Proprietary expansion cards.", "", q="Xbox Series X storage expansion card"),
   C("soc", "SoC", "AMD custom 'Scarlett' (8-core Zen 2 3.8 GHz + 52 CU RDNA 2)", "cpu", "bga", (1,1), "CPU+GPU, 12 TFLOPS.", "", q="Xbox Series X APU"),
   C("ram", "RAM (16 GB)", "16 GB GDDR6 (10 chips, 320-bit)", "mem", "bga", (2,1), "10 GB fast + 6 GB standard.", "", q="Xbox Series X GDDR6"),
   C("fan", "Fan", "130 mm top fan", "power", "fan", (4,1), "Cooling.", "", q="Xbox Series X fan"),
   C("sb", "Southbridge", "Southbridge (Microsoft)", "io", "bga", (0,2), "USB, network, front panel.", "", q="Xbox Series X southbridge"),
   C("hdmi", "HDMI 2.1 port", "HDMI 2.1 port + retimer", "video", "port", (3,2), "4K120 output.", "Broken HDMI port is the common board repair.", q="Xbox Series X HDMI port")],
  [("wifi","sb","PCIe/USB"),("bd","sb","SATA"),("ssd","soc","PCIe 4.0 x2"),("exp","soc","PCIe 4.0"),("soc","ram","320-bit"),("sb","soc","PCIe"),
   ("soc","hdmi","HDMI 2.1"),("psu","fan","12 V")])

# ---------------------------------------------------------------- Xbox Series S
K("xss", "Microsoft Xbox Series S", "Microsoft", 2020, "Xbox Series S", "Model 1883",
  "Smaller digital-only sibling of the Series X with a lower-clocked GPU.",
  [C("wifi", "Wi-Fi / Bluetooth", "Wi-Fi 5 + Xbox Wireless radio", "io", "module", (0,0), "Controller radio and networking.", "", q="Xbox Series S wifi module"),
   C("ssd", "Internal SSD", "512 GB (or 1 TB) NVMe SSD (M.2 2230)", "storage", "ssd", (2,0), "System storage.", "", q="Xbox Series S internal SSD"),
   C("psu", "Power supply", "Internal PSU (~165 W)", "power", "psu", (4,0), "Internal supply.", "", q="Xbox Series S power supply", src="mech", v=True),
   C("exp", "Storage expansion slot", "Storage Expansion Card slot", "storage", "card", (0,1), "Proprietary expansion.", "", q="Xbox Series S expansion card"),
   C("soc", "SoC", "AMD custom 'Lockhart' (8-core Zen 2 3.6 GHz + 20 CU RDNA 2)", "cpu", "bga", (1,1), "CPU+GPU, 4 TFLOPS.", "", q="Xbox Series S APU"),
   C("ram", "RAM (10 GB)", "10 GB GDDR6", "mem", "bga", (2,1), "8 GB fast + 2 GB standard.", "", q="Xbox Series S GDDR6"),
   C("fan", "Fan", "Side exhaust fan", "power", "fan", (4,1), "Cooling.", "", q="Xbox Series S fan"),
   C("hdmi", "HDMI port", "HDMI 2.1 port", "video", "port", (3,2), "Video out.", "", q="Xbox Series S HDMI port")],
  [("wifi","soc","PCIe"),("ssd","soc","PCIe 4.0"),("exp","soc","PCIe 4.0"),("soc","ram","128-bit"),("soc","hdmi","HDMI"),("psu","fan","12 V")])

# ---------------------------------------------------------------- PS5
K("ps5", "Sony PlayStation 5", "Sony", 2020, "PS5", "CFI-10xx/11xx/12xx (launch), CFI-20xx (slim), CFI-70xx (Pro)",
  "AMD 'Oberon' SoC with a custom 825 GB SSD and liquid-metal thermal interface.",
  [C("wifi", "Wi-Fi 6 / Bluetooth 5.1", "Wi-Fi/BT module", "io", "module", (0,0), "DualSense (CFI-ZCT1) and networking.", "", q="PS5 wifi module"),
   C("bd", "UHD Blu-ray drive", "PS5 Ultra HD Blu-ray drive (detachable on slim)", "media", "drive", (2,0), "Disc drive.", "Drive board is paired to the console.", q="PS5 disc drive"),
   C("m2", "M.2 expansion slot", "M.2 2230–22110 PCIe 4.0 NVMe", "storage", "ssd", (3,0), "User storage expansion.", "Use a heatsinked Gen4 drive (5,500 MB/s+ recommended).", q="PS5 M.2 SSD heatsink"),
   C("psu", "Power supply", "Internal PSU (ADP-400DR / ADP-400FR on launch models)", "power", "psu", (4,0), "Internal supply.", "Match PSU model to your CFI revision.", q="PS5 ADP-400DR", src="mech", v=True),
   C("ssdc", "SSD controller + NAND", "Custom 12-channel SSD controller + soldered NAND (825 GB)", "storage", "bga", (0,1), "5.5 GB/s raw internal storage.", "Soldered; not user-replaceable.", q="PS5 SSD controller"),
   C("soc", "SoC", "AMD 'Oberon' (Sony CXD90060GG; 8-core Zen 2 + 36 CU RDNA 2)", "cpu", "bga", (1,1), "CPU+GPU, 10.28 TFLOPS.", "Liquid metal TIM — don't remove the shield unless necessary.", q="PS5 APU CXD90060GG", v=True),
   C("ram", "RAM (16 GB)", "16 GB GDDR6 (8 chips, 256-bit)", "mem", "bga", (2,1), "Unified memory at 448 GB/s.", "", q="PS5 GDDR6"),
   C("fan", "Fan", "120 mm blower fan", "power", "fan", (4,1), "Cooling.", "", q="PS5 fan"),
   C("hdmic", "HDMI retimer", "Panasonic MN864739", "video", "qfp", (2,2), "HDMI 2.1 signal conditioning.", "Frequent 'no video' failure with the HDMI port.", q="MN864739", v=True),
   C("hdmi", "HDMI 2.1 port", "PS5 HDMI port", "video", "port", (3,2), "4K120 / 8K out.", "Most common board repair.", q="PS5 HDMI port"),
   C("sb", "Southbridge", "Southbridge (Sony)", "io", "bga", (0,2), "USB, LAN, standby.", "", q="PS5 southbridge")],
  [("wifi","sb","PCIe"),("bd","sb","SATA"),("m2","soc","PCIe 4.0 x4"),("ssdc","soc","PCIe 4.0 x4"),("soc","ram","256-bit"),("sb","soc","PCIe"),
   ("soc","hdmic","video"),("hdmic","hdmi","HDMI 2.1"),("psu","fan","12 V")])

# ---------------------------------------------------------------- Switch 2
K("switch2", "Nintendo Switch 2", "Nintendo", 2025, "Switch 2", "BEE-001",
  "Hybrid console on NVIDIA's custom T239 SoC with magnetic Joy-Con 2 controllers.",
  [C("usbc", "USB-C ports", "USB-C ports ×2 (bottom + top)", "io", "port", (0,0), "Charging, dock video, accessories.", "", q="Nintendo Switch 2 USB-C port"),
   C("chg", "Charging / PD", "USB-PD controller + charger", "power", "qfp", (1,0), "Power delivery and charging.", "", q="Nintendo Switch 2 charging IC", src="custom", v=True),
   C("batt", "Battery", "5220 mAh Li-ion", "power", "battery", (4,0), "Internal battery.", "", q="Nintendo Switch 2 battery"),
   C("cart", "Game card slot", "Game card reader (Switch 1 & 2 cards)", "media", "card", (0,1), "Reads game cards and Game-Key cards.", "", q="Nintendo Switch 2 game card slot"),
   C("soc", "SoC", "NVIDIA T239 (8× Cortex-A78C + Ampere GPU, 1536 CUDA cores)", "cpu", "bga", (1,1), "Custom Tegra SoC with DLSS support.", "", q="Nintendo Switch 2 T239", v=True),
   C("ram", "RAM (12 GB)", "12 GB LPDDR5X", "mem", "bga", (2,1), "System memory.", "", q="Nintendo Switch 2 LPDDR5X"),
   C("fan", "Fan", "Cooling fan", "power", "fan", (4,1), "Cooling.", "", q="Nintendo Switch 2 fan"),
   C("ufs", "Internal storage", "256 GB UFS", "storage", "bga", (1,2), "System storage.", "", q="Nintendo Switch 2 UFS"),
   C("sd", "microSD Express slot", "microSD Express reader", "storage", "card", (0,2), "Expansion (microSD Express only for Switch 2 games).", "", q="microSD Express card"),
   C("lcd", "Display", "7.9\" 1080p 120 Hz LCD + touch", "video", "display", (2,2), "Screen.", "", q="Nintendo Switch 2 screen"),
   C("joy", "Joy-Con 2", "Joy-Con 2 (magnetic) + rails", "io", "controller", (3,2), "Magnetic controllers with mouse sensors.", "", q="Joy-Con 2 replacement"),
   C("adp", "AC adapter", "USB-C AC adapter", "power", "psu", (4,2), "Official charger.", "", q="Nintendo Switch 2 AC adapter", src="mech")],
  [("usbc","chg","VBUS / PD"),("chg","batt","charge"),("usbc","soc","DP / USB"),("cart","soc","game card"),("soc","ram","LPDDR5X"),
   ("soc","ufs","UFS"),("sd","soc","PCIe (SD Express)"),("soc","lcd","display"),("joy","soc","rails"),("adp","usbc","PD")])

# ---------------------------------------------------------------- Steam Machine
K("steammachine", "Valve Steam Machine", "Valve", 2026, "Steam Machine", "2026 release (512 GB / 2 TB)",
  "Compact SteamOS gaming PC/console with semi-custom AMD Zen 4 CPU and RDNA 3 GPU. Uses largely standard PC parts.",
  [C("wifi", "Wireless", "Wi-Fi 6E + Bluetooth 5.3 + Steam Controller radio", "io", "module", (0,0), "Networking and controllers.", "", q="Steam Machine wifi", v=True),
   C("ssd", "SSD", "512 GB / 2 TB M.2 NVMe SSD", "storage", "ssd", (2,0), "System storage (user-replaceable).", "", q="Steam Machine SSD", v=True),
   C("sd", "microSD slot", "microSD reader", "storage", "card", (3,0), "Expansion storage.", "", q="microSD card"),
   C("psu", "Power supply", "Internal PSU", "power", "psu", (4,0), "Internal supply.", "", q="Steam Machine power supply", src="mech"),
   C("cpu", "CPU", "AMD semi-custom Zen 4 (6-core / 12-thread)", "cpu", "bga", (1,1), "Main processor.", "", q="Steam Machine CPU", v=True),
   C("gpu", "GPU", "AMD semi-custom RDNA 3 (28 CU)", "gpu", "bga", (2,1), "Graphics, with its own GDDR6.", "", q="Steam Machine GPU", v=True),
   C("vram", "Video RAM (8 GB)", "8 GB GDDR6", "mem", "bga", (3,1), "GPU memory.", "", q="Steam Machine GDDR6", v=True),
   C("fan", "Fan", "Cooling fan", "power", "fan", (4,1), "Cooling.", "", q="Steam Machine fan"),
   C("ram", "System RAM (16 GB)", "16 GB DDR5", "mem", "bga", (1,2), "CPU memory.", "", q="Steam Machine DDR5", v=True),
   C("io", "Ports", "DisplayPort 1.4, HDMI 2.0, USB, Ethernet", "video", "port", (2,2), "Display and I/O.", "", q="Steam Machine HDMI port", v=True)],
  [("wifi","cpu","PCIe"),("ssd","cpu","PCIe 4.0"),("sd","cpu","USB/PCIe"),("cpu","gpu","PCIe"),("gpu","vram","GDDR6"),("cpu","ram","DDR5"),
   ("gpu","io","display"),("psu","fan","12 V")])


# sanity
for c in consoles:
    ids = {x["id"] for x in c["comps"]}
    assert len(ids) == len(c["comps"]), c["id"]
    pos = [(x["x"], x["y"]) for x in c["comps"]]
    assert len(set(pos)) == len(pos), (c["id"], "overlap")
    for l in c["links"]:
        assert l["a"] in ids and l["b"] in ids, (c["id"], l)

out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "app", "data.js")
with open(out, "w") as f:
    f.write("// Console Repair Atlas database. Edit and restart the app to add consoles or parts.\n")
    f.write("window.ATLAS_DATA = ")
    json.dump(consoles, f, indent=1, ensure_ascii=False)
    f.write(";\n")
print(len(consoles), "consoles,", sum(len(c["comps"]) for c in consoles), "components,", sum(1 for c in consoles for x in c["comps"] if x["verify"]), "flagged verify")
