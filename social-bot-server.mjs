import http from "node:http";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { buildPublicCommentReply, buildSocialReply, recordMessage } from "./social-automation-engine.mjs";

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
const verifyToken = String(process.env.META_VERIFY_TOKEN || process.env.WHATSAPP_VERIFY_TOKEN || "cosmetic-house-sophia-2026").trim();
const pageAccessToken = process.env.META_PAGE_ACCESS_TOKEN || "";
const graphApiVersion = process.env.GRAPH_API_VERSION || "v20.0";
const businessName = process.env.BUSINESS_NAME || "Cosmetic House";
const botName = process.env.BOT_NAME || "Sophia";

function replyFor(message) {
  return buildSocialReply(message, { businessName, botName });
}

function commentReplyFor(message) {
  return buildPublicCommentReply(message, { businessName, botName });
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

async function graphPost(endpoint, payload) {
  if (!pageAccessToken) {
    console.log("Social graph preview:", { endpoint, payload });
    return { preview: true };
  }

  const body = new URLSearchParams({ access_token: pageAccessToken, ...payload });
  const response = await fetch(`https://graph.facebook.com/${graphApiVersion}/${endpoint}`, {
    method: "POST",
    body,
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok || json.error) {
    throw new Error(json.error?.message || `HTTP ${response.status}`);
  }
  return json;
}

async function replyToFacebookComment(commentId, text) {
  return graphPost(`${commentId}/comments`, { message: text });
}

async function replyToInstagramComment(commentId, text) {
  return graphPost(`${commentId}/replies`, { message: text });
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

function cleanPath(pathname) {
  return String(pathname || "").replace(/\/+$/, "") || "/";
}

http
  .createServer(async (request, response) => {
    const url = new URL(request.url, `http://${request.headers.host}`);

    if (request.method === "GET" && cleanPath(url.pathname) === "/meta-webhook") {
      const mode = String(url.searchParams.get("hub.mode") || "").trim();
      const token = String(url.searchParams.get("hub.verify_token") || "").trim();
      const challenge = url.searchParams.get("hub.challenge");
      console.log("Meta webhook verification", {
        mode,
        tokenMatched: token === verifyToken,
        hasChallenge: Boolean(challenge),
        host: request.headers.host,
        userAgent: request.headers["user-agent"],
      });
      if (mode === "subscribe" && token === verifyToken) {
        send(response, 200, challenge || "");
      } else {
        send(response, 403, "Verification failed");
      }
      return;
    }

    if (request.method === "POST" && cleanPath(url.pathname) === "/meta-webhook") {
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

        for (const change of entry.changes || []) {
          const value = change.value || {};
          const text = value.message || value.text || value.comment?.text || value.comment_text || "";
          const commentId = value.comment_id || value.id || value.comment?.id;
          const fromId = value.from?.id || value.sender_id || value.user_id || "public-comment";
          if (!commentId || !text || value.verb === "remove") continue;

          const reply = commentReplyFor(text);
          await recordMessage({ channel: payload.object || "meta-comment", customerId: fromId, text });

          try {
            if (payload.object === "instagram") {
              await replyToInstagramComment(commentId, reply);
            } else {
              await replyToFacebookComment(commentId, reply);
            }
            await recordMessage({ channel: payload.object || "meta-comment", customerId: fromId, text: reply, direction: "outbound" });
          } catch (error) {
            console.error("Comment reply failed:", error.message);
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
