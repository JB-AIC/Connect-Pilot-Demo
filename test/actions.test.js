import test from "node:test";
import assert from "node:assert/strict";
import { ACTION_TTL_MS, ActionError, cancelAction, confirmAction, createActionProposal } from "../server/actions.js";
import { createSeedAccount } from "../server/seed-data.js";

function session() {
  return { id: "actions-test", locale: "en", account: createSeedAccount(), pendingActions: new Map() };
}

test("a travel pass changes account state only after confirmation and records an audit event", () => {
  const state = session();
  const proposal = createActionProposal(state, "activate_travel_pass", { offerId: "switzerland-pass" });
  assert.equal(state.account.mobilePlan.activeAddOns.length, 0);

  const result = confirmAction(state, proposal.token);
  assert.equal(result.action, "activate_travel_pass");
  assert.equal(state.account.mobilePlan.activeAddOns[0].id, "switzerland-pass");
  assert.equal(state.account.auditEvents[0].action, "travel_pass_activated");
  assert.equal(state.pendingActions.size, 0);
});

test("confirmation tokens cannot be replayed", () => {
  const state = session();
  const proposal = createActionProposal(state, "activate_travel_pass");
  confirmAction(state, proposal.token);
  assert.throws(() => confirmAction(state, proposal.token), (error) => error instanceof ActionError && error.code === "invalid_token");
});

test("expired confirmation tokens are rejected without mutating account state", () => {
  const state = session();
  const start = 1_000_000;
  const proposal = createActionProposal(state, "activate_travel_pass", {}, start);
  assert.throws(() => confirmAction(state, proposal.token, start + ACTION_TTL_MS), (error) => error.code === "expired_token");
  assert.equal(state.account.mobilePlan.activeAddOns.length, 0);
});

test("unknown and cancelled confirmation tokens cannot execute", () => {
  const state = session();
  assert.throws(() => confirmAction(state, "unknown"), (error) => error.code === "invalid_token");
  const proposal = createActionProposal(state, "activate_data_addon");
  assert.deepEqual(cancelAction(state, proposal.token), { cancelled: true });
  assert.throws(() => confirmAction(state, proposal.token), (error) => error.code === "invalid_token");
  assert.equal(state.account.mobilePlan.remainingDataGb, 18);
});

test("data add-on increases the allowance and available balance immediately", () => {
  const state = session();
  const proposal = createActionProposal(state, "activate_data_addon");
  confirmAction(state, proposal.token);
  assert.equal(state.account.mobilePlan.includedDataGb, 45);
  assert.equal(state.account.mobilePlan.usedDataGb, 22);
  assert.equal(state.account.mobilePlan.remainingDataGb, 23);
  assert.equal(state.account.auditEvents[0].action, "data_addon_activated");
});

test("SIM blocking updates only the selected SIM and adds an audit event", () => {
  const state = session();
  const proposal = createActionProposal(state, "block_sim", { simId: "sim-main" });
  confirmAction(state, proposal.token);
  assert.equal(state.account.simCards.find((sim) => sim.id === "sim-main").status, "blocked");
  assert.equal(state.account.simCards.find((sim) => sim.id === "sim-watch").status, "active");
  assert.equal(state.account.auditEvents[0].action, "sim_blocked");
});

test("restoration notifications can be enabled once", () => {
  const state = session();
  const proposal = createActionProposal(state, "enable_restoration_notification");
  confirmAction(state, proposal.token);
  assert.equal(state.account.homeInternet.restorationNotificationRequested, true);

  const duplicate = createActionProposal(state, "enable_restoration_notification");
  assert.throws(() => confirmAction(state, duplicate.token), (error) => error.code === "already_enabled");
});

test("duplicate travel passes are rejected", () => {
  const state = session();
  confirmAction(state, createActionProposal(state, "activate_travel_pass").token);
  const duplicate = createActionProposal(state, "activate_travel_pass");
  assert.throws(() => confirmAction(state, duplicate.token), (error) => error.code === "already_active");
});

test("independent seeded accounts cannot mutate each other", () => {
  const first = session();
  const second = session();
  const proposal = createActionProposal(first, "block_sim", { simId: "sim-main" });
  assert.throws(() => confirmAction(second, proposal.token), (error) => error.code === "invalid_token");
  assert.equal(first.account.simCards[0].status, "active");
  assert.equal(second.account.simCards[0].status, "active");
});
