/* ═══════════════════════════════════════════════════════
   RCS Marine Intelligence — Portale Clienti
   cliente-dashboard.js
════════════════════════════════════════════════════════ */
import { auth, onAuthStateChanged } from './firebase-auth.js';
import { submitOrder as fsSubmit, getOrders } from './firebase-db.js';

/* ── AUTH GUARD ─────────────────────────────────────── */
const CLIENT_FLEET = {
  virtu: { company: 'Virtù Ferries', fleet: 'virtu' },
  tug:   { company: 'Tug Malta',     fleet: 'tug'   }
};
const TEAM_USERS = ['nunzio','direttore','admin','commerciale','tecnico','logistica'];

let currentUser = null, currentFleet = null, currentCompany = null;

onAuthStateChanged(auth, u => {
  if (!u) { window.location.href = '../index.html'; return; }
  const uname = u.email.split('@')[0].toLowerCase();
  if (TEAM_USERS.includes(uname)) {
    window.location.href = 'dashboard.html'; return;
  }
  const info = CLIENT_FLEET[uname];
  if (!info) { window.location.href = '../index.html'; return; }
  currentUser = uname;
  currentFleet = info.fleet;
  currentCompany = info.company;
  sessionStorage.setItem('rcs_user', uname);
  sessionStorage.setItem('rcs_fleet', currentFleet);
  init();
});

function logout() {
  import('./firebase-auth.js').then(({ auth }) => {
    import('https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js')
      .then(({ signOut }) => signOut(auth));
  });
  sessionStorage.clear();
  window.location.href = '../index.html';
}
window.logout = logout;

/* ── FLEET DATA ─────────────────────────────────────── */
const FLEETS = {
  virtu: {
    name: 'Virtù Ferries',
    ships: [
      { id:'sjp2', name:'MV Saint John Paul II', type:'High Speed Ro-Pax', flag:'🇲🇹',
        year:2019, wear:25, engine:'4× MTU 20V 8000 M71L', engineType:'MTU',
        fuel:'Diesel marino DMA', kw:36400, speed:38, pax:900,
        hours:35200, imo:'9762337', route:'Valletta–Pozzallo–Catania',
        lat:35.896, lon:14.513 },
      { id:'jdlv', name:'MV Jean de La Valette', type:'High Speed Ro-Pax', flag:'🇲🇹',
        year:2010, wear:56, engine:'4× MTU 20V 8000 M71L', engineType:'MTU',
        fuel:'Diesel marino DMA', kw:36400, speed:39, pax:800,
        hours:87200, imo:'9468946', route:'Valletta–Pozzallo–Napoli',
        lat:35.90, lon:14.51 },
      { id:'md',   name:'MV Maria Dolores', type:'High Speed Ro-Pax · Charter', flag:'🇲🇹',
        year:2006, wear:70, engine:'6× MTU 16V 4000 M73L', engineType:'MTU',
        fuel:'Diesel marino DMA', kw:35040, speed:36, pax:600,
        hours:110800, imo:'9333333', route:'Tarifa–Tangeri (Charter 2025)',
        lat:36.01, lon:-5.60 },
      { id:'gozo', name:'HSC Gozo Express', type:'High Speed Catamarano', flag:'🇲🇹',
        year:2008, wear:54, engine:'4× MTU 12V 2000 M72', engineType:'MTU',
        fuel:'Diesel marino DMA', kw:7200, speed:34, pax:322,
        hours:98400, imo:'9396753', route:'Valletta–Gozo (Mġarr)',
        lat:36.01, lon:14.31 },
      { id:'sfr',  name:'San Frangisk', type:'Air Cushion Catamaran', flag:'🇲🇹',
        year:1990, wear:90, engine:'2× Deutz MWM 620B V16', engineType:'Deutz',
        fuel:'Diesel marino MDO', kw:7200, speed:38, pax:330,
        hours:103600, imo:'8903899', route:'Valletta–Gozo',
        lat:35.91, lon:14.52 },
      { id:'spwl', name:'San Pawl', type:'Air Cushion Catamaran · Ex-flotta', flag:'🇲🇹',
        year:1991, wear:88, engine:'2× Deutz MWM 604B V16', engineType:'Deutz',
        fuel:'Diesel marino MDO', kw:6800, speed:36, pax:320,
        hours:101400, imo:'8903904', route:'Ceduta Islands Unlimited 2025',
        lat:35.90, lon:14.50 },
      { id:'bb',   name:'Balluta Bay', type:'Oil Tanker', flag:'🇲🇹',
        year:1981, wear:100, engine:'Wärtsilä Convenzionale', engineType:'Wärtsilä',
        fuel:'HFO 380', kw:4200, speed:12, pax:0,
        hours:194000, imo:'7900001', route:'Supporto logistico rifornimento',
        lat:35.88, lon:14.50 }
    ]
  },
  tug: {
    name: 'Tug Malta',
    ships: [
      { id:'vitt', name:'MT Vittoriosa', type:'ASD Tug', flag:'🇲🇹',
        year:2019, wear:25, engine:'2× MTU 16V 4000 M65L', engineType:'MTU',
        fuel:'Diesel marino DMA', kw:5000, speed:14, pax:0,
        hours:26300, imo:'9780001', route:'Grand Harbour — manovra',
        lat:35.893, lon:14.521 },
      { id:'stang',name:'MT St. Angelo', type:'ASD Tug', flag:'🇲🇹',
        year:2017, wear:29, engine:'2× Caterpillar 3516C', engineType:'Caterpillar',
        fuel:'Diesel marino DMA', kw:4600, speed:13.5, pax:0,
        hours:35000, imo:'9780002', route:'Grand Harbour — manovra',
        lat:35.894, lon:14.519 },
      { id:'seng', name:'MT Senglea', type:'RSD Tug', flag:'🇲🇹',
        year:2020, wear:19, engine:'2× Caterpillar 3516C', engineType:'Caterpillar',
        fuel:'Diesel marino DMA', kw:4600, speed:13.5, pax:0,
        hours:21000, imo:'9780003', route:'Grand Harbour — manovra',
        lat:35.895, lon:14.520 },
      { id:'aldb', name:'MT Med Aldebaran', type:'RSD Tier III', flag:'🇲🇹',
        year:2024, wear:6, engine:'2× Caterpillar 3516C Tier III', engineType:'Caterpillar',
        fuel:'Diesel marino DMA Tier III', kw:4800, speed:14, pax:0,
        hours:5800, imo:'9780004', route:'Grand Harbour — manovra',
        lat:35.892, lon:14.522 },
      { id:'stelm',name:'MT St. Elmo', type:'ASD Tug', flag:'🇲🇹',
        year:2011, wear:48, engine:'2× Caterpillar 3516C', engineType:'Caterpillar',
        fuel:'Diesel marino DMA', kw:4600, speed:13.5, pax:0,
        hours:61400, imo:'9780005', route:'Marsaxlokk — manovra',
        lat:35.840, lon:14.541 },
      { id:'spin', name:'MT Spinola', type:'VSP Tractor Tug', flag:'🇲🇹',
        year:2009, wear:34, engine:'2× MaK 8M25', engineType:'MaK',
        fuel:'Diesel marino DMA', kw:3600, speed:12, pax:0,
        hours:72800, imo:'9780006', route:'Grand Harbour — manovra',
        lat:35.893, lon:14.518 },
      { id:'wenz', name:'MT Wenzina', type:'ASD Tug', flag:'🇲🇹',
        year:2006, wear:64, engine:'2× Caterpillar 3516C', engineType:'Caterpillar',
        fuel:'Diesel marino DMA', kw:4600, speed:13, pax:0,
        hours:84200, imo:'9780007', route:'Grand Harbour — manovra',
        lat:35.891, lon:14.523 },
      { id:'pawl', name:'MT Pawlina', type:'ASD Tug', flag:'🇲🇹',
        year:2006, wear:64, engine:'2× Caterpillar 3516B', engineType:'Caterpillar',
        fuel:'Diesel marino DMA', kw:4400, speed:13, pax:0,
        hours:83800, imo:'9780008', route:'Marsaxlokk — manovra',
        lat:35.841, lon:14.540 },
      { id:'salv', name:'MT Sea Salvor', type:'Salvage Tug', flag:'🇲🇹',
        year:1998, wear:90, engine:'2× Caterpillar 3516C', engineType:'Caterpillar',
        fuel:'Diesel marino DMA', kw:4600, speed:14, pax:0,
        hours:114400, imo:'9780009', route:'Pattugliamento — emergenze',
        lat:35.890, lon:14.525 },
      { id:'gozzo',name:'MT Gozzo', type:'Mooring Handler', flag:'🇲🇹',
        year:2019, wear:21, engine:'2× Volvo Diesel', engineType:'Volvo',
        fuel:'Diesel marino DMA', kw:1200, speed:10, pax:0,
        hours:21400, imo:'9780010', route:'Supporto ormeggio',
        lat:35.896, lon:14.517 }
    ]
  }
};

