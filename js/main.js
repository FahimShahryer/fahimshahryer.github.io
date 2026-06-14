/* ============================================================
   Portfolio — interactions
   ============================================================ */

(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --------- Mobile nav --------- */
  const navList = document.getElementById('nav-list');
  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');

  navToggle?.addEventListener('click', () => navList.classList.add('show'));
  navClose?.addEventListener('click', () => navList.classList.remove('show'));
  document.querySelectorAll('.nav__link').forEach(link =>
    link.addEventListener('click', () => navList.classList.remove('show'))
  );

  /* --------- Smooth scroll with header offset --------- */
  const headerEl = document.getElementById('header');
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = headerEl.offsetHeight + 8;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: reduceMotion ? 'auto' : 'smooth',
      });
    });
  });

  /* --------- Active nav link via IntersectionObserver --------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav__link');
  const sectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(l =>
            l.classList.toggle('is-active', l.getAttribute('href') === `#${id}`)
          );
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );
  sections.forEach(s => sectionObserver.observe(s));

  /* --------- Reveal-on-scroll (with stagger for siblings) --------- */
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );
  // stagger items that share a grid container
  document.querySelectorAll(
    '.projects__grid, .skills__grid, .awards__grid, .capabilities, .timeline'
  ).forEach(group => {
    [...group.querySelectorAll('.reveal')].forEach((el, i) => {
      el.style.setProperty('--rd', `${Math.min(i, 6) * 70}ms`);
    });
  });
  reveals.forEach(el => revealObserver.observe(el));

  /* --------- Count-up stats --------- */
  const formatCount = (target, value, suffix) => {
    const isFloat = target % 1 !== 0;
    const num = isFloat ? value.toFixed(1) : Math.round(value).toString();
    return num + suffix;
  };
  const animateCount = el => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    if (Number.isNaN(target)) return;
    if (reduceMotion) { el.textContent = formatCount(target, target, suffix); return; }
    const duration = 1400;
    const start = performance.now();
    const tick = now => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = formatCount(target, target * eased, suffix);
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = formatCount(target, target, suffix);
    };
    requestAnimationFrame(tick);
  };
  const statObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  document.querySelectorAll('[data-count]').forEach(el => statObserver.observe(el));

  /* --------- Spotlight (cursor-follow glow) --------- */
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.spotlight').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }

  /* --------- Header shadow + scroll progress + scroll-up --------- */
  const progressBar = document.getElementById('scroll-progress');
  const scrollUp = document.getElementById('scroll-up');
  let ticking = false;

  const onScroll = () => {
    const y = window.scrollY;
    headerEl.classList.toggle('scrolled', y > 8);
    scrollUp.classList.toggle('visible', y > 480);
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? (y / docH) * 100 : 0;
    progressBar.style.width = `${pct}%`;
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* --------- Theme toggle (default: dark) --------- */
  const themeBtn = document.getElementById('theme-btn');
  const themeIcon = document.getElementById('theme-icon');
  const STORAGE_KEY = 'theme';

  const applyTheme = theme => {
    if (theme === 'light') {
      document.body.classList.add('light');
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
    } else {
      document.body.classList.remove('light');
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    }
  };

  const stored = localStorage.getItem(STORAGE_KEY);
  applyTheme(stored === 'light' ? 'light' : 'dark');

  themeBtn?.addEventListener('click', () => {
    const next = document.body.classList.contains('light') ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  });

  /* --------- Console signature --------- */
  console.log(
    '%c● Fahim Shahryer',
    'color:#10b981;font-size:18px;font-weight:700;letter-spacing:-0.02em;'
  );
  console.log(
    '%cAI/ML Engineer · MLOps · fhmshahryer@gmail.com',
    'color:#a1a1aa;font-family:monospace;font-size:12px;'
  );
})();
