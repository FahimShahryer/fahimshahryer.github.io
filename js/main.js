/*==================== SHOW/HIDE MOBILE MENU ====================*/
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');

// Show menu when toggle button is clicked
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.add('show-menu');
  });
}

// Hide menu when close button is clicked
if (navClose) {
  navClose.addEventListener('click', () => {
    navMenu.classList.remove('show-menu');
  });
}

/*==================== REMOVE MOBILE MENU ON LINK CLICK ====================*/
const navLinks = document.querySelectorAll('.nav__link');

function linkAction() {
  const navMenu = document.getElementById('nav-menu');
  // When clicking on nav__link, remove the show-menu class
  navMenu.classList.remove('show-menu');
}

navLinks.forEach(link => link.addEventListener('click', linkAction));

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
// Get all sections that have an ID defined
const sections = document.querySelectorAll('section[id]');

// Add an event listener for scroll
function scrollActive() {
  const scrollY = window.pageYOffset;

  sections.forEach(current => {
    const sectionHeight = current.offsetHeight;
    const sectionTop = current.offsetTop - 100;
    const sectionId = current.getAttribute('id');
    const navLink = document.querySelector('.nav__link[href*=' + sectionId + ']');

    if (navLink) {
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLink.classList.add('active-link');
      } else {
        navLink.classList.remove('active-link');
      }
    }
  });
}

window.addEventListener('scroll', scrollActive);

/*==================== CHANGE HEADER BACKGROUND ON SCROLL ====================*/
function scrollHeader() {
  const header = document.getElementById('header');
  // When the scroll is greater than 80 viewport height, add scroll-header class
  if (this.scrollY >= 80) {
    header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
  } else {
    header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04)';
  }
}

window.addEventListener('scroll', scrollHeader);

/*==================== SHOW SCROLL UP BUTTON ====================*/
function scrollUp() {
  const scrollUp = document.getElementById('scroll-up');
  // When the scroll is higher than 560 viewport height, add show-scroll class
  if (this.scrollY >= 560) {
    scrollUp.classList.add('show-scroll');
  } else {
    scrollUp.classList.remove('show-scroll');
  }
}

window.addEventListener('scroll', scrollUp);

/*==================== SCROLL REVEAL ANIMATION ====================*/
// Fade in elements when they come into view
const fadeElements = document.querySelectorAll('.fade-in');

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Optional: stop observing after animation
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

fadeElements.forEach(element => {
  observer.observe(element);
});

