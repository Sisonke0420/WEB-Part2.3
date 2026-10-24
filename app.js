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
    "assets/img1.webp",
    "assets/img2.webp",
    "assets/img3.webp",
    "assets/img4.webp",
    "assets/img7.webp",
    "assets/img8.webp",
    "assets/img9.webp",
    "assets/01a11d44-3dff-7805-84d6-dbd1a8834df9.webp",
    "assets/0730ed05-a826-48e7-b827-04d94a116dd9.webp",
    "assets/0c654706-576b-448f-b944-b1dd0fedf1f7.webp",
    "assets/2561c06c-457a-4f0e-bf22-1d27da4777f3.webp",
    "assets/48a990d6-b2a4-4482-8109-9bfe2165ba18.webp",
    "assets/7b433de7-e805-475d-9184-12751e55cbb4.webp",
    "assets/978bc179-6991-4a57-9c80-9edee441767c.webp",
    "assets/ddd0ac9e-b99f-4385-9ff8-bd66fe962e2d.webp",
  ];
  const previousSplashImage = localStorage.getItem("fsar-splash-image");
  const availableSplashImages = splashImages.filter(
    (image) => image !== previousSplashImage,
  );
  const splashImage =
    availableSplashImages[
      Math.floor(Math.random() * availableSplashImages.length)
    ];
  localStorage.setItem("fsar-splash-image", splashImage);

  const brandSplash = document.createElement("div");
  brandSplash.className = "brand-splash";
  brandSplash.setAttribute("aria-hidden", "true");
  const splashImageElement = document.createElement("img");
  splashImageElement.className = "brand-splash-image";
  splashImageElement.src = splashImage;
  splashImageElement.alt = "";
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
    prefersReducedMotion ? 600 : 3600,
  );
}

themeButton.addEventListener("click", () => {
  setTheme(
    document.documentElement.dataset.theme === "dark" ? "light" : "dark",
  );
});

menuButton.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  // Reflect the expanded state for assistive technology.
  menuButton.setAttribute("aria-expanded", isOpen);
  menuButton.textContent = isOpen ? "Close" : "Menu";
});

carouselButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const direction = button.dataset.direction === "next" ? 1 : -1;
    showSlide(currentSlide + direction);
  });
});

// Automatically advance stories every five seconds.
setInterval(() => {
  showSlide(currentSlide + 1);
}, 5000);

// Reveal each section when it enters the viewport, then stop observing it.
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
