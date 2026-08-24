const FORMSPREE_ENDPOINT = "https://formspree.io/f/xojzvzdn";

const products = [
  { id: "cookie-classic", category: "cookies", name: "Classic Chocolate Chip", price: 369, note: "Box of 6 — 70g each" },
  { id: "cookie-walnut", category: "cookies", name: "Chocolate Walnut", price: 399, note: "Box of 6 — 70g each" },
  { id: "cookie-espresso", category: "cookies", name: "Espresso Chocolate", price: 369, note: "Box of 6 — 70g each" },
  { id: "cookie-red-velvet", category: "cookies", name: "Red Velvet Cream Cheese", price: 429, note: "Box of 6 — 70g each" },
  { id: "cookie-assorted", category: "cookies", name: "Regular Assorted Box", price: 399, note: "Mixed regular flavors, box of 6" },

  { id: "premium-matcha-cloud", category: "cookies", name: "Strawberry Matcha Cloud", price: 649, note: "Premium stuffed cookies, box of 6" },
  { id: "premium-biscoff-affair", category: "cookies", name: "The Biscoff Affair", price: 699, note: "Premium stuffed cookies, box of 6" },
  { id: "premium-signature-assorted", category: "cookies", name: "Signature Assorted Box", price: 679, note: "3 Strawberry Matcha Cloud + 3 Biscoff Affair" },

  { id: "rolls-4-classic", category: "rolls", name: "Classic Cream Cheese", price: 420, note: "Box of 4" },
  { id: "rolls-6-classic", category: "rolls", name: "Classic Cream Cheese", price: 649, note: "Box of 6"},

  { id: "rolls-4-strawberry", category: "rolls", name: "Strawberry Bloom", price: 549, note: "Box of 4"},
  { id: "rolls-6-strawberry", category: "rolls", name: "Strawberry Bloom", price: 779, note: "Box of 6"},

  { id: "rolls-4-ensaymada", category: "rolls", name: "Ensaymada Rolls", price: 399, note: "Box of 4"},
  { id: "rolls-6-ensaymada", category: "rolls", name: "Ensaymada Rolls", price: 599, note: "Box of 6"},

  { id: "rolls-4-cookie-dough", category: "rolls", name: "Cookie Dough Dream", price: 549, note: "Box of 4"},
  { id: "rolls-6-cookie-dough", category: "rolls", name: "Cookie Dough Dream", price: 799, note: "Box of 6"},
  
  { id: "muffin-4", category: "muffin", name: "Banana Walnut Crumb Muffin", price: 360, note: "Box of 4" },
  { id: "muffin-6", category: "muffin", name: "Banana Walnut Crumb Muffin", price: 520, note: "Box of 6" }
  
];
const rollGroups = [
  {
    id: "classic",
    name: "Classic Cream Cheese",
    options: [
      { productId: "rolls-4-classic", label: "Box of 4", price: 420 },
      { productId: "rolls-6-classic", label: "Box of 6", price: 649 }
    ]
  },
  {
    id: "strawberry",
    name: "Strawberry Bloom",
    options: [
      { productId: "rolls-4-strawberry", label: "Box of 4", price: 549 },
      { productId: "rolls-6-strawberry", label: "Box of 6", price: 779 }
    ]
  },
  {
    id: "cookie-dough",
    name: "Cookie Dough Dream",
    options: [
      { productId: "rolls-4-cookie-dough", label: "Box of 4", price: 549 },
      { productId: "rolls-6-cookie-dough", label: "Box of 6", price: 779 }
    ]
  },
  {
    id: "ensaymada",
    name: "Ensaymada Rolls",
    options: [
      {productId: "rolls-4-ensaymada", label: "Box of 4", price: 399 },
      {productId: "rolls-6-ensaymada", label: "Box of 6", price: 599 }
      ]
  }
];

