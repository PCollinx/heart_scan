import "../main.css";
import "../main.scss";
import "./style.css";

document.addEventListener("DOMContentLoaded", () => {
  // load navbar and footer components
  function loadComponent(id, url, callback) {
    fetch(url)
      .then((res) => res.text())
      .then((html) => {
        document.getElementById(id).innerHTML = html;
        if (callback) callback();
      });
  }

  loadComponent("footer", "/src/components/footer.html");
  loadComponent("navbar", "/src/components/navbar.html", () => {
    const menuToggle = document.getElementById("menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    const menuIcon = document.getElementById("menu-icon");

    if (menuToggle && mobileMenu && menuIcon) {
      menuToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        const isHidden = mobileMenu.classList.contains("hidden");

        mobileMenu.classList.toggle("hidden");

        // Toggle icon between menu and close
        if (isHidden) {
          menuIcon.textContent = "close";
          menuToggle.setAttribute("aria-expanded", "true");
        } else {
          menuIcon.textContent = "menu";
          menuToggle.setAttribute("aria-expanded", "false");
        }
      });

      // Close menu when clicking outside
      document.addEventListener("click", (e) => {
        if (
          !mobileMenu.classList.contains("hidden") &&
          !mobileMenu.contains(e.target) &&
          !menuToggle.contains(e.target)
        ) {
          mobileMenu.classList.add("hidden");
          menuIcon.textContent = "menu";
          menuToggle.setAttribute("aria-expanded", "false");
        }
      });

      // Close menu when clicking on a menu link
      const menuLinks = mobileMenu.querySelectorAll("a");
      menuLinks.forEach((link) => {
        link.addEventListener("click", () => {
          mobileMenu.classList.add("hidden");
          menuIcon.textContent = "menu";
          menuToggle.setAttribute("aria-expanded", "false");
        });
      });
    } else {
      console.error("Menu toggle, mobile menu, or menu icon not found");
    }

    // Load carousel functionality
    if (window.innerWidth <= 768) {
      import("./js/carousel.js");
    }
  });

  const tabs = document.querySelectorAll(".operations__tab");
  const tabsContainer = document.querySelector(".operations__tab-container");
  const tabsContent = document.querySelectorAll(".operations__content");

  // TAB Section

  function handleTabClick(e) {
    const clicked = e.target.closest(".operations__tab");
    if (!clicked) return;
    tabs.forEach((tab) => tab.classList.remove("operations__tab--active"));
    tabsContent.forEach((content) =>
      content.classList.remove("operations__content--active")
    );
    console.log(clicked);

    clicked.classList.add("operations__tab--active");
    document
      .querySelector(`.operations__content--${clicked.dataset.tab}`)
      .classList.add("operations__content--active");
  }
  if (tabsContainer) {
    tabsContainer.addEventListener("click", handleTabClick);
  } else {
    console.log("Tabs container not found");
  }

  document.querySelectorAll(".content-container .question").forEach((q) => {
    q.addEventListener("click", function () {
      const container = this.parentElement;
      container.classList.toggle("active");
    });
  });

  // === IMAGE CAROUSEL ===
  const track = document.getElementById("carousel-track");
  if (track) {
    let index = 0;
    const totalSlides = 3;
    let autoSlideInterval = null;
    const autoSlideDuration = 4000; // 4 seconds
    let isAutoPlaying = true;

    console.log("Image carousel initialized");

    function updateCarousel() {
      const translateX = -(index * 33.333333);
      track.style.transform = `translateX(${translateX}%)`;
      console.log(`Image slide ${index}, translateX: ${translateX}%`);

      // Update dots
      document.querySelectorAll(".dots .dots__dot").forEach((dot, i) => {
        dot.classList.toggle("dots__dot--active", i === index);
      });
    }

    function nextSlide() {
      index = (index + 1) % totalSlides;
      updateCarousel();
    }

    function prevSlide() {
      index = (index - 1 + totalSlides) % totalSlides;
      updateCarousel();
    }

    function startAutoSlide() {
      autoSlideInterval = setInterval(nextSlide, autoSlideDuration);
    }

    function stopAutoSlide() {
      if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        isAutoPlaying = false;
      }
    }

    function restartAutoSlide() {
      stopAutoSlide();
      setTimeout(() => {
        startAutoSlide();
        isAutoPlaying = true;
      }, 1000);
    }

    // Image carousel buttons
    document.getElementById("carousel-prev")?.addEventListener("click", () => {
      prevSlide();
      restartAutoSlide();
    });

    document.getElementById("carousel-next")?.addEventListener("click", () => {
      nextSlide();
      restartAutoSlide();
    });

    // Pause on hover
    const carousel = document.getElementById("carousel");
    if (carousel) {
      carousel.addEventListener("mouseenter", stopAutoSlide);
      carousel.addEventListener("mouseleave", () => {
        if (!isAutoPlaying) {
          startAutoSlide();
          isAutoPlaying = true;
        }
      });
    }

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    if (carousel) {
      carousel.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoSlide();
      });

      carousel.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        restartAutoSlide();
      });
    }

    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          // Swiped left - next slide
          nextSlide();
        } else {
          // Swiped right - previous slide
          prevSlide();
        }
      }
    }

    // Create dots for image carousel
    const dotContainer = document.querySelector(".dots");
    if (dotContainer) {
      dotContainer.innerHTML = "";
      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement("button");
        dot.className = `dots__dot ${i === 0 ? "dots__dot--active" : ""}`;
        dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
        dot.addEventListener("click", () => {
          index = i;
          updateCarousel();
          restartAutoSlide();
        });
        dotContainer.appendChild(dot);
      }
    }

    // Start auto-slide
    startAutoSlide();
    updateCarousel();
  }

  // === OPERATIONS CAROUSEL (Mobile) ===
  // Import the operations carousel only on mobile
  if (window.innerWidth <= 768) {
    import("./js/carousel.js").then((module) => {
      console.log("Operations carousel loaded for mobile");
    });
  }
});
