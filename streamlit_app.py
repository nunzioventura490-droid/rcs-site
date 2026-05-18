"""
Analisi Finanziaria PC — App Streamlit
Accesso protetto da password (configurata in Streamlit Cloud Secrets).
"""

import math
import streamlit as st
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import pandas as pd

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
# Dati
# ---------------------------------------------------------------------------
CARRELLO = [
    ("AMD Ryzen 9 9900X",                            356.25, 1, "PC Hardware"),
    ("PNY RTX 5080 16GB ARGB OC",                  1345.47, 1, "PC Hardware"),
    ("ASUS TUF GAMING X870-PLUS WiFi",               269.83, 1, "PC Hardware"),
    ("Corsair Vengeance DDR5 32GB 6000MHz",          437.14, 1, "PC Hardware"),
    ("Lexar ARES PRO SSD 2TB PCIe Gen5",             269.99, 1, "PC Hardware"),
    ("NZXT C850 Gold Core PSU 850W",                 119.00, 1, "PC Hardware"),
    ("Thermalright TR A70 Vision Case",              137.66, 1, "PC Hardware"),
    ("Thermalright Frozen Notte 360 AIO",             60.70, 1, "PC Hardware"),
    ("Thermalright TL-M12R-S Fan 120mm",              10.90, 3, "PC Hardware"),
    ("Thermalright TL-M12R-S Fan 120mm",               9.90, 2, "PC Hardware"),
    ("Thermalright ARGB HUB x8",                      12.90, 1, "PC Hardware"),
    ('ASUS TUF VG34VQL3A Monitor 34" 180Hz',         289.00, 1, "Periferiche"),
    ("Logitech G305 Mouse Gaming Wireless",            35.99, 1, "Periferiche"),
    ("Logitech G213 Prodigy Tastiera IT",              43.49, 1, "Periferiche"),
    ("Sony WH-CH720N Cuffie Noise Cancelling",         69.99, 1, "Periferiche"),
    ("UGREEN Cavo DisplayPort 2.1 2m",                 11.89, 1, "Periferiche"),
    ("Amazon Basics Altoparlanti 2.0",                 15.30, 1, "Periferiche"),
    ("EFISH Mouse Pad XXL 800x300mm",                  14.99, 1, "Periferiche"),
    ("VASAGLE Scrivania Reg. Altezza 160x80cm",       139.99, 1, "Postazione"),
    ("Baroni Home Sedia Gaming Ergonomica",             82.99, 1, "Postazione"),
    ("iFalarila Lampada LED 160 con morsetto",          23.74, 1, "Postazione"),
]

IVA_RATE  = 0.22
IRES_RATE = 0.24
CAT_COLORS = {
    "PC Hardware": "#4e79a7",
    "Periferiche": "#e15759",
    "Postazione":  "#59a14f",
}

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
    anni, m = mesi // 12, mesi % 12
    if anni == 0: return f"{mesi} mesi"
    if m == 0:    return f"{anni} ann{'o' if anni==1 else 'i'}"
    return f"{anni} ann{'o' if anni==1 else 'i'} e {m} mes{'e' if m==1 else 'i'}"

# ---------------------------------------------------------------------------
# Header
# ---------------------------------------------------------------------------
st.title("💻 Analisi Finanziaria Acquisto PC")
st.caption("Prospetto completo per la SRL — IVA · IRES · Piano rimborso")
st.markdown("---")

with st.sidebar:
    st.header("⚙️ Parametri")
    rata = st.number_input("Rata mensile (€)", min_value=10, max_value=1000, value=100, step=10)
    st.markdown("---")
    st.metric("Totale carrello", "€ 3.788,81")
    st.metric("Articoli totali", "24")
    st.metric("Categorie", "3")
    st.markdown("---")
    st.caption("Modifica la rata per aggiornare tutti i calcoli in tempo reale.")

righe, lordo, imponibile, iva_tot, ires_save, benef_tot, netto = calcola(rata)

