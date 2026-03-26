import { db } from "../pages/firebase.js";
import { collection, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// ---- Render Products ----
const container = document.querySelector('.perfume-container');

async function loadProducts() {
  const q = query(collection(db, "products"), orderBy("name"));
  const snapshot = await getDocs(q);

  container.innerHTML = "";

  snapshot.forEach(doc => {
    const p = doc.data();

    const card = document.createElement('div');
    card.className = 'perf-cont perf-anima';
    card.dataset.category = p.category;
    card.dataset.name = p.name;
    card.dataset.price = p.price;
    card.dataset.size = p.size;

    card.innerHTML = `
      <div class="perf-img">
        <img src="${p.image}" alt="${p.name}">
      </div>
      <h6>${p.name}</h6>
      <h5>₦${p.price.toLocaleString()}</h5>
      <p>${p.size}</p>
      <div class="cart-btn">
        <button><span class="material-symbols-outlined">add_shopping_cart</span> Add to Cart</button>
      </div>
    `;

    container.appendChild(card);

    // Add to cart button logic
    const cartBtn = card.querySelector('.cart-btn button');
    cartBtn.addEventListener('click', () => {
      const item = {
        name: p.name,
        price: p.price,
        size: p.size,
        image: p.image,
        quantity: 1
      };
    
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
      const existing = cart.find(i => i.name === item.name);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push(item);
      }
    
      localStorage.setItem('cart', JSON.stringify(cart));
      alert(`${p.name} added to cart!`);

      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
    });
  });

  // re-run filter and animation after cards load
  applyFilter(currentFilter);
  observeCards();
}


// ---- Cart Count ----
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCountEl = document.querySelector('.cart-id');
  if (cartCountEl) cartCountEl.textContent = total;
}


// ---- Filter Logic ----
const filterButtons = document.querySelectorAll('.bt');
let currentFilter = 'all';

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    currentFilter = button.dataset.filter;
    applyFilter(currentFilter);
  });
});

function applyFilter(filter) {
  const products = document.querySelectorAll('.perf-cont');
  products.forEach(product => {
    const category = product.dataset.category?.trim();
    if (filter === 'all' || category === filter) {
      product.classList.remove('hidden');
    } else {
      product.classList.add('hidden');
    }
  });
}

// ---- Scroll Animation ----
function observeCards() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    });
  });
  document.querySelectorAll('.perf-cont').forEach(el => observer.observe(el));
}

// ---- Navbar Logic ----
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
loadProducts();
updateCartCount();