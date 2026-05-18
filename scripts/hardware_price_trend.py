"""
Hardware Price Trend Analyzer
Analizza i trend di prezzi di RAM, SSD e Schede Video
e stima quando i prezzi potrebbero scendere.

Dipendenze: pip install pandas numpy matplotlib scikit-learn scipy requests
"""

import json
import sys
from datetime import datetime, timedelta

import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import numpy as np
import pandas as pd
from scipy.stats import linregress
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import Pipeline


# ---------------------------------------------------------------------------
# Dati storici di esempio (EUR) — sostituisci con dati reali da file CSV
# o da un'API di price tracking come CamelCamelCamel / PCPP scraper.
# ---------------------------------------------------------------------------
SAMPLE_DATA = {
    "RAM DDR5 32GB": [
        ("2024-01-01", 95),
        ("2024-02-01", 98),
        ("2024-03-01", 105),
        ("2024-04-01", 120),
        ("2024-05-01", 135),
        ("2024-06-01", 145),
        ("2024-07-01", 160),
        ("2024-08-01", 175),
        ("2024-09-01", 185),
        ("2024-10-01", 195),
        ("2024-11-01", 200),
        ("2024-12-01", 210),
        ("2025-01-01", 215),
        ("2025-02-01", 220),
        ("2025-03-01", 218),
        ("2025-04-01", 225),
        ("2025-05-01", 230),
    ],
    "SSD NVMe 1TB": [
        ("2024-01-01", 75),
        ("2024-02-01", 78),
        ("2024-03-01", 82),
        ("2024-04-01", 90),
        ("2024-05-01", 98),
        ("2024-06-01", 105),
        ("2024-07-01", 112),
        ("2024-08-01", 118),
        ("2024-09-01", 125),
        ("2024-10-01", 130),
        ("2024-11-01", 128),
        ("2024-12-01", 135),
        ("2025-01-01", 138),
        ("2025-02-01", 140),
        ("2025-03-01", 142),
        ("2025-04-01", 145),
        ("2025-05-01", 148),
    ],
    "GPU RTX 4070": [
        ("2024-01-01", 580),
        ("2024-02-01", 590),
        ("2024-03-01", 610),
        ("2024-04-01", 650),
        ("2024-05-01", 690),
        ("2024-06-01", 730),
        ("2024-07-01", 780),
        ("2024-08-01", 820),
        ("2024-09-01", 860),
        ("2024-10-01", 900),
        ("2024-11-01", 920),
        ("2024-12-01", 950),
        ("2025-01-01", 970),
        ("2025-02-01", 990),
        ("2025-03-01", 1010),
        ("2025-04-01", 1030),
        ("2025-05-01", 1050),
    ],
}


def load_data_from_csv(filepath: str) -> dict[str, pd.DataFrame]:
    """
    Carica dati da un CSV con colonne: product, date, price
    """
    df = pd.read_csv(filepath, parse_dates=["date"])
    return {name: grp[["date", "price"]].reset_index(drop=True)
            for name, grp in df.groupby("product")}


def build_dataframe(raw: dict[str, list]) -> dict[str, pd.DataFrame]:
    result = {}
    for product, entries in raw.items():
        df = pd.DataFrame(entries, columns=["date", "price"])
        df["date"] = pd.to_datetime(df["date"])
        df.sort_values("date", inplace=True)
        df.reset_index(drop=True, inplace=True)
        result[product] = df
    return result


def numeric_dates(df: pd.DataFrame) -> np.ndarray:
    """Converte date in numeri (giorni dal primo punto)."""
    origin = df["date"].min()
    return (df["date"] - origin).dt.days.values.astype(float)


def fit_trend(df: pd.DataFrame, degree: int = 2):
    """
    Adatta una regressione polinomiale ai prezzi.
    Restituisce il modello sklearn Pipeline e l'origin date.
    """
    X = numeric_dates(df).reshape(-1, 1)
    y = df["price"].values.astype(float)

    model = Pipeline([
        ("poly", PolynomialFeatures(degree=degree, include_bias=False)),
        ("reg",  LinearRegression()),
    ])
    model.fit(X, y)
    return model, df["date"].min()


def predict_price(model, origin: pd.Timestamp, target_date: pd.Timestamp) -> float:
    days = (target_date - origin).days
    return float(model.predict([[days]])[0])


def estimate_drop(model, origin: pd.Timestamp, current_price: float,
                  threshold_pct: float = 10.0,
                  horizon_days: int = 730) -> pd.Timestamp | None:
    """
    Cerca il primo giorno futuro in cui il prezzo modellato scende
    di almeno `threshold_pct`% rispetto al picco recente.
    """
    target = current_price * (1 - threshold_pct / 100)
    today = datetime.today()
    for day_offset in range(1, horizon_days + 1):
        future = today + timedelta(days=day_offset)
        p = predict_price(model, origin, pd.Timestamp(future))
        if p <= target:
            return pd.Timestamp(future)
    return None


