// "Inside the console" board renderer: shell + PCB + realistic parts + copper traces.
(function () {
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const SHELL = {
    nes: "#c9c6bf", sms: "#1f1f21", tg16: "#e7e6e1", genesis: "#1b1b1d", snes: "#bdbbc2", saturn: "#2c2c30", ps1: "#c3c0ba",
    n64: "#2b2b2f", dc: "#ece9e2", ps2: "#17181c", xbox: "#1d1e21", gc: "#3f3a78", x360: "#e9e9ea", ps3: "#141416",
    wii: "#f1f1f1", wiiu: "#17171a", ps4: "#1a1b1e", xone: "#18191b", switch: "#2c2e33", xsx: "#151618", xss: "#ececec",
    ps5: "#f3f3f3", switch2: "#232428", steammachine: "#171717"
  };
  function pcbColor(k) {
    if (k.year < 1995) return { base: "#2c6a3c", dark: "#1f5530", trace: "#3f8a50", silk: "#eef3ea" };
    if (k.year < 2005) return { base: "#25603a", dark: "#1a4b2c", trace: "#357c48", silk: "#eef3ea" };
    if (k.year < 2015) return { base: "#1d4f33", dark: "#143c26", trace: "#2c6a43", silk: "#e9efe7" };
    return { base: "#163f2d", dark: "#0e2e20", trace: "#245a3e", silk: "#e4ebe3" };
  }
  function rng(seed) { let h = 2166136261; for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 100000) / 100000; }; }
  const lum = hex => { const n = parseInt(hex.slice(1), 16); return (0.3 * (n >> 16) + 0.59 * ((n >> 8) & 255) + 0.11 * (n & 255)) / 255; };
  function shade(hex, f) { const n = parseInt(hex.slice(1), 16); const ch = s => Math.max(0, Math.min(255, Math.round(((n >> s) & 255) * f))); return "#" + [16, 8, 0].map(s => ch(s).toString(16).padStart(2, "0")).join(""); }

  function markLines(pn, max) {
    let s = window.primaryPN(pn); const out = []; let cur = "";
    for (const w of s.split(/\s+/)) { if ((cur + " " + w).trim().length > max && cur) { out.push(cur); cur = w; } else cur = (cur + " " + w).trim(); }
    if (cur) out.push(cur); return out.slice(0, 3);
  }
  const txt = (lines, cx, cy, size, fill, weight = 700) => {
    const lh = size * 1.18, y0 = cy - (lines.length - 1) * lh / 2 + size * 0.35;
    return lines.map((l, i) => `<text x="${cx}" y="${y0 + i * lh}" font-size="${size}" fill="${fill}" font-weight="${weight}" text-anchor="middle" font-family="Consolas,'Cascadia Mono',monospace">${esc(l)}</text>`).join("");
  };

  const DEFS = `<defs>
   <linearGradient id="bd-chip" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2d3036"/><stop offset="1" stop-color="#141519"/></linearGradient>
   <linearGradient id="bd-metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eef1f4"/><stop offset=".5" stop-color="#a5adb5"/><stop offset="1" stop-color="#d6dbe0"/></linearGradient>
   <linearGradient id="bd-alu" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfd5db"/><stop offset="1" stop-color="#8f979f"/></linearGradient>
   <linearGradient id="bd-pin" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9aa3ad"/><stop offset=".5" stop-color="#f2f5f8"/><stop offset="1" stop-color="#8c949d"/></linearGradient>
   <linearGradient id="bd-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6d77c"/><stop offset="1" stop-color="#b98a2e"/></linearGradient>
   <radialGradient id="bd-cap" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#f4f6f8"/><stop offset="1" stop-color="#9ea6ae"/></radialGradient>
   <pattern id="bd-vent" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="4.5" cy="4.5" r="2.4" fill="#2b2f34"/></pattern>
   <pattern id="bd-mask" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="none"/><circle cx="1" cy="1" r=".5" fill="#fff" opacity=".04"/></pattern>
   <filter id="bd-sh" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="2" dy="5" stdDeviation="4" flood-color="#000" flood-opacity=".55"/></filter>
   <filter id="bd-glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>`;

  // ---------- package sizes (w,h) ----------
  function dipPins(c) {
    if (/373/.test(c.pn)) return 20; if (/F41[13]/.test(c.pn)) return 18; if (/68000/.test(c.pn)) return 64;
    if (/315-5124|315-5246/.test(c.pn)) return 42;
    return { cpu: 40, gpu: 40, mem: 24, security: 16, io: 16, audio: 24, video: 20, storage: 28 }[c.cat] || 28;
  }
  function sizeOf(c) {
    switch (c.pkg) {
      case "dip": { const n = dipPins(c); return [Math.min(212, n / 2 * 9.2 + 16), 64]; }
      case "qfp": return [110, 110];
      case "bga": return (c.cat === "cpu" || c.cat === "gpu") ? [124, 124] : [84, 60];
      case "sop": return [100, 52];
      case "to220": return [80, 104];
      case "crystal": return [64, 26];
      case "edge": return [214, 56];
      case "port": return [100, 70];
      case "drive": return [214, 156];
      case "hdd": return [164, 116];
      case "ssd": return [190, 40];
      case "psu": return /adapter|brick|External/i.test(c.pn + c.name) ? [70, 64] : [204, 140];
      case "fan": return [134, 134];
      case "battery": return /20\d\d|capacitor/i.test(c.pn + c.name) ? [56, 56] : [176, 76];
      case "module": return [130, 86];
      case "controller": return [110, 46];
      case "display": return [130, 46];
      case "card": return [120, 86];
      default: return [110, 70];
    }
  }

  // ---------- part drawings (centered at 0,0) ----------
  const P = {
    dip(c, w, h) {
      const n = dipPins(c), half = n / 2, bw = w - 6, pitch = (bw - 16) / (half - 1); let pins = "";
      for (let i = 0; i < half; i++) { const x = -bw / 2 + 8 + i * pitch - 2.5; pins += `<rect x="${x}" y="${-h / 2}" width="5" height="12" rx="1" fill="url(#bd-pin)"/><rect x="${x}" y="${h / 2 - 12}" width="5" height="12" rx="1" fill="url(#bd-pin)"/>`; }
      return `${pins}<rect x="${-bw / 2}" y="${-h / 2 + 9}" width="${bw}" height="${h - 18}" rx="3" fill="url(#bd-chip)" filter="url(#bd-sh)"/>
        <path d="M${-bw / 2} -7 a7 7 0 0 1 0 14" fill="#08090b"/>${txt(markLines(c.pn, Math.floor(bw / 8.5)), 0, 0, 11, "#dfe3e8")}`;
    },
    qfp(c, w) {
      const s = w - 22, n = 20; let pins = "";
      for (let i = 0; i < n; i++) { const o = -s / 2 + 7 + i * ((s - 14) / (n - 1)) - 1;
        pins += `<rect x="${o}" y="${-w / 2}" width="2.2" height="12" fill="url(#bd-pin)"/><rect x="${o}" y="${w / 2 - 12}" width="2.2" height="12" fill="url(#bd-pin)"/><rect x="${-w / 2}" y="${o}" width="12" height="2.2" fill="url(#bd-pin)"/><rect x="${w / 2 - 12}" y="${o}" width="12" height="2.2" fill="url(#bd-pin)"/>`; }
      return `${pins}<rect x="${-s / 2}" y="${-s / 2}" width="${s}" height="${s}" rx="2" fill="url(#bd-chip)" filter="url(#bd-sh)"/><circle cx="${-s / 2 + 9}" cy="${-s / 2 + 9}" r="3.2" fill="#08090b"/>${txt(markLines(c.pn, 10), 0, 0, 10.5, "#dfe3e8")}`;
    },
    bga(c, w, h) {
      if (w === h) {
        let caps = ""; for (let i = 0; i < 7; i++) caps += `<rect x="${-w / 2 + 14 + i * 15}" y="${-w / 2 + 5}" width="7" height="3.5" fill="#c49a52"/><rect x="${-w / 2 + 14 + i * 15}" y="${w / 2 - 8.5}" width="7" height="3.5" fill="#c49a52"/>`;
        return `<rect x="${-w / 2}" y="${-w / 2}" width="${w}" height="${w}" rx="4" fill="#3c5a3a" filter="url(#bd-sh)"/>${caps}
          <rect x="${-w / 2 + 16}" y="${-w / 2 + 16}" width="${w - 32}" height="${w - 32}" rx="4" fill="url(#bd-metal)"/><circle cx="${-w / 2 + 7}" cy="${w / 2 - 7}" r="2.5" fill="#e8d9a0"/>
          ${txt(markLines(c.pn, 11), 0, 0, 10, "#2a2e34")}`;
      }
      return `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="2" fill="url(#bd-chip)" filter="url(#bd-sh)"/><circle cx="${-w / 2 + 6}" cy="${-h / 2 + 6}" r="2" fill="#555b63"/>${txt(markLines(c.pn, 10).slice(0, 2), 0, 0, 9.5, "#cfd4da")}`;
    },
    sop(c, w, h) {
      let pins = ""; const bw = w - 4; for (let i = 0; i < 12; i++) { const x = -bw / 2 + 6 + i * ((bw - 14) / 11); pins += `<rect x="${x}" y="${-h / 2}" width="3.2" height="9" fill="url(#bd-pin)"/><rect x="${x}" y="${h / 2 - 9}" width="3.2" height="9" fill="url(#bd-pin)"/>`; }
      return `${pins}<rect x="${-bw / 2}" y="${-h / 2 + 7}" width="${bw}" height="${h - 14}" rx="2" fill="url(#bd-chip)" filter="url(#bd-sh)"/><circle cx="${-bw / 2 + 6}" cy="${h / 2 - 13}" r="2" fill="#08090b"/>${txt(markLines(c.pn, 12).slice(0, 2), 0, 0, 9.5, "#dfe3e8")}`;
    },
    to220(c, w, h) {
      let fins = ""; for (let i = 0; i < 7; i++) fins += `<rect x="${-w / 2 + 4 + i * ((w - 10) / 6)}" y="${-h / 2}" width="3" height="52" fill="#7d868f"/>`;
      return `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="54" rx="3" fill="url(#bd-alu)" filter="url(#bd-sh)"/>${fins}
        <rect x="-22" y="${-h / 2 + 46}" width="44" height="38" rx="2" fill="url(#bd-chip)"/><circle cx="0" cy="${-h / 2 + 30}" r="5" fill="#3c4148"/>
        ${txt(markLines(c.pn, 8).slice(0, 1), 0, -h / 2 + 66, 10, "#dfe3e8")}
        ${[-12, 0, 12].map(x => `<rect x="${x - 2}" y="${h / 2 - 20}" width="4" height="16" fill="url(#bd-pin)"/><circle cx="${x}" cy="${h / 2 - 4}" r="4" fill="url(#bd-gold)"/>`).join("")}`;
    },
    crystal(c, w, h) {
      const f = (c.pn.match(/[\d.]+\s*MHz/) || ["XTAL"])[0].replace(/\s/g, "");
      return `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${h / 2}" fill="url(#bd-metal)" filter="url(#bd-sh)"/><rect x="${-w / 2 + 4}" y="${-h / 2 + 4}" width="${w - 8}" height="${h - 8}" rx="${h / 2 - 4}" fill="none" stroke="#fff" stroke-opacity=".6"/>${txt([f], 0, 0, 8.5, "#2b3036")}`;
    },
    edge(c, w, h) {
      let ct = ""; for (let i = 0; i < 36; i++) ct += `<rect x="${-w / 2 + 14 + i * ((w - 28) / 35) - 1.3}" y="-7" width="2.6" height="14" fill="url(#bd-gold)"/>`;
      return `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="4" fill="#262a2f" filter="url(#bd-sh)"/><rect x="${-w / 2 + 8}" y="-11" width="${w - 16}" height="22" rx="2" fill="#0b0c0e"/>${ct}
        <rect x="${-w / 2 - 6}" y="-14" width="10" height="28" rx="2" fill="#3a3f46"/><rect x="${w / 2 - 4}" y="-14" width="10" height="28" rx="2" fill="#3a3f46"/>`;
    },
    port(c, w, h) {
      return `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="6" fill="url(#bd-metal)" filter="url(#bd-sh)"/>
        <rect x="${-w / 2 + 12}" y="${-h / 2 + 12}" width="${w - 24}" height="${h - 24}" rx="9" fill="#14171b"/><rect x="${-w / 2 + 22}" y="-5" width="${w - 44}" height="10" rx="2" fill="#2d333b"/>
        ${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${-w / 2 + 26 + i * ((w - 56) / 5)}" y="-3" width="4" height="6" fill="#d9b45a"/>`).join("")}
        ${[-1, 1].map(s => `<circle cx="${s * (w / 2 - 6)}" cy="${h / 2 - 6}" r="3" fill="url(#bd-gold)"/>`).join("")}`;
    },
    drive(c, w, h) {
      return `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="5" fill="url(#bd-alu)" filter="url(#bd-sh)"/>
        <rect x="${-w / 2 + 8}" y="${-h / 2 + 8}" width="${w - 16}" height="${h - 16}" rx="4" fill="none" stroke="#7d868f"/>
        <circle cx="-34" cy="0" r="${h / 2 - 16}" fill="#c6ced6" stroke="#8d959e"/><circle cx="-34" cy="0" r="16" fill="#3a4047"/><circle cx="-34" cy="0" r="6" fill="#9aa3ad"/>
        <rect x="${w / 2 - 70}" y="${-h / 2 + 16}" width="5" height="${h - 32}" fill="#59616a"/><rect x="${w / 2 - 32}" y="${-h / 2 + 16}" width="5" height="${h - 32}" fill="#59616a"/>
        <rect x="${w / 2 - 74}" y="-18" width="52" height="36" rx="4" fill="#23272c"/><circle cx="${w / 2 - 48}" cy="0" r="8" fill="#2f5cc9"/><circle cx="${w / 2 - 50}" cy="-2" r="3" fill="#bcd2ff"/>
        <rect x="${-w / 2 + 14}" y="${h / 2 - 10}" width="60" height="20" fill="#d7d2c6" opacity=".9"/>${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<line x1="${-w / 2 + 18 + i * 7}" y1="${h / 2 - 8}" x2="${-w / 2 + 18 + i * 7}" y2="${h / 2 + 8}" stroke="#a49c8b"/>`).join("")}`;
    },
    hdd(c, w, h) {
      return `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="6" fill="url(#bd-alu)" filter="url(#bd-sh)"/>
        <rect x="${-w / 2 + 12}" y="${-h / 2 + 12}" width="${w * 0.55}" height="${h - 24}" rx="3" fill="#f3f3f0"/>
        ${txt(markLines(c.pn, 16).slice(0, 3), -w / 2 + 12 + w * 0.275, 0, 8.5, "#333", 600)}
        ${[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy]) => `<circle cx="${sx * (w / 2 - 8)}" cy="${sy * (h / 2 - 8)}" r="3.5" fill="#6b737c"/>`).join("")}
        <rect x="${w / 2 - 38}" y="-26" width="24" height="52" rx="2" fill="#1d2025"/>`;
    },
    ssd(c, w, h) {
      return `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="3" fill="#1c5132" filter="url(#bd-sh)"/>
        <rect x="${-w / 2}" y="${-h / 2 + 5}" width="10" height="${h - 10}" fill="url(#bd-gold)"/><path d="M${w / 2 - 6} -5 a5 5 0 0 1 0 10" fill="#0e2e20"/>
        <rect x="${-w / 2 + 22}" y="${-h / 2 + 5}" width="46" height="${h - 10}" rx="2" fill="url(#bd-chip)"/><rect x="${-w / 2 + 76}" y="${-h / 2 + 5}" width="46" height="${h - 10}" rx="2" fill="url(#bd-chip)"/>
        <rect x="${-w / 2 + 130}" y="${-h / 2 + 8}" width="32" height="${h - 16}" rx="2" fill="url(#bd-chip)"/>${txt(["NVMe"], -w / 2 + 45, 0, 8, "#bfc6cd")}`;
    },
    psu(c, w, h) {
      if (w < 100) return `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="5" fill="#1d2025" filter="url(#bd-sh)"/><circle r="${h / 2 - 12}" fill="#0b0c0e"/><circle r="5" fill="url(#bd-pin)"/>
        <text y="${h / 2 + 14}" text-anchor="middle" font-size="9" fill="#eef3ea" font-family="Consolas,monospace">DC IN</text>`;
      return `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="5" fill="url(#bd-alu)" filter="url(#bd-sh)"/>
        <rect x="${-w / 2 + 10}" y="${-h / 2 + 10}" width="${w * 0.48}" height="${h - 20}" fill="url(#bd-vent)" opacity=".75"/>
        <rect x="${w * 0.02}" y="${-h / 2 + 14}" width="${w * 0.42}" height="46" rx="3" fill="#f2f2ee"/>${txt(markLines(c.pn, 18).slice(0, 2), w * 0.23, -h / 2 + 37, 8, "#333", 600)}
        <g>${["#c0392b", "#222", "#e1b12c", "#222"].map((col, i) => `<path d="M${w * 0.1 + i * 9} ${h / 2 - 8} q 0 26 ${-30 - i * 4} 40" stroke="${col}" stroke-width="5" fill="none" stroke-linecap="round"/>`).join("")}</g>`;
    },
    fan(c, w) {
      const r = w / 2 - 8; let blades = ""; for (let i = 0; i < 9; i++) blades += `<path d="M0 0 q ${r * 0.55} ${-r * 0.5} ${r * 0.85} ${-r * 0.1} q ${-r * 0.3} ${r * 0.15} ${-r * 0.85} ${r * 0.1}z" fill="#3a3f46" transform="rotate(${i * 40})"/>`;
      return `<rect x="${-w / 2}" y="${-w / 2}" width="${w}" height="${w}" rx="12" fill="#1c1f23" filter="url(#bd-sh)"/><circle r="${r}" fill="#0b0c0e"/>${blades}<circle r="${r * 0.33}" fill="#24282d"/><circle r="${r * 0.22}" fill="#d8d3c8"/>
        ${[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy]) => `<circle cx="${sx * (w / 2 - 9)}" cy="${sy * (w / 2 - 9)}" r="4" fill="#0b0c0e"/>`).join("")}`;
    },
    battery(c, w, h) {
      if (w === h) return `<circle r="${w / 2}" fill="#2a2d33" filter="url(#bd-sh)"/><circle r="${w / 2 - 5}" fill="url(#bd-cap)"/>${txt(["+", window.primaryPN(c.pn).split(/[ (]/)[0].slice(0, 7)], 0, 0, 8.5, "#2b3036")}`;
      return `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="8" fill="#c9ced3" filter="url(#bd-sh)"/><rect x="${-w / 2 + 8}" y="${-h / 2 + 8}" width="${w - 30}" height="${h - 16}" rx="4" fill="#eceee9"/>
        ${txt(markLines(c.pn, 18).slice(0, 2), -11, 0, 10, "#2b3036")}<rect x="${w / 2 - 18}" y="-10" width="14" height="20" rx="2" fill="#efe8d8"/>
        <path d="M${w / 2 - 4} -4 q 20 0 22 20 M${w / 2 - 4} 4 q 14 0 16 16" stroke="#c0392b" stroke-width="2.5" fill="none"/>`;
    },
    module(c, w, h) {
      return `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="4" fill="#1c4d74" filter="url(#bd-sh)"/>
        <rect x="${-w / 2 + 10}" y="${-h / 2 + 10}" width="${w * 0.58}" height="${h - 20}" rx="3" fill="url(#bd-metal)"/>${txt(markLines(c.pn, 11).slice(0, 2), -w / 2 + 10 + w * 0.29, 0, 8.5, "#2b3036")}
        <path d="M${w / 2 - 34} ${-h / 2 + 12} h22 v12 h-16 v12 h16 v12 h-16" stroke="url(#bd-gold)" stroke-width="2.5" fill="none"/>
        ${[0, 1, 2, 3, 4].map(i => `<circle cx="${w / 2 - 30 + i * 6}" cy="${h / 2 - 9}" r="2.4" fill="url(#bd-gold)"/>`).join("")}`;
    },
    controller(c, w, h) {
      let p = ""; for (let i = 0; i < 12; i++) p += `<rect x="${-w / 2 + 10 + i * ((w - 22) / 11)}" y="-4" width="3" height="8" fill="url(#bd-gold)"/>`;
      return `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="4" fill="#efece4" filter="url(#bd-sh)"/><rect x="${-w / 2 + 6}" y="-8" width="${w - 12}" height="16" rx="2" fill="#1a1c20"/>${p}`;
    },
    display(c, w, h) {
      return `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h * 0.42}" rx="2" fill="#efece4" filter="url(#bd-sh)"/><rect x="${-w / 2 + 10}" y="${-h / 2 + h * 0.42 - 2}" width="${w - 20}" height="${h * 0.6}" fill="#d98a2b" opacity=".92"/>
        ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => `<line x1="${-w / 2 + 16 + i * ((w - 32) / 9)}" y1="${-h / 2 + h * 0.42}" x2="${-w / 2 + 16 + i * ((w - 32) / 9)}" y2="${h / 2}" stroke="#b5741f"/>`).join("")}`;
    },
    card(c, w, h) {
      return `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="4" fill="url(#bd-metal)" filter="url(#bd-sh)"/>
        <rect x="${-w / 2 + 10}" y="${-h / 2 + 10}" width="${w - 20}" height="${h - 30}" rx="2" fill="#2a2e34"/>
        ${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `<rect x="${-w / 2 + 16 + i * ((w - 36) / 8)}" y="${-h / 2 + 14}" width="4" height="${h - 42}" rx="1" fill="url(#bd-gold)"/>`).join("")}
        <rect x="${-w / 2 + 10}" y="${h / 2 - 16}" width="${w - 20}" height="6" fill="#7d868f"/>`;
    }
  };

  function busLines(label) {
    let m = label.match(/(\d+)-bit/); let bits = m ? +m[1] : null;
    if (!bits) { m = label.match(/[A-Z]+(\d+)\s*[-–]\s*[A-Z]*(\d+)/); if (m) bits = +m[2] - +m[1] + 1; }
    if (!bits && /bus|DDR|GDDR|RDRAM|LPDDR|PCIe|Rambus|XDR|FSB|SysAD|FlexIO|MCM/i.test(label)) bits = 16;
    if (!bits && /V$|VBUS|12 V|9 V|10 V|rails|PD|charge/i.test(label)) return { n: 1, w: 7 };
    return { n: bits ? Math.min(7, Math.max(3, Math.round(bits / 6))) : 2, w: 2.2 };
  }

  function legendSVG(k, refs, x, y, title) {
    const items = [...k.comps.map(c => ({ id: c.id, ref: refs[c.id], txt: c.name })), ...(k.fuses || []).map(f => ({ id: f.id, ref: f.ref, txt: `${f.rating} · ${f.use}` }))];
    const RH = 21, W = 380, H = 44 + items.length * RH;
    let rows = items.map((it, i) => `<g class="ic lrow" data-id="${it.id}" transform="translate(0 ${44 + i * RH})"><rect class="lbg" x="2" y="-15" width="${W - 4}" height="${RH}"/>
      <text x="14" y="0" font-size="12.5" font-weight="800" fill="#1440a0" font-family="Consolas,monospace">${esc(it.ref)}</text>
      <text x="74" y="0" font-size="12.5" fill="#111" font-family="Segoe UI,Arial">${esc(it.txt.length > 44 ? it.txt.slice(0, 43) + "…" : it.txt)}</text></g>`).join("");
    return `<g class="legendbox" transform="translate(${x} ${y})"><rect width="${W}" height="${H}" fill="#fff" stroke="#111" stroke-width="1.5" filter="url(#bd-sh)"/>
      <text x="14" y="26" font-size="14" font-weight="800" fill="#1440a0" font-style="italic" font-family="Segoe UI,Arial">Ref</text>
      <text x="74" y="26" font-size="14" font-weight="800" fill="#1440a0" font-style="italic" font-family="Segoe UI,Arial">${esc(title)}</text>${rows}</g>`;
  }

  // Real board photo with hotspots + the same callout style
  window.renderPhotoBoard = function (k, refs, photo, spots, editing) {
    const W = photo.w, H = photo.h, sc = Math.max(1, W / 1000);
    let out = DEFS + `<image href="${photo.url}" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="none"/>`;
    const all = [...k.comps.map(c => ({ c, ref: refs[c.id], sub: null, mark: null })), ...(k.fuses || []).map(f => ({ c: f, ref: f.ref, sub: f.rating, mark: f.marking }))];
    let hs = "", co = "";
    all.forEach(({ c, ref, sub, mark }, i) => {
      const r = spots[c.id]; if (!r) return;
      const [x, y, w, h] = r, cx = x + w / 2, cy = y + h / 2;
      hs += `<g class="ic hotspot" data-id="${c.id}"><rect class="hs" x="${x}" y="${y}" width="${w}" height="${h}" rx="${4 * sc}"/><title>${ref} · ${esc(c.name)} — ${esc(c.pn)}</title></g>`;
      const dx = (cx < W / 2 ? -1 : 1) * (60 + (i % 3) * 18) * sc, dy = -(56 + (i % 2) * 22) * sc;
      let bx = Math.min(W - 40 * sc, Math.max(40 * sc, cx + dx)), by = Math.max(24 * sc, cy + dy);
      const bw = Math.max(44, ref.length * 8.6 + 22) * sc, bh = (sub ? 38 : 26) * sc;
      co += `<g class="callout" data-for="${c.id}" style="pointer-events:none"><line x1="${bx}" y1="${by}" x2="${cx}" y2="${cy}" stroke="#d6261c" stroke-width="${2.6 * sc}"/><circle cx="${cx}" cy="${cy}" r="${3.5 * sc}" fill="#d6261c"/>
        <rect x="${bx - bw / 2}" y="${by - bh / 2}" width="${bw}" height="${bh}" rx="${bh / 2}" fill="#d6261c" stroke="#fff" stroke-width="${1.5 * sc}"/>
        <text x="${bx}" y="${by + (sub ? -3 : 4.5) * sc}" text-anchor="middle" font-size="${13 * sc}" font-weight="800" fill="#fff" font-family="Segoe UI,Arial">${esc(ref)}</text>
        ${sub ? `<text x="${bx}" y="${by + 12 * sc}" text-anchor="middle" font-size="${11 * sc}" font-weight="700" fill="#fff" font-family="Segoe UI,Arial">${esc(sub)}</text>` : ""}
        ${mark ? `<circle cx="${bx + bw / 2}" cy="${by + bh / 2}" r="${12 * sc}" fill="#111" stroke="#fff" stroke-width="${1.2 * sc}"/><text x="${bx + bw / 2}" y="${by + bh / 2 + 4 * sc}" text-anchor="middle" font-size="${10 * sc}" font-weight="800" fill="#fff" font-family="Segoe UI,Arial">${esc(mark)}</text>` : ""}</g>`;
    });
    out += `<g class="hotspots${editing ? " editing" : ""}">${hs}</g>${editing ? "" : `<g class="callouts">${co}</g>`}`;
    out += `<g transform="scale(${sc})">${legendSVG(k, refs, W / sc + 30, 0, k.fuses && k.fuseBoard ? `Fuses & parts · ${k.fuseBoard}` : "Parts & function")}</g>`;
    return out;
  };

  window.renderBoard = function (k, refs, catColor) {
    const R = rng(k.id), pcb = pcbColor(k), shell = SHELL[k.id] || "#222";
    const CW = 248, CH = 182, OX = 110, OY = 110;
    const cols = Math.max(...k.comps.map(c => c.x)) + 1, rows = Math.max(...k.comps.map(c => c.y)) + 1;
    const BW = cols * CW + 40, BH = rows * CH + 40, bx = OX - 20, by = OY - 20;
    const geo = {};
    for (const c of k.comps) {
      const [w, h] = sizeOf(c);
      const jx = (R() - 0.5) * 18, jy = (R() - 0.5) * 12;
      geo[c.id] = { cx: OX + c.x * CW + CW / 2 + jx, cy: OY + c.y * CH + CH / 2 + jy, w, h };
    }
    const inside = (x, y, m) => Object.values(geo).some(g => Math.abs(x - g.cx) < g.w / 2 + m && Math.abs(y - g.cy) < g.h / 2 + m);

    // shell (opened case)
    const sx = bx - 46, sy = by - 46, SW = BW + 92, SH = BH + 92;
    const light = lum(shell) > 0.5, rim = shade(shell, light ? 0.82 : 1.6), inner = shade(shell, light ? 0.7 : 0.75);
    let out = DEFS;
    out += `<g class="shell"><rect x="${sx}" y="${sy}" width="${SW}" height="${SH}" rx="34" fill="${shell}" filter="url(#bd-sh)"/>
      <rect x="${sx + 12}" y="${sy + 12}" width="${SW - 24}" height="${SH - 24}" rx="26" fill="${inner}" stroke="${rim}" stroke-width="2"/>
      ${[[0, 0], [1, 0], [0, 1], [1, 1], [0.5, 0], [0.5, 1]].map(([fx, fy]) => { const x = sx + 28 + fx * (SW - 56), y = sy + 28 + fy * (SH - 56); return `<circle cx="${x}" cy="${y}" r="11" fill="${shade(shell, light ? 0.6 : 1.4)}"/><circle cx="${x}" cy="${y}" r="4.5" fill="#0c0d0f"/>`; }).join("")}
      <text x="${sx + SW - 30}" y="${sy + SH - 18}" font-size="13" fill="${light ? "#00000066" : "#ffffff55"}" text-anchor="end" font-family="Segoe UI,system-ui">${esc(k.name)} · top cover removed</text></g>`;

    // board
    out += `<rect x="${bx}" y="${by}" width="${BW}" height="${BH}" rx="14" fill="${pcb.base}" filter="url(#bd-sh)"/>
      <rect x="${bx}" y="${by}" width="${BW}" height="${BH}" rx="14" fill="url(#bd-mask)"/>
      <rect x="${bx + 6}" y="${by + 6}" width="${BW - 12}" height="${BH - 12}" rx="10" fill="none" stroke="${pcb.dark}" stroke-width="3"/>`;
    // ground pour hatching + random background traces
    let bg = "";
    for (let i = 0; i < 70; i++) {
      const x = bx + 20 + R() * (BW - 40), y = by + 20 + R() * (BH - 40), L = 30 + R() * 120, horiz = R() > 0.5;
      if (inside(x, y, 6)) continue;
      const d = horiz ? `M${x},${y} h${L} l10,10 h${L * 0.4}` : `M${x},${y} v${L} l10,10 v${L * 0.4}`;
      bg += `<path d="${d}" stroke="${pcb.trace}" stroke-width="1.6" fill="none" opacity=".55"/>`;
    }
    out += `<clipPath id="bd-clip"><rect x="${bx + 8}" y="${by + 8}" width="${BW - 16}" height="${BH - 16}" rx="10"/></clipPath><g class="bgtraces" clip-path="url(#bd-clip)">${bg}</g>`;

    // copper traces for real connections
    let tr = "";
    k.links.forEach((l, i) => {
      const a = geo[l.a], b = geo[l.b]; const { n, w } = busLines(l.label);
      const lane = ((i % 5) - 2) * 4;
      let lines = "";
      for (let j = 0; j < n; j++) {
        const o = (j - (n - 1) / 2) * (w + 3.4) + lane;
        let d;
        if (Math.abs(a.cy - b.cy) < 30) d = `M${a.cx},${a.cy + o} H${b.cx}`;
        else if (Math.abs(a.cx - b.cx) < 30) d = `M${a.cx + o},${a.cy} V${b.cy}`;
        else {
          const sxn = Math.sign(b.cx - a.cx), syn = Math.sign(b.cy - a.cy), ch = 14;
          const cx = b.cx + o * sxn * -1, cy = a.cy + o;
          d = `M${a.cx},${cy} H${cx - sxn * ch} L${cx},${cy + syn * ch} V${b.cy}`;
        }
        lines += `<path class="trace" d="${d}" stroke-width="${w}"/>`;
      }
      // vias at bends
      tr += `<g class="wg" data-a="${l.a}" data-b="${l.b}">${lines}<circle class="via" cx="${b.cx}" cy="${a.cy}" r="3.6"/></g>`;
    });
    out += `<g class="traces">${tr}</g>`;

    // decorative passives
    let dec = "";
    const capBody = k.year < 2000 ? (k.id === "genesis" || k.id === "sms" ? "#1a1a1a" : "#1d3a7a") : "#1a1a1a";
    for (let i = 0, placed = 0; i < 400 && placed < 26; i++) {
      const x = bx + 34 + R() * (BW - 68), y = by + 34 + R() * (BH - 68), r = 9 + R() * 7;
      if (inside(x, y, r + 8)) continue; placed++;
      dec += `<g filter="url(#bd-sh)"><circle cx="${x}" cy="${y}" r="${r}" fill="${capBody}"/><path d="M${x - r * 0.98} ${y - r * 0.2} A${r} ${r} 0 0 1 ${x - r * 0.2} ${y - r * 0.98}" stroke="#d8dde2" stroke-width="${r * 0.35}" fill="none" opacity=".8"/>
        <circle cx="${x}" cy="${y}" r="${r * 0.7}" fill="url(#bd-cap)"/><path d="M${x - r * 0.45} ${y} h${r * 0.9} M${x} ${y - r * 0.45} v${r * 0.9}" stroke="#7f8790" stroke-width="1.2"/></g>
        <circle cx="${x}" cy="${y}" r="${r + 3}" fill="none" stroke="${pcb.silk}" stroke-opacity=".55" stroke-width="1"/>`;
    }
    for (let i = 0, placed = 0; i < 900 && placed < 110; i++) {
      const x = bx + 20 + R() * (BW - 40), y = by + 20 + R() * (BH - 40);
      if (inside(x, y, 8)) continue; placed++;
      const rot = R() > 0.5 ? 90 : 0, res = R() > 0.55;
      dec += `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="-6" y="-3" width="12" height="6" fill="${res ? "#16181b" : "#b8996a"}"/><rect x="-7" y="-3" width="3" height="6" fill="#d7dbe0"/><rect x="4" y="-3" width="3" height="6" fill="#d7dbe0"/></g>`;
    }
    for (let i = 0; i < 160; i++) { const x = bx + 14 + R() * (BW - 28), y = by + 14 + R() * (BH - 28); if (!inside(x, y, 4)) dec += `<circle cx="${x}" cy="${y}" r="2.2" fill="url(#bd-gold)" opacity=".8"/>`; }
    out += `<g class="passives">${dec}</g>`;

    // mounting holes + silkscreen board name
    out += [[1, 1], [BW - 1, 1], [1, BH - 1], [BW - 1, BH - 1]].map(([x, y]) => { const hx = bx + (x < 2 ? 22 : x - 22), hy = by + (y < 2 ? 22 : y - 22); return `<circle cx="${hx}" cy="${hy}" r="11" fill="url(#bd-gold)"/><circle cx="${hx}" cy="${hy}" r="5.5" fill="${inner}"/>`; }).join("");
    out += `<text x="${bx + 44}" y="${by + BH - 16}" font-size="14" font-weight="700" fill="${pcb.silk}" font-family="Consolas,monospace" opacity=".85">${esc(k.board.split(/ \(|,/)[0])}</text>
      <text x="${bx + BW - 44}" y="${by + 30}" font-size="11" fill="${pcb.silk}" font-family="Consolas,monospace" opacity=".7" text-anchor="end">${esc(k.short.toUpperCase())} MAIN BOARD · ${k.year}</text>`;

    // the real parts
    let parts = "", callouts = "";
    const pill = (x, y, label, sub, id, tx, ty, mark) => {
      const w = Math.max(44, label.length * 8.6 + 22), h = sub ? 38 : 26;
      let s = `<g class="callout" data-for="${id}"><line x1="${x}" y1="${y}" x2="${tx}" y2="${ty}" stroke="#d6261c" stroke-width="2.4"/><circle cx="${tx}" cy="${ty}" r="3.5" fill="#d6261c"/>
        <rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="${h / 2}" fill="#d6261c" stroke="#fff" stroke-width="1.5"/>
        <text x="${x}" y="${y + (sub ? -3 : 4.5)}" text-anchor="middle" font-size="13" font-weight="800" fill="#fff" font-family="Segoe UI,Arial">${esc(label)}</text>
        ${sub ? `<text x="${x}" y="${y + 12}" text-anchor="middle" font-size="11" font-weight="700" fill="#fff" font-family="Segoe UI,Arial">${esc(sub)}</text>` : ""}`;
      if (mark) s += `<circle cx="${x + w / 2 - 2}" cy="${y + h / 2 + 2}" r="12" fill="#111" stroke="#fff" stroke-width="1.2"/><text x="${x + w / 2 - 2}" y="${y + h / 2 + 6}" text-anchor="middle" font-size="10" font-weight="800" fill="#fff" font-family="Segoe UI,Arial">${esc(mark)}</text>`;
      return s + "</g>";
    };
    k.comps.forEach((c, i) => {
      const g = geo[c.id], draw = (P[c.pkg] || P.module)(c, g.w, g.h);
      const col = catColor(c.cat);
      parts += `<g class="ic part" data-id="${c.id}">
        <rect class="selbox" x="${g.cx - g.w / 2 - 9}" y="${g.cy - g.h / 2 - 9}" width="${g.w + 18}" height="${g.h + 18}" rx="10" stroke="${col}"/>
        <rect x="${g.cx - g.w / 2 - 4}" y="${g.cy - g.h / 2 - 4}" width="${g.w + 8}" height="${g.h + 8}" rx="4" fill="none" stroke="${pcb.silk}" stroke-opacity=".6" stroke-width="1.2"/>
        <g transform="translate(${g.cx} ${g.cy})">${draw}</g>
        <text class="silk" x="${g.cx - g.w / 2 - 2}" y="${g.cy + g.h / 2 + 16}" fill="${pcb.silk}">${refs[c.id]}</text>
        <title>${refs[c.id]} · ${esc(c.name)} — ${esc(c.pn)}</title></g>`;
      const side = i % 2 ? 1 : -1;
      const px = g.cx + side * (g.w / 2 + 6), py = g.cy - g.h / 2 - 30;
      callouts += pill(px, py, refs[c.id], null, c.id, g.cx + side * (g.w / 2 - 10), g.cy - g.h / 2 + 8);
    });
    // fuses (small SMD parts near what they protect)
    (k.fuses || []).forEach((f, i) => {
      const t = geo[f.near] || Object.values(geo)[0];
      const n = (k.fuses.filter(x => x.near === f.near).indexOf(f));
      const ang = -Math.PI * 0.85 + n * 0.62, rx = t.w / 2 + 22, ry = t.h / 2 + 18;
      const x = t.cx + Math.cos(ang) * rx, y = t.cy + Math.sin(ang) * ry;
      geo[f.id] = { cx: x, cy: y, w: 22, h: 12 };
      parts += `<g class="ic part fuse" data-id="${f.id}"><rect class="selbox" x="${x - 18}" y="${y - 13}" width="36" height="26" rx="6" stroke="#ff5a4f"/>
        <rect x="${x - 11}" y="${y - 6}" width="22" height="12" rx="1.5" fill="#f4f1ea" filter="url(#bd-sh)"/><rect x="${x - 13}" y="${y - 6}" width="5" height="12" fill="#d7dbe0"/><rect x="${x + 8}" y="${y - 6}" width="5" height="12" fill="#d7dbe0"/>
        <text x="${x}" y="${y + 3.5}" text-anchor="middle" font-size="7.5" font-weight="700" fill="#333" font-family="Consolas,monospace">${esc(f.marking || "")}</text>
        <title>${f.ref} · ${f.rating} — ${esc(f.use)}</title></g>`;
      const bx2 = x + Math.cos(ang) * 70, by2 = y + Math.sin(ang) * 46;
      callouts += pill(bx2, by2, f.ref, f.rating, f.id, x, y, f.marking);
    });
    out += `<g class="parts">${parts}</g><g class="callouts">${callouts}</g>`;
    out += legendSVG(k, refs, sx + SW + 40, sy, k.fuses && k.fuseBoard ? `Fuses & parts · ${k.fuseBoard}` : "Parts & function");
    return out;
  };
})();
