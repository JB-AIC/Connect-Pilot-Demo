import test from "node:test";
import assert from "node:assert/strict";
import { handleAssistantMessage, normalizeMessage } from "../server/assistant.js";
import { createSeedAccount } from "../server/seed-data.js";

function session(locale = "de") {
  return { id: "assistant-test", locale, account: createSeedAccount(), pendingActions: new Map() };
}

test("normalizes German accents, punctuation, and whitespace", () => {
  assert.equal(normalizeMessage("  HÖHERE Rechnung?  "), "hohere rechnung");
});

test("seeded products and router use neutral Connect branding", () => {
  const account = createSeedAccount();
  assert.equal(account.mobilePlan.name, "Connect Mobile L");
  assert.equal(account.homeInternet.planName, "Connect Internet");
  assert.equal(account.homeInternet.router, "Connect Router");
  assert.ok(account.availableOffers.alternativePlans.every((plan) => plan.name.startsWith("Connect Mobile")));
});

test("explains the exact Swiss roaming bill difference in German", () => {
  const result = handleAssistantMessage("Warum ist meine Rechnung 18 Euro höher?", session("de"));
  assert.equal(result.intent, "explain_bill");
  assert.match(result.reply, /87,95/);
  assert.match(result.reply, /69,95/);
  assert.match(result.reply, /18,00/);
  assert.match(result.reply, /Schweiz/);
  assert.equal(result.card.billing.currentBillTotal - result.card.billing.previousBillTotal, 18);
});

test("explains the exact Swiss roaming bill difference in English", () => {
  const result = handleAssistantMessage("Why is my bill 18 euros higher?", session("en"));
  assert.equal(result.intent, "explain_bill");
  assert.match(result.reply, /€87\.95/);
  assert.match(result.reply, /€18\.00/);
  assert.match(result.reply, /Switzerland/);
});

test("recommending a travel pass does not change the account or create an action", () => {
  const state = session("en");
  const result = handleAssistantMessage("Recommend a Switzerland travel pass.", state);
  assert.equal(result.intent, "recommend_travel_pass");
  assert.equal(result.card.kind, "travel_offer");
  assert.equal(result.proposal, undefined);
  assert.equal(state.account.mobilePlan.activeAddOns.length, 0);
});

test("travel pass activation creates an explicit single-use confirmation proposal", () => {
  const state = session("de");
  const result = handleAssistantMessage("Aktiviere bitte den Schweiz Travel Pass.", state);
  assert.equal(result.intent, "activate_travel_pass");
  assert.equal(result.proposal.type, "activate_travel_pass");
  assert.equal(result.proposal.payload.price, 9.95);
  assert.equal(state.account.mobilePlan.activeAddOns.length, 0);
  assert.equal(state.pendingActions.size, 1);
});

test("German and English data add-on requests both require confirmation", () => {
  const german = handleAssistantMessage("Ich möchte zusätzlich 5 GB Datenvolumen buchen.", session("de"));
  const english = handleAssistantMessage("Add 5 GB of extra data.", session("en"));
  assert.equal(german.proposal.type, "activate_data_addon");
  assert.equal(english.proposal.type, "activate_data_addon");
  assert.equal(german.proposal.payload.price, 7.95);
});

test("diagnoses a simulated local outage", () => {
  const result = handleAssistantMessage("My home internet is unusually slow.", session("en"));
  assert.equal(result.intent, "diagnose_internet");
  assert.equal(result.card.scenario, "local_outage");
  assert.match(result.reply, /16:30/);
});

test("diagnoses an explicit router issue independently of the outage scenario", () => {
  const result = handleAssistantMessage("Kannst du meinen Router prüfen?", session("de"));
  assert.equal(result.intent, "diagnose_internet");
  assert.equal(result.card.scenario, "router_issue");
  assert.match(result.reply, /Connect Router/);
  assert.match(result.reply, /30 Sekunden/);
});

test("contract explanations use neutral Connect branding in German and English", () => {
  for (const [locale, message] of [["de", "Zeig mir meinen Vertrag."], ["en", "Show me my contract."]]) {
    const result = handleAssistantMessage(message, session(locale));
    assert.equal(result.intent, "contract_overview");
    assert.match(result.reply, /Connect Mobile L/);
  }
});

test("restoration notifications require explicit confirmation", () => {
  const result = handleAssistantMessage("Notify me when the outage is resolved.", session("en"));
  assert.equal(result.proposal.type, "enable_restoration_notification");
  assert.equal(result.proposal.payload.price, 0);
});

test("a lost-phone report proposes blocking the correct masked SIM", () => {
  const result = handleAssistantMessage("Ich habe mein Handy verloren. Bitte sperre meine SIM.", session("de"));
  assert.equal(result.proposal.type, "block_sim");
  assert.equal(result.proposal.payload.simId, "sim-main");
  assert.match(result.proposal.payload.phoneNumber, /\*\*\*/);
});

test("remaining data, contracts, devices, comparisons, and handoffs are supported", () => {
  const cases = [
    ["How much mobile data do I have left?", "remaining_data"],
    ["Show me my current contract.", "contract_overview"],
    ["Show me my devices and SIM cards.", "devices_overview"],
    ["Compare available mobile plans.", "compare_plans"],
    ["Can a human support agent take over?", "human_handoff"],
  ];

  for (const [message, intent] of cases) {
    assert.equal(handleAssistantMessage(message, session("en")).intent, intent, message);
  }
});

test("reset requests are identified without silently performing account actions", () => {
  const result = handleAssistantMessage("Bitte die Demo zurücksetzen.", session("de"));
  assert.equal(result.intent, "reset_demo");
  assert.equal(result.resetRequested, true);
});