def plot_all(data: dict[str, pd.DataFrame], degree: int = 2,
             forecast_months: int = 18, threshold_pct: float = 10.0):
    n = len(data)
    fig, axes = plt.subplots(n, 1, figsize=(14, 5 * n))
    if n == 1:
        axes = [axes]

    fig.suptitle("Analisi Trend Prezzi Hardware", fontsize=16, fontweight="bold", y=1.01)
    today = pd.Timestamp(datetime.today().date())
    forecast_end = today + pd.DateOffset(months=forecast_months)

    results = {}

    for ax, (product, df) in zip(axes, data.items()):
        model, origin = fit_trend(df, degree=degree)

        # Serie storica
        ax.scatter(df["date"], df["price"], color="#2196F3", s=40, zorder=5, label="Prezzi reali")
        ax.plot(df["date"], df["price"], color="#2196F3", alpha=0.4, linewidth=1)

        # Trend storico (fitted)
        fitted_days = np.linspace(0, numeric_dates(df)[-1], 200)
        fitted_prices = model.predict(fitted_days.reshape(-1, 1))
        fitted_dates = [origin + pd.Timedelta(days=int(d)) for d in fitted_days]
        ax.plot(fitted_dates, fitted_prices, color="#FF9800", linewidth=2, label="Trend (fitted)")

        # Proiezione futura
        future_days = np.linspace(
            numeric_dates(df)[-1],
            (forecast_end - origin).days,
            300
        )
        future_prices = model.predict(future_days.reshape(-1, 1))
        future_dates = [origin + pd.Timedelta(days=int(d)) for d in future_days]
        ax.plot(future_dates, future_prices, color="#F44336", linewidth=2,
                linestyle="--", label="Proiezione futura")

        # Linea prezzo corrente
        current_price = df["price"].iloc[-1]
        ax.axhline(current_price, color="gray", linestyle=":", linewidth=1, label=f"Prezzo attuale €{current_price:.0f}")

        # Stima calo
        drop_date = estimate_drop(model, origin, current_price, threshold_pct)
        if drop_date and drop_date <= forecast_end:
            drop_price = predict_price(model, origin, drop_date)
            ax.axvline(drop_date, color="green", linestyle="--", linewidth=1.5,
                       label=f"Calo >{threshold_pct:.0f}% stimato: {drop_date.strftime('%b %Y')}")
            ax.annotate(
                f"−{threshold_pct:.0f}%\n~€{drop_price:.0f}",
                xy=(drop_date, drop_price),
                xytext=(drop_date + pd.DateOffset(months=1), drop_price * 1.05),
                fontsize=9, color="green",
                arrowprops=dict(arrowstyle="->", color="green"),
            )
            results[product] = {"drop_date": drop_date, "estimated_price": drop_price}
        else:
            results[product] = {"drop_date": None, "estimated_price": None}

        # Linea "oggi"
        ax.axvline(today, color="#9C27B0", linestyle="-.", linewidth=1, label="Oggi")

        ax.set_title(product, fontsize=13, fontweight="bold")
        ax.set_ylabel("Prezzo (EUR)")
        ax.set_xlabel("")
        ax.xaxis.set_major_formatter(mdates.DateFormatter("%b %Y"))
        ax.xaxis.set_major_locator(mdates.MonthLocator(interval=2))
        plt.setp(ax.xaxis.get_majorticklabels(), rotation=30, ha="right")
        ax.legend(fontsize=8, loc="upper left")
        ax.grid(True, alpha=0.3)

    plt.tight_layout()
    output = "hardware_price_trends.png"
    plt.savefig(output, dpi=150, bbox_inches="tight")
    print(f"\nGrafico salvato in: {output}")
    plt.show()
    return results


def print_summary(results: dict, threshold_pct: float):
    print("\n" + "=" * 60)
    print("  RIEPILOGO STIME CALO PREZZI")
    print("=" * 60)
    for product, info in results.items():
        drop_date = info["drop_date"]
        est_price = info["estimated_price"]
        if drop_date:
            print(f"\n  {product}")
            print(f"    Calo >{threshold_pct:.0f}% stimato entro: {drop_date.strftime('%B %Y')}")
            print(f"    Prezzo stimato al calo:       ~€{est_price:.0f}")
        else:
            print(f"\n  {product}")
            print(f"    Calo >{threshold_pct:.0f}% NON previsto nell'orizzonte analizzato.")
    print("\n" + "=" * 60)
    print("  NOTA: Le stime si basano sul trend storico disponibile.")
    print("  Fattori geopolitici, scorte o nuovi prodotti possono")
    print("  alterare significativamente l'andamento reale.")
    print("=" * 60 + "\n")


def main():
    import argparse

    parser = argparse.ArgumentParser(
        description="Analisi trend prezzi hardware (RAM, SSD, GPU)"
    )
    parser.add_argument(
        "--csv", type=str, default=None,
        help="Percorso a un file CSV con colonne: product,date,price"
    )
    parser.add_argument(
        "--degree", type=int, default=2,
        help="Grado del polinomio di regressione (default: 2)"
    )
    parser.add_argument(
        "--months", type=int, default=18,
        help="Mesi di proiezione futura (default: 18)"
    )
    parser.add_argument(
        "--threshold", type=float, default=10.0,
        help="Soglia %% di calo da segnalare (default: 10)"
    )
    args = parser.parse_args()

    if args.csv:
        print(f"Caricamento dati da: {args.csv}")
        raw_data = load_data_from_csv(args.csv)
    else:
        print("Utilizzo dati di esempio integrati.")
        print("Per usare dati reali: python hardware_price_trend.py --csv tuoi_dati.csv\n")
        raw_data = build_dataframe(SAMPLE_DATA)

    results = plot_all(raw_data, degree=args.degree,
                       forecast_months=args.months,
                       threshold_pct=args.threshold)
    print_summary(results, args.threshold)


if __name__ == "__main__":
    main()