const customRollPrices = {
  4: 549,
  6: 779
};
const customCookieRates = {
  classic: 369 / 6,
  walnut: 399 / 6,
  espresso: 369 / 6,
  redVelvet: 429 / 6,
  matcha: 649 / 6,
  biscoff: 699 / 6
};

function roundCookieCustomPrice(amount) {
  return Math.ceil((amount - 9) / 10) * 10 + 9;
}
const grids = {
  cookies: document.querySelector("#cookies-grid"),
  rolls: document.querySelector("#rolls-grid"),
  muffin: document.querySelector("#muffin-grid")
};

const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0
});

function productCard(product) {
  const badge = product.badge ? `<span class="badge">${product.badge}</span>` : "";
  return `
    <article class="product-card" data-product-id="${product.id}">
      <div class="product-top">
        <div>
          <div class="product-name">${product.name}${badge}</div>
          <small>${product.note}</small>
        </div>
        <div class="price">${peso.format(product.price)}</div>
      </div>
      <div class="qty-control">
        <button type="button" aria-label="Decrease ${product.name}" data-action="decrease">−</button>
        <input type="number" min="0" value="0" inputmode="numeric" aria-label="${product.name} quantity" />
        <button type="button" aria-label="Increase ${product.name}" data-action="increase">+</button>
      </div>
    </article>
  `;
}

products
  .filter((product) => product.category !== "rolls")
  .forEach((product) => {
   console.log("Rendering:", product.id, product.category, grids[product.category]);

    if (!grids[product.category]) {
      console.error("MISSING GRID:", product.id, product.category);
      return;
    }
    grids[product.category].insertAdjacentHTML(
      "beforeend",
      productCard(product)
      );
  });

grids.cookies.insertAdjacentHTML(
  "beforeend",
  `
  <article class="product-card custom-cookie-card" id="custom-cookie-card">
    <div class="product-top">
      <div>
        <div class="product-name">Build Your Own Cookie Box</div>
        <small>Pick any 6 cookies from our lineup</small>
      </div>

      <div class="price" id="custom-cookie-price">₱0</div>
    </div>

    <div class="custom-flavors">
      <label>
        Classic Chocolate Chip
        <input id="custom-cookie-classic" type="number" min="0" max="6" value="0" inputmode="numeric">
      </label>

      <label>
        Chocolate Walnut
        <input id="custom-cookie-walnut" type="number" min="0" max="6" value="0" inputmode="numeric">
      </label>

      <label>
        Double Chocolate Espresso
        <input id="custom-cookie-espresso" type="number" min="0" max="6" value="0" inputmode="numeric">
      </label>

      <label>
        Red Velvet Cream Cheese
        <input id="custom-cookie-red-velvet" type="number" min="0" max="6" value="0" inputmode="numeric">
      </label>

      <label>
        Strawberry Matcha Cloud
        <input id="custom-cookie-matcha" type="number" min="0" max="6" value="0" inputmode="numeric">
      </label>

      <label>
        The Biscoff Affair
        <input id="custom-cookie-biscoff" type="number" min="0" max="6" value="0" inputmode="numeric">
      </label>
    </div>

    <small id="custom-cookie-status">0/6 cookies selected</small>

    <div class="qty-control">
      <button type="button" data-custom-cookie-action="decrease">−</button>

      <input
        id="custom-cookie-box-qty"
        type="number"
        min="0"
        value="0"
        inputmode="numeric"
        aria-label="Custom cookie box quantity"
      >

      <button type="button" data-custom-cookie-action="increase">+</button>
    </div>
  </article>
  `
);

function rollGroupCard(group) {
  const options = group.options
    .map(
      (option) =>
        `<option value="${option.productId}">
          ${option.label} — ${peso.format(option.price)}
        </option>`
    )
    .join("");

  return `
    <article class="product-card roll-group-card" data-roll-group="${group.id}">
      <div class="product-top">
        <div>
          <div class="product-name">${group.name}</div>
          <small>Choose your box size</small>
        </div>
      </div>

      <label>
        <span>Box size</span>
        <select class="roll-size">
          ${options}
        </select>
      </label>

      <div class="qty-control">
        <button type="button" data-action="decrease" aria-label="Decrease ${group.name}">−</button>
        <input type="number" min="0" value="0" inputmode="numeric" aria-label="${group.name} quantity" />
        <button type="button" data-action="increase" aria-label="Increase ${group.name}">+</button>
      </div>
    </article>
  `;
}

