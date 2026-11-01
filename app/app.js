/* Console Repair Atlas — UI */
(() => {
  "use strict";
  const DATA = window.ATLAS_DATA;
  const $ = s => document.querySelector(s);
  const SVGNS = "http://www.w3.org/2000/svg";
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const bridge = window.atlas || null; // provided by Electron preload

  const CAT = {
    cpu: ["CPU / processor", "--cpu"], gpu: ["Graphics", "--gpu"], mem: ["Memory", "--mem"], audio: ["Audio", "--audio"],
    video: ["Video output", "--video"], power: ["Power / cooling", "--power"], storage: ["Storage / firmware", "--storage"],
    io: ["I/O / interface", "--io"], security: ["Security / lockout", "--security"], clock: ["Clock", "--clock"], media: ["Media / drive", "--media"]
  };
  const css = getComputedStyle(document.documentElement);
  const catColor = k => css.getPropertyValue((CAT[k] || CAT.io)[1]).trim();

  const state = { console: null, sel: null, view: "block", maker: "All", vb: null };

  // ------------------------------------------------------------- links
  const enc = encodeURIComponent;
  const VENDORS = {
    ebay: ["eBay", "new & pulled parts", q => `https://www.ebay.com/sch/i.html?_nkw=${enc(q)}`],
    ali: ["AliExpress", "low-cost / new-old-stock", q => `https://www.aliexpress.com/wholesale?SearchText=${enc(q)}`],
    amazon: ["Amazon", "general retail", q => `https://www.amazon.com/s?k=${enc(q)}`],
    mouser: ["Mouser", "new authorized stock", q => `https://www.mouser.com/c/?q=${enc(q)}`],
    digikey: ["Digi-Key", "new authorized stock", q => `https://www.digikey.com/en/products/result?keywords=${enc(q)}`],
    ifixit: ["iFixit", "parts, tools & guides", q => `https://www.ifixit.com/Search?query=${enc(q)}`],
    console5: ["Console5", "retro console parts", q => `https://www.google.com/search?q=${enc("site:console5.com " + q)}`],
    sag: ["Stone Age Gamer", "retro connectors & parts", q => `https://www.google.com/search?q=${enc("site:stoneagegamer.com " + q)}`],
    hhl: ["Hand Held Legend", "handheld & Switch parts", q => `https://www.google.com/search?q=${enc("site:handheldlegend.com " + q)}`]
  };
  function vendorsFor(c, k) {
    const retro = k.year < 2005, nintendoHandheld = /switch/.test(k.id);
    if (c.src === "std") return ["mouser", "digikey", "ebay", "ali", "amazon", retro ? "console5" : "ifixit"];
    if (c.src === "mech") return retro ? ["console5", "sag", "ebay", "amazon", "ali"]
      : ["ifixit", nintendoHandheld ? "hhl" : "amazon", "ebay", "ali", nintendoHandheld ? "amazon" : null].filter(Boolean);
    return ["ebay", "ali", retro ? "console5" : "ifixit", "amazon"];
  }
  const buyHint = c => ({
    std: "Standard part — buy new from an authorized distributor. Equivalent parts from other makers usually work.",
    mech: "Replacement assemblies are sold new (often aftermarket) and used. Match model numbers and revision.",
    custom: "Console-specific chip — not sold new. Sources are pulled chips from donor boards, used parts or a donor console."
  })[c.src];

  function queryFor(c, k) { return c.q || `${k.short} ${primaryPN(c.pn)}`; }

  function openExternal(url) {
    if (bridge) bridge.openExternal(url); else window.open(url, "_blank", "noopener");
  }

  // ------------------------------------------------------------- sidebar
  function renderMakers() {
    const makers = ["All", ...new Set(DATA.map(k => k.maker.split(" /")[0]))];
    $("#makerFilter").innerHTML = makers.map(m => `<button class="${m === state.maker ? "on" : ""}" data-m="${esc(m)}">${esc(m)}</button>`).join("");
    $("#makerFilter").onclick = e => { const m = e.target.dataset.m; if (!m) return; state.maker = m; renderMakers(); renderList(); };
  }
  function renderList() {
    const list = DATA.filter(k => state.maker === "All" || k.maker.startsWith(state.maker));
    let html = "", era = null;
    for (const k of list) {
      const e = k.year < 1990 ? "1980s" : k.year < 2000 ? "1990s" : k.year < 2010 ? "2000s" : k.year < 2020 ? "2010s" : "2020s";
      if (e !== era) { html += `<div class="era">${e}</div>`; era = e; }
      html += `<div class="c-item ${state.console === k ? "active" : ""}" data-id="${k.id}"><span class="yr">${k.year}</span><div><div class="nm">${esc(k.name.replace(/^(Nintendo|Sony|Sega|Microsoft|Valve) /, ""))}</div><div class="mk">${esc(k.maker)} · ${k.comps.length} parts</div></div></div>`;
    }
    $("#consoleList").innerHTML = html;
  }
  $("#consoleList").addEventListener("click", e => { const it = e.target.closest(".c-item"); if (it) selectConsole(it.dataset.id); });

  // ------------------------------------------------------------- console
  function selectConsole(id, compId = null) {
    const k = DATA.find(x => x.id === id); if (!k) return;
    state.console = k; state.sel = null;
    $("#cMeta").textContent = `${k.maker} · ${k.year}`;
    $("#cName").textContent = k.name;
    $("#cBoard").textContent = "Board / revision covered: " + k.board;
    $("#cSummary").textContent = k.summary;
    try { localStorage.setItem("atlas:last", id); } catch (_) { }
    renderList(); renderView(true);
    if (compId) selectComp(compId); else showDetail(null);
    const active = $(".c-item.active"); if (active) active.scrollIntoView({ block: "nearest" });
  }

  function renderView(fit) {
    const k = state.console;
    const isParts = state.view === "parts";
    $("#diagram").style.display = isParts ? "none" : "block";
    $("#partsTable").hidden = !isParts;
    $("#zoomCtl").style.visibility = isParts ? "hidden" : "visible";
    $("#hint").hidden = isParts;
    $("#canvasWrap").classList.toggle("paper", state.view === "schematic");
    $("#legend").hidden = isParts;
    if (state.view === "block") renderBlock(k);
    else if (state.view === "schematic") renderSchematic(k);
    else renderParts(k);
    renderLegend(k);
    if (!isParts && fit) fitView();
    else if (!isParts && state.vb) applyVB();
    highlight();
  }

  function renderLegend(k) {
    const cats = [...new Set(k.comps.map(c => c.cat))];
    $("#legend").innerHTML = cats.map(c => `<span><i style="background:${catColor(c)}"></i>${CAT[c][0]}</span>`).join("");
  }

  // ------------------------------------------------------------- block diagram
  const B = { CW: 222, CH: 128, BW: 178, BH: 76, M: 40 };
  function boxRect(c) { return { x: B.M + c.x * B.CW, y: B.M + c.y * B.CH, w: B.BW, h: B.BH }; }

  function anchors(ra, rb) {
    const ca = { x: ra.x + ra.w / 2, y: ra.y + ra.h / 2 }, cb = { x: rb.x + rb.w / 2, y: rb.y + rb.h / 2 };
    const dx = cb.x - ca.x, dy = cb.y - ca.y;
    // detour around boxes that sit between two parts in the same row / column
    if (dy === 0 && Math.abs(dx) > B.CW * 1.5) {
      const p0 = { x: ca.x + Math.sign(dx) * 30, y: ra.y }, p3 = { x: cb.x - Math.sign(dx) * 30, y: rb.y }, lift = 34;
      return { d: `M${p0.x},${p0.y} C${p0.x},${p0.y - lift} ${p3.x},${p3.y - lift} ${p3.x},${p3.y}`, mid: { x: (p0.x + p3.x) / 2, y: p0.y - lift * 0.75 } };
    }
    if (dx === 0 && Math.abs(dy) > B.CH * 1.5) {
      const p0 = { x: ra.x + ra.w, y: ca.y + Math.sign(dy) * 18 }, p3 = { x: rb.x + rb.w, y: cb.y - Math.sign(dy) * 18 }, out = 30;
      return { d: `M${p0.x},${p0.y} C${p0.x + out},${p0.y} ${p3.x + out},${p3.y} ${p3.x},${p3.y}`, mid: { x: p0.x + out * 0.75, y: (p0.y + p3.y) / 2 } };
    }
    const horiz = Math.abs(dx) * ra.h > Math.abs(dy) * ra.w;
    let p0, p3, t0, t3;
    if (horiz) {
      const s = Math.sign(dx);
      p0 = { x: ca.x + s * ra.w / 2, y: ca.y }; p3 = { x: cb.x - s * rb.w / 2, y: cb.y };
      t0 = { x: s, y: 0 }; t3 = { x: -s, y: 0 };
    } else {
      const s = Math.sign(dy) || 1;
      p0 = { x: ca.x, y: ca.y + s * ra.h / 2 }; p3 = { x: cb.x, y: cb.y - s * rb.h / 2 };
      t0 = { x: 0, y: s }; t3 = { x: 0, y: -s };
    }
    const d = Math.max(30, Math.hypot(p3.x - p0.x, p3.y - p0.y) * 0.42);
    const p1 = { x: p0.x + t0.x * d, y: p0.y + t0.y * d }, p2 = { x: p3.x + t3.x * d, y: p3.y + t3.y * d };
    const mid = { x: (p0.x + 3 * p1.x + 3 * p2.x + p3.x) / 8, y: (p0.y + 3 * p1.y + 3 * p2.y + p3.y) / 8 };
    return { d: `M${p0.x},${p0.y} C${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`, mid };
  }

  function trunc(s, n) { s = String(s); return s.length > n ? s.slice(0, n - 1) + "…" : s; }

  function renderBlock(k) {
    const svg = $("#diagram"); svg.setAttribute("class", "");
    const byId = Object.fromEntries(k.comps.map(c => [c.id, c]));
    let edges = "", labels = "", nodes = "";
    k.links.forEach((l, i) => {
      const a = anchors(boxRect(byId[l.a]), boxRect(byId[l.b]));
      const w = Math.min(150, l.label.length * 6.3 + 10);
      edges += `<g class="edge" data-a="${l.a}" data-b="${l.b}"><path d="${a.d}"/></g>`;
      labels += `<g class="edge" data-a="${l.a}" data-b="${l.b}"><rect x="${a.mid.x - w / 2}" y="${a.mid.y - 8}" width="${w}" height="15" rx="4"/><text x="${a.mid.x}" y="${a.mid.y + 3.5}" text-anchor="middle">${esc(trunc(l.label, 23))}</text></g>`;
    });
    for (const c of k.comps) {
      const r = boxRect(c), col = catColor(c.cat);
      nodes += `<g class="node" data-id="${c.id}" tabindex="0">
        <rect class="body" x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="9" stroke="${col}"/>
        <rect x="${r.x}" y="${r.y}" width="5" height="${r.h}" rx="2" fill="${col}"/>
        <text class="cat" x="${r.x + 14}" y="${r.y + 17}" fill="${col}">${esc(CAT[c.cat][0].toUpperCase())}${c.verify ? " ·  ⚠" : ""}</text>
        <text class="nt" x="${r.x + 14}" y="${r.y + 37}">${esc(trunc(c.name, 22))}</text>
        <text class="np" x="${r.x + 14}" y="${r.y + 56}">${esc(trunc(primaryPN(c.pn), 27))}</text>
        <title>${esc(c.name)} — ${esc(c.pn)}</title></g>`;
    }
    svg.innerHTML = `<g id="content">${edges}${nodes}${labels}</g>`;
  }

  // ------------------------------------------------------------- schematic
  function refPrefix(c) {
    if (c.pkg === "crystal") return "Y";
    if (c.pkg === "battery") return "BT";
    if (c.pkg === "fan") return "M";
    if (c.pkg === "psu") return "PS";
    if (["edge", "port", "card", "controller"].includes(c.pkg)) return "J";
    if (["drive", "hdd", "ssd", "display", "module"].includes(c.pkg)) return "A";
    return "U";
  }
  function refDes(k) {
    const n = {}, out = {};
    [...k.comps].sort((a, b) => a.y - b.y || a.x - b.x).forEach(c => { const p = refPrefix(c); n[p] = (n[p] || 0) + 1; out[c.id] = p + n[p]; });
    return out;
  }
  function busWidth(label) {
    let m = label.match(/(\d+)-bit/); if (m) return m[1];
    m = label.match(/[A-Z]+(\d+)\s*[-–]\s*[A-Z]*(\d+)/); if (m) return String(+m[2] - +m[1] + 1);
    return null;
  }

  function renderSchematic(k) {
    const svg = $("#diagram"); svg.setAttribute("class", "sch");
    const byId = Object.fromEntries(k.comps.map(c => [c.id, c]));
    const refs = refDes(k);
    // assign pins
    const pins = {}; k.comps.forEach(c => pins[c.id] = { L: [], R: [] });
    k.links.forEach((l, i) => {
      const a = byId[l.a], b = byId[l.b];
      let sa, sb;
      if (b.x > a.x) { sa = "R"; sb = "L"; } else if (b.x < a.x) { sa = "L"; sb = "R"; } else { sa = "R"; sb = "R"; }
      pins[a.id][sa].push({ i, other: b, label: l.label }); pins[b.id][sb].push({ i, other: a, label: l.label });
    });
    const PITCH = 22, BW = 158, CW = 290;
    const hOf = c => Math.max(78, 46 + Math.max(pins[c.id].L.length, pins[c.id].R.length) * PITCH);
    const rows = Math.max(...k.comps.map(c => c.y)) + 1, rowH = [];
    for (let r = 0; r < rows; r++) rowH[r] = Math.max(110, ...k.comps.filter(c => c.y === r).map(hOf)) + 70;
    const rowY = [60]; for (let r = 1; r < rows; r++) rowY[r] = rowY[r - 1] + rowH[r - 1];
    const geo = {};
    for (const c of k.comps) {
      const h = hOf(c), x = 70 + c.x * CW, y = rowY[c.y] + (rowH[c.y] - 70 - h) / 2;
      geo[c.id] = { x, y, w: BW, h };
      for (const side of ["L", "R"]) {
        const list = pins[c.id][side].sort((p, q) => p.other.y - q.other.y || p.other.x - q.other.x);
        const start = y + h / 2 - (list.length - 1) * PITCH / 2 + 8;
        list.forEach((p, j) => { p.x = side === "L" ? x : x + BW; p.y = start + j * PITCH; p.sx = side === "L" ? x - 20 : x + BW + 20; p.side = side; });
      }
    }
    const pinOf = (cid, i) => [...pins[cid].L, ...pins[cid].R].find(p => p.i === i);
    let wires = "", ics = "", nets = "", lane = {};
    k.links.forEach((l, i) => {
      const pa = pinOf(l.a, i), pb = pinOf(l.b, i);
      let d, lx, ly;
      if (pa.side !== pb.side) {
        const left = pa.sx < pb.sx ? pa : pb, right = pa.sx < pb.sx ? pb : pa;
        const key = Math.round((left.sx + right.sx) / 2 / 10);
        const n = lane[key] = (lane[key] || 0) + 1;
        const xm = (left.sx + right.sx) / 2 + ((n % 2 ? 1 : -1) * Math.ceil((n - 1) / 2)) * 9;
        d = `M${left.sx},${left.y} H${xm} V${right.y} H${right.sx}`;
        lx = left.sx + 4; ly = left.y - 4;
      } else {
        const key = "s" + Math.round(Math.max(pa.sx, pb.sx));
        const n = lane[key] = (lane[key] || 0) + 1;
        const xo = Math.max(pa.sx, pb.sx) + 14 + n * 9;
        d = `M${pa.sx},${pa.y} H${xo} V${pb.y} H${pb.sx}`;
        lx = pa.sx + 4; ly = pa.y - 4;
      }
      const bw = busWidth(l.label);
      const slash = bw ? `<path class="wire" d="M${lx + 2},${ly + 9} l8,-9"/><text class="net" x="${lx + 4}" y="${ly + 18}">${bw}</text>` : "";
      wires += `<g class="wg" data-a="${l.a}" data-b="${l.b}"><path class="wire" d="${d}"/>${slash}<circle class="dot" cx="${pa.sx}" cy="${pa.y}" r="2.6"/><circle class="dot" cx="${pb.sx}" cy="${pb.y}" r="2.6"/></g>`;
      nets += `<text class="net" x="${lx + (bw ? 14 : 0)}" y="${ly}">${esc(trunc(l.label, 20))}</text>`;
    });
    for (const c of k.comps) {
      const g = geo[c.id];
      let p = "";
      for (const side of ["L", "R"]) for (const pin of pins[c.id][side]) {
        p += `<line class="pin" x1="${pin.x}" y1="${pin.y}" x2="${pin.sx}" y2="${pin.y}"/>`;
        const lbl = trunc(pin.label.split(/[ /(]/)[0], 11);
        p += `<text class="pinlbl" x="${side === "L" ? pin.x + 5 : pin.x - 5}" y="${pin.y + 3}" text-anchor="${side === "L" ? "start" : "end"}">${esc(lbl)}</text>`;
      }
      ics += `<g class="ic" data-id="${c.id}">
        <text class="ref" x="${g.x}" y="${g.y - 8}">${refs[c.id]}</text>
        <rect class="body" x="${g.x}" y="${g.y}" width="${g.w}" height="${g.h}"/>${p}
        <text class="icname" x="${g.x + g.w / 2}" y="${g.y + 18}" text-anchor="middle">${esc(trunc(c.name, 20))}</text>
        <text class="val" x="${g.x}" y="${g.y + g.h + 14}">${esc(trunc(primaryPN(c.pn), 26))}</text>
        <title>${refs[c.id]} · ${esc(c.name)} — ${esc(c.pn)}</title></g>`;
    }
    const W = 70 + 5 * CW, H = rowY[rows - 1] + rowH[rows - 1];
    const tb = `<g class="tb" transform="translate(${W - 330},${H + 10})"><rect width="330" height="78"/><line x1="0" y1="30" x2="330" y2="30" stroke="#1d2a44"/>
      <text class="big" x="10" y="21">${esc(k.name)}</text><text x="10" y="47">Board: ${esc(trunc(k.board, 44))}</text>
      <text x="10" y="66">Simplified functional schematic · not a manufacturer drawing</text></g>`;
    const border = `<rect x="20" y="20" width="${W + 10}" height="${H + 78}" fill="none" stroke="#1d2a44" stroke-width="1.2"/>`;
    svg.innerHTML = `<g id="content">${border}${wires}${ics}${nets}${tb}</g>`;
  }

  // ------------------------------------------------------------- parts table
  function renderParts(k) {
    const refs = refDes(k);
    const rows = [...k.comps].sort((a, b) => refs[a.id].localeCompare(refs[b.id], undefined, { numeric: true })).map(c => `
      <tr data-id="${c.id}" class="${state.sel === c.id ? "sel" : ""}">
        <td class="ref">${refs[c.id]}</td>
        <td><b>${esc(c.name)}</b></td>
        <td class="pn">${esc(c.pn)}${c.verify ? '<span class="warn" title="Varies by revision">⚠ verify</span>' : ""}</td>
        <td><span class="dotc" style="background:${catColor(c.cat)}"></span>${CAT[c.cat][0]}</td>
        <td>${esc(c.use)}</td>
      </tr>`).join("");
    $("#partsTable").innerHTML = `<table><thead><tr><th>Ref</th><th>Component</th><th>Part number</th><th>Type</th><th>What it does</th></tr></thead><tbody>${rows}</tbody></table>
      <p style="color:var(--muted);font-size:12px;margin-top:14px">${k.comps.length} components · click a row for image and replacement sources.</p>`;
  }
  $("#partsTable").addEventListener("click", e => { const tr = e.target.closest("tr[data-id]"); if (tr) selectComp(tr.dataset.id); });

  // ------------------------------------------------------------- selection
  function selectComp(id) {
    state.sel = id; highlight();
    const c = state.console.comps.find(x => x.id === id); showDetail(c);
    document.querySelectorAll("#partsTable tr").forEach(tr => tr.classList.toggle("sel", tr.dataset.id === id));
  }
  function highlight(hoverId) {
    const id = hoverId || state.sel, svg = $("#diagram");
    svg.classList.toggle("dim", !!id && state.view === "block");
    const near = new Set();
    svg.querySelectorAll(".edge, .wg").forEach(e => {
      const hot = id && (e.dataset.a === id || e.dataset.b === id);
      e.classList.toggle("hot", !!hot);
      e.querySelectorAll(".wire").forEach(w => w.classList.toggle("hot", !!hot));
      if (hot) { near.add(e.dataset.a); near.add(e.dataset.b); }
    });
    svg.querySelectorAll(".node, .ic").forEach(n => { n.classList.toggle("sel", n.dataset.id === state.sel); n.classList.toggle("near", near.has(n.dataset.id)); });
  }

  async function showDetail(c) {
    $("#detailEmpty").hidden = !!c; $("#detailBody").hidden = !c;
    if (!c) return;
    const k = state.console, key = `${k.id}/${c.id}`;
    $("#compCat").textContent = CAT[c.cat][0]; $("#compCat").style.background = catColor(c.cat);
    $("#compName").textContent = c.name;
    $("#compPN").textContent = c.pn;
    $("#compVerify").hidden = !c.verify;
    $("#compUse").textContent = c.use;
    $("#notesWrap").hidden = !c.notes; $("#compNotes").textContent = c.notes;
    // connections
    const links = k.links.filter(l => l.a === c.id || l.b === c.id);
    $("#compLinks").innerHTML = links.map(l => { const o = k.comps.find(x => x.id === (l.a === c.id ? l.b : l.a)); return `<button data-id="${o.id}">${esc(o.name)}<small>${esc(l.label)}</small></button>`; }).join("") || '<span style="color:var(--muted)">—</span>';
    // buy
    const q = queryFor(c, k);
    $("#buyHint").textContent = buyHint(c);
    $("#buyLinks").innerHTML = vendorsFor(c, k).map(v => `<button data-url="${esc(VENDORS[v][2](q))}"><b>${VENDORS[v][0]} ↗</b><span>${VENDORS[v][1]}</span></button>`).join("");
    const pn = primaryPN(c.pn);
    const research = [
      ["Datasheet", `https://www.google.com/search?q=${enc(pn + " datasheet pdf")}`],
      ["Photos of this part", `https://www.google.com/search?tbm=isch&q=${enc(k.short + " " + pn)}`],
      ["Repair guides", `https://www.google.com/search?q=${enc(k.short + " " + c.name + " repair")}`],
      ["Pinout / schematic", `https://www.google.com/search?q=${enc(k.short + " " + pn + " pinout schematic")}`]
    ];
    $("#researchLinks").innerHTML = research.map(([n, u]) => `<button data-url="${esc(u)}"><b>${n} ↗</b></button>`).join("");
    // image
    let photo = null;
    if (bridge) { try { photo = await bridge.getPhoto(key); } catch (_) { } }
    else { try { photo = localStorage.getItem("atlas:photo:" + key); } catch (_) { } }
    if (state.sel !== c.id) return;
    if (photo) {
      $("#compImage").innerHTML = `<img alt="" src="${esc(photo)}">`;
      $("#imgCaption").textContent = "Your photo.";
    } else {
      $("#compImage").innerHTML = renderPackage(c);
      $("#imgCaption").textContent = "Illustration of the package type with its marking — open “Photos of this part” for real photos, or add your own.";
    }
    $("#btnRemovePhoto").hidden = !photo;
    // notes
    try { $("#userNotes").value = localStorage.getItem("atlas:note:" + key) || ""; } catch (_) { $("#userNotes").value = ""; }
  }

  $("#detail").addEventListener("click", e => {
    const b = e.target.closest("button[data-url]"); if (b) return openExternal(b.dataset.url);
    const n = e.target.closest("#compLinks button[data-id]"); if (n) selectComp(n.dataset.id);
  });
  $("#btnCopy").onclick = () => { navigator.clipboard.writeText($("#compPN").textContent).then(() => toast("Part number copied")); };
  $("#userNotes").addEventListener("input", () => { if (!state.sel) return; try { localStorage.setItem(`atlas:note:${state.console.id}/${state.sel}`, $("#userNotes").value); } catch (_) { } });
  $("#btnAddPhoto").onclick = async () => {
    if (!state.sel) return;
    const key = `${state.console.id}/${state.sel}`;
    if (bridge) { const ok = await bridge.pickPhoto(key); if (ok) { toast("Photo saved"); showDetail(state.console.comps.find(x => x.id === state.sel)); } return; }
    const inp = document.createElement("input"); inp.type = "file"; inp.accept = "image/*";
    inp.onchange = () => { const f = inp.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { try { localStorage.setItem("atlas:photo:" + key, r.result); } catch (_) { toast("Image too large"); } showDetail(state.console.comps.find(x => x.id === state.sel)); }; r.readAsDataURL(f); };
    inp.click();
  };
  $("#btnRemovePhoto").onclick = async () => {
    const key = `${state.console.id}/${state.sel}`;
    if (bridge) await bridge.removePhoto(key); else { try { localStorage.removeItem("atlas:photo:" + key); } catch (_) { } }
    showDetail(state.console.comps.find(x => x.id === state.sel));
  };
  $("#btnSchematicSearch").onclick = () => { const k = state.console; openExternal(`https://www.google.com/search?q=${enc(k.name + " " + k.board.split(/[ ,(]/)[0] + " schematic pdf")}`); };
  $("#btnGuides").onclick = () => openExternal(`https://www.ifixit.com/Search?query=${enc(state.console.name)}`);

  function toast(msg) { const t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => t.hidden = true, 1600); }

  // ------------------------------------------------------------- diagram interaction (pan / zoom / click)
  const svg = $("#diagram");
  function applyVB() { const v = state.vb; svg.setAttribute("viewBox", `${v.x} ${v.y} ${v.w} ${v.h}`); }
  function fitView() {
    const g = svg.querySelector("#content"); if (!g) return;
    const bb = g.getBBox(), r = svg.getBoundingClientRect(), pad = 30;
    const w = bb.width + pad * 2, h = bb.height + pad * 2;
    const s = Math.max(w / r.width, h / r.height);
    const vw = r.width * s, vh = r.height * s;
    state.vb = { x: bb.x - pad - (vw - w) / 2, y: bb.y - pad - (vh - h) / 2, w: vw, h: vh }; applyVB();
  }
  function zoom(f, cx, cy) {
    const v = state.vb, r = svg.getBoundingClientRect();
    const px = cx === undefined ? 0.5 : (cx - r.left) / r.width, py = cy === undefined ? 0.5 : (cy - r.top) / r.height;
    const nw = Math.min(8000, Math.max(200, v.w * f)), nh = v.h * nw / v.w;
    state.vb = { x: v.x + (v.w - nw) * px, y: v.y + (v.h - nh) * py, w: nw, h: nh }; applyVB();
  }
  svg.addEventListener("wheel", e => { e.preventDefault(); zoom(e.deltaY > 0 ? 1.12 : 1 / 1.12, e.clientX, e.clientY); }, { passive: false });
  let drag = null;
  svg.addEventListener("pointerdown", e => { drag = { x: e.clientX, y: e.clientY, vb: { ...state.vb }, moved: false }; });
  window.addEventListener("pointermove", e => {
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < 4) return;
    drag.moved = true; svg.classList.add("dragging");
    const r = svg.getBoundingClientRect(), s = drag.vb.w / r.width;
    state.vb = { ...drag.vb, x: drag.vb.x - dx * s, y: drag.vb.y - dy * s }; applyVB();
  });
  window.addEventListener("pointerup", e => {
    if (drag && !drag.moved) {
      const n = e.target.closest && e.target.closest(".node, .ic");
      if (n) selectComp(n.dataset.id); else if (svg.contains(e.target)) { state.sel = null; highlight(); showDetail(null); }
    }
    drag = null; svg.classList.remove("dragging");
  });
  svg.addEventListener("mouseover", e => { const n = e.target.closest(".node, .ic"); if (n && !drag) highlight(n.dataset.id); });
  svg.addEventListener("mouseout", e => { const n = e.target.closest(".node, .ic"); if (n && !drag) highlight(); });
  svg.addEventListener("keydown", e => { const n = e.target.closest(".node"); if (n && (e.key === "Enter" || e.key === " ")) selectComp(n.dataset.id); });
  $("#zoomIn").onclick = () => zoom(1 / 1.25); $("#zoomOut").onclick = () => zoom(1.25); $("#zoomFit").onclick = fitView;
  window.addEventListener("resize", () => { if (state.view !== "parts") fitView(); });

  document.querySelector(".tabs").addEventListener("click", e => {
    const t = e.target.closest(".tab"); if (!t) return;
    document.querySelectorAll(".tab").forEach(x => x.classList.toggle("active", x === t));
    state.view = t.dataset.view; renderView(true);
  });

  // ------------------------------------------------------------- global search
  const index = DATA.flatMap(k => k.comps.map(c => ({ k, c, hay: `${k.name} ${k.short} ${c.name} ${c.pn} ${CAT[c.cat][0]} ${c.use}`.toLowerCase() })));
  let results = [], rsel = 0;
  const sInput = $("#globalSearch"), sBox = $("#searchResults");
  function doSearch() {
    const terms = sInput.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!terms.length) { sBox.hidden = true; return; }
    results = index.filter(r => terms.every(t => r.hay.includes(t)))
      .map(r => ({ ...r, score: (r.c.pn.toLowerCase().includes(terms[0]) ? 0 : 1) + (r.c.name.toLowerCase().includes(terms[0]) ? 0 : 1) }))
      .sort((a, b) => a.score - b.score || a.k.year - b.k.year).slice(0, 60);
    rsel = 0;
    sBox.innerHTML = results.length ? results.map((r, i) => `<div class="sr-item ${i === 0 ? "sel" : ""}" data-i="${i}"><span class="n">${esc(r.c.name)}</span><span class="c">${esc(r.k.short)} · ${r.k.year}</span><span class="p">${esc(r.c.pn)}</span></div>`).join("")
      : `<div class="sr-empty">No parts match “${esc(sInput.value)}”.</div>`;
    sBox.hidden = false;
  }
  function pick(i) { const r = results[i]; if (!r) return; sBox.hidden = true; sInput.blur(); selectConsole(r.k.id, r.c.id); }
  sInput.addEventListener("input", doSearch);
  sInput.addEventListener("focus", () => { if (sInput.value) doSearch(); });
  sInput.addEventListener("keydown", e => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault(); rsel = Math.max(0, Math.min(results.length - 1, rsel + (e.key === "ArrowDown" ? 1 : -1)));
      sBox.querySelectorAll(".sr-item").forEach((x, i) => x.classList.toggle("sel", i === rsel));
      const s = sBox.querySelector(".sr-item.sel"); if (s) s.scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter") pick(rsel);
    else if (e.key === "Escape") { sBox.hidden = true; sInput.blur(); }
  });
  sBox.addEventListener("mousedown", e => { const it = e.target.closest(".sr-item"); if (it) { e.preventDefault(); pick(+it.dataset.i); } });
  document.addEventListener("click", e => { if (!e.target.closest(".search")) sBox.hidden = true; });
  document.addEventListener("keydown", e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); sInput.focus(); sInput.select(); } });

  // ------------------------------------------------------------- boot
  renderMakers(); renderList();
  let last = null; try { last = localStorage.getItem("atlas:last"); } catch (_) { }
  selectConsole(DATA.some(k => k.id === last) ? last : DATA[0].id);
  window.__atlas = { state, selectConsole, selectComp, setView: v => document.querySelector(`.tab[data-view="${v}"]`).click() };
})();
