import http from "node:http";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { buildSocialReply, recordMessage } from "./social-automation-engine.mjs";

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

const port = Number(process.env.SOCIAL_BOT_PORT || 8788);
const verifyToken = process.env.META_VERIFY_TOKEN || process.env.WHATSAPP_VERIFY_TOKEN || "cosmetic-house-sophia-2026";
const pageAccessToken = process.env.META_PAGE_ACCESS_TOKEN || "";
const graphApiVersion = process.env.GRAPH_API_VERSION || "v20.0";
const businessName = process.env.BUSINESS_NAME || "Cosmetic House";
const botName = process.env.BOT_NAME || "Sophia";

function replyFor(message) {
  return buildSocialReply(message, { businessName, botName });
}

async function sendSocialMessage(recipientId, text) {
  if (!pageAccessToken) {
    console.log("Social reply preview:", { recipientId, text });
    return;
  }

  const response = await fetch(`https://graph.facebook.com/${graphApiVersion}/me/messages?access_token=${encodeURIComponent(pageAccessToken)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipient: { id: recipientId },
      messaging_type: "RESPONSE",
      message: { text },
    }),
  });

  if (!response.ok) {
    console.error("Social send failed:", await response.text());
  }
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

http
  .createServer(async (request, response) => {
    const url = new URL(request.url, `http://${request.headers.host}`);

    if (request.method === "GET" && url.pathname === "/meta-webhook") {
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

    if (request.method === "POST" && url.pathname === "/meta-webhook") {
      const payload = JSON.parse((await readBody(request)) || "{}");
      const entries = payload.entry || [];

      for (const entry of entries) {
        for (const event of entry.messaging || []) {
          const senderId = event.sender?.id;
          const text = event.message?.text;
          if (senderId && text) {
            await recordMessage({ channel: payload.object || "meta", customerId: senderId, text });
            const reply = replyFor(text);
            await sendSocialMessage(senderId, reply);
            await recordMessage({ channel: payload.object || "meta", customerId: senderId, text: reply, direction: "outbound" });
          }
        }
      }

      send(response, 200, "EVENT_RECEIVED");
      return;
    }

    if (request.method === "POST" && url.pathname === "/preview") {
      const payload = JSON.parse((await readBody(request)) || "{}");
      send(response, 200, JSON.stringify({ reply: replyFor(payload.message || "") }, null, 2), "application/json");
      return;
    }

    if (request.method === "GET" && url.pathname === "/health") {
      send(
        response,
        200,
        JSON.stringify({ ok: true, botName, pageTokenConfigured: Boolean(pageAccessToken), webhookPath: "/meta-webhook" }, null, 2),
        "application/json",
      );
      return;
    }

    send(response, 200, `${businessName} Facebook/Instagram bot is running.`);
  })
  .listen(port, () => {
    console.log(`${businessName} Facebook/Instagram bot running on http://localhost:${port}`);
  });
