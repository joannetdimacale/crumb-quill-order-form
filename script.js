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
  { id: "rolls-4-strawberry", category: "rolls", name: "Strawberry Cheesecake", price: 549, note: "Box of 4" },
  { id: "rolls-4-assorted", category: "rolls", name: "Assorted Box", price: 519, note: "2 Classic + 2 Strawberry" },
  { id: "rolls-4-cookie-dough", category: "rolls", name: "Cookie Dough Cinnamon Roll", price: 549, note: "Box of 4" },
  { id: "rolls-6-classic", category: "rolls", name: "Classic Cream Cheese", price: 649, note: "Box of 6" },
  { id: "rolls-6-strawberry", category: "rolls", name: "Strawberry Cheesecake", price: 779, note: "Box of 6" },
  { id: "rolls-6-assorted", category: "rolls", name: "Assorted Box", price: 739, note: "3 Classic + 3 Strawberry" },
  { id: "rolls-6-cookie-dough", category: "rolls", name: "Cookie Dough Cinnamon Roll", price: 799, note: "Box of 6" },

  { id: "cupcakes-4", category: "cupcakes", name: "Banana Cupcakes", price: 360, note: "Box of 4" },
  { id: "cupcakes-6", category: "cupcakes", name: "Banana Cupcakes", price: 520, note: "Box of 6" }
];

const grids = {
  cookies: document.querySelector("#cookies-grid"),
  rolls: document.querySelector("#rolls-grid"),
  cupcakes: document.querySelector("#cupcakes-grid")
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

products.forEach((product) => {
  grids[product.category].insertAdjacentHTML("beforeend", productCard(product));
});

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

function getSelections() {
  return products
    .map((product) => {
      const card = document.querySelector(`[data-product-id="${product.id}"]`);
      const qty = Number(card.querySelector("input").value || 0);
      return { ...product, qty, subtotal: qty * product.price };
    })
    .filter((item) => item.qty > 0);
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

  if (button.dataset.action === "increase") input.value = current + 1;
  if (button.dataset.action === "decrease") input.value = Math.max(0, current - 1);

  updateSummary();
});

document.addEventListener("input", (event) => {
  if (event.target.closest(".qty-control")) updateSummary();
});

fulfillment.addEventListener("change", () => {
  deliveryAddressWrap.classList.toggle("hidden", fulfillment.value !== "Delivery");
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  updateSummary();

  statusEl.textContent = "";
  statusEl.className = "";

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
