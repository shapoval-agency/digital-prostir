document.addEventListener('DOMContentLoaded', function () {
  const newsSwiper = new Swiper('.news-swiper', {
    slidesPerView: 'auto',
    spaceBetween: 24,
    freeMode: true,
    watchSlidesProgress: true,

    navigation: {
      nextEl: '.news-button-next',
      prevEl: '.news-button-prev',
    },

    loop: false,

    breakpoints: {
      320: {
        slidesPerView: 'auto',
        spaceBetween: 16,
      },

      1024: {
        slidesPerView: 'auto',
        spaceBetween: 48,
      },
    },

    on: {
      init: function () {
        console.log('Swiper initialized');
        updateButtonStates(this);
      },
      slideChange: function () {
        updateButtonStates(this);
      },
      reachBeginning: function () {
        console.log('Reached beginning');
      },
      reachEnd: function () {
        console.log('Reached end');
      },
    },
  });

  function updateButtonStates(swiper) {
    const prevButton = document.querySelector('.news-button-prev');
    const nextButton = document.querySelector('.news-button-next');

    if (prevButton && nextButton) {
      console.log('Is beginning:', swiper.isBeginning);
      console.log('Is end:', swiper.isEnd);
    }
  }
});
