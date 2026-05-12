// ═══════════════════════════════════════════════════════════
// ANALISI USURA COMPONENTI — Modello Matematico
// ═══════════════════════════════════════════════════════════

// Auth check
const user = sessionStorage.getItem("rcs_user") || "—";
const navUser = document.getElementById("navUser");
if (navUser) navUser.textContent = user.toUpperCase();

function logout() {
  sessionStorage.removeItem("rcs_auth");
  sessionStorage.removeItem("rcs_user");
  window.location.href = "../index.html";
}

// ── IMPORTA DATI FLOTTE ────────────────────────────────────
// (Da dashboard.js - copiati qui per semplicità)
const FLEETS = {
  virtu: [
    { name: "MV Saint John Paul II", type: "High Speed Craft · Ro-Pax", flag: "🇲🇹", wear: 25, engine: "4× MTU 20V 8000 M71L", year: 2019, note: "36.400 kW · 38 kn · 900 pax · IMO 9762337", usage: "high", environment: "ocean", numEngines: 4 },
    { name: "MV Jean de La Valette",  type: "High Speed Craft · Ro-Pax", flag: "🇲🇹", wear: 56, engine: "4× MTU 20V 8000 M71L", year: 2010, note: "36.400 kW · 39 kn · 800 pax · IMO 9468946", usage: "high", environment: "ocean", numEngines: 4 },
    { name: "MV Maria Dolores",       type: "High Speed Craft · Ro-Pax · In Charter", flag: "🇲🇹", wear: 70, engine: "6× MTU 16V 4000 M73L", year: 2006, note: "🟠 ALTO · 36 kn · 600 pax", usage: "high", environment: "ocean", numEngines: 6 },
    { name: "HSC Gozo Express",       type: "High Speed Craft · Catamarano", flag: "🇲🇹", wear: 54, engine: "4× MTU 12V 2000 M72", year: 2008, note: "34 kn · 322 pax · IMO 9396753", usage: "high", environment: "ocean", numEngines: 4 },
    { name: "San Frangisk",           type: "Air Cushion Catamaran", flag: "🇲🇹", wear: 90, engine: "2× Deutz MWM 620B V16", year: 1990, note: "🔴 CRITICO · 38 kn · 330 pax", usage: "high", environment: "ocean", numEngines: 2 },
    { name: "San Pawl",               type: "Air Cushion Catamaran · ⚠️ Ex-flotta", flag: "🇲🇹", wear: 88, engine: "2× Deutz MWM 604B V16", year: 1991, note: "Ceduta Islands Unlimited 2025", usage: "high", environment: "ocean", numEngines: 2 },
    { name: "Balluta Bay",            type: "Oil Products Tanker", flag: "🇲🇹", wear: 100, engine: "Convenzionale", year: 1981, note: "🔴 CRITICO · 12 kn", usage: "normal", environment: "ocean", numEngines: 1 },
  ],
  tug: [
    { name: "MT Vittoriosa",    type: "ASD Escort Tug", flag: "🇲🇹", wear: 25, engine: "2× MTU 16V 4000 M65L", year: 2019, note: "81,5t BP · Med Marine Turchia", usage: "normal", environment: "coastal", numEngines: 2 },
    { name: "MT St. Angelo",    type: "ASD Tug · Damen ASD 2913", flag: "🇲🇹", wear: 29, engine: "2× Caterpillar 3516C", year: 2017, note: "83,0t BP", usage: "normal", environment: "coastal", numEngines: 2 },
    { name: "MT Senglea",       type: "RSD Tug · Damen RSD 2513", flag: "🇲🇹", wear: 19, engine: "2× Caterpillar 3516C", year: 2020, note: "80,0t BP", usage: "normal", environment: "coastal", numEngines: 2 },
    { name: "MT Med Aldebaran", type: "RSD Tug · Damen RSD 2513 Tier III", flag: "🇲🇹", wear: 6, engine: "2× Caterpillar 3516C", year: 2024, note: "80,0t BP · IMO Tier III", usage: "normal", environment: "coastal", numEngines: 2 },
    { name: "MT St. Elmo",      type: "ASD Escort Tug", flag: "🇲🇹", wear: 48, engine: "2× Caterpillar 3516C", year: 2011, note: "75,0t BP", usage: "normal", environment: "coastal", numEngines: 2 },
    { name: "MT Spinola",       type: "VSP Tractor Tug", flag: "🇲🇹", wear: 34, engine: "2× MaK 8M25", year: 2009, note: "81,6t BP · Voith 32R5", usage: "normal", environment: "coastal", numEngines: 2 },
    { name: "MT Wenzina",       type: "ASD Tug · Damen ASD 2411", flag: "🇲🇹", wear: 64, engine: "2× Caterpillar 3516C", year: 2006, note: "72,5t BP", usage: "normal", environment: "coastal", numEngines: 2 },
    { name: "MT Pawlina",       type: "ASD Tug · 🔴 CRITICO", flag: "🇲🇹", wear: 64, engine: "2× Caterpillar 3516B", year: 2006, note: "67,1t BP", usage: "normal", environment: "coastal", numEngines: 2 },
    { name: "MT Sea Salvor",    type: "Conventional Tug · Salvage", flag: "🇲🇹", wear: 90, engine: "2× Caterpillar 3516C", year: 1998, note: "🔴 CRITICO · 55,0t BP", usage: "high", environment: "ocean", numEngines: 2 },
    { name: "MT Gozzo",         type: "Mooring / Line Handler", flag: "🇲🇹", wear: 21, engine: "2× Volvo Diesel", year: 2019, note: "9,0t BP · Porto Valletta", usage: "low", environment: "coastal", numEngines: 2 },
  ],
};

