/* ============================================================
   MECASERVICES – Main interactions
   ============================================================ */

/* ── Sticky header ─────────────────────────────────────────── */
const header = document.getElementById('site-header');

function onScroll() {
  const scrolled = window.scrollY > 40;
  header.classList.toggle('scrolled', scrolled);
  document.getElementById('back-to-top').classList.toggle('visible', window.scrollY > 500);
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ── Mobile nav ────────────────────────────────────────────── */
const navToggle = document.getElementById('nav-toggle');
const mainNav   = document.getElementById('main-nav');

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

// Close nav on link click
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ── Scroll animations ─────────────────────────────────────── */
const aosEls = document.querySelectorAll('[data-aos]');

const aosObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        aosObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

aosEls.forEach(el => aosObserver.observe(el));

/* ── Products tab switcher ─────────────────────────────────── */
const categoryItems = document.querySelectorAll('.category-item');
const productPanels = document.querySelectorAll('.product-panel');

categoryItems.forEach(item => {
  item.addEventListener('click', () => {
    const target = item.dataset.cat;

    categoryItems.forEach(i => i.classList.remove('active'));
    productPanels.forEach(p => p.classList.remove('active'));

    item.classList.add('active');
    const panel = document.getElementById('cat-' + target);
    if (panel) panel.classList.add('active');
  });
});

/* ── Open now indicator ────────────────────────────────────── */
function checkOpenNow() {
  const openNow = document.getElementById('open-now');
  if (!openNow) return;

  // Brussels timezone (Belgium)
  const now = new Date();
  const bxl = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Brussels' }));
  const day  = bxl.getDay(); // 0 = Sunday
  const hMin = bxl.getHours() * 60 + bxl.getMinutes();

  const inRange = (start, end) => hMin >= start && hMin < end;

  // Lun-Ven: 8h30-12h & 13h-18h  |  Sam: 8h30-12h30
  let open = false;
  if (day >= 1 && day <= 5) {
    open = inRange(8 * 60 + 30, 12 * 60) || inRange(13 * 60, 18 * 60);
  } else if (day === 6) {
    open = inRange(8 * 60 + 30, 12 * 60 + 30);
  }

  const openText = openNow.querySelector('.open-text');
  openNow.classList.toggle('is-open',   open);
  openNow.classList.toggle('is-closed', !open);
  openText.textContent = open ? 'Ouvert maintenant' : 'Fermé actuellement';
}

checkOpenNow();

/* ── Smooth active nav highlight ───────────────────────────── */
const sections   = document.querySelectorAll('section[id]');
const navLinks   = document.querySelectorAll('.main-nav a[href^="#"]');

const navObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      navLinks.forEach(link => {
        const href = link.getAttribute('href').slice(1);
        link.style.color = href === id ? 'var(--orange)' : '';
      });
    });
  },
  { threshold: 0.4, rootMargin: '-10% 0px -60% 0px' }
);

sections.forEach(s => navObserver.observe(s));
