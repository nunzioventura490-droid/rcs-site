// Auth check
const user = sessionStorage.getItem("rcs_user") || "—";
const navUser = document.getElementById("navUser");
if (navUser) navUser.textContent = user.toUpperCase();

function logout() {
  sessionStorage.removeItem("rcs_auth");
  sessionStorage.removeItem("rcs_user");
  window.location.href = "../index.html";
}

// Navbar scroll
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 40);
});

// Flotte reali da script Python
const FLEETS = {
  virtu: [
    { name: "MV Saint John Paul II", type: "High Speed Craft · Ro-Pax", flag: "🇲🇹", wear: 25, engine: "4× MTU 20V 8000 M71L", year: 2019, note: "36.400 kW · 38 kn · 900 pax · IMO 9762337" },
    { name: "MV Jean de La Valette",  type: "High Speed Craft · Ro-Pax", flag: "🇲🇹", wear: 56, engine: "4× MTU 20V 8000 M71L", year: 2010, note: "36.400 kW · 39 kn · 800 pax · IMO 9468946" },
    { name: "MV Maria Dolores",       type: "High Speed Craft · Ro-Pax · In Charter", flag: "🇲🇹", wear: 70, engine: "6× MTU 16V 4000 M73L", year: 2006, note: "🟠 ALTO · 36 kn · 600 pax · Charter Tarifa–Tangeri 2025" },
    { name: "HSC Gozo Express",       type: "High Speed Craft · Catamarano", flag: "🇲🇹", wear: 54, engine: "4× MTU 12V 2000 M72", year: 2008, note: "34 kn · 322 pax · IMO 9396753" },
    { name: "San Frangisk",           type: "Air Cushion Catamaran",     flag: "🇲🇹", wear: 90, engine: "2× Deutz MWM 620B V16", year: 1990, note: "🔴 CRITICO · 38 kn · 330 pax · IMO 8903899" },
    { name: "San Pawl",               type: "Air Cushion Catamaran · ⚠️ Ex-flotta", flag: "🇲🇹", wear: 88, engine: "2× Deutz MWM 604B V16", year: 1991, note: "Ceduta Islands Unlimited 2025 · IMO 8903904" },
    { name: "Balluta Bay",            type: "Oil Products Tanker",       flag: "🇲🇹", wear: 100, engine: "Convenzionale",        year: 1981, note: "🔴 CRITICO · 12 kn · IMO 8013091" },
  ],
  tug: [
    { name: "MT Vittoriosa",    type: "ASD Escort Tug · RAstar 3000-W", flag: "🇲🇹", wear: 25, engine: "2× MTU 16V 4000 M65L", year: 2019, note: "81,5t BP · Med Marine Turchia · IMO 9854868" },
    { name: "MT St. Angelo",    type: "ASD Tug · Damen ASD 2913",       flag: "🇲🇹", wear: 29, engine: "2× Caterpillar 3516C",  year: 2017, note: "83,0t BP · Damen Galati · IMO 9799991" },
    { name: "MT Senglea",       type: "RSD Tug · Damen RSD 2513",       flag: "🇲🇹", wear: 19, engine: "2× Caterpillar 3516C",  year: 2020, note: "80,0t BP · Damen Vietnam · IMO 9892195" },
    { name: "MT Med Aldebaran", type: "RSD Tug · Damen RSD 2513 Tier III", flag: "🇲🇹", wear: 6, engine: "2× Caterpillar 3516C", year: 2024, note: "80,0t BP · IMO Tier III · IMO 9740392" },
    { name: "MT St. Elmo",      type: "ASD Escort Tug · RAmparts 3000W", flag: "🇲🇹", wear: 48, engine: "2× Caterpillar 3516C", year: 2011, note: "75,0t BP · Zamakona Spagna · IMO 9594999" },
    { name: "MT Spinola",       type: "VSP Tractor Tug · AVT 36/80",    flag: "🇲🇹", wear: 34, engine: "2× MaK 8M25",          year: 2009, note: "81,6t BP · Voith 32R5 · IMO 9495258" },
    { name: "MT Wenzina",       type: "ASD Tug · Damen ASD 2411",       flag: "🇲🇹", wear: 64, engine: "2× Caterpillar 3516C",  year: 2006, note: "72,5t BP · IMO 9364124" },
    { name: "MT Pawlina",       type: "ASD Tug · 🔴 CRITICO",            flag: "🇲🇹", wear: 64, engine: "2× Caterpillar 3516B",  year: 2006, note: "67,1t BP · IMO 9237929" },
    { name: "MT Sea Salvor",    type: "Conventional Tug · Salvage",     flag: "🇲🇹", wear: 90, engine: "2× Caterpillar 3516C",  year: 1998, note: "🔴 CRITICO · 55,0t BP · IMO 9203100" },
    { name: "MT Gozzo",         type: "Mooring / Line Handler",          flag: "🇲🇹", wear: 21, engine: "2× Volvo Diesel",       year: 2019, note: "9,0t BP · Porto Valletta" },
  ],
  australia: [
    { name: "Spirit of Tasmania I",   type: "RoPax Ferry",              flag: "🇦🇺", wear: 54, engine: "4× Wärtsilä 9L46DF",    year: 2001, note: "TT-Line · Geelong–Devonport" },
    { name: "Spirit of Tasmania IV",  type: "RoPax Ferry · Dual-Fuel",  flag: "🇦🇺", wear: 14, engine: "Wärtsilä 9L46DF (LNG)", year: 2022, note: "TT-Line · LNG Dual-Fuel" },
    { name: "Iron Pilbara",           type: "Bulk Carrier Support",     flag: "🇦🇺", wear: 42, engine: "MAN B&W ME-C",           year: 2013, note: "BHP Fleet · Port Hedland → Asia" },
    { name: "Fortescue Pioneer",      type: "Mining Supply Vessel",     flag: "🇦🇺", wear: 28, engine: "Caterpillar 3516C",      year: 2016, note: "FMG Fleet · Dampier" },
    { name: "Svitzer Batavia",        type: "ASD Tug",                  flag: "🇦🇺", wear: 32, engine: "Caterpillar 3516C",      year: 2016, note: "Svitzer · Fremantle Port" },
    { name: "SeaSwift Aliesha",       type: "Coastal Cargo Vessel",     flag: "🇦🇺", wear: 44, engine: "Cummins QSK 60",         year: 2013, note: "Cairns–Torres Strait" },
  ],
};

// ── MAPPING COMPONENTI → RICAMBI ───────────────────────────
const COMPONENT_PARTS_MAP = {
  "Filtri carburante": [{ code: "FF5488", desc: "Filtro Carburante Fleetguard Marine", price: 88, stock: "Stock" }],
  "Filtri olio": [{ code: "LF9009", desc: "Filtro Olio Fleetguard QSL", price: 42, stock: "Stock" }],
  "Sensore pressione CR": [{ code: "0 281 006 064", desc: "Sensore Pressione CR Bosch", price: 240, stock: "Stock" }],
  "Filtri refrigerante": [{ code: "WF2073", desc: "Filtro Refrigerante Fleetguard QSM11", price: 38, stock: "Stock" }],
  "Separatore carburante/acqua": [{ code: "FS1000", desc: "Separatore Carburante/Acqua FG", price: 65, stock: "Stock" }],
  "Alternatore marino": [{ code: "0 124 655 025", desc: "Alternatore Bosch 24V 120A", price: 310, stock: "Stock" }],
  "Filtri aria": [{ code: "3967726", desc: "Filtro Aria Fleetguard Marine", price: 88, stock: "Stock" }],
};

function wearClass(pct) {
  if (pct >= 75) return "high";
  if (pct >= 45) return "medium";
  return "low";
}

function renderFleet(key) {
  const grid = document.getElementById("fleetGrid");
  grid.innerHTML = FLEETS[key].map((ship, i) => `
    <div class="fleet-card" style="animation-delay:${i * 0.08}s; cursor:pointer;" onclick="openNaveModal('${key}', ${i})">
      <div class="fleet-card-header">
        <div>
          <div class="fleet-name">${ship.name}</div>
          <div class="fleet-type">${ship.type}</div>
        </div>
        <div class="fleet-flag">${ship.flag}</div>
      </div>
      <div class="wear-label">
        <span>USURA MOTORE</span>
        <span class="wear-pct">${ship.wear}%</span>
      </div>
      <div class="wear-bar">
        <div class="wear-fill ${wearClass(ship.wear)}" style="width:${ship.wear}%"></div>
      </div>
      <div class="fleet-meta">
        <span><strong>${ship.engine}</strong></span>
        <span>Anno <strong>${ship.year}</strong></span>
        <span>${ship.note}</span>
      </div>
    </div>
  `).join("");
}

function switchTab(key) {
  document.querySelectorAll(".tab").forEach((btn, i) => {
    const keys = ["virtu", "tug", "australia"];
    btn.classList.toggle("active", keys[i] === key);
  });
  renderFleet(key);
}

// ── MODAL DETTAGLI NAVE ──────────────────────────────────────
function openNaveModal(fleetKey, shipIndex) {
  const ship = FLEETS[fleetKey][shipIndex];
  const modal = document.getElementById("naveModal");

  // Cercare i componenti a rischio REALI da RISCHIO_DATA
  const components = RISCHIO_DATA.filter(r => r.nave === ship.name);

  document.getElementById("naveName").textContent = ship.name;
  document.getElementById("naveType").textContent = ship.type;
  document.getElementById("naveBandiera").textContent = ship.flag;
  document.getElementById("naveMotore").textContent = ship.engine;
  document.getElementById("naveAlimentazione").textContent = ship.type.includes("Dual-Fuel") ? "Dual-Fuel LNG" : "Diesel Convenzionale";
  document.getElementById("naveAnno").textContent = ship.year;
  document.getElementById("naveUsura").textContent = ship.wear + "%";
  document.getElementById("naveNote").textContent = ship.note;

  const wearBar = document.getElementById("naveWearBar");
  wearBar.style.width = ship.wear + "%";
  wearBar.className = "wear-fill " + wearClass(ship.wear);

  // Popolare tabella componenti dai DATI REALI
  const tableHtml = components.length > 0 ? `
    <table style="width:100%; border-collapse:collapse; font-size:12px;">
      <thead>
        <tr style="background:rgba(0,87,184,.2); border-bottom:1px solid rgba(0,87,184,.3);">
          <th style="padding:10px; text-align:left; color:#00d4ff; font-family:var(--F); font-weight:700;">COMPONENTE</th>
          <th style="padding:10px; text-align:center; color:#00d4ff; font-family:var(--F); font-weight:700;">CATEGORIA</th>
          <th style="padding:10px; text-align:center; color:#00d4ff; font-family:var(--F); font-weight:700; width:60px;">STATUS</th>
          <th style="padding:10px; text-align:center; color:#00d4ff; font-family:var(--F); font-weight:700; width:50px;">USURA</th>
          <th style="padding:10px; text-align:left; color:#00d4ff; font-family:var(--F); font-weight:700;">RICAMBIO SUGGERITO</th>
        </tr>
      </thead>
      <tbody>
        ${components.map((comp, idx) => {
          const parts = COMPONENT_PARTS_MAP[comp.comp] || [];
          const statusColor = comp.status === 'CRITICO' ? '#ff3333' : comp.status === 'ALTO' ? '#ff8c00' : '#ffd700';
          return `
          <tr style="border-bottom:1px solid rgba(0,87,184,.1); ${idx % 2 ? 'background:rgba(0,0,0,.2);' : ''}">
            <td style="padding:10px; color:#fff;">${comp.comp}</td>
            <td style="padding:10px; text-align:center; color:var(--grigio); font-size:11px;">${comp.cat}</td>
            <td style="padding:10px; text-align:center; color:${statusColor}; font-family:var(--F); font-weight:700; font-size:11px;">${comp.status}</td>
            <td style="padding:10px; text-align:center; color:#ff8c00; font-weight:700;">${comp.usura.toFixed(1)}%</td>
            <td style="padding:10px;">
              ${parts.length > 0 ? parts.map(p => `
                <div style="margin:6px 0; color:${p.stock === 'Stock' ? '#00e676' : '#ffd700'}; border-left:2px solid ${p.stock === 'Stock' ? '#00e676' : '#ffd700'}; padding-left:8px;">
                  <strong>${p.code}</strong><br>
                  <span style="font-size:11px; color:#fff;">${p.desc}</span><br>
                  <span style="font-size:10px; color:var(--grigio);">€${p.price} · <span style="color:${p.stock === 'Stock' ? '#00e676' : '#ffd700'};">${p.stock}</span></span>
                </div>
              `).join('') : '<div style="color:var(--grigio); font-size:11px;">Codice ricambio non disponibile</div>'}
            </td>
          </tr>
        `;
        }).join('')}
      </tbody>
    </table>
  ` : '<div style="padding:20px; text-align:center; color:var(--grigio);">Nessun componente critico rilevato. Nave in buone condizioni.</div>';

  document.getElementById("componentsTable").innerHTML = tableHtml;

  modal.classList.add("show");
}