// ── FATTORI DI USURA ───────────────────────────────────────
const MOTOR_FACTORS = {
  "MTU": 0.95,
  "Caterpillar": 1.0,
  "Deutz": 1.15,
  "Wärtsilä": 0.92,
  "MAN": 1.05,
  "Cummins": 0.98,
  "Volvo": 1.0,
  "MaK": 1.08,
  "Convenzionale": 1.2,
};

const COMPONENT_WEAR_FACTORS = {
  "Filtri carburante": 1.3,
  "Filtri olio": 1.25,
  "Sensore pressione CR": 0.9,
  "Filtri refrigerante": 1.0,
  "Separatore carburante/acqua": 1.15,
  "Alternatore marino": 0.85,
  "Filtri aria": 1.2,
  "default": 1.0,
};

const USAGE_FACTORS = {
  "high": 1.3,
  "normal": 1.0,
  "low": 0.7,
};

const ENVIRONMENT_FACTORS = {
  "ocean": 1.2,
  "coastal": 1.0,
  "river": 0.8,
};

// ── FUNZIONE CALCOLO USURA ────────────────────────────────
function calculateWear(shipName, shipYear, engine, componentName, numEngines = 2, usage = "normal", environment = "coastal") {
  const currentYear = 2026;
  const shipAge = currentYear - shipYear;

  // 1. Base usura by age (curva esponenziale)
  const baseWear = Math.min(100, (shipAge / 40) * 100 * Math.exp(shipAge / 30));

  // 2. Fattore motore
  let motorFactor = 1.0;
  for (const [motorType, factor] of Object.entries(MOTOR_FACTORS)) {
    if (engine.includes(motorType)) {
      motorFactor = factor;
      break;
    }
  }

  // 3. Fattore componente
  let componentFactor = COMPONENT_WEAR_FACTORS[componentName] || COMPONENT_WEAR_FACTORS.default;

  // 4. Fattore utilizzo
  const usageFactor = USAGE_FACTORS[usage] || 1.0;

  // 5. Fattore ambiente
  const envFactor = ENVIRONMENT_FACTORS[environment] || 1.0;

  // 6. Fattore distribuzione carico (numero motori)
  const loadFactor = 1.0 + (1 - 1/Math.max(1, numEngines)) * 0.25;

  // 7. Fattore manutenzione (riduce usura se nave è giovane)
  const maintenanceFactor = shipAge < 5 ? 0.7 : shipAge < 15 ? 0.85 : 1.0;

  // Formula finale
  let wear = baseWear * motorFactor * componentFactor * usageFactor * envFactor * loadFactor / maintenanceFactor;
  wear = Math.min(100, Math.max(0, wear));

  // Deviazione standard (incertezza ±)
  const sigma = Math.min(15, 5 + shipAge * 0.3);

  return { wear: Math.round(wear * 10) / 10, sigma: Math.round(sigma * 10) / 10 };
}

