"""
Hardware Price Trend Analyzer — Dati Reali Amazon.it
======================================================
Traccia il sovrapprezzo reale su GPU, RAM, Monitor rispetto al prezzo MSRP.
Aggiungi nuove rilevazioni in PRICE_LOG per aggiornare i grafici nel tempo.

Dipendenze: pip install pandas numpy matplotlib scikit-learn scipy
Esecuzione:  python scripts/hardware_price_trend.py
Output:      scripts/grafici/*.png  (salvati automaticamente)
"""

import os
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
import warnings
warnings.filterwarnings("ignore")

# ---------------------------------------------------------------------------
# MSRP — prezzi di riferimento ufficiali / listino NVIDIA-Corsair-LG (€)
# ---------------------------------------------------------------------------
MSRP = {
    "RTX 5070 Ti":        899,
    "RTX 5080":          1199,
    "DDR5 32GB 6000 CL30": 250,
    "Monitor 34\" QD-OLED": 599,
}

# ---------------------------------------------------------------------------
# PRICE_LOG — rilevazioni reali da Amazon.it
# Formato: ("YYYY-MM-DD", "componente", prezzo_minimo, prezzo_medio, prezzo_massimo)
#
# AGGIUNGI QUI le prossime rilevazioni per vedere il trend nel tempo.
# ---------------------------------------------------------------------------
PRICE_LOG = [
    # ── Maggio 2026 (rilevazione iniziale da Amazon.it) ──────────────────
    # RTX 5070 Ti: Gigabyte 720€ · MSI 981€ · ASUS TUF 1133€ · ROG 1270€
    ("2026-05-18", "RTX 5070 Ti",          719,  1026,  1270),

    # RTX 5080: Gigabyte 1336€ · MSI Inspire 1400€ · ASUS TUF 1491€ · ROG 1685€
    ("2026-05-18", "RTX 5080",            1336,  1483,  1685),

    # DDR5 32GB 6000 CL30: Patriot 438€ · Lexar 400-426€ · Corsair 517€
    ("2026-05-18", "DDR5 32GB 6000 CL30",  399,   445,   517),

    # Monitor 34" QD-OLED: AOC 588€ · MSI 651€ · LG 746€ · Alienware 824€
    ("2026-05-18", "Monitor 34\" QD-OLED", 588,   679,   824),
]

COLORS = {
    "RTX 5070 Ti":          "#e15759",
    "RTX 5080":             "#b07aa1",
    "DDR5 32GB 6000 CL30":  "#4e79a7",
    "Monitor 34\" QD-OLED": "#59a14f",
}

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "grafici")


def build_df():
    rows = []
    for date, comp, pmin, pavg, pmax in PRICE_LOG:
        msrp = MSRP[comp]
        rows.append({
            "date":     pd.to_datetime(date),
            "comp":     comp,
            "p_min":    pmin,
            "p_avg":    pavg,
            "p_max":    pmax,
            "surp_min": round((pmin / msrp - 1) * 100, 1),
            "surp_avg": round((pavg / msrp - 1) * 100, 1),
            "surp_max": round((pmax / msrp - 1) * 100, 1),
        })
    return pd.DataFrame(rows)


def forecast(series_dates, series_values, n=12):
    """Regressione lineare sui dati disponibili, proietta n mesi avanti."""
    if len(series_values) < 2:
        last_val = series_values[-1] if len(series_values) > 0 else 0
        fc_dates = pd.date_range(
            start=series_dates.iloc[-1] + pd.DateOffset(months=1),
            periods=n, freq="MS"
        )
        # trend piatto con leggera discesa se sopra 0
        slope = -last_val * 0.05
        fc_vals = [max(last_val + slope * i, -10) for i in range(1, n + 1)]
        return fc_dates, np.array(fc_vals)

    x = np.arange(len(series_values)).reshape(-1, 1)
    y = np.array(series_values)
    poly = PolynomialFeatures(degree=min(2, len(y) - 1))
    model = LinearRegression().fit(poly.fit_transform(x), y)
    x_fut = np.arange(len(y), len(y) + n).reshape(-1, 1)
    y_fut = model.predict(poly.transform(x_fut))
    fc_dates = pd.date_range(
        start=series_dates.iloc[-1] + pd.DateOffset(months=1),
        periods=n, freq="MS"
    )
    return fc_dates, y_fut


