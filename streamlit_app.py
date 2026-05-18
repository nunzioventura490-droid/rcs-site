"""
Analisi Finanziaria PC — App Streamlit
Accesso protetto da password (configurata in Streamlit Cloud Secrets).
"""

import math
import streamlit as st
import plotly.graph_objects as go
import plotly.express as px
import pandas as pd

# ---------------------------------------------------------------------------
# Configurazione pagina
# ---------------------------------------------------------------------------
st.set_page_config(
    page_title="Analisi PC — RCS",
    page_icon="💻",
    layout="wide",
)

# ---------------------------------------------------------------------------
# Password protection
# ---------------------------------------------------------------------------
def check_password():
    if "autenticato" not in st.session_state:
        st.session_state.autenticato = False

    if st.session_state.autenticato:
        return True

    st.title("💻 Analisi Finanziaria PC")
    st.markdown("---")
    col1, col2, col3 = st.columns([1, 1, 1])
    with col2:
        st.subheader("Accesso riservato")
        pwd = st.text_input("Password", type="password", placeholder="Inserisci la password")
        if st.button("Accedi", use_container_width=True):
            if pwd == st.secrets["PASSWORD"]:
                st.session_state.autenticato = True
                st.rerun()
            else:
                st.error("Password errata.")
    return False

if not check_password():
    st.stop()

