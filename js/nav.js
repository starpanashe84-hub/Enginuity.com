/* ═══════════════════════════════════════════════════════════════
   nav.js — Navigation: scroll effects, mobile toggle, active links
═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const navbar    = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.querySelectorAll('.nav-link');
  const body      = document.body;

  /* ─── Scroll: glassy navbar + active section tracking ──────── */
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;

        /* Toggle glass style */
        navbar.classList.toggle('scrolled', scrollY > 40);

        /* Active section highlight */
        const sections = document.querySelectorAll('section[id]');
        let current = '';

        sections.forEach(sec => {
          const top = sec.offsetTop - 110;
          if (scrollY >= top) current = sec.id;
        });

        navLinks.forEach(link => {
          const section = link.getAttribute('data-section');
          link.classList.toggle('active', section === current);
        });

        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); /* Run once on load */

  /* ─── Smooth scroll for nav links ──────────────────────────── */
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const href    = link.getAttribute('href');
      const target  = document.querySelector(href);
      if (!target) return;
      const top = target.offsetTop - 70;
      window.scrollTo({ top, behavior: 'smooth' });

      /* Close mobile nav if open */
      if (body.classList.contains('nav-open')) {
        body.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  /* ─── Mobile toggle ─────────────────────────────────────────── */
  navToggle.addEventListener('click', () => {
    const isOpen = body.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));

    /* Animate hamburger → × */
    const spans = navToggle.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.cssText = 'transform: translateY(6.5px) rotate(45deg)';
      spans[1].style.cssText = 'opacity: 0; transform: scaleX(0)';
      spans[2].style.cssText = 'transform: translateY(-6.5px) rotate(-45deg)';
    } else {
      spans.forEach(s => s.style.cssText = '');
    }
  });

  /* Close mobile nav on outside click */
  document.addEventListener('click', e => {
    if (body.classList.contains('nav-open') &&
        !navbar.contains(e.target)) {
      body.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.querySelectorAll('span').forEach(s => s.style.cssText = '');
    }
  });

  /* ─── Smooth scroll for logo ─────────────────────────────────── */
  const navLogo = document.getElementById('navLogo');
  if (navLogo) {
    navLogo.addEventListener('click', e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─── Hero CTA → disciplines section ────────────────────────── */
  const heroExplore = document.getElementById('heroExplore');
  if (heroExplore) {
    heroExplore.addEventListener('click', e => {
      e.preventDefault();
      const disc = document.getElementById('disciplines');
      if (disc) window.scrollTo({ top: disc.offsetTop - 70, behavior: 'smooth' });
    });
  }

})();
