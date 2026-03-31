/* ═══════════════════════════════════════════════════════════════
   ENGINUITY — academic-particles.js
   Floating reactive mathematical/engineering symbols for background
   (The WOW factor)
═══════════════════════════════════════════════════════════════ */

(function() {
  'use strict';

  const canvas = document.getElementById('academicCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const symbols = ['∫', 'Σ', 'π', 'Δ', '∇', 'Ω', 'μ', 'λ', 'θ', 'x²', 'dy/dx', 'E=mc²', 'f(x)', 'lim', '∞', 'Φ', 'ρ'];
  const particles = [];
  const particleCount = window.innerWidth > 800 ? 45 : 20;

  // Mouse interaction
  let mouse = { x: null, y: null, radius: 120 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 14 + 10; // Font size 10 to 24
      this.speedX = Math.random() * 0.5 - 0.25;
      this.speedY = Math.random() * -0.5 - 0.2; // Float upwards
      this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
      this.opacity = Math.random() * 0.3 + 0.05; // Faint, subtle
    }

    draw() {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.font = `300 ${this.size}px "VT323", monospace`; // brutalist mono font
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.symbol, this.x, this.y);
    }

    update() {
      // Repulsion logic
      if (mouse.x != null && mouse.y != null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const maxDistance = mouse.radius;
          const force = (maxDistance - distance) / maxDistance;
          const directionX = forceDirectionX * force * 3;
          const directionY = forceDirectionY * force * 3;
          
          this.x -= directionX;
          this.y -= directionY;
        }
      }

      // Normal drift
      this.x += this.speedX;
      this.y += this.speedY;

      // Wrap around edges
      if (this.x > width + this.size) this.x = -this.size;
      else if (this.x < -this.size) this.x = width + this.size;
      
      if (this.y < -this.size) {
        this.y = height + this.size;
        this.x = Math.random() * width;
      }
      
      this.draw();
    }
  }

  function init() {
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
    }
    requestAnimationFrame(animate);
  }

  init();
  animate();

})();
