const apiBase = (window.COSMETIC_HOUSE_PAYMENT_API || "").replace(/\/$/, "");
const orderStatuses = ["New Order", "Pending", "Confirmed", "Packed", "Dispatched", "Delivered", "Cancelled"];

const state = {
  pin: localStorage.getItem("cosmetic-house-admin-pin") || "",
  orders: [],
  search: "",
  status: "",
};

const ordersEl = document.querySelector("[data-admin-orders]");
const statsEl = document.querySelector("[data-admin-stats]");
const pinInput = document.querySelector("[data-admin-pin]");
const searchInput = document.querySelector("[data-admin-search]");
const statusFilter = document.querySelector("[data-admin-status-filter]");

function money(value) {
  return `LKR ${Number(value || 0).toLocaleString("en-LK", { maximumFractionDigits: 0 })}`;
}

function headers() {
  return {
    "Content-Type": "application/json",
    "X-Admin-Pin": state.pin,
  };
}

function localOrders() {
  try {
    return JSON.parse(localStorage.getItem("cosmetic-house-orders")) || [];
  } catch {
    return [];
  }
}

async function fetchOrders() {
  if (!apiBase) {
    state.orders = localOrders();
    render();
    return;
  }
  try {
    const response = await fetch(`${apiBase}/api/orders`, { headers: headers(), cache: "no-store" });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.message || "Could not load orders.");
    state.orders = payload.orders || [];
  } catch {
    state.orders = localOrders();
  }
  render();
}

function filteredOrders() {
  const query = state.search.toLowerCase();
  return state.orders.filter((order) => {
    const text = JSON.stringify(order).toLowerCase();
    return (!state.status || order.status === state.status) && (!query || text.includes(query));
  });
}

function renderStats() {
  const orders = state.orders;
  const total = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const today = new Date().toISOString().slice(0, 10);
  const todayOrders = orders.filter((order) => String(order.createdAt || "").startsWith(today)).length;
  const pending = orders.filter((order) => !["Delivered", "Cancelled"].includes(order.status)).length;
  statsEl.innerHTML = `
    <article><span>Total orders</span><strong>${orders.length}</strong></article>
    <article><span>Today</span><strong>${todayOrders}</strong></article>
    <article><span>Open orders</span><strong>${pending}</strong></article>
    <article><span>Total sales</span><strong>${money(total)}</strong></article>
  `;
}

function renderOrders() {
  const orders = filteredOrders();
  ordersEl.innerHTML = orders.length
    ? orders
        .map(
          (order) => `
            <article class="admin-order">
              <div class="admin-order-head">
                <div>
                  <strong>${order.id}</strong>
                  <span>${order.customer?.name || "Customer"} - ${order.customer?.phone || "No phone"}</span>
                </div>
                <select data-status-order="${order.id}">
                  ${orderStatuses.map((status) => `<option ${order.status === status ? "selected" : ""}>${status}</option>`).join("")}
                </select>
              </div>
              <p>${(order.items || []).map((item) => `${item.name} x${item.quantity || 1}`).join(", ")}</p>
              <div class="admin-order-meta">
                <span>${order.paymentMethod || order.payment || "Payment pending"}</span>
                <span>${order.paymentStatus || "Pending"}</span>
                <strong>${money(order.total)}</strong>
              </div>
              <label>
                <span>Tracking / note</span>
                <input value="${order.tracking || ""}" data-tracking-order="${order.id}" placeholder="Courier tracking or internal note" />
              </label>
              <div class="admin-order-actions">
                <button type="button" data-save-order="${order.id}">Save update</button>
                <button type="button" data-invoice-order="${order.id}">Invoice</button>
                <a href="https://wa.me/${String(order.customer?.phone || "").replace(/\D/g, "")}?text=${encodeURIComponent(`Hi, your Cosmetic House order ${order.id} is ${order.status}.`)}" target="_blank" rel="noreferrer">WhatsApp update</a>
              </div>
            </article>
          `,
        )
        .join("")
    : `<p class="cart-note">No orders match this filter.</p>`;
}

function render() {
  renderStats();
  renderOrders();
}

async function updateOrder(id) {
  const status = document.querySelector(`[data-status-order="${id}"]`)?.value;
  const tracking = document.querySelector(`[data-tracking-order="${id}"]`)?.value || "";
  const body = { status, tracking, activityText: `Status changed to ${status}` };
  try {
    const response = await fetch(`${apiBase}/api/orders/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error("Update failed");
    await fetchOrders();
  } catch {
    alert("Could not update server order. Check the admin PIN and server connection.");
  }
}

function printInvoice(id) {
  const order = state.orders.find((item) => item.id === id);
  if (!order) return;
  const rows = (order.items || []).map((item) => `<tr><td>${item.name}</td><td>${item.quantity || 1}</td><td>${money(item.price)}</td></tr>`).join("");
  const html = `<h1>Cosmetic House LK Invoice</h1><p>Order: ${order.id}</p><p>Customer: ${order.customer?.name || ""}</p><table>${rows}</table><h2>Total: ${money(order.total)}</h2>`;
  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
  win.print();
}

document.querySelector("[data-admin-login]").addEventListener("submit", (event) => {
  event.preventDefault();
  state.pin = pinInput.value.trim();
  localStorage.setItem("cosmetic-house-admin-pin", state.pin);
  fetchOrders();
});

document.querySelector("[data-admin-refresh]").addEventListener("click", fetchOrders);
searchInput.addEventListener("input", (event) => {
  state.search = event.target.value;
  renderOrders();
});
statusFilter.addEventListener("change", (event) => {
  state.status = event.target.value;
  renderOrders();
});

ordersEl.addEventListener("click", (event) => {
  const save = event.target.closest("[data-save-order]");
  const invoice = event.target.closest("[data-invoice-order]");
  if (save) updateOrder(save.dataset.saveOrder);
  if (invoice) printInvoice(invoice.dataset.invoiceOrder);
});

document.querySelector("[data-manual-order]").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const price = Number(form.get("price") || 0);
  const delivery = Number(form.get("delivery") || 450);
  const order = {
    id: `CHLK-MANUAL-${Date.now()}`,
    source: "manual",
    status: "New Order",
    payment: form.get("payment"),
    customer: {
      name: form.get("customerName"),
      phone: form.get("customerPhone"),
      city: form.get("deliveryCity"),
      address: form.get("deliveryAddress"),
    },
    items: [{ name: form.get("productName"), price, quantity: 1 }],
    delivery,
    total: price + delivery,
    notes: form.get("notes"),
  };
  try {
    const response = await fetch(`${apiBase}/api/orders`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(order),
    });
    if (!response.ok) throw new Error("Manual order failed");
    event.currentTarget.reset();
    await fetchOrders();
  } catch {
    const saved = localOrders();
    saved.unshift(order);
    localStorage.setItem("cosmetic-house-orders", JSON.stringify(saved.slice(0, 50)));
    state.orders = saved;
    render();
  }
});

pinInput.value = state.pin;
fetchOrders();
