(function () {
  const root = document.documentElement;
  const header = document.getElementById('header');
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const themeToggle = document.getElementById('themeToggle');
  const leetcodeToggle = document.getElementById('leetcodeToggle');
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
      window.location.href = `mailto:anmolpandey6790@gmail.com?subject=${subject}&body=${body}`;
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

  // LeetCode Navigation Functions
  function initLeetCodeNav() {
    const leetcodeNav = document.getElementById('leetcodeNav');
    if (!leetcodeNav) return;

    // Sidebar item click handlers
    const sidebarItems = leetcodeNav.querySelectorAll('.leetcode-sidebar-item');
    sidebarItems.forEach(item => {
      item.addEventListener('click', () => {
        // Remove active class from all items
        sidebarItems.forEach(i => i.classList.remove('active'));
        // Add active class to clicked item
        item.classList.add('active');
        
        // Handle different sidebar sections
        const section = item.closest('.leetcode-sidebar-section');
        if (section) {
          const sectionTitle = section.querySelector('.leetcode-sidebar-title').textContent;
          handleSidebarClick(sectionTitle, item);
        }
      });
    });

    // Problem card click handlers
    const problemCards = leetcodeNav.querySelectorAll('.leetcode-problem-card');
    problemCards.forEach(card => {
      card.addEventListener('click', (e) => {
        // Don't trigger if clicking on buttons
        if (e.target.closest('.leetcode-btn')) return;
        
        const title = card.querySelector('.leetcode-problem-title').textContent;
        const number = card.querySelector('.leetcode-problem-number').textContent;
        console.log(`Clicked on problem: ${number} ${title}`);
        // You can add more functionality here like opening a problem modal
      });
    });

    // Solve button click handlers
    const solveButtons = leetcodeNav.querySelectorAll('.leetcode-btn-ghost');
    solveButtons.forEach(btn => {
      if (btn.textContent.includes('Solve')) {
        btn.addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent card click
          const card = btn.closest('.leetcode-problem-card');
          const title = card.querySelector('.leetcode-problem-title').textContent;
          const number = card.querySelector('.leetcode-problem-number').textContent;
          console.log(`Solving problem: ${number} ${title}`);
          // You can add more functionality here like opening a code editor
        });
      }
    });

    // Filter select handlers
    const filterSelects = leetcodeNav.querySelectorAll('.leetcode-select');
    filterSelects.forEach(select => {
      select.addEventListener('change', () => {
        const filterType = select.previousElementSibling ? 'topic' : 'difficulty';
        const value = select.value;
        console.log(`Filter changed: ${filterType} = ${value}`);
        filterProblems(filterType, value);
      });
    });

    // Sort button handler
    const sortButton = leetcodeNav.querySelector('.leetcode-btn-outline');
    if (sortButton) {
      sortButton.addEventListener('click', () => {
        console.log('Sort button clicked');
        // You can add sorting functionality here
      });
    }

    // Search functionality
    const searchButton = leetcodeNav.querySelector('.leetcode-btn-ghost');
    if (searchButton && searchButton.textContent.includes('Search')) {
      searchButton.addEventListener('click', () => {
        console.log('Search button clicked');
        // You can add search functionality here
      });
    }
  }

  function handleSidebarClick(sectionTitle, item) {
    const itemText = item.textContent.trim();
    console.log(`Sidebar clicked: ${sectionTitle} - ${itemText}`);
    
    // Handle different sections
    switch (sectionTitle) {
      case 'PROBLEMS':
        handleProblemsFilter(itemText);
        break;
      case 'DIFFICULTY':
        handleDifficultyFilter(itemText);
        break;
      case 'TOPICS':
        handleTopicFilter(itemText);
        break;
    }
  }

  function handleProblemsFilter(filter) {
    console.log(`Filtering problems by: ${filter}`);
    // Add logic to filter problems based on the selected filter
  }

  function handleDifficultyFilter(difficulty) {
    console.log(`Filtering by difficulty: ${difficulty}`);
    // Add logic to filter by difficulty
  }

  function handleTopicFilter(topic) {
    console.log(`Filtering by topic: ${topic}`);
    // Add logic to filter by topic
  }

  function filterProblems(type, value) {
    const problemCards = document.querySelectorAll('.leetcode-problem-card');
    problemCards.forEach(card => {
      let shouldShow = true;
      
      if (type === 'topic' && value !== 'All Topics') {
        const tags = card.querySelectorAll('.leetcode-tag');
        const hasMatchingTag = Array.from(tags).some(tag => 
          tag.textContent.toLowerCase().includes(value.toLowerCase())
        );
        shouldShow = hasMatchingTag;
      } else if (type === 'difficulty' && value !== 'All Difficulty') {
        const difficulty = card.querySelector('.leetcode-difficulty').textContent;
        shouldShow = difficulty.toLowerCase() === value.toLowerCase();
      }
      
      card.style.display = shouldShow ? 'flex' : 'none';
    });
  }

  // Toggle LeetCode navigation visibility
  function toggleLeetCodeNav() {
    const leetcodeNav = document.getElementById('leetcodeNav');
    if (leetcodeNav) {
      const isVisible = leetcodeNav.style.display !== 'none';
      leetcodeNav.style.display = isVisible ? 'none' : 'block';
      
      // Update button state
      if (leetcodeToggle) {
        leetcodeToggle.setAttribute('aria-pressed', String(!isVisible));
        leetcodeToggle.style.background = !isVisible ? '#e8910d' : '#ffa116';
      }
    }
  }

  // Make toggleLeetCodeNav globally available
  window.toggleLeetCodeNav = toggleLeetCodeNav;

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
    initLeetCodeNav(); // Initialize LeetCode navigation

    if (navToggle) navToggle.addEventListener('click', () => toggleNav());
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (leetcodeToggle) leetcodeToggle.addEventListener('click', toggleLeetCodeNav);
    closeNavOnLinkClick();
  });
})();


