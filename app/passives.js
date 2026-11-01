// Resistors & capacitors for the inside view. Deterministic per console; values are
// representative for the circuit each part sits next to (no per-board BOM available).
(function () {
  const COLORS = ["black", "brown", "red", "orange", "yellow", "green", "blue", "violet", "grey", "white"];
  const HEX = { black: "#1a1a1a", brown: "#7a4a1e", red: "#c0392b", orange: "#e67e22", yellow: "#f1c40f", green: "#27ae60", blue: "#2e6fd8", violet: "#8e44ad", grey: "#8a8f96", white: "#f4f4f4", gold: "#d4af37" };
  function rng(seed) { let h = 2166136261; for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 100000) / 100000; }; }

  function sig(ohms) { let e = 0, v = ohms; while (v >= 100) { v /= 10; e++; } while (v < 10) { v *= 10; e--; } return [Math.round(v), e]; }
  function bands(ohms) { const [v, e] = sig(ohms); return [COLORS[Math.floor(v / 10)], COLORS[v % 10], e >= 0 ? COLORS[e] : "gold", "gold"]; }
  function eia(ohms) { const [v, e] = sig(ohms); return e >= 0 ? `${v}${e}` : `${Math.floor(v / 10)}R${v % 10}`; }
  const fmtR = o => o >= 1e6 ? `${+(o / 1e6).toFixed(2)} MΩ` : o >= 1000 ? `${+(o / 1000).toFixed(2)} kΩ` : `${o} Ω`;
  const qR = o => o >= 1e6 ? `${+(o / 1e6).toFixed(2)}M ohm` : o >= 1000 ? `${+(o / 1000).toFixed(2)}k ohm` : `${o} ohm`;
  // capacitance in pF
  const fmtC = p => p >= 1e6 ? `${+(p / 1e6).toFixed(1)} µF`.replace(".0 ", " ") : p >= 1000 ? `${+(p / 1000).toFixed(1)} nF`.replace(".0 ", " ") : `${p} pF`;
  const qC = p => p >= 1e6 ? `${+(p / 1e6)}uF` : p >= 1000 ? `${+(p / 1000)}nF` : `${p}pF`;
  const capCode = p => { if (p < 100) return String(p); const [v, e] = sig(p); return `${v}${e}`; };

  // role tables by the category of the nearest real part
  const ROLE = {
    power: {
      res: [[4700, "Voltage-divider feedback resistor that sets the regulator's output voltage"], [10000, "Feedback / bias resistor for the regulator circuit"], [1000, "Current-limit resistor for the power LED"]],
      mlcc: [[100000, "Decoupling capacitor that filters high-frequency noise off the power rail"], [10000000, "Output ripple filter on the regulator"]],
      elec: [[470, 16, "Bulk filter capacitor that smooths the supply rail"], [1000, 16, "Main input reservoir capacitor after the power input"], [220, 10, "Output filter on the regulated rail"]]
    },
    cpu: {
      res: [[33, "Series termination resistor on the address/data bus (reduces ringing)"], [10000, "Pull-up resistor on a reset / control line"], [22, "Series termination resistor on a high-speed signal"]],
      mlcc: [[100000, "Decoupling capacitor right at the chip's power pins"], [10000, "High-frequency decoupling at the chip's power pins"]],
      elec: [[100, 10, "Bulk decoupling for the processor's supply"], [47, 16, "Local supply filter for the processor"]]
    },
    audio: {
      res: [[10000, "Audio mixing / gain-setting resistor"], [1000, "Audio output series resistor"], [47000, "Audio bias resistor"]],
      mlcc: [[1000, "Audio low-pass filter capacitor (removes hiss)"], [100000, "Decoupling for the audio chip"]],
      elec: [[10, 50, "DC-blocking (coupling) capacitor on the audio output"], [47, 16, "Audio supply filter"]]
    },
    video: {
      res: [[75, "75 Ω termination on the video output line"], [470, "Video output bias resistor"], [220, "RGB/composite series resistor"]],
      mlcc: [[100000, "Decoupling for the video encoder"], [330, "Video filter capacitor"]],
      elec: [[220, 10, "Video output coupling capacitor"], [47, 16, "Video encoder supply filter"]]
    },
    clock: {
      res: [[1000000, "Oscillator feedback resistor that helps the crystal start"]],
      mlcc: [[22, "Crystal load capacitor (sets the oscillator frequency precisely)"], [33, "Crystal load capacitor"]],
      elec: [[10, 25, "Oscillator supply filter"]]
    },
    io: {
      res: [[10000, "Pull-up resistor that holds an input line high when idle"], [4700, "Pull-up resistor on a data/clock line"], [100, "Series protection resistor on a port pin"]],
      mlcc: [[100000, "Decoupling capacitor next to the interface chip"], [1000, "Noise filter on a port line"]],
      elec: [[47, 16, "Local supply filter for the ports"]]
    }
  };
  const roleFor = cat => ROLE[{ gpu: "cpu", mem: "cpu", storage: "io", security: "io", media: "io" }[cat] || cat] || ROLE.io;

  const cache = {};
  window.getPassives = function (k, geo, bounds) {
    if (cache[k.id]) return cache[k.id];
    if (!geo) { if (!window.boardGeo) return []; const L = window.boardGeo(k); geo = L.geo; bounds = { x: L.bx, y: L.by, w: L.BW, h: L.BH }; }
    const R = rng(k.id + ":passives"), out = [];
    const retroTH = k.year < 1994, modern = k.year >= 2005;
    const parts = Object.entries(geo).map(([id, g]) => ({ id, g, c: k.comps.find(x => x.id === id) })).filter(p => p.c);
    const blocked = (x, y, m) => parts.some(({ g }) => Math.abs(x - g.cx) < g.w / 2 + m && Math.abs(y - g.cy) < g.h / 2 + m) || out.some(p => Math.hypot(p.x - x, p.y - y) < m + p.r);
    const nearest = (x, y) => parts.reduce((b, p) => { const d = Math.hypot(Math.max(0, Math.abs(x - p.g.cx) - p.g.w / 2), Math.max(0, Math.abs(y - p.g.cy) - p.g.h / 2)); return !b || d < b.d ? { d, p } : b; }, null).p;
    const n = { R: 0, C: 0 };
    function place(kind, count, r) {
      for (let i = 0, placed = 0; i < count * 60 && placed < count; i++) {
        // cluster near parts like real boards: pick a part and a point around it
        const p = parts[Math.floor(R() * parts.length)], ang = R() * Math.PI * 2;
        const x = p.g.cx + Math.cos(ang) * (p.g.w / 2 + 14 + R() * 34), y = p.g.cy + Math.sin(ang) * (p.g.h / 2 + 12 + R() * 28);
        if (x < bounds.x + 26 || x > bounds.x + bounds.w - 26 || y < bounds.y + 26 || y > bounds.y + bounds.h - 26) continue;
        if (blocked(x, y, r + 3)) continue;
        const near = nearest(x, y), roles = roleFor(near.c.cat);
        const rot = R() > 0.5 ? 90 : 0;
        let item;
        if (kind === "res") {
          const [ohms, use] = roles.res[Math.floor(R() * roles.res.length)];
          const ref = "R" + (++n.R);
          const pkg = retroTH ? "res_th" : "res_smd", size = modern ? "0402" : "0603";
          const desc = retroTH ? `${fmtR(ohms)} ±5% · ¼ W carbon film, axial · bands ${bands(ohms).join("-")}` : `${fmtR(ohms)} ±1% · ${size} thick-film chip${modern ? " (unmarked at this size)" : ` · marked ${eia(ohms)}`}`;
          item = { kind, pkg, ref, value: fmtR(ohms), ohms, bands: retroTH ? bands(ohms) : null, code: retroTH ? null : eia(ohms), size, name: `Resistor ${ref} (${fmtR(ohms)})`, pn: desc, use,
            q: retroTH ? `${qR(ohms)} 1/4W carbon film resistor` : `${qR(ohms)} ${size} resistor 1%`, cat: "resistor" };
        } else if (kind === "mlcc") {
          const [pf, use] = roles.mlcc[Math.floor(R() * roles.mlcc.length)];
          const ref = "C" + (++n.C), v = pf >= 1e6 ? 16 : 50, diel = pf < 1000 ? "C0G" : "X7R";
          const pkg = retroTH ? "cap_disc" : "cap_mlcc", size = modern ? "0402" : "0603";
          item = { kind, pkg, ref, value: fmtC(pf), pf, volts: v, code: capCode(pf), size, name: `Capacitor ${ref} (${fmtC(pf)})`, use,
            pn: retroTH ? `${fmtC(pf)} ${v} V · ceramic disc, marked ${capCode(pf)}, 5 mm lead pitch` : `${fmtC(pf)} ${v} V ${diel} · ${size} MLCC (ceramic chip, unmarked)`,
            q: retroTH ? `${qC(pf)} ${v}V ceramic disc capacitor` : `${qC(pf)} ${v}V ${diel} ${size} capacitor`, cat: "capacitor" };
        } else {
          let [uf, v, use] = roles.elec[Math.floor(R() * roles.elec.length)];
          const ref = "C" + (++n.C);
          const poly = modern;
          if (poly) { uf = [330, 470, 220][Math.floor(R() * 3)]; v = [2.5, 6.3, 6.3][Math.floor(R() * 3)]; use = `Low-ESR bulk capacitor on the supply rail next to the ${near.c.name}`; }
          const dia = uf >= 1000 ? 10 : uf >= 220 ? 8 : uf >= 47 ? 6.3 : 5;
          item = { kind: poly ? "poly" : "elec", pkg: poly ? "cap_poly" : "cap_elec", ref, value: `${uf} µF ${v} V`, uf, volts: v, dia, name: `Capacitor ${ref} (${uf} µF ${v} V)`, use, r,
            pn: poly ? `${uf} µF ${v} V · solid aluminum polymer, ${dia}×6 mm` : `${uf} µF ${v} V · radial aluminum electrolytic, 105 °C, ${dia} mm dia.`,
            q: poly ? `${uf}uF ${v}V solid polymer capacitor` : `${uf}uF ${v}V radial electrolytic capacitor 105C`, cat: "capacitor" };
        }
        out.push({ ...item, id: item.ref.toLowerCase(), x, y, rot, r: item.r || r, near: near.c.id, passive: true, rep: true, src: "std", verify: false,
          notes: notesFor(item.kind, k, near.c) });
        placed++;
      }
    }
    place("elec", retroTH ? 16 : modern ? 12 : 14, 14);
    place("res", modern ? 26 : 30, 9);
    place("mlcc", modern ? 30 : 24, 8);
    cache[k.id] = out;
    return out;
  };

  function notesFor(kind, k, near) {
    if (kind === "res") return "Measure with a multimeter, ideally with one leg lifted — in-circuit readings can be lower because of parallel paths. A burnt or discolored resistor usually means something downstream shorted; find that first.";
    if (kind === "mlcc") return "Shorted ceramic capacitors are a top cause of 'no power' on newer boards: measure the rail's resistance to ground, then find the warm one with isopropyl alcohol or a thermal camera while feeding a little current.";
    if (kind === "poly") return "Polymer capacitors rarely wear out. If the rail is shorted, check these and the ceramics around them.";
    return k.year < 2005 ? `Electrolytic capacitors in a ${k.year} console are past their design life. Look for bulging tops, leaked residue or a fishy smell; check ESR with an ESR meter. Recapping the whole board with a kit is common.`
      : "Check for bulging or leakage and measure ESR. Replace with the same capacitance and an equal or higher voltage rating, 105 °C, low-ESR.";
  }
  window.passiveColors = HEX;
})();