/* ── SUBSYSTEM GENERATOR ────────────────────────────── */
const SUBSYSTEM_DEFS = [
  { key:'motore',    label:'⚙️ Motore',          desc:'Motore principale: tipo, alimentazione, componenti interni, usura.' },
  { key:'filtrazione',label:'🔽 Filtrazione',    desc:'Filtri carburante, olio, aria, refrigerante e separatori centrifughi.' },
  { key:'iniezione', label:'💉 Iniezione',        desc:'Sistema Common Rail, iniettori, pompa alta pressione, rail e sensori.' },
  { key:'elettronica',label:'⚡ Elettronica',     desc:'ECU motore, sensori di bordo, moduli di controllo e sistemi di monitoraggio.' },
  { key:'pompistica', label:'🔧 Pompistica',      desc:'Pompe carburante, olio, raffreddamento e circolazione.' },
  { key:'lubrificazione',label:'🛢️ Lubrificazione',desc:'Circuito olio lubrificante, filtri, scambiatori e purificatori.' },
  { key:'comp_esterne',label:'🪟 Comp. Esterne', desc:'Scafo, vetri, guarnizioni esterne, anodi sacrificali, vernici.' },
  { key:'propulsione', label:'⚓ Propulsione',    desc:'Eliche, alberi di trasmissione, astucci, riduttori e giunti elastici.' },
  { key:'elettrogeni', label:'🔌 Elettrogeni',   desc:'Gensets diesel, alternatori e quadri di distribuzione principali.' },
  { key:'raffreddamento',label:'🌊 Raffreddamento',desc:'Circuiti acqua dolce e acqua mare, scambiatori, pompe, termostati.' },
  { key:'idraulica',  label:'🔩 Idraulica/Pneum.',desc:'Timoneria idraulica, verricelli, gru, salpa ancore, compressori aria.' },
  { key:'filtraggio_tratt',label:'🧹 Filtraggio/Tratt.',desc:'Purificatori nafta/olio, separatori sentina, trattamento acque zavorra.' },
  { key:'sicurezza',  label:'🚨 Sicurezza/SOLAS', desc:'Pompe antincendio, rilevatori fumo/gas, sistemi CO₂/schiuma (SOLAS).' }
];

