/* ═══════════════════════════════════════════════════════════════
   singularity.js — Canvas-based B&W gravitational singularity
   Renders: event horizon · photon ring · lensing arcs · filaments
═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const canvas = document.getElementById('singularityCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let w, h, cx, cy, R;   // R = photon ring radius
  let t = 0, raf;
  let INITED = false;

  /* ─── Scene elements ────────────────────────────────────── */
  const MAIN_ARCS    = 6;    // large dramatic sweeping arcs
  const FILAMENTS    = 120;  // thin silk-like background threads
  let   arcs = [], filaments = [];

  /* ─── Resize & layout ───────────────────────────────────── */
  function resize() {
    w  = canvas.width  = canvas.clientWidth;
    h  = canvas.height = canvas.clientHeight;

    /* Singularity slightly above-center for dramatic composition */
    cx = w * 0.50;
    cy = h * 0.45;
    R  = Math.min(w, h) * 0.20;

    buildScene();

    /* Hard-clear on resize */
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);
  }

  /* ─── Build lensing geometry ────────────────────────────── */
  function buildScene() {
    arcs      = [];
    filaments = [];

    /* Main dramatic lensing arcs — large sweeping curves */
    for (let i = 0; i < MAIN_ARCS; i++) {
      const baseAngle = (i / MAIN_ARCS) * Math.PI * 2;
      arcs.push({
        baseAngle,
        startDist : R * (3.2 + rand() * 2.8),  // how far out the arc begins
        extent    : 1.4 + rand() * 1.2,          // how many radians it sweeps
        speed     : (0.00006 + rand() * 0.00005) * (rand() < 0.5 ? 1 : -1),
        opacity   : 0.45 + rand() * 0.45,
        width     : 1.2 + rand() * 2.2,
        steps     : 12,
      });
    }

    /* Thin filaments for silk/water texture from reference image */
    for (let i = 0; i < FILAMENTS; i++) {
      filaments.push({
        angle     : rand() * Math.PI * 2,
        startDist : R * (1.4 + rand() * 5),
        curvature : 0.5 + rand() * 1.4,
        speed     : (0.00008 + rand() * 0.00018) * (rand() < 0.5 ? 1 : -1),
        opacity   : 0.02 + rand() * 0.10,
        width     : 0.2 + rand() * 0.9,
      });
    }
  }

  /* ─── Draw one main lensing arc ─────────────────────────── */
  function drawArc(arc) {
    const angle = arc.baseAngle + t * arc.speed * 1000;
    const d     = arc.startDist;
    const ext   = arc.extent;
    const n     = arc.steps;

    /* Build points: spiral inward as angle sweeps */
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const f = i / n;
      const a = angle + f * ext;
      /* Distance shrinks as matter falls in — last 30% very tight */
      const dist = d * (1 - f * 0.68);
      pts.push({
        x: cx + Math.cos(a) * dist,
        y: cy + Math.sin(a) * dist * 0.55,  /* y-squish for 3D disk tilt */
      });
    }

    /* Smooth catmull-rom-ish path using quadratic bezier chaining */
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length - 2; i++) {
      const mx = (pts[i].x + pts[i + 1].x) / 2;
      const my = (pts[i].y + pts[i + 1].y) / 2;
      ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
    }
    ctx.quadraticCurveTo(
      pts[n - 1].x, pts[n - 1].y,
      pts[n].x, pts[n].y
    );

    /* Gradient: fades in from far end, bright near photon ring */
    const grd = ctx.createLinearGradient(
      pts[0].x, pts[0].y, pts[n].x, pts[n].y
    );
    grd.addColorStop(0,    'rgba(255,255,255,0)');
    grd.addColorStop(0.35, `rgba(210,210,210,${arc.opacity * 0.35})`);
    grd.addColorStop(0.7,  `rgba(235,235,235,${arc.opacity * 0.75})`);
    grd.addColorStop(1,    `rgba(255,255,255,${arc.opacity})`);

    ctx.strokeStyle = grd;
    ctx.lineWidth   = arc.width;
    ctx.lineCap     = 'round';
    ctx.lineJoin    = 'round';
    ctx.stroke();
  }

  /* ─── Draw one thin filament ────────────────────────────── */
  function drawFilament(fil) {
    const angle = fil.angle + t * fil.speed * 1000;
    const d     = fil.startDist;
    const curv  = fil.curvature;

    /* Start point */
    const sx = cx + Math.cos(angle) * d;
    const sy = cy + Math.sin(angle) * d * 0.55;

    /* Control point: pulled partway around toward singularity */
    const cpA = angle + curv * 0.7;
    const cpD = d * 0.45;
    const cpx = cx + Math.cos(cpA) * cpD;
    const cpy = cy + Math.sin(cpA) * cpD * 0.55;

    /* End: arrives near photon ring */
    const endA = angle + curv * 1.35;
    const endD = R * 1.08;
    const ex   = cx + Math.cos(endA) * endD;
    const ey   = cy + Math.sin(endA) * endD * 0.65;

    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.quadraticCurveTo(cpx, cpy, ex, ey);
    ctx.strokeStyle = `rgba(200,200,200,${fil.opacity})`;
    ctx.lineWidth   = fil.width;
    ctx.stroke();
  }

  /* ─── Main render frame ─────────────────────────────────── */
  function frame() {
    /* Slow fade instead of full clear → creates luminous trail effect */
    ctx.fillStyle = 'rgba(0,0,0,0.055)';
    ctx.fillRect(0, 0, w, h);

    /* ── Outer faint corona halo ──────────────────────────── */
    const corona = ctx.createRadialGradient(cx, cy, R * 1.1, cx, cy, R * 5.5);
    corona.addColorStop(0,    'rgba(255,255,255,0)');
    corona.addColorStop(0.3,  'rgba(255,255,255,0.018)');
    corona.addColorStop(0.62, 'rgba(255,255,255,0.05)');
    corona.addColorStop(0.78, 'rgba(255,255,255,0.025)');
    corona.addColorStop(1,    'rgba(255,255,255,0)');
    ctx.beginPath();
    ctx.ellipse(cx, cy, R * 5.5, R * 3.8, 0, 0, Math.PI * 2);
    ctx.fillStyle = corona;
    ctx.fill();

    /* ── Draw filaments (background layer) ────────────────── */
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    filaments.forEach(f => drawFilament(f));
    ctx.restore();

    /* ── Draw main arcs (foreground layer) ───────────────── */
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    arcs.forEach(a => drawArc(a));
    ctx.restore();

    /* ── Event horizon shadow disk (larger, soft edge) ───── */
    const shadow = ctx.createRadialGradient(cx, cy, R * 0.7, cx, cy, R * 1.05);
    shadow.addColorStop(0,   'rgba(0,0,0,1)');
    shadow.addColorStop(0.85,'rgba(0,0,0,1)');
    shadow.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.05, 0, Math.PI * 2);
    ctx.fillStyle = shadow;
    ctx.fill();

    /* ── Photon ring glow ─────────────────────────────────── */
    const photon = ctx.createRadialGradient(cx, cy, R * 0.75, cx, cy, R * 1.3);
    photon.addColorStop(0,    'rgba(255,255,255,0)');
    photon.addColorStop(0.55, 'rgba(255,255,255,0.08)');
    photon.addColorStop(0.78, 'rgba(255,255,255,0.55)');
    photon.addColorStop(0.88, 'rgba(255,255,255,1)');
    photon.addColorStop(0.94, 'rgba(255,255,255,0.6)');
    photon.addColorStop(1,    'rgba(255,255,255,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, R * 1.3, 0, Math.PI * 2);
    ctx.fillStyle = photon;
    ctx.fill();

    /* ── Hard event horizon (final solid black) ───────────── */
    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.88, 0, Math.PI * 2);
    ctx.fillStyle = '#000000';
    ctx.fill();

    /* ── Subtle inner glow just inside photon ring ─────────── */
    const inner = ctx.createRadialGradient(cx, cy, R * 0.7, cx, cy, R * 0.92);
    inner.addColorStop(0,   'rgba(255,255,255,0)');
    inner.addColorStop(0.7, 'rgba(255,255,255,0)');
    inner.addColorStop(1,   'rgba(255,255,255,0.06)');
    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.92, 0, Math.PI * 2);
    ctx.fillStyle = inner;
    ctx.fill();

    /* ── Small orbiting companion sphere (like in ref image) ── */
    const orbR   = R * 0.04;
    const orbDist = R * 2.4;
    const orbAngle = t * 0.018;
    const orbX   = cx + Math.cos(orbAngle) * orbDist;
    const orbY   = cy + Math.sin(orbAngle) * orbDist * 0.5;

    /* Only draw if not behind event horizon */
    const dToCenter = Math.hypot(orbX - cx, orbY - cy);
    if (dToCenter > R * 0.95) {
      ctx.beginPath();
      ctx.arc(orbX, orbY, orbR, 0, Math.PI * 2);
      ctx.fillStyle = '#000';
      ctx.fill();
      /* Tiny rim light on orb */
      const orbRim = ctx.createRadialGradient(
        orbX - orbR * 0.3, orbY - orbR * 0.3, 0,
        orbX, orbY, orbR
      );
      orbRim.addColorStop(0,   'rgba(255,255,255,0.15)');
      orbRim.addColorStop(0.7, 'rgba(255,255,255,0.05)');
      orbRim.addColorStop(1,   'rgba(255,255,255,0)');
      ctx.beginPath();
      ctx.arc(orbX, orbY, orbR, 0, Math.PI * 2);
      ctx.fillStyle = orbRim;
      ctx.fill();
    }

    t  += 0.012;
    raf = requestAnimationFrame(frame);
  }

  /* ─── Helpers ───────────────────────────────────────────── */
  function rand() { return Math.random(); }

  /* ─── Init ──────────────────────────────────────────────── */
  function start() {
    if (INITED) return;
    INITED = true;
    resize();
    INITED = true;

    /* Clear to black */
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);

    frame();
  }

  /* Respond to size changes */
  const ro = new ResizeObserver(() => {
    cancelAnimationFrame(raf);
    resize();
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, w, h);
    frame();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { start(); ro.observe(canvas); });
  } else {
    start();
    ro.observe(canvas);
  }

  /* Pause when tab hidden */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else frame();
  });
})();
