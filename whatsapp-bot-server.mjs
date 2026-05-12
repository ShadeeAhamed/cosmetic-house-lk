import http from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";

function loadEnvFile(file) {
  if (!existsSync(file)) return;
  const text = awaitableRead(file);
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [key, ...valueParts] = trimmed.split("=");
    if (!process.env[key]) process.env[key] = valueParts.join("=").replace(/^["']|["']$/g, "");
  }
}

function awaitableRead(file) {
  return existsSync(file) ? requireRead(file) : "";
}

function requireRead(file) {
  return globalThis.__whatsappEnvCache?.[file] || "";
}

globalThis.__whatsappEnvCache = {
  ".env.whatsapp": existsSync(".env.whatsapp") ? await readFile(".env.whatsapp", "utf8") : "",
  ".env": existsSync(".env") ? await readFile(".env", "utf8") : "",
};
loadEnvFile(".env.whatsapp");
loadEnvFile(".env");

const port = Number(process.env.PORT || 8787);
const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || "cosmetic-house-verify-token";
const accessToken = process.env.WHATSAPP_ACCESS_TOKEN || "";
const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || "";
const ownerNumber = process.env.OWNER_WHATSAPP_NUMBER || "94762245570";
const graphApiVersion = process.env.GRAPH_API_VERSION || "v20.0";
const businessName = process.env.BUSINESS_NAME || "Cosmetic House";
const botName = process.env.BOT_NAME || "Sophia";

let catalog = [];
let automationRules = {};
const customerSessions = new Map();

function normalize(value) {
  return String(value || "").toLowerCase();
}

function money(value) {
  return `LKR ${Number(value || 0).toLocaleString("en-LK", { maximumFractionDigits: 0 })}`;
}

function shortName(product) {
  return String(product?.name || "").replace(/\s+/g, " ").trim();
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch {
    return fallback;
  }
}

function inferBrand(product) {
  const name = normalize(`${product.name} ${product.brand}`).replace(/[.\-]/g, " ");
  const brands = [
    "The Ordinary",
    "Beauty of Joseon",
    "La Roche-Posay",
    "CeraVe",
    "Anua",
    "Medicube",
    "Laneige",
    "Biodance",
    "COSRX",
    "Cetaphil",
    "Neutrogena",
    "Dove",
    "EOS",
    "Innisfree",
    "Dr. Althea",
    "Torriden",
    "Rhode",
    "SKIN1004",
    "K Secret",
    "The Body Shop",
    "OGX",
    "Some By Mi",
    "Sol de Janeiro",
    "L'Oreal",
    "Nivea",
    "Johnson's",
    "Vaseline",
    "St. Ives",
    "Balance Active",
    "Fade Out",
    "Pixi",
    "Mielle",
    "Supergoop",
    "PanOxyl",
    "AXIS-Y",
    "Simple",
    "Pyary",
    "Yoko",
    "Fino",
    "TRESemme",
    "Tiam",
    "Round Lab",
    "Nature Republic",
    "Summer Fridays",
    "Numbuzin",
  ];
  return brands.find((brand) => name.includes(normalize(brand).replace(/[.\-]/g, " "))) || product.brand || "Beauty Edit";
}

function sanitizeProduct(product) {
  const { sourceUrl, ...cleanProduct } = product;
  const brand = inferBrand(product);
  return {
    ...cleanProduct,
    brand: /cosmo/i.test(brand) ? "Beauty Edit" : brand,
  };
}

async function loadData() {
  const rawCatalog = await readJson("catalog-data.json", []);
  catalog = rawCatalog.filter((product) => product.name && product.price).map(sanitizeProduct);
  automationRules = await readJson("whatsapp-automation-rules.json", {});
}

function productText(product) {
  return normalize(`${product.name} ${product.brand} ${product.category} ${product.type} ${product.note} ${product.description}`);
}

function wordsFrom(message) {
  return normalize(message)
    .split(/\W+/)
    .filter((word) => word.length > 2 && !["need", "want", "good", "best", "please", "product", "products", "suggest"].includes(word));
}

function findProducts(message, limit = 5) {
  const words = wordsFrom(message);
  const scored = catalog
    .map((product) => {
      const text = productText(product);
      const score = words.reduce((sum, word) => sum + (text.includes(word) ? 1 : 0), 0);
      return { product, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.product.price - b.product.price)
    .slice(0, limit)
    .map((item) => item.product);

  return scored.length ? scored : catalog.slice(0, limit);
}

function cheapestProducts(message, limit = 5) {
  const budget = extractBudget(message);
  const searchText = `${message} ${concernWords(message).join(" ")}`;
  return findProducts(searchText, 80)
    .filter((product) => !budget || product.price <= budget)
    .sort((a, b) => a.price - b.price)
    .slice(0, limit);
}

function concernWords(message) {
  const text = normalize(message);
  if (/oily|pimple|acne|blemish|pores/.test(text)) return ["acne", "blemish", "oily", "niacinamide", "salicylic", "cleanser", "serum", "sunscreen", "spf"];
  if (/dry|dehydrat|barrier|sensitive/.test(text)) return ["hyaluronic", "moisturizer", "cream", "barrier", "soothing", "gentle", "cleanser"];
  if (/bright|dark spot|pigment|glow|dull/.test(text)) return ["bright", "glow", "vitamin", "niacinamide", "sunscreen", "spf"];
  if (/hair|shampoo|frizz|damage/.test(text)) return ["shampoo", "conditioner", "mask", "hair"];
  return [];
}

function productLines(products) {
  return products.map((product, index) => `${index + 1}. ${shortName(product)} - ${money(product.price)}`).join("\n");
}

function detectIntent(message) {
  const text = normalize(message);
  if (/allergy|burn|swelling|infection|bleeding|doctor|dermatologist|pregnant|pregnancy|breastfeeding|complaint|refund|return|angry|wrong item|damaged|payment proof|paid|transfer slip|order status|tracking/.test(text)) return "owner_handoff";
  if (/hi|hello|hey|good morning|good evening|good afternoon/.test(text) && text.length < 30) return "greeting";
  if (/cheap|budget|lowest|affordable|price|under|below/.test(text)) return "budget";
  if (/routine|skin care|skincare|oily|dry|acne|pimple|sensitive|dark spot|glow|pores|blemish/.test(text)) return "routine";
  if (/price|available|availability|stock/.test(text)) return "price_check";
  if (/deliver|delivery|courier|islandwide|colombo|kandy|galle|jaffna|kurunegala|negombo|matara/.test(text)) return "delivery";
  if (/pay|payment|cod|cash|bank|card|visa|master|amex|transfer/.test(text)) return "payment";
  if (/order|buy|available|stock|cod|cash|bank|card|payment|delivery/.test(text)) return "order";
  if (/brand|ordinary|cerave|anua|cosrx|beauty of joseon|rhode|laneige|la roche/.test(text)) return "brand";
  if (/photo|image|face|upload|camera/.test(text)) return "image_help";
  if (/thank|thanks|ok|okay/.test(text) && text.length < 40) return "thanks";
  return "catalog";
}

function extractBudget(message) {
  const match = normalize(message).replace(/,/g, "").match(/(?:under|below|less than|budget|lkr|rs\.?)\s*(\d{3,6})|(\d{3,6})\s*(?:lkr|rs\.?|budget)/);
  return match ? Number(match[1] || match[2]) : null;
}

function pickOne(message, pattern, fallback = null) {
  return findProducts(`${message} ${pattern}`, 1)[0] || fallback;
}

function greetingLine() {
  return `Hi, this is ${botName} from ${businessName}.`;
}

function confirmationLine() {
  return "Before payment, I will confirm today's supplier price and availability for you.";
}

function humanClose() {
  return "Send me your skin type, main concern, current products, and budget so I can match it properly.";
}

function rememberCustomer(customerNumber, intent, message) {
  if (!customerNumber) return;
  const current = customerSessions.get(customerNumber) || { messages: 0 };
  customerSessions.set(customerNumber, {
    ...current,
    messages: current.messages + 1,
    lastIntent: intent,
    lastMessage: message,
    updatedAt: new Date().toISOString(),
  });
}

function routineReply(message) {
  const text = normalize(message);
  const oily = /oily|pimple|acne|blemish|pores/.test(text);
  const dry = /dry|dehydrat|barrier|sensitive/.test(text);
  const bright = /bright|dark spot|pigment|glow|dull/.test(text);
  const cleanser = pickOne(message, "cleanser face wash cleansing foam");
  const moisturizer = pickOne(message, "cream moisturizer lotion barrier");
  const sunscreen = pickOne(message, "sunscreen spf sun cream");
  const treatment = oily
    ? pickOne(message, "niacinamide salicylic acne blemish oil serum")
    : dry
      ? pickOne(message, "hyaluronic soothing barrier serum cream")
      : bright
        ? pickOne(message, "vitamin bright glow niacinamide serum")
        : pickOne(message, "serum ampoule toner");

  return [
    `${greetingLine()} I can help with a simple routine from products we have.`,
    "",
    `Morning: ${shortName(cleanser) || "Gentle cleanser"} -> ${shortName(treatment) || "Suitable serum"} -> ${shortName(moisturizer) || "Moisturizer"} -> ${shortName(sunscreen) || "Sunscreen SPF"}.`,
    `Night: cleanse -> ${shortName(treatment) || "Treatment step"} -> ${shortName(moisturizer) || "Moisturizer"}.`,
    "",
    "Start slowly, patch test, and do not add too many active products in one week.",
    humanClose(),
    confirmationLine(),
  ].join("\n");
}

function buildReply(message, customerNumber = "") {
  const intent = detectIntent(message);
  rememberCustomer(customerNumber, intent, message);

  if (intent === "owner_handoff") {
    return [
      `${greetingLine()} Thank you for telling me. I'll pass this to the owner for a careful human reply.`,
      "For irritation, allergy, swelling, infection, pregnancy-related concerns, or severe reactions, please speak with a dermatologist or doctor.",
      "Please send your order name/number, product name, and a clear photo if this is about an order issue.",
    ].join("\n");
  }

  if (intent === "greeting") {
    return [
      `${greetingLine()} Nice to hear from you.`,
      "Tell me what you're looking for: product name, skin type, concern, or budget.",
      "I can suggest products, build a simple routine, or help you place an order.",
      confirmationLine(),
    ].join("\n");
  }

  if (intent === "budget") {
    const products = cheapestProducts(message, 5);
    return [
      `${greetingLine()} These are some budget-friendly matches from our catalog:`,
      productLines(products),
      "",
      "Tell me your skin type and budget limit so I can build a proper morning/night routine.",
      confirmationLine(),
    ].join("\n");
  }

  if (intent === "routine") return routineReply(message);

  if (intent === "price_check") {
    const products = findProducts(message, 5);
    return [
      `${greetingLine()} I can check that for you.`,
      "Closest matches I found:",
      productLines(products),
      "",
      "Please send the exact product name or a screenshot if you have one.",
      confirmationLine(),
    ].join("\n");
  }

  if (intent === "delivery") {
    return [
      `${greetingLine()} Yes, we deliver islandwide in Sri Lanka.`,
      "Please send the product name, quantity, and delivery city. I'll prepare the order details and confirm the final cart total before payment.",
      confirmationLine(),
    ].join("\n");
  }

  if (intent === "payment") {
    return [
      `${greetingLine()} Payment options are cash on delivery, bank transfer, and online card payment after the secure gateway is connected.`,
      "For an order, send product name, quantity, city, and preferred payment method.",
      confirmationLine(),
    ].join("\n");
  }

  if (intent === "brand") {
    const products = findProducts(message, 6);
    return [
      `${greetingLine()} These brand/product options may suit your request:`,
      productLines(products),
      "",
      "For beginners, keep the routine simple: cleanser, one treatment, moisturizer, and sunscreen.",
      humanClose(),
    ].join("\n");
  }

  if (intent === "order") {
    return [
      `${greetingLine()} Sure, I can help place the order.`,
      "Please send:",
      "1. Product name",
      "2. Quantity",
      "3. Delivery city",
      "4. Preferred payment method: cash on delivery, bank transfer, or online card payment",
      "",
      confirmationLine(),
    ].join("\n");
  }

  if (intent === "image_help") {
    return [
      `${greetingLine()} You can send a clear face photo in natural light if you want routine guidance.`,
      "I can guide only for cosmetic concerns like oily look, dryness, dullness, or product matching. I cannot diagnose medical skin conditions.",
      humanClose(),
    ].join("\n");
  }

  if (intent === "thanks") {
    return [
      "You're welcome. Send me the product name or your skin concern anytime and I'll help you choose.",
      confirmationLine(),
    ].join("\n");
  }

  const products = findProducts(message, 4);
  return [
    `${greetingLine()} Thank you for messaging us.`,
    "Based on your message, these products may help:",
    productLines(products),
    "",
    humanClose(),
    confirmationLine(),
  ].join("\n");
}

async function sendWhatsAppMessage(to, text) {
  if (!accessToken || !phoneNumberId) {
    console.log("Reply preview:", { to, text });
    return;
  }

  const response = await fetch(`https://graph.facebook.com/${graphApiVersion}/${phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { preview_url: false, body: text },
    }),
  });

  if (!response.ok) {
    console.error("WhatsApp send failed:", await response.text());
  }
}

async function notifyOwner(customerNumber, incomingText, intent) {
  if (!ownerNumber || ownerNumber === customerNumber || !["owner_handoff", "order"].includes(intent)) return;
  const note = [
    `New ${businessName} WhatsApp lead`,
    `Customer: ${customerNumber}`,
    `Intent: ${intent}`,
    `Message: ${incomingText}`,
  ].join("\n");
  await sendWhatsAppMessage(ownerNumber, note);
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function send(response, status, body, contentType = "text/plain") {
  response.writeHead(status, { "Content-Type": contentType });
  response.end(body);
}

await loadData();

http
  .createServer(async (request, response) => {
    const url = new URL(request.url, `http://${request.headers.host}`);

    if (request.method === "GET" && url.pathname === "/health") {
      send(
        response,
        200,
        JSON.stringify(
          {
            ok: true,
            catalogProducts: catalog.length,
            apiConfigured: Boolean(accessToken && phoneNumberId),
            ownerNumberConfigured: Boolean(ownerNumber),
          },
          null,
          2,
        ),
        "application/json",
      );
      return;
    }

    if (request.method === "GET" && url.pathname === "/webhook") {
      const mode = url.searchParams.get("hub.mode");
      const token = url.searchParams.get("hub.verify_token");
      const challenge = url.searchParams.get("hub.challenge");
      if (mode === "subscribe" && token === verifyToken) {
        send(response, 200, challenge || "");
      } else {
        send(response, 403, "Verification failed");
      }
      return;
    }

    if (request.method === "POST" && url.pathname === "/webhook") {
      const payload = JSON.parse((await readBody(request)) || "{}");
      const messages = payload.entry?.flatMap((entry) => entry.changes || [])?.flatMap((change) => change.value?.messages || []) || [];

      for (const message of messages) {
        const from = message.from;
        const body = message.text?.body || "";
        if (from && body) {
          const intent = detectIntent(body);
          await sendWhatsAppMessage(from, buildReply(body, from));
          await notifyOwner(from, body, intent);
        }
      }

      send(response, 200, "EVENT_RECEIVED");
      return;
    }

    if (request.method === "POST" && url.pathname === "/preview") {
      const payload = JSON.parse((await readBody(request)) || "{}");
      const message = payload.message || "";
      send(response, 200, JSON.stringify({ intent: detectIntent(message), botName, reply: buildReply(message, payload.from || "preview") }, null, 2), "application/json");
      return;
    }

    send(response, 200, `${businessName} WhatsApp bot is running.`);
  })
  .listen(port, () => {
    console.log(`${businessName} WhatsApp bot running on http://localhost:${port}`);
  });
