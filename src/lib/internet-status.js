export const INTERNET_INCIDENT_ID = "INC-8239";

export function getDisplayedInternetSpeed(connection) {
  return connection.advertisedSpeedMbps;
}

export function getInternetIncident(connection, options = {}) {
  const displayedSpeedMbps = options.displayedSpeedMbps ?? getDisplayedInternetSpeed(connection);
  const actualSpeedMbps = connection.currentSpeedMbps;
  const advertisedSpeedMbps = connection.advertisedSpeedMbps;
  const degraded = connection.connectionStatus === "degraded";
  const displayMismatch = degraded && displayedSpeedMbps !== actualSpeedMbps;

  return {
    id: INTERNET_INCIDENT_ID,
    severity: "P1",
    status: displayMismatch ? "open" : "resolved",
    degraded,
    displayMismatch,
    displayedSpeedMbps,
    actualSpeedMbps,
    advertisedSpeedMbps,
    speedReductionPercent: advertisedSpeedMbps > 0
      ? Math.max(0, Math.round((1 - actualSpeedMbps / advertisedSpeedMbps) * 100))
      : 0,
    serviceAddressLabel: connection.serviceAddressLabel,
    estimatedRestoration: connection.estimatedRestoration,
  };
}
