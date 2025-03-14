document.addEventListener('DOMContentLoaded', function() {
    // Header scroll animation
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            header.classList.add('sticky');
        } else if (currentScroll < lastScroll && currentScroll <= 100) {
            header.classList.remove('sticky');
        }
        
        lastScroll = currentScroll;
    });

    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 90;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollBy({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.querySelector('.form-message');

    if (contactForm) {
        // Real-time phone number validation
        const phoneInput = contactForm.querySelector('input[name="phone"]');
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 10) value = value.slice(0, 10);
            e.target.value = value;
        });

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const service = formData.get('service');
            const message = formData.get('message');
            
            // Enhanced validation
            if (!name || !email || !phone || !service || !message) {
                showFormMessage('Please fill in all required fields marked with *.', false);
                return;
            }
            
            if (name.length < 3) {
                showFormMessage('Please enter your full name.', false);
                return;
            }
            
            if (!isValidEmail(email)) {
                showFormMessage('Please enter a valid email address.', false);
                return;
            }
            
            if (phone.length !== 10) {
                showFormMessage('Please enter a valid 10-digit phone number.', false);
                return;
            }
            
            if (message.length < 10) {
                showFormMessage('Please provide more details in your message.', false);
                return;
            }
            
            // Show success message
            showFormMessage('Thank you for reaching out! Our team will contact you within 24 hours.', true);
            contactForm.reset();

            // Scroll the success message into view
            setTimeout(() => {
                formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        });

        // Add input validation styles
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('invalid', function(e) {
                e.preventDefault();
                this.classList.add('invalid');
            });

            input.addEventListener('input', function() {
                if (this.classList.contains('invalid')) {
                    this.classList.remove('invalid');
                }
            });
        });
    }
    
    function showFormMessage(text, isSuccess) {
        if (!formMessage) return;
        
        // Create icon element
        const icon = document.createElement('i');
        icon.className = isSuccess ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
        
        // Set message content with icon
        formMessage.innerHTML = '';
        formMessage.appendChild(icon);
        formMessage.appendChild(document.createTextNode(' ' + text));
        
        // Apply styles
        formMessage.className = `form-message ${isSuccess ? 'success' : 'error'}`;
        formMessage.style.display = 'block';
        formMessage.style.opacity = '0';
        formMessage.style.transform = 'translateY(-10px)';
        
        // Add animation
        requestAnimationFrame(() => {
            formMessage.style.opacity = '1';
            formMessage.style.transform = 'translateY(0)';
        });
        
        // Auto-hide message
        if (isSuccess) {
            setTimeout(() => {
                formMessage.style.opacity = '0';
                formMessage.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 300);
            }, 5000);
        }
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Animate elements on scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature-item, .service-item, .insight-card, .contact-card');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight - 50 && elementBottom > 0) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Initialize animation styles
    document.querySelectorAll('.feature-item, .service-item, .insight-card, .contact-card').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease';
    });

    // Add scroll event listener with throttling
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                animateOnScroll();
                scrollTimeout = null;
            }, 50);
        }
    });

    // Initial check for elements in view
    animateOnScroll();
});
