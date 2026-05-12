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
const pin = process.env.WHATSAPP_REGISTRATION_PIN;
const version = process.env.GRAPH_API_VERSION || "v20.0";

if (!token || !phoneNumberId || !pin) {
  console.log("Missing WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID, or WHATSAPP_REGISTRATION_PIN in .env.whatsapp");
  process.exit(1);
}

const response = await fetch(`https://graph.facebook.com/${version}/${phoneNumberId}/register`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    messaging_product: "whatsapp",
    pin,
  }),
});

const data = await response.json();
console.log(JSON.stringify(data, null, 2));
process.exit(response.ok ? 0 : 1);
