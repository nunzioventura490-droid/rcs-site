"""
RCS Marine Intelligence — Generatore Storico Manutenzioni
==========================================================
Genera stime di manutenzione attendibili basate su:
  - Ore motore reali
  - Anno costruzione nave
  - Tipo motore (con intervalli OEM ufficiali)
  - Usura stimata

Output: JSON pronto da incollare in cliente-operazioni.html
        + CSV importabile direttamente nel portale

UTILIZZO in VS Code:
  python genera-manutenzioni.py
  python genera-manutenzioni.py --flotta tug
  python genera-manutenzioni.py --flotta virtu --csv
  python genera-manutenzioni.py --flotta all --anni 5
"""

import json
import csv
import random
import argparse
from datetime import datetime, timedelta
from dataclasses import dataclass, field
from typing import List, Dict, Tuple

# ─── CONFIGURAZIONE FLOTTE ────────────────────────────────────────────────────

FLEETS = {
    "virtu": [
        {"nome": "MV Saint John Paul II", "motore": "MTU 20V 8000 M71L", "tipo": "MTU_8000",
         "n_motori": 4, "ore": 35200,  "anno": 2019, "usura": 25, "ore_anno": 8800},
        {"nome": "MV Jean de La Valette", "motore": "MTU 20V 8000 M71L", "tipo": "MTU_8000",
         "n_motori": 4, "ore": 87200,  "anno": 2010, "usura": 56, "ore_anno": 8720},
        {"nome": "MV Maria Dolores",      "motore": "MTU 16V 4000 M73L", "tipo": "MTU_4000",
         "n_motori": 6, "ore": 110800, "anno": 2006, "usura": 70, "ore_anno": 6200},
        {"nome": "HSC Gozo Express",       "motore": "MTU 12V 2000 M72",  "tipo": "MTU_2000",
         "n_motori": 4, "ore": 98400,  "anno": 2008, "usura": 54, "ore_anno": 5500},
        {"nome": "San Frangisk",           "motore": "Deutz MWM 620B V16","tipo": "DEUTZ_MWM",
         "n_motori": 2, "ore": 103600, "anno": 1990, "usura": 90, "ore_anno": 2900},
        {"nome": "San Pawl",               "motore": "Deutz MWM 604B V16","tipo": "DEUTZ_MWM",
         "n_motori": 2, "ore": 101400, "anno": 1991, "usura": 88, "ore_anno": 2900},
        {"nome": "Balluta Bay",            "motore": "Wärtsilä Convenzionale","tipo": "WARTSILA",
         "n_motori": 1, "ore": 194000, "anno": 1981, "usura": 100,"ore_anno": 3200},
    ],
    "tug": [
        {"nome": "MT Vittoriosa",    "motore": "MTU 16V 4000 M65L",     "tipo": "MTU_4000",
         "n_motori": 2, "ore": 26300,  "anno": 2019, "usura": 25, "ore_anno": 4386},
        {"nome": "MT St. Angelo",    "motore": "Caterpillar 3516C",      "tipo": "CAT_3516",
         "n_motori": 2, "ore": 35000,  "anno": 2017, "usura": 29, "ore_anno": 4375},
        {"nome": "MT Senglea",       "motore": "Caterpillar 3516C",      "tipo": "CAT_3516",
         "n_motori": 2, "ore": 21000,  "anno": 2020, "usura": 19, "ore_anno": 3500},
        {"nome": "MT Med Aldebaran", "motore": "Caterpillar 3516C Tier III","tipo": "CAT_3516",
         "n_motori": 2, "ore": 5800,   "anno": 2024, "usura": 6,  "ore_anno": 2900},
        {"nome": "MT St. Elmo",      "motore": "Caterpillar 3516C",      "tipo": "CAT_3516",
         "n_motori": 2, "ore": 61400,  "anno": 2011, "usura": 48, "ore_anno": 4100},
        {"nome": "MT Spinola",       "motore": "MaK 8M25",               "tipo": "MAK_8M25",
         "n_motori": 2, "ore": 72800,  "anno": 2009, "usura": 34, "ore_anno": 4100},
        {"nome": "MT Wenzina",       "motore": "Caterpillar 3516C",      "tipo": "CAT_3516",
         "n_motori": 2, "ore": 84200,  "anno": 2006, "usura": 64, "ore_anno": 4400},
        {"nome": "MT Pawlina",       "motore": "Caterpillar 3516B",      "tipo": "CAT_3516B",
         "n_motori": 2, "ore": 83800,  "anno": 2006, "usura": 64, "ore_anno": 4400},
        {"nome": "MT Sea Salvor",    "motore": "Caterpillar 3516C",      "tipo": "CAT_3516",
         "n_motori": 2, "ore": 114400, "anno": 1998, "usura": 90, "ore_anno": 4080},
        {"nome": "MT Gozzo",         "motore": "Volvo Diesel",           "tipo": "VOLVO",
         "n_motori": 2, "ore": 21400,  "anno": 2019, "usura": 21, "ore_anno": 3567},
    ]
}

