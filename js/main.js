/**
 * Travelzer Photobook - Main Application Logic
 * Handles interactive features and page behavior
 */

// ========================================
// UTILITIES
// ========================================

/**
 * Smoothly scroll to an element
 * @param {string} selector - CSS selector of target element
 */
function scrollToElement(selector) {
  const element = document.querySelector(selector);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean}
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.left <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// ========================================
// NAVIGATION & SCROLL BEHAVIOR
// ========================================

const NavigationModule = {
  init() {
    this.bindEvents();
    this.setupScrollTracking();
  },

  bindEvents() {
    // Handle smooth scrolling for internal links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (link && link.getAttribute('href') !== '#') {
        e.preventDefault();
        const target = link.getAttribute('href');
        scrollToElement(target);
      }
    });
  },

  setupScrollTracking() {
    window.addEventListener('scroll', () => {
      this.updateActiveSection();
    }, { passive: true });
  },

  updateActiveSection() {
    const sections = document.querySelectorAll('[data-section]');
    const scrollPos = window.scrollY + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        this.setActiveSection(section.dataset.section);
      }
    });
  },

  setActiveSection(sectionName) {
    // Can be used to update UI based on active section
    document.documentElement.style.setProperty('--active-section', `"${sectionName}"`);
  },
};

// ========================================
// HERO SECTION ANIMATIONS
// ========================================

const HeroModule = {
  init() {
    this.cacheDOM();
    this.setupIntersectionObserver();
  },

  cacheDOM() {
    this.$hero = document.querySelector('.hero');
    this.$content = document.querySelector('.hero__content');
    this.$image = document.querySelector('.hero__image');
  },

  setupIntersectionObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.animateHeroContent();
          observer.unobserve(entry.target);
        }
      });
    }, options);

    if (this.$hero) {
      observer.observe(this.$hero);
    }
  },

  animateHeroContent() {
    if (!this.$content) return;

    // Add animation classes or trigger animations
    this.$content.style.opacity = '1';
    this.$content.style.animation = 'fadeInUp 0.8s ease-out';
  },
};

// ========================================
// SPEC CARDS INTERACTION
// ========================================

const SpecCardsModule = {
  init() {
    this.cacheDOM();
    this.bindEvents();
  },

  cacheDOM() {
    this.$specCards = document.querySelectorAll('.spec-card');
  },

  bindEvents() {},
};

// ========================================
// BUTTON INTERACTIONS
// ========================================

const ButtonModule = {
  init() {
    this.cacheDOM();
    this.bindEvents();
  },

  cacheDOM() {
    this.$buttons = document.querySelectorAll('.button');
  },

  bindEvents() {
    this.$buttons.forEach((button) => {
      button.addEventListener('click', (e) => this.handleButtonClick(e, button));
    });
  },

  handleButtonClick(e, button) {
    // Add ripple effect or other interactions
    this.createRipple(e, button);
  },

  createRipple(e, button) {
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add('ripple');

    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  },
};

// ========================================
// LAZY LOADING IMAGES
// ========================================

const LazyLoadModule = {
  init() {
    this.setupIntersectionObserver();
  },

  setupIntersectionObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: '50px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, options);

    document.querySelectorAll('img[data-src]').forEach((img) => {
      observer.observe(img);
    });
  },

  loadImage(img) {
    const src = img.getAttribute('data-src');
    if (src) {
      img.addEventListener('load', () => {
        img.classList.add('loaded');
      });
      img.src = src;
    }
  },
};

// ========================================
// TIMELINE ANIMATION
// ========================================

const TimelineModule = {
  init() {
    this.cacheDOM();
    this.setupIntersectionObserver();
  },

  cacheDOM() {
    this.$timeline = document.querySelector('.timeline');
    this.$timelineItems = document.querySelectorAll('.timeline-item');
  },

  setupIntersectionObserver() {
    const options = {
      threshold: 0.3,
      rootMargin: '0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.animateTimelineItems();
          observer.unobserve(entry.target);
        }
      });
    }, options);

    if (this.$timeline) {
      observer.observe(this.$timeline);
    }
  },

  animateTimelineItems() {
    this.$timelineItems.forEach((item, index) => {
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.animation = 'slideIn 0.6s ease-out';
      }, index * 100);
    });
  },
};

// ========================================
// PAGE INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  NavigationModule.init();
  HeroModule.init();
  SpecCardsModule.init();
  ButtonModule.init();
  LazyLoadModule.init();
  TimelineModule.init();

  // Log initialization complete
  console.log('Travelzer Photobook initialized');
});

// Handle dynamic content loading
window.addEventListener('load', () => {
  // All resources loaded
  document.body.classList.add('loaded');
});

// Keyboard accessibility
document.addEventListener('keydown', (e) => {
  // Close modals or handle escape key if needed
  if (e.key === 'Escape') {
    console.log('Escape key pressed');
  }
});
