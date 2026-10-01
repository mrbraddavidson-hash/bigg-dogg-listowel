(function () {
  const dialog = document.querySelector('[data-menu-lightbox]');
  const image = dialog?.querySelector('[data-menu-lightbox-image]');
  const source = dialog?.querySelector('[data-menu-lightbox-source]');
  const closeButton = dialog?.querySelector('[data-menu-lightbox-close]');
  const viewButtons = document.querySelectorAll('[data-menu-lightbox-src]');

  if (!dialog || !image || !closeButton || !viewButtons.length) return;

  const initialSrc = source?.getAttribute('srcset') || image.getAttribute('src') || '';
  const initialAlt = image.getAttribute('alt') || 'Selected menu photo';

  const setImage = (src, alt) => {
    if (source) source.setAttribute('srcset', src);
    image.src = src;
    image.alt = alt;
  };

  const close = () => {
    if (dialog.open) dialog.close();
    document.body.classList.remove('menu-lightbox-open');
    setImage(initialSrc, initialAlt);
  };

  viewButtons.forEach((button) => {
    button.addEventListener('click', () => {
      setImage(button.dataset.menuLightboxSrc, button.dataset.menuLightboxAlt || '');
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