# ─── INTERVALLI DI MANUTENZIONE OEM ──────────────────────────────────────────
# Fonte: manuali ufficiali MTU, Caterpillar SIS, Cummins Quickserve, Deutz
# Formato: (ore_intervallo, nome_check, sistemi_coinvolti, costo_min, costo_max, tecnico, descrizione)

ENGINE_SCHEDULES = {

    "MTU_8000": [  # MTU 20V 8000 M71L — 36.400 kW per unità
        # ─ A-Check ogni 500h ─────────────────────────────────
        (500,  "A-Check 500h",   "Filtrazione",
         400, 650, "Tecnico RCS",
         "Sostituzione filtri olio motore, filtri gasolio primario e secondario + ispezione visiva"),
        # ─ B-Check ogni 1000h ────────────────────────────────
        (1000, "B-Check 1000h",  "Filtrazione",
         750, 1100, "Tecnico RCS",
         "Kit filtri completo + analisi olio lubrificante + controllo tenute e manicotti"),
        # ─ C-Check ogni 2000h ────────────────────────────────
        (2000, "C-Check 2000h",  "Motore",
         1800, 2800, "Tecnico RCS",
         "Ispezione teste cilindro, controllo gioco valvole, regolazione iniettori CR Bosch 0 445 120 141"),
        # ─ D-Check ogni 4000h ────────────────────────────────
        (4000, "D-Check 4000h",  "Iniezione",
         5500, 8500, "Tecnico RCS + Specialista MTU",
         "Sostituzione iniettori CR Bosch (serie 0 445 120 141), revisione pompa HP, test bench"),
        # ─ Overhaul maggiore ogni 8000h ──────────────────────
        (8000, "Overhaul 8000h", "Motore",
         28000, 45000, "Cantiere Specializzato",
         "Revisione completa top-end: pistoni, segmenti, bronzine, albero a camme, tenute"),
        # ─ Ispezione Propulsione ogni 3000h ──────────────────
        (3000, "Ispezione Propulsione", "Propulsione",
         1200, 2000, "Tecnico RCS",
         "Controllo eliche, shaft seal, allineamento alberi, lubrificazione riduttori"),
        # ─ Sistema raffreddamento ogni 2000h ─────────────────
        (2000, "Raffreddamento 2000h", "Raffreddamento",
         600, 950, "Tecnico RCS",
         "Sostituzione termostato MTU, fluido refrigerante, pulizia heat exchanger"),
    ],

    "MTU_4000": [  # MTU 16V/20V 4000 M65L/M73L
        (500,  "A-Check 500h",   "Filtrazione",
         300, 480, "Tecnico RCS",
         "Filtri olio e gasolio MTU Serie 4000 — kit Hifi SN 80097 + SO 4562"),
        (1000, "B-Check 1000h",  "Filtrazione",
         550, 850, "Tecnico RCS",
         "Kit filtri completo + analisi olio + controllo manicotti e guarnizioni"),
        (2000, "C-Check 2000h",  "Motore",
         1400, 2200, "Tecnico RCS",
         "Ispezione valvole, controllo iniettori UIS Bosch 0 414 701 076, regolazione giochi"),
        (4000, "D-Check 4000h",  "Iniezione",
         4200, 6800, "Tecnico RCS + Specialista MTU",
         "Sostituzione iniettori unitari UIS MTU, revisione pompa CP3, calibrazione"),
        (8000, "Overhaul 8000h", "Motore",
         18000, 30000, "Cantiere Specializzato",
         "Revisione completa motore: pistoni CAT/MAHLE, segmenti, bronzine, guarnizioni testa"),
        (2000, "Raffreddamento",  "Raffreddamento",
         450, 700, "Tecnico RCS",
         "Termostato MTU 11658815, fluido WF2071 Fleetguard, pulizia circuito"),
        (6000, "Propulsione 6000h", "Propulsione",
         900, 1500, "Tecnico RCS",
         "Ispezione shaft seal, lubrificazione riduttori, allineamento eliche"),
    ],

    "MTU_2000": [  # MTU 12V 2000 M72 — HSC Gozo Express
        (500,  "A-Check 500h",   "Filtrazione",
         200, 330, "Tecnico RCS",
         "Filtri olio e gasolio MTU 2000 — Hifi SO 4562 + SN 80016, kit da 4 motori"),
        (1000, "B-Check 1000h",  "Filtrazione",
         380, 580, "Tecnico RCS",
         "Kit filtri completo + analisi olio lubricante + verifica tenute"),
        (2000, "C-Check 2000h",  "Motore",
         900, 1500, "Tecnico RCS",
         "Ispezione iniettori CR Bosch 0 445 120 059, controllo valvole e distribuzione"),
        (4000, "D-Check 4000h",  "Iniezione",
         2800, 4500, "Tecnico RCS",
         "Sostituzione iniettori CR MTU 12V 2000, revisione pompa HP, test banco"),
        (8000, "Overhaul 8000h", "Motore",
         12000, 20000, "Cantiere Specializzato",
         "Revisione completa: pistoni, segmenti MAHLE, bronzine, tenute testa cilindro"),
    ],

    "CAT_3516": [  # Caterpillar 3516C / 3516E
        (500,  "Cambio Olio 500h",     "Filtrazione",
         280, 420, "Tecnico RCS",
         "Cambio olio + filtri CAT — Hifi SO 4562 (CAT 1R-0716) + SN 70099 (1R-0749), per motore"),
        (1000, "Ispezione 1000h",       "Motore",
         550, 850, "Tecnico RCS",
         "Ispezione completa: valvole, cinghie, manicotti, livelli, analisi olio laboratorio"),
        (3000, "Ispezione Iniettori",   "Iniezione",
         1800, 3200, "Tecnico RCS",
         "Controllo e calibrazione iniettori EUI CAT 7W-0470 / CR Bosch 0 445 120 304"),
        (6000, "Top End Overhaul",      "Motore",
         12000, 20000, "Tecnico RCS + Specialista CAT",
         "Revisione teste cilindro, sostituzione valvole, ispezione iniettori, guide"),
        (12000,"Major Overhaul",        "Motore",
         30000, 55000, "Cantiere Specializzato",
         "Overhaul completo: pistoni 7E-8818, segmenti, bronzine, guarnizioni 3L-3894"),
        (2000, "Raffreddamento",         "Raffreddamento",
         380, 580, "Tecnico RCS",
         "Fluido refrigerante WF2071, termostato, pulizia heat exchanger CAT"),
        (3000, "Propulsione",            "Propulsione",
         700, 1200, "Tecnico RCS",
         "Ispezione eliche, shaft seal, allineamento, lubrificazione riduttori ZF"),
    ],

    "CAT_3516B": [  # CAT 3516B — versione precedente, intervalli più brevi
        (400,  "Cambio Olio 400h",     "Filtrazione",
         260, 400, "Tecnico RCS",
         "Cambio olio + filtri CAT 3516B — Hifi SO 4562 + SN 70099, per motore"),
        (800,  "Ispezione 800h",        "Motore",
         500, 780, "Tecnico RCS",
         "Ispezione completa sistemi, analisi olio lubrificante, verifica tenute"),
        (2500, "Ispezione Iniettori",   "Iniezione",
         1600, 2800, "Tecnico RCS",
         "Controllo e calibrazione iniettori meccanici CAT 9Y-4522 / Bosch 0 432 217 271"),
        (5000, "Top End Overhaul",      "Motore",
         10000, 17000, "Tecnico RCS + Specialista CAT",
         "Revisione top end: valvole, guide, ispezione iniettori e camere combustione"),
        (10000,"Major Overhaul",        "Motore",
         25000, 45000, "Cantiere Specializzato",
         "Overhaul completo motore CAT 3516B, kit pistone, bronzine, guarnizioni"),
        (2000, "Raffreddamento",         "Raffreddamento",
         350, 520, "Tecnico RCS",
         "Cambio fluido refrigerante, pulizia heat exchanger, termostato"),
    ],

    "DEUTZ_MWM": [  # Deutz MWM 620B/604B V16 — motori storici Virtù
        (500,  "Cambio Olio 500h",     "Filtrazione",
         280, 420, "Tecnico RCS",
         "Cambio olio + filtri Deutz MWM — Fleetguard LF4056 (OEM 04294788) + FS1006"),
        (1000, "Ispezione 1000h",       "Motore",
         500, 780, "Tecnico RCS",
         "Ispezione completa: cinghie, manicotti, guarnizioni, valvole, analisi olio"),
        (2000, "Ispezione Iniettori",   "Iniezione",
         2200, 4000, "Tecnico RCS",
         "Controllo iniettori meccanici Bosch 0 430 232 056 (OEM 01174463), taratura pressione"),
        (4000, "Revisione Iniettori",   "Iniezione",
         5500, 9000, "Tecnico RCS + Specialista Deutz",
         "Sostituzione iniettori Bosch / Delphi, revisione pompa iniezione 0 460 424 148"),
        (6000, "Top End",               "Motore",
         10000, 18000, "Cantiere Specializzato",
         "Revisione teste cilindro, valvole, guide, ispezione camere combustione MWM"),
        (10000,"Major Overhaul",        "Motore",
         22000, 38000, "Cantiere Specializzato",
         "Overhaul completo MWM V16: pistoni, segmenti, guarnizioni MAHLE MS39012, bronzine"),
        (3000, "Propulsione",            "Propulsione",
         800, 1400, "Tecnico RCS",
         "Ispezione eliche tipo Air Cushion, shaft seal, lubrificazione cuscinetti"),
    ],

    "MAK_8M25": [  # MaK 8M25 — MT Spinola
        (750,  "Cambio Olio 750h",     "Filtrazione",
         280, 440, "Tecnico RCS",
         "Cambio olio + filtri MaK 8M25 — Hifi SN 80008 + SO 4562, per motore"),
        (1500, "Ispezione 1500h",       "Motore",
         600, 950, "Tecnico RCS",
         "Ispezione valvole, distribuzione, cinghia CAT 04505685, manicotti"),
        (3000, "Ispezione Iniettori",   "Iniezione",
         2800, 4800, "Tecnico RCS + Specialista MaK",
         "Verifica e calibrazione iniettori UPS Bosch 0 414 702 006 (OEM MaK 3460598)"),
        (6000, "Revisione Parziale",    "Motore",
         8000, 14000, "Cantiere Specializzato",
         "Revisione parziale MaK 8M25: valvole, guide, ispezione pompe e turbo"),
        (12000,"Major Overhaul",        "Motore",
         18000, 30000, "Cantiere Specializzato",
         "Overhaul completo MaK 8M25: pistoni, segmenti, bronzine, pompe Bosch"),
    ],

    "WARTSILA": [  # Wärtsilä — Balluta Bay
        (2000, "Cambio Olio 2000h",    "Filtrazione",
         600, 950, "Tecnico RCS",
         "Cambio olio + filtri Wärtsilä — Hifi SO 4562 (OEM 182B2040) + SN gasolio"),
        (4000, "Ispezione 4000h",       "Motore",
         2000, 3500, "Tecnico RCS + Specialista",
         "Ispezione valvole, distribuzione, iniettori CR Bosch 0 445 120 266"),
        (8000, "Revisione Maggiore",    "Motore",
         10000, 20000, "Cantiere Specializzato",
         "Revisione top end Wärtsilä: valvole, guide, tenute, ispezione iniettori"),
        (16000,"Major Overhaul",        "Motore",
         35000, 60000, "Cantiere Specializzato",
         "Overhaul completo Wärtsilä, pistoni, bronzine, albero a gomiti ispezione"),
    ],

    "VOLVO": [  # Volvo Diesel — MT Gozzo
        (500,  "Cambio Olio 500h",     "Filtrazione",
         150, 250, "Tecnico RCS",
         "Cambio olio + filtri Volvo Diesel — kit filtri certificato marine"),
        (1000, "Ispezione 1000h",       "Motore",
         300, 500, "Tecnico RCS",
         "Ispezione completa sistema Volvo: valvole, distribuzione, tenute"),
        (5000, "Major Service",         "Motore",
         3000, 6000, "Tecnico RCS",
         "Revisione parziale Volvo: iniettori, guarnizioni, verifica turbocompressore"),
    ],
}

