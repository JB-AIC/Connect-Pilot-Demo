import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import { createApplicationServer } from "../server.js";

let application;
let baseUrl;

before(async () => {
  application = await createApplicationServer({ dev: false });
  await new Promise((resolve) => application.server.listen(0, "127.0.0.1", resolve));
  const address = application.server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await application.close();
});

async function createClient() {
  const sessionResponse = await fetch(`${baseUrl}/api/session`);
  const cookie = sessionResponse.headers.get("set-cookie").split(";")[0];
  const session = await sessionResponse.json();

  async function request(path, { method = "GET", body, origin } = {}) {
    const headers = { Cookie: cookie };
    if (body !== undefined) headers["Content-Type"] = "application/json";
    if (origin) headers.Origin = origin;

    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    return { status: response.status, body: await response.json(), response };
  }

  return { session, cookie, request };
}

test("health endpoint works without an API key", async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  const body = await response.json();
  assert.equal(response.status, 200);
  assert.equal(body.application, "Connect Copilot");
  assert.ok(["local", "openai-optional"].includes(body.assistantMode));
});

test("sessions are authenticated, German-first, and backed by fictional customer data", async () => {
  const client = await createClient();
  const result = await client.request("/api/account");
  assert.equal(client.session.authenticated, true);
  assert.equal(client.session.locale, "de");
  assert.equal(result.body.account.customer.displayName, "Lara Weber");
  assert.equal(result.body.account.billing.currentBillTotal, 87.95);
  assert.equal(result.body.account.mobilePlan.remainingDataGb, 18);
});

test("language switching changes subsequent assistant responses to English", async () => {
  const client = await createClient();
  const language = await client.request("/api/language", { method: "POST", body: { locale: "en" } });
  assert.equal(language.status, 200);

  const chat = await client.request("/api/chat", {
    method: "POST",
    body: { message: "Why is my bill 18 euros higher?" },
  });
  assert.equal(chat.body.intent, "explain_bill");
  assert.match(chat.body.reply, /Switzerland/);
});

test("complete travel-pass workflow requires confirmation and updates account state", async () => {
  const client = await createClient();
  const recommendation = await client.request("/api/chat", {
    method: "POST",
    body: { message: "Aktiviere bitte den Schweiz Travel Pass." },
  });
  assert.equal(recommendation.body.proposal.type, "activate_travel_pass");

  const unchanged = await client.request("/api/account");
  assert.equal(unchanged.body.account.mobilePlan.activeAddOns.length, 0);

  const confirmed = await client.request("/api/actions/confirm", {
    method: "POST",
    body: { token: recommendation.body.proposal.token },
  });
  assert.equal(confirmed.status, 200);
  assert.equal(confirmed.body.account.mobilePlan.activeAddOns[0].id, "switzerland-pass");
  assert.equal(confirmed.body.auditEvent.action, "travel_pass_activated");

  const replay = await client.request("/api/actions/confirm", {
    method: "POST",
    body: { token: recommendation.body.proposal.token },
  });
  assert.equal(replay.status, 404);
  assert.equal(replay.body.code, "invalid_token");
});

test("tokens from one simulated customer session cannot be used by another", async () => {
  const first = await createClient();
  const second = await createClient();
  const proposal = await first.request("/api/chat", {
    method: "POST",
    body: { message: "Aktiviere den Schweiz Travel Pass." },
  });
  const stolen = await second.request("/api/actions/confirm", {
    method: "POST",
    body: { token: proposal.body.proposal.token },
  });
  assert.equal(stolen.status, 404);
  assert.equal((await second.request("/api/account")).body.account.mobilePlan.activeAddOns.length, 0);
});

test("cross-origin state-changing requests are rejected", async () => {
  const client = await createClient();
  const result = await client.request("/api/reset", {
    method: "POST",
    body: {},
    origin: "https://example.invalid",
  });
  assert.equal(result.status, 403);
  assert.equal(result.body.code, "invalid_origin");
});

test("SIM blocking, notifications, and reset complete successfully", async () => {
  const client = await createClient();
  const sim = await client.request("/api/chat", {
    method: "POST",
    body: { message: "Bitte sperre meine SIM." },
  });
  await client.request("/api/actions/confirm", { method: "POST", body: { token: sim.body.proposal.token } });

  const notification = await client.request("/api/chat", {
    method: "POST",
    body: { message: "Benachrichtige mich, wenn die Störung behoben ist." },
  });
  const confirmed = await client.request("/api/actions/confirm", {
    method: "POST",
    body: { token: notification.body.proposal.token },
  });
  assert.equal(confirmed.body.account.homeInternet.restorationNotificationRequested, true);
  assert.equal(confirmed.body.account.simCards[0].status, "blocked");

  const reset = await client.request("/api/reset", { method: "POST", body: {} });
  assert.equal(reset.body.account.simCards[0].status, "active");
  assert.equal(reset.body.account.homeInternet.restorationNotificationRequested, false);
  assert.equal(reset.body.account.auditEvents.length, 2);
});

test("invalid locale, invalid message, and unknown routes return explicit errors", async () => {
  const client = await createClient();
  const locale = await client.request("/api/language", { method: "POST", body: { locale: "fr" } });
  const message = await client.request("/api/chat", { method: "POST", body: { message: "" } });
  const missing = await client.request("/api/missing");
  assert.equal(locale.status, 400);
  assert.equal(message.status, 400);
  assert.equal(missing.status, 404);
});

test("cancelling an action leaves the customer account unchanged", async () => {
  const client = await createClient();
  const proposal = await client.request("/api/chat", {
    method: "POST",
    body: { message: "Ich möchte zusätzlich 5 GB Datenvolumen buchen." },
  });
  const cancelled = await client.request("/api/actions/cancel", {
    method: "POST",
    body: { token: proposal.body.proposal.token },
  });
  assert.equal(cancelled.body.cancelled, true);
  assert.equal((await client.request("/api/account")).body.account.mobilePlan.remainingDataGb, 18);
});
