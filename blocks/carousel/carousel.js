export default function decorate(block) {
  const rows = [...block.children];

  // Carousel Config
  const variant = rows[0]?.textContent?.trim() || 'standard';
  const slidesDesktop = Number(rows[1]?.textContent?.trim()) || 1;
  const slidesMobile = Number(rows[2]?.textContent?.trim()) || 1;
  const autoplay = rows[3]?.textContent?.trim() === 'true';

  // Actual slides start after config rows
  const slides = rows.slice(4);

  block.innerHTML = '';

  block.classList.add(`carousel-${variant}`);

  const wrapper = document.createElement('div');
  wrapper.className = 'carousel-wrapper';

  const track = document.createElement('div');
  track.className = 'carousel-track';

  slides.forEach((slide) => {
    slide.classList.add('carousel-slide');
    track.append(slide);
  });

  const prevBtn = document.createElement('button');
  prevBtn.className = 'carousel-prev';
  prevBtn.setAttribute('aria-label', 'Previous Slide');
  prevBtn.innerHTML = '&#10094;';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'carousel-next';
  nextBtn.setAttribute('aria-label', 'Next Slide');
  nextBtn.innerHTML = '&#10095;';

  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'carousel-dots';

  slides.forEach((_, index) => {
    const dot = document.createElement('button');

    dot.className = 'carousel-dot';

    dot.addEventListener('click', () => {
      currentIndex = index;
      updateCarousel();
    });

    dotsContainer.append(dot);
  });

  wrapper.append(prevBtn);
  wrapper.append(track);
  wrapper.append(nextBtn);
  wrapper.append(dotsContainer);

  block.append(wrapper);

  let currentIndex = 0;
  let autoplayTimer;

  function getSlidesPerView() {
    if (window.innerWidth <= 768) {
      return slidesMobile;
    }

    return slidesDesktop;
  }

  function updateDots() {
    dotsContainer.querySelectorAll('.carousel-dot')
      .forEach((dot, index) => {
        dot.classList.toggle(
          'active',
          index === currentIndex,
        );
      });
  }

  function updateCarousel() {
    const slidesPerView = getSlidesPerView();

    track.style.transform =
      `translateX(-${(100 / slidesPerView) * currentIndex}%)`;

    updateDots();
  }

  prevBtn.addEventListener('click', () => {
    currentIndex =
      currentIndex === 0
        ? slides.length - 1
        : currentIndex - 1;

    updateCarousel();
  });

  nextBtn.addEventListener('click', () => {
    currentIndex =
      currentIndex === slides.length - 1
        ? 0
        : currentIndex + 1;

    updateCarousel();
  });

  // Swipe Support

  let startX = 0;

  track.addEventListener('touchstart', (event) => {
    startX = event.touches[0].clientX;
  });

  track.addEventListener('touchend', (event) => {
    const endX = event.changedTouches[0].clientX;

    if (startX - endX > 50) {
      nextBtn.click();
    }

    if (endX - startX > 50) {
      prevBtn.click();
    }
  });

  // Keyboard Support

  wrapper.tabIndex = 0;

  wrapper.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      prevBtn.click();
    }

    if (event.key === 'ArrowRight') {
      nextBtn.click();
    }
  });

  // Autoplay

  if (autoplay) {
    autoplayTimer = setInterval(() => {
      nextBtn.click();
    }, 5000);

    wrapper.addEventListener('mouseenter', () => {
      clearInterval(autoplayTimer);
    });

    wrapper.addEventListener('mouseleave', () => {
      autoplayTimer = setInterval(() => {
        nextBtn.click();
      }, 5000);
    });
  }

  window.addEventListener('resize', updateCarousel);

  updateCarousel();
}
