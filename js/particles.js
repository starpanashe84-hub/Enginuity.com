/* ═══════════════════════════════════════════════════════════════
   particles.js — Canvas starfield background
═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;
  let mouseX = W / 2, mouseY = H / 2;
  let tick = 0;

  /* ─── Config ─────────────────────────────────────────────── */
  const CFG = {
    starCount:     160,
    glowCount:     20,
    maxStarSize:   1.3,
    maxGlowSize:   2.2,
    starSpeed:     0.10,
    glowSpeed:     0.15,
    starColor:     'rgba(255,255,255,',
    glowColor:     'rgba(255,255,255,',
    mouseInfluence: 0.025,
    connectDist:   110,
    connectOpacity: 0.04,
  };

  /* ─── Resize ──────────────────────────────────────────────── */
  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    mouseX = W / 2;
    mouseY = H / 2;
  }

  /* ─── Particle Factory ────────────────────────────────────── */
  function makeParticle(isGlow) {
    const depth  = Math.random();           // 0 = far, 1 = near
    const size   = isGlow
      ? 0.8  + Math.random() * CFG.maxGlowSize
      : 0.15 + Math.random() * CFG.maxStarSize * depth;

    return {
      x:      Math.random() * W,
      y:      Math.random() * H,
      vx:     (Math.random() - 0.5) * (isGlow ? CFG.glowSpeed : CFG.starSpeed * (0.3 + depth)),
      vy:     (Math.random() - 0.5) * (isGlow ? CFG.glowSpeed : CFG.starSpeed * (0.3 + depth)),
      size,
      baseSize: size,
      depth,
      isGlow,
      opacity: isGlow ? 0.4 + Math.random() * 0.5 : 0.2 + Math.random() * 0.6 * depth,
      pulseSpeed: 0.005 + Math.random() * 0.01,
      pulseOffset: Math.random() * Math.PI * 2,
      twinkle: Math.random() < 0.3,
    };
  }

  /* ─── Init ────────────────────────────────────────────────── */
  function init() {
    particles = [];
    for (let i = 0; i < CFG.starCount; i++) particles.push(makeParticle(false));
    for (let i = 0; i < CFG.glowCount;  i++) particles.push(makeParticle(true));
  }

  /* ─── Draw ────────────────────────────────────────────────── */
  function draw() {
    ctx.clearRect(0, 0, W, H);
    tick += 0.016;

    const mx = mouseX / W - 0.5;  // -0.5 to 0.5
    const my = mouseY / H - 0.5;

    particles.forEach(p => {
      /* Movement with subtle mouse parallax */
      p.x += p.vx + mx * CFG.mouseInfluence * p.depth;
      p.y += p.vy + my * CFG.mouseInfluence * p.depth;

      /* Wrap around */
      if (p.x < -10)  p.x = W + 10;
      if (p.x > W+10) p.x = -10;
      if (p.y < -10)  p.y = H + 10;
      if (p.y > H+10) p.y = -10;

      /* Twinkling */
      let alpha = p.opacity;
      if (p.twinkle) {
        alpha *= 0.5 + 0.5 * Math.sin(tick * (p.pulseSpeed * 60) + p.pulseOffset);
      }

      /* Pulse size for glow particles */
      let size = p.baseSize;
      if (p.isGlow) {
        size *= 0.8 + 0.2 * Math.sin(tick * (p.pulseSpeed * 30) + p.pulseOffset);
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

      if (p.isGlow) {
        /* Soft white gradient glow */
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 3.5);
        grad.addColorStop(0,   'rgba(255,255,255,0.7)');
        grad.addColorStop(0.4, 'rgba(255,255,255,0.2)');
        grad.addColorStop(1,   'rgba(255,255,255,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 3.5, 0, Math.PI * 2);
        ctx.fill();

        /* Core dot */
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 0.7, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = CFG.starColor + alpha + ')';
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    /* Subtle connecting lines between nearby glow particles */
    const glows = particles.filter(p => p.isGlow);
    for (let i = 0; i < glows.length; i++) {
      for (let j = i + 1; j < glows.length; j++) {
        const dx   = glows[i].x - glows[j].x;
        const dy   = glows[i].y - glows[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < CFG.connectDist) {
          const op = CFG.connectOpacity * (1 - dist / CFG.connectDist);
          ctx.save();
          ctx.globalAlpha = op;
          ctx.strokeStyle = 'rgba(255,255,255,1)';
          ctx.lineWidth = 0.4;
          ctx.beginPath();
          ctx.moveTo(glows[i].x, glows[i].y);
          ctx.lineTo(glows[j].x, glows[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    animId = requestAnimationFrame(draw);
  }

  /* ─── Mouse ───────────────────────────────────────────────── */
  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  /* ─── Resize ──────────────────────────────────────────────── */
  const ro = new ResizeObserver(() => { resize(); });
  ro.observe(canvas.parentElement || document.body);

  /* ─── Start ───────────────────────────────────────────────── */
  resize();
  init();
  draw();

  /* ─── Pause when tab hidden ───────────────────────────────── */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      tick = 0;
      draw();
    }
  });
})();