# Metriche top
c1, c2, c3, c4 = st.columns(4)
c1.metric("Prezzo lordo",          f"€ {lordo:,.2f}")
c2.metric("IVA 22% detraibile",    f"€ {iva_tot:,.2f}",   delta=f"-{iva_tot:,.2f}")
c3.metric("Risparmio IRES 24%",    f"€ {ires_save:,.2f}", delta=f"-{ires_save:,.2f}")
c4.metric("Costo reale netto SRL", f"€ {netto:,.2f}",
          delta=f"-{benef_tot:,.2f} ({benef_tot/lordo*100:.1f}%)")
st.markdown("---")

# ---------------------------------------------------------------------------
# TAB
# ---------------------------------------------------------------------------
tab1, tab2, tab3, tab4 = st.tabs([
    "📦 Carrello & Spesa",
    "💰 Analisi Fiscale",
    "📅 Piano Rimborso",
    "📊 Tutti i Grafici",
])

# ════════════════════════════════════════════════════════════════════════════
# TAB 1 — Carrello
# ════════════════════════════════════════════════════════════════════════════
with tab1:

    # — Riga 1: Donut + Treemap —
    col1, col2 = st.columns(2)

    with col1:
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
        fig_donut.update_layout(title="Spesa per categoria (donut)", height=360,
                                margin=dict(t=40,b=0,l=0,r=0))
        fig_donut.add_annotation(text=f"<b>€ {lordo:,.0f}</b>",
                                  x=0.5, y=0.5, showarrow=False, font_size=15)
        st.plotly_chart(fig_donut, use_container_width=True)

    with col2:
        df_tree = pd.DataFrame([{
            "Categoria": r["cat"],
            "Articolo":  r["desc"][:35],
            "Totale":    r["totale"],
        } for r in righe])
        fig_tree = px.treemap(df_tree, path=["Categoria", "Articolo"],
                              values="Totale",
                              color="Categoria",
                              color_discrete_map=CAT_COLORS,
                              title="Treemap spesa (clicca per espandere)")
        fig_tree.update_traces(
            texttemplate="<b>%{label}</b><br>€ %{value:,.0f}",
            hovertemplate="<b>%{label}</b><br>€ %{value:,.2f}<extra></extra>",
        )
        fig_tree.update_layout(height=360, margin=dict(t=40,b=0,l=0,r=0))
        st.plotly_chart(fig_tree, use_container_width=True)

    # — Riga 2: Barre orizzontali —
    df_bar = pd.DataFrame([{
        "Articolo":  (r["desc"][:42] + "…" if len(r["desc"])>42 else r["desc"])
                      + (f" ×{r['qty']}" if r["qty"]>1 else ""),
        "Totale":    r["totale"],
        "Categoria": r["cat"],
    } for r in sorted(righe, key=lambda x: x["totale"])])

    fig_bar = px.bar(df_bar, x="Totale", y="Articolo", orientation="h",
                     color="Categoria", color_discrete_map=CAT_COLORS,
                     text=df_bar["Totale"].apply(lambda v: f"€ {v:,.2f}"),
                     title="Dettaglio articoli — prezzo totale (IVA inclusa)",
                     height=540)
    fig_bar.update_traces(textposition="outside")
    fig_bar.update_layout(xaxis_title="€", yaxis_title="",
                          margin=dict(t=50,b=20,l=0,r=80))
    st.plotly_chart(fig_bar, use_container_width=True)

    # — Riga 3: Stacked bar IVA vs Imponibile per articolo —
    df_stk = pd.DataFrame([{
        "Articolo":   r["desc"][:38] + ("…" if len(r["desc"])>38 else ""),
        "Imponibile": r["imponibile"],
        "IVA 22%":    r["iva"],
    } for r in sorted(righe, key=lambda x: x["totale"])])

    fig_stk = go.Figure()
    fig_stk.add_trace(go.Bar(
        name="Imponibile", y=df_stk["Articolo"], x=df_stk["Imponibile"],
        orientation="h", marker_color="#4e79a7",
        hovertemplate="%{y}<br>Imponibile: € %{x:,.2f}<extra></extra>",
    ))
    fig_stk.add_trace(go.Bar(
        name="IVA 22%", y=df_stk["Articolo"], x=df_stk["IVA 22%"],
        orientation="h", marker_color="#f28e2b",
        hovertemplate="%{y}<br>IVA: € %{x:,.2f}<extra></extra>",
    ))
    fig_stk.update_layout(
        barmode="stack", title="Composizione prezzo: Imponibile + IVA per articolo",
        xaxis_title="€", yaxis_title="", height=540,
        legend=dict(orientation="h", y=1.02),
        margin=dict(t=60,b=20,l=0,r=20),
    )
    st.plotly_chart(fig_stk, use_container_width=True)

    with st.expander("📋 Tabella completa carrello"):
        df_tab = pd.DataFrame([{
            "Categoria": r["cat"], "Articolo": r["desc"],
            "Qty": r["qty"], "Prezzo unit.": f"€ {r['prezzo']:,.2f}",
            "Totale IVA incl.": f"€ {r['totale']:,.2f}",
            "Imponibile": f"€ {r['imponibile']:,.2f}", "IVA": f"€ {r['iva']:,.2f}",
        } for r in righe])
        st.dataframe(df_tab, use_container_width=True, hide_index=True)

