import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ActionError, cancelAction, confirmAction } from "./server/actions.js";
import { actionSuccessMessage, handleAssistantMessage } from "./server/assistant.js";
import { optionallyRefineReply } from "./server/optional-openai.js";
import { createSessionStore } from "./server/sessions.js";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const MAX_BODY_BYTES = 48 * 1024;

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  response.end(JSON.stringify(payload));
}

async function readJson(request) {
  let raw = "";

  for await (const chunk of request) {
    raw += chunk;

    if (Buffer.byteLength(raw) > MAX_BODY_BYTES) {
      throw new ActionError("The request is too large.", "payload_too_large", 413);
    }
  }

  if (!raw.trim()) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw);

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Expected a JSON object.");
    }

    return parsed;
  } catch {
    throw new ActionError("The request body must be a JSON object.", "invalid_json", 400);
  }
}

function validateOrigin(request) {
  const origin = request.headers.origin;

  if (!origin) {
    return;
  }

  let parsed;

  try {
    parsed = new URL(origin);
  } catch {
    throw new ActionError("Invalid request origin.", "invalid_origin", 403);
  }

  if (parsed.host !== request.headers.host) {
    throw new ActionError("Cross-origin account actions are not allowed.", "invalid_origin", 403);
  }
}

async function serveBuiltAsset(request, response, requestPath) {
  const distRoot = path.resolve(projectRoot, "dist");
  const candidate = path.resolve(distRoot, `.${requestPath === "/" ? "/index.html" : requestPath}`);

  if (candidate !== distRoot && !candidate.startsWith(`${distRoot}${path.sep}`)) {
    sendJson(response, 403, { error: "Forbidden" });
    return;
  }

  try {
    const asset = await readFile(candidate);
    response.writeHead(200, {
      "Content-Type": contentTypes[path.extname(candidate)] ?? "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
    });
    response.end(asset);
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }

    if (path.extname(requestPath)) {
      sendJson(response, 404, { error: "Asset not found" });
      return;
    }

    try {
      const template = await readFile(path.join(distRoot, "index.html"), "utf8");
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end(template);
    } catch {
      sendJson(response, 503, { error: "Production assets not found. Run npm run build first." });
    }
  }
}

export async function createApplicationServer({ dev = false } = {}) {
  const sessionStore = createSessionStore();
  let vite;

  async function handleApi(request, response, requestPath) {
    if (requestPath === "/api/health" && request.method === "GET") {
      sendJson(response, 200, {
        status: "ok",
        application: "Connect Copilot",
        assistantMode: process.env.OPENAI_API_KEY ? "openai-optional" : "local",
      });
      return;
    }

    const session = sessionStore.ensureSession(request, response);

    if (request.method === "POST") {
      validateOrigin(request);
    }

    if (requestPath === "/api/session" && request.method === "GET") {
      sendJson(response, 200, {
        authenticated: true,
        locale: session.locale,
        customer: session.account.customer,
        assistantMode: process.env.OPENAI_API_KEY ? "openai-optional" : "local",
      });
      return;
    }

    if (requestPath === "/api/account" && request.method === "GET") {
      sendJson(response, 200, { account: session.account, locale: session.locale });
      return;
    }

    if (requestPath === "/api/activity" && request.method === "GET") {
      sendJson(response, 200, { events: session.account.auditEvents });
      return;
    }

    if (requestPath === "/api/language" && request.method === "POST") {
      const { locale } = await readJson(request);

      if (!new Set(["de", "en"]).has(locale)) {
        throw new ActionError("Supported languages are de and en.", "invalid_locale", 400);
      }

      session.locale = locale;
      sendJson(response, 200, { locale });
      return;
    }

    if (requestPath === "/api/reset" && request.method === "POST") {
      sendJson(response, 200, { account: sessionStore.resetSession(session), locale: session.locale });
      return;
    }

    if (requestPath === "/api/chat" && request.method === "POST") {
      const { message } = await readJson(request);

      if (typeof message !== "string" || !message.trim() || message.length > 2_000) {
        throw new ActionError("Provide a message between 1 and 2,000 characters.", "invalid_message", 400);
      }

      const localResponse = handleAssistantMessage(message, session);

      if (localResponse.resetRequested) {
        sessionStore.resetSession(session);
      }

      const assistantResponse = await optionallyRefineReply({
        message,
        response: localResponse,
        locale: session.locale,
      });

      sendJson(response, 200, {
        ...assistantResponse,
        account: localResponse.resetRequested ? session.account : undefined,
      });
      return;
    }

    if (requestPath === "/api/actions/confirm" && request.method === "POST") {
      const { token } = await readJson(request);
      const result = confirmAction(session, token);
      sendJson(response, 200, {
        ...result,
        reply: actionSuccessMessage(result.action, result.account, session.locale),
      });
      return;
    }

    if (requestPath === "/api/actions/cancel" && request.method === "POST") {
      const { token } = await readJson(request);
      sendJson(response, 200, cancelAction(session, token));
      return;
    }

    sendJson(response, 404, { error: "API route not found", code: "not_found" });
  }

  const httpServer = http.createServer(async (request, response) => {
    const requestPath = new URL(request.url ?? "/", "http://127.0.0.1").pathname;

    try {
      if (requestPath === "/api" || requestPath.startsWith("/api/")) {
        await handleApi(request, response, requestPath);
        return;
      }

      if (vite) {
        vite.middlewares(request, response, async () => {
          try {
            const source = await readFile(path.join(projectRoot, "index.html"), "utf8");
            const transformed = await vite.transformIndexHtml(request.url ?? "/", source);
            response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
            response.end(transformed);
          } catch (error) {
            vite.ssrFixStacktrace(error);
            sendJson(response, 500, { error: "Unable to render the application shell." });
          }
        });
        return;
      }

      await serveBuiltAsset(request, response, requestPath);
    } catch (error) {
      if (response.headersSent) {
        response.end();
        return;
      }

      if (error instanceof ActionError) {
        sendJson(response, error.status, { error: error.message, code: error.code });
        return;
      }

      console.error("Request failed:", error.message);
      sendJson(response, 500, { error: "The request could not be completed.", code: "internal_error" });
    }
  });

  if (dev) {
    const { createServer } = await import("vite");
    vite = await createServer({
      root: projectRoot,
      configFile: path.join(projectRoot, "vite.config.js"),
      appType: "custom",
      server: {
        middlewareMode: true,
        hmr: { server: httpServer },
      },
    });
  }

  return {
    server: httpServer,
    sessions: sessionStore.sessions,
    async close() {
      if (vite) {
        await vite.close();
      }

      if (httpServer.listening) {
        await new Promise((resolve, reject) => {
          httpServer.close((error) => (error ? reject(error) : resolve()));
        });
      }
    },
  };
}

const isEntryPoint = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isEntryPoint) {
  const port = Number(process.env.PORT || 4175);
  const host = process.env.HOST || "127.0.0.1";
  const application = await createApplicationServer({ dev: process.env.NODE_ENV !== "production" });

  application.server.listen(port, host, () => {
    console.log(`Connect Copilot is ready at http://${host}:${port}`);
    console.log(`Assistant mode: ${process.env.OPENAI_API_KEY ? "OpenAI optional" : "deterministic local"}`);
  });

  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, async () => {
      await application.close();
      process.exit(0);
    });
  }
}