rollGroups.forEach((group) => {
  grids.rolls.insertAdjacentHTML("beforeend", rollGroupCard(group));
});

grids.rolls.insertAdjacentHTML(
  "beforeend",
  `
  <article class="product-card custom-roll-card" id="custom-roll-card">
    <div class="product-top">
      <div>
        <div class="product-name">Build Your Own Box</div>
        <small>Choose your box size and mix your flavors</small>
      </div>
      <div class="price" id="custom-roll-price">${peso.format(549)}</div>
    </div>

    <label>
      <span>Box size</span>
      <select id="custom-roll-size">
        <option value="4">Box of 4 — ${peso.format(549)}</option>
        <option value="6">Box of 6 — ${peso.format(779)}</option>
      </select>
    </label>

    <div class="custom-flavors">
      <label>
        Classic Cream Cheese
        <input id="custom-classic" type="number" min="0" value="0" inputmode="numeric">
      </label>

      <label>
        Strawberry Bloom
        <input id="custom-strawberry" type="number" min="0" value="0" inputmode="numeric">
      </label>

      <label>
        Cookie Dough Dream
        <input id="custom-cookie-dough" type="number" min="0" value="0" inputmode="numeric">
      </label>

      <label>
      Ensaymada Rolls
      <input id="custom-ensaymada" type="number" min="0" value="0" inputmode="numeric">
      </label>
    </div>

    <small id="custom-roll-status">Choose exactly 4 rolls.</small>

    <div class="qty-control">
      <button type="button" data-custom-action="decrease">−</button>
      <input id="custom-roll-box-qty" type="number" min="0" value="0" inputmode="numeric">
      <button type="button" data-custom-action="increase">+</button>
    </div>
  </article>
  `
);

const welcomeScreen = document.querySelector("#welcome-screen");
const enterBtn = document.querySelector("#enter-btn");
const summaryEl = document.querySelector("#order-summary");
const totalEl = document.querySelector("#order-total");
const downpaymentEl = document.querySelector("#order-downpayment");
const summaryField = document.querySelector("#order-summary-field");
const totalField = document.querySelector("#order-total-field");
const form = document.querySelector("#order-form");
const submitBtn = document.querySelector("#submit-btn");
const statusEl = document.querySelector("#form-status");
const fulfillment = document.querySelector("#fulfillment");
const preferredDate = document.querySelector("#preferred-date");
const deliveryAddressWrap = document.querySelector("#delivery-address-wrap");

enterBtn.addEventListener("click", () => {
  welcomeScreen.classList.add("hidden");
  document.querySelector(".hero").scrollIntoView({ behavior: "smooth" });
});

