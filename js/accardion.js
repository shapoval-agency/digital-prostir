class SimpleAccordion {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.isDesktop = window.innerWidth >= 1280;

    window.addEventListener('resize', () => {
      this.isDesktop = window.innerWidth >= 1280;
      this.updateIconRotations();
    });

    this.init();
  }

  init() {
    const headers = this.container.querySelectorAll('.accordion-header');

    headers.forEach(header => {
      header.addEventListener('click', () => this.toggle(header));

      header.setAttribute('tabindex', '0');
      header.style.cursor = 'pointer';

      header.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggle(header);
        }
      });
    });

    this.initializeStates();
  }

  getRotationAngles() {
    if (this.isDesktop) {
      return {
        closed: '-90deg',
        open: '0deg',
      };
    } else {
      return {
        closed: '0deg',
        open: '180deg',
      };
    }
  }

  toggle(clickedHeader) {
    const clickedItem = clickedHeader.closest('.accordion-item');
    const clickedContent = clickedItem.querySelector('.accordion-content');
    const isOpen = clickedItem.classList.contains('accordion-item--active');
    const angles = this.getRotationAngles();

    const allItems = this.container.querySelectorAll('.accordion-item');

    allItems.forEach(item => {
      const content = item.querySelector('.accordion-content');
      const icon = item.querySelector('.accordion-icon');

      if (item.classList.contains('accordion-item--active')) {
        content.style.maxHeight = content.scrollHeight + 'px';
        content.offsetHeight;
        content.style.maxHeight = '0';
      }

      item.classList.remove('accordion-item--active');
      content.style.opacity = '0';

      if (icon) {
        icon.style.transform = `rotate(${angles.closed})`;
      }
    });

    if (!isOpen) {
      clickedItem.classList.add('accordion-item--active');

      clickedContent.style.maxHeight = clickedContent.scrollHeight + 'px';
      clickedContent.style.opacity = '1';

      const transitionEndHandler = () => {
        if (clickedItem.classList.contains('accordion-item--active')) {
          clickedContent.style.maxHeight = 'none';
          clickedContent.style.height = 'auto';
        }
        clickedContent.removeEventListener(
          'transitionend',
          transitionEndHandler
        );
      };

      clickedContent.addEventListener('transitionend', transitionEndHandler);

      const clickedIcon = clickedItem.querySelector('.accordion-icon');
      if (clickedIcon) {
        clickedIcon.style.transform = `rotate(${angles.open})`;
      }
    }
  }

  updateIconRotations() {
    const angles = this.getRotationAngles();
    const allItems = this.container.querySelectorAll('.accordion-item');

    allItems.forEach(item => {
      const icon = item.querySelector('.accordion-icon');
      if (icon) {
        if (item.classList.contains('accordion-item--active')) {
          icon.style.transform = `rotate(${angles.open})`;
        } else {
          icon.style.transform = `rotate(${angles.closed})`;
        }
      }
    });
  }

  initializeStates() {
    const allItems = this.container.querySelectorAll('.accordion-item');
    const angles = this.getRotationAngles();

    allItems.forEach(item => {
      const content = item.querySelector('.accordion-content');
      const icon = item.querySelector('.accordion-icon');

      content.style.overflow = 'hidden';
      content.style.transition =
        'max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease';

      if (icon) {
        icon.style.transition = 'transform 0.3s ease';
      }

      if (item.classList.contains('accordion-item--active')) {
        content.style.opacity = '1';
        content.style.maxHeight = 'none';
        const height = content.scrollHeight;
        content.style.maxHeight = '0';

        content.offsetHeight;

        content.style.maxHeight = height + 'px';

        setTimeout(() => {
          content.style.maxHeight = 'none';
          content.style.height = 'auto';
        }, 300);

        if (icon) {
          icon.style.transform = `rotate(${angles.open})`;
        }
      } else {
        content.style.maxHeight = '0';
        content.style.opacity = '0';
        if (icon) {
          icon.style.transform = `rotate(${angles.closed})`;
        }
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const accordion = new SimpleAccordion('accordion');
});
