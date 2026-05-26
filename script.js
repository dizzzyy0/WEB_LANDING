/**
 * FRY — Landing Page Script
 * Modular vanilla JS. API stubs are clearly marked with // [API].
 * No external dependencies.
 */

/* ============================================================
   MODULE: CONSTANTS & STATE
   ============================================================ */

/** @type {CartItem[]} - Central cart state */
let cartState = [];

/** @type {boolean} - Is cart drawer open */
let isCartOpen = false;

/**
 * @typedef {Object} CartItem
 * @property {string}  id       - Unique product id
 * @property {string}  name     - Display name
 * @property {string}  emoji    - Emoji icon
 * @property {number}  price    - Unit price in UAH
 * @property {number}  qty      - Quantity in cart
 */

/**
 * @typedef {Object} Product
 * @property {string}  id
 * @property {string}  name
 * @property {string}  emoji
 * @property {number}  price
 * @property {string}  desc
 * @property {string}  [badge]
 */

/** @type {Product[]} */
const PRODUCTS = [
  {
    id: 'fries-classic',
    name: 'Картопля фрі',
    emoji: '🍟',
    price: 79,
    desc: 'Хрустка зовні, ніжна всередині. Соняшникова олія, морська сіль.',
    badge: '🔥 Хіт'
  },
  {
    id: 'fries-country',
    name: 'Картопля по-селянськи',
    emoji: '🥔',
    price: 89,
    desc: 'Велика, ситна, зі шкіркою. Запашна суміш спецій — просто addiction.',
  },
  {
    id: 'chicken-strips',
    name: 'Курячі стріпси',
    emoji: '🍗',
    price: 129,
    desc: 'Ніжне куряче філе в хрусткій паніровці. Подаються з соусом.',
    badge: '🧡 Фаворит'
  },
  {
    id: 'nuggets',
    name: 'Нагетси',
    emoji: '🍳',
    price: 109,
    desc: 'Класичні нагетси у золотавих сухарях — 6 або 10 штук у порції.',
  },
  {
    id: 'seafood-batter',
    name: 'Морепродукти у клярі',
    emoji: '🦐',
    price: 149,
    desc: 'Кальмар і креветка у повітряному пивному клярі. Лимонний соус у комплекті.',
    badge: '⭐ Нове'
  },
  {
    id: 'wings-extra-hot',
    name: 'Крильця Екстра-Перчені',
    emoji: '🌶️',
    price: 139,
    desc: 'Максимальна гострота для справжніх екстремалів. Не для слабкодухих!',
    badge: '🔥🔥 ВОГОНЬ'
  }
];

/* ============================================================
   MODULE: API STUBS
   All functions below are stubs — replace bodies with real fetch
   calls when the backend is ready.
   ============================================================ */

/**
 * [API] Submit cart order to the backend.
 * @param {CartItem[]} items
 * @param {string} [userId]
 * @returns {Promise<{orderId: string, eta: number}>}
 */
async function apiSubmitOrder(items, userId = null) {
  console.info('[API] apiSubmitOrder — stub called', { items, userId });
  // TODO: Replace with real request:
  // const response = await fetch('/api/orders', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ items, userId })
  // });
  // if (!response.ok) throw new Error('Order failed');
  // return response.json();
  return new Promise(resolve =>
    setTimeout(() => resolve({ orderId: 'FRY-STUB-001', eta: 18 }), 600)
  );
}

/**
 * [API] Login or register user.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{token: string, user: Object}>}
 */
async function apiLogin(email, password) {
  console.info('[API] apiLogin — stub called', { email });
  // TODO: Replace with real request:
  // const response = await fetch('/api/auth/login', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ email, password })
  // });
  // if (!response.ok) throw new Error('Auth failed');
  // return response.json();
  return new Promise(resolve =>
    setTimeout(() => resolve({ token: 'stub_token', user: { email } }), 500)
  );
}

