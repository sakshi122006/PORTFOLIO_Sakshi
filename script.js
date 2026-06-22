// Hamburger menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Active nav link highlight
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 80) current = s.id; });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--teal)' : '';
  });
});

// Gallery filter tabs
const galleryTabs = document.querySelectorAll('.gallery-tab');
const galleryItems = document.querySelectorAll('.gallery-item');

galleryTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    galleryTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    galleryItems.forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.classList.remove('hidden');
        item.style.position = 'relative';
      } else {
        item.classList.add('hidden');
        setTimeout(() => { item.style.position = 'absolute'; }, 400);
      }
    });
  });
});

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
let currentLightboxIndex = 0;

function getVisibleItems() {
  return [...document.querySelectorAll('.gallery-item:not(.hidden)')];
}

document.querySelectorAll('.gallery-img-wrap').forEach(wrap => {
  wrap.addEventListener('click', () => {
    const item = wrap.closest('.gallery-item');
    const visible = getVisibleItems();
    currentLightboxIndex = visible.indexOf(item);
    openLightbox(wrap);
  });
});

function openLightbox(wrap) {
  const img = wrap.querySelector('img');
  const overlay = wrap.querySelector('.gallery-overlay span');
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightboxCaption.textContent = overlay ? overlay.textContent : img.alt;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function navigateLightbox(direction) {
  const visible = getVisibleItems();
  if (!visible.length) return;
  currentLightboxIndex = (currentLightboxIndex + direction + visible.length) % visible.length;
  const wrap = visible[currentLightboxIndex].querySelector('.gallery-img-wrap');
  const img = wrap.querySelector('img');
  const overlay = wrap.querySelector('.gallery-overlay span');
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightboxCaption.textContent = overlay ? overlay.textContent : img.alt;
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); navigateLightbox(-1); });
lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); navigateLightbox(1); });

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navigateLightbox(-1);
  if (e.key === 'ArrowRight') navigateLightbox(1);
});
