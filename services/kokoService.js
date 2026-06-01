import { KOKO_CONFIG } from "../config/koko.config.js";

export function calculateKokoInstallment(amount, installments = KOKO_CONFIG.installments) {
  const numericAmount = Number(amount || 0);
  return Math.ceil(numericAmount / installments);
}

export function formatLkr(amount) {
  return `LKR ${Number(amount || 0).toLocaleString("en-LK")}`;
}

export function buildKokoInstallmentMessage(amount) {
  return `Pay in ${KOKO_CONFIG.installments} Interest-Free Installments with KOKO - ${KOKO_CONFIG.installments} x ${formatLkr(
    calculateKokoInstallment(amount),
  )}`;
}

export function buildProductFeedItem(product) {
  const price = Number(product.price_lkr || product.price || 0);
  return {
    sku: product.sku || product.slug || product.id,
    title: product.title || product.name,
    brand: product.brand || "Cosmetic House LK",
    category: product.category || "Beauty",
    price_lkr: price,
    koko_installment_lkr: calculateKokoInstallment(price),
    image: product.image,
    url: product.url,
    availability: product.availability || "in_stock",
    currency: KOKO_CONFIG.currency,
  };
}

export function buildMerchantFeed(products = []) {
  const feedProducts = products.map(buildProductFeedItem);
  return {
    merchant: "Cosmetic House LK",
    currency: KOKO_CONFIG.currency,
    country: KOKO_CONFIG.country,
    installment_count: KOKO_CONFIG.installments,
    generated_at: new Date().toISOString(),
    products: feedProducts,
    inventory_sync: feedProducts.map((product) => ({
      sku: product.sku,
      availability: product.availability,
      product_url: product.url,
    })),
  };
}

export function buildInventorySyncPayload(products = []) {
  return {
    merchant_id: KOKO_CONFIG.merchantId,
    generated_at: new Date().toISOString(),
    inventory: products.map((product) => ({
      sku: product.sku || product.slug || product.id,
      quantity: Number(product.stock || product.quantity || 0),
      availability: product.availability || (Number(product.stock || 0) > 0 ? "in_stock" : "available_to_order"),
    })),
  };
}

export function buildKokoCheckoutPayload({ orderId, total, items = [], customer = {} }) {
  return {
    merchant_id: KOKO_CONFIG.merchantId,
    order_id: orderId,
    amount: Number(total || 0),
    currency: KOKO_CONFIG.currency,
    installments: KOKO_CONFIG.installments,
    success_url: `https://cosmetichouse.com.lk/payment-success.html?order=${encodeURIComponent(orderId || "")}`,
    cancel_url: `https://cosmetichouse.com.lk/payment-failed.html?order=${encodeURIComponent(orderId || "")}`,
    webhook_url: KOKO_CONFIG.webhook,
    customer,
    items: items.map(buildProductFeedItem),
  };
}

export async function createKokoCheckoutSession(order) {
  if (KOKO_CONFIG.status !== "LIVE" || !KOKO_CONFIG.apiKey || !KOKO_CONFIG.merchantId) {
    throw new Error("KOKO checkout is prepared but waiting for live merchant API activation.");
  }

  const response = await fetch(KOKO_CONFIG.endpoints.createSession, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${KOKO_CONFIG.apiKey}`,
    },
    body: JSON.stringify(buildKokoCheckoutPayload(order)),
  });

  if (!response.ok) {
    throw new Error("Could not create KOKO checkout session.");
  }

  return response.json();
}

export function verifyKokoWebhook(payload, signature) {
  return {
    verified: Boolean(payload && signature && KOKO_CONFIG.secret),
    status: "placeholder_until_official_koko_signature_docs_are_received",
  };
}
