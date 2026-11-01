// Procedural component illustrations by package type (viewBox 300x200).
(function () {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function primaryPN(pn) {
    let s = String(pn).split(/\s+\/\s+|;/)[0];
    s = s.replace(/\(.*?\)/g, "").trim();
    return s;
  }
  function marking(pn, max) {
    const s = primaryPN(pn);
    const words = s.split(/\s+/);
    const lines = []; let cur = "";
    for (const w of words) {
      if ((cur + " " + w).trim().length > max && cur) { lines.push(cur); cur = w; } else cur = (cur + " " + w).trim();
    }
    if (cur) lines.push(cur);
    return lines.slice(0, 3);
  }
  function dateCode(id) { let h = 0; for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0; return String(85 + (h % 14)).slice(-2) + String(10 + (h % 40)).slice(-2); }
  const textLines = (lines, x, y, size, fill, lh, extra = "") =>
    lines.map((l, i) => `<text x="${x}" y="${y + i * lh}" font-size="${size}" fill="${fill}" text-anchor="middle" font-family="Consolas,monospace" ${extra}>${esc(l)}</text>`).join("");

  const defs = `<defs>
    <linearGradient id="g-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2d33"/><stop offset="1" stop-color="#121417"/></linearGradient>
    <linearGradient id="g-pin" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9aa3ad"/><stop offset=".5" stop-color="#e9eef3"/><stop offset="1" stop-color="#8c949d"/></linearGradient>
    <linearGradient id="g-metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e3e7eb"/><stop offset=".55" stop-color="#9ea6ae"/><stop offset="1" stop-color="#d0d5da"/></linearGradient>
    <linearGradient id="g-pcb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f6b3a"/><stop offset="1" stop-color="#11482a"/></linearGradient>
    <linearGradient id="g-plastic" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a6069"/><stop offset="1" stop-color="#30353c"/></linearGradient>
    <filter id="f-sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="5" stdDeviation="5" flood-opacity=".55"/></filter>
  </defs>`;

  function dipPins(cat, pn) {
    if (/373/.test(pn)) return 20;
    if (/F41[13]/.test(pn)) return 18;
    if (/68000/.test(pn)) return 64;
    if (/315-5124|315-5246/.test(pn)) return 42;
    return { cpu: 40, gpu: 40, mem: 24, security: 16, io: 16, audio: 24, video: 20, storage: 28 }[cat] || 28;
  }

  function dip(c) {
    const n = dipPins(c.cat, c.pn), half = n / 2;
    const w = Math.min(270, 40 + half * 9.5), x0 = 150 - w / 2, pitch = (w - 24) / (half - 1);
    let pins = "";
    for (let i = 0; i < half; i++) {
      const x = x0 + 12 + i * pitch - 3;
      pins += `<rect x="${x}" y="58" width="6" height="16" rx="1" fill="url(#g-pin)"/><rect x="${x}" y="126" width="6" height="16" rx="1" fill="url(#g-pin)"/>`;
    }
    return `${pins}<rect x="${x0}" y="70" width="${w}" height="60" rx="3" fill="url(#g-body)" filter="url(#f-sh)"/>
      <path d="M${x0} 92 a8 8 0 0 1 0 16" fill="#0a0b0d"/><circle cx="${x0 + 14}" cy="121" r="3" fill="#0a0b0d"/>
      ${textLines(marking(c.pn, 18), 150, 96, 13, "#d9dde2", 15, 'font-weight="bold"')}
      <text x="${x0 + w - 10}" y="123" font-size="9" fill="#9aa0a8" text-anchor="end" font-family="Consolas,monospace">${dateCode(c.id)}</text>
      <text x="150" y="172" font-size="10" fill="#9fc7ad" text-anchor="middle">DIP-${n}</text>`;
  }

  function qfp(c) {
    const s = 104, x0 = 150 - s / 2, y0 = 95 - s / 2, n = 18;
    let pins = "";
    for (let i = 0; i < n; i++) {
      const o = 8 + i * ((s - 16) / (n - 1)) - 1.2;
      pins += `<rect x="${x0 + o}" y="${y0 - 11}" width="2.6" height="12" fill="url(#g-pin)"/><rect x="${x0 + o}" y="${y0 + s - 1}" width="2.6" height="12" fill="url(#g-pin)"/>
               <rect x="${x0 - 11}" y="${y0 + o}" width="12" height="2.6" fill="url(#g-pin)"/><rect x="${x0 + s - 1}" y="${y0 + o}" width="12" height="2.6" fill="url(#g-pin)"/>`;
    }
    return `${pins}<rect x="${x0}" y="${y0}" width="${s}" height="${s}" rx="2" fill="url(#g-body)" filter="url(#f-sh)"/>
      <circle cx="${x0 + 12}" cy="${y0 + 12}" r="4" fill="#0a0b0d"/>
      ${textLines(marking(c.pn, 12), 150, 88, 12, "#d9dde2", 14, 'font-weight="bold"')}
      <text x="150" y="${y0 + s - 10}" font-size="9" fill="#9aa0a8" text-anchor="middle" font-family="Consolas,monospace">${dateCode(c.id)} JAPAN</text>
      <text x="150" y="190" font-size="10" fill="#9fc7ad" text-anchor="middle">QFP</text>`;
  }

  function bga(c) {
    const s = 128, x0 = 150 - s / 2, y0 = 92 - s / 2;
    let caps = "";
    for (let i = 0; i < 6; i++) caps += `<rect x="${x0 + 14 + i * 18}" y="${y0 + 6}" width="8" height="4" fill="#b98d4a"/><rect x="${x0 + 14 + i * 18}" y="${y0 + s - 10}" width="8" height="4" fill="#b98d4a"/>`;
    const big = c.cat === "cpu" || c.cat === "gpu";
    const die = big
      ? `<rect x="${x0 + 26}" y="${y0 + 22}" width="${s - 52}" height="${s - 44}" rx="3" fill="url(#g-metal)"/>`
      : `<rect x="${x0 + 14}" y="${y0 + 14}" width="${s - 28}" height="${s - 28}" rx="2" fill="url(#g-body)"/>`;
    const fill = big ? "#2a2f36" : "#d9dde2";
    return `<rect x="${x0}" y="${y0}" width="${s}" height="${s}" rx="4" fill="url(#g-pcb)" filter="url(#f-sh)"/>${caps}${die}
      <circle cx="${x0 + 9}" cy="${y0 + s - 9}" r="3" fill="#e8d9a0"/>
      ${textLines(marking(c.pn, 13), 150, 86, 11.5, fill, 13, 'font-weight="bold"')}
      <text x="150" y="190" font-size="10" fill="#9fc7ad" text-anchor="middle">BGA${big ? " · lidded" : ""}</text>`;
  }

  function sop(c) {
    const w = 170, x0 = 150 - w / 2; let pins = "";
    for (let i = 0; i < 14; i++) { const x = x0 + 10 + i * 11.2; pins += `<rect x="${x}" y="66" width="4" height="12" fill="url(#g-pin)"/><rect x="${x}" y="122" width="4" height="12" fill="url(#g-pin)"/>`; }
    return `${pins}<rect x="${x0}" y="74" width="${w}" height="52" rx="2" fill="url(#g-body)" filter="url(#f-sh)"/><circle cx="${x0 + 10}" cy="117" r="3" fill="#0a0b0d"/>
      ${textLines(marking(c.pn, 20), 150, 97, 11.5, "#d9dde2", 14, 'font-weight="bold"')}
      <text x="150" y="172" font-size="10" fill="#9fc7ad" text-anchor="middle">SOP / TSOP</text>`;
  }

  function to220(c) {
    return `<rect x="118" y="20" width="64" height="58" rx="3" fill="url(#g-metal)" filter="url(#f-sh)"/><circle cx="150" cy="40" r="9" fill="#14321f"/>
      <rect x="114" y="70" width="72" height="62" rx="3" fill="url(#g-body)"/>
      ${textLines(marking(c.pn, 9).slice(0, 2), 150, 98, 12, "#d9dde2", 14, 'font-weight="bold"')}
      ${[132, 150, 168].map(x => `<rect x="${x - 3}" y="132" width="6" height="50" fill="url(#g-pin)"/>`).join("")}
      <text x="196" y="160" font-size="10" fill="#9fc7ad">TO-220</text>`;
  }

  function crystal(c) {
    const f = (c.pn.match(/[\d.]+\s*MHz/) || ["XTAL"])[0];
    return `<rect x="95" y="62" width="110" height="56" rx="28" fill="url(#g-metal)" filter="url(#f-sh)"/>
      <rect x="101" y="68" width="98" height="44" rx="22" fill="none" stroke="#fff" stroke-opacity=".5"/>
      <text x="150" y="95" font-size="13" fill="#2b3036" text-anchor="middle" font-family="Consolas,monospace" font-weight="bold">${esc(f)}</text>
      <rect x="128" y="118" width="4" height="52" fill="url(#g-pin)"/><rect x="168" y="118" width="4" height="52" fill="url(#g-pin)"/>
      <text x="150" y="190" font-size="10" fill="#9fc7ad" text-anchor="middle">HC-49 crystal</text>`;
  }

  function edge(c) {
    let slots = "";
    for (let i = 0; i < 30; i++) slots += `<rect x="${42 + i * 7.3}" y="88" width="3.6" height="22" fill="#c9a34a"/>`;
    return `<rect x="30" y="66" width="240" height="66" rx="5" fill="#25282d" filter="url(#f-sh)"/><rect x="38" y="84" width="224" height="30" rx="3" fill="#0c0d0f"/>${slots}
      <rect x="20" y="78" width="14" height="42" rx="2" fill="#3a3e45"/><rect x="266" y="78" width="14" height="42" rx="2" fill="#3a3e45"/>
      <text x="150" y="152" font-size="11" fill="#d9dde2" text-anchor="middle">${esc(primaryPN(c.pn))}</text>
      <text x="150" y="172" font-size="10" fill="#9fc7ad" text-anchor="middle">Edge connector / slot</text>`;
  }

  function port(c) {
    return `<rect x="70" y="50" width="160" height="90" rx="10" fill="url(#g-metal)" filter="url(#f-sh)"/>
      <rect x="92" y="72" width="116" height="46" rx="14" fill="#14171b"/><rect x="108" y="88" width="84" height="14" rx="3" fill="#2d333b"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="${112 + i * 10}" y="91" width="5" height="8" fill="#d9b45a"/>`).join("")}
      <text x="150" y="166" font-size="11" fill="#d9dde2" text-anchor="middle">${esc(primaryPN(c.pn).slice(0, 38))}</text>
      <text x="150" y="186" font-size="10" fill="#9fc7ad" text-anchor="middle">Port / jack</text>`;
  }

  function drive(c) {
    return `<rect x="40" y="26" width="220" height="140" rx="6" fill="url(#g-plastic)" filter="url(#f-sh)"/>
      <circle cx="132" cy="96" r="56" fill="#cfd6de" opacity=".9"/><circle cx="132" cy="96" r="56" fill="url(#g-metal)" opacity=".5"/><circle cx="132" cy="96" r="14" fill="#2d333b"/>
      <rect x="196" y="40" width="6" height="112" fill="#9aa3ad"/><rect x="232" y="40" width="6" height="112" fill="#9aa3ad"/>
      <rect x="190" y="78" width="54" height="36" rx="4" fill="#20252b"/><circle cx="217" cy="96" r="8" fill="#3f6bd9"/><circle cx="215" cy="94" r="3" fill="#b9d0ff"/>
      <text x="150" y="186" font-size="10" fill="#9fc7ad" text-anchor="middle">Optical drive + laser sled</text>`;
  }

  function hdd(c) {
    return `<rect x="60" y="22" width="180" height="150" rx="8" fill="url(#g-metal)" filter="url(#f-sh)"/>
      <circle cx="140" cy="88" r="52" fill="#b9c1c9" stroke="#8d959e"/><circle cx="140" cy="88" r="10" fill="#7d858d"/>
      <path d="M212 150 L156 96" stroke="#59616a" stroke-width="7" stroke-linecap="round"/><circle cx="212" cy="150" r="10" fill="#59616a"/>
      <text x="150" y="190" font-size="10" fill="#9fc7ad" text-anchor="middle">Hard drive</text>`;
  }

  function ssd(c) {
    return `<rect x="30" y="70" width="240" height="56" rx="3" fill="url(#g-pcb)" filter="url(#f-sh)"/>
      <rect x="30" y="78" width="12" height="40" fill="#c9a34a"/><rect x="34" y="94" width="8" height="6" fill="#11482a"/>
      <rect x="60" y="80" width="54" height="36" rx="2" fill="url(#g-body)"/><rect x="124" y="80" width="54" height="36" rx="2" fill="url(#g-body)"/><rect x="188" y="84" width="40" height="28" rx="2" fill="url(#g-body)"/>
      <path d="M262 92 a6 6 0 0 1 0 12" fill="#0f1d16"/>
      <text x="150" y="152" font-size="11" fill="#d9dde2" text-anchor="middle">${esc(primaryPN(c.pn).slice(0, 40))}</text>
      <text x="150" y="172" font-size="10" fill="#9fc7ad" text-anchor="middle">M.2 NVMe module</text>`;
  }

  function psu(c) {
    return `<rect x="66" y="40" width="168" height="104" rx="12" fill="#22262b" filter="url(#f-sh)"/>
      <rect x="86" y="58" width="128" height="50" rx="4" fill="#33383f"/>
      ${textLines(marking(c.pn, 20).slice(0, 2), 150, 80, 11, "#d9dde2", 14)}
      <path d="M234 92 C 262 92 262 150 286 150" stroke="#16191c" stroke-width="7" fill="none"/>
      <text x="150" y="172" font-size="10" fill="#9fc7ad" text-anchor="middle">Power supply</text>`;
  }

  function fan(c) {
    let blades = "";
    for (let i = 0; i < 7; i++) blades += `<path d="M150 92 q 30 -26 42 -4 q -18 6 -42 4z" fill="#3b4148" transform="rotate(${i * 51.4} 150 92)"/>`;
    return `<rect x="84" y="26" width="132" height="132" rx="12" fill="#1c1f23" filter="url(#f-sh)"/><circle cx="150" cy="92" r="58" fill="#0c0d0f"/>${blades}<circle cx="150" cy="92" r="18" fill="#2a2e34"/>
      <text x="150" y="186" font-size="10" fill="#9fc7ad" text-anchor="middle">Fan</text>`;
  }

  function battery(c) {
    const coin = /20\d\d|clock capacitor|supercap/i.test(c.pn + c.name);
    if (coin) return `<circle cx="150" cy="92" r="60" fill="url(#g-metal)" filter="url(#f-sh)"/><circle cx="150" cy="92" r="50" fill="none" stroke="#fff" stroke-opacity=".5"/>
      ${textLines(marking(c.pn, 12).slice(0, 2), 150, 88, 13, "#2b3036", 16, 'font-weight="bold"')}<text x="150" y="68" font-size="20" fill="#2b3036" text-anchor="middle">+</text>
      <text x="150" y="186" font-size="10" fill="#9fc7ad" text-anchor="middle">Cell / capacitor</text>`;
    return `<rect x="56" y="50" width="188" height="88" rx="10" fill="#2a3138" filter="url(#f-sh)"/><rect x="64" y="58" width="172" height="72" rx="6" fill="#d8dde2"/>
      ${textLines(marking(c.pn, 18).slice(0, 2), 150, 92, 13, "#2b3036", 16, 'font-weight="bold"')}<rect x="244" y="82" width="14" height="24" rx="2" fill="#d9b45a"/>
      <text x="150" y="172" font-size="10" fill="#9fc7ad" text-anchor="middle">Li-ion battery pack</text>`;
  }

  function module_(c) {
    return `<rect x="46" y="42" width="208" height="112" rx="6" fill="url(#g-pcb)" filter="url(#f-sh)"/>
      <rect x="70" y="58" width="108" height="80" rx="3" fill="url(#g-metal)"/><rect x="194" y="66" width="44" height="30" rx="2" fill="url(#g-body)"/>
      ${[0, 1, 2, 3, 4, 5].map(i => `<circle cx="${198 + i * 7}" cy="132" r="2.6" fill="#e8d9a0"/>`).join("")}
      ${textLines(marking(c.pn, 14).slice(0, 2), 124, 95, 10.5, "#2b3036", 13, 'font-weight="bold"')}
      <text x="150" y="182" font-size="10" fill="#9fc7ad" text-anchor="middle">Board / module</text>`;
  }

  function controller(c) {
    return `<path d="M80 74 Q 150 58 220 74 Q 262 82 266 132 Q 268 160 244 160 Q 226 160 208 132 L 92 132 Q 74 160 56 160 Q 32 160 34 132 Q 38 82 80 74z" fill="url(#g-plastic)" filter="url(#f-sh)"/>
      <rect x="74" y="92" width="12" height="34" rx="2" fill="#15181c"/><rect x="63" y="103" width="34" height="12" rx="2" fill="#15181c"/>
      <circle cx="214" cy="98" r="8" fill="#15181c"/><circle cx="232" cy="114" r="8" fill="#15181c"/><circle cx="196" cy="114" r="8" fill="#15181c"/><circle cx="214" cy="130" r="8" fill="#15181c"/>
      <text x="150" y="190" font-size="10" fill="#9fc7ad" text-anchor="middle">Controller / accessory (generic illustration)</text>`;
  }

  function display(c) {
    return `<rect x="34" y="36" width="232" height="128" rx="10" fill="#15181c" filter="url(#f-sh)"/><rect x="46" y="46" width="208" height="108" rx="3" fill="#1d3550"/>
      <path d="M46 154 L 150 46 L 254 46 L 254 80 L 120 154z" fill="#fff" opacity=".06"/>
      <text x="150" y="105" font-size="11" fill="#cfe3ff" text-anchor="middle">${esc(primaryPN(c.pn).slice(0, 34))}</text>
      <text x="150" y="186" font-size="10" fill="#9fc7ad" text-anchor="middle">Display panel</text>`;
  }

  function card(c) {
    return `<path d="M90 30 L 196 30 L 214 48 L 214 160 L 90 160z" fill="url(#g-plastic)" filter="url(#f-sh)"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="${100 + i * 13}" y="40" width="7" height="22" rx="1" fill="#d9b45a"/>`).join("")}
      ${textLines(marking(c.pn, 13).slice(0, 2), 152, 110, 10.5, "#e4e8ec", 13)}
      <text x="150" y="186" font-size="10" fill="#9fc7ad" text-anchor="middle">Card / slot</text>`;
  }

  const map = { dip, qfp, bga, sop, to220, crystal, edge, port, drive, hdd, ssd, psu, fan, battery, module: module_, controller, display, card };

  window.renderPackage = function (c) {
    const f = map[c.pkg] || module_;
    return `<svg viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">${defs}${f(c)}</svg>`;
  };
  window.primaryPN = primaryPN;
})();