const COMP_TEMPLATES = {
  motore:          [
    {n:'Pistoni e segmenti',f:1.0,iv:20000,ph:['0 445 120 217']},
    {n:'Valvole e molle',   f:1.1,iv:12000,ph:[]},
    {n:'Turbocompressore',  f:1.2,iv:8000, ph:[]},
    {n:'Cuscinetti biella', f:1.1,iv:10000,ph:[]},
    {n:'Guarnizioni testa', f:0.9,iv:15000,ph:[]},
    {n:'Pompa acqua motore',f:1.0,iv:6000, ph:[]}
  ],
  filtrazione:     [
    {n:'Filtri carburante primari',  f:1.3,iv:500,  ph:['FF5652','FF5319']},
    {n:'Filtri carburante secondari',f:1.2,iv:1000, ph:['FF5652']},
    {n:'Filtri olio motore',         f:1.25,iv:750, ph:['LF9009','LF691A']},
    {n:'Filtri aria aspirazione',    f:1.2,iv:2000, ph:['AF25708']},
    {n:'Filtri refrigerante',        f:1.0,iv:2000, ph:['WF2075']},
    {n:'Separatore centrifugo nafta',f:1.15,iv:4000,ph:['FF5319']}
  ],
  iniezione:       [
    {n:'Iniettori CR',               f:1.3,iv:6000, ph:['0 445 120 217','0 445 120 231']},
    {n:'Pompa alta pressione',       f:1.1,iv:8000, ph:['0 445 020 007']},
    {n:'Rail di pressione',          f:0.8,iv:16000,ph:[]},
    {n:'Sensore pressione CR',       f:0.9,iv:12000,ph:['1 644 7823']},
    {n:'Modulo controllo CR',        f:0.85,iv:20000,ph:['0 281 006 064']},
    {n:'Valvola regolatrice press.', f:1.0,iv:10000,ph:[]}
  ],
  elettronica:     [
    {n:'ECU motore principale',      f:0.7,iv:30000,ph:['0 281 006 064']},
    {n:'Sensori temperatura',        f:1.0,iv:8000, ph:[]},
    {n:'Sensori pressione olio',     f:1.0,iv:8000, ph:['1 644 7823']},
    {n:'Centralina allarmi',         f:0.8,iv:20000,ph:[]},
    {n:'Cablaggio principale',       f:0.7,iv:40000,ph:[]},
    {n:'Pannello di controllo',      f:0.75,iv:25000,ph:[]}
  ],
  pompistica:      [
    {n:'Pompa carburante trasferta', f:1.1,iv:6000, ph:[]},
    {n:'Pompa olio bassa pressione', f:1.0,iv:5000, ph:[]},
    {n:'Pompa raffr. acqua dolce',   f:1.0,iv:5000, ph:[]},
    {n:'Pompa raffr. acqua mare',    f:1.2,iv:4000, ph:[]},
    {n:'Pompa sentina',              f:1.1,iv:3000, ph:[]},
    {n:'Pompa carico carburante',    f:0.9,iv:8000, ph:[]}
  ],
  lubrificazione:  [
    {n:'Olio lubrificante motore',   f:1.25,iv:750, ph:['LF9009']},
    {n:'Filtro olio by-pass',        f:1.1,iv:1500, ph:['LF691A']},
    {n:'Scambiatore olio-acqua',     f:0.9,iv:8000, ph:[]},
    {n:'Purificatore olio centrifugo',f:1.0,iv:4000,ph:[]},
    {n:'Spia livello olio',          f:0.8,iv:20000,ph:[]},
    {n:'Ventilazione carter',        f:1.0,iv:6000, ph:[]}
  ],
  comp_esterne:    [
    {n:'Vetri timoneria',            f:0.6,iv:20000,ph:[]},
    {n:'Guarnizioni portelloni',     f:1.0,iv:5000, ph:[]},
    {n:'Anodi sacrificali zinco',    f:1.5,iv:2000, ph:[]},
    {n:'Verniciatura antivegetativa',f:1.2,iv:8760, ph:[]},
    {n:'Bitte e gallocce coperta',   f:0.7,iv:20000,ph:[]},
    {n:'Passacavi e raccordi scafo', f:0.8,iv:15000,ph:[]}
  ],
  propulsione:     [
    {n:'Eliche (passo fisso)',       f:1.0,iv:20000,ph:[]},
    {n:'Alberi di trasmissione',     f:0.9,iv:25000,ph:[]},
    {n:'Astucci porta-albero',       f:1.1,iv:15000,ph:[]},
    {n:'Riduttori angolari',         f:1.0,iv:12000,ph:[]},
    {n:'Giunti elastici',            f:1.1,iv:10000,ph:[]},
    {n:'Cuscinetti reggispinta',     f:1.0,iv:15000,ph:[]}
  ],
  elettrogeni:     [
    {n:'Genset diesel principale',   f:0.9,iv:8000, ph:[]},
    {n:'Genset diesel emergenza',    f:0.85,iv:10000,ph:[]},
    {n:'Alternatore principale',     f:0.85,iv:12000,ph:[]},
    {n:'Quadro distribuzione 440V',  f:0.7,iv:30000,ph:[]},
    {n:'Interruttori automatici',    f:0.8,iv:20000,ph:[]},
    {n:'Batterie avviamento',        f:1.2,iv:3000, ph:[]}
  ],
  raffreddamento:  [
    {n:'Scambiatore fascio tubiero', f:1.0,iv:8000, ph:[]},
    {n:'Valvola termostatica',       f:1.1,iv:5000, ph:[]},
    {n:'Pompa centrifuga acq.dolce', f:1.0,iv:5000, ph:[]},
    {n:'Keel cooler / Box presa mare',f:1.1,iv:6000,ph:[]},
    {n:'Filtri acqua mare',          f:1.3,iv:1000, ph:['WF2075']},
    {n:'Glicole refrigerante',       f:1.0,iv:4000, ph:['CC2825']}
  ],
  idraulica:       [
    {n:'Pompa idraulica timoneria',  f:1.0,iv:8000, ph:[]},
    {n:'Cilindri timone',            f:0.9,iv:15000,ph:[]},
    {n:'Valvole distribuzione',      f:1.0,iv:10000,ph:[]},
    {n:'Compressore aria (avv.)',    f:1.1,iv:6000, ph:[]},
    {n:'Salpa ancore idraulico',     f:1.0,iv:8000, ph:[]},
    {n:'Filtri olio idraulico',      f:1.2,iv:2000, ph:[]}
  ],
  filtraggio_tratt:[
    {n:'Purificatore nafta',         f:1.15,iv:4000,ph:['FF5319']},
    {n:'Purificatore olio lubr.',    f:1.0,iv:4000, ph:[]},
    {n:'Separatore sentina (15ppm)', f:1.1,iv:6000, ph:[]},
    {n:'Filtri coalescenti',         f:1.2,iv:2000, ph:[]},
    {n:'Sistema BWTS zavorra',       f:0.9,iv:12000,ph:[]},
    {n:'Filtri cassa zavorra',       f:1.1,iv:3000, ph:[]}
  ],
  sicurezza:       [
    {n:'Pompa antincendio emerg.',   f:0.9,iv:10000,ph:[]},
    {n:'Rilevatori fumo (SOLAS)',    f:1.0,iv:5000, ph:[]},
    {n:'Rilevatori gas',             f:1.0,iv:5000, ph:[]},
    {n:'Impianto CO₂ sala macchine', f:0.7,iv:30000,ph:[]},
    {n:'Schiuma antincendio',        f:0.8,iv:15000,ph:[]},
    {n:'Valvole chiusura rapida',    f:0.9,iv:12000,ph:[]}
  ]
};

function clamp(v){ return Math.min(100, Math.max(0, Math.round(v))); }

function nextMaintDate(currentHours, interval, wearPct, opsHoursPerDay=14) {
  const remaining = interval * Math.max(0, (1 - wearPct/100));
  const days = Math.round(remaining / opsHoursPerDay);
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('it-IT');
}

function wearColor(w) {
  if (w >= 80) return 'var(--rosso)';
  if (w >= 55) return 'var(--arancio)';
  return 'var(--verde)';
}

function buildSubsystems(ship) {
  const base = ship.wear;
  const ageBonus = Math.min(30, (2025 - ship.year) * 0.8);
  const opsHpd = ship.type.includes('Tug') ? 12 : 14;
  const result = {};
  for (const [key, comps] of Object.entries(COMP_TEMPLATES)) {
    result[key] = comps.map(c => {
      const w = clamp(base * c.f + ageBonus * 0.4 + (Math.random() * 8 - 4));
      const lastH = Math.round(ship.hours * (0.8 + Math.random() * 0.15));
      return {
        name: c.n,
        wear: w,
        interval: c.iv,
        lastHours: lastH,
        totalHours: ship.hours,
        nextMaint: nextMaintDate(ship.hours, c.iv, w, opsHpd),
        parts: c.ph,
        status: w >= 80 ? 'crit' : w >= 55 ? 'warn' : 'ok'
      };
    });
  }
  return result;
}

