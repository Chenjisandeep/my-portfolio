// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const menuToggle = document.querySelector('.menu-toggle');
const navLinksContainer = document.querySelector('.nav-links-container');
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const currentYearElement = document.getElementById('currentYear');
const backToTopBtn = document.getElementById('backToTop');

// ATS Keywords for better scanning (hidden from view but readable by ATS)
const atsKeywords = [
    "Java Developer", "Software Developer", "Computer Science Student", 
    "Web Development", "OOP", "Object-Oriented Programming", "SQL", 
    "MySQL", "HTML5", "CSS3", "JavaScript", "Git", "GitHub", 
    "Problem Solving", "Data Structures", "Algorithms", "Entry Level",
    "Software Engineering", "Full Stack Developer", "Backend Developer",
    "Frontend Developer", "Responsive Design", "REST APIs", "Debugging",
    "Code Review", "Version Control", "Eclipse", "VS Code", "Python"
];

// Create hidden ATS keywords section (for ATS parsing only)
function createATSSection() {
    const atsSection = document.createElement('div');
    atsSection.id = 'ats-keywords';
    atsSection.style.cssText = 'position: absolute; width: 0; height: 0; overflow: hidden; opacity: 0;';
    atsSection.innerHTML = atsKeywords.join(', ');
    document.body.appendChild(atsSection);
}

// Smooth scrolling for navigation links with better performance
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        // Close mobile menu if open
        if (navLinksContainer.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navLinksContainer.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
        
        // Scroll to target section with offset for fixed header
        const headerHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Update active nav link
        updateActiveNavLink(targetId);
        
        // Update URL without page reload (for bookmarking)
        history.pushState(null, null, targetId);
    });
});

// Update active nav link on scroll with throttling
let scrollTimeout;
window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        const scrollPosition = window.scrollY + 150;
        
        // Get all sections
        const sections = document.querySelectorAll('section');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = `#${sectionId}`;
            }
        });
        
        if (currentSection) {
            updateActiveNavLink(currentSection);
        }
        
        // Show/hide back to top button
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }, 100);
});

// Update active nav link function
function updateActiveNavLink(id) {
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === id) {
            link.classList.add('active');
        }
    });
}

// Mobile menu toggle with accessibility
menuToggle.addEventListener('click', function() {
    const isExpanded = this.getAttribute('aria-expanded') === 'true';
    this.classList.toggle('active');
    navLinksContainer.classList.toggle('active');
    this.setAttribute('aria-expanded', !isExpanded);
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.navbar') && navLinksContainer.classList.contains('active')) {
        menuToggle.classList.remove('active');
        navLinksContainer.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
    }
});

// Back to top functionality
backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Enhanced contact form validation
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Reset previous errors
    resetFormErrors();
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    let isValid = true;
    
    // Validate name (ATS-friendly format)
    if (name === '') {
        showError('nameError', 'Name is required');
        isValid = false;
    } else if (name.length < 2) {
        showError('nameError', 'Name must be at least 2 characters');
        isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(name)) {
        showError('nameError', 'Please enter a valid name');
        isValid = false;
    }
    
    // Validate email
    if (email === '') {
        showError('emailError', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('emailError', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate message (ensure it's professional)
    if (message === '') {
        showError('messageError', 'Message is required');
        isValid = false;
    } else if (message.length < 20) {
        showError('messageError', 'Message should be at least 20 characters');
        isValid = false;
    } else if (message.length > 1000) {
        showError('messageError', 'Message should not exceed 1000 characters');
        isValid = false;
    }
    
    // If form is valid, show success message
    if (isValid) {
        // In a real application, you would send the form data to a server here
        const formData = {
            name: name,
            email: email,
            message: message,
            timestamp: new Date().toISOString(),
            source: 'Portfolio Website'
        };
        
        console.log('Form submitted:', formData);
        
        // Show success message
        formSuccess.style.display = 'block';
        
        // Reset form
        contactForm.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            formSuccess.style.display = 'none';
        }, 5000);
        
        // Log for ATS/recruiter analytics (in production, send to analytics)
        logFormSubmission(formData);
    }
});