# ════════════════════════════════════════════════════════════════════════════
# TAB 2 — Analisi Fiscale
# ════════════════════════════════════════════════════════════════════════════
with tab2:

    # — Riga 1: Waterfall + Gauge —
    col1, col2 = st.columns([1.4, 1])

    with col1:
        fig_wf = go.Figure(go.Waterfall(
            measure=["absolute","relative","relative","total"],
            x=["Prezzo lordo\n(IVA incl.)", "(-) IVA 22%\ndetraibile",
               "(-) Risparmio\nIRES 24%", "Costo reale\nnetto SRL"],
            y=[lordo, -iva_tot, -ires_save, 0],
            text=[f"€ {lordo:,.2f}", f"− € {iva_tot:,.2f}",
                  f"− € {ires_save:,.2f}", f"€ {netto:,.2f}"],
            textposition="outside",
            connector={"line": {"color": "#555"}},
            increasing={"marker": {"color": "#4e79a7"}},
            decreasing={"marker": {"color": "#59a14f"}},
            totals={"marker": {"color": "#2d6a4f"}},
        ))
        fig_wf.update_layout(title="Cascata benefici fiscali", yaxis_title="€",
                              height=400, showlegend=False, margin=dict(t=50,b=20))
        st.plotly_chart(fig_wf, use_container_width=True)

    with col2:
        perc = round(benef_tot / lordo * 100, 1)
        fig_gauge = go.Figure(go.Indicator(
            mode="gauge+number+delta",
            value=perc,
            title={"text": "Risparmio fiscale totale<br><span style='font-size:13px'>% sul prezzo lordo</span>"},
            delta={"reference": 0, "valueformat": ".1f"},
            number={"suffix": "%", "valueformat": ".1f"},
            gauge={
                "axis": {"range": [0, 50]},
                "bar":  {"color": "#59a14f"},
                "steps": [
                    {"range": [0, 15],  "color": "#ffd6d6"},
                    {"range": [15, 30], "color": "#fff3cd"},
                    {"range": [30, 50], "color": "#d4edda"},
                ],
                "threshold": {"line": {"color": "#2d6a4f", "width": 3}, "value": perc},
            }
        ))
        fig_gauge.update_layout(height=400, margin=dict(t=60,b=20,l=30,r=30))
        st.plotly_chart(fig_gauge, use_container_width=True)

    # — Riga 2: IVA risparmiata per categoria + bar confronto 3 prezzi —
    col3, col4 = st.columns(2)

    with col3:
        cat_iva = {}
        cat_ires = {}
        for r in righe:
            cat_iva[r["cat"]]  = cat_iva.get(r["cat"], 0)  + r["iva"]
            cat_ires[r["cat"]] = cat_ires.get(r["cat"], 0) + round(r["imponibile"] * IRES_RATE, 2)

        cats = list(cat_iva.keys())
        fig_ben = go.Figure()
        fig_ben.add_trace(go.Bar(name="IVA detraibile", x=cats,
                                  y=[cat_iva[c] for c in cats],
                                  marker_color="#f28e2b",
                                  text=[f"€ {cat_iva[c]:,.0f}" for c in cats],
                                  textposition="outside"))
        fig_ben.add_trace(go.Bar(name="Risparmio IRES", x=cats,
                                  y=[cat_ires[c] for c in cats],
                                  marker_color="#59a14f",
                                  text=[f"€ {cat_ires[c]:,.0f}" for c in cats],
                                  textposition="outside"))
        fig_ben.update_layout(title="Benefici fiscali per categoria",
                               barmode="group", yaxis_title="€",
                               height=360, margin=dict(t=50,b=20))
        st.plotly_chart(fig_ben, use_container_width=True)

    with col4:
        fig_conf = go.Figure(go.Bar(
            x=["Prezzo lordo\nAmazon", "Netto IVA\n(costo SRL)", "Netto fiscale\n(IRES+IVA)"],
            y=[lordo, imponibile, netto],
            marker_color=["#e15759", "#f28e2b", "#59a14f"],
            text=[f"€ {lordo:,.2f}", f"€ {imponibile:,.2f}", f"€ {netto:,.2f}"],
            textposition="outside",
        ))
        fig_conf.update_layout(title="Confronto: lordo / netto IVA / netto fiscale",
                                yaxis_title="€", height=360,
                                yaxis_range=[0, lordo * 1.15],
                                margin=dict(t=50,b=20), showlegend=False)
        st.plotly_chart(fig_conf, use_container_width=True)

    # — Riga 3: IVA per singolo articolo —
    df_iva = pd.DataFrame([{
        "Articolo":  r["desc"][:40],
        "IVA (€)":  r["iva"],
        "Categoria": r["cat"],
    } for r in sorted(righe, key=lambda x: x["iva"], reverse=True)])

    fig_iva = px.bar(df_iva, x="Articolo", y="IVA (€)", color="Categoria",
                     color_discrete_map=CAT_COLORS,
                     text=df_iva["IVA (€)"].apply(lambda v: f"€ {v:,.2f}"),
                     title="IVA 22% detraibile per singolo articolo",
                     height=380)
    fig_iva.update_traces(textposition="outside")
    fig_iva.update_layout(xaxis_tickangle=-35, margin=dict(t=50,b=80))
    st.plotly_chart(fig_iva, use_container_width=True)

    st.info(f"""
**Riepilogo fiscale:**
- Prezzo lordo Amazon: **€ {lordo:,.2f}**
- IVA 22% detraibile: **− € {iva_tot:,.2f}**
- Risparmio IRES 24% sull'imponibile € {imponibile:,.2f}: **− € {ires_save:,.2f}**
- **Beneficio fiscale totale: − € {benef_tot:,.2f} ({perc}%)**
- **Costo reale netto per la SRL: € {netto:,.2f}**
    """)
    st.warning("Per prestiti SRL→dipendente si applica il tasso legale vigente (~2.5%/anno) come fringe benefit in busta paga.")

