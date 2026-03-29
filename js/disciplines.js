/* ═══════════════════════════════════════════════════════════════
   disciplines.js — Engineering disciplines data + card rendering
═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── Data ────────────────────────────────────────────────── */
  const DISCIPLINES = [
    {
      icon: '⚡',
      name: 'Electrical Engineering',
      desc: 'Circuit theory, power systems, electronics, signals & systems.',
      problems: 340,
      tag: 'Popular',
    },
    {
      icon: '🔧',
      name: 'Mechanical Engineering',
      desc: 'Thermodynamics, fluid mechanics, dynamics, and machine design.',
      problems: 310,
      tag: 'Popular',
    },
    {
      icon: '🏗️',
      name: 'Civil & Structural',
      desc: 'Structural analysis, geotechnics, hydraulics, and construction.',
      problems: 220,
      tag: '',
    },
    {
      icon: '💻',
      name: 'Computer Engineering',
      desc: 'Digital systems, computer architecture, OS, and embedded systems.',
      problems: 280,
      tag: 'Popular',
    },
    {
      icon: '⚗️',
      name: 'Chemical Engineering',
      desc: 'Mass transfer, reaction kinetics, process design, and thermodynamics.',
      problems: 195,
      tag: '',
    },
    {
      icon: '✈️',
      name: 'Aerospace Engineering',
      desc: 'Aerodynamics, propulsion, orbital mechanics, and flight dynamics.',
      problems: 175,
      tag: '',
    },
    {
      icon: '🤖',
      name: 'Mechatronics & Robotics',
      desc: 'Control systems, sensors, actuators, and embedded programming.',
      problems: 210,
      tag: 'New',
    },
    {
      icon: '🧬',
      name: 'Biomedical Engineering',
      desc: 'Biomechanics, medical devices, bio-signals, and tissue engineering.',
      problems: 140,
      tag: 'New',
    },
    {
      icon: '🌊',
      name: 'Environmental Engineering',
      desc: 'Water treatment, air quality, waste management, and sustainability.',
      problems: 120,
      tag: '',
    },
    {
      icon: '⚛️',
      name: 'Nuclear Engineering',
      desc: 'Reactor physics, radiation safety, nuclear materials, and decay.',
      problems: 95,
      tag: '',
    },
    {
      icon: '📡',
      name: 'Telecommunications',
      desc: 'Signal processing, wireless comms, networking, and antennas.',
      problems: 155,
      tag: '',
    },
    {
      icon: '🏭',
      name: 'Industrial Engineering',
      desc: 'Operations research, ergonomics, quality systems, and logistics.',
      problems: 130,
      tag: '',
    },
    {
      icon: '🛢️',
      name: 'Petroleum Engineering',
      desc: 'Reservoir engineering, drilling, well completion, and production.',
      problems: 100,
      tag: '',
    },
    {
      icon: '🌍',
      name: 'Geotechnical Engineering',
      desc: 'Soil mechanics, foundation design, slope stability, and earthworks.',
      problems: 88,
      tag: '',
    },
    {
      icon: '🔬',
      name: 'Materials Science',
      desc: 'Crystal structures, mechanical properties, corrosion, and composites.',
      problems: 115,
      tag: '',
    },
  ];

  /* ─── Render ──────────────────────────────────────────────── */
  function render() {
    const grid = document.getElementById('disciplinesGrid');
    if (!grid) return;

    grid.innerHTML = DISCIPLINES.map((d, i) => `
      <div
        class="disc-card reveal"
        style="--reveal-delay: ${(i % 5) * 0.07}s; animation-delay: ${i * 0.04}s;"
        role="article"
        aria-label="${d.name}"
        tabindex="0"
        id="disc-${i}"
      >
        <span class="disc-icon" aria-hidden="true">${d.icon}</span>
        <span class="disc-name">${d.name}</span>
        <span class="disc-desc">${d.desc}</span>
        <div style="display:flex; align-items:center; justify-content:space-between; margin-top:auto; padding-top:8px;">
          <span class="disc-badge">
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <circle cx="4" cy="4" r="3" fill="rgba(245,166,35,0.7)"/>
            </svg>
            ${d.problems} problems
          </span>
          ${d.tag ? `<span style="font-size:0.62rem; font-family:var(--font-mono); color:var(--gold-400); background:rgba(245,166,35,0.08); padding:2px 6px; border-radius:4px; border:1px solid rgba(245,166,35,0.15);">${d.tag}</span>` : ''}
        </div>
      </div>
    `).join('');

    /* Re-trigger IntersectionObserver for new elements
       (main.js observer picks them up automatically) */
    if (window._revealObserver) {
      grid.querySelectorAll('.reveal').forEach(el => {
        window._revealObserver.observe(el);
      });
    }
  }

  /* ─── Public API ──────────────────────────────────────────── */
  window.DISCIPLINES = DISCIPLINES;

  /* Run on DOM ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
