class OperationsCarousel {
  constructor() {
    this.currentSlide = 0;
    this.totalSlides = 3;
    this.autoSlideInterval = null;
    this.slideDuration = 5000; // 5 seconds
    this.isAutoPlaying = true;
    this.progressAnimationFrame = null;
    this.progressStartTime = null;

    this.track = document.querySelector(".operations__carousel-track");
    this.progressBar = document.querySelector(".operations__progress-bar");

    this.init();
  }

  init() {
    if (!this.track) {
      console.log("Operations carousel track not found");
      return;
    }

    console.log("Operations carousel initialized, starting auto-slide");

    // Start auto-slide and progress animation
    this.startAutoSlide();
    this.startProgressAnimation();

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

    // Reset progress bar
    this.resetProgressBar();
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.goToSlide(this.currentSlide);
  }

  startProgressAnimation() {
    if (!this.progressBar) return;

    this.progressStartTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - this.progressStartTime;
      const progress = Math.min((elapsed / this.slideDuration) * 100, 100);

      this.progressBar.style.transform = `translateX(-${100 - progress}%)`;

      if (progress < 100 && this.isAutoPlaying) {
        this.progressAnimationFrame = requestAnimationFrame(animate);
      }
    };

    this.progressAnimationFrame = requestAnimationFrame(animate);
  }

  resetProgressBar() {
    if (this.progressBar) {
      // Cancel any ongoing animation
      if (this.progressAnimationFrame) {
        cancelAnimationFrame(this.progressAnimationFrame);
      }

      // Reset to start
      this.progressBar.style.transform = "translateX(-100%)";

      // Restart animation if auto-playing
      if (this.isAutoPlaying) {
        this.startProgressAnimation();
      }
    }
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

      // Pause progress animation
      if (this.progressAnimationFrame) {
        cancelAnimationFrame(this.progressAnimationFrame);
      }
    }
  }

  resumeAutoSlide() {
    if (!this.isAutoPlaying) {
      this.startAutoSlide();
      this.isAutoPlaying = true;
      this.startProgressAnimation();
    }
  }

  restartAutoSlide() {
    this.pauseAutoSlide();
    setTimeout(() => {
      this.startAutoSlide();
      this.isAutoPlaying = true;
      this.resetProgressBar();
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

// Initialize carousel immediately when module loads
if (window.innerWidth <= 768) {
  new OperationsCarousel();
}

// Handle window resize
window.addEventListener("resize", () => {
  if (window.innerWidth <= 768 && !window.operationsCarousel) {
    window.operationsCarousel = new OperationsCarousel();
  }
});