# ════════════════════════════════════════════════════════════════════════════
# TAB 3 — Piano Rimborso
# ════════════════════════════════════════════════════════════════════════════
with tab3:
    scenari = [
        ("Rimborso lordo (IVA inclusa)",         lordo,      "#e15759"),
        ("Rimborso netto IVA",                   imponibile, "#f28e2b"),
        ("Rimborso netto fiscale (IRES + IVA)",  netto,      "#59a14f"),
    ]

    # Metriche
    cols = st.columns(3)
    for col, (nome, totale, color) in zip(cols, scenari):
        nm = math.ceil(totale / rata)
        col.metric(nome, mesi_str(nm), f"€ {totale:,.2f} · {rata:.0f}€/mese")

    st.markdown("---")

    # — Riga 1: Debito residuo + Barre durata —
    col1, col2 = st.columns([1.6, 1])

    with col1:
        fig_line = go.Figure()
        for nome, totale, color in scenari:
            nm     = math.ceil(totale / rata)
            mesi   = list(range(0, nm + 1))
            debito = [max(totale - m * rata, 0) for m in mesi]
            fig_line.add_trace(go.Scatter(
                x=mesi, y=debito, mode="lines+markers", name=nome,
                line=dict(color=color, width=2), marker=dict(size=3),
                hovertemplate="Mese %{x}<br>Residuo: € %{y:,.2f}<extra></extra>",
            ))
        fig_line.update_layout(
            title=f"Debito residuo — rata € {rata:.0f}/mese",
            xaxis_title="Mese", yaxis_title="Debito residuo (€)",
            height=380, hovermode="x unified",
            legend=dict(orientation="h", y=-0.25),
        )
        st.plotly_chart(fig_line, use_container_width=True)

    with col2:
        nm_list = [math.ceil(t / rata) for _, t, _ in scenari]
        fig_dur = go.Figure(go.Bar(
            x=[s[0].split("(")[0].strip() for s in scenari],
            y=nm_list,
            marker_color=[s[2] for s in scenari],
            text=[f"{mesi_str(nm)}<br>€ {t:,.0f}" for nm, (_, t, _) in zip(nm_list, scenari)],
            textposition="outside",
        ))
        fig_dur.update_layout(
            title="Durata per scenario",
            yaxis_title="Mesi", height=380,
            yaxis_range=[0, max(nm_list) * 1.2],
            margin=dict(t=50,b=20), showlegend=False,
        )
        st.plotly_chart(fig_dur, use_container_width=True)

    # — Riga 2: Versato cumulato nel tempo —
    fig_cum = go.Figure()
    for nome, totale, color in scenari:
        nm       = math.ceil(totale / rata)
        mesi     = list(range(0, nm + 1))
        versato  = [min(m * rata, totale) for m in mesi]
        fig_cum.add_trace(go.Scatter(
            x=mesi, y=versato, mode="lines", name=nome,
            line=dict(color=color, width=2, dash="dot"),
            hovertemplate="Mese %{x}<br>Versato: € %{y:,.2f}<extra></extra>",
            fill="tozeroy", fillcolor=color.replace("#", "rgba(") + ",0.07)",
        ))
    fig_cum.update_layout(
        title="Importo cumulato versato nel tempo",
        xaxis_title="Mese", yaxis_title="Versato (€)",
        height=350, hovermode="x unified",
        legend=dict(orientation="h", y=-0.25),
    )
    st.plotly_chart(fig_cum, use_container_width=True)

    # — Riga 3: Indicator rimborso %  —
    sc_sel = st.selectbox("Seleziona scenario per il dettaglio:", [s[0] for s in scenari])
    totale_sel = next(t for n, t, _ in scenari if n == sc_sel)
    color_sel  = next(c for n, _, c in scenari if n == sc_sel)
    nm_sel     = math.ceil(totale_sel / rata)

    col3, col4 = st.columns([1, 2])
    with col3:
        fig_ind = go.Figure(go.Indicator(
            mode="gauge+number",
            value=0,
            title={"text": "Progresso rimborso"},
            number={"suffix": "%", "valueformat": ".0f"},
            gauge={
                "axis": {"range": [0, 100]},
                "bar":  {"color": color_sel},
                "steps": [{"range": [0, 100], "color": "#1a1f2e"}],
            }
        ))
        fig_ind.update_layout(height=280, margin=dict(t=60,b=20,l=30,r=30))
        st.plotly_chart(fig_ind, use_container_width=True)
        st.caption("Il gauge si aggiornerà man mano che vengono registrati i pagamenti.")

    with col4:
        rows = [{"Mese": m,
                 "Rata (€)": f"{min(rata, totale_sel - (m-1)*rata):,.2f}",
                 "Versato tot. (€)": f"{min(m*rata, totale_sel):,.2f}",
                 "Residuo (€)": f"{max(totale_sel - m*rata, 0):,.2f}"}
                for m in range(1, nm_sel + 1)]
        st.dataframe(pd.DataFrame(rows), use_container_width=True,
                     hide_index=True, height=280)

