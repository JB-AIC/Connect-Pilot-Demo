import { randomUUID } from "node:crypto";
import { createSeedAccount } from "./seed-data.js";

const COOKIE_NAME = "cc_session";
const SESSION_MAX_AGE_MS = 12 * 60 * 60 * 1000;

function parseCookies(header = "") {
  return Object.fromEntries(
    header
      .split(";")
      .map((part) => part.trim().split("="))
      .filter(([name]) => Boolean(name))
      .map(([name, ...value]) => [name, value.join("=")]),
  );
}

export function createSessionStore() {
  const sessions = new Map();

  function createSession() {
    const session = {
      id: randomUUID(),
      locale: "de",
      account: createSeedAccount(),
      pendingActions: new Map(),
      createdAt: Date.now(),
    };
    sessions.set(session.id, session);
    return session;
  }

  function ensureSession(request, response) {
    const cookies = parseCookies(request.headers.cookie);
    const existing = sessions.get(cookies[COOKIE_NAME]);

    if (existing && Date.now() - existing.createdAt < SESSION_MAX_AGE_MS) {
      return existing;
    }

    if (existing) {
      sessions.delete(existing.id);
    }

    const session = createSession();
    response.setHeader(
      "Set-Cookie",
      `${COOKIE_NAME}=${session.id}; HttpOnly; SameSite=Strict; Path=/; Max-Age=43200`,
    );
    return session;
  }

  function resetSession(session) {
    session.account = createSeedAccount();
    session.pendingActions.clear();
    return session.account;
  }

  return { ensureSession, resetSession, sessions };
}
