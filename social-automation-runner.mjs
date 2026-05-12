import http from "node:http";
import { dailyContentKit, dueReminders, peakTimes, addContentToQueue } from "./social-automation-engine.mjs";

const port = Number(process.env.AUTOMATION_PORT || 8789);

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

function send(response, status, body, contentType = "application/json") {
  response.writeHead(status, { "Content-Type": contentType });
  response.end(body);
}

http
  .createServer(async (request, response) => {
    const url = new URL(request.url, `http://${request.headers.host}`);

    if (request.method === "GET" && url.pathname === "/automation/health") {
      send(response, 200, JSON.stringify({ ok: true, service: "Cosmetic House social automation" }, null, 2));
      return;
    }

    if (request.method === "GET" && url.pathname === "/automation/peak-times") {
      send(response, 200, JSON.stringify(await peakTimes(), null, 2));
      return;
    }

    if (request.method === "GET" && url.pathname === "/automation/daily-kit") {
      send(response, 200, JSON.stringify(await dailyContentKit(), null, 2));
      return;
    }

    if (request.method === "GET" && url.pathname === "/automation/reminders/due") {
      send(response, 200, JSON.stringify(await dueReminders(), null, 2));
      return;
    }

    if (request.method === "POST" && url.pathname === "/automation/queue") {
      const payload = JSON.parse((await readBody(request)) || "{}");
      send(response, 200, JSON.stringify(await addContentToQueue(payload), null, 2));
      return;
    }

    send(response, 404, JSON.stringify({ error: "Not found" }, null, 2));
  })
  .listen(port, () => {
    console.log(`Cosmetic House social automation running on http://localhost:${port}`);
  });