def save(fig, name):
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    path = os.path.join(OUTPUT_DIR, name)
    fig.savefig(path, dpi=150, bbox_inches="tight")
    print(f"  [✓] Salvato: {path}")
    return path


# ---------------------------------------------------------------------------
# Grafico 1 — Sovrapprezzo attuale (barre con range min/max)
# ---------------------------------------------------------------------------
def plot_bar_current(df):
    last = df.groupby("comp").last().reset_index()
    comps = last["comp"].tolist()
    avgs  = last["surp_avg"].tolist()
    mins  = last["surp_min"].tolist()
    maxs  = last["surp_max"].tolist()
    colors = [COLORS[c] for c in comps]
    err_lo = [a - mn for a, mn in zip(avgs, mins)]
    err_hi = [mx - a  for a, mx in zip(avgs, maxs)]

    fig, ax = plt.subplots(figsize=(10, 6))
    bars = ax.bar(comps, avgs, color=colors, alpha=0.85, zorder=3,
                  yerr=[err_lo, err_hi], capsize=6, error_kw={"linewidth": 1.5})

    ax.axhline(0,  color="black", linewidth=0.8)
    ax.axhline(10, color="orange", linewidth=0.8, linestyle="--", alpha=0.7, label="+10% soglia")

    for bar, val, mn, mx, comp in zip(bars, avgs, mins, maxs, comps):
        msrp = MSRP[comp]
        p_avg = round(msrp * (1 + val / 100))
        ax.text(bar.get_x() + bar.get_width() / 2, val + (max(err_hi) * 0.15),
                f"+{val:.0f}%\n€{p_avg}", ha="center", va="bottom", fontsize=9, fontweight="bold")

    ax.set_ylabel("Sovrapprezzo vs MSRP (%)")
    ax.set_title("Sovrapprezzo Hardware — Amazon.it | Maggio 2026\n"
                 "Barre = media prezzi rilevati · Whisker = min/max",
                 fontsize=12, fontweight="bold")
    ax.legend(fontsize=9)
    ax.grid(axis="y", alpha=0.3, zorder=0)
    plt.xticks(rotation=10, ha="right")
    plt.tight_layout()
    return save(fig, "01_sovrapprezzo_attuale.png")


# ---------------------------------------------------------------------------
# Grafico 2 — Dettaglio prezzi reali vs MSRP per ogni componente
# ---------------------------------------------------------------------------
def plot_price_vs_msrp(df):
    comps = df["comp"].unique()
    fig, axes = plt.subplots(2, 2, figsize=(14, 10))
    fig.suptitle("Prezzi Reali Amazon.it vs MSRP — Maggio 2026",
                 fontsize=13, fontweight="bold")

    for ax, comp in zip(axes.flat, comps):
        sub = df[df["comp"] == comp].sort_values("date")
        color = COLORS[comp]
        msrp = MSRP[comp]

        ax.axhline(msrp, color="green", linewidth=1.5, linestyle="--", label=f"MSRP €{msrp}")
        ax.fill_between(sub["date"], sub["p_min"], sub["p_max"],
                        alpha=0.2, color=color, label="Range min/max")
        ax.plot(sub["date"], sub["p_avg"], "o-", color=color, linewidth=2,
                markersize=8, label="Prezzo medio")
        ax.plot(sub["date"], sub["p_min"], "v--", color=color, alpha=0.6, markersize=5)
        ax.plot(sub["date"], sub["p_max"], "^--", color=color, alpha=0.6, markersize=5)

        # Forecast
        fc_dates, fc_vals_surp = forecast(sub["date"], sub["surp_avg"].tolist())
        fc_prices = [msrp * (1 + v / 100) for v in fc_vals_surp]
        ax.plot(fc_dates, fc_prices, color=color, linewidth=1,
                linestyle=":", alpha=0.7, label="Previsione")

        surp_now = sub["surp_avg"].iloc[-1]
        ax.set_title(f"{comp}  |  Sovrapprezzo attuale: {surp_now:+.1f}%",
                     fontsize=10, fontweight="bold", color=color)
        ax.set_ylabel("€")
        ax.xaxis.set_major_formatter(mdates.DateFormatter("%b %y"))
        ax.legend(fontsize=8)
        ax.grid(alpha=0.3)

    plt.tight_layout(rect=[0, 0, 1, 0.96])
    return save(fig, "02_prezzi_vs_msrp.png")