/*==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================*/
// Smooth scrolling for all anchor links (already handled by CSS scroll-behavior, 
// but this provides fallback for older browsers)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    
    // Don't prevent default for scroll-up button or if href is just "#"
    if (href === '#' || href === '') {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return;
    }

    const target = document.querySelector(href);
    
    if (target) {
      e.preventDefault();
      const headerHeight = document.getElementById('header').offsetHeight;
      const targetPosition = target.offsetTop - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

/*==================== DARK/LIGHT THEME TOGGLE (OPTIONAL) ====================*/
// Create theme toggle button dynamically
function createThemeToggle() {
  const themeButton = document.createElement('div');
  themeButton.className = 'theme-toggle';
  themeButton.id = 'theme-toggle';
  themeButton.innerHTML = '<i class="fas fa-moon" id="theme-icon"></i>';
  themeButton.title = 'Toggle Dark Mode';
  document.body.appendChild(themeButton);
  
  return themeButton;
}

// Get or create theme toggle button
let themeButton = document.getElementById('theme-toggle');
if (!themeButton) {
  themeButton = createThemeToggle();
}

const themeIcon = document.getElementById('theme-icon');

// Previously selected theme (if user selected)
const selectedTheme = localStorage.getItem('selected-theme');
const selectedIcon = localStorage.getItem('selected-icon');

// Get current theme and icon
const getCurrentTheme = () => document.body.classList.contains('dark-theme') ? 'dark' : 'light';
const getCurrentIcon = () => themeIcon.classList.contains('fa-sun') ? 'fa-moon' : 'fa-sun';

// Validate if user previously chose a theme
if (selectedTheme) {
  document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove']('dark-theme');
  themeIcon.classList.add(selectedIcon === 'fa-moon' ? 'fa-moon' : 'fa-sun');
}

// Activate / deactivate theme with button
themeButton.addEventListener('click', () => {
  // Add or remove dark theme
  document.body.classList.toggle('dark-theme');
  
  // Toggle icon
  if (themeIcon.classList.contains('fa-moon')) {
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  } else {
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
  }
  
  // Save theme and icon that user chose
  localStorage.setItem('selected-theme', getCurrentTheme());
  localStorage.setItem('selected-icon', getCurrentIcon());
});

/*==================== TYPING EFFECT FOR HERO SUBTITLE (OPTIONAL) ====================*/
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.textContent = '';
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// Uncomment to activate typing effect
// const heroSubtitle = document.querySelector('.hero__subtitle');
// if (heroSubtitle) {
//   const originalText = heroSubtitle.textContent;
//   typeWriter(heroSubtitle, originalText, 80);
// }

/*==================== LOAD ANIMATION ON PAGE LOAD ====================*/
window.addEventListener('load', () => {
  // Add a small delay to ensure smooth initial animation
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
});

/*==================== PERFORMANCE: DEBOUNCE SCROLL EVENTS ====================*/
// Debounce function to limit how often scroll functions are called
function debounce(func, wait = 10, immediate = true) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Apply debounce to scroll functions for better performance
window.addEventListener('scroll', debounce(scrollActive));
window.addEventListener('scroll', debounce(scrollHeader));
window.addEventListener('scroll', debounce(scrollUp));

/*==================== COPY EMAIL TO CLIPBOARD (OPTIONAL) ====================*/
const emailLinks = document.querySelectorAll('a[href^="mailto:"]');

emailLinks.forEach(link => {
  // Add a small copy icon next to email links (optional)
  // link.innerHTML += ' <i class="fas fa-copy" style="font-size: 0.8em; margin-left: 0.25rem;"></i>';
  
  link.addEventListener('click', function(e) {
    // Optional: Also copy email to clipboard when clicked
    const email = this.getAttribute('href').replace('mailto:', '');
    
    if (navigator.clipboard) {
      // Show a brief tooltip or notification (you can customize this)
      // alert('Email copied to clipboard!');
    }
  });
});

/*==================== INITIALIZE ALL ANIMATIONS ====================*/
document.addEventListener('DOMContentLoaded', () => {
  console.log('Portfolio website loaded successfully!');
  
  // Initial call to set active link on page load
  scrollActive();
  
  // Set initial scroll up button state
  scrollUp();
  
  // Initial header state
  scrollHeader();
});

/*==================== PROJECT CARD TILT EFFECT (OPTIONAL ENHANCEMENT) ====================*/
// Add subtle tilt effect on project cards
const projectCards = document.querySelectorAll('.project__card');

projectCards.forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-8px) scale(1.02)';
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) scale(1)';
  });
});

/*==================== STATISTICS COUNTER ANIMATION (OPTIONAL) ====================*/
function animateCounter(element, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    element.textContent = value + (element.dataset.suffix || '');
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// Initialize counters when they come into view
const aboutBoxes = document.querySelectorAll('.about__box');
let countersAnimated = false;

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersAnimated) {
      countersAnimated = true;
      
      // Animate the counters
      const experienceCounter = document.querySelector('.about__box:nth-child(1) .about__box-title');
      const awardsCounter = document.querySelector('.about__box:nth-child(2) .about__box-title');
      const projectsCounter = document.querySelector('.about__box:nth-child(3) .about__box-title');
      
      if (experienceCounter) {
        experienceCounter.dataset.suffix = '+ Years';
        animateCounter(experienceCounter, 0, 2, 1500);
      }
      
      if (awardsCounter) {
        awardsCounter.dataset.suffix = '+';
        animateCounter(awardsCounter, 0, 7, 1500);
      }
      
      if (projectsCounter) {
        projectsCounter.dataset.suffix = '+';
        animateCounter(projectsCounter, 0, 6, 1500);
      }
    }
  });
}, { threshold: 0.5 });

aboutBoxes.forEach(box => counterObserver.observe(box));

/*==================== FORM VALIDATION (IF YOU ADD A CONTACT FORM) ====================*/
// Example form validation code (uncomment if you add a contact form)
/*
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Basic validation
    if (name === '' || email === '' || message === '') {
      alert('Please fill in all fields');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }
    
    // If validation passes, you can submit the form
    // For demo purposes, just show success message
    alert('Message sent successfully!');
    contactForm.reset();
  });
}
*/

/*==================== CONSOLE EASTER EGG ====================*/
console.log('%c👋 Hello, Developer!', 'color: #6366f1; font-size: 24px; font-weight: bold;');
console.log('%cLooking at the code? Feel free to reach out!', 'color: #06b6d4; font-size: 14px;');
console.log('%c📧 fhmshahryer@gmail.com', 'color: #475569; font-size: 12px;');