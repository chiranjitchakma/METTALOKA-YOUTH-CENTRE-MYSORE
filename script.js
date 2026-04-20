/* ═══════════════════════════════════════════════════
   METTALOKA YOUTH CENTRE — SCRIPT.JS
   ═══════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── ELEMENTS ── */
  const header    = document.getElementById('site-header');
  const burger    = document.getElementById('burger');
  const navMenu   = document.getElementById('nav-menu');
  const btt       = document.getElementById('btt');
  const lightbox  = document.getElementById('lightbox');
  const lbImg     = document.getElementById('lb-img');
  const lbClose   = document.getElementById('lb-close');
  const lbPrev    = document.getElementById('lb-prev');
  const lbNext    = document.getElementById('lb-next');
  const lbCount   = document.getElementById('lb-count');
  const heroSlides= document.querySelectorAll('.hero-slide');
  const heroDots  = document.querySelectorAll('.dot');
  const galleryItems = document.querySelectorAll('.gi');

  /* ══════════════════════════════════════════
     1. SCROLL — header + back-to-top
  ══════════════════════════════════════════ */
  function onScroll() {
    if (window.scrollY > 60)  { header.classList.add('scrolled'); }
    else                       { header.classList.remove('scrolled'); }

    if (window.scrollY > 400) { btt.classList.add('show'); }
    else                       { btt.classList.remove('show'); }

    revealCheck();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ══════════════════════════════════════════
     2. BACK TO TOP
  ══════════════════════════════════════════ */
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ══════════════════════════════════════════
     3. MOBILE NAV
  ══════════════════════════════════════════ */
  burger.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    const bars = burger.querySelectorAll('span');
    if (open) {
      bars[0].style.cssText = 'transform:translateY(7px) rotate(45deg)';
      bars[1].style.cssText = 'opacity:0';
      bars[2].style.cssText = 'transform:translateY(-7px) rotate(-45deg)';
    } else {
      bars.forEach(b => b.style.cssText = '');
    }
  });

  navMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navMenu.classList.remove('open');
      burger.querySelectorAll('span').forEach(b => b.style.cssText = '');
    });
  });

  document.addEventListener('click', e => {
    if (!header.contains(e.target)) {
      navMenu.classList.remove('open');
      burger.querySelectorAll('span').forEach(b => b.style.cssText = '');
    }
  });

  /* ══════════════════════════════════════════
     4. HERO SLIDESHOW
  ══════════════════════════════════════════ */
  let currentSlide = 0;
  let slideTimer;

  function goToSlide(n) {
    heroSlides[currentSlide].classList.remove('active');
    heroDots[currentSlide].classList.remove('active');
    currentSlide = (n + heroSlides.length) % heroSlides.length;
    heroSlides[currentSlide].classList.add('active');
    heroDots[currentSlide].classList.add('active');
  }

  function nextSlide() { goToSlide(currentSlide + 1); }

  function startSlideshow() {
    slideTimer = setInterval(nextSlide, 4500);
  }

  function resetSlideshow() {
    clearInterval(slideTimer);
    startSlideshow();
  }

  heroDots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.dataset.slide));
      resetSlideshow();
    });
  });

  startSlideshow();

  /* ══════════════════════════════════════════
     5. GALLERY LIGHTBOX
  ══════════════════════════════════════════ */
  // Collect all image srcs from gallery
  const galleryImgs = Array.from(galleryItems).map(gi => gi.querySelector('img').src);
  let currentGalleryIdx = 0;

  function openLightbox(idx) {
    currentGalleryIdx = idx;
    lbImg.src = galleryImgs[idx];
    lbCount.textContent = (idx + 1) + ' / ' + galleryImgs.length;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    // Clear src after transition to free memory
    setTimeout(() => { if (!lightbox.classList.contains('open')) lbImg.src = ''; }, 350);
  }

  function showGalleryImg(idx) {
    currentGalleryIdx = (idx + galleryImgs.length) % galleryImgs.length;
    lbImg.style.opacity = '0';
    setTimeout(() => {
      lbImg.src = galleryImgs[currentGalleryIdx];
      lbCount.textContent = (currentGalleryIdx + 1) + ' / ' + galleryImgs.length;
      lbImg.style.opacity = '1';
    }, 120);
  }

  // Add transition to lb img
  if (lbImg) lbImg.style.transition = 'opacity .15s ease';

  galleryItems.forEach((gi, i) => {
    gi.addEventListener('click', () => openLightbox(i));
  });

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', () => showGalleryImg(currentGalleryIdx - 1));
  lbNext.addEventListener('click', () => showGalleryImg(currentGalleryIdx + 1));

  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   showGalleryImg(currentGalleryIdx - 1);
    if (e.key === 'ArrowRight')  showGalleryImg(currentGalleryIdx + 1);
  });

  // Touch swipe support
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      dx < 0 ? showGalleryImg(currentGalleryIdx + 1) : showGalleryImg(currentGalleryIdx - 1);
    }
  });

  /* ══════════════════════════════════════════
     6. SMOOTH ANCHOR SCROLL (accounts for nav)
  ══════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = header.offsetHeight + 12;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    });
  });

  /* ══════════════════════════════════════════
     7. SCROLL REVEAL
  ══════════════════════════════════════════ */
  const revealTargets = document.querySelectorAll(
    '.acard, .centre-card, .life-card, .prog-card, ' +
    '.sel-step, .c-stat, .ncard, .gi, .contact-card, ' +
    '.stat, .carla-about p, .carla-selection'
  );

  // Set initial hidden state
  revealTargets.forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger delay for grid children
    const parent = el.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(c => c.classList.contains('reveal') || c === el);
      const idx = Array.from(parent.children).indexOf(el);
      el.style.transitionDelay = Math.min(idx * 0.06, 0.35) + 's';
    }
  });

  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  function revealCheck() {
    revealTargets.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 30) {
        el.classList.add('visible');
      }
    });
  }

  revealTargets.forEach(el => revealObs.observe(el));
  revealCheck(); // Run immediately for above-fold items

  /* ══════════════════════════════════════════
     8. STATS COUNTER
  ══════════════════════════════════════════ */
  const statsBar = document.querySelector('.stats-bar');
  let counted = false;

  const statsObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !counted) {
      counted = true;
      document.querySelectorAll('.stat strong').forEach(el => {
        const raw = el.textContent.trim();
        const match = raw.match(/^(\d+)/);
        if (!match) return;
        const target = parseInt(match[1]);
        const suffix = raw.slice(match[1].length);
        const dur = 1400;
        const start = performance.now();
        function tick(now) {
          const p = Math.min((now - start) / dur, 1);
          const v = Math.round((1 - Math.pow(1 - p, 3)) * target);
          el.textContent = v + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }
  }, { threshold: 0.5 });

  if (statsBar) statsObs.observe(statsBar);

  console.log('✅ Mettaloka Youth Centre — loaded');
  console.log('🏠 Est. 2003 · Brotherhood · Discipline · Learning');

})();