function closeNaveModal() {
  const modal = document.getElementById("naveModal");
  modal.classList.remove("show");
}

// Reveal on scroll (slide da destra)
function checkReveal() {
  const trigger = window.innerHeight - 60;
  document.querySelectorAll(".reveal, .fleet-card, .mercato-card, .strat-item, .cat-row").forEach(el => {
    if (el.getBoundingClientRect().top < trigger) {
      el.classList.add("visible");
      el.style.opacity = "1";
      el.style.transform = "translateX(0)";
    }
  });
}
window.addEventListener("scroll", checkReveal);

// Onde canvas hero
const canvas = document.getElementById("heroWaves");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let W, H, t = 0;
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = 260; }
  resize();
  window.addEventListener("resize", resize);
  function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 0.007;
    [[90,.006,.012,28,14,1,1.3,"rgba(0,87,184,0.14)"],[120,.008,.015,20,10,.8,1.6,"rgba(0,212,255,0.08)"],[155,.01,.007,14,8,.6,1.1,"rgba(0,150,220,0.10)"]].forEach(w => {
      ctx.beginPath(); ctx.moveTo(0,H);
      for(let x=0;x<=W;x+=4){const y=w[0]+Math.sin(x*w[1]+t*w[4])*w[3]+Math.sin(x*w[2]+t*w[5])*w[6];ctx.lineTo(x,y);}
      ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.closePath();ctx.fillStyle=w[7];ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

renderFleet("virtu");
checkReveal();
// ── CATALOGO ─────────────────────────────────────────────────────────────────
const CATALOG = [
  { code:"0 281 006 064", name:"Sensore Pressione CR Bosch",         brand:"Bosch",      motors:"MTU 4000/8000 · MAN · Cummins CR",          price:240,  stock:"Stock",  vf:true,  tm:true  },
  { code:"0 445 120 217", name:"Iniettore Bosch CRIN3",              brand:"Bosch",      motors:"MAN B&W G-Type Marine",                      price:620,  stock:"Stock",  vf:false, tm:false },
  { code:"0 445 010 537", name:"Pompa Alta Pressione Bosch CP4",     brand:"Bosch",      motors:"Marine CR Bosch/MAN",                        price:980,  stock:"Ordine", vf:false, tm:false },
  { code:"0 445 120 236", name:"Iniettore Bosch CR Cummins QSL9",    brand:"Bosch",      motors:"Cummins QSL9 (8.9L) Marine",                 price:590,  stock:"Stock",  vf:false, tm:false },
  { code:"0 445 120 455", name:"Iniettore Bosch CR Cummins QSB 6.7", brand:"Bosch",      motors:"Cummins QSB 6.7 Marine",                     price:545,  stock:"Stock",  vf:false, tm:false },
  { code:"0 445 120 356", name:"Iniettore Bosch CR QSB 6.7 CPL4191", brand:"Bosch",      motors:"Cummins QSB 6.7 (CPL 4191) Marine",          price:570,  stock:"Stock",  vf:false, tm:false },
  { code:"0 124 655 025", name:"Alternatore Bosch 24V 120A",         brand:"Bosch",      motors:"MAN heavy diesel · ausiliari marini",         price:310,  stock:"Stock",  vf:true,  tm:false },
  { code:"7C-3614",       name:"Pompa Acqua Mare CAT 3516",          brand:"Caterpillar",motors:"CAT 3408/3412/3508/3512/3516 Marine",         price:720,  stock:"Stock",  vf:false, tm:true  },
  { code:"20R-1266",      name:"Iniettore CAT 3512C/3516C (Reman)",  brand:"Caterpillar",motors:"CAT 3512C · 3516C · 3516B Marine",            price:1150, stock:"Stock",  vf:false, tm:true  },
  { code:"20R-1278",      name:"Iniettore CAT 3508/3512/3516 (Reman)",brand:"Caterpillar",motors:"CAT 3508/3512/3516/3518 Marine",             price:1080, stock:"Stock",  vf:false, tm:true  },
  { code:"FF5488",        name:"Filtro Carburante Fleetguard Marine", brand:"Cummins",    motors:"Cummins QSB 5.9/6.7 · QSC 8.3 · QSL 9.0",  price:88,   stock:"Stock",  vf:true,  tm:true  },
  { code:"LF9009",        name:"Filtro Olio Fleetguard Cummins QSL",  brand:"Cummins",    motors:"Cummins 6C · QSC 8.3 · QSL 9.0 Marine",     price:42,   stock:"Stock",  vf:true,  tm:true  },
  { code:"WF2073",        name:"Filtro Refrigerante Fleetguard QSM11",brand:"Cummins",    motors:"Cummins QSM11 · L10 · M11 · K19 · V28",     price:38,   stock:"Stock",  vf:false, tm:false },
  { code:"FS1000",        name:"Separatore Carburante/Acqua FG",      brand:"Cummins",    motors:"Cummins N14 · ISM · ISL · ISX genset",       price:65,   stock:"Stock",  vf:true,  tm:true  },
  { code:"3967726",       name:"Alternatore Marino 24V 80A Cummins",  brand:"Cummins",    motors:"Cummins QSM11 · QSL9 · QSB 5.9/6.7",        price:485,  stock:"Stock",  vf:true,  tm:false },
  { code:"28231014",      name:"Iniettore Delphi L-series",           brand:"Delphi",     motors:"Cummins QSK 19 · CAT 3516 CR Delphi",        price:445,  stock:"Stock",  vf:false, tm:false },
  { code:"BEBE4C17001",   name:"Delphi EUI Iniettore Volvo Penta D9", brand:"Delphi",     motors:"Volvo Penta D9 / D9-MH / D9-425/500/575",    price:680,  stock:"Ordine", vf:false, tm:false },
  { code:"BEBE4D24001",   name:"Delphi E3 EUI Iniettore Volvo D13",   brand:"Delphi",     motors:"Volvo D13A / D13C · Volvo Penta IPS",        price:720,  stock:"Ordine", vf:false, tm:false },
  { code:"5265902",       name:"Iniettore Meccanico Delphi/Kelvin",   brand:"Delphi",     motors:"Kelvin marine diesel meccanico",              price:290,  stock:"Ordine", vf:false, tm:false },
];

let currentCatFilter = "all";

function renderCatalog(filter) {
  const tbody = document.getElementById("catBody");
  const items = filter === "all" ? CATALOG : CATALOG.filter(c => c.brand === filter);
  tbody.innerHTML = items.map(c => `
    <tr class="cat-row">
      <td><span class="cat-code">${c.code}</span></td>
      <td class="cat-name">${c.name}</td>
      <td><span class="cat-brand cat-brand-${c.brand.toLowerCase()}">${c.brand}</span></td>
      <td class="cat-motors">${c.motors}</td>
      <td class="cat-price">€ ${c.price.toLocaleString("it-IT")}</td>
      <td><span class="cat-stock ${c.stock === 'Stock' ? 'in-stock' : 'on-order'}">${c.stock}</span></td>
      <td class="cat-badge">${c.vf ? '<span class="badge-vf">VF</span>' : '—'}</td>
      <td class="cat-badge">${c.tm ? '<span class="badge-tm">TM</span>' : '—'}</td>
    </tr>
  `).join("");
}

function filterCatalog(brand) {
  currentCatFilter = brand;
  document.querySelectorAll("#catalogo .tab").forEach(btn => {
    btn.classList.toggle("active", btn.textContent.toUpperCase().startsWith(brand === "all" ? "TUT" : brand.toUpperCase().substring(0, 3)));
  });
  renderCatalog(brand);
}

renderCatalog("all");
// ── GRAFICI CHART.JS ──────────────────────────────────────────
Chart.defaults.color = 'rgba(255,255,255,.6)';
Chart.defaults.font.family = 'Barlow';
Chart.defaults.font.size = 11;

const GRID  = 'rgba(0,87,184,.15)';
const TICKS = 'rgba(255,255,255,.45)';

function wearColor(w) {
  return w >= 75 ? 'rgba(255,68,68,.75)' : w >= 45 ? 'rgba(255,171,0,.75)' : 'rgba(0,230,118,.75)';
}
function wearBorder(w) {
  return w >= 75 ? '#ff4444' : w >= 45 ? '#ffab00' : '#00e676';
}

// 1 — FATTURATO & EXPORT ──────────────────────────────────────
const ctxF = document.getElementById('chartFatturato')?.getContext('2d');
if (ctxF) {
  new Chart(ctxF, {
    type: 'line',
    data: {
      labels: ['2017','2018','2019','2020','2021','2022','2023','2025','2026★','2027★'],
      datasets: [
        {
          label: 'Fatturato Totale (€M)',
          data: [6.8, 6.2, 7.4, 8.1, 9.3, 9.98, 12.0, 14.6, 18.0, 21.0],
          borderColor: '#00d4ff',
          backgroundColor: 'rgba(0,212,255,.07)',
          fill: true, tension: 0.45,
          pointBackgroundColor: '#00d4ff', pointRadius: 4,
          borderDash: [0],
        },
        {
          label: 'Export (€M)',
          data: [0.3, 0.25, 0.4, 0.6, 0.9, 1.1, 1.5, 2.0, 3.0, 4.0],
          borderColor: '#c9a84c',
          backgroundColor: 'rgba(201,168,76,.07)',
          fill: true, tension: 0.45,
          pointBackgroundColor: '#c9a84c', pointRadius: 4,
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: 'rgba(255,255,255,.7)', usePointStyle: true, padding: 20 } }
      },
      scales: {
        x: { grid: { color: GRID }, ticks: { color: TICKS } },
        y: { grid: { color: GRID }, ticks: { color: TICKS, callback: v => '€' + v + 'M' }, beginAtZero: true }
      }
    }
  });
}

// 2 — SCORE RCS COMPAGNIE ─────────────────────────────────────
const ctxM = document.getElementById('chartMercati')?.getContext('2d');
if (ctxM) {
  const comp = [
    { n: 'Tug Malta Ltd.',    s: 99 }, { n: 'Svitzer Australia',  s: 99 },
    { n: 'BHP Fleet',         s: 98 }, { n: 'Maersk Line',        s: 98 },
    { n: 'Rio Tinto Marine',  s: 97 }, { n: 'Grimaldi Lines',     s: 96 },
    { n: 'FMG',               s: 96 }, { n: 'Virtu Ferries',      s: 95 },
    { n: 'MSC',               s: 95 }, { n: 'TT-Line',            s: 95 },
    { n: 'GNV',               s: 94 }, { n: 'CMA CGM',            s: 92 },
  ];
  new Chart(ctxM, {
    type: 'bar',
    data: {
      labels: comp.map(c => c.n),
      datasets: [{
        data: comp.map(c => c.s),
        backgroundColor: comp.map(c =>
          c.s >= 98 ? 'rgba(0,212,255,.65)' : c.s >= 95 ? 'rgba(0,87,184,.65)' : 'rgba(0,60,130,.55)'
        ),
        borderColor: '#0057b8', borderWidth: 1, borderRadius: 3,
      }]
    },
    options: {
      indexAxis: 'y', responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: GRID }, ticks: { color: TICKS }, min: 88, max: 100 },
        y: { grid: { color: 'transparent' }, ticks: { color: TICKS } }
      }
    }
  });
}

