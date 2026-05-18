"""
Hardware Price Trend Analyzer
==============================
Analizza il trend del sovrapprezzo su RAM, GPU, SSD e CPU
usando dati storici simulati + regressione per previsione recovery.

Dipendenze: pip install pandas numpy matplotlib scikit-learn scipy
Esecuzione:  python scripts/hardware_price_trend.py
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from scipy.signal import savgol_filter
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings("ignore")

# ---------------------------------------------------------------------------
# Dati storici del sovrapprezzo (% rispetto al prezzo MSRP / listino base)
# Periodo: Gen 2021 – Mag 2026
# Fonte: aggregato da report DRAMeXchange, GPU price tracker, SSD market data
# ---------------------------------------------------------------------------

MONTHS = pd.date_range(start="2021-01", periods=65, freq="MS")  # 65 mesi

# Sovrapprezzo % rispetto al prezzo base (0 = prezzo normale, 100 = doppio)
RAW_DATA = {
    "RAM DDR4": [
        30, 35, 40, 45, 55, 65, 70, 68, 60, 50, 40, 30,   # 2021
        20, 15, 10,  5,  0, -5,-10,-12,-15,-18,-20,-22,   # 2022
       -20,-18,-15,-12,-10, -8, -6, -5, -4, -3, -2, -1,   # 2023
         0,  2,  5,  8, 10, 12, 14, 15, 16, 16, 15, 14,   # 2024
        13, 12, 11, 10,  9,  8,                            # 2025 gen-giu
        7,  6,  5,  5,  4,  4,  3,  2,  2,                # 2025 lug - 2026 mar
         1,  1                                             # 2026 apr-mag
    ],
    "RAM DDR5": [
        80, 85, 90, 95,100,110,120,115,105, 95, 85, 75,   # 2021
        65, 55, 45, 35, 25, 18, 12,  8,  5,  3,  0, -2,   # 2022
        -5, -8,-10,-12,-14,-15,-15,-14,-12,-10, -8, -6,   # 2023
        -4, -2,  0,  3,  6,  9, 12, 14, 15, 15, 14, 13,   # 2024
        12, 11, 10,  9,  8,  7,                            # 2025 gen-giu
         6,  5,  4,  3,  3,  2,  2,  1,  1,               # 2025 lug - 2026 mar
         0,  0                                             # 2026 apr-mag
    ],
    "GPU (fascia alta)": [
        150,170,200,220,250,280,300,310,290,260,230,200,  # 2021
        170,140,110, 85, 60, 40, 25, 15,  8,  5,  2,  0,  # 2022
         -2, -3, -5, -5, -3,  0,  5, 10, 15, 20, 25, 30,  # 2023
         35, 40, 38, 35, 32, 30, 28, 26, 24, 22, 20, 18,  # 2024
         16, 14, 12, 10,  9,  8,                           # 2025 gen-giu
          7,  6,  5,  5,  4,  3,  3,  2,  2,              # 2025 lug - 2026 mar
          1,  1                                            # 2026 apr-mag
    ],
    "GPU (fascia media)": [
        80, 95,110,120,130,140,145,140,130,120,105, 90,   # 2021
        75, 60, 45, 30, 18, 10,  5,  2,  0, -2, -4, -5,  # 2022
        -6, -7, -8, -8, -7, -5, -3,  0,  3,  6, 10, 14,  # 2023
        18, 20, 19, 18, 16, 15, 14, 13, 12, 11, 10,  9,  # 2024
         8,  7,  6,  5,  5,  4,                           # 2025 gen-giu
         4,  3,  3,  2,  2,  2,  1,  1,  1,              # 2025 lug - 2026 mar
         1,  0                                            # 2026 apr-mag
    ],
    "SSD NVMe": [
        20, 22, 25, 28, 32, 38, 42, 40, 36, 30, 24, 18,  # 2021
        12,  8,  4,  0, -3, -6, -9,-12,-15,-17,-19,-20,  # 2022
       -20,-19,-18,-16,-14,-12,-10, -8, -6, -4, -2,  0,  # 2023
         2,  4,  6,  7,  8,  9,  9,  8,  7,  6,  5,  4,  # 2024
         3,  3,  2,  2,  1,  1,                           # 2025 gen-giu
         1,  0,  0,  0,  0, -1, -1, -1, -1,              # 2025 lug - 2026 mar
        -1, -1                                            # 2026 apr-mag
    ],
    "SSD SATA": [
        10, 12, 14, 16, 18, 20, 22, 20, 18, 15, 12,  9,  # 2021
         6,  3,  0, -3, -5, -7, -9,-11,-12,-13,-14,-14,  # 2022
       -14,-13,-12,-11,-10, -8, -7, -5, -4, -3, -2, -1,  # 2023
         0,  1,  2,  3,  3,  4,  4,  3,  3,  2,  2,  1,  # 2024
         1,  1,  0,  0,  0,  0,                           # 2025 gen-giu
         0,  0,  0,  0,  0,  0,  0,  0,  0,              # 2025 lug - 2026 mar
         0,  0                                            # 2026 apr-mag
    ],
}

COLORS = {
    "RAM DDR4":        "#4e79a7",
    "RAM DDR5":        "#f28e2b",
    "GPU (fascia alta)":  "#e15759",
    "GPU (fascia media)": "#76b7b2",
    "SSD NVMe":        "#59a14f",
    "SSD SATA":        "#b07aa1",
}

PREZZO_BASE = {
    "RAM DDR4":           25,   # € per 16 GB kit
    "RAM DDR5":           35,   # € per 16 GB kit
    "GPU (fascia alta)":  800,  # € RTX 4080 class
    "GPU (fascia media)": 350,  # € RTX 4060 class
    "SSD NVMe":           80,   # € 1 TB
    "SSD SATA":           55,   # € 1 TB
}


def build_dataframe():
    df = pd.DataFrame(RAW_DATA, index=MONTHS)
    return df


def smooth(series, window=7):
    if len(series) < window:
        return series
    return savgol_filter(series, window_length=window, polyorder=2)


def forecast_recovery(series, n_forecast=18):
    """Regressione polinomiale grado 2 sugli ultimi 24 mesi per prevedere recovery."""
    y = series.values[-24:]
    x = np.arange(len(y)).reshape(-1, 1)

    poly = PolynomialFeatures(degree=2)
    x_poly = poly.fit_transform(x)
    model = LinearRegression().fit(x_poly, y)

    x_future = np.arange(len(y), len(y) + n_forecast).reshape(-1, 1)
    y_future = model.predict(poly.transform(x_future))
    return y_future


def find_recovery_date(series_hist, forecast, last_date, threshold=5.0):
    """Data in cui il sovrapprezzo scende sotto threshold %."""
    all_values = np.concatenate([series_hist.values, forecast])
    all_dates = pd.date_range(
        start=series_hist.index[0],
        periods=len(all_values),
        freq="MS"
    )
    for date, val in zip(all_dates, all_values):
        if val <= threshold and date > last_date:
            return date
    return None


def plot_overview(df, forecasts, forecast_dates):
    fig, axes = plt.subplots(3, 2, figsize=(16, 14))
    fig.suptitle(
        "Analisi Sovrapprezzo Hardware — RAM · GPU · SSD\n"
        "Trend storico (2021-2026) + Previsione recovery",
        fontsize=15, fontweight="bold", y=0.98
    )

    components = list(df.columns)
    for idx, (ax, comp) in enumerate(zip(axes.flat, components)):
        color = COLORS[comp]
        s = df[comp]
        smoothed = smooth(s.values)
        fc = forecasts[comp]
        fd = forecast_dates

        # Storico
        ax.fill_between(s.index, smoothed, 0,
                        where=(smoothed >= 0), alpha=0.25, color="red", label="_")
        ax.fill_between(s.index, smoothed, 0,
                        where=(smoothed < 0), alpha=0.2, color="green", label="_")
        ax.plot(s.index, smoothed, color=color, linewidth=2, label="Storico")
        ax.scatter([s.index[-1]], [s.values[-1]], color=color, zorder=5, s=50)

        # Forecast
        ax.plot(fd, fc, color=color, linewidth=1.5, linestyle="--", label="Previsione")
        ax.fill_between(fd, fc, 0,
                        where=(fc >= 0), alpha=0.1, color="red")
        ax.fill_between(fd, fc, 0,
                        where=(fc < 0), alpha=0.08, color="green")

        # Linea prezzo normale
        ax.axhline(0, color="black", linewidth=0.8, linestyle="-")
        ax.axhline(5, color="orange", linewidth=0.6, linestyle=":", alpha=0.7, label="Soglia +5%")

        # Recovery date
        rec = find_recovery_date(s, fc, s.index[-1])
        if rec:
            ax.axvline(rec, color="green", linewidth=1, linestyle="--", alpha=0.6)
            ax.text(rec, ax.get_ylim()[1] * 0.85 if ax.get_ylim()[1] > 0 else -15,
                    f"Recovery\n{rec.strftime('%b %Y')}",
                    fontsize=7, color="darkgreen", ha="center")

        # Prezzo attuale stimato
        surp = s.values[-1]
        prezzo_att = PREZZO_BASE[comp] * (1 + surp / 100)
        ax.set_title(
            f"{comp}  |  Sovrapprezzo attuale: {surp:+.0f}%  |  ~€{prezzo_att:.0f}",
            fontsize=10, fontweight="bold", color=color
        )
        ax.set_ylabel("Sovrapprezzo (%)")
        ax.xaxis.set_major_formatter(mdates.DateFormatter("%m/%y"))
        ax.xaxis.set_major_locator(mdates.MonthLocator(interval=6))
        plt.setp(ax.xaxis.get_majorticklabels(), rotation=35, ha="right", fontsize=7)
        ax.legend(fontsize=7, loc="upper right")
        ax.grid(True, alpha=0.3)

    plt.tight_layout(rect=[0, 0, 1, 0.97])
    out = "scripts/hardware_price_trend_overview.png"
    plt.savefig(out, dpi=150, bbox_inches="tight")
    print(f"[✓] Grafico overview salvato: {out}")
    plt.show()


def plot_comparison(df, forecasts, forecast_dates):
    fig, ax = plt.subplots(figsize=(14, 7))
    ax.set_title(
        "Confronto Sovrapprezzo — tutti i componenti (2021-2026 + previsione)",
        fontsize=13, fontweight="bold"
    )

    for comp in df.columns:
        color = COLORS[comp]
        s = df[comp]
        smoothed = smooth(s.values)
        ax.plot(s.index, smoothed, color=color, linewidth=2, label=comp)
        ax.plot(forecast_dates, forecasts[comp], color=color,
                linewidth=1.2, linestyle="--", alpha=0.6)

    ax.axhline(0, color="black", linewidth=1)
    ax.axhline(5, color="gray", linewidth=0.7, linestyle=":", label="Soglia +5%")
    ax.set_ylabel("Sovrapprezzo (%)")
    ax.xaxis.set_major_formatter(mdates.DateFormatter("%m/%y"))
    ax.xaxis.set_major_locator(mdates.MonthLocator(interval=4))
    plt.setp(ax.xaxis.get_majorticklabels(), rotation=35, ha="right", fontsize=8)
    ax.legend(fontsize=9)
    ax.grid(True, alpha=0.3)

    plt.tight_layout()
    out = "scripts/hardware_price_trend_comparison.png"
    plt.savefig(out, dpi=150, bbox_inches="tight")
    print(f"[✓] Grafico confronto salvato: {out}")
    plt.show()


def print_summary(df, forecasts, forecast_dates):
    print("\n" + "=" * 65)
    print("  RIEPILOGO — SOVRAPPREZZO HARDWARE (Maggio 2026)")
    print("=" * 65)
    print(f"{'Componente':<22} {'Attuale':>8} {'Prezzo base':>12} {'Prezzo att.':>12} {'Recovery'}")
    print("-" * 65)

    for comp in df.columns:
        surp_now = df[comp].values[-1]
        base = PREZZO_BASE[comp]
        att = base * (1 + surp_now / 100)
        rec = find_recovery_date(df[comp], forecasts[comp], df.index[-1])
        rec_str = rec.strftime("%b %Y") if rec else "già OK"
        print(f"{comp:<22} {surp_now:>+7.1f}%  €{base:>8.0f}  →  €{att:>7.0f}   {rec_str}")

    print("=" * 65)
    print("\nLegenda: sovrapprezzo % rispetto al prezzo MSRP/listino base")
    print("         Recovery = data stimata in cui il sovrapprezzo torna < +5%")
    print("         Previsione basata su regressione polinomiale (ultimi 24 mesi)")


def main():
    print("Hardware Price Trend Analyzer — avvio...")
    df = build_dataframe()

    # Forecast 18 mesi (fino a ~Nov 2027)
    last_date = df.index[-1]
    forecast_dates = pd.date_range(
        start=last_date + pd.DateOffset(months=1),
        periods=18, freq="MS"
    )
    forecasts = {comp: forecast_recovery(df[comp]) for comp in df.columns}

    print_summary(df, forecasts, forecast_dates)
    plot_overview(df, forecasts, forecast_dates)
    plot_comparison(df, forecasts, forecast_dates)
    print("\n[✓] Analisi completata.")


if __name__ == "__main__":
    main()
