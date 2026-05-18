"""
Analisi Finanziaria Acquisto PC — Prospetto per SRL
=====================================================
Mostra: dettaglio carrello, detrazione IVA 22%, deduzione IRES 24%,
costo reale netto per la società e piano rimborso 50€/mese.

Esecuzione: python scripts/analisi_finanziaria_pc.py
Output:     scripts/grafici/  (3 grafici salvati automaticamente)
"""

import os
import math
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.gridspec import GridSpec

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "grafici")

# ---------------------------------------------------------------------------
# CARRELLO AMAZON — dati reali (prezzo IVA inclusa, quantità)
# ---------------------------------------------------------------------------
CARRELLO = [
    # (descrizione,                                  prezzo_unit,  qty, categoria)
    ("AMD Ryzen 9 9900X",                              356.25,  1, "PC Hardware"),
    ("PNY RTX 5080 16GB ARGB OC",                    1345.47,  1, "PC Hardware"),
    ("ASUS TUF GAMING X870-PLUS WiFi",                269.83,  1, "PC Hardware"),
    ("Corsair Vengeance DDR5 32GB 6000MHz",           437.14,  1, "PC Hardware"),
    ("Lexar ARES PRO SSD 2TB PCIe Gen5",              269.99,  1, "PC Hardware"),
    ("NZXT C850 Gold Core PSU 850W",                  119.00,  1, "PC Hardware"),
    ("Thermalright TR A70 Vision Case",               137.66,  1, "PC Hardware"),
    ("Thermalright Frozen Notte 360 AIO",              60.70,  1, "PC Hardware"),
    ("Thermalright TL-M12R-S Fan 120mm ARGB",          10.90,  3, "PC Hardware"),
    ("Thermalright TL-M12R-S Fan 120mm ARGB",           9.90,  2, "PC Hardware"),
    ("Thermalright ARGB HUB x8",                       12.90,  1, "PC Hardware"),
    ("ASUS TUF VG34VQL3A Monitor 34\" WQHD 180Hz",   289.00,  1, "Periferiche"),
    ("Logitech G305 Mouse Gaming Wireless",             35.99,  1, "Periferiche"),
    ("Logitech G213 Prodigy Tastiera IT",               43.49,  1, "Periferiche"),
    ("Sony WH-CH720N Cuffie Noise Cancelling",          69.99,  1, "Periferiche"),
    ("UGREEN Cavo DisplayPort 2.1 2m",                  11.89,  1, "Periferiche"),
    ("Amazon Basics Altoparlanti 2.0",                  15.30,  1, "Periferiche"),
    ("EFISH Mouse Pad XXL 800x300mm",                   14.99,  1, "Periferiche"),
    ("VASAGLE Scrivania Reg. Altezza 160x80cm",        139.99,  1, "Postazione"),
    ("Baroni Home Sedia Gaming Ergonomica",              82.99,  1, "Postazione"),
    ("iFalarila Lampada LED 160 con morsetto",           23.74,  1, "Postazione"),
]

IVA_RATE   = 0.22   # aliquota IVA standard IT
IRES_RATE  = 0.24   # aliquota IRES SRL
RATA       = 100.00  # rimborso mensile dell'impiegato

CAT_COLORS = {
    "PC Hardware":  "#4e79a7",
    "Periferiche":  "#e15759",
    "Postazione":   "#59a14f",
}


# ---------------------------------------------------------------------------
# Calcoli
# ---------------------------------------------------------------------------
def calcola():
    righe = []
    for desc, prezzo, qty, cat in CARRELLO:
        totale     = round(prezzo * qty, 2)
        imponibile = round(totale / (1 + IVA_RATE), 2)
        iva        = round(totale - imponibile, 2)
        righe.append({
            "desc": desc, "prezzo": prezzo, "qty": qty,
            "totale": totale, "imponibile": imponibile,
            "iva": iva, "cat": cat,
        })

    lordo      = round(sum(r["totale"]     for r in righe), 2)
    imponibile = round(sum(r["imponibile"] for r in righe), 2)
    iva_tot    = round(lordo - imponibile, 2)
    ires_save  = round(imponibile * IRES_RATE, 2)
    benef_tot  = round(iva_tot + ires_save, 2)
    netto      = round(lordo - benef_tot, 2)

    # piani rimborso (senza interessi)
    piani = {
        "Rimborso prezzo pieno\n(lordo IVA inclusa)":    (lordo,      "€ {:.2f}".format(lordo)),
        "Rimborso netto IVA\n(costo effettivo SRL)":     (imponibile, "€ {:.2f}".format(imponibile)),
        "Rimborso netto fiscale\n(dopo IRES + IVA)":     (netto,      "€ {:.2f}".format(netto)),
    }

    return righe, lordo, imponibile, iva_tot, ires_save, benef_tot, netto, piani


