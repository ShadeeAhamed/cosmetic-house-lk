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

const token = process.env.INSTAGRAM_ACCESS_TOKEN;
const version = process.env.GRAPH_API_VERSION || "v25.0";

if (!token || token.startsWith("put_") || token.startsWith("your_")) {
  console.log("Missing INSTAGRAM_ACCESS_TOKEN in .env.whatsapp");
  process.exit(1);
}

async function getJson(url) {
  const response = await fetch(url);
  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
  process.exitCode = response.ok ? 0 : 1;
}

await getJson(`https://graph.instagram.com/${version}/me?fields=user_id,username,account_type,profile_picture_url&access_token=${encodeURIComponent(token)}`);
