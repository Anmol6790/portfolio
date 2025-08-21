(function () {
  const root = document.documentElement;
  const header = document.getElementById('header');
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const themeToggle = document.getElementById('themeToggle');
  const backToTop = document.getElementById('backToTop');
  const yearSpan = document.getElementById('year');
  const form = document.getElementById('contactForm');
  const certCount = document.getElementById('certCount');
  const statProjects = document.getElementById('statProjects');
  const statCerts = document.getElementById('statCerts');
  const statSkills = document.getElementById('statSkills');

  function setYear() {
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
  }

  function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') {
      root.setAttribute('data-theme', saved);
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
    updateThemeIcon();
  }

  function toggleTheme() {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon();
  }

  function updateThemeIcon() {
    if (!themeToggle) return;
    const isDark = root.getAttribute('data-theme') === 'dark';
    themeToggle.innerHTML = isDark ? "<i class='bx bx-sun'></i>" : "<i class='bx bx-moon'></i>";
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }

  function toggleNav(forceState) {
    const shouldOpen = typeof forceState === 'boolean' ? forceState : !nav.classList.contains('open');
    nav.classList.toggle('open', shouldOpen);
    document.body.classList.toggle('nav-open', shouldOpen);
    if (navToggle) navToggle.setAttribute('aria-expanded', String(shouldOpen));
  }

  function closeNavOnLinkClick() {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => toggleNav(false));
    });
  }

  function smoothScroll() {
    document.querySelectorAll("a[href^='#']").forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const hash = this.getAttribute('href');
        if (!hash || hash === '#') return;
        const el = document.querySelector(hash);
        if (!el) return;
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, '', hash);
      });
    });
  }

  function scrollSpy() {
    const sections = Array.from(document.querySelectorAll('main section[id]'));
    const links = Array.from(document.querySelectorAll('.nav-link'));
    const sectionById = new Map(sections.map(s => [s.id, s]));

    function onScroll() {
      const scrollY = window.scrollY + 80; // offset for header
      let currentId = 'home';
      for (const section of sections) {
        if (section.offsetTop <= scrollY) currentId = section.id;
      }
      links.forEach(link => {
        const href = link.getAttribute('href') || '';
        const id = href.startsWith('#') ? href.slice(1) : '';
        link.classList.toggle('active', id === currentId);
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function headerShadowOnScroll() {
    function onScroll() {
      const scrolled = window.scrollY > 4;
      header.classList.toggle('scrolled', scrolled);
      if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function initRevealObserver() {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
  }

  function initFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        const filter = btn.getAttribute('data-filter');
        cards.forEach(card => {
          const tags = (card.getAttribute('data-tags') || '').split(',');
          const show = filter === 'all' || tags.includes(filter);
          card.style.display = show ? '' : 'none';
        });
      });
    });
  }

  function initBackToTop() {
    if (!backToTop) return;
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function initForm() {
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = /** @type {HTMLInputElement} */(document.getElementById('name')).value.trim();
      const email = /** @type {HTMLInputElement} */(document.getElementById('email')).value.trim();
      const message = /** @type {HTMLTextAreaElement} */(document.getElementById('message')).value.trim();

      let valid = true;
      const nameErr = form.querySelector('#name + .error');
      const emailErr = form.querySelector('#email + .error');
      const messageErr = form.querySelector('#message + .error');

      if (!name) { valid = false; if (nameErr) nameErr.textContent = 'Please enter your name.'; } else if (nameErr) nameErr.textContent = '';
      if (!email || !validateEmail(email)) { valid = false; if (emailErr) emailErr.textContent = 'Please enter a valid email.'; } else if (emailErr) emailErr.textContent = '';
      if (!message) { valid = false; if (messageErr) messageErr.textContent = 'Please enter a message.'; } else if (messageErr) messageErr.textContent = '';

      if (!valid) return;

      const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
      const body = encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')');
      window.location.href = `mailto:anmolpandet6790@gmail.com?subject=${subject}&body=${body}`;
      form.reset();
    });
  }

  function initCertificateCount() {
    if (!certCount) return;
    const items = document.querySelectorAll('.cert-item');
    certCount.textContent = String(items.length);
  }

  function initQuickStats() {
    if (statProjects) {
      const projects = document.querySelectorAll('.projects-grid .project-card');
      statProjects.textContent = String(projects.length);
    }
    if (statCerts) {
      const certs = document.querySelectorAll('.cert-item');
      statCerts.textContent = String(certs.length);
    }
    if (statSkills) {
      const skills = document.querySelectorAll('#skills .chip');
      statSkills.textContent = String(skills.length);
    }
  }

  // Function to scroll to specific sections
  function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  // Make scrollToSection globally available
  window.scrollToSection = scrollToSection;

  document.addEventListener('DOMContentLoaded', function () {
    setYear();
    initTheme();
    smoothScroll();
    scrollSpy();
    headerShadowOnScroll();
    initRevealObserver();
    initFilters();
    initBackToTop();
    initForm();
    initCertificateCount();
    initQuickStats();

    if (navToggle) navToggle.addEventListener('click', () => toggleNav());
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    closeNavOnLinkClick();
  });
})();


