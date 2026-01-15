// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Only process internal anchor links
            if (href === '#' || href.startsWith('#') && document.querySelector(href)) {
                e.preventDefault();
                
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Fade-in animation on scroll
    const fadeElements = document.querySelectorAll('.fade-in');
    const fadeInOnScroll = () => {
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    };

    // Add fade-in class to sections
    const sections = document.querySelectorAll('.content-section, .team-card, .approach-card, .contact-info, .contact-form, .update-item');
    sections.forEach(section => {
        section.classList.add('fade-in');
    });
    
    // Initial check for elements in viewport
    fadeInOnScroll();
    
    // Listen for scroll events
    window.addEventListener('scroll', fadeInOnScroll);

    // Header scroll effect
    const header = document.querySelector('.site-header');
    if (header) {
        let lastScrollTop = 0;

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;
            
            // Add shadow when scrolled
            if (scrollTop > 50) {
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = 'none';
            }
        });
    }

    // Add smooth hover effects to all buttons
    const buttons = document.querySelectorAll('.cta-button, .team-toggle');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-3px)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
        });
    });

    // Form handling for contact forms
    const handleFormSubmit = async (formId) => {
        const form = document.getElementById(formId);
        if (!form) return;
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            try {
                // Show loading state
                submitButton.textContent = 'Sending...';
                submitButton.disabled = true;
                submitButton.classList.add('loading');
                
                // Simulate API call
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Show success message
                alert('Thank you for your message. We will get back to you soon!');
                form.reset();
                
            } catch (error) {
                console.error('Error:', error);
                alert('Sorry, there was an error sending your message. Please try again.');
            } finally {
                // Reset button state
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                submitButton.classList.remove('loading');
            }
        });
    };

    // Initialize form handling if contact form exists
    handleFormSubmit('contactForm');

    // Add current year to copyright
    const copyrightElement = document.querySelector('.copyright');
    if (copyrightElement) {
        const currentYear = new Date().getFullYear();
        copyrightElement.innerHTML = `&copy; ${currentYear} Batai Capital Partners. All rights reserved.`;
    }

    // Handle page load animations
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Remove loading state if any
        const loadingElements = document.querySelectorAll('.loading');
        loadingElements.forEach(el => el.classList.remove('loading'));
    });

    // Active nav link highlighting
    const navLinksItems = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinksItems.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

// Global function for team bio toggles
function toggleBio(button) {
    const card = button.closest('.team-card');
    const details = card.querySelector('.bio-details');
    const toggleText = button.querySelector('.toggle-text');
    const toggleIcon = button.querySelector('.toggle-icon');
    
    details.classList.toggle('expanded');
    card.classList.toggle('expanded');
    
    if (details.classList.contains('expanded')) {
        toggleText.textContent = 'Show Less';
        toggleIcon.textContent = '↑';
    } else {
        toggleText.textContent = 'Show Full Profile';
        toggleIcon.textContent = '↓';
    }
}