/* ── CATALOG DATA ───────────────────────────────────── */
const CATALOG = [
  {code:'0 445 120 217',name:'Iniettore Common Rail CRIN3',brand:'Bosch',cat:'Iniezione',price:522,stock:true, img:'https://placehold.co/200x130/04111f/00d4ff?text=CRIN3'},
  {code:'0 445 120 231',name:'Iniettore CR CRIN3-18',brand:'Bosch',cat:'Iniezione',price:498,stock:true, img:''},
  {code:'0 445 020 007',name:'Pompa alta pressione CP1',brand:'Bosch',cat:'Iniezione',price:1240,stock:false,img:''},
  {code:'1 644 7823',   name:'Sensore pressione CR 1800bar',brand:'Bosch',cat:'Elettronica',price:156,stock:true, img:''},
  {code:'0 281 006 064',name:'Modulo controllo CR EDC7',brand:'Bosch',cat:'Elettronica',price:890,stock:false,img:''},
  {code:'FF5652',       name:'Filtro carburante marino',brand:'Fleetguard',cat:'Filtrazione',price:34,stock:true, img:''},
  {code:'FF5319',       name:'Filtro carburante diesel',brand:'Fleetguard',cat:'Filtrazione',price:28,stock:true, img:''},
  {code:'LF9009',       name:'Filtro olio lubrificante',brand:'Fleetguard',cat:'Lubrificazione',price:45,stock:true, img:''},
  {code:'LF691A',       name:'Filtro olio by-pass',brand:'Fleetguard',cat:'Lubrificazione',price:38,stock:true, img:''},
  {code:'AF25708',      name:'Filtro aria doppio stadio',brand:'Fleetguard',cat:'Filtrazione',price:62,stock:true, img:''},
  {code:'WF2075',       name:'Filtro acqua refrigerante',brand:'Fleetguard',cat:'Raffreddamento',price:22,stock:true, img:''},
  {code:'CC2825',       name:'Additivo glicole refrigerante',brand:'Fleetguard',cat:'Raffreddamento',price:55,stock:true, img:''},
  {code:'3545040',      name:'Filtro olio Caterpillar',brand:'Caterpillar',cat:'Lubrificazione',price:45,stock:true, img:''},
  {code:'1R-0750',      name:'Filtro carburante CAT',brand:'Caterpillar',cat:'Filtrazione',price:39,stock:true, img:''},
  {code:'6I-2501',      name:'Elemento filtro idraulico CAT',brand:'Caterpillar',cat:'Idraulica',price:78,stock:true, img:''},
  {code:'7E-6599',      name:'Kit guarnizioni CAT 3516',brand:'Caterpillar',cat:'Motore',price:320,stock:false,img:''},
  {code:'4P-0710',      name:'Filtro olio CAT',brand:'Caterpillar',cat:'Lubrificazione',price:42,stock:true, img:''},
  {code:'3516-INJ',     name:'Iniettore Caterpillar 3516',brand:'Caterpillar',cat:'Iniezione',price:780,stock:false,img:''},
  {code:'CU-3087',      name:'Filtro carburante Cummins',brand:'Cummins',cat:'Filtrazione',price:36,stock:true, img:''},
  {code:'CU-5319',      name:'Filtro olio Cummins ISL',brand:'Cummins',cat:'Lubrificazione',price:41,stock:true, img:''},
  {code:'CU-AF-01',     name:'Filtro aria Cummins',brand:'Cummins',cat:'Filtrazione',price:58,stock:true, img:''},
  {code:'MTU-INJ-8000', name:'Iniettore MTU 20V 8000 M71L',brand:'MTU',cat:'Iniezione',price:1450,stock:false,img:''},
  {code:'MTU-FLT-4000', name:'Kit filtri MTU 16V 4000',brand:'MTU',cat:'Filtrazione',price:220,stock:true, img:''},
  {code:'MTU-TURBO-01', name:'Turbocompressore MTU 8000',brand:'MTU',cat:'Motore',price:4200,stock:false,img:''},
  {code:'MTU-GKT-001',  name:'Kit guarnizioni testata MTU',brand:'MTU',cat:'Motore',price:580,stock:false,img:''}
];

/* ── PORT DATA ──────────────────────────────────────── */
const PORTS = [
  {name:'Valletta / Grand Harbour (MT)',lat:35.896,lon:14.513,std:'12-24h',exp:'8-12h',air:'4-6h',note:'Porto principale Malta'},
  {name:'Pozzallo (IT)',lat:36.728,lon:14.849,std:'4-6h',exp:'2-4h',air:'2-3h',note:'Sicilia — traghetto diretto'},
  {name:'Catania (IT)',lat:37.502,lon:15.087,std:'—',exp:'—',air:'—',note:'Sede RCS — ritiro diretto'},
  {name:'Messina (IT)',lat:38.192,lon:15.556,std:'1-2h',exp:'1h',air:'1h',note:'Stretto di Messina'},
  {name:'Palermo (IT)',lat:38.115,lon:13.361,std:'4-6h',exp:'3h',air:'2h',note:'Sicilia occidentale'},
  {name:'Taranto (IT)',lat:40.464,lon:17.244,std:'4-6h',exp:'3h',air:'2h',note:'Puglia'},
  {name:'Bari (IT)',lat:41.118,lon:16.872,std:'5-7h',exp:'4h',air:'2h',note:'Puglia — hub Adriatico'},
  {name:'Napoli (IT)',lat:40.839,lon:14.253,std:'1 giorno',exp:'8h',air:'3h',note:'Campania'},
  {name:'Civitavecchia / Roma (IT)',lat:42.091,lon:11.800,std:'1-2gg',exp:'10h',air:'3h',note:'Porto di Roma'},
  {name:'Livorno (IT)',lat:43.548,lon:10.316,std:'2gg',exp:'1gg',air:'4h',note:'Toscana'},
  {name:'Genova (IT)',lat:44.407,lon:8.934,std:'2gg',exp:'1gg',air:'4h',note:'Liguria — hub container'},
  {name:'Trieste (IT)',lat:45.651,lon:13.777,std:'2-3gg',exp:'1-2gg',air:'5h',note:'Alto Adriatico'},
  {name:'Venezia / Marghera (IT)',lat:45.441,lon:12.320,std:'2-3gg',exp:'1-2gg',air:'5h',note:'Porto industriale Veneto'},
  {name:'Pireo (GR)',lat:37.950,lon:23.636,std:'3gg',exp:'2gg',air:'6h',note:'Hub Mediterraneo orientale'},
  {name:'Barcellona (ES)',lat:41.380,lon:2.177,std:'4gg',exp:'2-3gg',air:'8h',note:'Catalunya'},
  {name:'Valencia (ES)',lat:39.452,lon:-0.327,std:'4gg',exp:'2-3gg',air:'7h',note:'Levante spagnolo'},
  {name:'Marsiglia (FR)',lat:43.297,lon:5.381,std:'3gg',exp:'2gg',air:'6h',note:'Francia meridionale'},
  {name:'Split (HR)',lat:43.508,lon:16.440,std:'3gg',exp:'2gg',air:'6h',note:'Dalmazia — Croazia'},
  {name:'Tarifa (ES)',lat:36.014,lon:-5.605,std:'5gg',exp:'3gg',air:'9h',note:'Stretto di Gibilterra'},
  {name:'Port Hedland (AU)',lat:-20.31,lon:118.58,std:'N/D',exp:'N/D',air:'8-10gg',note:'Australia — via aerea obbligatoria'},
  {name:'Amsterdam (NL)',lat:52.370,lon:4.904,std:'8-10gg',exp:'4gg',air:'10h',note:'Europa nord-occidentale'},
  {name:'Hamburg (DE)',lat:53.551,lon:9.993,std:'9-11gg',exp:'4-5gg',air:'10h',note:'Europa nord — hub container'}
];

