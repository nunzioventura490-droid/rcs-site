// Navbar scroll
const navC = document.getElementById("nav-c");
window.addEventListener("scroll", () => {
  navC.classList.toggle("scrolled", window.scrollY > 40);
});

// Canvas waves
const canvas = document.getElementById("cWaves");
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

// Reveal on scroll
function checkReveal() {
  const trigger = window.innerHeight - 60;
  document.querySelectorAll(".c-serv-card, .c-brand-card, .c-flotta-item").forEach((el, i) => {
    if (el.getBoundingClientRect().top < trigger) {
      setTimeout(() => el.classList.add("visible"), i * 70);
    }
  });
}
window.addEventListener("scroll", checkReveal);
checkReveal();

// Form
function inviaRichiesta(e) {
  e.preventDefault();
  const btn = document.getElementById("cf-btn-txt");
  btn.textContent = "INVIO...";
  setTimeout(() => {
    btn.textContent = "INVIA RICHIESTA";
    document.getElementById("cf-ok").classList.add("show");
    document.querySelector(".c-form").reset();
  }, 800);
}