/**
 * [API] Fetch user loyalty data (progress, bonus bucket status).
 * @param {string} token
 * @returns {Promise<{purchasesCount: number, nextRewardAt: number}>}
 */
async function apiFetchLoyalty(token) {
  console.info('[API] apiFetchLoyalty — stub called');
  // TODO: Replace with real request
  return { purchasesCount: 3, nextRewardAt: 7 };
}

/**
 * [API] Fetch menu products from backend (replaces static PRODUCTS array).
 * @returns {Promise<Product[]>}
 */
async function apiFetchProducts() {
  console.info('[API] apiFetchProducts — stub called, using local data');
  // TODO: Replace with:
  // const res = await fetch('/api/products');
  // return res.json();
  return PRODUCTS;
}

/* ============================================================
   MODULE: CART LOGIC
   ============================================================ */

/**
 * Add a product to the cart or increment its quantity.
 * @param {Product} product
 */
function cartAddItem(product) {
  const existing = cartState.find(i => i.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cartState.push({
      id:    product.id,
      name:  product.name,
      emoji: product.emoji,
      price: product.price,
      qty:   1
    });
  }
  cartSyncUI();
}

/**
 * Change item quantity. Removes item if qty reaches 0.
 * @param {string} id
 * @param {number} delta — +1 or -1
 */
function cartChangeQty(id, delta) {
  const item = cartState.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cartState = cartState.filter(i => i.id !== id);
  }
  cartSyncUI();
}

/**
 * Remove item completely from cart.
 * @param {string} id
 */
function cartRemoveItem(id) {
  cartState = cartState.filter(i => i.id !== id);
  cartSyncUI();
}

/** Calculate total quantity across all cart items. */
function cartTotalQty() {
  return cartState.reduce((sum, i) => sum + i.qty, 0);
}

/** Calculate total price. */
function cartTotalPrice() {
  return cartState.reduce((sum, i) => sum + i.price * i.qty, 0);
}

/** Re-render all cart-related UI elements. */
function cartSyncUI() {
  renderCartCount();
  renderCartItems();
  renderCartTotal();
}

/* ============================================================
   MODULE: DOM RENDERING
   ============================================================ */

/** Render product cards into #menuGrid */
async function renderMenu() {
  const grid = document.getElementById('menuGrid');
  if (!grid) return;

  const products = await apiFetchProducts();

  grid.innerHTML = products.map(product => `
    <li class="product-card reveal" role="listitem" data-product-id="${product.id}">
      <div class="product-card__media">
        ${product.badge ? `<span class="product-card__badge">${product.badge}</span>` : ''}
        <span aria-hidden="true">${product.emoji}</span>
      </div>
      <div class="product-card__body">
        <h3 class="product-card__name">${product.name}</h3>
        <p class="product-card__desc">${product.desc}</p>
      </div>
      <div class="product-card__footer">
        <p class="product-card__price">
          ${product.price} <span>грн</span>
        </p>
        <button
          class="product-card__btn"
          data-id="${product.id}"
          aria-label="Додати ${product.name} до кошика"
        >
          <span>В кошик</span>
        </button>
      </div>
    </li>
  `).join('');

  // Attach add-to-cart listeners
  grid.querySelectorAll('.product-card__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const product = products.find(p => p.id === id);
      if (!product) return;
      cartAddItem(product);
      showToast(`🛒 ${product.name} — додано!`);
      flashAddedBtn(btn);
    });
  });

  // Trigger reveal after paint
  requestAnimationFrame(() => {
    grid.querySelectorAll('.reveal').forEach((el, i) => {
      el.style.transitionDelay = `${i * 60}ms`;
      observeReveal(el);
    });
  });
}

/** Brief visual feedback on "add to cart" button */
function flashAddedBtn(btn) {
  btn.classList.add('is-added');
  btn.querySelector('span').textContent = '✓ Додано';
  setTimeout(() => {
    btn.classList.remove('is-added');
    btn.querySelector('span').textContent = 'В кошик';
  }, 1400);
}