/* ── RENDER FLEET ───────────────────────────────────── */
function init() {
  document.getElementById('navCompany').textContent = currentCompany;
  document.getElementById('heroCompany').textContent = currentCompany;
  const fleet = FLEETS[currentFleet];
  if (!fleet) return;
  const ships = fleet.ships;
  const crit = ships.filter(s=>s.wear>=80).length;
  const avgWear = Math.round(ships.reduce((a,s)=>a+s.wear,0)/ships.length);
  document.getElementById('kpiNavi').textContent = ships.length;
  document.getElementById('kpiCrit').textContent = crit;
  document.getElementById('kpiWear').textContent = avgWear+'%';
  renderShipGrid(ships);
  renderCatalog();
  populatePorts();
  initMap(ships);
  initRouteMap(ships);
  renderRouteSchedule();
  loadOrders();
  populateOrderShips(ships);
}

function statusLabel(w) {
  if (w>=80) return {cls:'badge-crit',txt:'CRITICO'};
  if (w>=55) return {cls:'badge-warn',txt:'ATTENZIONE'};
  return {cls:'badge-ok',txt:'OK'};
}

function renderShipGrid(ships) {
  const grid = document.getElementById('shipGrid');
  grid.innerHTML = ships.map((s,i) => {
    const st = statusLabel(s.wear);
    const tagWear = s.wear>=80?'alert':s.wear>=55?'warn':'';
    return `
    <div class="c-ship-card" onclick="openShipModal(${i})">
      <span class="badge-status ${st.cls}">${st.txt}</span>
      <div class="c-ship-card-top">
        <div>
          <div class="c-ship-name">${s.name}</div>
          <div class="c-ship-type">${s.type}</div>
        </div>
        <div class="c-ship-flag">${s.flag}</div>
      </div>
      <div class="c-wear-label"><span>USURA GLOBALE</span><span>${s.wear}%</span></div>
      <div class="c-wear-bar"><div class="c-wear-fill" style="width:${s.wear}%;background:${wearColor(s.wear)}"></div></div>
      <div class="c-ship-meta">
        <span class="c-ship-tag">${s.year}</span>
        <span class="c-ship-tag ${tagWear}">${s.engine.split('×')[0].trim()}×…</span>
        <span class="c-ship-tag">${s.hours.toLocaleString('it-IT')} h</span>
        <span class="c-ship-tag">IMO ${s.imo}</span>
      </div>
    </div>`;
  }).join('');
}
window.openShipModal = function(idx) {
  const ships = FLEETS[currentFleet].ships;
  const ship = ships[idx];
  const sys = buildSubsystems(ship);
  document.getElementById('modalShipName').textContent = ship.name;
  document.getElementById('modalShipSub').textContent = `${ship.type} · ${ship.flag} · IMO ${ship.imo} · Rotta: ${ship.route}`;
  document.getElementById('modalShipKpis').innerHTML = [
    ['Motore', ship.engine],
    ['Combustibile', ship.fuel],
    ['Anno varo', ship.year],
    ['Ore totali', ship.hours.toLocaleString('it-IT')+' h'],
    ['Potenza', ship.kw.toLocaleString('it-IT')+' kW'],
    ['Velocità max', ship.speed+' kn'],
    ['Usura globale', ship.wear+'%']
  ].map(([l,v])=>`<div class="c-modal-kpi"><strong>${v}</strong>${l}</div>`).join('');

  const tabs = document.getElementById('sysTabs');
  const cont = document.getElementById('sysContents');
  tabs.innerHTML = SUBSYSTEM_DEFS.map((s,i)=>`
    <button class="c-tab${i===0?' active':''}" onclick="switchTab('${s.key}')">${s.label}</button>
  `).join('');
  cont.innerHTML = SUBSYSTEM_DEFS.map((sd,i)=>`
    <div class="c-tab-content${i===0?' active':''}" id="tab-${sd.key}">
      <div class="c-sys-header">
        <div class="c-sys-title">${sd.label}</div>
        <div class="c-sys-desc">${sd.desc}</div>
        ${sd.key==='motore'?`<div class="c-engine-info">
          <span class="c-engine-badge">${ship.engine}</span>
          <span class="c-engine-badge">${ship.fuel}</span>
          <span class="c-engine-badge">${ship.kw} kW totali</span>
        </div>`:''}
      </div>
      <div class="c-comp-grid">
        ${(sys[sd.key]||[]).map(c=>`
        <div class="c-comp-row">
          <div class="c-comp-top">
            <span class="c-comp-name">${c.name}</span>
            <span class="c-comp-pct" style="color:${wearColor(c.wear)}">${c.wear}%</span>
          </div>
          <div class="c-comp-bar"><div class="c-comp-fill" style="width:${c.wear}%;background:${wearColor(c.wear)}"></div></div>
          <div class="c-comp-meta">
            <span>Ore totali: <strong>${c.totalHours.toLocaleString('it-IT')} h</strong></span>
            <span>Ultimo intervento: <strong>${c.lastHours.toLocaleString('it-IT')} h</strong></span>
            <span>Intervallo: <strong>${c.interval.toLocaleString('it-IT')} h</strong></span>
            <span>Prossima manutenzione: <strong>${c.nextMaint}</strong></span>
          </div>
          ${c.parts.length?`<div class="c-comp-actions">
            ${c.parts.map(p=>`<button class="btn-order-part" onclick="quickAddToCart('${p}','${ship.name}')">+ Ordina ${p}</button>`).join(' ')}
          </div>`:''}
        </div>`).join('')}
      </div>
    </div>
  `).join('');

  document.getElementById('shipModal').classList.add('open');
  document.body.style.overflow='hidden';
};
window.switchTab = function(key) {
  document.querySelectorAll('.c-tab').forEach((t,i)=>t.classList.toggle('active', SUBSYSTEM_DEFS[i].key===key));
  document.querySelectorAll('.c-tab-content').forEach(c=>c.classList.remove('active'));
  const el = document.getElementById('tab-'+key);
  if(el) el.classList.add('active');
};
window.closeShipModal = function() {
  document.getElementById('shipModal').classList.remove('open');
  document.body.style.overflow='';
};

