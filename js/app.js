/* ═══════════════════════════════════════
   RCS Marine Intelligence — app.js
════════════════════════════════════════ */

// ── Credenziali ──────────────────────────
const UTENTI = {
  "nunzio":        "rcsmarke5t22%w78h-67",
  "admin":         "rcs2026!",
  "direttore":     "navale99",
  "virtu_ferries": "virtu11_%hjs",
  "tug_malta":     "tulta-rjh-/case&",
  "francesco":     "fran562_",
};

// ── Login ────────────────────────────────
function login() {
  const u   = document.getElementById("u").value.trim().toLowerCase();
  const p   = document.getElementById("p").value;
  const err = document.getElementById("err");
  const btn = document.getElementById("btn");
  const txt = document.getElementById("btnTxt");

  txt.textContent = "VERIFICA...";
  btn.style.opacity = ".7";

  setTimeout(() => {
    if (UTENTI[u] && UTENTI[u] === p) {
      sessionStorage.setItem("rcs_auth", "1");
      sessionStorage.setItem("rcs_user", u);

      const card = document.getElementById("card");
      card.style.transition = "all .35s ease";
      card.style.opacity    = "0";
      card.style.transform  = "scale(.97)";

      setTimeout(() => { window.location.href = "pages/dashboard.html"; }, 380);
    } else {
      err.classList.add("show");
      btn.style.opacity = "1";
      txt.textContent   = "ACCEDI";

      const card = document.getElementById("card");
      card.style.animation = "none";
      void card.offsetHeight;
      card.style.animation = "shake .4s ease";

      setTimeout(() => err.classList.remove("show"), 4000);
    }
  }, 550);
}

// Invio con tasto Enter
document.addEventListener("keydown", e => { if (e.key === "Enter") login(); });

// ── ACCESSO RAPIDO CON PASTE ──────────────
function handleQuickPaste(event) {
  // Permetti il paste esplicitamente
  event.preventDefault();
  const clipboard = event.clipboardData.getData('text');
  const input = document.getElementById("quickPaste");
  input.value = clipboard;
}

function parseAndLogin() {
  const quickPaste = document.getElementById("quickPaste").value.trim();
  if (!quickPaste.includes(":")) {
    alert("Formato errato! Usa: utente:password");
    return;
  }
  const [user, pass] = quickPaste.split(":", 2);
  document.getElementById("u").value = user;
  document.getElementById("p").value = pass;
  login();
}

// ── Protezione pagine interne ─────────────
// Incolla in dashboard.html e clienti.html:
// <script>if(!sessionStorage.getItem('rcs_auth'))location.href='../index.html';</script>

// ── Onde animate su canvas ───────────────
const canvas = document.getElementById("waves");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let W, H, t = 0;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = 220;
  }
  resize();
  window.addEventListener("resize", resize);

  function drawWaves() {
    ctx.clearRect(0, 0, W, H);
    t += 0.008;

    // Onda 1
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let x = 0; x <= W; x += 4) {
      const y = 90 + Math.sin(x * 0.006 + t) * 28
                   + Math.sin(x * 0.012 + t * 1.3) * 14;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
    ctx.fillStyle = "rgba(0,87,184,0.12)";
    ctx.fill();

    // Onda 2
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let x = 0; x <= W; x += 4) {
      const y = 120 + Math.sin(x * 0.008 + t * .8 + 1) * 20
                    + Math.sin(x * 0.015 + t * 1.6) * 10;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
    ctx.fillStyle = "rgba(0,212,255,0.07)";
    ctx.fill();

    // Onda 3 (superficie)
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let x = 0; x <= W; x += 4) {
      const y = 150 + Math.sin(x * 0.01 + t * .6 + 2) * 14
                    + Math.cos(x * 0.007 + t * 1.1) * 8;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
    ctx.fillStyle = "rgba(0,150,220,0.09)";
    ctx.fill();

    requestAnimationFrame(drawWaves);
  }

  drawWaves();
}
