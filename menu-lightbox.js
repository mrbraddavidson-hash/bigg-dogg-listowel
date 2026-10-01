(function () {
  const dialog = document.querySelector('[data-menu-lightbox]');
  const image = dialog?.querySelector('[data-menu-lightbox-image]');
  const closeButton = dialog?.querySelector('[data-menu-lightbox-close]');
  const viewButtons = document.querySelectorAll('[data-menu-lightbox-src]');

  if (!dialog || !image || !closeButton || !viewButtons.length) return;

  const close = () => {
    if (dialog.open) dialog.close();
    document.body.classList.remove('menu-lightbox-open');
    image.src = '/images/smash-burger.webp';
    image.alt = 'Selected menu photo';
  };

  viewButtons.forEach((button) => {
    button.addEventListener('click', () => {
      image.src = button.dataset.menuLightboxSrc;
      image.alt = button.dataset.menuLightboxAlt || '';
      dialog.showModal();
      document.body.classList.add('menu-lightbox-open');
      closeButton.focus();
    });
  });

  closeButton.addEventListener('click', close);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) close();
  });
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    close();
  });
})();
