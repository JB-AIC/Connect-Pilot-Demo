import test from "node:test";
import assert from "node:assert/strict";
import { createSeedAccount } from "../server/seed-data.js";
import { getIncidentCopy } from "../src/lib/incident-copy.js";
import {
  getDisplayedInternetSpeed,
  getInternetIncident,
  INTERNET_INCIDENT_ID,
} from "../src/lib/internet-status.js";

test("the workshop baseline preserves the existing advertised-speed display defect", () => {
  const connection = createSeedAccount().homeInternet;

  assert.equal(connection.currentSpeedMbps, 12);
  assert.equal(connection.advertisedSpeedMbps, 100);
  assert.equal(getDisplayedInternetSpeed(connection), 100);
});

test("incident 8239 is open when a degraded connection displays the wrong speed", () => {
  const incident = getInternetIncident(createSeedAccount().homeInternet);

  assert.equal(incident.id, INTERNET_INCIDENT_ID);
  assert.equal(incident.severity, "P1");
  assert.equal(incident.status, "open");
  assert.equal(incident.displayMismatch, true);
  assert.equal(incident.actualSpeedMbps, 12);
  assert.equal(incident.displayedSpeedMbps, 100);
  assert.equal(incident.speedReductionPercent, 88);
  assert.equal(incident.serviceAddressLabel, "München-Schwabing");
  assert.equal(incident.estimatedRestoration, "16:30");
});

test("correcting the displayed speed resolves only the presentation incident", () => {
  const connection = createSeedAccount().homeInternet;
  const incident = getInternetIncident(connection, { displayedSpeedMbps: 12 });

  assert.equal(incident.status, "resolved");
  assert.equal(incident.displayMismatch, false);
  assert.equal(incident.degraded, true);
  assert.equal(connection.connectionStatus, "degraded");
});

test("healthy connections do not create the degraded-service display incident", () => {
  const connection = {
    ...createSeedAccount().homeInternet,
    connectionStatus: "connected",
  };

  assert.equal(getInternetIncident(connection).status, "resolved");
});

test("incident metrics remain safe when the advertised speed is unavailable", () => {
  const connection = {
    ...createSeedAccount().homeInternet,
    advertisedSpeedMbps: 0,
  };

  assert.equal(getInternetIncident(connection).speedReductionPercent, 0);
});

test("incident command center has matching German and English copy", () => {
  const german = getIncidentCopy("de");
  const english = getIncidentCopy("en");

  assert.deepEqual(Object.keys(german).sort(), Object.keys(english).sort());
  assert.equal(german.reproductionSteps.length, 4);
  assert.equal(english.reproductionSteps.length, 4);
  assert.equal(german.expectedItems.length, 4);
  assert.equal(english.expectedItems.length, 4);
});

test("unsupported incident locales safely fall back to English", () => {
  assert.equal(getIncidentCopy("fr").open, "Open");
});
