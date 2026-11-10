/**
 * Sakshi Revaje — Personal Portfolio Interactions
 * Modern, accessible, zero-dependency vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Mobile Drawer Navigation Toggle
  // --------------------------------------------------------------------------
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navbar = document.getElementById('navbar');

  if (hamburger && navMenu) {
    const toggleMenu = () => {
      const isOpen = navMenu.classList.toggle('open');
      hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    const closeMenu = () => {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', toggleMenu);

    // Close menu when clicking any nav link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close menu on click outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && navMenu.classList.contains('open')) {
        closeMenu();
      }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 2. Navbar Background Blur on Scroll & Active Section Highlighting
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');

  const onScroll = () => {
    // Navbar glass effect intensify on scroll
    if (window.scrollY > 40) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Back to top button visibility
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }

    // Scroll spy for active nav link
    const scrollPosition = window.scrollY + 120;
    let currentId = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initialize on load

  // Back to top click handler
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --------------------------------------------------------------------------
  // 3. Dynamic Typewriter Animation for Hero Section
  // --------------------------------------------------------------------------
  const typewriterElement = document.getElementById('typewriterText');
  const roles = [
    'Software Engineer',
    'Java Developer',
    'Full Stack Developer',
    'AI/ML Enthusiast'
  ];

  if (typewriterElement) {
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    const typeRole = () => {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 45;
      } else {
        typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 90;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        // Pause at the end of the full word
        isDeleting = true;
        typingSpeed = 1800;
      } else if (isDeleting && charIndex === 0) {
        // Switch to the next role
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 400;
      }

      setTimeout(typeRole, typingSpeed);
    };

    // Kick off typing animation after slight initial pause
    setTimeout(typeRole, 600);
  }

  // --------------------------------------------------------------------------
  // 4. Scroll Reveal Animations (IntersectionObserver)
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // --------------------------------------------------------------------------
  // 5. Event Photographs Lightbox (Strictly for Real Event Photos)
  // --------------------------------------------------------------------------
  const galleryItems = document.querySelectorAll('.event-gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxSub = document.getElementById('lightboxSub');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentGalleryIndex = 0;

  const updateLightboxContent = (index) => {
    if (!galleryItems.length) return;
    currentGalleryIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[currentGalleryIndex];
    const img = item.querySelector('img');
    const caption = item.getAttribute('data-caption') || img.alt;
    const sub = item.getAttribute('data-sub') || '';

    if (lightboxImg && lightboxCaption && lightboxSub) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = caption;
      lightboxSub.textContent = sub;
    }
  };

  const openLightbox = (index) => {
    updateLightboxContent(index);
    lightbox?.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox?.classList.remove('open');
    document.body.style.overflow = '';
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index);
      }
    });
    // Ensure keyboard accessibility
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `View ${item.getAttribute('data-caption') || 'Event image'}`);
  });

  if (lightbox) {
    lightboxClose?.addEventListener('click', closeLightbox);

    lightboxPrev?.addEventListener('click', (e) => {
      e.stopPropagation();
      updateLightboxContent(currentGalleryIndex - 1);
    });

    lightboxNext?.addEventListener('click', (e) => {
      e.stopPropagation();
      updateLightboxContent(currentGalleryIndex + 1);
    });

    // Close when clicking backdrop
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;

      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') updateLightboxContent(currentGalleryIndex - 1);
      if (e.key === 'ArrowRight') updateLightboxContent(currentGalleryIndex + 1);
    });
  }

  // --------------------------------------------------------------------------
  // 6. Validated Contact Form Submission
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('formSubmitBtn');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contactName');
      const emailInput = document.getElementById('contactEmail');
      const subjectInput = document.getElementById('contactSubject');
      const messageInput = document.getElementById('contactMessage');

      const name = nameInput?.value.trim() || '';
      const email = emailInput?.value.trim() || '';
      const subject = subjectInput?.value.trim() || '';
      const message = messageInput?.value.trim() || '';

      // Validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || name.length < 2) {
        showStatus('Please enter your full name (at least 2 characters).', 'error');
        nameInput?.focus();
        return;
      }

      if (!email || !emailRegex.test(email)) {
        showStatus('Please enter a valid email address.', 'error');
        emailInput?.focus();
        return;
      }

      if (!subject || subject.length < 3) {
        showStatus('Please enter a brief subject for your message.', 'error');
        subjectInput?.focus();
        return;
      }

      if (!message || message.length < 10) {
        showStatus('Please enter a message with at least 10 characters.', 'error');
        messageInput?.focus();
        return;
      }

      // Compose prefilled mailto email for reliable direct communication
      const mailtoUrl = `mailto:revajesakshi@gmail.com?subject=${encodeURIComponent(
        `[Portfolio Inquiry] ${subject} - from ${name}`
      )}&body=${encodeURIComponent(
        `Hi Sakshi,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\nSent via Portfolio Website`
      )}`;

      showStatus(
        'Opening your email client to send your message directly to revajesakshi@gmail.com...',
        'success'
      );

      // Open email client
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 500);

      contactForm.reset();
    });

    function showStatus(text, type) {
      formStatus.textContent = text;
      formStatus.className = `form-status ${type}`;
      formStatus.style.display = 'block';

      if (type === 'success') {
        setTimeout(() => {
          formStatus.style.display = 'none';
        }, 7000);
      }
    }
  }
});