def mesi_str(mesi):
    anni = mesi // 12
    m    = mesi % 12
    if anni == 0:
        return f"{mesi} mesi"
    if m == 0:
        return f"{anni} ann{'o' if anni == 1 else 'i'}"
    return f"{anni} ann{'o' if anni == 1 else 'i'} e {m} mes{'e' if m == 1 else 'i'}"


def save(fig, name):
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    path = os.path.join(OUTPUT_DIR, name)
    fig.savefig(path, dpi=150, bbox_inches="tight")
    print(f"  [✓] Salvato: {path}")


# ---------------------------------------------------------------------------
# Grafico 1 — Dettaglio carrello per categoria
# ---------------------------------------------------------------------------
def plot_carrello(righe, lordo):
    cat_totali = {}
    for r in righe:
        cat_totali[r["cat"]] = cat_totali.get(r["cat"], 0) + r["totale"]

    fig = plt.figure(figsize=(16, 9))
    gs  = GridSpec(1, 2, figure=fig, width_ratios=[1, 1.6])
    fig.suptitle(
        f"Carrello Amazon.it — Dettaglio Acquisto PC\nTotale: € {lordo:,.2f} (IVA 22% inclusa)",
        fontsize=14, fontweight="bold"
    )

    # Donut
    ax1 = fig.add_subplot(gs[0])
    cats   = list(cat_totali.keys())
    valori = [cat_totali[c] for c in cats]
    colors = [CAT_COLORS[c] for c in cats]
    wedges, texts, autotexts = ax1.pie(
        valori, labels=cats, colors=colors,
        autopct=lambda p: f"€ {p/100*lordo:,.0f}\n({p:.1f}%)",
        startangle=90, pctdistance=0.75,
        wedgeprops={"width": 0.55, "edgecolor": "white", "linewidth": 2}
    )
    for t in autotexts:
        t.set_fontsize(9)
    ax1.set_title("Spesa per categoria", fontsize=11)

    # Barre orizzontali articoli
    ax2 = fig.add_subplot(gs[1])
    labels = []
    valori_barre = []
    bar_colors   = []
    for r in sorted(righe, key=lambda x: x["totale"]):
        nome = r["desc"][:42] + ("…" if len(r["desc"]) > 42 else "")
        if r["qty"] > 1:
            nome += f"  (x{r['qty']})"
        labels.append(nome)
        valori_barre.append(r["totale"])
        bar_colors.append(CAT_COLORS[r["cat"]])

    y = range(len(labels))
    bars = ax2.barh(list(y), valori_barre, color=bar_colors, alpha=0.85, edgecolor="white")
    for bar, val in zip(bars, valori_barre):
        ax2.text(bar.get_width() + 8, bar.get_y() + bar.get_height() / 2,
                 f"€ {val:,.2f}", va="center", fontsize=8)
    ax2.set_yticks(list(y))
    ax2.set_yticklabels(labels, fontsize=8)
    ax2.set_xlabel("€ (IVA inclusa)")
    ax2.set_title("Dettaglio articoli", fontsize=11)
    ax2.set_xlim(0, max(valori_barre) * 1.22)
    ax2.grid(axis="x", alpha=0.3)

    legenda = [mpatches.Patch(color=CAT_COLORS[c], label=c) for c in cats]
    ax2.legend(handles=legenda, fontsize=9, loc="lower right")

    plt.tight_layout(rect=[0, 0, 1, 0.94])
    save(fig, "PC_01_dettaglio_carrello.png")