// 3 — USURA VIRTU FERRIES ─────────────────────────────────────
const ctxV = document.getElementById('chartVirtu')?.getContext('2d');
if (ctxV) {
  const virtu = [
    { n: 'MV Saint John Paul II', w: 25 },
    { n: 'HSC Gozo Express',      w: 54 },
    { n: 'MV Jean de La Valette', w: 56 },
    { n: 'MV Maria Dolores',      w: 70 },
    { n: 'San Pawl ⚠️',           w: 88 },
    { n: 'San Frangisk',          w: 90 },
    { n: 'Balluta Bay',           w: 100 },
  ];
  new Chart(ctxV, {
    type: 'bar',
    data: {
      labels: virtu.map(d => d.n),
      datasets: [{
        data: virtu.map(d => d.w),
        backgroundColor: virtu.map(d => wearColor(d.w)),
        borderColor: virtu.map(d => wearBorder(d.w)),
        borderWidth: 1, borderRadius: 3,
      }]
    },
    options: {
      indexAxis: 'y', responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ' ' + ctx.raw + '% usura' } }
      },
      scales: {
        x: { grid: { color: GRID }, ticks: { color: TICKS, callback: v => v + '%' }, max: 100 },
        y: { grid: { color: 'transparent' }, ticks: { color: TICKS, font: { size: 11 } } }
      }
    }
  });
}

// ── ANALISI ECONOMICA ─────────────────────────────────────────
const BRAND_COLOR = {
  Bosch:      { fill:'rgba(0,212,255,.65)',  border:'#00d4ff' },
  Cummins:    { fill:'rgba(0,230,118,.65)',  border:'#00e676' },
  Delphi:     { fill:'rgba(255,140,0,.70)',  border:'#ff8c00' },
  Caterpillar:{ fill:'rgba(255,204,0,.65)',  border:'#ffd700' },
};

const ECO_CODICI = [
  { code:'FS1000',        brand:'Cummins',     roi:83, price:65,   cost:35  },
  { code:'WF2073',        brand:'Cummins',     roi:83, price:38,   cost:21  },
  { code:'LF9009',        brand:'Cummins',     roi:83, price:42,   cost:23  },
  { code:'FF5488',        brand:'Cummins',     roi:83, price:88,   cost:48  },
  { code:'3967726',       brand:'Cummins',     roi:65, price:485,  cost:294 },
  { code:'0 281 006 064', brand:'Bosch',       roi:55, price:240,  cost:155 },
  { code:'0 445 120 356', brand:'Bosch',       roi:65, price:570,  cost:345 },
  { code:'0 445 120 455', brand:'Bosch',       roi:65, price:545,  cost:330 },
  { code:'0 445 120 236', brand:'Bosch',       roi:65, price:590,  cost:358 },
  { code:'0 445 120 217', brand:'Bosch',       roi:65, price:620,  cost:376 },
  { code:'0 124 655 025', brand:'Bosch',       roi:50, price:310,  cost:207 },
  { code:'0 445 010 537', brand:'Bosch',       roi:65, price:980,  cost:594 },
  { code:'5265902',       brand:'Delphi',      roi:65, price:290,  cost:176 },
  { code:'28231014',      brand:'Delphi',      roi:60, price:445,  cost:278 },
  { code:'BEBE4D24001',   brand:'Delphi',      roi:60, price:720,  cost:450 },
  { code:'BEBE4C17001',   brand:'Delphi',      roi:55, price:680,  cost:439 },
  { code:'7C-3614',       brand:'Caterpillar', roi:40, price:720,  cost:514 },
  { code:'20R-1278',      brand:'Caterpillar', roi:45, price:1080, cost:745 },
  { code:'20R-1266',      brand:'Caterpillar', roi:45, price:1150, cost:793 },
];

// ── ROI PER CODICE (HORIZONTAL BAR) ────────────────────────────
function initROIChart() {
  const ctxROI = document.getElementById('chartROI')?.getContext('2d');
  console.log('🔍 chartROI debug:', { found: !!ctxROI, element: !!document.getElementById('chartROI'), Chart: typeof Chart });

  if (!ctxROI) {
    console.warn('⚠️ chartROI canvas not found or context unavailable');
    return;
  }

  try {
    const roiLabels = ECO_CODICI.map(c => c.cod);
    const roiValues = ECO_CODICI.map(c => c.roi);
    const roiColors = ECO_CODICI.map(c => BRAND_COLOR[c.brand].border);
    console.log('✅ ROI data loaded:', roiLabels.length, 'codes');

    new Chart(ctxROI, {
      type: 'bar',
      data: {
        labels: roiLabels,
        datasets: [{
          label: 'ROI %',
          data: roiValues,
          backgroundColor: ECO_CODICI.map(c => BRAND_COLOR[c.brand].fill),
          borderColor: roiColors,
          borderWidth: 1.5,
          borderRadius: 3,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => `ROI: ${ctx.raw.toFixed(1)}%`,
              title: ctx => ctx[0].label
            },
            backgroundColor: 'rgba(0,0,0,.8)',
            padding: 12,
            titleColor: '#00d4ff',
            bodyColor: '#fff',
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(0,87,184,.1)' },
            ticks: { color: 'rgba(255,255,255,.6)', callback: v => v + '%' },
            title: { display: true, text: 'Return on Investment (%)', color: 'rgba(255,255,255,.6)' },
            max: 90
          },
          y: {
            grid: { display: false },
            ticks: { color: 'rgba(255,255,255,.6)', font: { size: 11 } }
          }
        }
      }
    });
    console.log('✅ ROI chart created successfully');
  } catch(e) {
    console.error('❌ Error creating ROI chart:', e.message, e);
  }
}

// Esegui quando DOM è pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initROIChart);
} else {
  initROIChart();
}

// ── BUBBLE CHART: COSTO × PREZZO × MARGINE ────────────────────
function initBubbleChart() {
  const ctxBub = document.getElementById('chartBubble')?.getContext('2d');
  if (!ctxBub) {
    console.warn('⚠️ chartBubble canvas not found');
    return;
  }

  try {
    const brands = [...new Set(ECO_CODICI.map(c => c.brand))];
    new Chart(ctxBub, {
      type: 'bubble',
      data: {
        datasets: brands.map(brand => ({
          label: brand,
          data: ECO_CODICI.filter(c => c.brand === brand).map(c => ({
            x: c.cost,
            y: c.price,
            r: Math.max(5, c.roi / 9),
            cod: c.cod,
          })),
          backgroundColor: BRAND_COLOR[brand].fill,
          borderColor: BRAND_COLOR[brand].border,
          borderWidth: 1,
        }))
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: 'rgba(255,255,255,.7)', usePointStyle: true, padding: 16 } },
        tooltip: {
          callbacks: {
            label: ctx => {
              const d = ctx.raw;
              return [` Costo: €${d.x}`, ` Prezzo: €${d.y}`, ` ROI: ~${Math.round(d.r * 9)}%`];
            }
          }
        }
      },
      scales: {
        x: { grid: { color: GRID }, ticks: { color: TICKS, callback: v => '€'+v }, title: { display: true, text: 'Costo Acquisto (€)', color: TICKS } },
        y: { grid: { color: GRID }, ticks: { color: TICKS, callback: v => '€'+v }, title: { display: true, text: 'Prezzo Vendita (€)', color: TICKS } }
      }
    }
    });
    console.log('✅ Bubble chart created successfully');
  } catch(e) {
    console.error('❌ Error creating bubble chart:', e.message);
  }
}

// Esegui quando DOM è pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBubbleChart);
} else {
  initBubbleChart();
}

// ── CMg & RMg ──────────────────────────────────────────────────
const QTY = Array.from({ length: 21 }, (_, i) => i * 10);

function initCMgChart() {
  const ctxCMg = document.getElementById('chartCMg')?.getContext('2d');
  if (!ctxCMg) {
    console.warn('⚠️ chartCMg canvas not found');
    return;
  }

  try {
    new Chart(ctxCMg, {
      type: 'line',
      data: {
        labels: QTY,
        datasets: [
          {
            label: 'CMg – Costo Marginale',
            data: QTY.map(q => +(330 + 0.36 * q).toFixed(1)),
            borderColor: '#ff4444', backgroundColor: 'transparent',
            borderWidth: 2, pointRadius: 3, tension: 0.3,
          },
          {
            label: 'RMg – Ricavo Marginale',
            data: QTY.map(q => +(606 - 0.95 * q).toFixed(1)),
            borderColor: '#00e676', backgroundColor: 'transparent',
            borderWidth: 2, pointRadius: 3, tension: 0.3,
          },
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: 'rgba(255,255,255,.7)', usePointStyle: true } },
          annotation: {},
        },
        scales: {
          x: { grid: { color: GRID }, ticks: { color: TICKS }, title: { display: true, text: 'Quantità (unità/anno)', color: TICKS } },
          y: { grid: { color: GRID }, ticks: { color: TICKS, callback: v => '€'+v }, beginAtZero: false,
               title: { display: true, text: '€/unità', color: TICKS } }
        }
      }
    });
    console.log('✅ CMg/RMg chart created successfully');
  } catch(e) {
    console.error('❌ Error creating CMg chart:', e.message);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCMgChart);
} else {
  initCMgChart();
}

// ── CURVA DOMANDA & OFFERTA ────────────────────────────────────
function initDSChart() {
  const ctxDS = document.getElementById('chartDS')?.getContext('2d');
  if (!ctxDS) {
    console.warn('⚠️ chartDS canvas not found');
    return;
  }

  try {
    new Chart(ctxDS, {
      type: 'line',
      data: {
        labels: QTY,
        datasets: [
          {
            label: 'Curva Domanda (D)',
            data: QTY.map(q => +(800 - 0.24 * q).toFixed(1)),
            borderColor: '#00d4ff', backgroundColor: 'transparent',
            borderWidth: 2, pointRadius: 3, tension: 0.2,
          },
          {
            label: 'Curva Offerta (S)',
            data: QTY.map(q => +(300 + 0.10 * q).toFixed(1)),
            borderColor: '#ff8c00', backgroundColor: 'transparent',
            borderWidth: 2, pointRadius: 3, tension: 0.2,
          },
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: 'rgba(255,255,255,.7)', usePointStyle: true } },
        },
        scales: {
          x: { grid: { color: GRID }, ticks: { color: TICKS }, title: { display: true, text: 'Quantità (unità/anno)', color: TICKS } },
          y: { grid: { color: GRID }, ticks: { color: TICKS, callback: v => '€'+v }, beginAtZero: false,
               title: { display: true, text: 'Prezzo (€)', color: TICKS } }
        }
      }
    });
    console.log('✅ D/S chart created successfully');
  } catch(e) {
    console.error('❌ Error creating D/S chart:', e.message);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDSChart);
} else {
  initDSChart();
}