# ─── TECNICI DISPONIBILI ─────────────────────────────────────────────────────

TECHNICIANS = {
    "Tecnico RCS":                 0.55,   # peso probabilità
    "Tecnico RCS Mario Greco":     0.20,
    "Tecnico RCS Luigi Russo":     0.15,
    "Cantiere Specializzato":      0.05,
    "Tecnico esterno certificato": 0.05,
}

# ─── LOGICA GENERAZIONE ──────────────────────────────────────────────────────

def choose_tech(base_tech: str) -> str:
    """Seleziona tecnico con pesi."""
    if "Cantiere" in base_tech or "Specialista" in base_tech:
        return random.choice(["Cantiere Navale Catania", "Cantiere Navale Palermo",
                               "Cantiere Pozzallo", "Cantiere Valletta"])
    techs = list(TECHNICIANS.keys())
    weights = list(TECHNICIANS.values())
    return random.choices(techs, weights=weights)[0]

def add_noise(value: float, pct: float = 0.12) -> float:
    """Aggiunge variazione realistica ±pct al valore."""
    return value * (1 + random.uniform(-pct, pct))

def ore_a_data(nave: dict, ore_target: int) -> datetime:
    """Converte ore motore in data approssimativa."""
    ore_correnti = nave["ore"]
    ore_anno = nave["ore_anno"]
    if ore_correnti <= 0 or ore_anno <= 0:
        return datetime.now()
    # Calcola quante ore fa era ore_target
    delta_ore = ore_correnti - ore_target
    delta_giorni = (delta_ore / ore_anno) * 365
    data = datetime(2026, 5, 15) - timedelta(days=max(0, delta_giorni))
    # Aggiungi rumore di ±3 giorni per realismo
    data += timedelta(days=random.randint(-3, 3))
    return data