# ---------------------------------------------------------------------------
# Grafico 2 — Waterfall benefici fiscali SRL
# ---------------------------------------------------------------------------
def plot_fiscale(lordo, iva_tot, ires_save, benef_tot, netto):
    fig, ax = plt.subplots(figsize=(11, 7))
    fig.suptitle(
        "Analisi Fiscale — Benefici per la SRL\n"
        "Detrazione IVA 22% + Deduzione IRES 24% sull'imponibile",
        fontsize=13, fontweight="bold"
    )

    step_labels = [
        f"Prezzo lordo\n(IVA inclusa)",
        f"(-) IVA detraibile\n22%",
        f"(-) Risparmio IRES\n24% sull'imponibile",
        f"Costo reale netto\nper la SRL",
    ]
    step_values = [lordo, -iva_tot, -ires_save, netto]
    step_colors = ["#4e79a7", "#f28e2b", "#e15759", "#59a14f"]

    running = lordo
    bottoms = []
    heights = []

    bottoms.append(0)
    heights.append(lordo)

    running2 = lordo
    for v in step_values[1:-1]:
        bottoms.append(running2 + v)
        heights.append(-v)
        running2 += v

    bottoms.append(0)
    heights.append(netto)

    x = range(4)
    for xi, (b, h, c, lbl, sv) in enumerate(
            zip(bottoms, heights, step_colors, step_labels, step_values)):
        ax.bar(xi, h, bottom=b, color=c, alpha=0.85, width=0.55,
               edgecolor="white", linewidth=1.5)
        y_text = b + h / 2
        val_str = f"€ {abs(sv):,.2f}"
        if sv < 0:
            val_str = f"- € {abs(sv):,.2f}"
        ax.text(xi, y_text, val_str, ha="center", va="center",
                fontsize=11, fontweight="bold", color="white")

    ax.set_xticks(list(x))
    ax.set_xticklabels(step_labels, fontsize=10)
    ax.set_ylabel("€")
    ax.set_ylim(0, lordo * 1.12)
    ax.grid(axis="y", alpha=0.3)

    # Annotazioni risparmio
    ax.annotate(
        f"Risparmio totale\n€ {benef_tot:,.2f}\n({benef_tot/lordo*100:.1f}%)",
        xy=(2.5, netto + (lordo - netto) / 2),
        xytext=(3.3, lordo * 0.6),
        fontsize=10, color="#333",
        arrowprops=dict(arrowstyle="->", color="#333"),
        bbox=dict(boxstyle="round,pad=0.4", facecolor="#ffffcc", alpha=0.9)
    )

    # Tabella riepilogo sotto
    tab_data = [
        ["Prezzo lordo Amazon",    f"€ {lordo:,.2f}"],
        ["Imponibile (IVA esclusa)", f"€ {lordo/(1+IVA_RATE):,.2f}"],
        ["IVA 22% detraibile",     f"€ {iva_tot:,.2f}"],
        ["Risparmio IRES 24%",     f"€ {ires_save:,.2f}"],
        ["BENEFICIO FISCALE TOT.", f"€ {benef_tot:,.2f}"],
        ["COSTO REALE NETTO SRL",  f"€ {netto:,.2f}"],
    ]
    col_labels = ["Voce", "Importo"]
    table = ax.table(
        cellText=tab_data, colLabels=col_labels,
        cellLoc="left", loc="bottom", bbox=[0.0, -0.52, 1.0, 0.44]
    )
    table.auto_set_font_size(False)
    table.set_fontsize(9)
    for (row, col), cell in table.get_celld().items():
        if row == 0:
            cell.set_facecolor("#4e79a7")
            cell.set_text_props(color="white", fontweight="bold")
        elif row in (5, 6):
            cell.set_facecolor("#d4edda")
            cell.set_text_props(fontweight="bold")
        elif row % 2 == 0:
            cell.set_facecolor("#f7f7f7")

    plt.subplots_adjust(bottom=0.38)
    save(fig, "PC_02_analisi_fiscale.png")


# ---------------------------------------------------------------------------
# Grafico 3 — Piano rimborso 50€/mese (3 scenari)
# ---------------------------------------------------------------------------
def plot_rimborso(lordo, imponibile, netto):
    scenari = [
        ("Rimborso lordo (€ {:,.2f})".format(lordo),      lordo,      "#e15759"),
        ("Rimborso netto IVA (€ {:,.2f})".format(imponibile), imponibile, "#f28e2b"),
        ("Rimborso netto fiscale (€ {:,.2f})".format(netto),  netto,      "#59a14f"),
    ]

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 7))
    fig.suptitle(
        f"Piano Rimborso — {RATA:.0f} €/mese senza interessi\n"
        "3 scenari a confronto",
        fontsize=13, fontweight="bold"
    )

    for label, totale, color in scenari:
        n_mesi = math.ceil(totale / RATA)
        mesi   = list(range(0, n_mesi + 1))
        debito = [max(totale - m * RATA, 0) for m in mesi]
        ax1.plot(mesi, debito, "o-", color=color, markersize=3,
                 linewidth=2, label=f"{label}\n→ {mesi_str(n_mesi)}")

    ax1.axhline(0, color="black", linewidth=0.8)
    ax1.set_xlabel("Mese")
    ax1.set_ylabel("Debito residuo (€)")
    ax1.set_title("Debito residuo nel tempo")
    ax1.legend(fontsize=8, loc="upper right")
    ax1.grid(alpha=0.3)

    # Barre di confronto: mesi totali e costo
    nomi    = ["Lordo\n€ {:,.0f}".format(lordo),
               "Netto IVA\n€ {:,.0f}".format(imponibile),
               "Netto fiscale\n€ {:,.0f}".format(netto)]
    totali  = [lordo, imponibile, netto]
    n_mesi_list = [math.ceil(t / RATA) for t in totali]
    colors  = ["#e15759", "#f28e2b", "#59a14f"]

    x = range(3)
    bars = ax2.bar(list(x), n_mesi_list, color=colors, alpha=0.85,
                   width=0.5, edgecolor="white")
    for bar, nm, tot in zip(bars, n_mesi_list, totali):
        ax2.text(bar.get_x() + bar.get_width() / 2,
                 bar.get_height() + 0.8,
                 f"{mesi_str(nm)}\n(€ {tot:,.0f})",
                 ha="center", va="bottom", fontsize=9, fontweight="bold")

    ax2.set_xticks(list(x))
    ax2.set_xticklabels(nomi, fontsize=9)
    ax2.set_ylabel("Mesi per estinguere il debito")
    ax2.set_title(f"Durata rimborso per scenario\n(rata: € {RATA:.0f}/mese)")
    ax2.set_ylim(0, max(n_mesi_list) * 1.18)
    ax2.grid(axis="y", alpha=0.3)

    plt.tight_layout(rect=[0, 0, 1, 0.94])
    save(fig, "PC_03_piano_rimborso.png")


