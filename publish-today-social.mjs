import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const graphVersion = process.env.GRAPH_API_VERSION || "v25.0";
const envFiles = [".env.whatsapp", ".env"];

function loadEnvFile(file) {
  if (!existsSync(file)) return;
  const lines = requireText(file).split(/\r?\n/);
  let lastKey = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const equalsAt = line.indexOf("=");
    if (equalsAt > 0) {
      const key = line.slice(0, equalsAt).trim();
      const value = line.slice(equalsAt + 1).trim().replace(/^["']|["']$/g, "");
      process.env[key] = process.env[key] || value;
      lastKey = key;
      continue;
    }

    if (lastKey && /^[A-Za-z0-9_\-]+$/.test(line)) {
      process.env[lastKey] = `${process.env[lastKey] || ""}${line}`;
    }
  }
}

function requireText(file) {
  return globalThis.__envText?.[file] || "";
}

globalThis.__envText = Object.fromEntries(
  await Promise.all(envFiles.map(async (file) => [file, existsSync(file) ? await readFile(file, "utf8") : ""])),
);
for (const file of envFiles) loadEnvFile(file);

function todayInSriLanka() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Colombo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
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

async function graphPost(endpoint, body) {
  const response = await fetch(`https://graph.facebook.com/${graphVersion}/${endpoint}`, {
    method: "POST",
    body,
  });
  const json = await response.json();
  if (!response.ok || json.error) throw new Error(json.error?.message || `HTTP ${response.status}`);
  return json;
}

async function graphGet(endpoint, accessToken) {
  const url = new URL(`https://graph.facebook.com/${graphVersion}/${endpoint}`);
  url.searchParams.set("access_token", accessToken);
  const response = await fetch(url);
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

async function findInstagramBusinessId({ pageId, accessToken }) {
  const configured = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
  if (configured && configured !== "not_available_yet") return configured;

  try {
    const page = await graphGet(`${pageId}?fields=instagram_business_account{id,username},connected_instagram_account{id,username}`, accessToken);
    return page.instagram_business_account?.id || page.connected_instagram_account?.id || null;
  } catch {
    return null;
  }
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

const date = process.argv[2] || todayInSriLanka();
const calendar = JSON.parse(await readFile("business-suite-calendar/meta-business-suite-30-day-calendar.json", "utf8"));
const catalog = JSON.parse(await readFile("catalog-data.json", "utf8"));
const item = calendar.find((entry) => entry.date === date) || calendar[0];
const product = catalog.find((entry) => entry.image === item.imagePath || entry.name === item.productName);
const caption = cleanCaption(item.feedCaption);
const report = {
  date,
  productName: item.productName,
  imagePath: item.imagePath,
  caption,
  facebook: { attempted: false },
  instagram: { attempted: false },
};

const pageId = process.env.FACEBOOK_PAGE_ID;
const pageAccessToken = process.env.META_PAGE_ACCESS_TOKEN;
const instagramAccessToken = process.env.INSTAGRAM_ACCESS_TOKEN || pageAccessToken;

if (!pageId || !pageAccessToken) {
  report.facebook = { attempted: false, error: "FACEBOOK_PAGE_ID or META_PAGE_ACCESS_TOKEN is missing" };
} else {
  try {
    report.facebook.attempted = true;
    report.facebook.result = await publishFacebookPhoto({
      pageId,
      accessToken: pageAccessToken,
      imagePath: item.imagePath,
      caption,
    });
  } catch (error) {
    report.facebook.error = error.message;
  }
}

try {
  const igBusinessId = pageId && pageAccessToken ? await findInstagramBusinessId({ pageId, accessToken: pageAccessToken }) : null;
  if (!igBusinessId) {
    report.instagram = { attempted: false, error: "Instagram business account ID is not available through the current token" };
  } else if (!product?.sourceUrl) {
    report.instagram = { attempted: false, error: "No public image URL source is available for Instagram publishing" };
  } else {
    const html = await (await fetch(product.sourceUrl)).text();
    const imageUrl = pickOgImage(html, product.sourceUrl);
    if (!imageUrl) throw new Error("No public product image URL found for Instagram");
    report.instagram.attempted = true;
    report.instagram.imageUrl = imageUrl;
    report.instagram.result = await publishInstagramPhoto({
      igBusinessId,
      accessToken: instagramAccessToken,
      imageUrl,
      caption,
    });
  }
} catch (error) {
  report.instagram.error = error.message;
}

await writeFile("social-automation-data/last-publish-report.json", `${JSON.stringify(report, null, 2)}\n`, "utf8");

console.log(JSON.stringify({
  date: report.date,
  productName: report.productName,
  facebook: report.facebook.result ? "posted" : `not posted: ${report.facebook.error}`,
  instagram: report.instagram.result ? "posted" : `not posted: ${report.instagram.error}`,
  reportFile: "social-automation-data/last-publish-report.json",
}, null, 2));