/* ── CATALOG ────────────────────────────────────────── */
let catFilter = 'all', catSearch = '';
function renderCatalog() {
  let list = CATALOG.filter(c => {
    const matchFilter = catFilter==='all' ? true :
      catFilter==='in-stock' ? c.stock :
      c.brand===catFilter;
    const matchSearch = !catSearch ||
      c.code.toLowerCase().includes(catSearch) ||
      c.name.toLowerCase().includes(catSearch) ||
      c.brand.toLowerCase().includes(catSearch);
    return matchFilter && matchSearch;
  });
  document.getElementById('catalogGrid').innerHTML = list.map(c=>`
    <div class="c-catalog-card">
      <div class="c-catalog-code">${c.code}</div>
      <div class="c-catalog-name">${c.name}</div>
      <div class="c-catalog-brand">${c.brand} · ${c.cat}</div>
      <div class="c-catalog-meta">
        <span class="c-catalog-price">€${c.price.toLocaleString('it-IT')}</span>
        <span class="c-stock-badge ${c.stock?'c-stock-in':'c-stock-out'}">${c.stock?'IN STOCK':'ORDINABILE'}</span>
      </div>
      <button class="btn-add-cart" onclick="addToCart('${c.code}')">+ AGGIUNGI AL CARRELLO</button>
    </div>`).join('');
}
window.filterCatalog = function() {
  catSearch = document.getElementById('catSearch').value.toLowerCase();
  renderCatalog();
};
window.setCatFilter = function(f, btn) {
  catFilter = f;
  document.querySelectorAll('.c-filter-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderCatalog();
};

/* ── CART ───────────────────────────────────────────── */
let cart = [];
function addToCart(code) {
  const existing = cart.find(c=>c.code===code);
  if(existing){
    existing.qty++;
    updateCartFab();
    showToast(code+' — quantità: '+existing.qty);
  } else {
    const item = CATALOG.find(c=>c.code===code);
    if(item){ cart.push({...item,qty:1}); updateCartFab(); showToast('Aggiunto: '+code); }
  }
}
window.addToCart = addToCart;
window.quickAddToCart = function(code, ship) {
  addToCart(code);
  document.getElementById('orderShip').value = ship;
};
function updateCartFab() {
  const total = cart.reduce((a,c)=>a+c.qty,0);
  document.getElementById('cartCount').textContent = total;
  document.getElementById('cartFab').style.display = total ? 'flex' : 'none';
}
window.removeFromCart = function(code) {
  cart = cart.filter(c=>c.code!==code);
  updateCartFab();
  renderOrderItems();
};
window.changeQty = function(code, delta) {
  const item = cart.find(c=>c.code===code);
  if(!item) return;
  item.qty = Math.max(1, item.qty + delta);
  updateCartFab();
  renderOrderItems();
};

/* ── ORDER MODAL ─────────────────────────────────────── */
function populateOrderShips(ships) {
  const sel = document.getElementById('orderShip');
  sel.innerHTML = ships.map(s=>`<option value="${s.name}">${s.name}</option>`).join('');
}
function populatePorts() {
  const selDel = document.getElementById('deliveryPort');
  const selOrd = document.getElementById('orderPort');
  const opts = PORTS.map(p=>`<option value="${p.name}">${p.name}</option>`).join('');
  selDel.innerHTML = '<option value="">— Seleziona porto —</option>'+opts;
  selOrd.innerHTML = '<option value="">— Seleziona porto di consegna —</option>'+opts;
  selDel.onchange = calcDelivery;
}
function renderOrderItems() {
  const total = cart.reduce((a,c)=>a+c.price*c.qty,0);
  document.getElementById('orderItems').innerHTML = cart.length
    ? cart.map(c=>`
      <div class="c-order-item">
        <div style="flex:1;min-width:0">
          <div><strong>${c.code}</strong> — ${c.name}</div>
          <div style="color:var(--grigio);font-size:11px;margin-top:2px">€${c.price.toLocaleString('it-IT')} × ${c.qty} = <strong style="color:var(--verde)">€${(c.price*c.qty).toLocaleString('it-IT')}</strong></div>
        </div>
        <div style="display:flex;align-items:center;gap:6px;flex-shrink:0">
          <button onclick="changeQty('${c.code}',-1)" style="width:26px;height:26px;background:rgba(255,255,255,.06);border:1px solid rgba(0,87,184,.3);border-radius:3px;color:#fff;cursor:pointer;font-size:14px;line-height:1">−</button>
          <span style="font-family:var(--F);font-size:14px;min-width:20px;text-align:center">${c.qty}</span>
          <button onclick="changeQty('${c.code}',1)" style="width:26px;height:26px;background:rgba(255,255,255,.06);border:1px solid rgba(0,87,184,.3);border-radius:3px;color:#fff;cursor:pointer;font-size:14px;line-height:1">+</button>
          <button class="c-order-item-remove" onclick="removeFromCart('${c.code}')" style="margin-left:4px">✕</button>
        </div>
      </div>`).join('')
    + `<div style="border-top:1px solid rgba(0,87,184,.2);margin-top:12px;padding-top:12px;display:flex;justify-content:space-between;align-items:center">
        <span style="font-family:var(--F);font-size:11px;letter-spacing:2px;color:var(--grigio)">TOTALE ORDINE</span>
        <span style="font-family:var(--F);font-size:22px;font-weight:700;color:var(--verde)">€${total.toLocaleString('it-IT')}</span>
      </div>`
    : '<p style="color:var(--grigio);font-size:13px">Nessun articolo nel carrello</p>';
}
window.openOrderModal = function() {
  renderOrderItems();
  document.getElementById('orderModal').classList.add('open');
  document.body.style.overflow='hidden';
};
window.closeOrderModal = function() {
  document.getElementById('orderModal').classList.remove('open');
  document.body.style.overflow='';
};
window.submitOrder = async function() {
  if(!cart.length){ showToast('Nessun articolo selezionato','error'); return; }
  const ship = document.getElementById('orderShip').value;
  const port = document.getElementById('orderPort').value;
  const note = document.getElementById('orderNote').value;
  if(!port){ showToast('Seleziona un porto di consegna','error'); return; }
  const btn = document.getElementById('submitOrderBtn');
  btn.disabled=true; btn.textContent='INVIO…';
  const order = {
    clientId: currentUser, company: currentCompany,
    fleet: currentFleet, ship, port,
    items: cart.map(c=>({code:c.code,name:c.name,price:c.price,qty:c.qty})),
    totalEur: cart.reduce((a,c)=>a+c.price*c.qty,0),
    note
  };
  const res = await fsSubmit(order);
  btn.disabled=false; btn.textContent='INVIA RICHIESTA →';
  if(res.ok){
    cart=[];
    updateCartFab();
    closeOrderModal();
    showToast('Ordine inviato a RCS! ID: '+res.id.slice(0,8));
    document.getElementById('kpiOrdini').textContent = '✓';
    loadOrders();
  } else {
    showToast('Errore invio ordine: '+res.err,'error');
  }
};

/* ── DELIVERY CONFIGURATOR ───────────────────────────── */
window.calcDelivery = function() {
  const portName = document.getElementById('deliveryPort').value;
  const mode = document.getElementById('deliveryMode').value;
  const el = document.getElementById('deliveryResult');
  if(!portName){ el.style.display='none'; return; }
  const port = PORTS.find(p=>p.name===portName);
  if(!port){ el.style.display='none'; return; }
  const times = { standard: port.std, express: port.exp, air: port.air };
  const modeLabel = {standard:'Stradale/Marittima',express:'Express DHL/TNT',air:'Aerea + corriere locale'};
  el.style.display='block';
  el.innerHTML = `
    <div class="c-delivery-result-title">Stima consegna: <strong style="color:var(--cyan)">${portName}</strong></div>
    <div class="c-delivery-row"><span>Modalità selezionata</span><span class="c-delivery-val">${modeLabel[mode]}</span></div>
    <div class="c-delivery-row"><span>Tempo stimato</span><span class="c-delivery-val">${times[mode]}</span></div>
    <div class="c-delivery-row"><span>Partenza da</span><span class="c-delivery-val">Catania (CT), Sicilia</span></div>
    <div class="c-delivery-row"><span>Note</span><span style="color:var(--grigio);font-size:12px">${port.note}</span></div>
    <div style="margin-top:14px;font-size:11px;color:var(--grigio)">
      * Tempi indicativi in giorni lavorativi dalla conferma d'ordine. Per spedizioni urgenti contattare RCS direttamente.
    </div>
    <button onclick="orderFromDelivery('${portName}')" style="margin-top:16px;width:100%;padding:12px;background:var(--blu);border:none;border-radius:3px;color:#fff;font-family:var(--F);font-size:13px;letter-spacing:2px;cursor:pointer;font-weight:700">
      + CREA ORDINE PER QUESTO PORTO →
    </button>`;
};

window.orderFromDelivery = function(portName) {
  document.getElementById('orderPort').value = portName;
  openOrderModal();
};

/* ── ROUTE DATA ──────────────────────────────────────── */
const PORT_COORDS = {
  'Valletta':     [35.896, 14.513],
  'Pozzallo':     [36.728, 14.849],
  'Catania':      [37.502, 15.087],
  'Napoli':       [40.839, 14.253],
  'Gozo (Mġarr)':[36.024, 14.297],
  'Tarifa':       [36.014, -5.605],
  'Tangeri':      [35.765, -5.800],
  'Marsaxlokk':  [35.840, 14.540],
  'Grand Harbour':[35.893, 14.521],
  'Palermo':      [38.115, 13.361],
  'Messina':      [38.192, 15.556],
  'Bari':         [41.118, 16.872],
};

const ROUTE_DATA = {
  virtu: [
    { ship:'MV Saint John Paul II', color:'#00d4ff',
      history:[
        { label:'Gen–Mar 2025', legs:['Valletta','Pozzallo','Catania'], status:'storico' },
        { label:'Apr–Mag 2025', legs:['Valletta','Pozzallo','Catania'], status:'storico' },
      ],
      current: { label:'Giu–Ago 2025', legs:['Valletta','Pozzallo','Catania'], status:'attuale' },
      planned: [
        { label:'Set–Dic 2025', legs:['Valletta','Pozzallo','Catania'], status:'pianificata' },
      ]
    },
    { ship:'MV Jean de La Valette', color:'#00e676',
      history:[
        { label:'Gen–Mar 2025', legs:['Valletta','Pozzallo','Napoli'], status:'storico' },
      ],
      current: { label:'Apr–Ago 2025', legs:['Valletta','Pozzallo','Napoli'], status:'attuale' },
      planned: [
        { label:'Set–Dic 2025', legs:['Valletta','Pozzallo','Napoli'], status:'pianificata' },
      ]
    },
    { ship:'MV Maria Dolores', color:'#ff9800',
      history:[
        { label:'2024 — Valletta–Pozzallo', legs:['Valletta','Pozzallo'], status:'storico' },
      ],
      current: { label:'2025 Charter — Tarifa–Tangeri', legs:['Tarifa','Tangeri'], status:'attuale' },
      planned: [
        { label:'Gen 2026 — Rientro flotta', legs:['Tangeri','Valletta'], status:'pianificata' },
      ]
    },
    { ship:'HSC Gozo Express', color:'#e040fb',
      history:[
        { label:'2024 — Valletta–Gozo', legs:['Valletta','Gozo (Mġarr)'], status:'storico' },
      ],
      current: { label:'2025 — Valletta–Gozo (Mġarr)', legs:['Valletta','Gozo (Mġarr)'], status:'attuale' },
      planned: [
        { label:'2026 — Servizio esteso Pozzallo', legs:['Valletta','Gozo (Mġarr)','Pozzallo'], status:'pianificata' },
      ]
    },
    { ship:'San Frangisk', color:'#ff4444',
      history:[{ label:'2024 — Valletta–Gozo', legs:['Valletta','Gozo (Mġarr)'], status:'storico' }],
      current: { label:'2025 — Valletta–Gozo', legs:['Valletta','Gozo (Mġarr)'], status:'attuale' },
      planned: []
    },
    { ship:'Balluta Bay', color:'#7a9abf',
      history:[{ label:'2024 — Supporto logistico', legs:['Valletta','Marsaxlokk'], status:'storico' }],
      current: { label:'2025 — Supporto logistico', legs:['Valletta','Marsaxlokk'], status:'attuale' },
      planned: []
    },
  ],
  tug: [
    { ship:'MT Vittoriosa', color:'#00d4ff',
      history:[{ label:'2024 — Grand Harbour', legs:['Grand Harbour','Marsaxlokk'], status:'storico' }],
      current: { label:'2025 — Grand Harbour manovra', legs:['Grand Harbour','Valletta'], status:'attuale' },
      planned: [{ label:'2026 — Espansione Marsaxlokk', legs:['Grand Harbour','Marsaxlokk'], status:'pianificata' }]
    },
    { ship:'MT St. Angelo', color:'#00e676',
      history:[{ label:'2024 — Grand Harbour', legs:['Grand Harbour','Valletta'], status:'storico' }],
      current: { label:'2025 — Grand Harbour', legs:['Grand Harbour','Valletta'], status:'attuale' },
      planned: []
    },
    { ship:'MT Senglea', color:'#ff9800',
      history:[],
      current: { label:'2025 — Grand Harbour', legs:['Grand Harbour','Valletta'], status:'attuale' },
      planned: [{ label:'2026 — Supporto Marsaxlokk', legs:['Grand Harbour','Marsaxlokk'], status:'pianificata' }]
    },
    { ship:'MT Sea Salvor', color:'#ff4444',
      history:[{ label:'2024 — Pattugliamento', legs:['Valletta','Pozzallo'], status:'storico' }],
      current: { label:'2025 — Pattugliamento / emergenze', legs:['Valletta','Marsaxlokk','Pozzallo'], status:'attuale' },
      planned: []
    },
  ]
};

function initRouteMap(ships) {
  const center = currentFleet==='virtu' ? [37.0,10.0] : [35.89,14.52];
  const zoom   = currentFleet==='virtu' ? 5 : 10;
  const map = L.map('route-map',{zoomControl:true}).setView(center,zoom);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{
    attribution:'© OpenStreetMap · CartoDB', maxZoom:18
  }).addTo(map);

  const routes = ROUTE_DATA[currentFleet] || [];
  routes.forEach(r=>{
    const drawLegs = (legs, color, dash) => {
      const coords = legs.map(p=>PORT_COORDS[p]).filter(Boolean);
      if(coords.length<2) return;
      L.polyline(coords,{color,weight:2.5,opacity:.7,dashArray:dash||null}).addTo(map);
      coords.forEach((c,i)=>{
        const icon=L.divIcon({
          html:`<div style="background:${color};width:8px;height:8px;border-radius:50%;border:2px solid #fff"></div>`,
          iconSize:[8,8],className:''
        });
        L.marker(c,{icon}).addTo(map)
          .bindPopup(`<b>${legs[i]}</b><br><span style="font-size:11px;color:#aaa">${r.ship}</span>`);
      });
    };
    r.history.forEach(h=>drawLegs(h.legs,'#7a9abf','4 4'));
    if(r.current) drawLegs(r.current.legs, r.color, null);
    r.planned.forEach(p=>drawLegs(p.legs,'#ff9800','6 3'));
  });
}

