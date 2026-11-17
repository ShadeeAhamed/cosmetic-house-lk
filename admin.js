const apiBase = (window.COSMETIC_HOUSE_PAYMENT_API || "").replace(/\/$/, "");
const orderStatuses = ["New Order", "Checkout Started", "Pending", "Confirmed", "Packed", "Dispatched", "Delivered", "Cancelled"];

const state = {
  pin: localStorage.getItem("cosmetic-house-admin-pin") || "",
  orders: [],
  users: [],
  visits: [],
  search: "",
  status: "",
};

const ordersEl = document.querySelector("[data-admin-orders]");
const statsEl = document.querySelector("[data-admin-stats]");
const usersEl = document.querySelector("[data-admin-users]");
const pinInput = document.querySelector("[data-admin-pin]");
const searchInput = document.querySelector("[data-admin-search]");
const statusFilter = document.querySelector("[data-admin-status-filter]");
const connectionEl = document.querySelector("[data-admin-connection]");

function money(value) {
  return `LKR ${Number(value || 0).toLocaleString("en-LK", { maximumFractionDigits: 0 })}`;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function setConnectionStatus(message, state = "info") {
  if (!connectionEl) return;
  connectionEl.textContent = message;
  connectionEl.dataset.state = state;
}

function localDateKey(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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

function localUsers() {
  try {
    const accounts = JSON.parse(localStorage.getItem("cosmetic-house-users") || "[]");
    if (Array.isArray(accounts) && accounts.length) return accounts;
    const account = JSON.parse(localStorage.getItem("cosmetic-house-account") || "null");
    return account ? [account] : [];
  } catch {
    return [];
  }
}

function localVisits() {
  try {
    return JSON.parse(localStorage.getItem("cosmetic-house-visits")) || [];
  } catch {
    return [];
  }
}

async function fetchOrders() {
  if (!apiBase) {
    state.orders = localOrders();
    state.users = localUsers();
    state.visits = localVisits();
    setConnectionStatus("Live order service is not configured. Only orders saved in this browser can be shown.", "error");
    render();
    return;
  }

  setConnectionStatus("Connecting to the live order service...", "info");
  try {
    const [ordersResponse, usersResponse, visitsResponse] = await Promise.all([
      fetch(`${apiBase}/api/orders`, { headers: headers(), cache: "no-store" }),
      fetch(`${apiBase}/api/users`, { headers: headers(), cache: "no-store" }),
      fetch(`${apiBase}/api/visits`, { headers: headers(), cache: "no-store" }),
    ]);
    const ordersPayload = await ordersResponse.json().catch(() => ({}));
    const usersPayload = await usersResponse.json().catch(() => ({}));
    const visitsPayload = await visitsResponse.json().catch(() => ({}));
    if (!ordersResponse.ok) {
      throw new Error(ordersPayload.message || (ordersResponse.status === 401 ? "Admin PIN was rejected." : "Could not load live orders."));
    }
    state.orders = ordersPayload.orders || [];
    state.users = usersResponse.ok ? usersPayload.users || [] : [];
    state.visits = visitsResponse.ok ? visitsPayload.visits || [] : [];
    setConnectionStatus(`Connected to live orders. Last refreshed ${new Date().toLocaleTimeString("en-LK")}.`, "success");
  } catch (error) {
    state.orders = [];
    state.users = [];
    state.visits = [];
    setConnectionStatus(
      error.message.includes("PIN")
        ? "Admin PIN rejected. Check the PIN and select Connect again."
        : "Live order service unavailable. No live orders are being displayed; try Refresh again.",
      "error",
    );
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
  const checkoutLeads = orders.filter((order) => String(order.source || "") === "website-shopify");
  const recordedOrders = orders.filter((order) => String(order.source || "") !== "website-shopify");
  const total = recordedOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const today = localDateKey(new Date());
  const todayOrders = recordedOrders.filter((order) => localDateKey(order.createdAt) === today).length;
  const pending = recordedOrders.filter((order) => !["Delivered", "Cancelled"].includes(order.status)).length;
  const todayUsers = state.users.filter((user) => localDateKey(user.createdAt) === today).length;
  const todayVisits = state.visits.filter((visit) => localDateKey(visit.createdAt) === today).length;
  statsEl.innerHTML = `
    <article><span>Orders in this dashboard</span><strong>${recordedOrders.length}</strong></article>
    <article><span>Today's recorded orders</span><strong>${todayOrders}</strong></article>
    <article><span>Open recorded orders</span><strong>${pending}</strong></article>
    <article><span>Shopify checkout starts</span><strong>${checkoutLeads.length}</strong></article>
    <article><span>User accounts</span><strong>${state.users.length}</strong><small>${todayUsers} today</small></article>
    <article><span>Website visits</span><strong>${state.visits.length}</strong><small>${todayVisits} today</small></article>
    <article><span>Recorded order value</span><strong>${money(total)}</strong></article>
  `;
}

function renderOrders() {
  const orders = filteredOrders();
  ordersEl.innerHTML = orders.length
    ? orders
        .map((order) => {
          const id = escapeHtml(order.id);
          const name = escapeHtml(order.customer?.name || "Customer");
          const phone = escapeHtml(order.customer?.phone || "No phone");
          const phoneDigits = String(order.customer?.phone || "").replace(/\D/g, "");
          const isCheckoutLead = String(order.source || "") === "website-shopify";
          const items = (order.items || []).map((item) => `${escapeHtml(item.name)} x${Number(item.quantity || 1)}`).join(", ");
          const paymentMethod = escapeHtml(order.paymentMethod || order.payment || "Payment pending");
          const paymentStatus = escapeHtml(order.paymentStatus || "Pending");
          const tracking = escapeHtml(order.tracking || "");
          const statusOptions = orderStatuses.map((status) =>
            `<option value="${escapeHtml(status)}" ${order.status === status ? "selected" : ""}>${escapeHtml(status)}</option>`
          ).join("");
          const whatsappText = encodeURIComponent(`Hi, your Cosmetic House order ${order.id} is ${order.status}.`);
          return `
            <article class="admin-order">
              <div class="admin-order-head">
                <div>
                  <strong>${id}</strong>
                  <span>${name} - ${phone}</span>
                  ${isCheckoutLead ? '<small class="admin-order-lead-note">Checkout started only. Check Shopify for a completed order.</small>' : ""}
                </div>
                <select data-status-order="${id}" ${isCheckoutLead ? "disabled aria-label=\"Shopify checkout lead status\"": ""}>
                  ${statusOptions}
                </select>
              </div>
              <p>${items}</p>
              <div class="admin-order-meta">
                <span>${paymentMethod}</span>
                <span>${paymentStatus}</span>
                <strong>${money(order.total)}</strong>
              </div>
              <label>
                <span>Tracking / note</span>
                <input value="${tracking}" data-tracking-order="${id}" placeholder="Courier tracking or internal note" />
              </label>
              <div class="admin-order-actions">
                ${isCheckoutLead ? "" : `<button type="button" data-save-order="${id}">Save update</button>`}
                <button type="button" data-invoice-order="${id}">Invoice</button>
                <a href="https://wa.me/${phoneDigits}?text=${whatsappText}" target="_blank" rel="noreferrer">WhatsApp update</a>
              </div>
            </article>
          `;
        })
        .join("")
    : `<p class="cart-note">No orders match this filter.</p>`;
}

function render() {
  renderStats();
  renderUsers();
  renderOrders();
}

function renderUsers() {
  if (!usersEl) return;
  const users = [...state.users]
    .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))
    .slice(0, 12);
  usersEl.innerHTML = users.length
    ? users
        .map((user) => `
            <article class="admin-customer-card">
              <div>
                <strong>${escapeHtml(user.name || "Customer")}</strong>
                <span>${escapeHtml(user.contact || "No contact saved")}</span>
              </div>
              <small>${escapeHtml(user.gender || "Not set")}${user.createdAt ? ` - ${new Date(user.createdAt).toLocaleDateString("en-LK")}` : ""}</small>
              <p>${escapeHtml(user.address || "No address saved yet.")}</p>
            </article>
          `)
        .join("")
    : `<p class="cart-note">No customer accounts yet. New website signups will appear here.</p>`;
}

async function updateOrder(id) {
  const status = document.querySelector(`[data-status-order="${id}"]`)?.value;
  const tracking = document.querySelector(`[data-tracking-order="${id}"]`)?.value || "";
  const body = { status, tracking, activityText: `Status changed to ${status}` };
  if (!apiBase) {
    const saved = localOrders();
    const index = saved.findIndex((order) => order.id === id);
    if (index >= 0) {
      const activity = [...(saved[index].activity || []), { at: new Date().toISOString(), text: body.activityText }];
      saved[index] = { ...saved[index], ...body, id, updatedAt: new Date().toISOString(), activity };
      localStorage.setItem("cosmetic-house-orders", JSON.stringify(saved.slice(0, 50)));
      await fetchOrders();
    }
    return;
  }
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
  const rows = (order.items || []).map((item) => `<tr><td>${escapeHtml(item.name)}</td><td>${Number(item.quantity || 1)}</td><td>${money(item.price)}</td></tr>`).join("");
  const html = `<h1>Cosmetic House LK Invoice</h1><p>Order: ${escapeHtml(order.id)}</p><p>Customer: ${escapeHtml(order.customer?.name || "")}</p><table>${rows}</table><h2>Total: ${money(order.total)}</h2>`;
  const win = window.open("", "_blank");
  if (!win) return;
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
    activity: [{ at: new Date().toISOString(), text: "Manual order created" }],
  };
  try {
    if (!apiBase) throw new Error("Local dashboard mode");
    const response = await fetch(`${apiBase}/api/orders`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(order),
    });
    if (!response.ok) throw new Error("Manual order failed");
  } catch (error) {
    setConnectionStatus("Manual order was not saved to the live service. Check the connection and Admin PIN.", "error");
    alert(error.message || "Could not save the manual order. Please try again.");
    return;
  }
  event.currentTarget.reset();
  await fetchOrders();
});

pinInput.value = state.pin;
fetchOrders();
if (apiBase) window.setInterval(fetchOrders, 60000);