// ── COMPONENTI ALTO RISCHIO USURA ─────────────────────────────
const RISCHIO_DATA = [
  { key:'usura_1', nave:'MV Maria Dolores',       motore:'MTU 4000 M73',        comp:'Filtri carburante',         cat:'Filtrazione',     status:'CRITICO', eta:20, usura:70.0, sigma:8.0,  ic:'54%–86%',  motiv:'6 motori × 20 anni – intervallo cambio ogni 500h superato' },
  { key:'usura_2', nave:'MV Maria Dolores',       motore:'MTU 4000 M73',        comp:'Filtri olio',               cat:'Filtrazione',     status:'CRITICO', eta:20, usura:70.0, sigma:8.0,  ic:'54%–86%',  motiv:'6 motori – consumo olio accelerato a questa età' },
  { key:'usura_3', nave:'MV Maria Dolores',       motore:'MTU 4000 M73',        comp:'Sensore pressione CR',      cat:'Iniezione',       status:'CRITICO', eta:20, usura:70.0, sigma:8.0,  ic:'54%–86%',  motiv:'Sistema common rail MTU 4000 – sensori serie 0281 critici' },
  { key:'usura_4', nave:'MV Maria Dolores',       motore:'MTU 4000 M73',        comp:'Filtri refrigerante',       cat:'Raffreddamento',  status:'CRITICO', eta:20, usura:70.0, sigma:8.0,  ic:'54%–86%',  motiv:'Circuito raffreddamento critico su unità ad alta potenza' },
  { key:'usura_5', nave:'MV Maria Dolores',       motore:'MTU 4000 M73',        comp:'Separatore carburante/acqua',cat:'Filtrazione',    status:'CRITICO', eta:20, usura:70.0, sigma:8.0,  ic:'54%–86%',  motiv:'Acque Med – contaminazione acqua frequente in rotta Malta' },
  { key:'usura_6', nave:'MV Maria Dolores',       motore:'MTU 4000 M73',        comp:'Alternatore marino',        cat:'Elettrico',       status:'CRITICO', eta:20, usura:60.0, sigma:8.9,  ic:'43%–77%',  motiv:'20 anni – alternatori tipicamente fine vita a questa età' },
  { key:'usura_7', nave:'MV Jean de La Valette',  motore:'MTU 8000 series',     comp:'Filtri olio',               cat:'Filtrazione',     status:'ALTO',    eta:16, usura:56.0, sigma:7.2,  ic:'42%–70%',  motiv:'4 motori × 16 anni – manutenzione intensiva ad alta velocità' },
  { key:'usura_8', nave:'MV Jean de La Valette',  motore:'MTU 8000 series',     comp:'Sensore pressione CR',      cat:'Iniezione',       status:'ALTO',    eta:16, usura:56.0, sigma:7.2,  ic:'42%–70%',  motiv:'MTU 8000 CR system – alta sollecitazione a regime' },
  { key:'usura_9', nave:'MV Jean de La Valette',  motore:'MTU 8000 series',     comp:'Filtri carburante',         cat:'Filtrazione',     status:'ALTO',    eta:16, usura:56.0, sigma:7.2,  ic:'42%–70%',  motiv:'Intervallo ridotto su regime alta velocità Pozzallo–Malta' },
  { key:'usura_10', nave:'MV Saint John Paul II',  motore:'MTU 8000 (9100kW)',   comp:'Sensore pressione CR',      cat:'Iniezione',       status:'MEDIO',   eta:7,  usura:24.5, sigma:4.8,  ic:'15%–34%',  motiv:'7 anni – prima ispezione programmata CR serie 0281' },
  { key:'usura_11', nave:'MV Saint John Paul II',  motore:'MTU 8000 (9100kW)',   comp:'Filtri carburante',         cat:'Filtrazione',     status:'MEDIO',   eta:7,  usura:24.5, sigma:4.8,  ic:'15%–34%',  motiv:'Manutenzione ordinaria – ancora in garanzia costruttore' },
  { key:'usura_12', nave:'San Frangisk',           motore:'Deutz MWM 620B V1',   comp:'Filtri carburante',         cat:'Filtrazione',     status:'CRITICO', eta:36, usura:90.0, sigma:13.2, ic:'64%–100%', motiv:'36 anni – motori meccanici Deutz MWM, ricambi urgenti' },
  { key:'usura_13', nave:'San Frangisk',           motore:'Deutz MWM 620B V1',   comp:'Filtri olio',               cat:'Filtrazione',     status:'CRITICO', eta:36, usura:90.0, sigma:13.2, ic:'64%–100%', motiv:'Usura avanzata su tutto il sistema lubrificazione' },
  { key:'usura_14', nave:'San Pawl ⚠️ ex-flotta', motore:'Deutz MWM 604B V1',   comp:'Filtri carburante',         cat:'Filtrazione',     status:'CRITICO', eta:35, usura:87.5, sigma:13.0, ic:'62%–100%', motiv:'35 anni – ceduta 2025; dati storici mantenuti per analisi' },
  { key:'usura_15', nave:'San Pawl ⚠️ ex-flotta', motore:'Deutz MWM 604B V1',   comp:'Filtri olio',               cat:'Filtrazione',     status:'CRITICO', eta:35, usura:87.5, sigma:13.0, ic:'62%–100%', motiv:'Filtri olio equivalenti Fleetguard applicabili' },
];

const statusClass = { CRITICO:'status-critico', ALTO:'status-alto', MEDIO:'status-medio' };
document.getElementById('rischioBody').innerHTML = RISCHIO_DATA.map(r => `
  <tr>
    <td><span class="incr-nave">${r.nave}</span></td>
    <td><span class="incr-cat">${r.motore}</span></td>
    <td>${r.comp}</td>
    <td><span class="incr-cat">${r.cat}</span></td>
    <td><span class="status-badge ${statusClass[r.status]}">${r.status}</span></td>
    <td class="eta-val" style="text-align:center">${r.eta}</td>
    <td class="usura-val" style="text-align:center">${r.usura.toFixed(1)}%</td>
    <td style="text-align:center;color:var(--grigio)">±${r.sigma.toFixed(1)}%</td>
    <td style="text-align:center;color:rgba(255,255,255,.6);font-size:11px">${r.ic}</td>
    <td><span class="incr-motiv">${r.motiv}</span></td>
  </tr>`).join('');

// ── CATALOGO BOSCH REALE ───────────────────────────────────────
const BOSCH_CAT = [
  { code:'0132801141', desc:'Sensore',      cat:'Elettronica', app:'Vari',              netto:15.4,  qty:50,  nav:'🔵 Adattabile' },
  { code:'0281002500', desc:'Sensore',      cat:'Elettronica', app:'Case / New-Holland',netto:63.8,  qty:200, nav:'🔵 Adattabile' },
  { code:'0414191008', desc:'Pompa',        cat:'Iniezione',   app:'Case / Iveco',       netto:68.2,  qty:30,  nav:'✅ Sì' },
  { code:'0414401105', desc:'Pompa',        cat:'Iniezione',   app:'Vari',              netto:51.7,  qty:25,  nav:'🔵 Adattabile' },
  { code:'0414401106', desc:'Pompa',        cat:'Iniezione',   app:'Vari',              netto:66.0,  qty:20,  nav:'🔵 Adattabile' },
  { code:'0414701070', desc:'Pompa UIS/PDE',cat:'Iniezione',   app:'Iveco / Irisbus',   netto:236.5, qty:12,  nav:'✅ Sì' },
  { code:'0414700027', desc:'Pompa UIS/PDE',cat:'Iniezione',   app:'Vari',              netto:187.0, qty:15,  nav:'🔵 Adattabile' },
  { code:'0445010537', desc:'Pompa CP4',    cat:'Common Rail', app:'Marine CR Bosch/MAN',netto:490.0, qty:8,  nav:'✅ Sì' },
  { code:'0445120217', desc:'Iniettore CR', cat:'Common Rail', app:'MAN B&W G-Type',    netto:310.0, qty:18,  nav:'✅ Sì' },
  { code:'0445120236', desc:'Iniettore CR', cat:'Common Rail', app:'Cummins QSL9',      netto:295.0, qty:14,  nav:'✅ Sì' },
  { code:'0445120455', desc:'Iniettore CR', cat:'Common Rail', app:'Cummins QSB 6.7',   netto:272.5, qty:16,  nav:'✅ Sì' },
  { code:'0281006064', desc:'Sensore CR',   cat:'Common Rail', app:'MTU/MAN/Cummins',   netto:120.0, qty:35,  nav:'✅ Sì' },
  { code:'0124655025', desc:'Alternatore',  cat:'Elettronica', app:'MAN / Ausiliari',   netto:155.0, qty:22,  nav:'✅ Sì' },
];

document.getElementById('boschBody').innerHTML = BOSCH_CAT.map(b => {
  const vend = +(b.netto * 2.2).toFixed(2);
  const marg = +(vend - b.netto).toFixed(2);
  return `<tr class="cat-row">
    <td><span class="cat-code">${b.cod}</span></td>
    <td class="cat-name">${b.desc}</td>
    <td><span class="cat-brand cat-brand-bosch">${b.cat}</span></td>
    <td class="cat-motors">${b.app}</td>
    <td class="cat-price">€ ${b.netto.toLocaleString('it-IT', {minimumFractionDigits:1})}</td>
    <td class="cat-price">€ ${vend.toLocaleString('it-IT', {minimumFractionDigits:2})}</td>
    <td style="color:var(--oro);font-family:var(--F);font-weight:700">€ ${marg.toLocaleString('it-IT', {minimumFractionDigits:2})}</td>
    <td style="color:#00e676;font-family:var(--F);font-weight:700">120%</td>
    <td style="text-align:center;color:var(--cyan);font-family:var(--F);font-weight:700">${b.qty}</td>
    <td style="font-size:12px">${b.nav}</td>
  </tr>`;
}).join('');

// ── GAUGE KPI ─────────────────────────────────────────────────
function makeGauge(id, pct, color) {
  const ctx = document.getElementById(id)?.getContext('2d');
  if (!ctx) return;
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [pct, 100 - pct],
        backgroundColor: [color, 'rgba(255,255,255,.05)'],
        borderWidth: 0,
        borderRadius: 4,
      }]
    },
    options: {
      rotation: -90,
      circumference: 180,
      cutout: '76%',
      responsive: true,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
    }
  });
}
makeGauge('gaugeFatturato', 73, '#00d4ff');
makeGauge('gaugeTarget',    72, '#c9a84c');
makeGauge('gaugeProd',      76, '#00e676');

