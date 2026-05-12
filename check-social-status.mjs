import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";

async function loadEnv(file) {
  if (!existsSync(file)) return;
  const text = await readFile(file, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const [key, ...valueParts] = trimmed.split("=");
    if (!process.env[key.trim()]) process.env[key.trim()] = valueParts.join("=").trim().replace(/^["']|["']$/g, "");
  }
}

await loadEnv(".env.whatsapp");
await loadEnv(".env");

const pageToken = process.env.META_PAGE_ACCESS_TOKEN;
const userToken = process.env.INSTAGRAM_ACCESS_TOKEN || process.env.WHATSAPP_ACCESS_TOKEN;
const pageId = process.env.FACEBOOK_PAGE_ID;
const instagramId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
const version = process.env.GRAPH_API_VERSION || "v20.0";

async function graph(path, label, token) {
  if (!token) {
    console.log(`${label}: missing token`);
    return;
  }
  const response = await fetch(`https://graph.facebook.com/${version}/${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  console.log(`\n${label}:`);
  console.log(JSON.stringify(data, null, 2));
}

await graph("me/accounts?fields=id,name,instagram_business_account{id,username,name},tasks", "Pages visible to user token", userToken);
if (pageId) await graph(`${pageId}?fields=id,name,link,instagram_business_account{id,username,name},connected_instagram_account{id,username}`, "Configured Facebook Page", pageToken || userToken);
if (pageId && userToken) await graph(`${pageId}?fields=id,name,link,instagram_business_account{id,username,name},connected_instagram_account{id,username}`, "Configured Facebook Page via user token", userToken);
if (instagramId) await graph(`${instagramId}?fields=id,username,name,profile_picture_url`, "Configured Instagram account", pageToken || userToken);