// Helper function to validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Helper function to show error message
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    
    // Highlight the input with error
    const inputId = elementId.replace('Error', '');
    const inputElement = document.getElementById(inputId);
    inputElement.style.borderColor = 'var(--error-color)';
    inputElement.focus();
}

// Helper function to reset form errors
function resetFormErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
    });
    
    const inputs = document.querySelectorAll('.form-group input, .form-group textarea');
    inputs.forEach(input => {
        input.style.borderColor = '';
    });
}

// Animate skill bars on scroll with intersection observer
function animateSkillBars() {
    const skillLevels = document.querySelectorAll('.skill-level-bar');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillLevel = entry.target;
                const width = skillLevel.style.width;
                skillLevel.style.width = '0%';
                
                // Animate to the full width with delay
                setTimeout(() => {
                    skillLevel.style.width = width;
                }, 300);
                
                // Stop observing after animation
                observer.unobserve(skillLevel);
            }
        });
    }, { 
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    });
    
    skillLevels.forEach(skillLevel => {
        observer.observe(skillLevel);
    });
}

// Log form submissions (for analytics in production)
function logFormSubmission(data) {
    // In production, send to analytics service
    const submissionLog = {
        event: 'contact_form_submission',
        data: {
            ...data,
            userAgent: navigator.userAgent,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            timestamp: new Date().toISOString()
        }
    };
    
    console.log('Form submission logged:', submissionLog);
    
    // Example: Send to Google Analytics (if implemented)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'contact_form_submit', {
            'event_category': 'engagement',
            'event_label': 'Contact Form'
        });
    }
}

// Track important user interactions (for recruiter analytics)
function setupAnalyticsTracking() {
    // Track project link clicks
    document.querySelectorAll('.project-link').forEach(link => {
        link.addEventListener('click', function() {
            const projectName = this.closest('.project-card').querySelector('h3').textContent;
            console.log(`Project viewed: ${projectName}`);
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'project_view', {
                    'event_category': 'engagement',
                    'event_label': projectName
                });
            }
        });
    });
    
    // Track resume downloads
    document.querySelectorAll('a[download]').forEach(link => {
        link.addEventListener('click', function() {
            console.log('Resume downloaded');
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'resume_download', {
                    'event_category': 'engagement',
                    'event_label': 'Resume'
                });
            }
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize ATS keywords section
    createATSSection();
    
    // Initialize animations
    animateSkillBars();
    
    // Set current year in footer
    const year = new Date().getFullYear();
    if (currentYearElement) {
        currentYearElement.textContent = year;
    }
    
    // Update copyright year in meta tags
    document.querySelector('meta[name="copyright"]')?.setAttribute('content', year);
    
    // Setup analytics tracking
    setupAnalyticsTracking();
    
    // Add click event to close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinksContainer.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navLinksContainer.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
    
    // Set initial aria-expanded for menu toggle
    menuToggle.setAttribute('aria-expanded', 'false');
    
    // Print-friendly styles (for recruiters who might print)
    const printStyles = `
        @media print {
            .navbar, .hero-buttons, .contact-form, .back-to-top, .footer-links {
                display: none !important;
            }
            
            body {
                font-size: 12pt !important;
                line-height: 1.4 !important;
            }
            
            .container {
                max-width: 100% !important;
                padding: 0 !important;
            }
            
            section {
                padding: 20px 0 !important;
                page-break-inside: avoid;
            }
            
            .section-title {
                font-size: 18pt !important;
            }
            
            a {
                color: #000 !important;
                text-decoration: none !important;
            }
            
            a[href]:after {
                content: " (" attr(href) ")";
                font-size: 10pt;
            }
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = printStyles;
    document.head.appendChild(styleSheet);
    
    // Lazy load images if any (future-proofing)
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    }
});