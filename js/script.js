/* ============================================================
   WARUNG BIRU LANGIT — Interaksi: Slider, Filter Menu, Navbar
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  /* ---------------- NAVBAR ---------------- */
  const navbar   = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  const sections  = document.querySelectorAll('section[id], header[id]');
  const linkEls   = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > 40);
  }, { passive: true });

  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', open);
  });

  // Sorot link aktif saat scroll
  const spy = () => {
    const pos = window.scrollY + 120;
    let currentId = 'beranda';
    sections.forEach((sec) => {
      if (sec.offsetTop <= pos) currentId = sec.id;
    });
    linkEls.forEach((a) => {
      a.classList.toggle('is-active', a.getAttribute('href') === `#${currentId}`);
    });
  };
  window.addEventListener('scroll', spy, { passive: true });
  spy();

  /* ---------------- SLIDER ---------------- */
  const slider  = document.getElementById('slider');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsBox = document.getElementById('sliderDots');

  const slides  = [...slider.children];
  const total   = slides.length;
  let index     = 0;
  let timer     = null;
  const AUTOPLAY_MS = 4500;

  // Bangun titik navigasi
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'slider-dot';
    dot.setAttribute('aria-label', `Ke slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsBox.appendChild(dot);
  });
  const dots = [...dotsBox.children];

  function goTo(i) {
    index = (i + total) % total;
    slider.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, k) => d.classList.toggle('is-active', k === index));
  }

  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  prevBtn.addEventListener('click', () => { prev(); restart(); });
  nextBtn.addEventListener('click', () => { next(); restart(); });

  function start()  { timer = setInterval(next, AUTOPLAY_MS); }
  function stop()   { if (timer) clearInterval(timer); }
  function restart(){ stop(); start(); }

  // Jeda autoplay saat disentuh/hover
  const wrap = document.querySelector('.slider-wrap');
  wrap.addEventListener('mouseenter', stop);
  wrap.addEventListener('mouseleave', start);
  wrap.addEventListener('touchstart', stop, { passive: true });
  wrap.addEventListener('touchend', restart, { passive: true });

  // Dukungan geser (swipe) di HP
  let touchX = 0;
  wrap.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  wrap.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) (dx < 0 ? next() : prev());
    restart();
  }, { passive: true });

  // Keyboard panah kiri/kanan
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { next(); restart(); }
    if (e.key === 'ArrowLeft')  { prev(); restart(); }
  });

  goTo(0);
  start();

  /* ---------------- FILTER MENU ---------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.menu-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const filter = btn.dataset.filter;
      cards.forEach((card) => {
        const show = filter === 'semua' || card.dataset.category === filter;
        card.style.display = show ? '' : 'none';
        if (show) {
          // mainkan ulang animasi kecil
          card.style.animation = 'none';
          void card.offsetWidth;
          card.style.animation = '';
        }
      });
    });
  });
});