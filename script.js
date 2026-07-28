// ---------- PRODUCTOS REALES ----------
const products = [
  { id: 1, name: "Taza blanca personalizada", cat: "Tazas", price: 350, img: "img/taza1.png" },
  { id: 2, name: "Taza de colores personalizada", cat: "Tazas", price: 450, img: "img/taza2.png" },
  { id: 3, name: "Taza mágica personalizada", cat: "Tazas", price: 600, img: "img/taza3.png" },
  { id: 4, name: "Abrigo personalizado", cat: "Abrigos", price: 1375, img: "img/abrigo1.png" },
  { id: 5, name: "Camiseta personalizada", cat: "Camisetas", price: 350, img: "img/Cami1.png" },
  { id: 6, name: "Termo personalizado", cat: "Termos", price: 1150, img: "img/Termo1.png" },
  { id: 7, name: "Gorra personalizada", cat: "Gorras", price: 375, img: "img/gorra1.jpg" },
  { id: 8, name: "Llaveros personalizados", cat: "Llaveros", price: 275, img: "img/llavero1.jpg" }
];

// ---------- CATEGORÍAS ----------
const categories = ["Todos", ...new Set(products.map(p => p.cat))];

function renderCategories() {
  const nav = document.getElementById('categoryNav');
  nav.innerHTML = categories
    .map(c => `<button class="chip" data-cat="${c}">${c}</button>`)
    .join('');

  nav.querySelectorAll('.chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.cat;
      const filtrados = cat === "Todos" ? products : products.filter(p => p.cat === cat);
      renderProducts(filtrados);
    });
  });
}

// ---------- PRODUCTOS EN PANTALLA ----------
function renderProducts(lista = products) {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = lista.map(p => `
    <div class="card">
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p class="price">RD$ ${p.price}</p>
      <button class="add-btn" data-id="${p.id}">
        <span class="add-text">Agregar</span>
        <span class="add-qty"></span>
      </button>
    </div>
  `).join('');

  document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      addToCart(parseInt(btn.dataset.id));
    });
  });

  updateAddButtons();
}

// ---------- CARRITO ----------
let cart = {};

function addToCart(id) {
  const producto = products.find(p => p.id === id);
  if (cart[id]) {
    cart[id].qty++;
  } else {
    cart[id] = { product: producto, qty: 1 };
  }
  updateCartUI();
  updateAddButtons();
}

function removeFromCart(id) {
  if (!cart[id]) return;
  cart[id].qty--;
  if (cart[id].qty <= 0) {
    delete cart[id];
  }
  updateCartUI();
  updateAddButtons();
}

function updateCartUI() {
  const items = Object.values(cart);
  const totalQty = items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.qty * i.product.price, 0);

  document.getElementById('cartCount').textContent = totalQty;
  document.getElementById('totalPrice').textContent = `RD$ ${totalPrice}`;

  const container = document.getElementById('drawerItems');
  if (items.length === 0) {
    container.innerHTML = `<p>Tu carrito está vacío 🛍️</p>`;
    return;
  }
  container.innerHTML = items.map(i => `
    <div class="drawer-item">
      <img src="${i.product.img}" width="40">
      <span>${i.product.name}</span>
      <button class="qty-btn" data-id="${i.product.id}" data-d="-1">−</button>
      <span>${i.qty}</span>
      <button class="qty-btn" data-id="${i.product.id}" data-d="1">+</button>
    </div>
  `).join('');

  container.querySelectorAll('.qty-btn').forEach(btn => {
    const id = parseInt(btn.dataset.id);
    const d = parseInt(btn.dataset.d);
    btn.addEventListener('click', () => d > 0 ? addToCart(id) : removeFromCart(id));
  });
}

// ---------- ACTUALIZAR BOTONES SEGÚN CANTIDAD ----------
function updateAddButtons() {
  document.querySelectorAll('.add-btn').forEach(btn => {
    const id = parseInt(btn.dataset.id);
    const qty = cart[id] ? cart[id].qty : 0;
    const qtySpan = btn.querySelector('.add-qty');

    if (qty > 0) {
      btn.classList.add('added');
      qtySpan.textContent = `${qty} en el carrito`;
    } else {
      btn.classList.remove('added');
      qtySpan.textContent = '';
    }
  });
}

// ---------- ENVIAR PEDIDO POR WHATSAPP ----------
function checkoutWhatsApp() {
  const items = Object.values(cart);
  if (items.length === 0) {
    alert("Tu carrito está vacío");
    return;
  }

  let mensaje = "¡Hola! Quiero hacer este pedido en Happy Shop:\n\n";
  let total = 0;

  items.forEach(i => {
    mensaje += `• ${i.product.name} x${i.qty} — RD$ ${i.product.price * i.qty}\n`;
    total += i.product.price * i.qty;
  });

  mensaje += `\nTotal: RD$ ${total}`;

  const numero = "18292306533";
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;

  window.open(url, "_blank");
}

// ---------- INICIO ----------
renderCategories();
renderProducts();
updateCartUI();