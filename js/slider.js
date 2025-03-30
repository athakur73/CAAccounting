class Slider {
    constructor(sliderElement) {
        this.slider = sliderElement;
        this.slides = this.slider.querySelectorAll('.slide');
        this.currentSlide = 0;
        this.autoPlayInterval = null;
        this.isTransitioning = false;

        // Create navigation elements
        this.createDots();
        this.createArrows();

        // Initialize the slider
        this.showSlide(0);
        
        // Start autoplay
        this.startAutoPlay();

        // Add touch support
        this.initTouchSupport();

        // Add keyboard navigation
        this.initKeyboardNavigation();

        // Add intersection observer for performance
        this.initIntersectionObserver();
    }

    createDots() {
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'slider-dots';
        
        for (let i = 0; i < this.slides.length; i++) {
            const dot = document.createElement('button');
            dot.className = 'slider-dot';
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => this.showSlide(i));
            dotsContainer.appendChild(dot);
        }
        
        this.slider.appendChild(dotsContainer);
        this.dots = dotsContainer.querySelectorAll('.slider-dot');
    }

    createArrows() {
        const prevButton = document.createElement('button');
        prevButton.className = 'slider-arrow slider-arrow-prev';
        prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevButton.setAttribute('aria-label', 'Previous slide');
        
        const nextButton = document.createElement('button');
        nextButton.className = 'slider-arrow slider-arrow-next';
        nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextButton.setAttribute('aria-label', 'Next slide');
        
        prevButton.addEventListener('click', () => this.prevSlide());
        nextButton.addEventListener('click', () => this.nextSlide());
        
        this.slider.appendChild(prevButton);
        this.slider.appendChild(nextButton);
    }

    showSlide(index) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        // Update slides with smooth transitions
        const currentSlide = this.slides[this.currentSlide];
        const nextSlide = this.slides[index];

        // Reset any ongoing animations
        currentSlide.style.transition = 'none';
        nextSlide.style.transition = 'none';

        // Set initial positions
        if (index > this.currentSlide) {
            nextSlide.style.transform = 'translateX(100%) scale(0.95)';
        } else {
            nextSlide.style.transform = 'translateX(-100%) scale(0.95)';
        }

        // Force reflow
        void nextSlide.offsetWidth;

        // Add transitions back
        currentSlide.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        nextSlide.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';

        // Animate slides
        currentSlide.style.transform = index > this.currentSlide ? 
            'translateX(-100%) scale(0.95)' : 'translateX(100%) scale(0.95)';
        currentSlide.style.opacity = '0';
        
        nextSlide.style.transform = 'translateX(0) scale(1)';
        nextSlide.style.opacity = '1';

        // Update active classes
        currentSlide.classList.remove('active');
        nextSlide.classList.add('active');
        
        // Update dots
        this.dots[this.currentSlide].classList.remove('active');
        this.dots[index].classList.add('active');
        
        this.currentSlide = index;

        // Reset transition lock after animation completes
        setTimeout(() => {
            this.isTransitioning = false;
        }, 600);
    }

    nextSlide() {
        const next = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(next);
    }

    prevSlide() {
        const prev = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(prev);
    }

    startAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }

        this.autoPlayInterval = setInterval(() => {
            if (document.hidden) return;
            this.nextSlide();
        }, 5000);

        // Pause on hover
        this.slider.addEventListener('mouseenter', () => {
            clearInterval(this.autoPlayInterval);
        });

        this.slider.addEventListener('mouseleave', () => {
            this.startAutoPlay();
        });

        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                clearInterval(this.autoPlayInterval);
            } else {
                this.startAutoPlay();
            }
        });
    }

    initTouchSupport() {
        let startX = 0;
        let startY = 0;
        let diff = 0;
        let isScrolling = false;

        this.slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isScrolling = false;
            clearInterval(this.autoPlayInterval);
        }, { passive: true });

        this.slider.addEventListener('touchmove', (e) => {
            if (startX === 0) return;

            const touchX = e.touches[0].clientX;
            const touchY = e.touches[0].clientY;
            const diffX = startX - touchX;
            const diffY = startY - touchY;

            // Determine if scrolling or swiping
            if (!isScrolling) {
                isScrolling = Math.abs(diffY) > Math.abs(diffX);
            }

            if (!isScrolling) {
                e.preventDefault();
                diff = diffX;
            }
        }, { passive: false });

        this.slider.addEventListener('touchend', () => {
            if (!isScrolling && Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            startX = 0;
            startY = 0;
            diff = 0;
            this.startAutoPlay();
        });
    }

    initKeyboardNavigation() {
        this.slider.setAttribute('tabindex', '0');
        this.slider.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });
    }

    initIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    clearInterval(this.autoPlayInterval);
                } else {
                    this.startAutoPlay();
                }
            });
        }, { threshold: 0.5 });

        observer.observe(this.slider);
    }
}

// Initialize all sliders on the page
document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.slider');
    sliders.forEach(slider => new Slider(slider));
});
