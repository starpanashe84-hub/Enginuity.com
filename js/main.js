/* ═══════════════════════════════════════════════════════════════
   main.js — Core app logic:
   custom cursor · scroll reveal · stat counters · auth modal · toasts
═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ════════════════════════════════════════════════════════════
     CUSTOM CURSOR
  ════════════════════════════════════════════════════════════ */
  const cursor     = document.getElementById('cursor');
  const cursorGlow = document.getElementById('cursorGlow');

  let cx = 0, cy = 0;     /* current (smoothed) glow position */
  let mx = 0, my = 0;     /* raw mouse position */

  if (cursor && cursorGlow) {
    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;

      /* Dot follows instantly */
      cursor.style.left = mx + 'px';
      cursor.style.top  = my + 'px';
    });

    /* Smooth lag for glow ring */
    function animateCursor() {
      cx += (mx - cx) * 0.12;
      cy += (my - cy) * 0.12;
      cursorGlow.style.left = cx + 'px';
      cursorGlow.style.top  = cy + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    /* Hover state on interactive elements */
    const hoverEls = 'a, button, input, select, textarea, [tabindex], .disc-card, .glass-card';
    document.addEventListener('mouseover', e => {
      if (e.target.closest(hoverEls)) {
        document.body.classList.add('cursor-hover');
      }
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest(hoverEls)) {
        document.body.classList.remove('cursor-hover');
      }
    });

    /* Click state */
    document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
    document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));

    /* Hide on touch devices */
    window.addEventListener('touchstart', () => {
      cursor.style.display     = 'none';
      cursorGlow.style.display = 'none';
    }, { once: true });
  }

  /* ════════════════════════════════════════════════════════════
     SCROLL REVEAL — IntersectionObserver
  ════════════════════════════════════════════════════════════ */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  });

  function observeReveal() {
    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
  }

  /* Expose so disciplines.js can add new cards */
  window._revealObserver = revealObs;

  /* ════════════════════════════════════════════════════════════
     ANIMATED STAT COUNTERS
  ════════════════════════════════════════════════════════════ */
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        countObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start    = performance.now();

    function easeOut(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.round(easeOut(progress) * target);

      /* Format with comma separator for large numbers */
      el.textContent = value >= 1000
        ? (value / 1000).toFixed(value % 1000 === 0 ? 0 : 1) + 'k'
        : value;

      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target >= 1000
        ? (target / 1000).toFixed(0) + 'k'
        : target;
    }

    requestAnimationFrame(tick);
  }

  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    countObs.observe(el);
  });

  /* ════════════════════════════════════════════════════════════
     AUTH MODAL
  ════════════════════════════════════════════════════════════ */
  const modal       = document.getElementById('authModal');
  const modalClose  = document.getElementById('modalClose');
  const loginPane   = document.getElementById('loginPane');
  const signupPane  = document.getElementById('signupPane');
  const verifyPane  = document.getElementById('verifyPane');
  const toSignupBtn = document.getElementById('toSignup');
  const toLoginBtn  = document.getElementById('toLogin');

  /* Openers */
  const openers = {
    login:  ['loginBtn'],
    signup: ['signupBtn', 'heroGetStarted', 'ctaSignupBtn'],
  };

  function openModal(mode) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    switchTab(mode || 'login');
    setTimeout(() => {
      const activePane = mode === 'signup' ? signupPane : loginPane;
      const first = activePane.querySelector('input:not([type="checkbox"])');
      if (first) first.focus();
    }, 400);
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  openers.login.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', () => openModal('login'));
  });

  openers.signup.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', () => openModal('signup'));
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);

  /* Close on overlay click */
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });

  /* Close on Escape */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });

  /* Tab switching */
  function switchTab(mode) {
    loginPane.classList.toggle('hidden', mode !== 'login');
    signupPane.classList.toggle('hidden', mode !== 'signup');
    verifyPane.classList.toggle('hidden', mode !== 'verify');
  }

  if (toSignupBtn) toSignupBtn.addEventListener('click', e => { e.preventDefault(); switchTab('signup'); });
  if (toLoginBtn)  toLoginBtn.addEventListener('click',  e => { e.preventDefault(); switchTab('login'); });

  /* ─── Form Submissions ──────────────────────────────────────── */
  const loginForm  = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email    = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;

      if (!email || !password) {
        showToast('error', '⚠️', 'Please fill in all fields.');
        return;
      }

      /* Simulate login (replace with real API call) */
      const btn = document.getElementById('loginSubmit');
      setLoading(btn, true);

      setTimeout(() => {
        setLoading(btn, false);
        closeModal();
        showToast('success', '✓', `Welcome back! Signed in as ${email.split('@')[0]}.`);
      }, 1500);
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', e => {
      e.preventDefault();
      const firstName = document.getElementById('firstName').value;
      const email     = document.getElementById('signupEmail').value;
      const password  = document.getElementById('signupPassword').value;

      if (!firstName || !email || !password) {
        showToast('error', '⚠️', 'Please fill in all fields.');
        return;
      }

      const btn = document.getElementById('signupSubmit');
      setLoading(btn, true);

      setTimeout(() => {
        setLoading(btn, false);
        switchTab('verify');
        document.getElementById('verifyText').textContent = `We sent a 6-digit code to ${email}`;
        /* Focus first digit */
        const firstDigit = verifyPane.querySelector('.digit-input');
        if (firstDigit) firstDigit.focus();
        showToast('info', '📧', `Code sent! (Mock code: 123456)`);
      }, 1200);
    });
  }

  /* ─── Verification Flow ─────────────────────────────────────── */
  const verifySubmit = document.getElementById('verifySubmit');
  const digitInputs  = document.querySelectorAll('.digit-input');

  digitInputs.forEach((input, index) => {
    input.addEventListener('input', e => {
      if (e.target.value.length === 1 && index < digitInputs.length - 1) {
        digitInputs[index + 1].focus();
      }
    });

    input.addEventListener('keydown', e => {
      if (e.key === 'Backspace' && !e.target.value && index > 0) {
        digitInputs[index - 1].focus();
      }
    });
  });

  if (verifySubmit) {
    verifySubmit.addEventListener('click', () => {
      let code = '';
      digitInputs.forEach(input => code += input.value);

      if (code.length < 6) {
        showToast('error', '⚠️', 'Please enter the full 6-digit code.');
        return;
      }

      setLoading(verifySubmit, true);
      setTimeout(() => {
        setLoading(verifySubmit, false);
        if (code === '123456') {
          closeModal();
          showToast('success', '🚀', `Account verified! Welcome to Enginuity.`);
        } else {
          showToast('error', '❌', 'Invalid verification code. Try 123456');
        }
      }, 1500);
    });
  }

  /* ─── Password Toggle ───────────────────────────────────────── */
  document.querySelectorAll('.pass-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      const input = document.getElementById(targetId);
      if (!input) return;

      if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = 'Hide';
      } else {
        input.type = 'password';
        btn.textContent = 'Show';
      }
    });
  });

  /* CTA email form */
  const ctaSignupBtn = document.getElementById('ctaSignupBtn');
  if (ctaSignupBtn) {
    ctaSignupBtn.addEventListener('click', () => {
      const emailEl = document.getElementById('ctaEmail');
      const email   = emailEl ? emailEl.value.trim() : '';
      if (!email || !email.includes('@')) {
        showToast('error', '⚠️', 'Please enter a valid email address.');
        if (emailEl) emailEl.focus();
        return;
      }
      openModal('signup');
      setTimeout(() => {
        const signupEmailEl = document.getElementById('signupEmail');
        if (signupEmailEl) signupEmailEl.value = email;
      }, 400);
    });
  }

  /* Social buttons */
  ['googleBtn', 'githubBtn'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', () => {
        const provider = id.replace('Btn', '');
        showToast('info', '🔗', `${capitalize(provider)} sign-in coming soon!`);
      });
    }
  });

  /* Try AI button */
  const tryAiBtn = document.getElementById('tryAiBtn');
  if (tryAiBtn) {
    tryAiBtn.addEventListener('click', () => {
      showToast('info', '🧠', 'AI Guide is launching soon — join the waitlist!');
      setTimeout(() => openModal('signup'), 800);
    });
  }

  /* ════════════════════════════════════════════════════════════
     TOAST NOTIFICATIONS
  ════════════════════════════════════════════════════════════ */
  function showToast(type, icon, message, duration = 4000) {
    /* Remove existing toasts */
    document.querySelectorAll('.toast').forEach(t => {
      t.classList.add('removing');
      setTimeout(() => t.remove(), 300);
    });

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');

    const colors = {
      success: 'rgba(245,166,35,0.8)',
      error:   'rgba(220,60,60,0.7)',
      info:    'rgba(100,150,255,0.7)',
    };

    toast.style.borderColor = colors[type] || colors.info;

    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-text">${message}</span>
      <button class="toast-close" aria-label="Dismiss">✕</button>
    `;

    toast.querySelector('.toast-close').addEventListener('click', () => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 300);
    });

    document.body.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 300);
      }
    }, duration);
  }

  /* ════════════════════════════════════════════════════════════
     BUTTON LOADING STATE
  ════════════════════════════════════════════════════════════ */
  function setLoading(btn, loading) {
    if (!btn) return;
    if (loading) {
      btn._originalText = btn.textContent;
      btn.disabled      = true;
      btn.textContent   = '';
      btn.innerHTML     = `
        <span style="
          display:inline-block;
          width:16px; height:16px;
          border:2px solid rgba(0,0,0,0.3);
          border-top-color:#000;
          border-radius:50%;
          animation:spin 0.7s linear infinite;
        "></span>
      `;
      /* Inject spin keyframe if not present */
      if (!document.getElementById('spinKF')) {
        const style = document.createElement('style');
        style.id = 'spinKF';
        style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
        document.head.appendChild(style);
      }
    } else {
      btn.disabled    = false;
      btn.textContent = btn._originalText || 'Submit';
    }
  }

  /* ════════════════════════════════════════════════════════════
     PARALLAX — subtle hero section depth
  ════════════════════════════════════════════════════════════ */
  const heroVisual = document.querySelector('.hero-visual');
  const heroContent = document.querySelector('.hero-content');

  if (heroVisual && heroContent) {
    let parallaxTick = false;
    window.addEventListener('scroll', () => {
      if (!parallaxTick) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const depth   = scrollY * 0.25;
          heroVisual.style.transform  = `translateY(${depth}px)`;
          heroContent.style.transform = `translateY(${depth * 0.5}px)`;
          parallaxTick = false;
        });
        parallaxTick = true;
      }
    }, { passive: true });
  }

  /* ════════════════════════════════════════════════════════════
     DISC CARD — keyboard accessibility
  ════════════════════════════════════════════════════════════ */
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.classList.contains('disc-card')) {
      showToast('info', '📘', `Opening ${e.target.querySelector('.disc-name')?.textContent || 'discipline'}...`);
    }
  });

  /* Disc card click */
  document.addEventListener('click', e => {
    const card = e.target.closest('.disc-card');
    if (card) {
      const name = card.querySelector('.disc-name')?.textContent;
      if (name) showToast('info', '📘', `${name} — coming soon! Join to get early access.`);
    }
  });

  /* ════════════════════════════════════════════════════════════
     UTILITIES
  ════════════════════════════════════════════════════════════ */
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /* ════════════════════════════════════════════════════════════
     INIT — wait for DOM + disciplines.js render
  ════════════════════════════════════════════════════════════ */
  function init() {
    observeReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* Re-observe after disciplines render (slight delay) */
  setTimeout(observeReveal, 100);

})();
