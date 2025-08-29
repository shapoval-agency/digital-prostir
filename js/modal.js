document.addEventListener('DOMContentLoaded', function () {
  const burgerButton = document.querySelector('.buttons--mobile');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeButton = mobileMenu
    ? mobileMenu.querySelector('.mobile-menu__close-btn')
    : null;

  if (!burgerButton) {
    console.error('Burger button (.buttons--mobile) not found');
    return;
  }
  if (!mobileMenu) {
    console.error('Mobile menu (#mobile-menu) not found');
    return;
  }
  if (!closeButton) {
    console.error('Close button (.mobile-menu__close-btn) not found');
    return;
  }

  const openMenu = () => {
    console.log('Opening menu');
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-is-open');
    burgerButton.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    console.log('Closing menu');
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-is-open');
    burgerButton.setAttribute('aria-expanded', 'false');
  };

  burgerButton.addEventListener('click', event => {
    console.log('Burger button clicked');
    openMenu();
  });

  closeButton.addEventListener('click', event => {
    console.log('Close button clicked');
    closeMenu();
  });

  mobileMenu.addEventListener('click', event => {
    if (event.target === mobileMenu) {
      console.log('Clicked on menu background');
      closeMenu();
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
      console.log('Escape key pressed');
      closeMenu();
    }
  });
});
