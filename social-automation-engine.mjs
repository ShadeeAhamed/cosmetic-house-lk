import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const dataDir = "social-automation-data";
const memoryFile = `${dataDir}/customer-memory.json`;
const eventsFile = `${dataDir}/message-events.json`;
const queueFile = `${dataDir}/content-queue.json`;

async function ensureDataFiles() {
  await mkdir(dataDir, { recursive: true });
  for (const [file, fallback] of [
    [memoryFile, {}],
    [eventsFile, []],
    [queueFile, []],
  ]) {
    if (!existsSync(file)) await writeJson(file, fallback);
  }
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch {
    return fallback;
  }
}

async function writeJson(file, data) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function normalize(value) {
  return String(value || "").toLowerCase();
}

export function detectIntent(message) {
  const text = normalize(message);
  if (/allergy|burn|swelling|infection|pregnant|pregnancy|refund|return|complaint|damaged|wrong item|payment proof|order status|tracking/.test(text)) return "handoff";
  if (/cheap|budget|lowest|affordable|price|under|below/.test(text)) return "budget";
  if (/routine|skin care|skincare|oily|dry|acne|pimple|sensitive|dark spot|glow|pores|blemish/.test(text)) return "routine";
  if (/deliver|delivery|courier|islandwide/.test(text)) return "delivery";
  if (/pay|payment|cod|cash|bank|card|visa|master|amex|transfer/.test(text)) return "payment";
  if (/order|buy|available|stock/.test(text)) return "order";
  return "general";
}

export function buildSocialReply(message, context = {}) {
  const intent = detectIntent(message);
  const businessName = context.businessName || "Cosmetic House";
  const botName = context.botName || "Sophia";
  const intro = `Hi, this is ${botName} from ${businessName}.`;
  const confirm = "Before payment, I will confirm today's supplier price and availability for you.";

  if (intent === "handoff") {
    return `${intro} Thank you for telling me. I'll pass this to the owner for a careful human reply.\n\nIf this is irritation, allergy, swelling, infection, or pregnancy-related, please speak with a dermatologist or doctor.\n\nPlease send your order name/number, product name, and a clear photo if this is about an order issue.`;
  }
  if (intent === "budget") return `${intro} Sure. Please send your budget, skin type, and main concern. I will suggest lower-price options first and keep the routine simple.\n\n${confirm}`;
  if (intent === "routine") return `${intro} I can help with a simple routine.\n\nPlease send:\n1. Skin type\n2. Main concern\n3. Current products\n4. Budget\n\nBasic order: cleanser, one treatment, moisturizer, and sunscreen in the morning. Start slowly and patch test.\n\n${confirm}`;
  if (intent === "delivery") return `${intro} Yes, we deliver islandwide in Sri Lanka. Please send product name, quantity, and delivery city. I will prepare the cart details before payment.\n\n${confirm}`;
  if (intent === "payment") return `${intro} Payment options are cash on delivery, bank transfer, and online card payment after the secure gateway is connected.\n\nSend product name, quantity, city, and preferred payment method.\n\n${confirm}`;
  if (intent === "order") return `${intro} Sure, I can help place the order.\n\nPlease send:\n1. Product name\n2. Quantity\n3. Delivery city\n4. Payment method\n\n${confirm}`;
  return `${intro} Nice to hear from you.\n\nTell me what you're looking for: product name, skin type, concern, or budget. I can suggest products, build a simple routine, or help you place an order.\n\n${confirm}`;
}

export async function recordMessage({ channel, customerId, text, direction = "inbound", timestamp = new Date().toISOString() }) {
  await ensureDataFiles();
  const intent = detectIntent(text);
  const events = await readJson(eventsFile, []);
  events.push({ channel, customerId, direction, intent, text, timestamp });
  await writeJson(eventsFile, events.slice(-5000));

  const memory = await readJson(memoryFile, {});
  const current = memory[customerId] || { customerId, channel, messageCount: 0, intents: {}, reminders: [] };
  current.channel = channel;
  current.messageCount += direction === "inbound" ? 1 : 0;
  current.lastMessage = text;
  current.lastIntent = intent;
  current.lastSeenAt = timestamp;
  current.intents[intent] = (current.intents[intent] || 0) + 1;
  if (["order", "budget", "routine"].includes(intent)) {
    current.reminders = buildReminderIdeas(current, text);
  }
  memory[customerId] = current;
  await writeJson(memoryFile, memory);
  return current;
}

