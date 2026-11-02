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
const contactForm = document.querySelector(".contact-form");

// Keep the mobile menu label in its closed state until the visitor opens it.
if (menuButton) {
  menuButton.textContent = "Menu";
}

if (contactForm) {
  const formFields = [
    {
      input: contactForm.elements.namedItem("name"),
      error: contactForm.querySelector("#contact-name-error"),
      touched: false,
      validate(input) {
        const value = input.value.trim();
        if (!value) return "Enter your name.";
        if (value.length < 2) {
          return "Enter at least 2 characters.";
        }
        if (value.length > 80) {
          return "Use no more than 80 characters.";
        }
        return "";
      },
    },
    {
      input: contactForm.elements.namedItem("email"),
      error: contactForm.querySelector("#contact-email-error"),
      touched: false,
      validate(input) {
        const value = input.value.trim();
        if (!value) return "Enter your email address.";
        if (input.validity.typeMismatch) {
          return "Enter a valid email address.";
        }
        if (value.length > 254) {
          return "Use an email address under 255 characters.";
        }
        return "";
      },
    },
    {
      input: contactForm.elements.namedItem("subject"),
      error: contactForm.querySelector("#contact-subject-error"),
      touched: false,
      validate(input) {
        return input.value ? "" : "Select an enquiry type.";
      },
    },
    {
      input: contactForm.elements.namedItem("message"),
      error: contactForm.querySelector("#contact-message-error"),
      touched: false,
      validate(input) {
        const value = input.value.trim();
        if (!value) return "Enter a message.";
        if (value.length < 20) {
          return "Your message must be at least 20 characters.";
        }
        if (value.length > 2000) {
          return "Keep your message under 2,000 characters.";
        }
        return "";
      },
    },
  ];
  const formStatus = contactForm.querySelector(".form-status");
  let hasSubmitted = false;

  function validateField(field) {
    const errorMessage = field.validate(field.input);
    field.error.textContent = errorMessage;
    field.input.setAttribute("aria-invalid", String(Boolean(errorMessage)));
    return !errorMessage;
  }

  formFields.forEach((field) => {
    field.input.addEventListener("blur", () => {
      field.touched = true;
      validateField(field);
    });
    field.input.addEventListener("input", () => {
      if (hasSubmitted || field.touched) validateField(field);
      formStatus.textContent = "";
      formStatus.dataset.state = "";
    });
    field.input.addEventListener("change", () => {
      if (hasSubmitted || field.touched) validateField(field);
      formStatus.textContent = "";
      formStatus.dataset.state = "";
    });
  });

  contactForm.addEventListener("reset", () => {
    hasSubmitted = false;
    formStatus.textContent = "";
    formStatus.dataset.state = "";
    formFields.forEach((field) => {
      field.touched = false;
      field.error.textContent = "";
      field.input.removeAttribute("aria-invalid");
    });
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    hasSubmitted = true;
    const invalidFields = formFields.filter(
      (field) => !validateField(field),
    );

    if (invalidFields.length) {
      formStatus.textContent =
        "Please correct the highlighted fields before continuing.";
      formStatus.dataset.state = "error";
      invalidFields[0].input.focus();
      return;
    }

    formStatus.textContent =
      "Your details pass validation. No message was sent; please email hello@freestateanimalrescue.org.";
    formStatus.dataset.state = "notice";
  });
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

  const galleryTriggers = [...document.querySelectorAll(".gallery-trigger")];
  const lightbox = document.querySelector(".lightbox");

  if (lightbox && galleryTriggers.length) {
    const lightboxImage = lightbox.querySelector(".lightbox-image");
    const lightboxCaption = lightbox.querySelector(".lightbox-caption");
    const lightboxPosition = lightbox.querySelector(".lightbox-position");
    const closeButton = lightbox.querySelector(".lightbox-close");
    const previousButton = lightbox.querySelector(".lightbox-previous");
    const nextButton = lightbox.querySelector(".lightbox-next");
    let currentImageIndex = 0;
    let galleryOpener = null;

    function showGalleryImage(index) {
      currentImageIndex =
        (index + galleryTriggers.length) % galleryTriggers.length;
      const trigger = galleryTriggers[currentImageIndex];
      const image = trigger.querySelector("img");
      const caption = trigger.nextElementSibling;

      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
      lightboxCaption.textContent = caption.textContent;
      lightboxPosition.textContent =
        `${currentImageIndex + 1} of ${galleryTriggers.length}`;
    }

    galleryTriggers.forEach((trigger, index) => {
      trigger.addEventListener("click", () => {
        galleryOpener = trigger;
        showGalleryImage(index);
        lightbox.showModal();
        closeButton.focus();
      });
    });

    closeButton.addEventListener("click", () => lightbox.close());
    previousButton.addEventListener("click", () => {
      showGalleryImage(currentImageIndex - 1);
    });
    nextButton.addEventListener("click", () => {
      showGalleryImage(currentImageIndex + 1);
    });

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        lightbox.close();
      }
    });

    lightbox.addEventListener("close", () => {
      galleryOpener?.focus();
      galleryOpener = null;
    });

    lightbox.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        showGalleryImage(currentImageIndex - 1);
      } else if (event.key === "ArrowRight") {
        showGalleryImage(currentImageIndex + 1);
      }
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
    "assets/img5.webp",
    "assets/img3.webp",
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

// Rotate stories only when a carousel is present and motion is allowed.
const storyCarousel = document.querySelector(".story-carousel");
if (storyCarousel && carouselSlides.length && !prefersReducedMotion) {
  setInterval(() => {
    if (!document.hidden && !storyCarousel.matches(":hover, :focus-within")) {
      showSlide(currentSlide + 1);
    }
  }, 5000);
}

// Reveal text as it enters view without adding nested animations.
const textSelector =
  "main :is(h1, h2, h3, h4, h5, h6, p, blockquote, cite, a, button, span, strong, li), footer :is(p, a, span)";
const textItems = [...document.querySelectorAll(textSelector)].filter(
  (item) => !item.parentElement.closest(textSelector),
);

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
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
  textItems.forEach((item) => {
    item.classList.add("text-reveal");
    revealObserver.observe(item);
  });
}