# ---------------------------------------------------------------------------
# Riepilogo console
# ---------------------------------------------------------------------------
def stampa_riepilogo(righe, lordo, imponibile, iva_tot, ires_save, benef_tot, netto):
    print("\n" + "=" * 72)
    print("  DETTAGLIO CARRELLO AMAZON.IT")
    print("=" * 72)
    print(f"  {'Articolo':<46} {'Qty':>3}  {'Prezzo':>8}  {'Totale':>9}")
    print("-" * 72)
    cat_curr = ""
    for r in righe:
        if r["cat"] != cat_curr:
            cat_curr = r["cat"]
            print(f"\n  ── {cat_curr} ──")
        nome = r["desc"][:46]
        print(f"  {nome:<46} {r['qty']:>3}x  € {r['prezzo']:>6.2f}  € {r['totale']:>7.2f}")
    print("-" * 72)
    print(f"  {'TOTALE (24 articoli, IVA inclusa)':<52}  € {lordo:>8.2f}")

    print("\n" + "=" * 72)
    print("  ANALISI FISCALE — VANTAGGI PER LA SRL")
    print("=" * 72)
    print(f"  Prezzo lordo Amazon (IVA 22% inclusa)      € {lordo:>10.2f}")
    print(f"  Imponibile (IVA esclusa)                   € {imponibile:>10.2f}")
    print(f"  IVA 22% → DETRAIBILE integralmente        -€ {iva_tot:>10.2f}")
    print(f"  Risparmio IRES 24% sull'imponibile        -€ {ires_save:>10.2f}")
    print(f"  ─────────────────────────────────────────────────────")
    print(f"  BENEFICIO FISCALE TOTALE                  -€ {benef_tot:>10.2f}  ({benef_tot/lordo*100:.1f}%)")
    print(f"  COSTO REALE NETTO PER LA SRL               € {netto:>10.2f}")

    print("\n" + "=" * 72)
    print(f"  PIANO RIMBORSO — € {RATA:.0f}/mese (senza interessi)")
    print("=" * 72)

    scenari = [
        ("Rimborso prezzo pieno (lordo IVA)", lordo),
        ("Rimborso netto IVA (costo SRL)",    imponibile),
        ("Rimborso netto fiscale (netto tot)", netto),
    ]
    for nome, totale in scenari:
        nm = math.ceil(totale / RATA)
        print(f"  {nome:<38}  → {mesi_str(nm):<18}  (€ {totale:,.2f})")

    print("=" * 72)
    print(f"\n  NOTA LEGALE: per prestiti SRL→dipendente si applica il tasso")
    print(f"  legale vigente come benefit in natura (attualmente ~2.5%/anno).")
    print(f"  Con tasso legale sul lordo: +€ {lordo*0.025:.0f}/anno ~ +€ {lordo*0.025/12:.0f}/mese lordo benefit.\n")
    print(f"  Grafici salvati in: {OUTPUT_DIR}\n")


def main():
    righe, lordo, imponibile, iva_tot, ires_save, benef_tot, netto, piani = calcola()
    stampa_riepilogo(righe, lordo, imponibile, iva_tot, ires_save, benef_tot, netto)

    print("Generazione grafici...")
    plot_carrello(righe, lordo)
    plot_fiscale(lordo, iva_tot, ires_save, benef_tot, netto)
    plot_rimborso(lordo, imponibile, netto)

    plt.show()
    print("[✓] Completato.")


if __name__ == "__main__":
    main()