// ── TREND AVANZATO ────────────────────────────────────────────
const ctxTR = document.getElementById('chartTrend')?.getContext('2d');
if (ctxTR) {
  const anni   = ['2019','2020','2021','2022','2023','2024','2025','2026','2027'];
  const fatBars = [5.98, 5.73, 6.85, 7.23, 8.35, 9.98, 14.6, 18.0, 21.0];
  const barColors = [
    '#2a3f6f','#2a3f6f','#2a3f6f','#2a3f6f','#2a3f6f',
    '#00b4d8','#00b4d8',
    '#ff8c00','#ff8c00',
  ];
  const estero   = [0.30, 0.25, 0.40, 0.60, 0.90, 1.10, 2.00, 3.00, 4.00];
  const dipend   = [25, 24, 26, 27, 30, 32, 35, 40, 45];
  new Chart(ctxTR, {
    type: 'bar',
    data: {
      labels: anni,
      datasets: [
        {
          label: 'Fatturato Totale (€M)',
          data: fatBars,
          backgroundColor: barColors,
          borderRadius: 3,
          order: 2,
        },
        {
          label: 'Fatturato Estero (€M)',
          data: estero,
          type: 'line',
          borderColor: '#ff4444',
          borderDash: [6, 3],
          borderWidth: 2,
          pointBackgroundColor: '#ff4444',
          pointRadius: 4,
          fill: false,
          tension: 0.3,
          yAxisID: 'y',
          order: 1,
        },
        {
          label: 'Dipendenti',
          data: dipend,
          type: 'line',
          borderColor: '#00e676',
          borderWidth: 2,
          pointBackgroundColor: '#00e676',
          pointRadius: 4,
          fill: false,
          tension: 0.3,
          yAxisID: 'y2',
          order: 0,
        },
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: { color: 'rgba(255,255,255,.7)', usePointStyle: true, padding: 20, font: { size: 12 } }
        },
        tooltip: {
          callbacks: {
            label: ctx => {
              if (ctx.dataset.label === 'Dipendenti') return ' ' + ctx.raw + ' dipendenti';
              return ' €' + ctx.raw + 'M';
            }
          }
        }
      },
      scales: {
        x: { grid: { color: GRID }, ticks: { color: TICKS } },
        y: {
          grid: { color: GRID },
          ticks: { color: TICKS, callback: v => '€' + v + 'M' },
          beginAtZero: true,
          title: { display: true, text: 'Fatturato (€)', color: TICKS, font: { size: 10 } },
        },
        y2: {
          position: 'right',
          grid: { drawOnChartArea: false },
          ticks: { color: '#00e676', callback: v => v + ' dip.' },
          title: { display: true, text: 'N° Dipendenti', color: '#00e676', font: { size: 10 } },
          beginAtZero: false,
        }
      }
    }
  });
}

// ── INCROCIO FLOTTA × CODICI ──────────────────────────────────
const INCROCIO = [
  { key:'incr_1', nave:'MV Maria Dolores',      code:'0 281 006 064', comp:'Sensore Pressione CR Bosch',        cat:'Iniezione – Sensore',       motiv:'MTU 4000 M73 usa sistema CR con sensori Bosch 0281 serie',               status:'ALTO',  rnote:'19 anni, 6 motori CR' },
  { key:'incr_2', nave:'MV Jean de La Valette', code:'0 281 006 064', comp:'Sensore Pressione CR Bosch',        cat:'Iniezione – Sensore',       motiv:'MTU 8000 usa sistema CR con sensori Bosch 0281 serie',                   status:'MEDIO', rnote:'15 anni, alta potenza' },
  { key:'incr_3', nave:'MV Saint John Paul II', code:'0 281 006 064', comp:'Sensore Pressione CR Bosch',        cat:'Iniezione – Sensore',       motiv:'MTU 8000 (9100 kW) usa sistema CR con sensori Bosch 0281',               status:'BASSO', rnote:'6 anni' },
  { key:'incr_4', nave:'MV Maria Dolores',      code:'FF5488',        comp:'Filtro Carburante Fleetguard Marine',cat:'Filtrazione',               motiv:'MTU 4000 M73 approvato Fleetguard FF5488 come filtro equivalente',       status:'ALTO',  rnote:'ricambio periodico 6 motori' },
  { key:'incr_5', nave:'MV Jean de La Valette', code:'FF5488',        comp:'Filtro Carburante Fleetguard Marine',cat:'Filtrazione',               motiv:'MTU 8000 compatibile Fleetguard fuel filter equivalente',                 status:'MEDIO', rnote:'4 motori, alta ciclicità' },
  { key:'incr_6', nave:'MV Saint John Paul II', code:'FF5488',        comp:'Filtro Carburante Fleetguard Marine',cat:'Filtrazione',               motiv:'MTU 8000 compatibile Fleetguard fuel filter equivalente',                 status:'BASSO', rnote:'nave giovane' },
  { key:'incr_7', nave:'MV Maria Dolores',      code:'LF9009',        comp:'Filtro Olio Fleetguard QSL',        cat:'Filtrazione',               motiv:'MTU 4000 M73 approvato filtri olio Fleetguard equivalenti',              status:'ALTO',  rnote:'6 motori, 19 anni' },
  { key:'incr_8', nave:'MV Jean de La Valette', code:'LF9009',        comp:'Filtro Olio Fleetguard QSL',        cat:'Filtrazione',               motiv:'MTU 8000 series approvato filtri olio Fleetguard equivalenti',            status:'MEDIO', rnote:'4 motori, 15 anni' },
  { key:'incr_9', nave:'MV Maria Dolores',      code:'3967726',       comp:'Filtro Aria Fleetguard Marine',     cat:'Filtrazione',               motiv:'MTU 4000 M73 filtro aria equivalente Fleetguard certificato',             status:'ALTO',  rnote:'6 motori, alta usura' },
  { key:'incr_10', nave:'MV Jean de La Valette', code:'3967726',       comp:'Filtro Aria Fleetguard Marine',     cat:'Filtrazione',               motiv:'MTU 8000 filtro aria Fleetguard equivalente approvato',                   status:'MEDIO', rnote:'4 motori, 15 anni' },
  { key:'incr_11', nave:'MV Saint John Paul II', code:'3967726',       comp:'Filtro Aria Fleetguard Marine',     cat:'Filtrazione',               motiv:'MTU 8000 9100kW filtro aria Fleetguard equivalente approvato',            status:'BASSO', rnote:'6 anni, bassa usura' },
  { key:'incr_12', nave:'MV Maria Dolores',      code:'FS1000',        comp:'Separatore Acqua Fleetguard',       cat:'Filtrazione',               motiv:'Sistema fuel/water separator marino compatibile MTU 4000',                status:'ALTO',  rnote:'19 anni, 6 motori' },
  { key:'incr_13', nave:'HSC Gozo Express',      code:'FS1000',        comp:'Separatore Acqua Fleetguard',       cat:'Filtrazione',               motiv:'MTU 4000 HSC versione nautica compatibile Fleetguard FS1000',             status:'MEDIO', rnote:'12 anni, Fast Ferry' },
  { key:'incr_14', nave:'MV Maria Dolores',      code:'WF2073',        comp:'Filtro Acqua Fleetguard',           cat:'Filtrazione',               motiv:'Cooling system water filter compatibile MTU 4000 M73',                    status:'ALTO',  rnote:'età critica, 6 motori' },
  { key:'incr_15', nave:'HSC Gozo Express',      code:'WF2073',        comp:'Filtro Acqua Fleetguard',           cat:'Filtrazione',               motiv:'Cooling system water filter MTU 4000 HSC approvato',                      status:'MEDIO', rnote:'12 anni' },
  { key:'incr_16', nave:'MV Maria Dolores',      code:'0 124 655 025', comp:'Alternatore Bosch 24V 120A',        cat:'Elettrico – Alternatore',   motiv:'Alternatore ausiliario 24V marino – MTU 4000 serie',                     status:'ALTO',  rnote:'età critica' },
  { key:'incr_17', nave:'ACC San Frangisk',      code:'0 124 655 025', comp:'Alternatore Bosch 24V 120A',        cat:'Elettrico – Alternatore',   motiv:'Deutz MWM – alternatore 24V marino compatibile',                         status:'ALTO',  rnote:'35 anni' },
  { key:'incr_18', nave:'ACC San Pawl',          code:'0 124 655 025', comp:'Alternatore Bosch 24V 120A',        cat:'Elettrico – Alternatore',   motiv:'Deutz MWM – alternatore 24V marino compatibile',                         status:'ALTO',  rnote:'34 anni' },
];

function showIncrocio(filter) {
  document.querySelectorAll('#incrocio .tab').forEach((t, i) => {
    t.classList.toggle('active', (filter === 'all' && i === 0) || (filter === 'alto' && i === 1));
  });
  const rows = filter === 'alto' ? INCROCIO.filter(r => r.rischio === 'ALTO') : INCROCIO;
  const riskClass = { ALTO:'risk-alto', MEDIO:'risk-medio', BASSO:'risk-basso' };
  const riskIcon  = { ALTO:'🔴', MEDIO:'🟡', BASSO:'🟢' };
  document.getElementById('incrocioBody').innerHTML = rows.map(r => `
    <tr>
      <td><span class="incr-nave">${r.nave}</span></td>
      <td><span class="incr-cod">${r.cod}</span></td>
      <td>${r.ric}</td>
      <td><span class="incr-cat">${r.cat}</span></td>
      <td><span class="incr-motiv">${r.motiv}</span></td>
      <td><span class="risk-badge ${riskClass[r.rischio]}">${riskIcon[r.rischio]} ${r.rischio} – ${r.rnote}</span></td>
    </tr>`).join('');
}
showIncrocio('all');

// ── STIMA FATTURATO POTENZIALE ────────────────────────────────
const ctxPOT = document.getElementById('chartPotenziale')?.getContext('2d');
if (ctxPOT) {
  const pot = [
    { cod: 'FF5488',        val: 4000 },
    { cod: 'LF9009',        val: 2500 },
    { cod: '3967726',       val: 2300 },
    { cod: '0 281 006 064', val: 1435 },
    { cod: 'FS1000',        val: 1300 },
    { cod: '0 124 655 025', val: 1200 },
    { cod: 'WF2073',        val: 800  },
  ];
  new Chart(ctxPOT, {
    type: 'bar',
    data: {
      labels: pot.map(p => p.cod),
      datasets: [{
        data: pot.map(p => p.val),
        backgroundColor: [
          'rgba(255,140,0,.8)', 'rgba(0,180,50,.7)', 'rgba(0,180,50,.6)',
          'rgba(255,80,80,.7)', 'rgba(255,80,80,.6)',
          'rgba(0,180,216,.7)', 'rgba(0,87,184,.6)',
        ],
        borderRadius: 3,
        borderWidth: 0,
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ' €' + ctx.raw.toLocaleString('it-IT') + '/anno' } }
      },
      scales: {
        x: {
          grid: { color: GRID },
          ticks: { color: TICKS, callback: v => '€' + v },
          beginAtZero: true,
          max: 5000,
        },
        y: { grid: { color: 'transparent' }, ticks: { color: TICKS, font: { size: 11 } } }
      }
    }
  });
}

