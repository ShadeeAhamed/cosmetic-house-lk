import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";

const envFiles = [".env.whatsapp", ".env"];

async function loadEnv(file) {
  if (!existsSync(file)) return;
  const text = await readFile(file, "utf8");
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const equalsAt = line.indexOf("=");
    const key = line.slice(0, equalsAt).trim();
    const value = line.slice(equalsAt + 1).trim().replace(/^["']|["']$/g, "");
    process.env[key] ||= value;
  }
}

for (const file of envFiles) await loadEnv(file);

const graphVersion = process.env.GRAPH_API_VERSION || "v25.0";
const pageId = process.env.FACEBOOK_PAGE_ID;
const accessToken = process.env.META_PAGE_ACCESS_TOKEN;

if (!pageId) throw new Error("FACEBOOK_PAGE_ID is missing.");
if (!accessToken) throw new Error("META_PAGE_ACCESS_TOKEN is missing.");

async function graph(endpoint, { method = "GET", body } = {}) {
  const response = await fetch(`https://graph.facebook.com/${graphVersion}/${endpoint}`, {
    method,
    body,
  });
  const text = await response.text();
  let json = {};
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }
  if (!response.ok || json.error) {
    throw new Error(json.error?.message || text || `HTTP ${response.status}`);
  }
  return json;
}

const subscribedFields = [
  "messages",
  "messaging_postbacks",
  "message_deliveries",
  "message_reads",
  "feed",
].join(",");

const body = new URLSearchParams({
  access_token: accessToken,
  subscribed_fields: subscribedFields,
});

await graph(`${pageId}/subscribed_apps`, { method: "POST", body });

const checkUrl = new URL(`https://graph.facebook.com/${graphVersion}/${pageId}/subscribed_apps`);
checkUrl.searchParams.set("access_token", accessToken);
checkUrl.searchParams.set("fields", "name,subscribed_fields");
const response = await fetch(checkUrl);
const json = await response.json();

console.log(JSON.stringify({
  ok: true,
  pageId,
  subscribedFields,
  currentSubscriptions: json.data || [],
}, null, 2));
