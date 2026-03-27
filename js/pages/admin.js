import { db } from "../../js/pages/firebase.js";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// ---- Config ----
const ADMIN_PASSWORD = "nola2024";
const CLOUD_NAME = "dn83fy6fw";
const UPLOAD_PRESET = "fragrance_uploads";

// ---- Login ----
function login() {
  const password = document.getElementById('password-input').value;
  const errorEl = document.getElementById('login-error');

  if (password === ADMIN_PASSWORD) {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('dashboard').style.display = 'flex';
    loadProducts();
  } else {
    errorEl.style.display = 'block';
  }
}

function logout() {
  document.getElementById('login-page').style.display = 'flex';
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('password-input').value = '';
}

window.login = login;
window.logout = logout;

// ---- Tabs ----
function showTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.style.display = 'none');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`tab-${tab}`).style.display = 'block';
  event.currentTarget.classList.add('active');
}
window.showTab = showTab;

// ---- Load Products ----
async function loadProducts() {
  const grid = document.getElementById('admin-product-grid');
  grid.innerHTML = '<p class="loading">Loading products...</p>';

  const q = query(collection(db, "products"), orderBy("name"));
  const snapshot = await getDocs(q);

  grid.innerHTML = '';

  snapshot.forEach(docSnap => {
    const p = docSnap.data();
    const id = docSnap.id;

    const card = document.createElement('div');
    card.className = 'admin-product-card';
    card.innerHTML = `
      <div class="admin-product-img">
        <img src="${p.image}" alt="${p.name}">
      </div>
      <div class="admin-product-info">
        <h4>${p.name}</h4>
        <p>₦${p.price.toLocaleString()} ${p.size ? '· ' + p.size : ''}</p>
        <span class="category-tag">${p.category}</span>
      </div>
      <div class="admin-product-actions">
        <button class="edit-btn" onclick='editProduct(${JSON.stringify({id, ...p})})'>
          <span class="material-symbols-outlined">edit</span>
        </button>
        <button class="delete-btn" onclick="deleteProduct('${id}', '${p.name}')">
          <span class="material-symbols-outlined">delete</span>
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ---- Image Preview ----
document.getElementById('prod-image').addEventListener('change', function() {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      document.getElementById('preview-img').src = e.target.result;
      document.getElementById('image-preview').style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
});

// ---- Upload Image to Cloudinary ----
async function uploadImage(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData
  });

  const data = await res.json();
  return data.secure_url;
}

// ---- Save Product ----
async function saveProduct() {
  const name = document.getElementById('prod-name').value.trim();
  const price = parseInt(document.getElementById('prod-price').value);
  const size = document.getElementById('prod-size').value.trim();
  const category = document.getElementById('prod-category').value;
  const imageFile = document.getElementById('prod-image').files[0];
  const editId = document.getElementById('edit-id').value;
  const statusEl = document.getElementById('form-status');
  const saveBtnText = document.getElementById('save-btn-text');

  if (!name || !price || !category) {
    statusEl.textContent = '⚠️ Please fill in all required fields.';
    statusEl.style.color = '#ff4d4d';
    return;
  }

  if (!editId && !imageFile) {
    statusEl.textContent = '⚠️ Please select an image.';
    statusEl.style.color = '#ff4d4d';
    return;
  }

  saveBtnText.textContent = 'Saving...';
  statusEl.textContent = '';

  try {
    let imageUrl = document.getElementById('preview-img').src;

    if (imageFile) {
      statusEl.textContent = '⏳ Uploading image...';
      statusEl.style.color = '#F5CC77';
      imageUrl = await uploadImage(imageFile);
    }

    const productData = { name, price, size, category, image: imageUrl };

    if (editId) {
      await updateDoc(doc(db, "products", editId), productData);
      statusEl.textContent = '✅ Product updated successfully!';
    } else {
      await addDoc(collection(db, "products"), productData);
      statusEl.textContent = '✅ Product added successfully!';
    }

    statusEl.style.color = '#4CAF50';
    saveBtnText.textContent = 'Save Product';
    cancelEdit();
    loadProducts();
    showTabByName('products');

  } catch (err) {
    statusEl.textContent = '❌ Error saving product. Try again.';
    statusEl.style.color = '#ff4d4d';
    saveBtnText.textContent = 'Save Product';
    console.error(err);
  }
}
window.saveProduct = saveProduct;

// ---- Edit Product ----
function editProduct(product) {
  document.getElementById('edit-id').value = product.id;
  document.getElementById('prod-name').value = product.name;
  document.getElementById('prod-price').value = product.price;
  document.getElementById('prod-size').value = product.size || '';
  document.getElementById('prod-category').value = product.category;
  document.getElementById('preview-img').src = product.image;
  document.getElementById('image-preview').style.display = 'block';
  document.getElementById('form-title').textContent = 'Edit Product';
  document.getElementById('save-btn-text').textContent = 'Update Product';
  document.getElementById('form-status').textContent = '';

  showTabByName('add');
}
window.editProduct = editProduct;

// ---- Delete Product ----
async function deleteProduct(id, name) {
  if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
  await deleteDoc(doc(db, "products", id));
  loadProducts();
}
window.deleteProduct = deleteProduct;

// ---- Cancel Edit ----
function cancelEdit() {
  document.getElementById('edit-id').value = '';
  document.getElementById('prod-name').value = '';
  document.getElementById('prod-price').value = '';
  document.getElementById('prod-size').value = '';
  document.getElementById('prod-category').value = 'perfume';
  document.getElementById('prod-image').value = '';
  document.getElementById('image-preview').style.display = 'none';
  document.getElementById('form-title').textContent = 'Add New Product';
  document.getElementById('save-btn-text').textContent = 'Save Product';
  document.getElementById('form-status').textContent = '';
}
window.cancelEdit = cancelEdit;

function showTabByName(tab) {
  document.querySelectorAll('.tab').forEach(t => t.style.display = 'none');
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`tab-${tab}`).style.display = 'block';
  document.querySelectorAll('.nav-btn').forEach(b => {
    if (b.textContent.toLowerCase().includes(tab)) b.classList.add('active');
  });
}

document.getElementById('password-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') login();
});
document.getElementById('login-btn').addEventListener('click', login);

const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebarOverlay = document.getElementById('sidebar-overlay');

sidebarToggle.addEventListener('click', () => {
  document.querySelector('.sidebar').classList.toggle('open');
  sidebarOverlay.classList.toggle('active');
});

sidebarOverlay.addEventListener('click', () => {
  document.querySelector('.sidebar').classList.remove('open');
  sidebarOverlay.classList.remove('active');
});