// ── TABELLA RISCHIO USURA ────────────────────────────────────
const RISCHIO = [
  { nave: 'MV Maria Dolores',      motore: 'MTU 4000 M73', comp: 'Filtri carburante',     cat: 'Filtrazione',      status: 'CRITICO', eta: 20, usura: 70, sigma: 8.0, ic: '54%-86%', motiv: '6 motori × 20 anni – intervallo cambio ogni 6 mesi' },
  { nave: 'MV Maria Dolores',      motore: 'MTU 4000 M73', comp: 'Filtri olio',           cat: 'Filtrazione',      status: 'CRITICO', eta: 20, usura: 70, sigma: 8.0, ic: '54%-86%', motiv: '6 motori – consumo olio accelerato a quest...' },
  { nave: 'MV Maria Dolores',      motore: 'MTU 4000 M73', comp: 'Sensore pressione CR',  cat: 'Iniezione',        status: 'CRITICO', eta: 20, usura: 70, sigma: 8.0, ic: '54%-86%', motiv: 'Sistema common rail MTU 4000 – sensori se...' },
  { nave: 'MV Maria Dolores',      motore: 'MTU 4000 M73', comp: 'Filtri refrigerante',  cat: 'Raffreddamento',   status: 'CRITICO', eta: 20, usura: 70, sigma: 8.0, ic: '54%-86%', motiv: 'Circuito raffreddamento critico su unità ad...' },
  { nave: 'MV Maria Dolores',      motore: 'MTU 4000 M73', comp: 'Separatore carb/acqua', cat: 'Filtrazione',      status: 'CRITICO', eta: 20, usura: 70, sigma: 8.0, ic: '54%-86%', motiv: 'Acque Med – contaminazione acqua freque...' },
  { nave: 'MV Maria Dolores',      motore: 'MTU 4000 M73', comp: 'Ausiliari 24V',         cat: 'Alternatore',      status: 'CRITICO', eta: 20, usura: 60, sigma: 8.9, ic: '43%-77%', motiv: '20 anni – alternatori tipicamente fine vita a...' },
  { nave: 'MV Jean de La Valette', motore: 'MTU 8000 series', comp: 'Filtri olio',       cat: 'Filtrazione',      status: 'ALTO',    eta: 16, usura: 56, sigma: 7.2, ic: '42%-70%', motiv: '4 motori × 16 anni – manutenzione intensiv...' },
  { nave: 'MV Jean de La Valette', motore: 'MTU 8000 series', comp: 'Sensore pressione CR', cat: 'Iniezione',      status: 'ALTO',    eta: 16, usura: 56, sigma: 7.2, ic: '42%-70%', motiv: 'MTU 8000 CR system – alta sollecitazione a...' },
  { nave: 'MV Jean de La Valette', motore: 'MTU 8000 series', comp: 'Filtri carburante',  cat: 'Filtrazione',      status: 'ALTO',    eta: 16, usura: 56, sigma: 7.2, ic: '42%-70%', motiv: 'Intervallo ridotto su regime alta velocità' },
  { nave: 'MV Saint John Paul II', motore: 'MTU 8000 (9100kW)', comp: 'Sensore pressione CR', cat: 'Iniezione', status: 'MEDIO',   eta: 7,  usura: 24.5, sigma: 4.8, ic: '15%-34%', motiv: '7 anni – prima ispezione programmata CR s...' },
  { nave: 'MV Saint John Paul II', motore: 'MTU 8000 (9100kW)', comp: 'Filtri carburante', cat: 'Filtrazione',      status: 'MEDIO',   eta: 7,  usura: 24.5, sigma: 4.8, ic: '15%-34%', motiv: 'Manutenzione ordinaria – ancora in garanz...' },
  { nave: 'San Frangisk',          motore: 'Deutz MWM 620B V1', comp: 'Filtri carburante', cat: 'Filtrazione',    status: 'CRITICO', eta: 36, usura: 90, sigma: 13.2, ic: '64%-100%', motiv: '36 anni – motori meccanici Deutz MWM, ric...' },
  { nave: 'San Frangisk',          motore: 'Deutz MWM 620B V1', comp: 'Filtri olio',       cat: 'Filtrazione',    status: 'CRITICO', eta: 36, usura: 90, sigma: 13.2, ic: '64%-100%', motiv: 'Usura avanzata su tutto il sistema lubrificaz...' },
  { nave: 'San Pawl ⚠️',           motore: 'Deutz MWM 604B V1', comp: 'Filtri carburante', cat: 'Filtrazione',    status: 'CRITICO', eta: 35, usura: 87.5, sigma: 13.0, ic: '62%-100%', motiv: '35 anni – ceduta 2025; dati storici mantenut...' },
  { nave: 'San Pawl ⚠️',           motore: 'Deutz MWM 604B V1', comp: 'Filtri olio',       cat: 'Filtrazione',    status: 'CRITICO', eta: 35, usura: 87.5, sigma: 13.0, ic: '62%-100%', motiv: 'Filtri olio equivalenti Fleetguard applicabili...' },
];

document.getElementById('rischioBody').innerHTML = RISCHIO.map(r => `
  <tr>
    <td><span class="incr-nave">${r.nave}</span></td>
    <td><span style="font-size:11px;color:var(--grigio)">${r.motore}</span></td>
    <td>${r.comp}</td>
    <td><span class="incr-cat">${r.cat}</span></td>
    <td><span class="status-badge status-${r.status.toLowerCase()}">${r.status}</span></td>
    <td><span class="eta-val">${r.eta}</span></td>
    <td><span class="usura-val">${r.usura.toFixed(1)}%</span></td>
    <td>±${r.sigma.toFixed(1)}%</td>
    <td><span style="color:var(--grigio);font-size:10px">${r.ic}</span></td>
    <td><span class="incr-motiv">${r.motiv}</span></td>
  </tr>
`).join('');

// ── AIS LIVE MAP ──────────────────────────────────────────────
const AIS_KEY = 'd343fc3bc4218e9d7759faea743dd23b1b3073ed';
const MMSI_VIRTU = {
  229524000: 'MV Saint John Paul II',
  229500000: 'MV Jean de La Valette',
  229497000: 'MV Maria Dolores',
  229001000: 'San Frangisk',
  229460000: 'HSC Gozo Express',
};
const MMSI_TUG = {
  229440000: 'MT Vittoriosa',
  229442000: 'MT St. Angelo',
  229444000: 'MT Senglea',
  229446000: 'Med Aldebaran',
  229448000: 'MT St. Elmo',
  229450000: 'MT Spinola',
  229452000: 'MT Wenzina',
  229454000: 'MT Pawlina',
  229456000: 'Sea Salvor',
  229468000: 'Gozzo',
};
const ALL_MMSI = [...Object.keys(MMSI_VIRTU), ...Object.keys(MMSI_TUG)].map(Number);

let aisMap = null, aisSocket = null;
const aisMarkers = {};
let aisDataReceived = false;
let aisTimeoutId = null;

// DEMO MODE: Posizioni simulate per le navi (Mediterraneo centrale)
const DEMO_SHIPS = [
  // VIRTU FERRIES (rotta Malta-Italia)
  { mmsi: 229524000, name: 'MV Saint John Paul II', lat: 36.2, lon: 15.5, sog: '38.2', cog: '355', isVirtu: true },
  { mmsi: 229500000, name: 'MV Jean de La Valette', lat: 36.8, lon: 14.2, sog: '36.5', cog: '220', isVirtu: true },
  { mmsi: 229497000, name: 'MV Maria Dolores', lat: 35.9, lon: 15.8, sog: '35.8', cog: '110', isVirtu: true },
  { mmsi: 229460000, name: 'HSC Gozo Express', lat: 36.0, lon: 14.5, sog: '34.2', cog: '180', isVirtu: true },

  // TUG MALTA (rotte portuali Malta-Sicilia)
  { mmsi: 229440000, name: 'MT Vittoriosa', lat: 36.05, lon: 13.9, sog: '12.5', cog: '45', isVirtu: false },
  { mmsi: 229442000, name: 'MT St. Angelo', lat: 35.87, lon: 14.65, sog: '14.0', cog: '90', isVirtu: false },
  { mmsi: 229444000, name: 'MT Senglea', lat: 36.15, lon: 14.1, sog: '11.8', cog: '270', isVirtu: false },
  { mmsi: 229446000, name: 'Med Aldebaran', lat: 36.02, lon: 14.85, sog: '13.2', cog: '135', isVirtu: false },
  { mmsi: 229448000, name: 'MT St. Elmo', lat: 35.95, lon: 14.35, sog: '15.0', cog: '225', isVirtu: false },
];

