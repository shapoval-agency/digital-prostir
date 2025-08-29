document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('.course-program');
  if (!root) return;

  let modal = document.querySelector('.ct-videobox');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'ct-videobox';
    modal.innerHTML = `
      <div class="ct-videobox__inner" role="dialog" aria-modal="true" aria-label="Перегляд відео">
        <button class="ct-videobox__close" type="button" aria-label="Закрити">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6L18 18M18 6L6 18" stroke="white" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        <iframe
          class="ct-videobox__iframe"
          src=""
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
          referrerpolicy="strict-origin-when-cross-origin"
        ></iframe>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const iframe = modal.querySelector('.ct-videobox__iframe');
  const closeBtn = modal.querySelector('.ct-videobox__close');
  const inner = modal.querySelector('.ct-videobox__inner');

  let lockedScrollY = 0;
  function lockScroll() {
    lockedScrollY = window.scrollY || window.pageYOffset || 0;
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${lockedScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    if (sbw > 0) document.body.style.paddingRight = `${sbw}px`;
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

  function parseTimeToSeconds(t) {
    if (!t) return 0;
    if (/^\d+$/.test(t)) return parseInt(t, 10);
    const m = t.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/i);
    if (!m) return 0;
    const h = parseInt(m[1] || 0, 10);
    const mn = parseInt(m[2] || 0, 10);
    const s = parseInt(m[3] || 0, 10);
    return h * 3600 + mn * 60 + s;
  }

  function extractYouTubeData(urlString) {
    let id = '';
    let start = 0;
    try {
      const u = new URL(urlString, window.location.origin);
      const host = u.hostname.replace(/^www\./, '');
      const pathParts = u.pathname.split('/').filter(Boolean);

      start =
        parseTimeToSeconds(u.searchParams.get('t')) ||
        parseInt(u.searchParams.get('start') || '0', 10) ||
        0;

      if (host.includes('youtu.be')) {
        id = pathParts[0] || '';
      } else if (
        host.includes('youtube.com') ||
        host.includes('youtube-nocookie.com')
      ) {
        if (u.searchParams.get('v')) {
          id = u.searchParams.get('v') || '';
        } else if (['embed', 'v', 'shorts'].includes(pathParts[0])) {
          id = pathParts[1] || '';
        }
      }
    } catch {
      const m = urlString.match(
        /(?:youtu\.be\/|youtube\.com\/(?:shorts\/|embed\/|v\/|watch\?v=))([A-Za-z0-9_-]{11})/
      );
      if (m) id = m[1];
      const t = urlString.match(/[?&](?:t|start)=([0-9hms]+)/i);
      if (t) {
        const raw = t[1];
        start = parseTimeToSeconds(raw) || parseInt(raw, 10) || 0;
      }
    }
    return { id, start };
  }

  function toYouTubeEmbed(url) {
    const { id, start } = extractYouTubeData(url);
    if (!id) return null;

    const params = new URLSearchParams({
      autoplay: '1',
      rel: '0',
      modestbranding: '1',
      playsinline: '1',
    });
    if (start > 0) params.set('start', String(start));

    return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
  }

  function openVideo(url) {
    const embed = toYouTubeEmbed(url);
    if (!embed) {
      console.warn('Невалідне YouTube посилання:', url);
      return;
    }
    iframe.src = embed;
    modal.classList.add('is-open');
    lockScroll();
    setTimeout(() => closeBtn?.focus(), 0);
    document.addEventListener('keydown', onKeyDown);
  }

  function closeVideo() {
    modal.classList.remove('is-open');
    iframe.src = '';
    document.removeEventListener('keydown', onKeyDown);
    unlockScroll();
  }

  function onKeyDown(e) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeVideo();
    }
  }

  modal.addEventListener('click', e => {
    if (e.target.closest('.ct-videobox__close')) {
      e.preventDefault();
      closeVideo();
      return;
    }
    if (inner && !inner.contains(e.target)) {
      closeVideo();
    }
  });

  closeBtn?.addEventListener('click', e => {
    e.preventDefault();
    closeVideo();
  });

  root.addEventListener('click', e => {
    const btn = e.target.closest(
      '.course-program__play[aria-label="Відтворити відео"], .course-program__play[aria-label^="Відтворити відео"], .program-cards .buttons[aria-label="Відтворити відео"], .program-cards .buttons[aria-label^="Відтворити відео"]'
    );
    if (!btn) return;

    const url =
      btn.dataset.video ||
      btn.closest('.course-program__card, .program-cards')?.dataset.video ||
      '';

    if (!url) {
      console.warn(
        'Додайте data-video з посиланням YouTube на кнопку або card (.course-program__card / .program-cards)'
      );
      return;
    }

    openVideo(url);
  });
});
