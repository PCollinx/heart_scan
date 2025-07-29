class OperationsCarousel {
  constructor() {
    this.currentSlide = 0;
    this.totalSlides = 3;
    this.autoSlideInterval = null;
    this.slideDuration = 5000; // 5 seconds
    this.isAutoPlaying = true;

    this.track = document.querySelector(".operations__carousel-track");
    this.indicators = document.querySelectorAll(".operations__indicator");
    this.progressBar = document.querySelector(".operations__progress-bar");

    this.init();
  }

  init() {
    if (!this.track) return;

    // Start auto-slide
    this.startAutoSlide();

    // Add indicator click handlers
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => {
        this.goToSlide(index);
        this.restartAutoSlide();
      });
    });

    // Pause on hover/touch
    const carousel = document.querySelector(".operations__carousel");
    if (carousel) {
      carousel.addEventListener("mouseenter", () => this.pauseAutoSlide());
      carousel.addEventListener("mouseleave", () => this.resumeAutoSlide());
      carousel.addEventListener("touchstart", () => this.pauseAutoSlide());
      carousel.addEventListener("touchend", () => this.resumeAutoSlide());
    }

    // Add swipe functionality
    this.addSwipeHandlers();
  }

  goToSlide(slideIndex) {
    this.currentSlide = slideIndex;
    const translateX = -slideIndex * 33.333;

    if (this.track) {
      this.track.style.transform = `translateX(${translateX}%)`;
    }

    // Update indicators
    this.updateIndicators();
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.goToSlide(this.currentSlide);
  }

  updateIndicators() {
    this.indicators.forEach((indicator, index) => {
      indicator.classList.toggle(
        "operations__indicator--active",
        index === this.currentSlide
      );
    });
  }

  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, this.slideDuration);
  }

  pauseAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.isAutoPlaying = false;
    }
  }

  resumeAutoSlide() {
    if (!this.isAutoPlaying) {
      this.startAutoSlide();
      this.isAutoPlaying = true;
    }
  }

  restartAutoSlide() {
    this.pauseAutoSlide();
    setTimeout(() => {
      this.startAutoSlide();
      this.isAutoPlaying = true;
    }, 1000);
  }

  addSwipeHandlers() {
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;

    const carousel = document.querySelector(".operations__carousel");
    if (!carousel) return;

    carousel.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });

    carousel.addEventListener("touchmove", (e) => {
      e.preventDefault(); // Prevent scrolling
    });

    carousel.addEventListener("touchend", (e) => {
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;

      const deltaX = endX - startX;
      const deltaY = endY - startY;

      // Only handle horizontal swipes
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          // Swiped right - go to previous slide
          this.currentSlide =
            (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        } else {
          // Swiped left - go to next slide
          this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        }
        this.goToSlide(this.currentSlide);
        this.restartAutoSlide();
      }
    });
  }
}

// Initialize carousel when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Only initialize on mobile screens
  if (window.innerWidth <= 768) {
    new OperationsCarousel();
  }
});

// Handle window resize
window.addEventListener("resize", () => {
  if (window.innerWidth <= 768 && !window.operationsCarousel) {
    window.operationsCarousel = new OperationsCarousel();
  }
});
