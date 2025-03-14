class Slider {
    constructor(sliderElement) {
        this.slider = sliderElement;
        this.slides = this.slider.querySelectorAll('.slide');
        this.currentSlide = 0;
        this.autoPlayInterval = null;
        this.isTransitioning = false;

        // Create navigation dots
        this.createDots();
        
        // Create navigation arrows
        this.createArrows();

        // Initialize the slider
        this.showSlide(0);
        
        // Start autoplay
        this.startAutoPlay();

        // Add touch support
        this.initTouchSupport();
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

        // Update slides
        this.slides[this.currentSlide].classList.remove('active');
        this.slides[index].classList.add('active');
        
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
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);

        // Pause on hover
        this.slider.addEventListener('mouseenter', () => {
            clearInterval(this.autoPlayInterval);
        });

        this.slider.addEventListener('mouseleave', () => {
            this.startAutoPlay();
        });
    }

    initTouchSupport() {
        let startX = 0;
        let diff = 0;

        this.slider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            clearInterval(this.autoPlayInterval);
        }, { passive: true });

        this.slider.addEventListener('touchmove', (e) => {
            if (startX === 0) return;
            diff = startX - e.touches[0].clientX;
        }, { passive: true });

        this.slider.addEventListener('touchend', () => {
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            startX = 0;
            diff = 0;
            this.startAutoPlay();
        });
    }
}

// Initialize all sliders on the page
document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.slider');
    sliders.forEach(slider => new Slider(slider));
});