# ---------------------------------------------------------------------------
# Dati carrello
# ---------------------------------------------------------------------------
CARRELLO = [
    ("AMD Ryzen 9 9900X",                              356.25,  1, "PC Hardware"),
    ("PNY RTX 5080 16GB ARGB OC",                    1345.47,  1, "PC Hardware"),
    ("ASUS TUF GAMING X870-PLUS WiFi",                269.83,  1, "PC Hardware"),
    ("Corsair Vengeance DDR5 32GB 6000MHz",           437.14,  1, "PC Hardware"),
    ("Lexar ARES PRO SSD 2TB PCIe Gen5",              269.99,  1, "PC Hardware"),
    ("NZXT C850 Gold Core PSU 850W",                  119.00,  1, "PC Hardware"),
    ("Thermalright TR A70 Vision Case",               137.66,  1, "PC Hardware"),
    ("Thermalright Frozen Notte 360 AIO",              60.70,  1, "PC Hardware"),
    ("Thermalright TL-M12R-S Fan 120mm x3",            10.90,  3, "PC Hardware"),
    ("Thermalright TL-M12R-S Fan 120mm x2",             9.90,  2, "PC Hardware"),
    ("Thermalright ARGB HUB x8",                       12.90,  1, "PC Hardware"),
    ('ASUS TUF VG34VQL3A Monitor 34" 180Hz',          289.00,  1, "Periferiche"),
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

IVA_RATE  = 0.22
IRES_RATE = 0.24
CAT_COLORS = {
    "PC Hardware": "#4e79a7",
    "Periferiche": "#e15759",
    "Postazione":  "#59a14f",
}

# ---------------------------------------------------------------------------
# Calcoli
# ---------------------------------------------------------------------------
@st.cache_data
def calcola(rata):
    righe = []
    for desc, prezzo, qty, cat in CARRELLO:
        totale     = round(prezzo * qty, 2)
        imponibile = round(totale / (1 + IVA_RATE), 2)
        righe.append({"desc": desc, "prezzo": prezzo, "qty": qty,
                       "totale": totale, "imponibile": imponibile,
                       "iva": round(totale - imponibile, 2), "cat": cat})

    lordo      = round(sum(r["totale"]     for r in righe), 2)
    imponibile = round(sum(r["imponibile"] for r in righe), 2)
    iva_tot    = round(lordo - imponibile, 2)
    ires_save  = round(imponibile * IRES_RATE, 2)
    benef_tot  = round(iva_tot + ires_save, 2)
    netto      = round(lordo - benef_tot, 2)
    return righe, lordo, imponibile, iva_tot, ires_save, benef_tot, netto

def mesi_str(mesi):
    anni = mesi // 12
    m    = mesi % 12
    if anni == 0: return f"{mesi} mesi"
    if m == 0:    return f"{anni} ann{'o' if anni==1 else 'i'}"
    return f"{anni} ann{'o' if anni==1 else 'i'} e {m} mes{'e' if m==1 else 'i'}"

# ---------------------------------------------------------------------------
# UI
# ---------------------------------------------------------------------------
st.title("💻 Analisi Finanziaria Acquisto PC")
st.caption("Prospetto per la SRL — IVA, IRES, piano rimborso")
st.markdown("---")

# Sidebar — rata configurabile
with st.sidebar:
    st.header("Parametri")
    rata = st.number_input("Rata mensile (€)", min_value=10, max_value=500,
                           value=100, step=10)
    st.caption("Modifica la rata per aggiornare tutti i calcoli in tempo reale.")
    st.markdown("---")
    st.metric("Totale carrello", f"€ {3788.81:,.2f}")
    st.metric("Articoli", "24")

righe, lordo, imponibile, iva_tot, ires_save, benef_tot, netto = calcola(rata)

# ── Metriche in testa ────────────────────────────────────────────────────────
c1, c2, c3, c4 = st.columns(4)
c1.metric("Prezzo lordo Amazon",    f"€ {lordo:,.2f}")
c2.metric("IVA 22% detraibile",    f"€ {iva_tot:,.2f}",    delta=f"-{iva_tot:,.2f}")
c3.metric("Risparmio IRES 24%",    f"€ {ires_save:,.2f}",  delta=f"-{ires_save:,.2f}")
c4.metric("Costo reale netto SRL", f"€ {netto:,.2f}",
          delta=f"-{benef_tot:,.2f} ({benef_tot/lordo*100:.1f}%)")

st.markdown("---")

# ── Tab layout ────────────────────────────────────────────────────────────────
tab1, tab2, tab3 = st.tabs(["📦 Carrello", "💰 Analisi Fiscale", "📅 Piano Rimborso"])

# ── TAB 1: Carrello ──────────────────────────────────────────────────────────
with tab1:
    col_a, col_b = st.columns([1, 1.4])

    with col_a:
        # Donut per categoria
        cat_tot = {}
        for r in righe:
            cat_tot[r["cat"]] = cat_tot.get(r["cat"], 0) + r["totale"]

        fig_donut = go.Figure(go.Pie(
            labels=list(cat_tot.keys()),
            values=list(cat_tot.values()),
            hole=0.55,
            marker_colors=[CAT_COLORS[c] for c in cat_tot],
            textinfo="label+percent",
            hovertemplate="<b>%{label}</b><br>€ %{value:,.2f}<extra></extra>",
        ))
        fig_donut.update_layout(
            title="Spesa per categoria",
            showlegend=False,
            height=380,
            margin=dict(t=40, b=0, l=0, r=0),
        )
        fig_donut.add_annotation(text=f"<b>€ {lordo:,.0f}</b>",
                                  x=0.5, y=0.5, showarrow=False, font_size=16)
        st.plotly_chart(fig_donut, use_container_width=True)

    with col_b:
        # Barre orizzontali
        df_bar = pd.DataFrame([{
            "Articolo": (r["desc"][:40] + "…" if len(r["desc"]) > 40 else r["desc"])
                         + (f" x{r['qty']}" if r["qty"] > 1 else ""),
            "Totale": r["totale"],
            "Categoria": r["cat"],
        } for r in sorted(righe, key=lambda x: x["totale"])])

        fig_bar = px.bar(df_bar, x="Totale", y="Articolo", orientation="h",
                         color="Categoria", color_discrete_map=CAT_COLORS,
                         text=df_bar["Totale"].apply(lambda v: f"€ {v:,.2f}"),
                         height=500)
        fig_bar.update_traces(textposition="outside")
        fig_bar.update_layout(title="Dettaglio articoli",
                              xaxis_title="€ (IVA inclusa)",
                              yaxis_title="", showlegend=True,
                              margin=dict(t=40, b=0, l=0, r=80))
        st.plotly_chart(fig_bar, use_container_width=True)

    # Tabella dettaglio
    with st.expander("Vedi tabella completa"):
        df_tab = pd.DataFrame([{
            "Categoria": r["cat"],
            "Articolo":  r["desc"],
            "Qty":       r["qty"],
            "Prezzo unit.": f"€ {r['prezzo']:,.2f}",
            "Totale IVA incl.": f"€ {r['totale']:,.2f}",
            "Imponibile": f"€ {r['imponibile']:,.2f}",
            "IVA": f"€ {r['iva']:,.2f}",
        } for r in righe])
        st.dataframe(df_tab, use_container_width=True, hide_index=True)

# ── TAB 2: Analisi Fiscale ────────────────────────────────────────────────────
with tab2:
    col_x, col_y = st.columns([1.2, 1])

    with col_x:
        # Waterfall
        fig_wf = go.Figure(go.Waterfall(
            name="",
            orientation="v",
            measure=["absolute", "relative", "relative", "total"],
            x=["Prezzo lordo\n(IVA incl.)",
               "(-) IVA 22%\ndetraibile",
               "(-) Risparmio\nIRES 24%",
               "Costo reale\nnetto SRL"],
            y=[lordo, -iva_tot, -ires_save, 0],
            text=[f"€ {lordo:,.2f}", f"- € {iva_tot:,.2f}",
                  f"- € {ires_save:,.2f}", f"€ {netto:,.2f}"],
            textposition="outside",
            connector={"line": {"color": "rgb(63,63,63)"}},
            increasing={"marker": {"color": "#4e79a7"}},
            decreasing={"marker": {"color": "#59a14f"}},
            totals={"marker": {"color": "#2d6a4f"}},
        ))
        fig_wf.update_layout(
            title="Benefici fiscali per la SRL",
            yaxis_title="€",
            height=420,
            showlegend=False,
            margin=dict(t=50, b=20),
        )
        st.plotly_chart(fig_wf, use_container_width=True)

    with col_y:
        st.subheader("Riepilogo fiscale")
        st.markdown(f"""
| Voce | Importo |
|---|---|
| Prezzo lordo Amazon | **€ {lordo:,.2f}** |
| Imponibile (IVA esclusa) | € {imponibile:,.2f} |
| IVA 22% detraibile | − € {iva_tot:,.2f} |
| Risparmio IRES 24% | − € {ires_save:,.2f} |
| **Beneficio fiscale totale** | **− € {benef_tot:,.2f}** |
| **Costo reale netto SRL** | **€ {netto:,.2f}** |
        """)
        st.info(f"La SRL recupera il **{benef_tot/lordo*100:.1f}%** del costo "
                f"grazie a IVA e IRES.")
        st.warning("**Nota legale:** per prestiti SRL→dipendente si applica "
                   "il tasso d'interesse legale vigente (~2.5%/anno) come "
                   "fringe benefit in busta paga.")

# ── TAB 3: Piano Rimborso ─────────────────────────────────────────────────────
with tab3:
    scenari = [
        ("Rimborso lordo (IVA inclusa)",        lordo,      "#e15759"),
        ("Rimborso netto IVA",                  imponibile, "#f28e2b"),
        ("Rimborso netto fiscale (IRES + IVA)", netto,      "#59a14f"),
    ]

    # Metriche scenari
    cols = st.columns(3)
    for col, (nome, totale, color) in zip(cols, scenari):
        nm = math.ceil(totale / rata)
        col.metric(nome, mesi_str(nm), f"€ {totale:,.2f} — {rata:.0f}€/mese")

    st.markdown("---")

    # Grafico debito nel tempo
    fig_line = go.Figure()
    for nome, totale, color in scenari:
        nm     = math.ceil(totale / rata)
        mesi   = list(range(0, nm + 1))
        debito = [max(totale - m * rata, 0) for m in mesi]
        fig_line.add_trace(go.Scatter(
            x=mesi, y=debito, mode="lines+markers",
            name=nome, line=dict(color=color, width=2),
            marker=dict(size=4),
            hovertemplate="Mese %{x}<br>Debito residuo: € %{y:,.2f}<extra></extra>",
        ))

    fig_line.update_layout(
        title=f"Debito residuo nel tempo — rata € {rata:.0f}/mese",
        xaxis_title="Mese",
        yaxis_title="Debito residuo (€)",
        height=420,
        legend=dict(orientation="h", y=-0.2),
        hovermode="x unified",
    )
    st.plotly_chart(fig_line, use_container_width=True)

    # Tabella mese per mese (scenario selezionabile)
    sc_sel = st.selectbox("Dettaglio mese per mese:", [s[0] for s in scenari])
    totale_sel = next(t for n, t, _ in scenari if n == sc_sel)
    nm_sel = math.ceil(totale_sel / rata)
    rows = []
    for m in range(1, nm_sel + 1):
        versato  = min(m * rata, totale_sel)
        residuo  = max(totale_sel - m * rata, 0)
        rows.append({"Mese": m, "Versato (€)": f"{versato:,.2f}",
                     "Residuo (€)": f"{residuo:,.2f}"})
    st.dataframe(pd.DataFrame(rows), use_container_width=True,
                 hide_index=True, height=280)
