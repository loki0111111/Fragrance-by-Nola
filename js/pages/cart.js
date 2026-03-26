// ---- Render Cart ----
const cartItemsEl = document.getElementById('cart-items');
const cartSummaryEl = document.getElementById('cart-summary');
const emptyCartEl = document.getElementById('empty-cart');
const cartTotalEl = document.getElementById('cart-total');

function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function renderCart() {
  const cart = getCart();
  cartItemsEl.innerHTML = '';

  if (cart.length === 0) {
    cartSummaryEl.style.display = 'none';
    emptyCartEl.style.display = 'flex';
    return;
  }

  cartSummaryEl.style.display = 'block';
  emptyCartEl.style.display = 'none';

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const card = document.createElement('div');
    card.className = 'cart-item';
    card.innerHTML = `
      <div class="cart-item-img">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        ${item.size ? `<p>${item.size}</p>` : ''}
        <h5>₦${(item.price * item.quantity).toLocaleString()}</h5>
      </div>
      <div class="cart-item-actions">
        <button class="qty-btn" onclick="changeQty(${index}, -1)">−</button>
        <span>${item.quantity}</span>
        <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
        <button class="remove-btn" onclick="removeItem(${index})">
          <span class="material-symbols-outlined">delete</span>
        </button>
      </div>
    `;
    cartItemsEl.appendChild(card);
  });

  cartTotalEl.textContent = `₦${total.toLocaleString()}`;
  updateCartCount();
}

function changeQty(index, delta) {
  const cart = getCart();
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

function removeItem(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

window.changeQty = changeQty;
window.removeItem = removeItem;

// ---- Cart Count ----
function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountEl = document.querySelector('.cart-id');
  if (cartCountEl) cartCountEl.textContent = total;
}

// ---- WhatsApp Checkout ----
document.getElementById('checkout-btn').addEventListener('click', () => {
  const cart = getCart();
  if (cart.length === 0) return;

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let message = `Hello Fragrance by Nola! 🌸 I'd like to place an order:\n\n`;
  cart.forEach(item => {
    message += `• ${item.name}${item.size ? ' (' + item.size + ')' : ''} x${item.quantity} — ₦${(item.price * item.quantity).toLocaleString()}\n`;
  });
  message += `\n*Total: ₦${total.toLocaleString()}*`;

  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/2348111116668?text=${encoded}`, '_blank');
});

// ---- Navbar ----
const mobileNav = document.getElementById('mobile-nav');
const openNav = document.getElementById('open-hamburger');
const closeNav = document.getElementById('close-hamburger');

openNav.addEventListener('click', () => mobileNav.classList.add('active'));
closeNav.addEventListener('click', closeMenu);

function closeMenu() {
  mobileNav.classList.remove('active');
}

function closeNavBar() {
  closeMenu();
}

window.addEventListener('resize', () => {
  if (window.innerWidth > 870) closeMenu();
});

// ---- Footer Year ----
document.getElementById('year').innerHTML = new Date().getFullYear();

// ---- Init ----
renderCart();