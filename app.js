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
    "assets/img3.webp",
    "assets/img4.webp",
    "assets/img8.webp",
    "assets/01a11d44-3dff-7805-84d6-dbd1a8834df9.webp",
    "assets/0730ed05-a826-48e7-b827-04d94a116dd9.webp",
    "assets/2561c06c-457a-4f0e-bf22-1d27da4777f3.webp",
    "assets/48a990d6-b2a4-4482-8109-9bfe2165ba18.webp",
    "assets/978bc179-6991-4a57-9c80-9edee441767c.webp",
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

  // Load only the selected, compressed photo so unused candidates cost nothing.
  const brandSplash = document.createElement("div");
  brandSplash.className = "brand-splash";
  brandSplash.setAttribute("aria-hidden", "true");
  const splashImageElement = document.createElement("img");
  splashImageElement.className = "brand-splash-image is-active";
  splashImageElement.src = splashImage;
  splashImageElement.alt = "";
  splashImageElement.loading = "eager";
  splashImageElement.decoding = "async";
  splashImageElement.fetchPriority = "high";

  const splashText = document.createElement("div");
  splashText.className = "brand-splash-text";
  const splashName = document.createElement("strong");
  splashName.textContent = "Animal Rescue";
  splashText.append("Free State", document.createElement("br"), splashName);

  brandSplash.append(splashImageElement, splashText);
  document.body.append(brandSplash);

  window.setTimeout(
    () => brandSplash.remove(),
    prefersReducedMotion ? 600 : 3000,
  );
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
