document.addEventListener('DOMContentLoaded', function () {
  const suitabilitySwiper = new Swiper('.course-suitability-swiper', {
    slidesPerView: 'auto',
    spaceBetween: 16,
    freeMode: true,
    watchSlidesProgress: true,
    loop: false,
    navigation: {
      nextEl: '.course-suitability-button-next',
      prevEl: '.course-suitability-button-prev',
    },
    breakpoints: {
      320: {
        slidesPerView: 'auto',
        spaceBetween: 16,
      },

      1280: {
        slidesPerView: 'auto',
        spaceBetween: 24,
      },
    },
    on: {
      init: function () {
        updateSuitabilityButtons(this);
      },
      slideChange: function () {
        updateSuitabilityButtons(this);
      },
    },
  });

  function updateSuitabilityButtons(swiper) {
    const prev = document.querySelector('.course-suitability-button-prev');
    const next = document.querySelector('.course-suitability-button-next');

    if (prev && next) {
      // console.log('begin:', swiper.isBeginning, 'end:', swiper.isEnd);
    }
  }
});
