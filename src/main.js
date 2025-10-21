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

    if (menuToggle && mobileMenu) {
      menuToggle.addEventListener("click", (e) => {
        e.stopPropagation();
        console.log("Menu toggle clicked");
        console.log("Menu current state:", mobileMenu.classList.contains("hidden") ? "hidden" : "visible");
        
        mobileMenu.classList.toggle("hidden");
        
        console.log("Menu new state:", mobileMenu.classList.contains("hidden") ? "hidden" : "visible");
      });
      
      // Close menu when clicking outside
      document.addEventListener("click", (e) => {
        if (
          !mobileMenu.classList.contains("hidden") &&
          !mobileMenu.contains(e.target) &&
          !menuToggle.contains(e.target)
        ) {
          console.log("Closing menu - clicked outside");
          mobileMenu.classList.add("hidden");
        }
      });
    } else {
      console.error("Menu toggle or mobile menu not found");
      console.log("menuToggle:", menuToggle);
      console.log("mobileMenu:", mobileMenu);
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
    const totalSlides = 3; // Hard-coded for now

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

    // Image carousel buttons
    document.getElementById("carousel-prev")?.addEventListener("click", () => {
      index = (index - 1 + totalSlides) % totalSlides;
      updateCarousel();
    });

    document.getElementById("carousel-next")?.addEventListener("click", () => {
      index = (index + 1) % totalSlides;
      updateCarousel();
    });

    // Create dots for image carousel
    const dotContainer = document.querySelector(".dots");
    if (dotContainer) {
      dotContainer.innerHTML = "";
      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement("button");
        dot.className = `dots__dot ${i === 0 ? "dots__dot--active" : ""}`;
        dot.addEventListener("click", () => {
          index = i;
          updateCarousel();
        });
        dotContainer.appendChild(dot);
      }
    }

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
