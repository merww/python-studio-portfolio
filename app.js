const categories = [
  { id: "all", name: "Все товары", icon: "*", text: "Весь каталог" },
  { id: "pens", name: "Ручки", icon: "✎", text: "Письмо каждый день" },
  { id: "notebooks", name: "Тетради", icon: "▤", text: "Для школы и заметок" },
  { id: "folders", name: "Папки", icon: "▣", text: "Документы в порядке" },
  { id: "markers", name: "Маркеры", icon: "▰", text: "Выделяйте главное" },
  { id: "paper", name: "Бумага", icon: "□", text: "Офисная печать" },
  { id: "creative", name: "Творчество", icon: "◈", text: "Рисование и скетчи" }
];

const products = [
  {
    id: 1,
    name: "Набор гелевых ручек ClearLine",
    category: "pens",
    price: 1290,
    icon: "✎",
    sale: true,
    description: "12 мягких цветов для конспектов, планеров и открыток."
  },
  {
    id: 2,
    name: "Тетрадь Soft Grid A5",
    category: "notebooks",
    price: 590,
    icon: "▤",
    sale: false,
    description: "Плотная обложка, клетка, 96 листов для учебы и работы."
  },
  {
    id: 3,
    name: "Папка-органайзер DocFlow",
    category: "folders",
    price: 1490,
    icon: "▣",
    sale: false,
    description: "Разделители, надежная застежка и место для важных бумаг."
  },
  {
    id: 4,
    name: "Маркеры Focus 6 цветов",
    category: "markers",
    price: 990,
    icon: "▰",
    sale: true,
    description: "Нежные оттенки для учебников, планов и рабочих заметок."
  },
  {
    id: 5,
    name: "Бумага OfficePro A4",
    category: "paper",
    price: 2190,
    icon: "□",
    sale: false,
    description: "500 листов, 80 г/м², чистая печать для документов."
  },
  {
    id: 6,
    name: "Скетчбук Art Start",
    category: "creative",
    price: 1690,
    icon: "◈",
    sale: false,
    description: "Плотная бумага для карандашей, линеров и быстрых идей."
  },
  {
    id: 7,
    name: "Школьный набор Base Pack",
    category: "notebooks",
    price: 3490,
    icon: "▦",
    sale: true,
    description: "Тетради, ручки, карандаши и папка в одном комплекте."
  },
  {
    id: 8,
    name: "Линеры InkPoint 0.5",
    category: "pens",
    price: 1190,
    icon: "╱",
    sale: false,
    description: "Черные линеры для схем, заметок, чертежей и скетчей."
  },
  {
    id: 9,
    name: "Стикеры Smart Notes",
    category: "paper",
    price: 690,
    icon: "▢",
    sale: false,
    description: "Пять цветов для напоминаний, книг и рабочих задач."
  }
];

const categoryNames = Object.fromEntries(categories.map((category) => [category.id, category.name]));
const state = {
  category: "all",
  query: "",
  cart: new Map()
};

const MAX_QTY = 100;

const categoryGrid = document.querySelector("#categoryGrid");
const filterButtons = document.querySelector("#filterButtons");
const productGrid = document.querySelector("#productGrid");
const searchInput = document.querySelector("#searchInput");
const resultInfo = document.querySelector("#resultInfo");
const cartPanel = document.querySelector("#cartPanel");
const cartItems = document.querySelector("#cartItems");
const cartEmpty = document.querySelector("#cartEmpty");
const cartCount = document.querySelector("#cartCount");
const cartTotal = document.querySelector("#cartTotal");
const checkoutButton = document.querySelector("#checkoutButton");

function formatPrice(value) {
  return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
}

function getFilteredProducts() {
  const query = state.query.trim().toLowerCase();

  return products.filter((product) => {
    const matchesCategory = state.category === "all" || product.category === state.category;
    const matchesSearch =
      !query ||
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      categoryNames[product.category].toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });
}

function renderCategories() {
  categoryGrid.innerHTML = categories
    .filter((category) => category.id !== "all")
    .map((category) => `
      <button class="category-card" type="button" data-category="${category.id}">
        <span class="category-icon">${category.icon}</span>
        <strong>${category.name}</strong>
        <span>${category.text}</span>
      </button>
    `)
    .join("");
}

function renderFilters() {
  filterButtons.innerHTML = categories
    .map((category) => `
      <button class="filter-button ${state.category === category.id ? "active" : ""}" type="button" data-category="${category.id}">
        ${category.name}
      </button>
    `)
    .join("");
}

