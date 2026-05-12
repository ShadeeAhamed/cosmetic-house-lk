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

const token = process.env.WHATSAPP_ACCESS_TOKEN;
const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
const wabaId = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID;
const version = process.env.GRAPH_API_VERSION || "v20.0";

async function graph(path) {
  const response = await fetch(`https://graph.facebook.com/${version}/${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  return { ok: response.ok, data };
}

if (!token || !phoneNumberId) {
  console.log("Missing WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID in .env.whatsapp");
  process.exit(1);
}

const phone = await graph(`${phoneNumberId}?fields=id,display_phone_number,verified_name,quality_rating,status`);
console.log("Phone number status:");
console.log(JSON.stringify(phone.data, null, 2));

if (wabaId) {
  const numbers = await graph(`${wabaId}/phone_numbers?fields=id,display_phone_number,verified_name,quality_rating,status`);
  console.log("\nWhatsApp account numbers:");
  console.log(JSON.stringify(numbers.data, null, 2));
}
