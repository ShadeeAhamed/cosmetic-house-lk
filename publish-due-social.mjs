import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const graphVersion = process.env.GRAPH_API_VERSION || "v25.0";
const historyFile = "social-automation-data/publish-history.json";

async function loadEnv(file) {
  if (!existsSync(file)) return;
  const text = await readFile(file, "utf8");
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const [key, ...valueParts] = line.split("=");
    if (!process.env[key.trim()]) process.env[key.trim()] = valueParts.join("=").trim().replace(/^["']|["']$/g, "");
  }
}

function sriLankaNowParts(date = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Colombo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
}

function minutesOf(time) {
  const [hour, minute] = String(time || "20:30").split(":").map(Number);
  return hour * 60 + minute;
}

function cleanCaption(caption) {
  return String(caption || "")
    .split(/\r?\n/)
    .filter((line) => !/sophia|supplier|availability|internal/i.test(line))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function absolutize(url, base) {
  if (!url) return null;
  const clean = url.replaceAll("&amp;", "&").trim();
  if (clean.startsWith("//")) return `https:${clean}`;
  return new URL(clean, base).toString();
}

function pickOgImage(html, pageUrl) {
  const patterns = [
    /<meta\s+property=["']og:image:secure_url["']\s+content=["']([^"']+)["']/i,
    /<meta\s+content=["']([^"']+)["']\s+property=["']og:image:secure_url["']/i,
    /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i,
    /<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i,
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return absolutize(match[1], pageUrl);
  }
  return null;
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch {
    return fallback;
  }
}

async function writeJson(file, data) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

async function graphPost(endpoint, body) {
  const response = await fetch(`https://graph.facebook.com/${graphVersion}/${endpoint}`, {
    method: "POST",
    body,
  });
  const json = await response.json();
  if (!response.ok || json.error) throw new Error(json.error?.message || `HTTP ${response.status}`);
  return json;
}

async function publishFacebookPhoto({ pageId, accessToken, imagePath, caption }) {
  const file = await readFile(imagePath);
  const form = new FormData();
  form.set("caption", caption);
  form.set("published", "true");
  form.set("access_token", accessToken);
  form.set("source", new Blob([file], { type: "image/jpeg" }), path.basename(imagePath));
  return graphPost(`${pageId}/photos`, form);
}

async function publishInstagramPhoto({ igBusinessId, accessToken, imageUrl, caption }) {
  const createForm = new FormData();
  createForm.set("image_url", imageUrl);
  createForm.set("caption", caption);
  createForm.set("access_token", accessToken);
  const media = await graphPost(`${igBusinessId}/media`, createForm);

  const publishForm = new FormData();
  publishForm.set("creation_id", media.id);
  publishForm.set("access_token", accessToken);
  return graphPost(`${igBusinessId}/media_publish`, publishForm);
}

await loadEnv(".env.whatsapp");
await loadEnv(".env");

const now = sriLankaNowParts();
const calendar = await readJson("business-suite-calendar/meta-business-suite-30-day-calendar.json", []);
const catalog = await readJson("catalog-data.json", []);
const history = await readJson(historyFile, {});
const pageId = process.env.FACEBOOK_PAGE_ID;
const pageAccessToken = process.env.META_PAGE_ACCESS_TOKEN;
const instagramAccessToken = process.env.INSTAGRAM_ACCESS_TOKEN || pageAccessToken;
const igBusinessId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

const due = calendar
  .filter((entry) => entry.date >= now.date && entry.date <= "2026-06-16")
  .filter((entry) => entry.date < now.date || (entry.date === now.date && minutesOf(entry.time) <= now.minutes))
  .filter((entry) => entry.status !== "posted_manually")
  .find((entry) => !(history[entry.date]?.facebook?.posted && history[entry.date]?.instagram?.posted));

if (!due) {
  console.log(JSON.stringify({ ok: true, message: "No due social post right now.", checkedAt: now }, null, 2));
  process.exit(0);
}

const product = catalog.find((entry) => entry.image === due.imagePath || entry.name === due.productName);
const caption = cleanCaption(due.feedCaption);
const record = history[due.date] || { date: due.date, productName: due.productName, imagePath: due.imagePath, facebook: {}, instagram: {} };

if (!record.facebook?.posted) {
  try {
    record.facebook = {
      attemptedAt: new Date().toISOString(),
      result: await publishFacebookPhoto({ pageId, accessToken: pageAccessToken, imagePath: due.imagePath, caption }),
      posted: true,
    };
  } catch (error) {
    record.facebook = { attemptedAt: new Date().toISOString(), posted: false, error: error.message };
  }
}

if (!record.instagram?.posted) {
  try {
    if (!igBusinessId) throw new Error("INSTAGRAM_BUSINESS_ACCOUNT_ID is missing.");
    if (!product?.sourceUrl) throw new Error("No public image URL source is available for Instagram publishing.");
    const html = await (await fetch(product.sourceUrl)).text();
    const imageUrl = pickOgImage(html, product.sourceUrl);
    if (!imageUrl) throw new Error("No public product image URL found for Instagram.");
    record.instagram = {
      attemptedAt: new Date().toISOString(),
      imageUrl,
      result: await publishInstagramPhoto({ igBusinessId, accessToken: instagramAccessToken, imageUrl, caption }),
      posted: true,
    };
  } catch (error) {
    record.instagram = { attemptedAt: new Date().toISOString(), posted: false, error: error.message };
  }
}

history[due.date] = record;
await writeJson(historyFile, history);

console.log(JSON.stringify({ ok: true, checkedAt: now, published: record }, null, 2));