# ---------------------------------------------------------------------------
# Grafico 3 — Trend sovrapprezzo nel tempo (si arricchisce ad ogni rilevazione)
# ---------------------------------------------------------------------------
def plot_trend(df):
    fig, ax = plt.subplots(figsize=(13, 6))
    ax.set_title("Trend Sovrapprezzo nel Tempo — tutte le rilevazioni",
                 fontsize=12, fontweight="bold")

    for comp in df["comp"].unique():
        sub = df[df["comp"] == comp].sort_values("date")
        color = COLORS[comp]
        ax.plot(sub["date"], sub["surp_avg"], "o-", color=color,
                linewidth=2, markersize=7, label=comp)
        ax.fill_between(sub["date"], sub["surp_min"], sub["surp_max"],
                        alpha=0.12, color=color)

        # Forecast
        fc_dates, fc_vals = forecast(sub["date"], sub["surp_avg"].tolist())
        ax.plot(fc_dates, fc_vals, "--", color=color, alpha=0.5, linewidth=1.5)

    ax.axhline(0, color="black", linewidth=0.8)
    ax.axhline(10, color="orange", linewidth=0.7, linestyle=":", alpha=0.7)
    ax.set_ylabel("Sovrapprezzo vs MSRP (%)")
    ax.xaxis.set_major_formatter(mdates.DateFormatter("%b %y"))
    ax.legend(fontsize=9)
    ax.grid(alpha=0.3)
    plt.tight_layout()
    return save(fig, "03_trend_sovrapprezzo.png")


# ---------------------------------------------------------------------------
# Console summary
# ---------------------------------------------------------------------------
def print_summary(df):
    print("\n" + "=" * 70)
    print("  RIEPILOGO SOVRAPPREZZO HARDWARE — Amazon.it (ultima rilevazione)")
    print("=" * 70)
    print(f"{'Componente':<26} {'MSRP':>7} {'Min':>7} {'Avg':>7} {'Max':>7}  {'Surp%':>7}  {'Recovery est.'}")
    print("-" * 70)

    for comp in MSRP:
        sub = df[df["comp"] == comp].sort_values("date")
        if sub.empty:
            continue
        last = sub.iloc[-1]
        msrp = MSRP[comp]
        fc_dates, fc_vals = forecast(sub["date"], sub["surp_avg"].tolist(), n=24)
        rec = next((d.strftime("%b %Y") for d, v in zip(fc_dates, fc_vals) if v <= 5), "oltre 2 anni")
        print(f"{comp:<26} €{msrp:>5}  €{last['p_min']:>5.0f}  €{last['p_avg']:>5.0f}"
              f"  €{last['p_max']:>5.0f}  {last['surp_avg']:>+6.1f}%  {rec}")

    print("=" * 70)
    print("\n  Grafici salvati in:", OUTPUT_DIR)
    print("  Per aggiornare: aggiungi righe in PRICE_LOG e riesegui lo script.\n")


def main():
    print("\nHardware Price Trend Analyzer — elaborazione...")
    df = build_df()

    print_summary(df)

    print("\nGenerazione grafici:")
    plot_bar_current(df)
    plot_price_vs_msrp(df)
    plot_trend(df)

    # Apri i grafici a fine elaborazione
    plt.show()
    print("\n[✓] Completato.")


if __name__ == "__main__":
    main()
