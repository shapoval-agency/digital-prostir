(() => {
  'use strict';

  class ConsultationAccordion {
    constructor(options = {}) {
      const defaults = {
        root: '.consultation-details',

        listSelector:
          '.consultation-details__services-wrapper .consultation-details__services-list',
        itemSelector: '.consultation-details__service-item',
        headerSelector:
          '.consultation-details__service-toggle, .consultation-details__service-icon-title',
        contentSelector: '.consultation-details__service-content',
        activeClass: 'consultation-details__service-item--active',
        singleOpen: true,
        defaultOpenIndex: 0,
      };
      this.opts = { ...defaults, ...options };

      this.root = document.querySelector(this.opts.root);
      if (!this.root) return;

      this.list = this.root.querySelector(this.opts.listSelector);
      if (!this.list) return;

      this.items = Array.from(
        this.list.querySelectorAll(this.opts.itemSelector)
      );
      if (!this.items.length) return;

      this.nodes = [];
      this.setup();
    }

    setup() {
      this.items.forEach((item, idx) => {
        const header = item.querySelector(this.opts.headerSelector);
        const content = item.querySelector(this.opts.contentSelector);
        if (!header || !content) return;

        header.setAttribute('tabindex', '0');
        header.setAttribute('role', 'button');
        header.style.cursor = 'pointer';

        const contentId = content.id || `consultation-service-content-${idx}`;
        content.id = contentId;
        header.setAttribute('aria-controls', contentId);

        content.style.overflow = 'hidden';
        content.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';

        header.addEventListener('click', () => this.toggle(item));
        header.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.toggle(item);
          }
        });

        this.nodes.push({ item, header, content });
      });

      this.initializeState();
    }

    initializeState() {
      const domActiveIndex = this.nodes.findIndex(n =>
        n.item.classList.contains(this.opts.activeClass)
      );
      const initialIndex =
        domActiveIndex >= 0 ? domActiveIndex : this.opts.defaultOpenIndex;

      this.nodes.forEach((node, idx) => {
        if (idx === initialIndex && initialIndex >= 0) {
          this.open(node.item, false);
        } else {
          this.close(node.item, false);
        }
      });
    }

    toggle(item) {
      const isOpen = item.classList.contains(this.opts.activeClass);

      if (this.opts.singleOpen) {
        this.nodes.forEach(n => {
          if (n.item !== item) this.close(n.item);
        });
      }

      if (isOpen) {
        this.close(item);
      } else {
        this.open(item);
      }
    }

    open(item, animate = true) {
      const content = item.querySelector(this.opts.contentSelector);
      const header = item.querySelector(this.opts.headerSelector);
      if (!content) return;

      item.classList.add(this.opts.activeClass);
      header?.setAttribute('aria-expanded', 'true');

      content.style.opacity = '1';

      if (animate) {
        content.style.maxHeight = content.scrollHeight + 'px';
        const onEnd = () => {
          content.style.maxHeight = 'none';
          content.removeEventListener('transitionend', onEnd);
        };
        content.addEventListener('transitionend', onEnd);
      } else {
        content.style.maxHeight = 'none';
      }
    }

    close(item, animate = true) {
      const content = item.querySelector(this.opts.contentSelector);
      const header = item.querySelector(this.opts.headerSelector);
      if (!content) return;

      item.classList.remove(this.opts.activeClass);
      header?.setAttribute('aria-expanded', 'false');

      content.style.opacity = '0';

      if (animate) {
        if (content.style.maxHeight === 'none' || !content.style.maxHeight) {
          content.style.maxHeight = content.scrollHeight + 'px';

          content.offsetHeight;
        }
        content.style.maxHeight = '0';
      } else {
        content.style.maxHeight = '0';
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    new ConsultationAccordion({
      // Можно переопределить настройки:
      // singleOpen: true,
      // defaultOpenIndex: 0 // -1, чтобы всё было закрыто
    });
  });
})();
