/* ═══════════════════════════════════════════════════════════════
   main.js — Core app logic:
   custom cursor · scroll reveal · stat counters · auth modal · toasts
═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Supabase Initialization (Real Production Keys) ──────────── */
  const SUPABASE_URL = 'https://hxsmpogukblbtxsxhyrl.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_QYICejDxTt446S4CKQCAzA_Y-bf8nXw';
  let supabase;

  /* Initialize Supabase if the script is loaded */
  if (window.supabase) {
    try {
      supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      console.log('🚀 Supabase Ready');
    } catch (e) {
      console.warn('⚠️ Supabase connection failed. Check your credentials.');
    }
  }

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
     NARRATIVE SCROLL REVEAL (3-ACT PROGRESSION)
  ════════════════════════════════════════════════════════════ */
  const slideObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Find all fade animations inside this slide
      const faders = entry.target.querySelectorAll('.fade-in-up');
      
      if (entry.isIntersecting) {
        // Trigger animations when slide is fully snapped in
        faders.forEach(el => el.classList.add('visible'));
      } else {
        // Reset animations when scrolling away (re-playable experience)
        faders.forEach(el => el.classList.remove('visible'));
      }
    });
  }, {
    threshold: 0.5 // Trigger when slide is 50% visible (snapping will handle the rest)
  });

  function observeSlides() {
    document.querySelectorAll('.slide').forEach(el => slideObs.observe(el));
  }
  
  // init
  observeSlides();

  /* ════════════════════════════════════════════════════════════
     AUTH MODAL & PANES
  ════════════════════════════════════════════════════════════ */
  const modal       = document.getElementById('authModal');
  const modalClose  = document.getElementById('modalClose');
  const loginPane   = document.getElementById('loginPane');
  const signupPane  = document.getElementById('signupPane');
  const verifyPane  = document.getElementById('verifyPane');
  const onboardingPane = document.getElementById('onboardingPane');
  const toSignupBtn = document.getElementById('toSignup');
  const toLoginBtn  = document.getElementById('toLogin');

  /* Social Buttons */
  const socialBtns = {
    google: document.getElementById('googleBtn'),
    apple:  document.getElementById('appleBtn'),
    ms:     document.getElementById('msBtn'),
  };

  /* Openers */
  const openers = {
    login:  ['loginBtn'],
    signup: ['signupBtn', 'heroGetStarted', 'ctaSignupBtn'],
  };

  function openModal(mode) {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    switchTab(mode || 'login');
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);

  /* Modal Openers */
  Object.keys(openers).forEach(mode => {
    openers[mode].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', () => openModal(mode));
    });
  });

  /* Close on overlay click */
  if (modal) {
    modal.addEventListener('click', e => {
      if (e.target === modal) closeModal();
    });
  }

  /* Close on Escape */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });

  /* Tab switching */
  function switchTab(mode) {
    loginPane.classList.toggle('hidden', mode !== 'login');
    signupPane.classList.toggle('hidden', mode !== 'signup');
    verifyPane.classList.toggle('hidden', mode !== 'verify');
    onboardingPane.classList.toggle('hidden', mode !== 'onboarding');
  }

  if (toSignupBtn) toSignupBtn.addEventListener('click', e => { e.preventDefault(); switchTab('signup'); });
  if (toLoginBtn)  toLoginBtn.addEventListener('click',  e => { e.preventDefault(); switchTab('login'); });

  /* ─── Social Login Actions ─────────────────────────────────── */
  function handleSocialLogin(provider) {
    if (!supabase) {
      showToast('error', '⚠️', 'Supabase not connected. Please add your API keys.');
      return;
    }
    showToast('info', '🛰️', `Redirecting to ${provider}...`);
    /* In a real setup: supabase.auth.signInWithOAuth({ provider: provider }); */
  }

  ['google', 'apple', 'ms'].forEach(p => {
    const btn = document.getElementById(p + 'Btn');
    if (btn) btn.addEventListener('click', () => handleSocialLogin(p));
  });

  /* ─── Form Submissions ──────────────────────────────────────── */
  let userFirstName = localStorage.getItem('userFirstName') || 'Engineer';

  const loginForm  = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  if (signupForm) {
    signupForm.addEventListener('submit', async e => {
      e.preventDefault();
      userFirstName   = document.getElementById('firstName').value;
      const email     = document.getElementById('signupEmail').value;
      const password  = document.getElementById('signupPassword').value;

      if (!userFirstName || !email || !password) {
        showToast('error', '⚠️', 'Please fill in all fields.');
        return;
      }

      const btn = document.getElementById('signupSubmit');
      setLoading(btn, true);

      localStorage.setItem('userFirstName', userFirstName);

      /* Real Supabase SignUp */
      if (supabase) {
        const { error } = await supabase.auth.signUp({ email, password });
        setLoading(btn, false);
        if (error) {
          showToast('error', '❌', error.message);
        } else {
          switchTab('verify');
          showToast('success', '📧', `A real code has been sent to ${email}`);
        }
      } else {
        /* Fallback for Mock */
        setTimeout(() => {
          setLoading(btn, false);
          switchTab('verify');
          showToast('info', '📧', `Code sent! (Mock mode: 123456)`);
        }, 1200);
      }
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
    verifySubmit.addEventListener('click', async () => {
      let code = '';
      digitInputs.forEach(input => code += input.value);

      if (code.length < 6) return;

      setLoading(verifySubmit, true);

      if (supabase) {
        const email = document.getElementById('signupEmail').value;
        const { error } = await supabase.auth.verifyOtp({ email, token: code, type: 'signup' });
        setLoading(verifySubmit, false);
        if (error) {
          showToast('error', '❌', 'Invalid code. Check your email again.');
        } else {
          switchTab('onboarding');
          startOnboarding();
        }
      } else {
        /* Fallback Mock Success */
        setTimeout(() => {
          setLoading(verifySubmit, false);
          if (code === '123456') {
            switchTab('onboarding');
            startOnboarding();
          } else {
            showToast('error', '❌', 'Try 123456 for mock mode');
          }
        }, 1000);
      }
    });
  }

  /* ─── Onboarding Logic ──────────────────────────────────────── */
  let currentOnboardingStep = 1;
  const totalOnboardingSteps = 5;

  function startOnboarding() {
    currentOnboardingStep = 1;
    updateOnboardingUI();
  }

  window.nextOnboardingStep = function() {
    if (currentOnboardingStep < totalOnboardingSteps) {
      currentOnboardingStep++;
      updateOnboardingUI();
    }
  };

  function updateOnboardingUI() {
    const steps = document.querySelectorAll('.onboarding-step');
    steps.forEach(step => {
      const stepNum = parseInt(step.dataset.step, 10);
      step.classList.toggle('active', stepNum === currentOnboardingStep);
    });

    const progress = (currentOnboardingStep / totalOnboardingSteps) * 100;
    const bar = document.getElementById('onboardingProgress');
    const label = document.getElementById('onboardingStepLabel');
    
    if (bar) bar.style.width = `${progress}%`;
    if (label) label.textContent = `Step ${currentOnboardingStep} of ${totalOnboardingSteps}`;
  }

  window.completeOnboarding = function() {
    /* Hide progress bar and show final welcome */
    document.querySelector('.onboarding-progress').style.display = 'none';
    const steps = document.querySelectorAll('.onboarding-step');
    steps.forEach(s => s.classList.remove('active'));
    
    const welcomeStep = document.getElementById('welcomeStep');
    const welcomeTitle = document.getElementById('welcomeUserTitle');
    if (welcomeTitle) welcomeTitle.textContent = `Welcome ${userFirstName || 'StarP'}!`;
    if (welcomeStep) welcomeStep.classList.add('active');
  };

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
