/**
 * Reiki with Freya - Main JavaScript
 * Handles interactivity for the site
 */

document.addEventListener('DOMContentLoaded', function() {
    // Set current year in the footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
  
    // Initialize components
    initMobileMenu();
    initAccordion();
    initScrollEffects();
    initContactForm();
  });
  
  /**
   * Mobile Menu Functionality
   */
  function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const primaryNav = document.querySelector('.primary-navigation');
    const navLinks = document.querySelectorAll('.nav-link');
  
    // Toggle menu when button is clicked
    if (menuToggle) {
      menuToggle.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        primaryNav.classList.toggle('active');
        
        // Update ARIA attributes
        document.body.classList.toggle('menu-open');
      });
    }
  
    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        if (menuToggle) {
          menuToggle.setAttribute('aria-expanded', 'false');
          primaryNav.classList.remove('active');
          document.body.classList.remove('menu-open');
        }
      });
    });
  
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (
        primaryNav && 
        primaryNav.classList.contains('active') && 
        !primaryNav.contains(event.target) && 
        !menuToggle.contains(event.target)
      ) {
        menuToggle.setAttribute('aria-expanded', 'false');
        primaryNav.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });
  }
  
  /**
   * Accordion Functionality for FAQ
   */
  function initAccordion() {
    const accordionTriggers = document.querySelectorAll('.accordion-trigger');
  
    accordionTriggers.forEach(trigger => {
      // Set initial state
      const content = document.getElementById(trigger.getAttribute('aria-controls'));
      if (trigger.getAttribute('aria-expanded') === 'true') {
        content.hidden = false;
      } else {
        content.hidden = true;
      }
  
      // Add click event
      trigger.addEventListener('click', function() {
        const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
        const content = document.getElementById(trigger.getAttribute('aria-controls'));
        
        // Toggle this accordion
        trigger.setAttribute('aria-expanded', !isExpanded);
        content.hidden = isExpanded;
  
        // Optional: close other accordions (uncomment for single-open behavior)
        /*
        accordionTriggers.forEach(otherTrigger => {
          if (otherTrigger !== trigger) {
            otherTrigger.setAttribute('aria-expanded', 'false');
            const otherContent = document.getElementById(otherTrigger.getAttribute('aria-controls'));
            otherContent.hidden = true;
          }
        });
        */
      });
    });
  }
  
  /**
   * Scroll Effects
   * - Smooth scrolling for anchor links
   * - Back to top button visibility
   * - Reveal animations for sections
   */
  function initScrollEffects() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const headerOffset = document.querySelector('.site-header').offsetHeight + 
                              document.querySelector('.primary-navigation').offsetHeight;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  
    // Back to top button
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
      window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
          backToTopButton.classList.add('visible');
        } else {
          backToTopButton.classList.remove('visible');
        }
      });
      
      backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  
    // Reveal animations for sections when scrolling
    const revealElements = document.querySelectorAll('.section');
    
    // Create intersection observer
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Optional: stop observing after revealing
          // revealObserver.unobserve(entry.target);
        }
      });
    }, {
      root: null, // viewport
      threshold: 0.1, // 10% of element visible
      rootMargin: '-50px'
    });
    
    // Observe each section
    revealElements.forEach(element => {
      revealObserver.observe(element);
      // Add initial hidden class
      element.classList.add('reveal-element');
    });
  }
  
  /**
   * Contact Form Validation and Submission
   */
  function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form fields
        const nameField = document.getElementById('name');
        const emailField = document.getElementById('email');
        const phoneField = document.getElementById('phone');
        const messageField = document.getElementById('message');
        
        // Basic validation
        let isValid = true;
        
        // Name validation
        if (!nameField.value.trim()) {
          showError(nameField, 'Please enter your name');
          isValid = false;
        } else {
          clearError(nameField);
        }
        
        // Email validation
        if (!emailField.value.trim()) {
          showError(emailField, 'Please enter your email');
          isValid = false;
        } else if (!isValidEmail(emailField.value)) {
          showError(emailField, 'Please enter a valid email address');
          isValid = false;
        } else {
          clearError(emailField);
        }
        
        // Message validation
        if (!messageField.value.trim()) {
          showError(messageField, 'Please enter your message');
          isValid = false;
        } else {
          clearError(messageField);
        }
        
        // If valid, simulate form submission
        if (isValid) {
          // Show loading state
          const submitButton = contactForm.querySelector('button[type="submit"]');
          const originalText = submitButton.textContent;
          submitButton.disabled = true;
          submitButton.textContent = 'Sending...';
          
          // Simulate API call/form submission
          setTimeout(function() {
            // Reset form
            contactForm.reset();
            
            // Show success message
            const formWrapper = contactForm.parentElement;
            const successMessage = document.createElement('div');
            successMessage.className = 'form-success-message';
            successMessage.innerHTML = `
              <div class="success-icon">✓</div>
              <h3>Thank You!</h3>
              <p>Your message has been sent successfully. I'll get back to you as soon as possible.</p>
            `;
            
            // Replace form with success message
            formWrapper.appendChild(successMessage);
            contactForm.style.display = 'none';
            
            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // After 5 seconds, restore the form
            setTimeout(function() {
              successMessage.remove();
              contactForm.style.display = 'grid';
              submitButton.disabled = false;
              submitButton.textContent = originalText;
            }, 5000);
          }, 1500);
        }
      });
    }
    
    // Helper functions for form validation
    function showError(inputElement, message) {
      // Clear any existing error
      clearError(inputElement);
      
      // Create error message
      const errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      errorElement.textContent = message;
      
      // Add error class to input
      inputElement.classList.add('input-error');
      
      // Insert error after input
      inputElement.parentNode.appendChild(errorElement);
    }
    
    function clearError(inputElement) {
      // Remove error class
      inputElement.classList.remove('input-error');
      
      // Remove any existing error message
      const errorElement = inputElement.parentNode.querySelector('.error-message');
      if (errorElement) {
        errorElement.remove();
      }
    }
    
    function isValidEmail(email) {
      // Simple email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }
  }
  
  // Add CSS classes for fade-in animations based on scroll position
  function addScrollAnimations() {
    // Get all elements to animate
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    // Function to check if element is in viewport
    function isInViewport(element) {
      const rect = element.getBoundingClientRect();
      return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
        rect.bottom >= 0
      );
    }
    
    // Function to add animation class
    function checkVisibility() {
      animateElements.forEach(element => {
        if (isInViewport(element)) {
          element.classList.add('animated');
        }
      });
    }
    
    // Initialize
    window.addEventListener('scroll', checkVisibility);
    window.addEventListener('resize', checkVisibility);
    
    // Check on initial load
    checkVisibility();
  }
  
  // Add smooth parallax effect to hero section
  function initParallaxEffect() {
    const heroSection = document.querySelector('.hero');
    
    if (heroSection) {
      window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset;
        const translateY = scrollPosition * 0.3; // Adjust the factor to control parallax intensity
        
        heroSection.style.backgroundPositionY = translateY + 'px';
      });
    }
  }
  
  // Initialize any additional features
  window.addEventListener('load', function() {
    addScrollAnimations();
    initParallaxEffect();
    
    // Add a class to body when page is fully loaded
    document.body.classList.add('page-loaded');
  });
