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
    {
      name: "MV Saint John Paul II",
      type: "High Speed Craft · Ro-Pax",
      flag: "🇲🇹",
      wear: 25,
      engine: "4× MTU 20V 8000 M71L",
      year: 2019,
      note: "36.400 kW · 38 kn · 900 pax · IMO 9762337",
      photoUrl: "assets/img/vessels/MV-Saint-John-Paul-II.jpg",
      specifications: {
        capacity_passengers: 900,
        capacity_cargo_tons: 2500,
        weight_empty_tons: 45000,
        weight_full_tons: 52000,
        max_cargo_tons: 7000,
        autonomy_days: 14,
        tank_capacity_liters: 850000,
        ship_class: "Lloyd's Register",
        gross_tonnage: 67000,
        length_m: 210.5,
        beam_m: 32.2,
        draft_m: 6.8,
        main_engines: [{type: "MTU 20V 8000 M71L", kw: 9100, qty: 4}],
        secondary_engines: [{type: "Diesel generator", kw: 1500, qty: 2}],
        builder: "Fincantieri",
        classification: "Catamarano high-speed",
        imo_number: 9762337
      },
      routes: [
        {name: "Valletta - Pozzallo", distance_nm: 185, voyage_time_hours: 5.5, frequency: "Daily", cargo_type: "Mixed"},
        {name: "Valletta - Catania", distance_nm: 240, voyage_time_hours: 6.5, frequency: "Daily", cargo_type: "Passeggeri + veicoli"},
        {name: "Valletta - Tarifa", distance_nm: 310, voyage_time_hours: 8, frequency: "Seasonal", cargo_type: "Passeggeri + carico"}
      ],
      images: [
        {url: "assets/img/vessels/MV-Saint-John-Paul-II.jpg", caption: "Profilo nave", type: "profile"},
        {url: "assets/img/vessels/MV-Saint-John-Paul-II-deck.jpg", caption: "Coperta principale", type: "deck"},
        {url: "assets/img/vessels/MV-Saint-John-Paul-II-engine.jpg", caption: "Camera motori", type: "engine"}
      ]
    },
    {
      name: "MV Jean de La Valette",
      type: "High Speed Craft · Ro-Pax",
      flag: "🇲🇹",
      wear: 56,
      engine: "4× MTU 20V 8000 M71L",
      year: 2010,
      note: "36.400 kW · 39 kn · 800 pax · IMO 9468946",
      photoUrl: "assets/img/vessels/MV-Jean-de-La-Valette.jpg",
      specifications: {
        capacity_passengers: 800,
        capacity_cargo_tons: 2300,
        weight_empty_tons: 44000,
        weight_full_tons: 51000,
        max_cargo_tons: 6800,
        autonomy_days: 13,
        tank_capacity_liters: 820000,
        ship_class: "Lloyd's Register",
        gross_tonnage: 65500,
        length_m: 208.5,
        beam_m: 31.8,
        draft_m: 6.6,
        main_engines: [{type: "MTU 20V 8000 M71L", kw: 9100, qty: 4}],
        secondary_engines: [{type: "Diesel generator", kw: 1500, qty: 2}],
        builder: "Fincantieri",
        classification: "Catamarano high-speed",
        imo_number: 9468946
      },
      routes: [
        {name: "Valletta - Pozzallo", distance_nm: 185, voyage_time_hours: 5.5, frequency: "Daily", cargo_type: "Mixed"},
        {name: "Valletta - Napoli", distance_nm: 420, voyage_time_hours: 11, frequency: "4× weekly", cargo_type: "Passeggeri"}
      ],
      images: [
        {url: "assets/img/vessels/MV-Jean-de-La-Valette.jpg", caption: "Profilo nave", type: "profile"}
      ]
    },
    {
      name: "MV Maria Dolores",
      type: "High Speed Craft · Ro-Pax · In Charter",
      flag: "🇲🇹",
      wear: 70,
      engine: "6× MTU 16V 4000 M73L",
      year: 2006,
      note: "🟠 ALTO · 36 kn · 600 pax · Charter Tarifa–Tangeri 2025",
      photoUrl: "assets/img/vessels/MV-Maria-Dolores.jpg",
      specifications: {
        capacity_passengers: 600,
        capacity_cargo_tons: 1800,
        weight_empty_tons: 38000,
        weight_full_tons: 45000,
        max_cargo_tons: 5000,
        autonomy_days: 10,
        tank_capacity_liters: 650000,
        ship_class: "ABS",
        gross_tonnage: 58500,
        length_m: 195,
        beam_m: 28.5,
        draft_m: 6.0,
        main_engines: [{type: "MTU 16V 4000 M73L", kw: 5840, qty: 6}],
        secondary_engines: [{type: "Diesel generator", kw: 1200, qty: 2}],
        builder: "Austal",
        classification: "Catamarano high-speed",
        imo_number: 9333333
      },
      routes: [
        {name: "Tarifa - Tangeri", distance_nm: 45, voyage_time_hours: 1.2, frequency: "Multiple daily", cargo_type: "Passeggeri"},
        {name: "Tarifa - Ceuta", distance_nm: 18, voyage_time_hours: 0.5, frequency: "Multiple daily", cargo_type: "Passeggeri"}
      ],
      images: [
        {url: "assets/img/vessels/MV-Maria-Dolores.jpg", caption: "Profilo nave", type: "profile"}
      ]
    },
    {
      name: "HSC Gozo Express",
      type: "High Speed Craft · Catamarano",
      flag: "🇲🇹",
      wear: 54,
      engine: "4× MTU 12V 2000 M72",
      year: 2008,
      note: "34 kn · 322 pax · IMO 9396753",
      photoUrl: "assets/img/vessels/HSC-Gozo-Express.jpg",
      specifications: {
        capacity_passengers: 322,
        capacity_cargo_tons: 850,
        weight_empty_tons: 22000,
        weight_full_tons: 26000,
        max_cargo_tons: 2500,
        autonomy_days: 7,
        tank_capacity_liters: 380000,
        ship_class: "Lloyd's Register",
        gross_tonnage: 32000,
        length_m: 127.5,
        beam_m: 20.5,
        draft_m: 4.2,
        main_engines: [{type: "MTU 12V 2000 M72", kw: 1800, qty: 4}],
        secondary_engines: [{type: "Diesel generator", kw: 600, qty: 2}],
        builder: "Austal",
        classification: "Catamarano",
        imo_number: 9396753
      },
      routes: [
        {name: "Valletta - Gozo (Mgarr)", distance_nm: 24, voyage_time_hours: 0.75, frequency: "Multiple daily", cargo_type: "Passeggeri"}
      ],
      images: [
        {url: "assets/img/vessels/HSC-Gozo-Express.jpg", caption: "Profilo nave", type: "profile"}
      ]
    },
    {
      name: "San Frangisk",
      type: "Air Cushion Catamaran",
      flag: "🇲🇹",
      wear: 90,
      engine: "2× Deutz MWM 620B V16",
      year: 1990,
      note: "🔴 CRITICO · 38 kn · 330 pax · IMO 8903899",
      photoUrl: "assets/img/vessels/San-Frangisk.jpg",
      specifications: {
        capacity_passengers: 330,
        capacity_cargo_tons: 900,
        weight_empty_tons: 24000,
        weight_full_tons: 28500,
        max_cargo_tons: 2800,
        autonomy_days: 6,
        tank_capacity_liters: 420000,
        ship_class: "Lloyd's Register",
        gross_tonnage: 35000,
        length_m: 135,
        beam_m: 22,
        draft_m: 3.8,
        main_engines: [{type: "Deutz MWM 620B V16", kw: 3600, qty: 2}],
        secondary_engines: [{type: "Diesel generator", kw: 700, qty: 2}],
        builder: "Wartsila",
        classification: "Air-Cushion Catamaran",
        imo_number: 8903899
      },
      routes: [
        {name: "Valletta - Gozo", distance_nm: 24, voyage_time_hours: 0.65, frequency: "Multiple daily", cargo_type: "Passeggeri"}
      ],
      images: [
        {url: "assets/img/vessels/San-Frangisk.jpg", caption: "Profilo nave", type: "profile"}
      ]
    },
    {
      name: "San Pawl",
      type: "Air Cushion Catamaran · ⚠️ Ex-flotta",
      flag: "🇲🇹",
      wear: 88,
      engine: "2× Deutz MWM 604B V16",
      year: 1991,
      note: "Ceduta Islands Unlimited 2025 · IMO 8903904",
      photoUrl: "assets/img/vessels/San-Pawl.jpg",
      specifications: {
        capacity_passengers: 320,
        capacity_cargo_tons: 880,
        weight_empty_tons: 23500,
        weight_full_tons: 27800,
        max_cargo_tons: 2700,
        autonomy_days: 5.5,
        tank_capacity_liters: 410000,
        ship_class: "Lloyd's Register",
        gross_tonnage: 34000,
        length_m: 134,
        beam_m: 21.8,
        draft_m: 3.7,
        main_engines: [{type: "Deutz MWM 604B V16", kw: 3400, qty: 2}],
        secondary_engines: [{type: "Diesel generator", kw: 650, qty: 2}],
        builder: "Wartsila",
        classification: "Air-Cushion Catamaran",
        imo_number: 8903904
      },
      routes: [
        {name: "Archive - Ex Valletta - Gozo", distance_nm: 24, voyage_time_hours: 0.68, frequency: "Archived", cargo_type: "Storico"}
      ],
      images: [
        {url: "assets/img/vessels/San-Pawl.jpg", caption: "Profilo nave (archivio)", type: "profile"}
      ]
    },
    {
      name: "Balluta Bay",
      type: "Oil Products Tanker",
      flag: "🇲🇹",
      wear: 100,
      engine: "Convenzionale",
      year: 1981,
      note: "🔴 CRITICO · 12 kn · IMO 8013091",
      photoUrl: "assets/img/vessels/Balluta-Bay.jpg",
      specifications: {
        capacity_passengers: 0,
        capacity_cargo_tons: 4200,
        weight_empty_tons: 5800,
        weight_full_tons: 10000,
        max_cargo_tons: 4200,
        autonomy_days: 16,
        tank_capacity_liters: 180000,
        ship_class: "ABS",
        gross_tonnage: 6800,
        length_m: 110,
        beam_m: 17.5,
        draft_m: 5.2,
        main_engines: [{type: "Motore convenzionale marino", kw: 880, qty: 1}],
        secondary_engines: [{type: "Diesel generator", kw: 300, qty: 1}],
        builder: "Costruzione Navale Italiana",
        classification: "Oil Products Tanker",
        imo_number: 8013091
      },
      routes: [
        {name: "Valletta - Siracusa", distance_nm: 180, voyage_time_hours: 15, frequency: "Weekly", cargo_type: "Prodotti petroliferi"}
      ],
      images: [
        {url: "assets/img/vessels/Balluta-Bay.jpg", caption: "Profilo nave (critico)", type: "profile"}
      ]
    }
  ],
  tug: [
    {
      name: "MT Vittoriosa",
      type: "ASD Escort Tug · RAstar 3000-W",
      flag: "🇲🇹",
      wear: 25,
      engine: "2× MTU 16V 4000 M65L",
      year: 2019,
      note: "81,5t BP · Med Marine Turchia · IMO 9854868",
      photoUrl: "assets/img/vessels/MT-Vittoriosa.jpg",
      specifications: {
        capacity_passengers: 0,
        capacity_cargo_tons: 85,
        weight_empty_tons: 4200,
        weight_full_tons: 4400,
        max_cargo_tons: 200,
        autonomy_days: 20,
        tank_capacity_liters: 280000,
        ship_class: "Lloyd's Register",
        gross_tonnage: 3200,
        length_m: 75.5,
        beam_m: 16.2,
        draft_m: 4.8,
        main_engines: [{type: "MTU 16V 4000 M65L", kw: 2800, qty: 2}],
        secondary_engines: [{type: "Diesel generator", kw: 600, qty: 2}],
        builder: "Med Marine",
        classification: "ASD Escort Tug",
        imo_number: 9854868
      },
      routes: [
        {name: "Porto Valletta - Area Operativa", distance_nm: 50, voyage_time_hours: 6, frequency: "Daily", cargo_type: "Assist operations"}
      ],
      images: [
        {url: "assets/img/vessels/MT-Vittoriosa.jpg", caption: "Profilo rimorchiatore", type: "profile"}
      ]
    },
    {
      name: "MT St. Angelo",
      type: "ASD Tug · Damen ASD 2913",
      flag: "🇲🇹",
      wear: 29,
      engine: "2× Caterpillar 3516C",
      year: 2017,
      note: "83,0t BP · Damen Galati · IMO 9799991",
      photoUrl: "assets/img/vessels/MT-St-Angelo.jpg",
      specifications: {
        capacity_passengers: 0,
        capacity_cargo_tons: 83,
        weight_empty_tons: 4100,
        weight_full_tons: 4300,
        max_cargo_tons: 190,
        autonomy_days: 18,
        tank_capacity_liters: 270000,
        ship_class: "Lloyd's Register",
        gross_tonnage: 3100,
        length_m: 73.5,
        beam_m: 15.8,
        draft_m: 4.6,
        main_engines: [{type: "Caterpillar 3516C", kw: 2610, qty: 2}],
        secondary_engines: [{type: "Diesel generator", kw: 550, qty: 2}],
        builder: "Damen Shipyards",
        classification: "ASD Tug",
        imo_number: 9799991
      },
      routes: [
        {name: "Porto Valletta - Operazioni", distance_nm: 50, voyage_time_hours: 6.5, frequency: "Daily", cargo_type: "Assist"}
      ],
      images: [
        {url: "assets/img/vessels/MT-St-Angelo.jpg", caption: "Profilo rimorchiatore", type: "profile"}
      ]
    },
    {
      name: "MT Senglea",
      type: "RSD Tug · Damen RSD 2513",
      flag: "🇲🇹",
      wear: 19,
      engine: "2× Caterpillar 3516C",
      year: 2020,
      note: "80,0t BP · Damen Vietnam · IMO 9892195",
      photoUrl: "assets/img/vessels/MT-Senglea.jpg",
      specifications: {
        capacity_passengers: 0,
        capacity_cargo_tons: 80,
        weight_empty_tons: 3950,
        weight_full_tons: 4150,
        max_cargo_tons: 185,
        autonomy_days: 17,
        tank_capacity_liters: 250000,
        ship_class: "Lloyd's Register",
        gross_tonnage: 2950,
        length_m: 71.2,
        beam_m: 15.3,
        draft_m: 4.4,
        main_engines: [{type: "Caterpillar 3516C", kw: 2610, qty: 2}],
        secondary_engines: [{type: "Diesel generator", kw: 520, qty: 2}],
        builder: "Damen Shipyards",
        classification: "RSD Tug",
        imo_number: 9892195
      },
      routes: [
        {name: "Porto Valletta - Operazioni", distance_nm: 50, voyage_time_hours: 6.5, frequency: "Daily", cargo_type: "Assist"}
      ],
      images: [
        {url: "assets/img/vessels/MT-Senglea.jpg", caption: "Profilo rimorchiatore", type: "profile"}
      ]
    },
    {
      name: "MT Med Aldebaran",
      type: "RSD Tug · Damen RSD 2513 Tier III",
      flag: "🇲🇹",
      wear: 6,
      engine: "2× Caterpillar 3516C",
      year: 2024,
      note: "80,0t BP · IMO Tier III · IMO 9740392",
      photoUrl: "assets/img/vessels/MT-Med-Aldebaran.jpg",
      specifications: {
        capacity_passengers: 0,
        capacity_cargo_tons: 80,
        weight_empty_tons: 3950,
        weight_full_tons: 4150,
        max_cargo_tons: 185,
        autonomy_days: 18,
        tank_capacity_liters: 260000,
        ship_class: "Lloyd's Register Tier III",
        gross_tonnage: 2950,
        length_m: 71.2,
        beam_m: 15.3,
        draft_m: 4.4,
        main_engines: [{type: "Caterpillar 3516C (Tier III)", kw: 2610, qty: 2}],
        secondary_engines: [{type: "Diesel generator", kw: 540, qty: 2}],
        builder: "Damen Shipyards",
        classification: "RSD Tug Tier III",
        imo_number: 9740392
      },
      routes: [
        {name: "Porto Valletta - Operazioni", distance_nm: 50, voyage_time_hours: 6.5, frequency: "Daily", cargo_type: "Assist"}
      ],
      images: [
        {url: "assets/img/vessels/MT-Med-Aldebaran.jpg", caption: "Profilo rimorchiatore (nuovo)", type: "profile"}
      ]
    },
    {
      name: "MT St. Elmo",
      type: "ASD Escort Tug · RAmparts 3000W",
      flag: "🇲🇹",
      wear: 48,
      engine: "2× Caterpillar 3516C",
      year: 2011,
      note: "75,0t BP · Zamakona Spagna · IMO 9594999",
      photoUrl: "assets/img/vessels/MT-St-Elmo.jpg",
      specifications: {
        capacity_passengers: 0,
        capacity_cargo_tons: 75,
        weight_empty_tons: 3800,
        weight_full_tons: 3950,
        max_cargo_tons: 175,
        autonomy_days: 15,
        tank_capacity_liters: 230000,
        ship_class: "Lloyd's Register",
        gross_tonnage: 2850,
        length_m: 68.8,
        beam_m: 14.8,
        draft_m: 4.2,
        main_engines: [{type: "Caterpillar 3516C", kw: 2610, qty: 2}],
        secondary_engines: [{type: "Diesel generator", kw: 500, qty: 2}],
        builder: "Zamakona Shipyards",
        classification: "ASD Escort Tug",
        imo_number: 9594999
      },
      routes: [
        {name: "Porto Valletta - Operazioni", distance_nm: 50, voyage_time_hours: 7, frequency: "Daily", cargo_type: "Assist"}
      ],
      images: [
        {url: "assets/img/vessels/MT-St-Elmo.jpg", caption: "Profilo rimorchiatore", type: "profile"}
      ]
    },
    {
      name: "MT Spinola",
      type: "VSP Tractor Tug · AVT 36/80",
      flag: "🇲🇹",
      wear: 34,
      engine: "2× MaK 8M25",
      year: 2009,
      note: "81,6t BP · Voith 32R5 · IMO 9495258",
      photoUrl: "assets/img/vessels/MT-Spinola.jpg",
      specifications: {
        capacity_passengers: 0,
        capacity_cargo_tons: 81.6,
        weight_empty_tons: 4050,
        weight_full_tons: 4220,
        max_cargo_tons: 190,
        autonomy_days: 16,
        tank_capacity_liters: 240000,
        ship_class: "Lloyd's Register",
        gross_tonnage: 3050,
        length_m: 72.5,
        beam_m: 15.5,
        draft_m: 4.5,
        main_engines: [{type: "MaK 8M25C", kw: 1280, qty: 2}],
        secondary_engines: [{type: "Diesel generator", kw: 540, qty: 2}],
        builder: "Voith",
        classification: "VSP Tractor Tug",
        imo_number: 9495258
      },
      routes: [
        {name: "Porto Valletta - Operazioni", distance_nm: 50, voyage_time_hours: 7.2, frequency: "Daily", cargo_type: "Assist"}
      ],
      images: [
        {url: "assets/img/vessels/MT-Spinola.jpg", caption: "Profilo rimorchiatore", type: "profile"}
      ]
    },
    {
      name: "MT Wenzina",
      type: "ASD Tug · Damen ASD 2411",
      flag: "🇲🇹",
      wear: 64,
      engine: "2× Caterpillar 3516C",
      year: 2006,
      note: "72,5t BP · IMO 9364124",
      photoUrl: "assets/img/vessels/MT-Wenzina.jpg",
      specifications: {
        capacity_passengers: 0,
        capacity_cargo_tons: 72.5,
        weight_empty_tons: 3600,
        weight_full_tons: 3750,
        max_cargo_tons: 170,
        autonomy_days: 14,
        tank_capacity_liters: 210000,
        ship_class: "Lloyd's Register",
        gross_tonnage: 2700,
        length_m: 66.2,
        beam_m: 14.2,
        draft_m: 4.0,
        main_engines: [{type: "Caterpillar 3516C", kw: 2610, qty: 2}],
        secondary_engines: [{type: "Diesel generator", kw: 480, qty: 2}],
        builder: "Damen Shipyards",
        classification: "ASD Tug",
        imo_number: 9364124
      },
      routes: [
        {name: "Porto Valletta - Operazioni", distance_nm: 50, voyage_time_hours: 7.5, frequency: "Daily", cargo_type: "Assist"}
      ],
      images: [
        {url: "assets/img/vessels/MT-Wenzina.jpg", caption: "Profilo rimorchiatore", type: "profile"}
      ]
    },
    {
      name: "MT Pawlina",
      type: "ASD Tug · 🔴 CRITICO",
      flag: "🇲🇹",
      wear: 64,
      engine: "2× Caterpillar 3516B",
      year: 2006,
      note: "67,1t BP · IMO 9237929",
      photoUrl: "assets/img/vessels/MT-Pawlina.jpg",
      specifications: {
        capacity_passengers: 0,
        capacity_cargo_tons: 67.1,
        weight_empty_tons: 3400,
        weight_full_tons: 3550,
        max_cargo_tons: 160,
        autonomy_days: 13,
        tank_capacity_liters: 190000,
        ship_class: "ABS",
        gross_tonnage: 2550,
        length_m: 63.5,
        beam_m: 13.5,
        draft_m: 3.8,
        main_engines: [{type: "Caterpillar 3516B", kw: 2500, qty: 2}],
        secondary_engines: [{type: "Diesel generator", kw: 450, qty: 2}],
        builder: "Damen Shipyards",
        classification: "ASD Tug",
        imo_number: 9237929
      },
      routes: [
        {name: "Porto Valletta - Operazioni", distance_nm: 50, voyage_time_hours: 8, frequency: "Limited", cargo_type: "Assist"}
      ],
      images: [
        {url: "assets/img/vessels/MT-Pawlina.jpg", caption: "Profilo rimorchiatore (critico)", type: "profile"}
      ]
    },
    {
      name: "MT Sea Salvor",
      type: "Conventional Tug · Salvage",
      flag: "🇲🇹",
      wear: 90,
      engine: "2× Caterpillar 3516C",
      year: 1998,
      note: "🔴 CRITICO · 55,0t BP · IMO 9203100",
      photoUrl: "assets/img/vessels/MT-Sea-Salvor.jpg",
      specifications: {
        capacity_passengers: 0,
        capacity_cargo_tons: 55,
        weight_empty_tons: 2800,
        weight_full_tons: 2950,
        max_cargo_tons: 130,
        autonomy_days: 11,
        tank_capacity_liters: 150000,
        ship_class: "ABS",
        gross_tonnage: 2100,
        length_m: 57.8,
        beam_m: 12.5,
        draft_m: 3.6,
        main_engines: [{type: "Caterpillar 3516C", kw: 2610, qty: 2}],
        secondary_engines: [{type: "Diesel generator", kw: 400, qty: 1}],
        builder: "Costruzione Navale",
        classification: "Salvage Tug",
        imo_number: 9203100
      },
      routes: [
        {name: "Porto Valletta - Zone critiche", distance_nm: 40, voyage_time_hours: 8.5, frequency: "Limited", cargo_type: "Salvage operations"}
      ],
      images: [
        {url: "assets/img/vessels/MT-Sea-Salvor.jpg", caption: "Profilo rimorchiatore (critico)", type: "profile"}
      ]
    },
    {
      name: "MT Gozzo",
      type: "Mooring / Line Handler",
      flag: "🇲🇹",
      wear: 21,
      engine: "2× Volvo Diesel",
      year: 2019,
      note: "9,0t BP · Porto Valletta",
      photoUrl: "assets/img/vessels/MT-Gozzo.jpg",
      specifications: {
        capacity_passengers: 0,
        capacity_cargo_tons: 9,
        weight_empty_tons: 450,
        weight_full_tons: 480,
        max_cargo_tons: 30,
        autonomy_days: 4,
        tank_capacity_liters: 35000,
        ship_class: "Lloyd's Register",
        gross_tonnage: 350,
        length_m: 20.5,
        beam_m: 6.8,
        draft_m: 2.0,
        main_engines: [{type: "Volvo D13", kw: 480, qty: 2}],
        secondary_engines: [{type: "Outboard electric", kw: 50, qty: 1}],
        builder: "Valletta Shipyard",
        classification: "Mooring Vessel",
        imo_number: 9800000
      },
      routes: [
        {name: "Porto Valletta", distance_nm: 5, voyage_time_hours: 0.5, frequency: "Daily", cargo_type: "Porto operations"}
      ],
      images: [
        {url: "assets/img/vessels/MT-Gozzo.jpg", caption: "Piccolo ausiliario portuale", type: "profile"}
      ]
    }
  ],
  australia: [
    {
      name: "Spirit of Tasmania I",
      type: "RoPax Ferry",
      flag: "🇦🇺",
      wear: 54,
      engine: "4× Wärtsilä 9L46DF",
      year: 2001,
      note: "TT-Line · Geelong–Devonport",
      photoUrl: "assets/img/vessels/Spirit-of-Tasmania-I.jpg",
      specifications: {
        capacity_passengers: 1400,
        capacity_cargo_tons: 4800,
        weight_empty_tons: 28000,
        weight_full_tons: 35000,
        max_cargo_tons: 5200,
        autonomy_days: 7,
        tank_capacity_liters: 890000,
        ship_class: "Lloyd's Register",
        gross_tonnage: 30000,
        length_m: 179.6,
        beam_m: 27.2,
        draft_m: 6.5,
        main_engines: [{type: "Wärtsilä 9L46DF", kw: 20400, qty: 4}],
        secondary_engines: [{type: "Diesel generator", kw: 2000, qty: 2}],
        builder: "Flensburger Schiffbau",
        classification: "RoPax Ferry",
        imo_number: 9136206
      },
      routes: [
        {name: "Geelong - Devonport", distance_nm: 460, voyage_time_hours: 11, frequency: "Daily", cargo_type: "Passengers + vehicles"},
        {name: "Devonport - Geelong", distance_nm: 460, voyage_time_hours: 11, frequency: "Daily", cargo_type: "Passengers + vehicles"}
      ],
      images: [
        {url: "assets/img/vessels/Spirit-of-Tasmania-I.jpg", caption: "Profilo traghetto", type: "profile"}
      ]
    },
    {
      name: "Spirit of Tasmania IV",
      type: "RoPax Ferry · Dual-Fuel",
      flag: "🇦🇺",
      wear: 14,
      engine: "Wärtsilä 9L46DF (LNG)",
      year: 2022,
      note: "TT-Line · LNG Dual-Fuel",
      photoUrl: "assets/img/vessels/Spirit-of-Tasmania-IV.jpg",
      specifications: {
        capacity_passengers: 1500,
        capacity_cargo_tons: 5000,
        weight_empty_tons: 30000,
        weight_full_tons: 37500,
        max_cargo_tons: 5500,
        autonomy_days: 8,
        tank_capacity_liters: 950000,
        ship_class: "Lloyd's Register LNG",
        gross_tonnage: 32000,
        length_m: 181.5,
        beam_m: 28.0,
        draft_m: 6.8,
        main_engines: [{type: "Wärtsilä 9L46DF LNG", kw: 21000, qty: 1}],
        secondary_engines: [{type: "Diesel generator (LNG)", kw: 2200, qty: 2}],
        builder: "Meyer Werft",
        classification: "RoPax Ferry Dual-Fuel LNG",
        imo_number: 9731489
      },
      routes: [
        {name: "Geelong - Devonport", distance_nm: 460, voyage_time_hours: 10.5, frequency: "Daily", cargo_type: "Passengers + vehicles LNG"}
      ],
      images: [
        {url: "assets/img/vessels/Spirit-of-Tasmania-IV.jpg", caption: "Traghetto a fuel LNG", type: "profile"}
      ]
    },
    {
      name: "Iron Pilbara",
      type: "Bulk Carrier Support",
      flag: "🇦🇺",
      wear: 42,
      engine: "MAN B&W ME-C",
      year: 2013,
      note: "BHP Fleet · Port Hedland → Asia",
      photoUrl: "assets/img/vessels/Iron-Pilbara.jpg",
      specifications: {
        capacity_passengers: 0,
        capacity_cargo_tons: 68000,
        weight_empty_tons: 22000,
        weight_full_tons: 90000,
        max_cargo_tons: 68000,
        autonomy_days: 25,
        tank_capacity_liters: 1500000,
        ship_class: "Lloyd's Register",
        gross_tonnage: 45000,
        length_m: 228.5,
        beam_m: 32.2,
        draft_m: 10.8,
        main_engines: [{type: "MAN B&W ME-C", kw: 12000, qty: 1}],
        secondary_engines: [{type: "Diesel generator", kw: 1500, qty: 2}],
        builder: "China State Shipbuilding",
        classification: "Bulk Carrier",
        imo_number: 9618891
      },
      routes: [
        {name: "Port Hedland - Asia (China)", distance_nm: 3100, voyage_time_hours: 310, frequency: "Seasonal", cargo_type: "Iron ore"}
      ],
      images: [
        {url: "assets/img/vessels/Iron-Pilbara.jpg", caption: "Bulk carrier BHP", type: "profile"}
      ]
    },
    {
      name: "Fortescue Pioneer",
      type: "Mining Supply Vessel",
      flag: "🇦🇺",
      wear: 28,
      engine: "Caterpillar 3516C",
      year: 2016,
      note: "FMG Fleet · Dampier",
      photoUrl: "assets/img/vessels/Fortescue-Pioneer.jpg",
      specifications: {
        capacity_passengers: 12,
        capacity_cargo_tons: 3500,
        weight_empty_tons: 5200,
        weight_full_tons: 8700,
        max_cargo_tons: 3500,
        autonomy_days: 18,
        tank_capacity_liters: 520000,
        ship_class: "ABS",
        gross_tonnage: 5800,
        length_m: 95.5,
        beam_m: 18.5,
        draft_m: 5.8,
        main_engines: [{type: "Caterpillar 3516C", kw: 2610, qty: 2}],
        secondary_engines: [{type: "Diesel generator", kw: 700, qty: 2}],
        builder: "Damen Shipyards",
        classification: "Supply Vessel",
        imo_number: 9727365
      },
      routes: [
        {name: "Dampier - Offshore fields", distance_nm: 120, voyage_time_hours: 18, frequency: "Weekly", cargo_type: "Supplies & personnel"}
      ],
      images: [
        {url: "assets/img/vessels/Fortescue-Pioneer.jpg", caption: "Nave di approvvigionamento minerario", type: "profile"}
      ]
    },
    {
      name: "Svitzer Batavia",
      type: "ASD Tug",
      flag: "🇦🇺",
      wear: 32,
      engine: "Caterpillar 3516C",
      year: 2016,
      note: "Svitzer · Fremantle Port",
      photoUrl: "assets/img/vessels/Svitzer-Batavia.jpg",
      specifications: {
        capacity_passengers: 0,
        capacity_cargo_tons: 90,
        weight_empty_tons: 4300,
        weight_full_tons: 4500,
        max_cargo_tons: 200,
        autonomy_days: 19,
        tank_capacity_liters: 300000,
        ship_class: "Lloyd's Register",
        gross_tonnage: 3200,
        length_m: 75.5,
        beam_m: 16.2,
        draft_m: 4.8,
        main_engines: [{type: "Caterpillar 3516C", kw: 2610, qty: 2}],
        secondary_engines: [{type: "Diesel generator", kw: 650, qty: 2}],
        builder: "Damen Shipyards",
        classification: "ASD Tug",
        imo_number: 9706365
      },
      routes: [
        {name: "Fremantle Port - Operazioni", distance_nm: 30, voyage_time_hours: 4, frequency: "Daily", cargo_type: "Port assist"}
      ],
      images: [
        {url: "assets/img/vessels/Svitzer-Batavia.jpg", caption: "Rimorchiatore Fremantle", type: "profile"}
      ]
    },
    {
      name: "SeaSwift Aliesha",
      type: "Coastal Cargo Vessel",
      flag: "🇦🇺",
      wear: 44,
      engine: "Cummins QSK 60",
      year: 2013,
      note: "Cairns–Torres Strait",
      photoUrl: "assets/img/vessels/SeaSwift-Aliesha.jpg",
      specifications: {
        capacity_passengers: 0,
        capacity_cargo_tons: 1200,
        weight_empty_tons: 3100,
        weight_full_tons: 4300,
        max_cargo_tons: 1200,
        autonomy_days: 14,
        tank_capacity_liters: 380000,
        ship_class: "Lloyd's Register",
        gross_tonnage: 3500,
        length_m: 82.5,
        beam_m: 14.8,
        draft_m: 4.2,
        main_engines: [{type: "Cummins QSK 60", kw: 1500, qty: 1}],
        secondary_engines: [{type: "Diesel generator", kw: 450, qty: 2}],
        builder: "Austal",
        classification: "Coastal Cargo Vessel",
        imo_number: 9601487
      },
      routes: [
        {name: "Cairns - Torres Strait islands", distance_nm: 280, voyage_time_hours: 28, frequency: "Weekly", cargo_type: "General cargo"}
      ],
      images: [
        {url: "assets/img/vessels/SeaSwift-Aliesha.jpg", caption: "Nave costiera Australia", type: "profile"}
      ]
    }
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

  // ── GALLERY SECTION ──
  const galleryHtml = ship.photoUrl ? `
    <div style="margin-top:20px; margin-bottom:20px; border-bottom:1px solid rgba(0,87,184,.2); padding-bottom:20px;">
      <h3 style="color:#00d4ff; font-size:13px; margin-bottom:12px; letter-spacing:1px; font-family:var(--F);">FOTOGRAFIE</h3>
      <div style="margin-bottom:12px;">
        <img src="${ship.photoUrl}" style="width:100%; border-radius:8px; max-height:250px; object-fit:cover; border:1px solid rgba(0,87,184,.2);">
      </div>
      ${ship.images && ship.images.length > 1 ? `
        <div style="display:grid; grid-template-columns:repeat(${Math.min(3, ship.images.length)}, 1fr); gap:8px;">
          ${ship.images.slice(1).map(img => `
            <img src="${img.url}" alt="${img.caption}" title="${img.caption}" style="width:100%; height:80px; object-fit:cover; border-radius:4px; border:1px solid rgba(0,87,184,.2);">
          `).join('')}
        </div>
      ` : ''}
    </div>
  ` : '';

  // ── DETAILED SPECIFICATIONS ──
  const specsHtml = ship.specifications ? `
    <div style="margin-bottom:20px; border-bottom:1px solid rgba(0,87,184,.2); padding-bottom:20px;">
      <h3 style="color:#00d4ff; font-size:13px; margin-bottom:12px; letter-spacing:1px; font-family:var(--F);">SPECIFICHE TECNICHE</h3>
      <table class="modal-table" style="width:100%; font-size:11px;">
        <tr>
          <td><strong>Stazza lorda</strong></td>
          <td>${ship.specifications.gross_tonnage || '—'} t</td>
        </tr>
        <tr>
          <td><strong>Lunghezza</strong></td>
          <td>${ship.specifications.length_m || '—'} m</td>
        </tr>
        <tr>
          <td><strong>Larghezza</strong></td>
          <td>${ship.specifications.beam_m || '—'} m</td>
        </tr>
        <tr>
          <td><strong>Pescaggio</strong></td>
          <td>${ship.specifications.draft_m || '—'} m</td>
        </tr>
        <tr>
          <td><strong>Dislocamento (vuoto)</strong></td>
          <td>${ship.specifications.weight_empty_tons || '—'} t</td>
        </tr>
        <tr>
          <td><strong>Dislocamento (pieno)</strong></td>
          <td>${ship.specifications.weight_full_tons || '—'} t</td>
        </tr>
        <tr>
          <td><strong>Carico massimo</strong></td>
          <td>${ship.specifications.max_cargo_tons || '—'} t</td>
        </tr>
        <tr>
          <td><strong>Capacità carburante</strong></td>
          <td>${(ship.specifications.tank_capacity_liters || 0).toLocaleString('it-IT')} L</td>
        </tr>
        <tr>
          <td><strong>Autonomia</strong></td>
          <td>${ship.specifications.autonomy_days || '—'} giorni</td>
        </tr>
        <tr>
          <td><strong>Classe nave</strong></td>
          <td>${ship.specifications.ship_class || '—'}</td>
        </tr>
        <tr>
          <td><strong>Numero IMO</strong></td>
          <td>${ship.specifications.imo_number || '—'}</td>
        </tr>
      </table>
    </div>
  ` : '';

  // ── ROUTES SECTION ──
  const routesHtml = ship.routes && ship.routes.length > 0 ? `
    <div style="margin-bottom:20px; border-bottom:1px solid rgba(0,87,184,.2); padding-bottom:20px;">
      <h3 style="color:#00d4ff; font-size:13px; margin-bottom:12px; letter-spacing:1px; font-family:var(--F);">ROTTE OPERATIVE</h3>
      <div style="display:flex; flex-direction:column; gap:10px;">
        ${ship.routes.map(route => `
          <div style="background:rgba(0,87,184,.1); padding:10px; border-radius:6px; border-left:3px solid #00d4ff; font-size:11px;">
            <div style="color:#00d4ff; font-weight:700; margin-bottom:4px;">${route.name}</div>
            <div style="color:var(--grigio); line-height:1.6;">
              <div>Distanza: ${route.distance_nm} NM | Tempo: ${route.voyage_time_hours}h</div>
              <div>Frequenza: ${route.frequency} | Carico: ${route.cargo_type}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  ` : '';

  // Insert gallery and specs before components section
  const naveDetails = document.querySelector(".nave-details");
  naveDetails.innerHTML = naveDetails.innerHTML.replace(
    '<!-- COMPONENTI A RISCHIO -->',
    `${galleryHtml}${specsHtml}${routesHtml}<!-- COMPONENTI A RISCHIO -->`
  );

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
  {
    code:"0 281 006 064",
    name:"Sensore Pressione CR Bosch",
    brand:"Bosch",
    motors:"MTU 4000/8000 · MAN · Cummins CR",
    price:240,
    stock:"Stock",
    vf:true,
    tm:true,
    photoUrl:"assets/img/parts/0-281-006-064.jpg",
    specifications:{
      weight_grams:280,
      dimensions_mm:"45 × 32 × 28",
      warranty_months:24,
      certifications:["ABS","DNV GL","Lloyd's"],
      lifespan_hours:3500,
      maintenance_interval_hours:500,
      pressure_range_bar:"900-1200",
      operating_temp_c:"-20 to +85"
    },
    images:[
      {url:"assets/img/parts/0-281-006-064.jpg", caption:"Sensore completo", alt:"Bosch 0281 sensor"},
      {url:"assets/img/parts/0-281-006-064-detail.jpg", caption:"Dettaglio connettore", alt:"Connector detail"}
    ]
  },
  {
    code:"0 445 120 217",
    name:"Iniettore Bosch CRIN3",
    brand:"Bosch",
    motors:"MAN B&W G-Type Marine",
    price:620,
    stock:"Stock",
    vf:false,
    tm:false,
    photoUrl:"assets/img/parts/0-445-120-217.jpg",
    specifications:{
      weight_grams:850,
      dimensions_mm:"95 × 45 × 38",
      warranty_months:24,
      certifications:["ABS","DNV GL"],
      lifespan_hours:4000,
      maintenance_interval_hours:750,
      flow_rate_ccmin:"850±50",
      operating_temp_c:"-10 to +80"
    },
    images:[
      {url:"assets/img/parts/0-445-120-217.jpg", caption:"Iniettore completo", alt:"Bosch CRIN3 injector"},
      {url:"assets/img/parts/0-445-120-217-assembly.jpg", caption:"Assemblaggio tecnico", alt:"Assembly detail"}
    ]
  },
  {
    code:"0 445 010 537",
    name:"Pompa Alta Pressione Bosch CP4",
    brand:"Bosch",
    motors:"Marine CR Bosch/MAN",
    price:980,
    stock:"Ordine",
    vf:false,
    tm:false,
    photoUrl:"assets/img/parts/0-445-010-537.jpg",
    specifications:{
      weight_grams:2400,
      dimensions_mm:"180 × 120 × 110",
      warranty_months:24,
      certifications:["ABS","DNV GL","Lloyd's"],
      lifespan_hours:5000,
      maintenance_interval_hours:1000,
      max_pressure_bar:1600,
      displacement_ccrev:6.5
    },
    images:[
      {url:"assets/img/parts/0-445-010-537.jpg", caption:"Pompa CP4", alt:"Bosch CP4 pump"},
      {url:"assets/img/parts/0-445-010-537-internal.jpg", caption:"Componenti interni", alt:"Internal parts"}
    ]
  },
  {
    code:"0 445 120 236",
    name:"Iniettore Bosch CR Cummins QSL9",
    brand:"Bosch",
    motors:"Cummins QSL9 (8.9L) Marine",
    price:590,
    stock:"Stock",
    vf:false,
    tm:false,
    photoUrl:"assets/img/parts/0-445-120-236.jpg",
    specifications:{
      weight_grams:820,
      dimensions_mm:"92 × 43 × 36",
      warranty_months:24,
      certifications:["ABS","DNV GL"],
      lifespan_hours:3800,
      maintenance_interval_hours:700,
      flow_rate_ccmin:"780±40",
      operating_temp_c:"-15 to +85"
    },
    images:[
      {url:"assets/img/parts/0-445-120-236.jpg", caption:"Iniettore QSL9", alt:"Bosch QSL9 injector"},
      {url:"assets/img/parts/0-445-120-236-nozzle.jpg", caption:"Ugello di iniezione", alt:"Nozzle detail"}
    ]
  },
  {
    code:"0 445 120 455",
    name:"Iniettore Bosch CR Cummins QSB 6.7",
    brand:"Bosch",
    motors:"Cummins QSB 6.7 Marine",
    price:545,
    stock:"Stock",
    vf:false,
    tm:false,
    photoUrl:"assets/img/parts/0-445-120-455.jpg",
    specifications:{
      weight_grams:780,
      dimensions_mm:"88 × 40 × 35",
      warranty_months:24,
      certifications:["ABS","DNV GL"],
      lifespan_hours:3600,
      maintenance_interval_hours:600,
      flow_rate_ccmin:"720±35",
      operating_temp_c:"-20 to +80"
    },
    images:[
      {url:"assets/img/parts/0-445-120-455.jpg", caption:"Iniettore QSB", alt:"Bosch QSB injector"},
      {url:"assets/img/parts/0-445-120-455-coil.jpg", caption:"Bobina solenoide", alt:"Solenoid coil"}
    ]
  },
  {
    code:"0 445 120 356",
    name:"Iniettore Bosch CR QSB 6.7 CPL4191",
    brand:"Bosch",
    motors:"Cummins QSB 6.7 (CPL 4191) Marine",
    price:570,
    stock:"Stock",
    vf:false,
    tm:false,
    photoUrl:"assets/img/parts/0-445-120-356.jpg",
    specifications:{
      weight_grams:800,
      dimensions_mm:"90 × 41 × 36",
      warranty_months:24,
      certifications:["ABS","DNV GL"],
      lifespan_hours:3700,
      maintenance_interval_hours:650,
      flow_rate_ccmin:"740±38",
      operating_temp_c:"-18 to +82"
    },
    images:[
      {url:"assets/img/parts/0-445-120-356.jpg", caption:"Iniettore CPL4191", alt:"Bosch CPL4191 injector"},
      {url:"assets/img/parts/0-445-120-356-connection.jpg", caption:"Connessioni idrauliche", alt:"Hydraulic connections"}
    ]
  },
  {
    code:"0 124 655 025",
    name:"Alternatore Bosch 24V 120A",
    brand:"Bosch",
    motors:"MAN heavy diesel · ausiliari marini",
    price:310,
    stock:"Stock",
    vf:true,
    tm:false,
    photoUrl:"assets/img/parts/0-124-655-025.jpg",
    specifications:{
      weight_grams:3800,
      dimensions_mm:"185 × 145 × 165",
      warranty_months:24,
      certifications:["ABS"],
      lifespan_hours:5000,
      maintenance_interval_hours:2000,
      output_voltage:24,
      output_amperage:120,
      operating_temp_c:"-25 to +60"
    },
    images:[
      {url:"assets/img/parts/0-124-655-025.jpg", caption:"Alternatore 120A", alt:"Bosch alternator"},
      {url:"assets/img/parts/0-124-655-025-terminals.jpg", caption:"Morsetti connessione", alt:"Terminal connections"}
    ]
  },
  {
    code:"7C-3614",
    name:"Pompa Acqua Mare CAT 3516",
    brand:"Caterpillar",
    motors:"CAT 3408/3412/3508/3512/3516 Marine",
    price:720,
    stock:"Stock",
    vf:false,
    tm:true,
    photoUrl:"assets/img/parts/7C-3614.jpg",
    specifications:{
      weight_grams:4200,
      dimensions_mm:"220 × 180 × 150",
      warranty_months:24,
      certifications:["ABS","DNV GL","Lloyd's"],
      lifespan_hours:6000,
      maintenance_interval_hours:1500,
      flow_rate_gpm:450,
      max_pressure_psi:45
    },
    images:[
      {url:"assets/img/parts/7C-3614.jpg", caption:"Pompa acqua mare", alt:"CAT seawater pump"},
      {url:"assets/img/parts/7C-3614-intake.jpg", caption:"Presa acqua marina", alt:"Intake detail"}
    ]
  },
  {
    code:"20R-1266",
    name:"Iniettore CAT 3512C/3516C (Reman)",
    brand:"Caterpillar",
    motors:"CAT 3512C · 3516C · 3516B Marine",
    price:1150,
    stock:"Stock",
    vf:false,
    tm:true,
    photoUrl:"assets/img/parts/20R-1266.jpg",
    specifications:{
      weight_grams:950,
      dimensions_mm:"110 × 52 × 48",
      warranty_months:24,
      certifications:["ABS","DNV GL","Lloyd's"],
      lifespan_hours:4500,
      maintenance_interval_hours:800,
      flow_rate_ccmin:"650±30",
      operating_temp_c:"-10 to +90"
    },
    images:[
      {url:"assets/img/parts/20R-1266.jpg", caption:"Iniettore CAT ricondizionato", alt:"CAT reman injector"},
      {url:"assets/img/parts/20R-1266-packaging.jpg", caption:"Packaging di spedizione", alt:"Original packaging"}
    ]
  },
  {
    code:"20R-1278",
    name:"Iniettore CAT 3508/3512/3516 (Reman)",
    brand:"Caterpillar",
    motors:"CAT 3508/3512/3516/3518 Marine",
    price:1080,
    stock:"Stock",
    vf:false,
    tm:true,
    photoUrl:"assets/img/parts/20R-1278.jpg",
    specifications:{
      weight_grams:920,
      dimensions_mm:"108 × 50 × 46",
      warranty_months:24,
      certifications:["ABS","DNV GL"],
      lifespan_hours:4400,
      maintenance_interval_hours:800,
      flow_rate_ccmin:"630±28",
      operating_temp_c:"-12 to +88"
    },
    images:[
      {url:"assets/img/parts/20R-1278.jpg", caption:"Iniettore ricondizionato", alt:"CAT reman injector"},
      {url:"assets/img/parts/20R-1278-test.jpg", caption:"Test di pressione", alt:"Pressure test"}
    ]
  },
  {
    code:"FF5488",
    name:"Filtro Carburante Fleetguard Marine",
    brand:"Cummins",
    motors:"Cummins QSB 5.9/6.7 · QSC 8.3 · QSL 9.0",
    price:88,
    stock:"Stock",
    vf:true,
    tm:true,
    photoUrl:"assets/img/parts/FF5488.jpg",
    specifications:{
      weight_grams:450,
      dimensions_mm:"120 × 95 × 85",
      warranty_months:12,
      certifications:["ABS","DNV GL"],
      lifespan_hours:500,
      maintenance_interval_hours:250,
      filtration_microns:10,
      water_absorption_ml:250
    },
    images:[
      {url:"assets/img/parts/FF5488.jpg", caption:"Filtro combustibile", alt:"Fuel filter"},
      {url:"assets/img/parts/FF5488-element.jpg", caption:"Elemento filtrante", alt:"Filter element"}
    ]
  },
  {
    code:"LF9009",
    name:"Filtro Olio Fleetguard Cummins QSL",
    brand:"Cummins",
    motors:"Cummins 6C · QSC 8.3 · QSL 9.0 Marine",
    price:42,
    stock:"Stock",
    vf:true,
    tm:true,
    photoUrl:"assets/img/parts/LF9009.jpg",
    specifications:{
      weight_grams:320,
      dimensions_mm:"110 × 90 × 75",
      warranty_months:12,
      certifications:["ABS","DNV GL"],
      lifespan_hours:750,
      maintenance_interval_hours:375,
      filtration_microns:8,
      capacity_ml:1200
    },
    images:[
      {url:"assets/img/parts/LF9009.jpg", caption:"Filtro olio motore", alt:"Oil filter"},
      {url:"assets/img/parts/LF9009-spin-on.jpg", caption:"Tipo spin-on", alt:"Spin-on type"}
    ]
  },
  {
    code:"WF2073",
    name:"Filtro Refrigerante Fleetguard QSM11",
    brand:"Cummins",
    motors:"Cummins QSM11 · L10 · M11 · K19 · V28",
    price:38,
    stock:"Stock",
    vf:false,
    tm:false,
    photoUrl:"assets/img/parts/WF2073.jpg",
    specifications:{
      weight_grams:280,
      dimensions_mm:"100 × 85 × 70",
      warranty_months:12,
      certifications:["DNV GL"],
      lifespan_hours:800,
      maintenance_interval_hours:400,
      filtration_microns:12,
      capacity_ml:900
    },
    images:[
      {url:"assets/img/parts/WF2073.jpg", caption:"Filtro refrigerante", alt:"Water filter"},
      {url:"assets/img/parts/WF2073-coolant.jpg", caption:"Con fluido di raffreddamento", alt:"With coolant"}
    ]
  },
  {
    code:"FS1000",
    name:"Separatore Carburante/Acqua FG",
    brand:"Cummins",
    motors:"Cummins N14 · ISM · ISL · ISX genset",
    price:65,
    stock:"Stock",
    vf:true,
    tm:true,
    photoUrl:"assets/img/parts/FS1000.jpg",
    specifications:{
      weight_grams:520,
      dimensions_mm:"135 × 100 × 95",
      warranty_months:12,
      certifications:["ABS"],
      lifespan_hours:600,
      maintenance_interval_hours:300,
      separation_efficiency:99.5,
      water_capacity_ml:300
    },
    images:[
      {url:"assets/img/parts/FS1000.jpg", caption:"Separatore combustibile", alt:"Fuel separator"},
      {url:"assets/img/parts/FS1000-drain.jpg", caption:"Scarico acqua", alt:"Water drain"}
    ]
  },
  {
    code:"3967726",
    name:"Alternatore Marino 24V 80A Cummins",
    brand:"Cummins",
    motors:"Cummins QSM11 · QSL9 · QSB 5.9/6.7",
    price:485,
    stock:"Stock",
    vf:true,
    tm:false,
    photoUrl:"assets/img/parts/3967726.jpg",
    specifications:{
      weight_grams:3200,
      dimensions_mm:"170 × 130 × 150",
      warranty_months:24,
      certifications:["ABS","DNV GL"],
      lifespan_hours:5000,
      maintenance_interval_hours:2000,
      output_voltage:24,
      output_amperage:80,
      operating_temp_c:"-20 to +65"
    },
    images:[
      {url:"assets/img/parts/3967726.jpg", caption:"Alternatore marino 80A", alt:"Cummins alternator"},
      {url:"assets/img/parts/3967726-mount.jpg", caption:"Staffa di montaggio", alt:"Mounting bracket"}
    ]
  },
  {
    code:"28231014",
    name:"Iniettore Delphi L-series",
    brand:"Delphi",
    motors:"Cummins QSK 19 · CAT 3516 CR Delphi",
    price:445,
    stock:"Stock",
    vf:false,
    tm:false,
    photoUrl:"assets/img/parts/28231014.jpg",
    specifications:{
      weight_grams:910,
      dimensions_mm:"105 × 48 × 45",
      warranty_months:24,
      certifications:["ABS","DNV GL"],
      lifespan_hours:4200,
      maintenance_interval_hours:700,
      flow_rate_ccmin:"810±40",
      operating_temp_c:"-15 to +85"
    },
    images:[
      {url:"assets/img/parts/28231014.jpg", caption:"Iniettore L-series", alt:"Delphi L-series injector"},
      {url:"assets/img/parts/28231014-assembly.jpg", caption:"Componenti assemblati", alt:"Assembly components"}
    ]
  },
  {
    code:"BEBE4C17001",
    name:"Delphi EUI Iniettore Volvo Penta D9",
    brand:"Delphi",
    motors:"Volvo Penta D9 / D9-MH / D9-425/500/575",
    price:680,
    stock:"Ordine",
    vf:false,
    tm:false,
    photoUrl:"assets/img/parts/BEBE4C17001.jpg",
    specifications:{
      weight_grams:1100,
      dimensions_mm:"130 × 55 × 52",
      warranty_months:24,
      certifications:["ABS","DNV GL"],
      lifespan_hours:4500,
      maintenance_interval_hours:750,
      flow_rate_ccmin:"920±45",
      operating_temp_c:"-10 to +90"
    },
    images:[
      {url:"assets/img/parts/BEBE4C17001.jpg", caption:"EUI Volvo Penta", alt:"Delphi EUI Volvo injector"},
      {url:"assets/img/parts/BEBE4C17001-electronics.jpg", caption:"Unità di controllo", alt:"Control unit"}
    ]
  },
  {
    code:"BEBE4D24001",
    name:"Delphi E3 EUI Iniettore Volvo D13",
    brand:"Delphi",
    motors:"Volvo D13A / D13C · Volvo Penta IPS",
    price:720,
    stock:"Ordine",
    vf:false,
    tm:false,
    photoUrl:"assets/img/parts/BEBE4D24001.jpg",
    specifications:{
      weight_grams:1150,
      dimensions_mm:"135 × 58 × 55",
      warranty_months:24,
      certifications:["ABS","DNV GL","Lloyd's"],
      lifespan_hours:4600,
      maintenance_interval_hours:800,
      flow_rate_ccmin:"960±48",
      operating_temp_c:"-8 to +92"
    },
    images:[
      {url:"assets/img/parts/BEBE4D24001.jpg", caption:"E3 EUI Volvo D13", alt:"Delphi E3 Volvo injector"},
      {url:"assets/img/parts/BEBE4D24001-injector.jpg", caption:"Corpo iniettore", alt:"Injector body"}
    ]
  },
  {
    code:"5265902",
    name:"Iniettore Meccanico Delphi/Kelvin",
    brand:"Delphi",
    motors:"Kelvin marine diesel meccanico",
    price:290,
    stock:"Ordine",
    vf:false,
    tm:false,
    photoUrl:"assets/img/parts/5265902.jpg",
    specifications:{
      weight_grams:620,
      dimensions_mm:"75 × 38 × 32",
      warranty_months:24,
      certifications:["DNV GL"],
      lifespan_hours:3200,
      maintenance_interval_hours:600,
      flow_rate_ccmin:"480±25",
      operating_temp_c:"-5 to +80"
    },
    images:[
      {url:"assets/img/parts/5265902.jpg", caption:"Iniettore meccanico", alt:"Mechanical injector"},
      {url:"assets/img/parts/5265902-nozzle.jpg", caption:"Ugello meccanico", alt:"Mechanical nozzle"}
    ]
  },
];

// ── PARTNER LOGOS & BRANDING ───────────────────────────
const BRAND_LOGOS = {
  Bosch: {
    name: "Robert Bosch GmbH",
    logo: "assets/img/brands/bosch-logo.png",
    color: "#ff6b6b",
    bgColor: "rgba(220,0,0,.2)",
    website: "https://www.bosch-automotive.com",
    established: 1886,
    description: "Fornitore globale di sistemi di iniezione common-rail"
  },
  Delphi: {
    name: "Delphi Technologies",
    logo: "assets/img/brands/delphi-logo.png",
    color: "#5bc8f5",
    bgColor: "rgba(0,150,220,.2)",
    website: "https://www.delphitechnologies.com",
    established: 1994,
    description: "Specialista di sistemi propulsione e iniezione"
  },
  Caterpillar: {
    name: "Caterpillar Inc.",
    logo: "assets/img/brands/caterpillar-logo.png",
    color: "#ffc107",
    bgColor: "rgba(255,185,0,.2)",
    website: "https://www.caterpillar.com",
    established: 1925,
    description: "Costruttore di motori e sistemi marini"
  },
  Cummins: {
    name: "Cummins Inc.",
    logo: "assets/img/brands/cummins-logo.png",
    color: "#4cde80",
    bgColor: "rgba(0,180,50,.2)",
    website: "https://www.cummins.com",
    established: 1919,
    description: "Produttore motori diesel marine"
  },
  Beta: {
    name: "Beta Marine",
    logo: "assets/img/brands/beta-logo.png",
    color: "#ffd700",
    bgColor: "rgba(255,215,0,.2)",
    website: "https://www.betamarine.com",
    established: 1981,
    description: "Motori marini e sistemi ausiliari"
  },
  Fleetguard: {
    name: "Fleetguard",
    logo: "assets/img/brands/fleetguard-logo.png",
    color: "#00d4ff",
    bgColor: "rgba(0,212,255,.2)",
    website: "https://www.fleetguard.com",
    established: 1985,
    description: "Filtri e fluidi marini certificati"
  }
};

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
    const roiLabels = ECO_CODICI.map(c => c.code);
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
  { key:'usura_1', nave:'MV Maria Dolores', motore:'MTU 4000 M73', comp:'Filtri carburante', cat:'Filtrazione', status:'CRITICO', eta:20, usura:70.0, sigma:8.0, ic:'54%–86%', motiv:'6 motori × 20 anni – intervallo cambio ogni 500h superato', component_lifespan_hours:500, hours_operated:175000, hours_remaining:0, service_interval_hours:250, last_service_hours:174750, critical_threshold_hours:450 },
  { key:'usura_2', nave:'MV Maria Dolores', motore:'MTU 4000 M73', comp:'Filtri olio', cat:'Filtrazione', status:'CRITICO', eta:20, usura:70.0, sigma:8.0, ic:'54%–86%', motiv:'6 motori – consumo olio accelerato a questa età', component_lifespan_hours:750, hours_operated:175000, hours_remaining:175, service_interval_hours:375, last_service_hours:174750, critical_threshold_hours:675 },
  { key:'usura_3', nave:'MV Maria Dolores', motore:'MTU 4000 M73', comp:'Sensore pressione CR', cat:'Iniezione', status:'CRITICO', eta:20, usura:70.0, sigma:8.0, ic:'54%–86%', motiv:'Sistema common rail MTU 4000 – sensori serie 0281 critici', component_lifespan_hours:3500, hours_operated:175000, hours_remaining:2150, service_interval_hours:500, last_service_hours:174500, critical_threshold_hours:3150 },
  { key:'usura_4', nave:'MV Maria Dolores', motore:'MTU 4000 M73', comp:'Filtri refrigerante', cat:'Raffreddamento', status:'CRITICO', eta:20, usura:70.0, sigma:8.0, ic:'54%–86%', motiv:'Circuito raffreddamento critico su unità ad alta potenza', component_lifespan_hours:800, hours_operated:175000, hours_remaining:175, service_interval_hours:400, last_service_hours:174800, critical_threshold_hours:720 },
  { key:'usura_5', nave:'MV Maria Dolores', motore:'MTU 4000 M73', comp:'Separatore carburante/acqua', cat:'Filtrazione', status:'CRITICO', eta:20, usura:70.0, sigma:8.0, ic:'54%–86%', motiv:'Acque Med – contaminazione acqua frequente in rotta Malta', component_lifespan_hours:600, hours_operated:175000, hours_remaining:400, service_interval_hours:300, last_service_hours:174600, critical_threshold_hours:540 },
  { key:'usura_6', nave:'MV Maria Dolores', motore:'MTU 4000 M73', comp:'Alternatore marino', cat:'Elettrico', status:'CRITICO', eta:20, usura:60.0, sigma:8.9, ic:'43%–77%', motiv:'20 anni – alternatori tipicamente fine vita a questa età', component_lifespan_hours:5000, hours_operated:175000, hours_remaining:2500, service_interval_hours:2000, last_service_hours:173000, critical_threshold_hours:4500 },
  { key:'usura_7', nave:'MV Jean de La Valette', motore:'MTU 8000 series', comp:'Filtri olio', cat:'Filtrazione', status:'ALTO', eta:16, usura:56.0, sigma:7.2, ic:'42%–70%', motiv:'4 motori × 16 anni – manutenzione intensiva ad alta velocità', component_lifespan_hours:750, hours_operated:140800, hours_remaining:187, service_interval_hours:375, last_service_hours:140625, critical_threshold_hours:675 },
  { key:'usura_8', nave:'MV Jean de La Valette', motore:'MTU 8000 series', comp:'Sensore pressione CR', cat:'Iniezione', status:'ALTO', eta:16, usura:56.0, sigma:7.2, ic:'42%–70%', motiv:'MTU 8000 CR system – alta sollecitazione a regime', component_lifespan_hours:3500, hours_operated:140800, hours_remaining:2128, service_interval_hours:500, last_service_hours:140300, critical_threshold_hours:3150 },
  { key:'usura_9', nave:'MV Jean de La Valette', motore:'MTU 8000 series', comp:'Filtri carburante', cat:'Filtrazione', status:'ALTO', eta:16, usura:56.0, sigma:7.2, ic:'42%–70%', motiv:'Intervallo ridotto su regime alta velocità Pozzallo–Malta', component_lifespan_hours:500, hours_operated:140800, hours_remaining:280, service_interval_hours:250, last_service_hours:140500, critical_threshold_hours:450 },
  { key:'usura_10', nave:'MV Saint John Paul II', motore:'MTU 8000 (9100kW)', comp:'Sensore pressione CR', cat:'Iniezione', status:'MEDIO', eta:7, usura:24.5, sigma:4.8, ic:'15%–34%', motiv:'7 anni – prima ispezione programmata CR serie 0281', component_lifespan_hours:3500, hours_operated:61320, hours_remaining:2646, service_interval_hours:500, last_service_hours:60820, critical_threshold_hours:3150 },
  { key:'usura_11', nave:'MV Saint John Paul II', motore:'MTU 8000 (9100kW)', comp:'Filtri carburante', cat:'Filtrazione', status:'MEDIO', eta:7, usura:24.5, sigma:4.8, ic:'15%–34%', motiv:'Manutenzione ordinaria – ancora in garanzia costruttore', component_lifespan_hours:500, hours_operated:61320, hours_remaining:376, service_interval_hours:250, last_service_hours:61070, critical_threshold_hours:450 },
  { key:'usura_12', nave:'San Frangisk', motore:'Deutz MWM 620B V1', comp:'Filtri carburante', cat:'Filtrazione', status:'CRITICO', eta:36, usura:90.0, sigma:13.2, ic:'64%–100%', motiv:'36 anni – motori meccanici Deutz MWM, ricambi urgenti', component_lifespan_hours:500, hours_operated:315000, hours_remaining:0, service_interval_hours:250, last_service_hours:314500, critical_threshold_hours:450 },
  { key:'usura_13', nave:'San Frangisk', motore:'Deutz MWM 620B V1', comp:'Filtri olio', cat:'Filtrazione', status:'CRITICO', eta:36, usura:90.0, sigma:13.2, ic:'64%–100%', motiv:'Usura avanzata su tutto il sistema lubrificazione', component_lifespan_hours:750, hours_operated:315000, hours_remaining:0, service_interval_hours:375, last_service_hours:314250, critical_threshold_hours:675 },
  { key:'usura_14', nave:'San Pawl ⚠️ ex-flotta', motore:'Deutz MWM 604B V1', comp:'Filtri carburante', cat:'Filtrazione', status:'CRITICO', eta:35, usura:87.5, sigma:13.0, ic:'62%–100%', motiv:'35 anni – ceduta 2025; dati storici mantenuti per analisi', component_lifespan_hours:500, hours_operated:307500, hours_remaining:0, service_interval_hours:250, last_service_hours:307000, critical_threshold_hours:450 },
  { key:'usura_15', nave:'San Pawl ⚠️ ex-flotta', motore:'Deutz MWM 604B V1', comp:'Filtri olio', cat:'Filtrazione', status:'CRITICO', eta:35, usura:87.5, sigma:13.0, ic:'62%–100%', motiv:'Filtri olio equivalenti Fleetguard applicabili', component_lifespan_hours:750, hours_operated:307500, hours_remaining:0, service_interval_hours:375, last_service_hours:307125, critical_threshold_hours:675 },
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

// ── PRODUCT POPUP (RICAMBIO) ────────────────────────────────────────────────────────
function buildProductPopup(code) {
  const product = CATALOG.find(c => c.code === code);
  if (!product) return '<h2>Prodotto non trovato</h2>';

  const brandInfo = BRAND_LOGOS[product.brand] || {};

  return `
    <h2 style="color:#00d4ff; margin-bottom:20px; font-size:18px; letter-spacing:1px;">
      ${product.brand} — ${product.name}
    </h2>

    <!-- Product Gallery -->
    <div style="margin-bottom:24px;">
      <img src="${product.photoUrl}" style="width:100%; border-radius:8px; margin-bottom:12px; max-height:300px; object-fit:cover;">
      ${product.images && product.images.length > 1 ? `
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px;">
          ${product.images.map(img => `
            <img src="${img.url}" alt="${img.alt}" title="${img.caption}" style="width:100%; height:80px; object-fit:cover; border-radius:4px; border:1px solid rgba(0,87,184,.2); cursor:pointer;">
          `).join('')}
        </div>
      ` : ''}
    </div>

    <!-- Specifications Table -->
    <div style="background:rgba(0,87,184,.1); padding:16px; border-radius:8px; margin-bottom:20px;">
      <h3 style="color:#00d4ff; font-size:12px; margin-bottom:12px; letter-spacing:1px;">SPECIFICHE TECNICHE</h3>
      <table class="modal-table" style="width:100%; font-size:12px;">
        <tr>
          <td><strong>Codice</strong></td>
          <td>${product.code}</td>
        </tr>
        <tr>
          <td><strong>Brand</strong></td>
          <td>${product.brand}</td>
        </tr>
        <tr>
          <td><strong>Peso</strong></td>
          <td>${product.specifications.weight_grams}g</td>
        </tr>
        <tr>
          <td><strong>Dimensioni</strong></td>
          <td>${product.specifications.dimensions_mm} mm</td>
        </tr>
        <tr>
          <td><strong>Intervallo manutenzione</strong></td>
          <td>${product.specifications.maintenance_interval_hours} ore</td>
        </tr>
        <tr>
          <td><strong>Durata componente</strong></td>
          <td style="color:#00e676; font-weight:700;">${product.specifications.lifespan_hours} ore</td>
        </tr>
        <tr>
          <td><strong>Garanzia</strong></td>
          <td>${product.specifications.warranty_months} mesi</td>
        </tr>
        <tr>
          <td><strong>Prezzo</strong></td>
          <td style="color:#ffc107; font-weight:700;">€${product.price}</td>
        </tr>
      </table>
    </div>

    <!-- Certifications -->
    ${product.specifications.certifications && product.specifications.certifications.length > 0 ? `
      <div style="margin-bottom:16px;">
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          ${product.specifications.certifications.map(cert =>
            `<span class="badge" style="background:rgba(0,212,255,.2); color:#00d4ff; border:1px solid rgba(0,212,255,.3); padding:4px 8px; border-radius:4px; font-size:11px;">${cert}</span>`
          ).join('')}
        </div>
      </div>
    ` : ''}

    <!-- Compatibility -->
    <div style="background:rgba(255,140,0,.1); border:1px solid rgba(255,140,0,.2); padding:12px; border-radius:8px; margin-top:16px;">
      <div style="color:#ff8c00; font-weight:700; margin-bottom:8px; font-size:12px;">COMPATIBILITÀ MOTORI</div>
      <div style="color:var(--grigio); font-size:11px;">${product.motors}</div>
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