function renderRouteSchedule() {
  const routes = ROUTE_DATA[currentFleet] || [];
  const el = document.getElementById('routeSchedule');
  el.innerHTML = routes.map(r=>{
    const allLegs = [
      ...r.history.map(h=>({...h})),
      r.current ? {...r.current} : null,
      ...r.planned.map(p=>({...p}))
    ].filter(Boolean);
    const statusStyle = {
      storico:    'background:rgba(122,154,191,.15);color:#7a9abf;border:1px solid rgba(122,154,191,.3)',
      attuale:    'background:rgba(0,212,255,.12);color:#00d4ff;border:1px solid rgba(0,212,255,.3)',
      pianificata:'background:rgba(255,152,0,.12);color:#ff9800;border:1px solid rgba(255,152,0,.3)'
    };
    return `
    <div style="margin-bottom:20px;border:1px solid rgba(0,87,184,.15);border-radius:6px;overflow:hidden">
      <div style="background:rgba(0,87,184,.12);padding:12px 16px;display:flex;align-items:center;gap:12px">
        <span style="width:10px;height:10px;border-radius:50%;background:${r.color};display:inline-block;flex-shrink:0"></span>
        <span style="font-family:var(--F);font-size:14px;letter-spacing:2px;font-weight:700">${r.ship}</span>
      </div>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-size:12px">
          <thead><tr style="border-bottom:1px solid rgba(0,87,184,.15)">
            <th style="padding:8px 14px;text-align:left;font-family:var(--F);font-size:10px;letter-spacing:1.5px;color:#7a9abf">PERIODO</th>
            <th style="padding:8px 14px;text-align:left;font-family:var(--F);font-size:10px;letter-spacing:1.5px;color:#7a9abf">ROTTA</th>
            <th style="padding:8px 14px;text-align:left;font-family:var(--F);font-size:10px;letter-spacing:1.5px;color:#7a9abf">STATO</th>
          </tr></thead>
          <tbody>
            ${allLegs.map(l=>`
            <tr style="border-bottom:1px solid rgba(0,87,184,.07)">
              <td style="padding:9px 14px;color:#aac">${l.label}</td>
              <td style="padding:9px 14px;font-weight:600">${l.legs.join(' → ')}</td>
              <td style="padding:9px 14px">
                <span style="font-family:var(--F);font-size:9px;letter-spacing:1.5px;padding:3px 8px;border-radius:2px;${statusStyle[l.status]}">${l.status.toUpperCase()}</span>
              </td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
  }).join('');
}