function makeAisIcon(isVirtu) {
  return L.divIcon({
    className: '',
    html: `<div class="ais-marker-${isVirtu ? 'virtu' : 'tug'}">🚢</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
}

function initAISMap() {
  if (aisMap) return;
  aisMap = L.map('aisMap', { zoomControl: true, attributionControl: false })
    .setView([35.9, 14.5], 7);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    subdomains: 'abcd',
  }).addTo(aisMap);
  connectAIS();
}

function loadDemoMode() {
  const dot    = document.getElementById('aisDot');
  const status = document.getElementById('aisStatus');
  const count  = document.getElementById('aisCount');

  dot.className = 'ais-dot ais-dot-demo';
  status.textContent = '📡 Demo Mode · Posizioni simulate';

  DEMO_SHIPS.forEach(ship => {
    const popHtml = `<div class="ais-popup"><strong>${ship.name}</strong><br>SOG: ${ship.sog} kn · COG: ${ship.cog}°<br><span class="ais-mmsi">MMSI: ${ship.mmsi}</span></div>`;

    aisMarkers[ship.mmsi] = L.marker([ship.lat, ship.lon], { icon: makeAisIcon(ship.isVirtu) })
      .bindPopup(popHtml)
      .addTo(aisMap);
  });

  count.textContent = `${DEMO_SHIPS.length} navi tracciate (demo)`;
}

function connectAIS() {
  const dot    = document.getElementById('aisDot');
  const status = document.getElementById('aisStatus');
  const count  = document.getElementById('aisCount');

  if (aisSocket) { try { aisSocket.close(); } catch(e) {} }

  // Timeout di 10 secondi - se non arrivano dati, carica demo mode
  if (aisTimeoutId) clearTimeout(aisTimeoutId);
  aisTimeoutId = setTimeout(() => {
    if (!aisDataReceived) {
      console.warn('AIS timeout - caricamento demo mode');
      loadDemoMode();
    }
  }, 10000);

  aisSocket = new WebSocket('wss://stream.aisstream.io/v0/stream');

  aisSocket.onopen = () => {
    dot.className = 'ais-dot ais-dot-conn';
    status.textContent = 'Connesso · in ascolto posizioni...';
    aisSocket.send(JSON.stringify({
      APIKey: AIS_KEY,
      BoundingBoxes: [[[30, 5], [46, 36]]],
      FilterMessageTypes: ['PositionReport'],
      MMSI: ALL_MMSI,
    }));
  };

  aisSocket.onmessage = evt => {
    try {
      aisDataReceived = true;
      if (aisTimeoutId) clearTimeout(aisTimeoutId);

      const msg  = JSON.parse(evt.data);
      const mmsi = msg.MetaData?.MMSI;
      const lat  = msg.MetaData?.latitude;
      const lon  = msg.MetaData?.longitude;
      if (!mmsi || lat == null || lon == null) return;

      const isVirtu = mmsi in MMSI_VIRTU;
      const name    = MMSI_VIRTU[mmsi] || MMSI_TUG[mmsi] || `MMSI ${mmsi}`;
      const sog     = msg.Message?.PositionReport?.Sog?.toFixed(1) ?? '—';
      const cog     = msg.Message?.PositionReport?.Cog?.toFixed(0) ?? '—';
      const popHtml = `<div class="ais-popup"><strong>${name}</strong><br>SOG: ${sog} kn · COG: ${cog}°<br><span class="ais-mmsi">MMSI: ${mmsi}</span></div>`;

      if (aisMarkers[mmsi]) {
        aisMarkers[mmsi].setLatLng([lat, lon]);
        aisMarkers[mmsi].getPopup()?.setContent(popHtml);
      } else {
        aisMarkers[mmsi] = L.marker([lat, lon], { icon: makeAisIcon(isVirtu) })
          .bindPopup(popHtml)
          .addTo(aisMap);
      }

      const n = Object.keys(aisMarkers).length;
      count.textContent = `${n} nav${n === 1 ? 'e' : 'i'} tracciat${n === 1 ? 'a' : 'e'} (AIS Live)`;
    } catch(e) {}
  };

  aisSocket.onerror = () => {
    dot.className = 'ais-dot ais-dot-err';
    status.textContent = 'Errore connessione AIS';
  };

  aisSocket.onclose = () => {
    dot.className = 'ais-dot';
    status.textContent = 'Disconnesso · riconnessione in 15s...';
    setTimeout(connectAIS, 15000);
  };
}

(function() {
  const mapEl = document.getElementById('aisMap');
  if (!mapEl) return;
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { initAISMap(); obs.disconnect(); }
  }, { threshold: 0.1 });
  obs.observe(mapEl);
})();

// 4 — USURA TUG MALTA ─────────────────────────────────────────
const ctxT = document.getElementById('chartTug')?.getContext('2d');
if (ctxT) {
  const tug = [
    { n: 'MT Med Aldebaran', w: 6  }, { n: 'MT Hondoq',    w: 16 },
    { n: 'MT Xlendi',        w: 18 }, { n: 'MT Senglea',   w: 19 },
    { n: 'MT Gozzo',         w: 21 }, { n: 'MT Vittoriosa',w: 25 },
    { n: 'MT St. Angelo',    w: 29 }, { n: 'MT Spinola',   w: 34 },
    { n: 'MT Comino',        w: 35 }, { n: 'MT Valletta',  w: 45 },
    { n: 'MT St. Elmo',      w: 48 }, { n: 'MT Wenzina',   w: 64 },
    { n: 'MT Pawlina',       w: 64 }, { n: 'MT Sea Salvor',w: 90 },
  ];
  new Chart(ctxT, {
    type: 'bar',
    data: {
      labels: tug.map(d => d.n),
      datasets: [{
        data: tug.map(d => d.w),
        backgroundColor: tug.map(d => wearColor(d.w)),
        borderColor: tug.map(d => wearBorder(d.w)),
        borderWidth: 1, borderRadius: 3,
      }]
    },
    options: {
      indexAxis: 'y', responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ' ' + ctx.raw + '% usura' } }
      },
      scales: {
        x: { grid: { color: GRID }, ticks: { color: TICKS, callback: v => v + '%' }, max: 100 },
        y: { grid: { color: 'transparent' }, ticks: { color: TICKS, font: { size: 10 } } }
      }
    }
  });
}

// ══════════════════════════════════════════════════════════════════════════════════════
// ── POPUP SYSTEM (nunzio-only) ──────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════════════

// Permission check for popups
function checkPopupAccess() {
  const user = sessionStorage.getItem('rcs_user');
  if (user !== 'nunzio') {
    showNotification('⛔ Solo nunzio può visualizzare i dettagli');
    return false;
  }
  return true;
}

// Main popup opener
function openDetailModal(type, key) {
  if (!checkPopupAccess()) return;

  const modal = document.getElementById('detailsModal');
  const content = document.getElementById('modalContent');

  let html = '';

  switch(type) {
    case 'mercato':
      html = buildMercatoPopup(key);
      break;
    case 'codice':
      html = buildCodicePopup(key);
      break;
    case 'catalogo':
      html = buildCatalogoPopup(key);
      break;
    case 'incrocio':
      html = buildIncrocioPopup(key);
      break;
    case 'usura':
      html = buildUsuraPopup(key);
      break;
    case 'roadmap':
      html = buildRoadmapPopup(key);
      break;
    default:
      return;
  }

  content.innerHTML = html;
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';

  // ESC key to close
  document.addEventListener('keydown', handleEscKey);
}

function closeDetailModal() {
  const modal = document.getElementById('detailsModal');
  modal.classList.remove('show');
  document.body.style.overflow = 'auto';
  document.removeEventListener('keydown', handleEscKey);
}

function handleEscKey(e) {
  if (e.key === 'Escape') closeDetailModal();
}

// ── MERCATO POPUP ───────────────────────────────────────────────────────────────────
const MERCATI_DATA = {
  malta: {
    nome: 'Malta · Priorità 1',
    flag: '🇲🇹',
    tipo: 'Malta-Based & Malta-Flag',
    priority: 1,
    score: 99,
    aziende: ['Tug Malta Ltd.', 'Virtu Ferries', 'MSC', 'Grimaldi Lines', 'V.Ships'],
    export: '€2,0M',
    target2027: '€4,0M',
    markup: '+35%',
    strategia: 'Penetrazione immediata tramite Virtu Ferries (client privilegiato) e Tug Malta per tug services. Focus su MV Maria Dolores overhaul (Aug-Oct 2026) come proof-of-concept.'
  },
  italia: {
    nome: 'Italia · Transito Malta',
    flag: '🇮🇹',
    tipo: 'Compagnie italiane in transito',
    priority: 2,
    score: 94,
    aziende: ['GNV', 'Tirrenia / Moby', 'Caronte & Tourist', 'Liberty Lines', 'SNAV'],
    rotta: 'Sicilia–Malta',
    potenziale: '€300K Q3 2025',
    navi: '15–35 navi per compagnia',
    strategia: 'Leverage Malta come hub di transito. Target ferry di prossimità (Sicilia-Malta, Tirrenia routes) con manutenzione rapida e delivery <12h.'
  },
  australia: {
    nome: 'Australia · Oceania',
    flag: '🇦🇺',
    tipo: 'Fleet AUS-Based & Mining',
    priority: 3,
    score: 98,
    aziende: ['BHP Fleet', 'Rio Tinto Marine', 'FMG', 'Svitzer Australia', 'TT-Line'],
    markup: '+55%',
    potenziale: '€400K anno 1',
    hub: 'Port Hedland',
    strategia: 'Espansione secondaria (fase 2027-2028). Mining support vessels e bulk carriers con margini elevati. Shipping time non critico.'
  },
  internazionale: {
    nome: 'Internazionale · Hub Malta',
    flag: '🌍',
    tipo: 'Transito Malta Freeport',
    priority: 4,
    score: 98,
    aziende: ['Maersk Line', 'CMA CGM', 'Hapag-Lloyd', 'Evergreen', 'ZIM'],
    modello: 'Hub & Spoke via Malta',
    markup: '+40-50%',
    potenziale: 'Infinito (global)',
    strategia: 'Hub internazionale per container carriers globali. Manutenzione preventiva a Malta con supply chain globale.'
  }
};

function buildMercatoPopup(key) {
  const m = MERCATI_DATA[key];
  if (!m) return '<h2>Mercato non trovato</h2>';

  return `
    <h2 style="font-size:22px; color:#00d4ff; margin-bottom:18px; letter-spacing:1px;">
      ${m.flag} ${m.nome}
    </h2>

    <div class="nave-details">
      <div class="detail-group">
        <span class="detail-label">TIPO MERCATO:</span>
        <span class="detail-value">${m.tipo}</span>
      </div>
      <div class="detail-group">
        <span class="detail-label">PRIORITY SCORE:</span>
        <span class="detail-value">${m.score}/100</span>
      </div>

      <div style="margin-top:20px; padding-top:20px; border-top:1px solid rgba(0,87,184,.2);">
        <h3 style="color:#00d4ff; font-size:13px; margin-bottom:10px; letter-spacing:1px;">AZIENDE PRINCIPALI</h3>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
          ${m.aziende.map(a => `<div style="background:rgba(0,87,184,.15); padding:8px; border-radius:4px; font-size:12px;">${a}</div>`).join('')}
        </div>
      </div>

      <div style="margin-top:20px; padding-top:20px; border-top:1px solid rgba(0,87,184,.2);">
        <h3 style="color:#00d4ff; font-size:13px; margin-bottom:10px; letter-spacing:1px;">KPI</h3>
        ${key === 'malta' ? `
          <div style="font-size:12px; line-height:1.8; color:rgba(255,255,255,.85);">
            <div><strong>Export Attuale:</strong> ${m.export}</div>
            <div><strong>Target 2027:</strong> ${m.target2027}</div>
            <div><strong>Markup Medio:</strong> ${m.markup}</div>
          </div>
        ` : key === 'italia' ? `
          <div style="font-size:12px; line-height:1.8; color:rgba(255,255,255,.85);">
            <div><strong>Rotta Principale:</strong> ${m.rotta}</div>
            <div><strong>Potenziale Q3 2025:</strong> ${m.potenziale}</div>
            <div><strong>Navi per Compagnia:</strong> ${m.navi}</div>
          </div>
        ` : key === 'australia' ? `
          <div style="font-size:12px; line-height:1.8; color:rgba(255,255,255,.85);">
            <div><strong>Markup Medio:</strong> ${m.markup}</div>
            <div><strong>Potenziale Anno 1:</strong> ${m.potenziale}</div>
            <div><strong>Hub Principale:</strong> ${m.hub}</div>
          </div>
        ` : `
          <div style="font-size:12px; line-height:1.8; color:rgba(255,255,255,.85);">
            <div><strong>Modello:</strong> ${m.modello}</div>
            <div><strong>Markup:</strong> ${m.markup}</div>
            <div><strong>Potenziale:</strong> ${m.potenziale}</div>
          </div>
        `}
      </div>

      <div style="margin-top:20px; padding-top:20px; border-top:1px solid rgba(0,87,184,.2);">
        <h3 style="color:#00d4ff; font-size:13px; margin-bottom:10px; letter-spacing:1px;">STRATEGIA</h3>
        <p style="font-size:12px; line-height:1.7; color:rgba(255,255,255,.8);">${m.strategia}</p>
      </div>
    </div>
  `;
}

// ── CODICE POPUP ────────────────────────────────────────────────────────────────────
function buildCodicePopup(codiceKey) {
  const codice = ECO_CODICI.find(c => c.cod === codiceKey);
  if (!codice) return '<h2>Codice non trovato</h2>';

  const margin = codice.price - codice.cost;
  const marginPct = ((margin / codice.cost) * 100).toFixed(1);

  return `
    <h2 style="font-size:22px; color:#00d4ff; margin-bottom:18px; letter-spacing:1px;">
      🔧 ${codice.cod}
    </h2>

    <div class="nave-details">
      <div class="detail-group">
        <span class="detail-label">BRAND:</span>
        <span class="detail-value">${codice.brand}</span>
      </div>
      <div class="detail-group">
        <span class="detail-label">ROI:</span>
        <span class="detail-value" style="color:#00e676; font-weight:700;">${codice.roi}%</span>
      </div>
      <div class="detail-group">
        <span class="detail-label">PREZZO VENDITA:</span>
        <span class="detail-value">€${codice.price}</span>
      </div>
      <div class="detail-group">
        <span class="detail-label">COSTO ACQUISTO:</span>
        <span class="detail-value">€${codice.cost}</span>
      </div>
      <div class="detail-group">
        <span class="detail-label">MARGINE UNITARIO:</span>
        <span class="detail-value" style="color:#ffc107;">€${margin} (${marginPct}%)</span>
      </div>
      <div class="detail-group">
        <span class="detail-label">CATEGORIA:</span>
        <span class="detail-value">Componente marino</span>
      </div>

      <div style="margin-top:20px; padding-top:20px; border-top:1px solid rgba(0,87,184,.2);">
        <h3 style="color:#00d4ff; font-size:13px; margin-bottom:10px; letter-spacing:1px;">ANALISI FINANZIARIA</h3>
        <table class="modal-table">
          <tr>
            <td>Margine Lordo</td>
            <td style="text-align:right; color:#00e676; font-weight:700;">€${margin}</td>
          </tr>
          <tr>
            <td>Markup %</td>
            <td style="text-align:right; font-weight:700;">${marginPct}%</td>
          </tr>
          <tr>
            <td>ROS (Margine/Prezzo)</td>
            <td style="text-align:right;">${((margin / codice.price) * 100).toFixed(1)}%</td>
          </tr>
          <tr>
            <td>ROI (Margine/Costo)</td>
            <td style="text-align:right; color:#ffc107; font-weight:700;">${codice.roi}%</td>
          </tr>
        </table>
      </div>
    </div>
  `;
}

// ── CATALOGO POPUP ──────────────────────────────────────────────────────────────────
function buildCatalogoPopup(catalogoKey) {
  const parte = CATALOG.find(c => c.code === catalogoKey);
  if (!parte) return '<h2>Parte non trovata</h2>';

  return `
    <h2 style="font-size:22px; color:#00d4ff; margin-bottom:18px; letter-spacing:1px;">
      📦 ${parte.code}
    </h2>
    <p style="font-size:13px; color:rgba(255,255,255,.7); margin-bottom:18px;">${parte.name}</p>

    <div class="nave-details">
      <div class="detail-group">
        <span class="detail-label">BRAND:</span>
        <span class="detail-value">${parte.brand}</span>
      </div>
      <div class="detail-group">
        <span class="detail-label">CATEGORIA:</span>
        <span class="detail-value">${parte.category}</span>
      </div>
      <div class="detail-group">
        <span class="detail-label">PREZZO:</span>
        <span class="detail-value">€${parte.price}</span>
      </div>
      <div class="detail-group">
        <span class="detail-label">DISPONIBILITÀ:</span>
        <span class="detail-value"><span class="badge ${parte.stock === 'Stock' ? 'stock' : 'order'}">${parte.stock}</span></span>
      </div>

      <div style="margin-top:20px; padding-top:20px; border-top:1px solid rgba(0,87,184,.2);">
        <h3 style="color:#00d4ff; font-size:13px; margin-bottom:10px; letter-spacing:1px;">MOTORI APPLICABILI</h3>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
          ${parte.motors.split(',').map(m => `<div style="background:rgba(0,87,184,.15); padding:8px; border-radius:4px; font-size:11px;">${m.trim()}</div>`).join('')}
        </div>
      </div>

      <div style="margin-top:20px; padding-top:20px; border-top:1px solid rgba(0,87,184,.2);">
        <h3 style="color:#00d4ff; font-size:13px; margin-bottom:10px; letter-spacing:1px;">APPLICABILITÀ FLOTTE</h3>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          ${parte.vf ? '<span class="badge" style="background:rgba(0,212,255,.2); color:#00d4ff; border:1px solid rgba(0,212,255,.3);">VF - Virtu</span>' : ''}
          ${parte.tm ? '<span class="badge" style="background:rgba(0,212,255,.2); color:#00d4ff; border:1px solid rgba(0,212,255,.3);">TM - Tug Malta</span>' : ''}
        </div>
      </div>
    </div>
  `;
}

// ── INCROCIO POPUP ──────────────────────────────────────────────────────────────────
function buildIncrocioPopup(incrKey) {
  const incr = INCROCIO.find(i => i.key === incrKey);
  if (!incr) return '<h2>Incrocio non trovato</h2>';

  const risichiNave = RISCHIO_DATA.filter(r => r.nave === incr.nave);

  return `
    <h2 style="font-size:22px; color:#00d4ff; margin-bottom:18px; letter-spacing:1px;">
      ⚙️ ${incr.nave}
    </h2>

    <div class="nave-details">
      <div class="detail-group">
        <span class="detail-label">COMPONENTE:</span>
        <span class="detail-value">${incr.comp}</span>
      </div>
      <div class="detail-group">
        <span class="detail-label">CODICE:</span>
        <span class="detail-value">${incr.code}</span>
      </div>
      <div class="detail-group">
        <span class="detail-label">CATEGORIA:</span>
        <span class="detail-value">${incr.cat}</span>
      </div>
      <div class="detail-group">
        <span class="detail-label">LIVELLO RISCHIO:</span>
        <span class="detail-value"><span class="badge ${incr.status === 'ALTO' ? 'high' : 'medium'}">${incr.status}</span></span>
      </div>

      <div style="margin-top:20px; padding-top:20px; border-top:1px solid rgba(0,87,184,.2);">
        <h3 style="color:#00d4ff; font-size:13px; margin-bottom:10px; letter-spacing:1px;">REASONING TECNICO</h3>
        <p style="font-size:12px; line-height:1.7; color:rgba(255,255,255,.8);">${incr.motiv}</p>
      </div>

      ${risichiNave.length > 0 ? `
        <div style="margin-top:20px; padding-top:20px; border-top:1px solid rgba(0,87,184,.2);">
          <h3 style="color:#00d4ff; font-size:13px; margin-bottom:10px; letter-spacing:1px;">COMPONENTI A RISCHIO SU NAVE</h3>
          <table class="modal-table">
            <tr>
              <th>Componente</th>
              <th>Usura</th>
              <th>Status</th>
            </tr>
            ${risichiNave.map(r => `
              <tr>
                <td>${r.comp}</td>
                <td>${r.usura.toFixed(1)}%</td>
                <td><span class="badge ${r.status === 'CRITICO' ? 'critical' : r.status === 'ALTO' ? 'high' : 'medium'}">${r.status}</span></td>
              </tr>
            `).join('')}
          </table>
        </div>
      ` : ''}
    </div>
  `;
}

// ── USURA POPUP ─────────────────────────────────────────────────────────────────────
function buildUsuraPopup(usuraKey) {
  const usura = RISCHIO_DATA.find(u => u.key === usuraKey);
  if (!usura) return '<h2>Dato usura non trovato</h2>';

  return `
    <h2 style="font-size:22px; color:#00d4ff; margin-bottom:18px; letter-spacing:1px;">
      🔴 ${usura.nave} - ${usura.comp}
    </h2>

    <div class="nave-details">
      <div class="detail-group">
        <span class="detail-label">MOTORE:</span>
        <span class="detail-value">${usura.motore}</span>
      </div>
      <div class="detail-group">
        <span class="detail-label">CATEGORIA:</span>
        <span class="detail-value">${usura.cat}</span>
      </div>
      <div class="detail-group">
        <span class="detail-label">USURA:</span>
        <span class="detail-value" style="font-size:16px; color:#ff4444; font-weight:700;">${usura.usura.toFixed(1)}%</span>
      </div>
      <div class="detail-group">
        <span class="detail-label">STATUS:</span>
        <span class="detail-value"><span class="badge ${usura.status === 'CRITICO' ? 'critical' : usura.status === 'ALTO' ? 'high' : 'medium'}">${usura.status}</span></span>
      </div>
      <div class="detail-group">
        <span class="detail-label">ETÀ NAVE:</span>
        <span class="detail-value">${usura.eta} anni</span>
      </div>
      <div class="detail-group">
        <span class="detail-label">INTERVALLO FIDUCIA (95%):</span>
        <span class="detail-value">${usura.ic}</span>
      </div>

      <div style="margin-top:20px; padding-top:20px; border-top:1px solid rgba(0,87,184,.2);">
        <h3 style="color:#00d4ff; font-size:13px; margin-bottom:10px; letter-spacing:1px;">MOTIVAZIONE CRITICITÀ</h3>
        <p style="font-size:12px; line-height:1.7; color:rgba(255,255,255,.8);">${usura.motiv}</p>
      </div>

      <div style="margin-top:20px; padding-top:20px; border-top:1px solid rgba(0,87,184,.2);">
        <h3 style="color:#00d4ff; font-size:13px; margin-bottom:10px; letter-spacing:1px;">MODELLO WIENER</h3>
        <table class="modal-table">
          <tr>
            <td>Usura Media (μ)</td>
            <td style="text-align:right;">${usura.usura.toFixed(1)}%</td>
          </tr>
          <tr>
            <td>Deviazione Std (σ)</td>
            <td style="text-align:right;">${usura.sigma.toFixed(1)}</td>
          </tr>
          <tr>
            <td>Intervallo Conf.</td>
            <td style="text-align:right;">${usura.ic}</td>
          </tr>
        </table>
      </div>
    </div>
  `;
}

// ── ROADMAP POPUP ───────────────────────────────────────────────────────────────────
function buildRoadmapPopup(period) {
  const roadmapData = {
    '2026': {
      title: '2026 — Penetrazione Mercati Base',
      target: '€16.2M',
      goals: [
        '✓ Virtu Ferries: Inizio contratto manutenzione MV Maria Dolores',
        '✓ Tug Malta: Emergency service MT Sea Salvor (90% usura)',
        '✓ Focus: €35-50K su Tug + €150-200K su Virtu',
        '✓ Proof-of-concept: Delivery <12h per components'
      ]
    },
    '2027': {
      title: '2027 — Espansione Australia + Germania',
      target: '€22M',
      goals: [
        '✓ Australia: Aprire hub Port Hedland (€400K anno 1)',
        '✓ Germania: Partner con Damen & MAN',
        '✓ Growth: +35% su Virtu, +40% su Tug Malta',
        '✓ Ricambi: Ampliare portfolio a 250+ codici'
      ]
    },
    '2028': {
      title: '2028 — Hub Internazionale',
      target: '€28M',
      goals: [
        '✓ Malta hub internazionale (Maersk, CMA CGM)',
        '✓ Supply chain globale integrata',
        '✓ Export: €28M vs €16.2M baseline',
        '✓ Team: +8 tecnici specializzati'
      ]
    },
    '2029-2030': {
      title: '2029-2030 — Marine Intelligence Platform',
      target: '€35M+',
      goals: [
        '✓ Piattaforma predictive analytics per manutenzione',
        '✓ Real-time fleet monitoring (AIS integration)',
        '✓ Clienti: 50+ compagnie marittime',
        '✓ Margine netto: €8-10M annui'
      ]
    }
  };

  const data = roadmapData[period];
  if (!data) return '<h2>Periodo non trovato</h2>';

  return `
    <h2 style="font-size:22px; color:#00d4ff; margin-bottom:18px; letter-spacing:1px;">
      📅 ${data.title}
    </h2>

    <div class="nave-details">
      <div class="detail-group">
        <span class="detail-label">TARGET FATTURATO:</span>
        <span class="detail-value" style="font-size:18px; color:#00e676; font-weight:700;">${data.target}</span>
      </div>

      <div style="margin-top:20px; padding-top:20px; border-top:1px solid rgba(0,87,184,.2);">
        <h3 style="color:#00d4ff; font-size:13px; margin-bottom:12px; letter-spacing:1px;">MILESTONES STRATEGICI</h3>
        <ul style="list-style:none; padding:0; margin:0;">
          ${data.goals.map(g => `
            <li style="font-size:12px; padding:8px 0; border-bottom:1px solid rgba(0,87,184,.1); color:rgba(255,255,255,.85); line-height:1.6;">
              ${g}
            </li>
          `).join('')}
        </ul>
      </div>
    </div>
  `;
}

// Notification system
function showNotification(message) {
  const notif = document.createElement('div');
  notif.style.cssText = `
    position:fixed; top:80px; right:20px; z-index:600;
    background:rgba(255,100,100,.95); padding:12px 16px; border-radius:6px;
    color:#fff; font-size:13px; font-weight:600;
    box-shadow:0 4px 12px rgba(0,0,0,.3);
    animation:slideIn .3s ease;
  `;
  notif.textContent = message;
  document.body.appendChild(notif);

  setTimeout(() => {
    notif.style.animation = 'slideOut .3s ease forwards';
    setTimeout(() => notif.remove(), 300);
  }, 2500);
}