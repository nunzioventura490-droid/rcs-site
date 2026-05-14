/* ═══════════════════════════════════════
   RCS Marine Intelligence — app.js
════════════════════════════════════════ */

// ── Card appear (JS-driven transition, più affidabile di CSS animation su Safari) ──
(function () {
  var card = document.getElementById('card');
  if (!card) return;
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      card.classList.add('appeared');
    });
  });
}());

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
