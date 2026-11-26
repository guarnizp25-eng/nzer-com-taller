/* NZER STORE — Tarjeta V1 aislada. No cambia el catálogo ni el pago. */
(() => {
  'use strict';
  const root = document.getElementById('nzerProductV1');
  if (!root) return;

  const productId = 'woodblocks';
  const product = typeof NZER_PRODUCTS !== 'undefined'
    ? NZER_PRODUCTS.find(item => item.id === productId)
    : null;
  if (!product) return;

  const photo = root.querySelector('[data-v1-photo]');
  const photoStatus = root.querySelector('[data-v1-photo-status]');
  const photoButtons = [...root.querySelectorAll('[data-v1-view]')];
  const quantityOutput = root.querySelector('[data-v1-quantity]');
  const minusButton = root.querySelector('[data-v1-minus]');
  const plusButton = root.querySelector('[data-v1-plus]');
  const unitPrice = root.querySelector('[data-v1-price]');
  const subtotal = root.querySelector('[data-v1-subtotal]');
  const addButton = root.querySelector('[data-v1-add]');
  const feedback = root.querySelector('[data-v1-feedback]');
  const detailButton = root.querySelector('[data-v1-details]');
  const detailPanel = root.querySelector('[data-v1-detail-panel]');
  const productName = root.querySelector('[data-v1-name]');
  let view = 'principal';
  let quantity = 1;

  if (productName) productName.textContent = product.name;
  if (unitPrice) unitPrice.textContent = Number(product.price).toFixed(2);

  function setView(next) {
    view = next === 'uso' ? 'uso' : 'principal';
    photo.classList.toggle('is-usage', view === 'uso');
    photo.setAttribute('aria-label', view === 'uso'
      ? 'Fotografía ilustrativa en uso; tocar para volver a la vista del material'
      : 'Fotografía ilustrativa del material; tocar para ver una escena de uso');
    if (photoStatus) photoStatus.textContent = view === 'uso' ? 'Escena de juego' : 'Vista del material';
    photoButtons.forEach(button => {
      const active = button.dataset.v1View === view;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function renderQuantity() {
    quantityOutput.textContent = String(quantity);
    subtotal.textContent = 'S/ ' + (product.price * quantity).toFixed(2);
    minusButton.disabled = quantity <= 1;
    plusButton.disabled = quantity >= 10;
  }

  photo.addEventListener('click', () => setView(view === 'principal' ? 'uso' : 'principal'));
  photoButtons.forEach(button => {
    button.addEventListener('click', () => setView(button.dataset.v1View));
  });

  minusButton.addEventListener('click', () => {
    quantity = Math.max(1, quantity - 1);
    renderQuantity();
  });
  plusButton.addEventListener('click', () => {
    quantity = Math.min(10, quantity + 1);
    renderQuantity();
  });

  detailButton.addEventListener('click', () => {
    const open = detailButton.getAttribute('aria-expanded') !== 'true';
    detailButton.setAttribute('aria-expanded', String(open));
    detailPanel.hidden = !open;
    detailButton.querySelector('[data-v1-details-label]').textContent = open
      ? 'Ocultar detalles' : 'Ver detalles';
  });

  addButton.addEventListener('click', () => {
    // Misma clave y estructura de carrito que NZER STORE actual.
    const cart = getCart();
    const existing = Number.isInteger(cart[productId]) && cart[productId] > 0
      ? cart[productId] : 0;
    const added = Math.max(0, Math.min(quantity, 99 - existing));
    if (!added) {
      feedback.textContent = 'El carrito de prueba admite hasta 99 unidades de este producto.';
      toast('Límite de 99 unidades alcanzado');
      return;
    }
    cart[productId] = existing + added;
    saveCart(cart);
    feedback.textContent = '✓ ' + added + (added === 1 ? ' unidad agregada' : ' unidades agregadas')
      + ' · Ahora hay ' + cart[productId] + ' en tu carrito de prueba.';
    toast('Agregado al carrito de demostración');
  });

  renderQuantity();
  setView('principal');
})();