/** Update the cart badge counter */
function renderCartCount() {
  const countEl = document.getElementById('cartCount');
  if (!countEl) return;
  const qty = cartTotalQty();
  countEl.textContent = qty;
  countEl.classList.toggle('is-visible', qty > 0);
}

/** Re-render the list of items inside the cart drawer */
function renderCartItems() {
  const listEl  = document.getElementById('cartItems');
  const emptyEl = document.getElementById('cartEmpty');
  const footerEl = document.getElementById('cartFooter');
  if (!listEl) return;

  const isEmpty = cartState.length === 0;
  emptyEl.style.display  = isEmpty ? 'flex' : 'none';
  footerEl.style.display = isEmpty ? 'none' : 'flex';
  listEl.style.display   = isEmpty ? 'none' : 'flex';

  listEl.innerHTML = cartState.map(item => `
    <li class="cart-item" data-item-id="${item.id}">
      <span class="cart-item__emoji" aria-hidden="true">${item.emoji}</span>
      <div class="cart-item__info">
        <p class="cart-item__name">${item.name}</p>
        <div class="cart-item__meta">
          <span class="cart-item__price">${item.price * item.qty} грн</span>
          <div class="cart-item__qty" role="group" aria-label="Кількість">
            <button class="cart-item__qty-btn" data-action="dec" data-id="${item.id}" aria-label="Зменшити">−</button>
            <span class="cart-item__qty-val" aria-live="polite">${item.qty}</span>
            <button class="cart-item__qty-btn" data-action="inc" data-id="${item.id}" aria-label="Збільшити">+</button>
          </div>
        </div>
      </div>
      <button class="cart-item__remove" data-id="${item.id}" aria-label="Видалити ${item.name}">✕</button>
    </li>
  `).join('');

  // Qty buttons
  listEl.querySelectorAll('.cart-item__qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const delta = btn.dataset.action === 'inc' ? 1 : -1;
      cartChangeQty(btn.dataset.id, delta);
    });
  });

  // Remove buttons
  listEl.querySelectorAll('.cart-item__remove').forEach(btn => {
    btn.addEventListener('click', () => cartRemoveItem(btn.dataset.id));
  });
}

/** Update the total price display in cart drawer */
function renderCartTotal() {
  const el = document.getElementById('cartTotal');
  if (el) el.textContent = cartTotalPrice();
}

/* ============================================================
   MODULE: CART DRAWER OPEN / CLOSE
   ============================================================ */

function openCart() {
  const drawer = document.getElementById('cartDrawer');
  const btn    = document.getElementById('cartBtn');
  if (!drawer) return;
  isCartOpen = true;
  drawer.classList.add('is-open');
  drawer.setAttribute('aria-hidden', 'false');
  btn.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  document.getElementById('cartClose')?.focus();
}

function closeCart() {
  const drawer = document.getElementById('cartDrawer');
  const btn    = document.getElementById('cartBtn');
  if (!drawer) return;
  isCartOpen = false;
  drawer.classList.remove('is-open');
  drawer.setAttribute('aria-hidden', 'true');
  btn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

/* ============================================================
   MODULE: CHECKOUT
   ============================================================ */

async function handleCheckout() {
  if (cartState.length === 0) return;
  const checkoutBtn = document.getElementById('checkoutBtn');
  checkoutBtn.textContent = 'Оформлюємо…';
  checkoutBtn.disabled = true;

  try {
    const result = await apiSubmitOrder(cartState);
    showToast(`🚀 Замовлення #${result.orderId} прийнято! Час доставки: ~${result.eta} хв`);
    cartState = [];
    cartSyncUI();
    closeCart();
  } catch (err) {
    console.error('Checkout error:', err);
    showToast('❌ Помилка при оформленні. Спробуйте ще раз.');
  } finally {
    checkoutBtn.textContent = 'Оформити замовлення';
    checkoutBtn.disabled = false;
  }
}

/* ============================================================
   MODULE: TOAST NOTIFICATIONS
   ============================================================ */

let toastTimer = null;

/**
 * Display a temporary toast message.
 * @param {string} message
 * @param {number} [duration=2500]
 */
function showToast(message, duration = 2500) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('is-visible');
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), duration);
}