def genera_manutenzioni(nave: dict, anni_storia: int = 6) -> List[dict]:
    """Genera lo storico manutenzioni completo per una nave."""
    tipo = nave["tipo"]
    schedule = ENGINE_SCHEDULES.get(tipo, [])
    if not schedule:
        return []

    ore_correnti = nave["ore"]
    eventi = []

    for (intervallo, check_name, sistema, costo_min, costo_max, base_tech, descrizione) in schedule:
        if intervallo <= 0:
            continue

        # Calcola tutte le occorrenze di questo check nelle ore disponibili
        # Limita agli ultimi `anni_storia` anni di operatività
        ore_max_storia = nave["ore_anno"] * anni_storia
        ore_inizio = max(0, ore_correnti - ore_max_storia)

        # Prima occorrenza del check nella storia
        prima = (ore_inizio // intervallo + 1) * intervallo

        ore_check = prima
        while ore_check <= ore_correnti:
            # Aggiungi variazione realistica all'intervallo (±5%)
            ore_effettive = int(add_noise(ore_check, 0.05))
            ore_effettive = min(ore_effettive, ore_correnti)

            # Calcola data
            data = ore_a_data(nave, ore_effettive)

            # Scarta eventi troppo vecchi o nel futuro
            if data > datetime.now():
                ore_check += intervallo
                continue

            # Costo con variazione realistica ±15%
            costo_base = (costo_min + costo_max) / 2
            costo = int(add_noise(costo_base, 0.15))
            # Se nave ad alta usura, costi tendono ad essere più alti
            if nave["usura"] > 75:
                costo = int(costo * random.uniform(1.1, 1.35))

            # Tecnico
            tecnico = choose_tech(base_tech)

            # Descrizione con dettaglio numero motori se rilevante
            desc_finale = descrizione
            if nave["n_motori"] > 1 and "filtri" in descrizione.lower():
                desc_finale += f" (×{nave['n_motori']} motori)"

            eventi.append({
                "data": data.strftime("%Y-%m-%d"),
                "nave": nave["nome"],
                "sistema": sistema,
                "desc": f"{check_name} — {desc_finale}",
                "tecnico": tecnico,
                "ore": ore_effettive,
                "costo": costo,
                "_motore": nave["motore"],
                "_intervallo_h": intervallo,
            })

            ore_check += intervallo

    # Ordina per data decrescente
    eventi.sort(key=lambda x: x["data"], reverse=True)
    return eventi

def genera_flotta(flotta_nome: str, anni_storia: int = 6) -> List[dict]:
    """Genera manutenzioni per tutta una flotta."""
    navi = FLEETS.get(flotta_nome, [])
    tutti = []
    for nave in navi:
        tutti.extend(genera_manutenzioni(nave, anni_storia))
    tutti.sort(key=lambda x: x["data"], reverse=True)
    return tutti

# ─── OUTPUT ───────────────────────────────────────────────────────────────────

def stampa_statistiche(eventi: List[dict], nome_flotta: str):
    """Stampa statistiche riassuntive."""
    if not eventi:
        print("Nessun evento generato.")
        return

    costo_tot = sum(e["costo"] for e in eventi)
    per_nave = {}
    per_sistema = {}
    for e in eventi:
        per_nave[e["nave"]] = per_nave.get(e["nave"], 0) + e["costo"]
        per_sistema[e["sistema"]] = per_sistema.get(e["sistema"], 0) + 1

    print(f"\n{'='*60}")
    print(f"  FLOTTA: {nome_flotta.upper()}")
    print(f"{'='*60}")
    print(f"  Totale interventi generati : {len(eventi)}")
    print(f"  Costo storico totale       : €{costo_tot:,.0f}")
    print(f"  Costo medio per intervento : €{costo_tot/len(eventi):,.0f}")
    print(f"\n  ── PER NAVE ──────────────────────────")
    for nave, costo in sorted(per_nave.items(), key=lambda x: -x[1]):
        count = sum(1 for e in eventi if e["nave"] == nave)
        print(f"  {nave[:35]:<35} {count:3d} interventi  €{costo:>8,.0f}")
    print(f"\n  ── PER SISTEMA ───────────────────────")
    for sys, count in sorted(per_sistema.items(), key=lambda x: -x[1]):
        print(f"  {sys:<20} {count:3d} interventi")
    print(f"{'='*60}\n")

def salva_json(eventi: List[dict], percorso: str, includi_meta: bool = False):
    """Salva in JSON pronto per il portale."""
    output = []
    for e in eventi:
        entry = {
            "data": e["data"],
            "nave": e["nave"],
            "sistema": e["sistema"],
            "desc": e["desc"],
            "tecnico": e["tecnico"],
            "ore": e["ore"],
            "costo": e["costo"],
        }
        if includi_meta:
            entry["_motore"] = e["_motore"]
            entry["_intervallo_h"] = e["_intervallo_h"]
        output.append(entry)

    with open(percorso, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"✅ JSON salvato: {percorso} ({len(output)} record)")

def salva_csv(eventi: List[dict], percorso: str):
    """Salva in CSV importabile direttamente nel portale RCS."""
    with open(percorso, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["data", "nave", "sistema", "desc", "tecnico", "ore_motore", "costo_eur"])
        for e in eventi:
            writer.writerow([
                e["data"], e["nave"], e["sistema"], e["desc"],
                e["tecnico"], e["ore"], e["costo"]
            ])
    print(f"✅ CSV salvato:  {percorso} ({len(eventi)} righe, pronto per importazione portale)")

def genera_snippet_js(eventi: List[dict], flotta: str) -> str:
    """Genera il snippet JS da incollare in cliente-operazioni.html."""
    righe = []
    for e in eventi[:40]:  # Prende i 40 più recenti per il portale
        righe.append(
            f"    {{ data:'{e['data']}', nave:'{e['nave']}', sistema:'{e['sistema']}', "
            f"desc:'{e['desc'].replace(chr(39), chr(96))}', tecnico:'{e['tecnico']}', "
            f"ore:{e['ore']}, costo:{e['costo']} }},"
        )
    snippet = f"""  // ── DATI GENERATI DA genera-manutenzioni.py ──
  {flotta}: [
{chr(10).join(righe)}
  ],"""
    return snippet

# ─── MAIN ────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="RCS Marine — Genera stime manutenzioni attendibili"
    )
    parser.add_argument("--flotta", choices=["virtu", "tug", "all"], default="all",
                        help="Flotta da elaborare (default: all)")
    parser.add_argument("--anni",   type=int, default=6,
                        help="Anni di storia da generare (default: 6)")
    parser.add_argument("--csv",    action="store_true",
                        help="Salva anche in formato CSV importabile nel portale")
    parser.add_argument("--js",     action="store_true",
                        help="Stampa snippet JS da incollare nel portale")
    parser.add_argument("--meta",   action="store_true",
                        help="Includi metadati tecnici nel JSON (tipo motore, intervallo)")
    parser.add_argument("--seed",   type=int, default=42,
                        help="Seed random per risultati riproducibili (default: 42)")
    args = parser.parse_args()

    random.seed(args.seed)

    flotte = ["virtu", "tug"] if args.flotta == "all" else [args.flotta]

    for nome_flotta in flotte:
        print(f"\n⏳ Elaborazione flotta: {nome_flotta.upper()} ({args.anni} anni di storia)...")
        eventi = genera_flotta(nome_flotta, args.anni)
        stampa_statistiche(eventi, nome_flotta)

        # Salva JSON
        percorso_json = f"manutenzioni_{nome_flotta}.json"
        salva_json(eventi, percorso_json, args.meta)

        # Salva CSV (opzionale)
        if args.csv:
            percorso_csv = f"manutenzioni_{nome_flotta}.csv"
            salva_csv(eventi, percorso_csv)

        # Snippet JS (opzionale)
        if args.js:
            print(f"\n── SNIPPET JS per MAINT_DATA.{nome_flotta} ───────────────")
            print(genera_snippet_js(eventi, nome_flotta))

    print("\n📋 ISTRUZIONI:")
    print("  1. Importa il CSV nel portale: OPS → MANUTENZIONI → IMPORTA CSV")
    print("  2. Oppure incolla il JSON in cliente-operazioni.html → MAINT_DATA")
    print("  3. Con --js ottieni direttamente lo snippet da incollare")
    print("  4. Usa --anni 10 per una storia più lunga")
    print("  5. Cambia --seed per generare varianti diverse")

if __name__ == "__main__":
    main()