function formatFriday(date) {
  return date.toLocaleDateString("en-PH", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function isoDate(date) {
  const copy = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return copy.toISOString().slice(0, 10);
}

function populateFridays() {
  const now = new Date();
  const first = new Date(now);
  const day = first.getDay();
  let daysUntilFriday = (5 - day + 7) % 7;
  if (daysUntilFriday === 0 || day === 6) daysUntilFriday += 7;
  first.setDate(first.getDate() + daysUntilFriday);

  for (let i = 0; i < 8; i++) {
    const friday = new Date(first);
    friday.setDate(first.getDate() + i * 7);
    const option = document.createElement("option");
    option.value = isoDate(friday);
    option.textContent = formatFriday(friday);
    preferredDate.appendChild(option);
  }
}

function customRollIsValid() {
  const sizeEl = document.querySelector("#custom-roll-size");
  if (!sizeEl) return true;

  const size = Number(sizeEl.value);

  const classic = Number(document.querySelector("#custom-classic").value || 0);
  const strawberry = Number(document.querySelector("#custom-strawberry").value || 0);
  const cookieDough = Number(document.querySelector("#custom-cookie-dough").value || 0);
  const ensaymada = Number(document.querySelector("#custom-ensaymada").value || 0);

  return  classic + strawberry + cookieDough + ensaymada === size;
}

function updateCustomRollBox() {
  const sizeEl = document.querySelector("#custom-roll-size");
  if (!sizeEl) return;

  const size = Number(sizeEl.value);
  const price = customRollPrices[size];

  const classic = Number(document.querySelector("#custom-classic").value || 0);
  const strawberry = Number(document.querySelector("#custom-strawberry").value || 0);
  const cookieDough = Number(document.querySelector("#custom-cookie-dough").value || 0);
  const ensaymada = Number(document.querySelector("#custom-ensaymada").value ||0);

  const selected = classic + strawberry + cookieDough + ensaymada;

  document.querySelector("#custom-roll-price").textContent = peso.format(price);

  const status = document.querySelector("#custom-roll-status");

  if (selected === size) {
    status.textContent = `${selected}/${size} rolls selected ✓`;
  } else {
    status.textContent = `${selected}/${size} rolls selected`;
  }

  updateSummary();
}
function getCustomCookieData() {
  const counts = {
    classic: Number(document.querySelector("#custom-cookie-classic")?.value || 0),
    walnut: Number(document.querySelector("#custom-cookie-walnut")?.value || 0),
    espresso: Number(document.querySelector("#custom-cookie-espresso")?.value || 0),
    redVelvet: Number(document.querySelector("#custom-cookie-red-velvet")?.value || 0),
    matcha: Number(document.querySelector("#custom-cookie-matcha")?.value || 0),
    biscoff: Number(document.querySelector("#custom-cookie-biscoff")?.value || 0)
  };

  const totalCookies = Object.values(counts).reduce(
    (sum, qty) => sum + qty,
    0
  );

  const flavorCount = Object.values(counts).filter(
    (qty) => qty > 0
  ).length;

  const rawPrice =
    counts.classic * customCookieRates.classic +
    counts.walnut * customCookieRates.walnut +
    counts.espresso * customCookieRates.espresso +
    counts.redVelvet * customCookieRates.redVelvet +
    counts.matcha * customCookieRates.matcha +
    counts.biscoff * customCookieRates.biscoff;

  const price =
    totalCookies === 6
      ? roundCookieCustomPrice(rawPrice)
      : 0;

  return {
    counts,
    totalCookies,
    flavorCount,
    price
  };
}

function customCookieIsValid() {
  const data = getCustomCookieData();

  return (
    data.totalCookies === 6 &&
    data.flavorCount >= 2
  );
}

function updateCustomCookieBox() {
  const data = getCustomCookieData();

  const priceEl =
    document.querySelector("#custom-cookie-price");

  const statusEl =
    document.querySelector("#custom-cookie-status");

  if (priceEl) {
    priceEl.textContent =
      data.totalCookies === 6
        ? peso.format(data.price)
        : "₱0";
  }

  if (!statusEl) return;

  if (data.totalCookies > 6) {
    statusEl.textContent =
      `${data.totalCookies}/6 cookies selected — too many`;
  } else if (
    data.totalCookies === 6 &&
    data.flavorCount < 2
  ) {
    statusEl.textContent =
      "Please choose at least 2 flavors.";
  } else if (
    data.totalCookies === 6 &&
    data.flavorCount >= 2
  ) {
    statusEl.textContent =
      `6/6 cookies selected ✓`;
  } else {
    statusEl.textContent =
      `${data.totalCookies}/6 cookies selected`;
  }

  updateSummary();
}
function getSelections() {
  const selections = [];

  // Regular products: cookies and muffins
  products
    .filter((product) => product.category !== "rolls")
    .forEach((product) => {
      const card = document.querySelector(`[data-product-id="${product.id}"]`);
      if (!card) return;

      const qty = Number(card.querySelector("input").value || 0);

      if (qty > 0) {
        selections.push({
          ...product,
          qty,
          subtotal: qty * product.price
        });
      }
    });

  // Cinnamon roll flavor cards
  document.querySelectorAll(".roll-group-card").forEach((card) => {
    const productId = card.querySelector(".roll-size").value;
    const qty = Number(card.querySelector(".qty-control input").value || 0);

    if (qty <= 0) return;

    const product = products.find((item) => item.id === productId);
    if (!product) return;

    selections.push({
      ...product,
      qty,
      subtotal: qty * product.price
    });
  });

  // Custom cinnamon roll box
  const customQty = Number(
    document.querySelector("#custom-roll-box-qty")?.value || 0
  );

  if (customQty > 0 && customRollIsValid()) {
    const size = Number(document.querySelector("#custom-roll-size").value);

    const classic = Number(document.querySelector("#custom-classic").value || 0);
    const strawberry = Number(document.querySelector("#custom-strawberry").value || 0);
    const cookieDough = Number(document.querySelector("#custom-cookie-dough").value || 0);
    const ensaymada = Number(document.querySelector("#custom-ensaymada").value || 0)

    const price = customRollPrices[size];

    selections.push({
      id: `custom-roll-${size}`,
      category: "rolls",
      name: "Build Your Own Cinnamon Roll Box",
      price,
      note: `${classic} Classic + ${strawberry} Strawberry + ${cookieDough} Cookie Dough + ${ensaymada} Ensaymada`,
      qty: customQty,
      subtotal: customQty * price
    });
  }
const customCookieBoxQty = Number(
  document.querySelector("#custom-cookie-box-qty")?.value || 0
);

if (
  customCookieBoxQty > 0 &&
  customCookieIsValid()
) {
  const data = getCustomCookieData();

  const names = {
    classic: "Classic",
    walnut: "Walnut",
    espresso: "Espresso",
    redVelvet: "Red Velvet",
    matcha: "Matcha Cloud",
    biscoff: "Biscoff Affair"
  };

  const note = Object.entries(data.counts)
    .filter(([, qty]) => qty > 0)
    .map(([flavor, qty]) => `${qty} ${names[flavor]}`)
    .join(" + ");

  selections.push({
    id: "custom-cookie-box",
    category: "cookies",
    name: "Build Your Own Cookie Box",
    price: data.price,
    note,
    qty: customCookieBoxQty,
    subtotal: customCookieBoxQty * data.price
  });
}

  return selections;
}

function updateSummary() {
  const selections = getSelections();
  const total = selections.reduce((sum, item) => sum + item.subtotal, 0);
  const downpayment = Math.ceil(total * 0.5);

  if (!selections.length) {
    summaryEl.innerHTML = `<div class="summary-empty">No boxes selected yet.</div>`;
  } else {
    summaryEl.innerHTML = selections.map((item) => `
      <div class="summary-item">
        <span>${item.qty} × ${item.name}<br><small>${item.note}</small></span>
        <strong>${peso.format(item.subtotal)}</strong>
      </div>
    `).join("");
  }

  totalEl.textContent = peso.format(total);
  downpaymentEl.textContent = peso.format(downpayment);

  const summaryText = selections.map((item) =>
    `${item.qty} x ${item.name} (${item.note}) — ${peso.format(item.subtotal)}`
  ).join("\n");

  summaryField.value = summaryText || "No items selected";
  totalField.value = `${peso.format(total)} | 50% downpayment: ${peso.format(downpayment)}`;
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const card = button.closest(".product-card");
  const input = card.querySelector("input");
  const current = Number(input.value || 0);

  if (button.dataset.action === "increase") {
    input.value = current + 1;
  }

  if (button.dataset.action === "decrease") {
    input.value = Math.max(0, current - 1);
  }

  updateSummary();
});
document.addEventListener("input", (event) => {
  if (event.target.closest(".qty-control")) updateSummary();
});
document.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-custom-action]");
  if (!button) return;

  const input = document.querySelector("#custom-roll-box-qty");
  const current = Number(input.value || 0);

  if (button.dataset.customAction === "increase") {
    input.value = current + 1;
  }

  if (button.dataset.customAction === "decrease") {
    input.value = Math.max(0, current - 1);
  }

  updateSummary();
});
document.addEventListener("click", (event) => {
  const button = event.target.closest(
    "button[data-custom-cookie-action]"
  );

  if (!button) return;

  const input = document.querySelector(
    "#custom-cookie-box-qty"
  );

  const current = Number(input.value || 0);

  if (
    button.dataset.customCookieAction === "increase"
  ) {
    input.value = current + 1;
  }

  if (
    button.dataset.customCookieAction === "decrease"
  ) {
    input.value = Math.max(0, current - 1);
  }

  updateSummary();
});
document.addEventListener("input", (event) => {
  if (
    event.target.matches(
      "#custom-cookie-classic, " +
      "#custom-cookie-walnut, " +
      "#custom-cookie-espresso, " +
      "#custom-cookie-red-velvet, " +
      "#custom-cookie-matcha, " +
      "#custom-cookie-biscoff"
    )
  ) {
    updateCustomCookieBox();
  }

  if (
    event.target.matches("#custom-cookie-box-qty")
  ) {
    updateSummary();
  }
});
document.addEventListener("change", (event) => {
  if (event.target.matches(".roll-size")) {
    updateSummary();
  }

  if (event.target.matches("#custom-roll-size")) {
    updateCustomRollBox();
  }
});