/* ── AIS MAP ─────────────────────────────────────────── */
function initMap(ships) {
  const center = currentFleet==='virtu' ? [35.90,14.52] : [35.89,14.52];
  const map = L.map('ais-map',{zoomControl:true}).setView(center,9);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',{
    attribution:'© OpenStreetMap · CartoDB',maxZoom:18
  }).addTo(map);
  ships.forEach(s=>{
    if(!s.lat||!s.lon) return;
    const col = s.wear>=80?'#ff4444':s.wear>=55?'#ff9800':'#00e676';
    const icon = L.divIcon({
      html:`<div style="background:${col};width:12px;height:12px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 8px ${col}"></div>`,
      iconSize:[12,12],className:''
    });
    L.marker([s.lat,s.lon],{icon})
      .addTo(map)
      .bindPopup(`<b>${s.name}</b><br>${s.type}<br>Usura: <b>${s.wear}%</b><br>IMO: ${s.imo}<br>Rotta: ${s.route}`);
  });
}

/* ── ORDERS LIST ─────────────────────────────────────── */
async function loadOrders() {
  const orders = await getOrders(currentUser);
  document.getElementById('kpiOrdini').textContent = orders.filter(o=>o.status==='pending').length;
  const el = document.getElementById('ordiniList');
  if(!orders.length){
    el.innerHTML='<p class="c-orders-empty">Nessun ordine trovato</p>'; return;
  }
  el.innerHTML=`
  <table class="c-orders-table">
    <thead><tr><th>DATA</th><th>NAVE</th><th>ARTICOLI</th><th>PORTO</th><th>TOTALE</th><th>STATO</th></tr></thead>
    <tbody>${orders.map(o=>{
      const dt = o.createdAt?.toDate?.()?.toLocaleDateString('it-IT') || '—';
      const stCol = o.status==='pending'?'#ffb74d':o.status==='confirmed'?'var(--verde)':'var(--grigio)';
      const stLbl = {pending:'IN ATTESA',confirmed:'CONFERMATO',shipped:'SPEDITO',delivered:'CONSEGNATO'}[o.status]||o.status;
      return `<tr>
        <td>${dt}</td>
        <td>${o.ship||'—'}</td>
        <td>${(o.items||[]).map(i=>i.code).join(', ')}</td>
        <td>${o.port||'—'}</td>
        <td style="font-family:var(--F);color:var(--verde)">€${(o.totalEur||0).toLocaleString('it-IT')}</td>
        <td style="font-family:var(--F);font-size:11px;color:${stCol}">${stLbl}</td>
      </tr>`;
    }).join('')}</tbody>
  </table>`;
}

/* ── TOAST ──────────────────────────────────────────── */
function showToast(msg, type='') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'c-toast'+(type?' '+type:'');
  setTimeout(()=>t.classList.add('show'), 10);
  setTimeout(()=>t.classList.remove('show'), 3500);
}

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'});
}
window.scrollTo = scrollTo;