// ── GENERA TABELLA ANALISI ────────────────────────────────
function generateAnalysisTable() {
  let allShips = [];

  for (const fleet in FLEETS) {
    FLEETS[fleet].forEach(ship => {
      allShips.push({
        ...ship,
        fleet: fleet,
      });
    });
  }

  const tableHtml = `
    <table style="width:100%; border-collapse:collapse; font-size:11px;">
      <thead>
        <tr style="background:rgba(0,87,184,.2); border-bottom:1px solid rgba(0,87,184,.3);">
          <th style="padding:12px; text-align:left; color:#00d4ff; font-family:var(--F); font-weight:700;">NAVE</th>
          <th style="padding:12px; text-align:center; color:#00d4ff; font-family:var(--F); font-weight:700;">ETA</th>
          <th style="padding:12px; text-align:center; color:#00d4ff; font-family:var(--F); font-weight:700;">MOTORE</th>
          <th style="padding:12px; text-align:center; color:#00d4ff; font-family:var(--F); font-weight:700;">USURA CALCOLATA</th>
          <th style="padding:12px; text-align:center; color:#00d4ff; font-family:var(--F); font-weight:700;">INTERVALLO (σ)</th>
          <th style="padding:12px; text-align:center; color:#00d4ff; font-family:var(--F); font-weight:700;">UTILIZZO</th>
          <th style="padding:12px; text-align:center; color:#00d4ff; font-family:var(--F); font-weight:700;">AMBIENTE</th>
        </tr>
      </thead>
      <tbody>
        ${allShips.map((ship, idx) => {
          const age = 2026 - ship.year;
          const calc = calculateWear(ship.name, ship.year, ship.engine, "Filtri carburante", ship.numEngines, ship.usage, ship.environment);
          const wearMin = Math.max(0, calc.wear - calc.sigma);
          const wearMax = Math.min(100, calc.wear + calc.sigma);

          let wearColor = calc.wear >= 75 ? '#ff3333' : calc.wear >= 45 ? '#ff8c00' : '#00e676';

          return `
          <tr style="border-bottom:1px solid rgba(0,87,184,.1); ${idx % 2 ? 'background:rgba(0,0,0,.2);' : ''}">
            <td style="padding:10px; color:#fff;">${ship.name}</td>
            <td style="padding:10px; text-align:center; color:var(--grigio);">${age} anni</td>
            <td style="padding:10px; text-align:center; color:var(--grigio); font-size:10px;">${ship.engine.substring(0, 20)}...</td>
            <td style="padding:10px; text-align:center; color:${wearColor}; font-weight:700; font-family:var(--F);">${calc.wear.toFixed(1)}%</td>
            <td style="padding:10px; text-align:center; color:var(--grigio); font-size:10px;">${wearMin.toFixed(1)}% — ${wearMax.toFixed(1)}%</td>
            <td style="padding:10px; text-align:center; color:#ffd700; font-size:10px; font-weight:700;">${ship.usage.toUpperCase()}</td>
            <td style="padding:10px; text-align:center; color:#0096d4; font-size:10px; font-weight:700;">${ship.environment.toUpperCase()}</td>
          </tr>
        `;
        }).join('')}
      </tbody>
    </table>
  `;

  document.getElementById("analisiTable").innerHTML = tableHtml;
}

// ── NAVBAR SCROLL ──────────────────────────────────────────
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 40);
});

// ── GENERA GRAFICI ─────────────────────────────────────────
function generateCharts() {
  // Grafico 1: Distribuzione Usura per Nave
  let allShips = [];
  for (const fleet in FLEETS) {
    FLEETS[fleet].forEach(ship => {
      allShips.push(ship);
    });
  }

  const shipNames = allShips.map(s => s.name.substring(0, 15));
  const shipWears = allShips.map(s => {
    const calc = calculateWear(s.name, s.year, s.engine, "Filtri carburante", s.numEngines, s.usage, s.environment);
    return calc.wear;
  });

  const ctx1 = document.getElementById('chartUsuraDistrib')?.getContext('2d');
  if (ctx1) {
    new Chart(ctx1, {
      type: 'bar',
      data: {
        labels: shipNames,
        datasets: [{
          data: shipWears,
          backgroundColor: shipWears.map(w => w >= 75 ? 'rgba(255,0,0,.6)' : w >= 45 ? 'rgba(255,140,0,.6)' : 'rgba(0,230,118,.6)'),
          borderColor: shipWears.map(w => w >= 75 ? '#ff0000' : w >= 45 ? '#ff8c00' : '#00e676'),
          borderWidth: 1,
          borderRadius: 3,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: ctx => ' ' + ctx.raw.toFixed(1) + '%' } }
        },
        scales: {
          x: { grid: { color: 'rgba(0,87,184,.15)' }, ticks: { color: 'rgba(255,255,255,.6)', callback: v => v + '%' }, max: 100 }
        }
      }
    });
  }

  // Grafico 2: Curva età vs usura
  const ages = Array.from({length: 41}, (_, i) => i);
  const wearByAge = ages.map(age => {
    const wear = Math.min(100, (age / 40) * 100 * Math.exp(age / 30));
    return Math.round(wear * 10) / 10;
  });

  const ctx2 = document.getElementById('chartUsuraAge')?.getContext('2d');
  if (ctx2) {
    new Chart(ctx2, {
      type: 'line',
      data: {
        labels: ages,
        datasets: [{
          label: 'Usura prevista (filtri)',
          data: wearByAge,
          borderColor: '#00d4ff',
          backgroundColor: 'rgba(0,212,255,.1)',
          fill: true,
          tension: 0.3,
          pointRadius: 0,
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { labels: { color: 'rgba(255,255,255,.7)' } }
        },
        scales: {
          x: { grid: { color: 'rgba(0,87,184,.15)' }, ticks: { color: 'rgba(255,255,255,.6)' }, title: { display: true, text: 'Età nave (anni)', color: 'rgba(255,255,255,.6)' } },
          y: { grid: { color: 'rgba(0,87,184,.15)' }, ticks: { color: 'rgba(255,255,255,.6)', callback: v => v + '%' }, title: { display: true, text: 'Usura (%)', color: 'rgba(255,255,255,.6)' }, max: 100 }
        }
      }
    });
  }
}

// ── INIT ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  generateAnalysisTable();
  generateCharts();
});