document.addEventListener("input", (event) => {
  if (
    event.target.matches(
      "#custom-classic, #custom-strawberry, #custom-cookie-dough"
    )
  ) {
    updateCustomRollBox();
  }

  if (event.target.matches("#custom-roll-box-qty")) {
    updateSummary();
  }
});

fulfillment.addEventListener("change", () => {
  deliveryAddressWrap.classList.toggle("hidden", fulfillment.value !== "Delivery");
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  updateSummary();

  statusEl.textContent = "";
  statusEl.className = "";

  const customBoxQty = Number(
  document.querySelector("#custom-roll-box-qty")?.value || 0
);

if (customBoxQty > 0 && !customRollIsValid()) {
  statusEl.textContent =
    "Please complete your custom cinnamon roll box before submitting.";
  statusEl.className = "error";
  return;
}

  const customCookieBoxQty = Number(
  document.querySelector("#custom-cookie-box-qty")?.value || 0
);

if (
  customCookieBoxQty > 0 &&
  !customCookieIsValid()
) {
  statusEl.textContent =
    "Please complete your Build Your Own Cookie Box before submitting.";

  statusEl.className = "error";
  return;
}  
  if (!getSelections().length) {
    statusEl.textContent = "Choose at least one box before submitting.";
    statusEl.className = "error";
    return;
  }

  if (!form.checkValidity()) {
    statusEl.textContent = "Please complete the required fields.";
    statusEl.className = "error";
    form.reportValidity();
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";

  try {
    const formData = new FormData(form);
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      body: formData,
      headers: { "Accept": "application/json" }
    });

    if (!response.ok) throw new Error("Submission failed");

    form.reset();
    document.querySelectorAll(".qty-control input").forEach((input) => input.value = 0);
    deliveryAddressWrap.classList.add("hidden");
    preferredDate.innerHTML = `<option value="">Select a Friday</option>`;
    populateFridays();
    updateSummary();

    statusEl.textContent = "Order sent. We’ll review your slot and message you for confirmation.";
    statusEl.className = "success";
  } catch (error) {
    statusEl.textContent = "Something went wrong. Please try again or message Crumb & Quill directly.";
    statusEl.className = "error";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit order";
  }
});

populateFridays();
updateSummary();