function buildReminderIdeas(customer, text) {
  const now = Date.now();
  const base = [
    {
      dueAt: new Date(now + 24 * 60 * 60 * 1000).toISOString(),
      type: "follow_up",
      message: "Hi love, Sophia from Cosmetic House checking in. Do you still want me to confirm price and availability for the products we discussed?",
    },
  ];
  if (customer.lastIntent === "routine") {
    base.push({
      dueAt: new Date(now + 3 * 24 * 60 * 60 * 1000).toISOString(),
      type: "routine_check",
      message: "Hi love, just checking whether you want me to build the final morning/night routine with product names and budget options.",
    });
  }
  if (/paid|payment|bank|transfer|order/i.test(text)) {
    base.push({
      dueAt: new Date(now + 12 * 60 * 60 * 1000).toISOString(),
      type: "payment_check",
      message: "Hi love, please send payment proof/order details if you want us to confirm the order today.",
    });
  }
  return base;
}

export async function dueReminders(now = new Date()) {
  await ensureDataFiles();
  const memory = await readJson(memoryFile, {});
  const due = [];
  for (const customer of Object.values(memory)) {
    for (const reminder of customer.reminders || []) {
      if (!reminder.sentAt && new Date(reminder.dueAt) <= now) {
        due.push({ customerId: customer.customerId, channel: customer.channel, ...reminder });
      }
    }
  }
  return due;
}

export async function peakTimes() {
  await ensureDataFiles();
  const events = await readJson(eventsFile, []);
  const buckets = {};
  for (const event of events.filter((item) => item.direction === "inbound")) {
    const date = new Date(event.timestamp);
    if (Number.isNaN(date.getTime())) continue;
    const hour = date.getHours();
    buckets[hour] = (buckets[hour] || 0) + 1;
  }
  const ranked = Object.entries(buckets)
    .map(([hour, count]) => ({ hour: Number(hour), label: `${String(hour).padStart(2, "0")}:00`, count }))
    .sort((a, b) => b.count - a.count || a.hour - b.hour);
  return ranked.slice(0, 5);
}

export async function dailyContentKit(date = new Date()) {
  const peaks = await peakTimes();
  const bestTime = peaks[0]?.label || "20:00";
  const isoDate = date.toISOString().slice(0, 10);
  return {
    date: isoDate,
    bestPostingTime: bestTime,
    story: {
      title: "Today skin check",
      frames: [
        "Frame 1: What is your skin concern today? Oily, dry, dark spots, or acne?",
        "Frame 2: Reply with your skin type and budget for a simple routine match.",
        "Frame 3: DM us to order your beauty picks.",
      ],
    },
    post: {
      caption:
        "Glow starts with a routine you can actually keep. Cleanser, treatment, moisturizer, SPF - simple steps, pretty results. DM us your skin type and beauty goal to find your next match.",
      hashtags: ["#cosmetic_house_lk", "#CosmeticHouseLK", "#SkincareSriLanka", "#SriLankaBeauty", "#GlowRoutine", "#ColomboBeauty", "#OnlineShoppingSriLanka"],
    },
    reel: {
      idea: "Fast 12-second routine reel: cleanser -> serum -> moisturizer -> sunscreen, ending with 'DM us your skin goal'.",
      shotList: ["Product shelf pan", "Close-up of serum texture", "Routine steps text overlay", "CTA to DM us"],
    },
  };
}

export async function addContentToQueue(item) {
  await ensureDataFiles();
  const queue = await readJson(queueFile, []);
  const queued = { id: `content-${Date.now()}`, status: "draft", ...item };
  queue.push(queued);
  await writeJson(queueFile, queue);
  return queued;
}
