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
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Clear previous messages
            formMessage.textContent = '';
            formMessage.className = 'form-message';
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitButton.disabled = true;

            try {
                const formData = new FormData(contactForm);
                const response = await fetch('/send_email', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();
                
                // Show success/error message with animation
                formMessage.textContent = data.message;
                formMessage.className = `form-message ${data.success ? 'success' : 'error'}`;
                formMessage.style.display = 'block';
                formMessage.style.opacity = '0';
                formMessage.style.transform = 'translateY(-10px)';
                
                // Trigger animation
                setTimeout(() => {
                    formMessage.style.opacity = '1';
                    formMessage.style.transform = 'translateY(0)';
                }, 10);

                if (data.success) {
                    contactForm.reset();
                    
                    // Scroll message into view smoothly
                    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            } catch (error) {
                console.error('Error:', error);
                formMessage.textContent = 'An error occurred. Please try again later.';
                formMessage.className = 'form-message error';
                formMessage.style.display = 'block';
            } finally {
                // Restore button state
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;

                // Hide message after 5 seconds
                setTimeout(() => {
                    formMessage.style.opacity = '0';
                    formMessage.style.transform = 'translateY(-10px)';
                    setTimeout(() => {
                        formMessage.style.display = 'none';
                    }, 300);
                }, 5000);
            }
        });
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

