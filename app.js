const savedTheme = localStorage.getItem("fsar-theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const themeButton = document.querySelector(".theme-toggle");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".nav-links");
const revealItems = document.querySelectorAll(".reveal");

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

setTheme(savedTheme || (prefersDark ? "dark" : "light"));

themeButton.addEventListener("click", () => {
  setTheme(
    document.documentElement.dataset.theme === "dark" ? "light" : "dark",
  );
});

menuButton.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", isOpen);
  menuButton.textContent = isOpen ? "Close" : "Menu";
});

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