/* ============================================================
   MODULE: SCROLL REVEAL (Intersection Observer)
   ============================================================ */

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

/** Register element for reveal animation. */
function observeReveal(el) {
  revealObserver.observe(el);
}

/** Apply reveal animation to all static .reveal elements */
function initReveal() {
  document.querySelectorAll('.reveal').forEach(el => observeReveal(el));
}

/* ============================================================
   MODULE: HEADER — scroll class & sticky behaviour
   ============================================================ */

function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 30);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
}

/* ============================================================
   MODULE: MOBILE NAV (burger menu)
   ============================================================ */

function initBurgerMenu() {
  const burgerBtn = document.getElementById('burgerBtn');
  const nav       = document.getElementById('mainNav');
  if (!burgerBtn || !nav) return;

  let isNavOpen = false;

  burgerBtn.addEventListener('click', () => {
    isNavOpen = !isNavOpen;
    nav.classList.toggle('is-open', isNavOpen);
    burgerBtn.setAttribute('aria-expanded', String(isNavOpen));
    document.body.style.overflow = isNavOpen ? 'hidden' : '';
  });

  // Close on nav link click
  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      if (!isNavOpen) return;
      isNavOpen = false;
      nav.classList.remove('is-open');
      burgerBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isNavOpen) {
      isNavOpen = false;
      nav.classList.remove('is-open');
      burgerBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      burgerBtn.focus();
    }
  });
}

/* ============================================================
   MODULE: PERSONAL CABINET (stub UI trigger)
   ============================================================ */

function initCabinet() {
  const cabinetBtn        = document.getElementById('cabinetBtn');
  const loyaltyCabinetBtn = document.getElementById('loyaltyCabinetBtn');

  const openCabinetFlow = async () => {
    // TODO: Replace stub with real auth flow
    console.info('[UI] Cabinet flow triggered — stub');
    // Future: open auth modal, redirect, or fetch user data:
    // const { token, user } = await apiLogin(email, password);
    // const loyalty = await apiFetchLoyalty(token);
    // renderLoyaltyProgress(loyalty);
  };

  cabinetBtn?.addEventListener('click', openCabinetFlow);
  loyaltyCabinetBtn?.addEventListener('click', openCabinetFlow);
}

/* ============================================================
   MODULE: MISC HELPERS
   ============================================================ */

/** Set current year in footer */
function setCurrentYear() {
  const el = document.getElementById('currentYear');
  if (el) el.textContent = new Date().getFullYear();
}

/* ============================================================
   MODULE: INIT — Wire everything up on DOMContentLoaded
   ============================================================ */

document.addEventListener('DOMContentLoaded', async () => {

  // Footer year
  setCurrentYear();

  // Header behaviour
  initHeader();

  // Mobile navigation
  initBurgerMenu();

  // Render product cards
  await renderMenu();

  // Scroll reveal for static elements
  initReveal();

  // Cabinet buttons
  initCabinet();

  // ---- Cart listeners ----

  const cartBtn     = document.getElementById('cartBtn');
  const cartClose   = document.getElementById('cartClose');
  const cartBackdrop = document.getElementById('cartBackdrop');
  const checkoutBtn = document.getElementById('checkoutBtn');

  cartBtn?.addEventListener('click', () => {
    isCartOpen ? closeCart() : openCart();
  });

  cartClose?.addEventListener('click', closeCart);
  cartBackdrop?.addEventListener('click', closeCart);
  checkoutBtn?.addEventListener('click', handleCheckout);

  // Close cart on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isCartOpen) closeCart();
  });

  // Initial cart UI sync (in case of hydration from localStorage in future)
  cartSyncUI();

  console.info('🍟 FRY app initialised successfully');
});
