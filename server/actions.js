import { randomUUID } from "node:crypto";

export const ACTION_TTL_MS = 5 * 60 * 1000;

export class ActionError extends Error {
  constructor(message, code, status = 400) {
    super(message);
    this.name = "ActionError";
    this.code = code;
    this.status = status;
  }
}

function addAuditEvent(account, action, description) {
  const event = {
    id: randomUUID(),
    action,
    outcome: "success",
    timestamp: new Date().toISOString(),
    description,
  };
  account.auditEvents.unshift(event);
  return event;
}

export function createActionProposal(session, type, payload = {}, now = Date.now()) {
  const token = randomUUID();
  const proposal = {
    token,
    type,
    payload,
    createdAt: now,
    expiresAt: now + ACTION_TTL_MS,
  };
  session.pendingActions.set(token, proposal);

  return {
    token,
    type,
    payload,
    expiresAt: new Date(proposal.expiresAt).toISOString(),
  };
}

export function cancelAction(session, token) {
  if (!token || !session.pendingActions.has(token)) {
    throw new ActionError("Unknown confirmation token.", "invalid_token", 404);
  }

  session.pendingActions.delete(token);
  return { cancelled: true };
}

export function confirmAction(session, token, now = Date.now()) {
  const proposal = session.pendingActions.get(token);

  if (!proposal) {
    throw new ActionError("Unknown or already used confirmation token.", "invalid_token", 404);
  }

  session.pendingActions.delete(token);

  if (proposal.expiresAt <= now) {
    throw new ActionError("The confirmation has expired.", "expired_token", 410);
  }

  const { account } = session;

  if (proposal.type === "activate_travel_pass") {
    const offer = account.availableOffers.switzerlandTravelPass;

    if (account.mobilePlan.activeAddOns.some((item) => item.id === offer.id)) {
      throw new ActionError("The Switzerland pass is already active.", "already_active", 409);
    }

    account.mobilePlan.activeAddOns.push({
      ...offer,
      activatedAt: new Date(now).toISOString(),
      status: "active",
    });

    const auditEvent = addAuditEvent(account, "travel_pass_activated", {
      de: "Schweiz Travel Pass für 9,95 € aktiviert",
      en: "Switzerland Travel Pass activated for €9.95",
    });

    return { action: proposal.type, account, auditEvent };
  }

  if (proposal.type === "activate_data_addon") {
    const offer = account.availableOffers.mobileDataAddOn;

    if (account.mobilePlan.activeAddOns.some((item) => item.id === offer.id)) {
      throw new ActionError("The data add-on is already active.", "already_active", 409);
    }

    account.mobilePlan.activeAddOns.push({
      ...offer,
      activatedAt: new Date(now).toISOString(),
      status: "active",
    });
    account.mobilePlan.includedDataGb += offer.dataGb;
    account.mobilePlan.remainingDataGb += offer.dataGb;

    const auditEvent = addAuditEvent(account, "data_addon_activated", {
      de: "Data Boost mit 5 GB für 7,95 € aktiviert",
      en: "5 GB Data Boost activated for €7.95",
    });

    return { action: proposal.type, account, auditEvent };
  }

  if (proposal.type === "block_sim") {
    const sim = account.simCards.find((item) => item.id === proposal.payload.simId);

    if (!sim) {
      throw new ActionError("The requested SIM card does not exist.", "sim_not_found", 404);
    }

    if (sim.status === "blocked") {
      throw new ActionError("The SIM card is already blocked.", "already_blocked", 409);
    }

    sim.status = "blocked";
    const auditEvent = addAuditEvent(account, "sim_blocked", {
      de: `SIM ${sim.maskedPhoneNumber} vorübergehend gesperrt`,
      en: `SIM ${sim.maskedPhoneNumber} temporarily blocked`,
    });

    return { action: proposal.type, account, auditEvent };
  }

  if (proposal.type === "enable_restoration_notification") {
    if (account.homeInternet.restorationNotificationRequested) {
      throw new ActionError("A restoration notification is already enabled.", "already_enabled", 409);
    }

    account.homeInternet.restorationNotificationRequested = true;
    const auditEvent = addAuditEvent(account, "restoration_notification_enabled", {
      de: "Benachrichtigung zur Entstörung aktiviert",
      en: "Service restoration notification enabled",
    });

    return { action: proposal.type, account, auditEvent };
  }

  throw new ActionError("Unsupported account action.", "unsupported_action", 400);
}
