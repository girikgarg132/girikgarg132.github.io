/**
 * Girik Garg - Portfolio Interactive Logic
 * Features: Day/Night Mode, Scrollspy Active Tab Highlight, Project Filter, Copy Email
 */

document.addEventListener('DOMContentLoaded', () => {
  initDayNightMode();
  initScrollspy();
  initProjectFilters();
  initCopyEmail();
  initMobileNav();
  initSmoothScroll();
  initContactForm();
});

/* ==========================================================================
   1. DAY / NIGHT MODE (Default: Night / Dark)
   ========================================================================== */
function initDayNightMode() {
  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  // Default is 'dark' (night mode)
  const savedTheme = localStorage.getItem('girik_theme') || 'dark';

  applyTheme(savedTheme);

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      try {
        localStorage.setItem('girik_theme', newTheme);
      } catch (err) {
        console.warn('LocalStorage access blocked:', err);
      }
    });
  });

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  // Cross-tab synchronization
  window.addEventListener('storage', (e) => {
    if (e.key === 'girik_theme' && e.newValue) {
      applyTheme(e.newValue);
    }
  });
}

/* ==========================================================================
   2. SCROLLSPY (Highlight Current Tab in Top Header)
   ========================================================================== */
function initScrollspy() {
  const navLinks = document.querySelectorAll('.nav-links .nav-link');
  const sections = document.querySelectorAll('section[id], header[id]');

  if (!navLinks.length || !sections.length) return;

  function updateActiveTab() {
    const scrollPosition = window.pageYOffset + 120; // Offset for header

    let currentSectionId = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    // If at the very top of the page, default to #hero
    if (window.pageYOffset < 100) {
      currentSectionId = 'hero';
    }

    // If reached bottom of page, highlight contact
    if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 50) {
      currentSectionId = 'contact';
    }

    if (currentSectionId) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${currentSectionId}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  }

  window.addEventListener('scroll', updateActiveTab, { passive: true });
  updateActiveTab(); // Run once on page load
}

/* ==========================================================================
   3. PROJECT CATEGORY FILTER
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   4. COPY EMAIL TO CLIPBOARD
   ========================================================================== */
function initCopyEmail() {
  const copyBtns = document.querySelectorAll('.btn-copy-email');
  const toast = document.getElementById('toast-notice');

  copyBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = 'girikgarg1@gmail.com';

      try {
        await navigator.clipboard.writeText(email);
        
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Email Copied!';

        if (toast) {
          toast.classList.add('active');
          setTimeout(() => {
            toast.classList.remove('active');
          }, 3200);
        }

        setTimeout(() => {
          btn.innerHTML = originalHtml;
        }, 3500);
      } catch (err) {
        window.location.href = `mailto:${email}`;
      }
    });
  });
}

/* ==========================================================================
   5. MOBILE NAVIGATION
   ========================================================================== */
function initMobileNav() {
  const toggle = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const isOpen = navLinks.classList.contains('active');
    toggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
  });
}

/* ==========================================================================
   6. SMOOTH SCROLLING
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '#top') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 84;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ==========================================================================
   7. CONTACT FORM SUBMISSION (Web3Forms AJAX)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const submitBtn = document.getElementById('form-submit-btn');

  if (!form || !status || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Verify hCaptcha challenge completion
    const hCaptchaResponse = form.querySelector('[name="h-captcha-response"]')?.value;
    if (!hCaptchaResponse) {
      status.textContent = 'Please complete the hCaptcha verification challenge above.';
      status.className = 'form-status error';
      status.style.display = 'block';
      return;
    }

    const originalBtnContent = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    status.style.display = 'none';
    status.className = 'form-status';

    try {
      const formData = new FormData(form);
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        status.textContent = "Thank you! Your message has been sent successfully. I'll get back to you soon.";
        status.className = 'form-status success';
        status.style.display = 'block';
        form.reset();
        if (typeof hcaptcha !== 'undefined') {
          try { hcaptcha.reset(); } catch (err) {}
        }
      } else {
        status.textContent = data.message || 'Something went wrong. Please complete the captcha and try again.';
        status.className = 'form-status error';
        status.style.display = 'block';
        if (typeof hcaptcha !== 'undefined') {
          try { hcaptcha.reset(); } catch (err) {}
        }
      }
    } catch (err) {
      status.textContent = 'Network error. Please try again or email directly at girikgarg1@gmail.com.';
      status.className = 'form-status error';
      status.style.display = 'block';
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnContent;
    }
  });
}
