(() => {
  const carousel = document.querySelector("[data-carousel]");
  if (!carousel) return;

  const slides = [...carousel.querySelectorAll("[data-slide]")];
  const dots = [...carousel.querySelectorAll("[data-carousel-dot]")];
  const previous = carousel.querySelector("[data-carousel-prev]");
  const next = carousel.querySelector("[data-carousel-next]");
  let activeIndex = 0;
  let timer;

  function showSlide(index) {
    activeIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeIndex;
      slide.hidden = !isActive;
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    dots.forEach((dot, dotIndex) => {
      dot.setAttribute("aria-selected", String(dotIndex === activeIndex));
    });
  }

  function stopRotation() {
    window.clearInterval(timer);
  }

  function startRotation() {
    stopRotation();
    timer = window.setInterval(() => showSlide(activeIndex + 1), 6500);
  }

  previous?.addEventListener("click", () => {
    showSlide(activeIndex - 1);
    startRotation();
  });

  next?.addEventListener("click", () => {
    showSlide(activeIndex + 1);
    startRotation();
  });

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener("click", () => {
      showSlide(dotIndex);
      startRotation();
    });
  });

  carousel.addEventListener("mouseenter", stopRotation);
  carousel.addEventListener("mouseleave", startRotation);
  carousel.addEventListener("focusin", stopRotation);
  carousel.addEventListener("focusout", (event) => {
    if (!carousel.contains(event.relatedTarget)) startRotation();
  });
  carousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      previous?.click();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      next?.click();
    }
  });

  showSlide(0);
  startRotation();
})();
