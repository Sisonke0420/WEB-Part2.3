const savedTheme = localStorage.getItem("fsar-theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const themeButton = document.querySelector(".theme-toggle");
const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const revealItems = document.querySelectorAll(".reveal");
const carouselButtons = document.querySelectorAll(".carousel-button");
const carouselSlides = document.querySelectorAll(".carousel-slide");

// Keep the mobile menu label in its closed state until the visitor opens it.
if (menuButton) {
  menuButton.textContent = "Menu";
}

let currentSlide = 0;

// Wrap around at either end so the carousel never reaches a dead end.
function showSlide(index) {
  if (!carouselSlides.length) return;

  currentSlide = (index + carouselSlides.length) % carouselSlides.length;

  carouselSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === currentSlide);
  });
}

// Apply the selected theme and keep the control's accessible label in sync.
function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("fsar-theme", theme);
  themeButton.setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
  );
  themeButton.querySelector(".theme-label").textContent =
    theme === "dark" ? "Light mode" : "Dark mode";
}

// Prefer the saved choice; otherwise follow the device's colour preference.
setTheme(savedTheme || (prefersDark ? "dark" : "light"));

// Show the intro only on the first page opened in this browser tab.
if (!sessionStorage.getItem("fsar-splash-shown")) {
  sessionStorage.setItem("fsar-splash-shown", "true");

  const splashImages = [
    "assets/0c654706-576b-448f-b944-b1dd0fedf1f7.webp",
    "assets/7b433de7-e805-475d-9184-12751e55cbb4.webp",
    "assets/86db576d-3039-4e82-baec-675c3b9e48ce.webp",
    "assets/ddd0ac9e-b99f-4385-9ff8-bd66fe962e2d.webp",
    "assets/f2f98d22-ff01-4025-868e-61c88e61260b.webp",
    "assets/img1.webp",
    "assets/img2.webp",
    "assets/img5.webp",
    "assets/img6.webp",
    "assets/img7.webp",
    "assets/img9.webp",
  ];
  // Avoid showing the same splash photo as the previous browser session.
  const previousSplashImage = localStorage.getItem("fsar-splash-image");
  const availableSplashImages = splashImages.filter(
    (image) => image !== previousSplashImage,
  );
  const splashImage =
    availableSplashImages[
      Math.floor(Math.random() * availableSplashImages.length)
    ];
  localStorage.setItem("fsar-splash-image", splashImage);

  // Load only the selected photo so unused candidates cost nothing.
  const brandSplash = document.createElement("div");
  brandSplash.className = "brand-splash";
  brandSplash.setAttribute("aria-hidden", "true");
  const splashImageElement = document.createElement("img");
  splashImageElement.className = "brand-splash-image is-active";
  splashImageElement.src = splashImage;
  splashImageElement.alt = "";
  splashImageElement.loading = "eager";
  splashImageElement.decoding = "async";
  splashImageElement.fetchPriority = "low";

  const splashText = document.createElement("div");
  splashText.className = "brand-splash-text";
  const splashName = document.createElement("strong");
  splashName.textContent = "Animal Rescue";
  splashText.append("Free State", document.createElement("br"), splashName);

  brandSplash.append(splashImageElement, splashText);
  document.body.append(brandSplash);

  if (prefersReducedMotion) {
    brandSplash.remove();
  } else {
    window.setTimeout(() => brandSplash.remove(), 1200);
  }
}

// Toggle between the visitor's saved theme and its opposite.
themeButton.addEventListener("click", () => {
  setTheme(
    document.documentElement.dataset.theme === "dark" ? "light" : "dark",
  );
});

menuButton.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  // Keep the button label and accessible state aligned with the menu.
  menuButton.setAttribute("aria-expanded", isOpen);
  menuButton.textContent = isOpen ? "Close" : "Menu";
});

carouselButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // The control's direction determines whether to advance or go back.
    const direction = button.dataset.direction === "next" ? 1 : -1;
    showSlide(currentSlide + direction);
  });
});

// Automatically advance stories every five seconds.
setInterval(() => {
  showSlide(currentSlide + 1);
}, 5000);

// Reveal sections as they enter view, then unobserve them to avoid repeat work.
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

revealItems.forEach((item) => revealObserver.observe(item));
