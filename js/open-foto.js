document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('.course-testimonials');
  if (!root) return;

  let lightbox = document.querySelector('.ct-lightbox');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.className = 'ct-lightbox';
    lightbox.innerHTML = `
      <div class="ct-lightbox__inner" role="dialog" aria-modal="true" aria-label="Перегляд зображення">
        <button class="ct-lightbox__close" type="button" aria-label="Закрити">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6L18 18M18 6L6 18" stroke="white" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        <img class="ct-lightbox__image" src="" alt="Перегляд зображення відгуку">
      </div>
    `;
    document.body.appendChild(lightbox);
  }

  const imgNode = lightbox.querySelector(
    '.ct-lightbox__image, .ct-lightbox_image'
  );
  const closeBtn = lightbox.querySelector(
    '.ct-lightbox__close, .ct-lightbox_close'
  );
  const inner = lightbox.querySelector(
    '.ct-lightbox__inner, .ct-lightbox_inner'
  );

  let lastTrigger = null;
  let lockedScrollY = 0;

  function lockScroll() {
    lockedScrollY = window.scrollY || window.pageYOffset || 0;
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${lockedScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    if (sbw > 0) document.body.style.paddingRight = sbw + 'px';
  }

  function unlockScroll() {
    const y =
      Math.abs(parseInt(document.body.style.top || '0', 10)) ||
      lockedScrollY ||
      0;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    document.body.style.paddingRight = '';
    window.scrollTo(0, y);
  }
  // ------------------------------------------

  function openLightbox(src, alt, trigger) {
    if (!imgNode || !src) return;
    imgNode.src = src;
    imgNode.alt = alt || 'Перегляд зображення відгуку';
    lightbox.classList.add('is-open');
    lockScroll();
    lastTrigger = trigger || null;
    setTimeout(() => closeBtn?.focus(), 0);
    document.addEventListener('keydown', onKeyDown);
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    if (imgNode) imgNode.src = '';
    document.removeEventListener('keydown', onKeyDown);
    unlockScroll();
    if (lastTrigger && typeof lastTrigger.focus === 'function') {
      try {
        lastTrigger.focus();
      } catch (e) {}
    }
    lastTrigger = null;
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeLightbox();
    }
  }

  lightbox.addEventListener('click', e => {
    if (e.target.closest('.ct-lightbox__close, .ct-lightbox_close')) {
      e.preventDefault();
      closeLightbox();
      return;
    }
    if (inner && !inner.contains(e.target)) {
      closeLightbox();
    }
  });

  closeBtn?.addEventListener('click', e => {
    e.preventDefault();
    closeLightbox();
  });
  closeBtn?.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      closeLightbox();
    }
  });

  root.addEventListener('click', e => {
    const btn = e.target.closest(
      '.buttons[aria-label="Відтворити відео відгук"]'
    );
    if (!btn) return;
    const card = btn.closest('.testimonials');
    const image = card?.querySelector('img.wake-watch');
    if (!image) return;
    const src = image.dataset.full || image.src;
    const alt = image.alt || 'Перегляд зображення відгуку';
    openLightbox(src, alt, btn);
  });
});
