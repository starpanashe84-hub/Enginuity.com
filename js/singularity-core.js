/* ═══════════════════════════════════════════════════════════════
   ENGINUITY — singularity-core.js
   Dynamic, interactive black hole / singularity physics background
   (The ultimate WOW factor for the Engineering Dashboard)
═══════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  const canvas = document.getElementById('academicCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const symbols = ['∫', 'Σ', 'π', 'Δ', '∇', 'Ω', 'μ', 'λ', 'θ', 'x²', 'dy/dx', 'E=mc²', 'f(x)', 'lim', '∞', 'Φ', 'ρ'];
  const particles = [];
  const particleCount = 280; // Total orbiting data points + symbols
  const coreRadius = 80;    // Size of the central "Event Horizon"
  const pulseRings = [];    // Visual energy pulses from clicks

  // Center of gravity
  const gravityCenter = { x: width / 2, y: height / 2 };

  // Mouse interactivity
  let mouse = { x: null, y: null, active: false };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });
  window.addEventListener('mouseout', () => {
    mouse.active = false;
  });

  // Click pulse animation
  window.addEventListener('mousedown', (e) => {
    pulseRings.push({
        x: e.clientX,
        y: e.clientY,
        r: 0,
        opacity: 0.6
    });
  });

  class Particle {
    constructor(isSymbol = false) {
      this.isSymbol = isSymbol;
      this.reset();
    }

    reset() {
      // Randomly spawn in the orbit rather than completely random
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * (width / 2) + coreRadius;
      this.x = gravityCenter.x + Math.cos(angle) * dist;
      this.y = gravityCenter.y + Math.sin(angle) * dist;
      
      this.symbol = this.isSymbol ? symbols[Math.floor(Math.random() * symbols.length)] : null;
      this.size = this.isSymbol ? Math.random() * 8 + 12 : Math.random() * 2 + 1;
      this.opacity = Math.random() * 0.4 + 0.1;
      
      // Orbital properties
      this.angle = angle;
      this.orbitalSpeed = (Math.random() * 0.005 + 0.002) * (Math.random() > 0.5 ? 1 : -1);
      this.radius = dist;
      
      this.vx = 0;
      this.vy = 0;
    }

    draw() {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
      if (this.isSymbol) {
        ctx.font = `400 ${this.size}px "VT323", monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.symbol, this.x,  this.y);
      } else {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    update() {
      // 1. Calculate gravity pull towards center (Accretion)
      const dx = gravityCenter.x - this.x;
      const dy = gravityCenter.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Orbital physics
      this.angle += this.orbitalSpeed;
      
      // Pull strength increases near core
      const targetX = gravityCenter.x + Math.cos(this.angle) * this.radius;
      const targetY = gravityCenter.y + Math.sin(this.angle) * this.radius;

      // Smooth motion towards ideal orbit but keep dynamic feel
      this.x += (targetX - this.x) * 0.02;
      this.y += (targetY - this.y) * 0.02;

      // 2. Mouse Repulsion / Bending
      if (mouse.active) {
        const mdx = mouse.x - this.x;
        const mdy = mouse.y - this.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        
        if (mdist < 150) {
           const force = (150 - mdist) / 150;
           this.x -= mdx / mdist * force * 12;
           this.y -= mdy / mdist * force * 12;
           this.opacity = 0.8; // Glow brighter near mouse
        } else {
           this.opacity = Math.max(this.opacity - 0.01, 0.2);
        }
      }

      // 3. Event Horizon Absorption
      if (distance < coreRadius) {
         this.reset(); // Re-spawn at the outer edge when absorbed
      }

      this.draw();
    }
  }

  function init() {
    for (let i = 0; i < particleCount; i++) {
        // approx 10% are math symbols, rest are data points
        particles.push(new Particle(i % 10 === 0));
    }
  }

  function animate() {
    // Cinematic fade trails
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, width, height);

    // Draw central singularity glow (Event Horizon)
    const gradient = ctx.createRadialGradient(gravityCenter.x, gravityCenter.y, 0, gravityCenter.x, gravityCenter.y, coreRadius * 1.5);
    gradient.addColorStop(0, '#000');
    gradient.addColorStop(0.7, '#000');
    gradient.addColorStop(0.9, 'rgba(245, 166, 35, 0.15)'); // Subtle gold rim
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(gravityCenter.x, gravityCenter.y, coreRadius * 2, 0, Math.PI * 2);
    ctx.fill();

    // Pulse rings processing
    for (let i = pulseRings.length - 1; i >= 0; i--) {
        const ring = pulseRings[i];
        ctx.strokeStyle = `rgba(255, 255, 255, ${ring.opacity})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.r, 0, Math.PI * 2);
        ctx.stroke();
        
        ring.r += 6;
        ring.opacity -= 0.015;
        if (ring.opacity <= 0) pulseRings.splice(i, 1);
    }

    // Process particles
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
    }

    requestAnimationFrame(animate);
  }

  init();
  animate();

})();
