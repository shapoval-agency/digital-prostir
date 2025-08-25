document.addEventListener('DOMContentLoaded', function () {
  // Инициализация Swiper для новостей
  const newsSwiper = new Swiper('.news-swiper', {
    // Основные параметры
    slidesPerView: 'auto',
    spaceBetween: 24,
    freeMode: true,
    watchSlidesProgress: true,

    // Навигация
    navigation: {
      nextEl: '.news-button-next',
      prevEl: '.news-button-prev',
    },

    // Отключаем loop чтобы кнопки правильно дизейблились
    loop: false,

    // Брейкпоинты для разных экранов
    breakpoints: {
      // Мобильные
      320: {
        slidesPerView: 'auto',
        spaceBetween: 16,
      },
      // Планшеты
      768: {
        slidesPerView: 'auto',
        spaceBetween: 24,
      },
      // Десктоп
      1024: {
        slidesPerView: 'auto',
        spaceBetween: 48,
      },
    },

    // Колбэки для дополнительной логики
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

  // Функция для обновления состояния кнопок (опционально)
  function updateButtonStates(swiper) {
    const prevButton = document.querySelector('.news-button-prev');
    const nextButton = document.querySelector('.news-button-next');

    if (prevButton && nextButton) {
      // Swiper автоматически добавляет класс swiper-button-disabled
      // но можно добавить дополнительную логику если нужно
      console.log('Is beginning:', swiper.isBeginning);
      console.log('Is end:', swiper.isEnd);
    }
  }
});