# ════════════════════════════════════════════════════════════════════════════
# TAB 4 — Tutti i grafici a colpo d'occhio
# ════════════════════════════════════════════════════════════════════════════
with tab4:
    st.subheader("Panoramica completa")

    # Mini-griglia 2x3
    r1c1, r1c2 = st.columns(2)

    with r1c1:
        # Spesa per categoria - pie semplice
        cat_tot = {}
        for r in righe:
            cat_tot[r["cat"]] = cat_tot.get(r["cat"], 0) + r["totale"]
        fig_p = px.pie(values=list(cat_tot.values()), names=list(cat_tot.keys()),
                       color=list(cat_tot.keys()), color_discrete_map=CAT_COLORS,
                       title="Spesa per categoria", height=300)
        fig_p.update_layout(margin=dict(t=40,b=0,l=0,r=0))
        st.plotly_chart(fig_p, use_container_width=True)

    with r1c2:
        # Top 5 articoli più costosi
        top5 = sorted(righe, key=lambda x: x["totale"], reverse=True)[:5]
        fig_t5 = px.bar(
            x=[r["totale"] for r in top5],
            y=[r["desc"][:30] for r in top5],
            orientation="h", title="Top 5 articoli per costo",
            color=[r["cat"] for r in top5], color_discrete_map=CAT_COLORS,
            text=[f"€ {r['totale']:,.0f}" for r in top5], height=300,
        )
        fig_t5.update_traces(textposition="outside")
        fig_t5.update_layout(showlegend=False, xaxis_title="€", yaxis_title="",
                              margin=dict(t=40,b=20,l=0,r=60))
        st.plotly_chart(fig_t5, use_container_width=True)

    r2c1, r2c2 = st.columns(2)

    with r2c1:
        fig_wf2 = go.Figure(go.Waterfall(
            measure=["absolute","relative","relative","total"],
            x=["Lordo", "−IVA", "−IRES", "Netto"],
            y=[lordo, -iva_tot, -ires_save, 0],
            text=[f"€{lordo:,.0f}", f"−€{iva_tot:,.0f}",
                  f"−€{ires_save:,.0f}", f"€{netto:,.0f}"],
            textposition="outside",
            connector={"line": {"color": "#555"}},
            increasing={"marker": {"color": "#4e79a7"}},
            decreasing={"marker": {"color": "#59a14f"}},
            totals={"marker": {"color": "#2d6a4f"}},
        ))
        fig_wf2.update_layout(title="Benefici fiscali (waterfall)",
                               height=300, showlegend=False, margin=dict(t=40,b=20))
        st.plotly_chart(fig_wf2, use_container_width=True)

    with r2c2:
        # Tutti e 3 i scenari rimborso sovrapposti
        fig_sc = go.Figure()
        for nome, totale, color in scenari:
            nm   = math.ceil(totale / rata)
            mesi = list(range(0, nm + 1))
            deb  = [max(totale - m * rata, 0) for m in mesi]
            fig_sc.add_trace(go.Scatter(x=mesi, y=deb, mode="lines",
                                         name=nome.split("(")[0].strip(),
                                         line=dict(color=color, width=2)))
        fig_sc.update_layout(title=f"Rimborso {rata:.0f}€/mese — 3 scenari",
                              xaxis_title="Mese", yaxis_title="€",
                              height=300, legend=dict(orientation="h", y=-0.3),
                              margin=dict(t=40,b=60))
        st.plotly_chart(fig_sc, use_container_width=True)

    r3c1, r3c2 = st.columns(2)

    with r3c1:
        fig_tree2 = px.treemap(
            pd.DataFrame([{"Cat": r["cat"], "Art": r["desc"][:28], "€": r["totale"]} for r in righe]),
            path=["Cat","Art"], values="€", color="Cat",
            color_discrete_map=CAT_COLORS, title="Treemap spesa", height=300,
        )
        fig_tree2.update_layout(margin=dict(t=40,b=0,l=0,r=0))
        st.plotly_chart(fig_tree2, use_container_width=True)

    with r3c2:
        perc2 = round(benef_tot / lordo * 100, 1)
        fig_g2 = go.Figure(go.Indicator(
            mode="gauge+number", value=perc2,
            title={"text": "Risparmio fiscale totale"},
            number={"suffix": "%"},
            gauge={"axis": {"range": [0, 50]}, "bar": {"color": "#59a14f"},
                   "steps": [{"range": [0,15],"color":"#ffd6d6"},
                              {"range": [15,30],"color":"#fff3cd"},
                              {"range": [30,50],"color":"#d4edda"}]},
        ))
        fig_g2.update_layout(height=300, margin=dict(t=60,b=20,l=30,r=30))
        st.plotly_chart(fig_g2, use_container_width=True)