function renderProducts() {
  const filteredProducts = getFilteredProducts();
  resultInfo.textContent = `Найдено: ${filteredProducts.length}`;

  if (!filteredProducts.length) {
    productGrid.innerHTML = `
      <article class="product-card">
        <div class="product-body">
          <h3>Ничего не найдено</h3>
          <p>Попробуйте изменить запрос или выбрать другую категорию.</p>
        </div>
      </article>
    `;
    return;
  }

  productGrid.innerHTML = filteredProducts
    .map((product) => `
      <article class="product-card ${product.sale ? "is-sale" : ""}">
        <div class="product-art" data-sale="Скидка">
          <span>${product.icon}</span>
        </div>
        <div class="product-body">
          <div class="product-meta">
            <span class="tag">${categoryNames[product.category]}</span>
            <span class="price">${formatPrice(product.price)}</span>
          </div>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
        </div>
        <button class="add-button" type="button" data-add="${product.id}">В корзину</button>
      </article>
    `)
    .join("");
}

function setCategory(categoryId) {
  state.category = categoryId;
  renderFilters();
  renderProducts();
  document.querySelector("#catalog").scrollIntoView({ behavior: "smooth", block: "start" });
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  const current = state.cart.get(productId) || { product, qty: 0 };
  current.qty = Math.min(current.qty + 1, MAX_QTY);
  state.cart.set(productId, current);
  renderCart();
}

function changeQty(productId, direction) {
  const current = state.cart.get(productId);
  if (!current) return;

  current.qty += direction;
  if (current.qty <= 0) {
    state.cart.delete(productId);
  } else {
    current.qty = Math.min(current.qty, MAX_QTY);
    state.cart.set(productId, current);
  }

  renderCart();
}

function setQty(productId, value) {
  const current = state.cart.get(productId);
  if (!current) return;

  const qty = Math.max(1, Math.min(MAX_QTY, Number(value) || 1));
  current.qty = qty;
  state.cart.set(productId, current);
  renderCart();
}

function removeFromCart(productId) {
  state.cart.delete(productId);
  renderCart();
}

function renderCart() {
  const items = Array.from(state.cart.values());
  const totalCount = items.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  cartCount.textContent = totalCount;
  cartTotal.textContent = formatPrice(totalPrice);
  cartEmpty.classList.toggle("visible", items.length === 0);
  checkoutButton.disabled = items.length === 0;

  cartItems.innerHTML = items
    .map(({ product, qty }) => `
      <article class="cart-item">
        <span class="cart-item-icon">${product.icon}</span>
        <div class="cart-item-info">
          <strong>${product.name}</strong>
          <span>${formatPrice(product.price)} за шт.</span>
        </div>
        <button class="remove-button" type="button" data-remove="${product.id}" aria-label="Удалить ${product.name} из корзины">x</button>
        <div class="qty-control">
          <button class="qty-button" type="button" data-qty="-1" data-id="${product.id}">-</button>
          <input class="qty-input" type="number" min="1" max="${MAX_QTY}" value="${qty}" data-input-qty data-id="${product.id}" aria-label="Количество ${product.name}">
          <button class="qty-button" type="button" data-qty="1" data-id="${product.id}">+</button>
        </div>
      </article>
    `)
    .join("");
}

function toggleCart(isOpen) {
  cartPanel.classList.toggle("open", isOpen);
  cartPanel.setAttribute("aria-hidden", String(!isOpen));
}

categoryGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (button) setCategory(button.dataset.category);
});

filterButtons.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (button) setCategory(button.dataset.category);
});

productGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (button) {
    addToCart(Number(button.dataset.add));
  }
});

cartItems.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove]");
  if (removeButton) {
    removeFromCart(Number(removeButton.dataset.remove));
    return;
  }

  const button = event.target.closest("[data-qty]");
  if (button) changeQty(Number(button.dataset.id), Number(button.dataset.qty));
});

cartItems.addEventListener("change", (event) => {
  const input = event.target.closest("[data-input-qty]");
  if (input) setQty(Number(input.dataset.id), input.value);
});

cartItems.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const input = event.target.closest("[data-input-qty]");
    if (input) input.blur();
  }
});

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderProducts();
});

document.querySelector("#openCart").addEventListener("click", () => toggleCart(true));
document.querySelector("#closeCart").addEventListener("click", () => toggleCart(false));
document.querySelector("#closeCartOverlay").addEventListener("click", () => toggleCart(false));

checkoutButton.addEventListener("click", () => {
  if (state.cart.size) {
    alert("Заявка собрана! В реальном магазине здесь будет форма контактов или оплата.");
  }
});

renderCategories();
renderFilters();
renderProducts();
renderCart();
