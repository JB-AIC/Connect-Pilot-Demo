import { useEffect, useMemo, useState } from "react";
import Icon from "../components/Icon.jsx";
import { api } from "../lib/api.js";
import { formatTime } from "../lib/formatting.js";
import { getIncidentCopy } from "../lib/incident-copy.js";
import { getInternetIncident } from "../lib/internet-status.js";

function IncidentHeader({ copy, locale, onChangeLanguage, onRefresh, refreshing }) {
  return (
    <header className="incident-topbar">
      <a className="incident-brand" href="/" aria-label="Connect Pilot">
        <span className="incident-brand-mark">C</span>
        <span className="incident-brand-copy">
          <strong>Connect</strong>
          <span>{copy.product}</span>
        </span>
      </a>

      <span className="incident-demo-badge">
        <span />
        {copy.simulatedIncident}
      </span>

      <div className="incident-topbar-actions">
        <div className="incident-language-toggle" role="group" aria-label="Language / Sprache">
          {[["de", "DE"], ["en", "EN"]].map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={locale === value ? "incident-language-option active" : "incident-language-option"}
              onClick={() => onChangeLanguage(value)}
              aria-pressed={locale === value}
              aria-label={value === "de" ? "Deutsch" : "English"}
            >
              {label}
            </button>
          ))}
        </div>

        <button className="incident-refresh-button" type="button" onClick={onRefresh} disabled={refreshing}>
          <Icon name="reset" size={17} />
          <span>{refreshing ? copy.refreshing : copy.refresh}</span>
        </button>

        <a className="incident-dashboard-link" href="/">
          <Icon name="home" size={17} />
          <span>{copy.openDashboard}</span>
        </a>
      </div>
    </header>
  );
}

function IncidentHero({ account, copy, incident }) {
  const resolved = incident.status === "resolved";

  return (
    <section className={`incident-hero ${resolved ? "incident-hero-resolved" : ""}`}>
      <div className="incident-hero-content">
        <div className="incident-hero-eyebrow">
          <span className="incident-signal-dot" />
          {resolved ? copy.resolvedEyebrow : copy.eyebrow}
        </div>

        <div className="incident-title-row">
          <span className="incident-reference">{incident.id}</span>
          <span className="incident-severity">{copy.priority}</span>
          <span className={`incident-state ${incident.status}`} data-testid="incident-status" role="status">
            <Icon name={resolved ? "check" : "alert"} size={15} />
            {resolved ? copy.resolved : copy.open}
          </span>
        </div>

        <h1>{copy.incidentTitle}</h1>
        <p>{copy.incidentSummary}</p>

        <div className="incident-context-list">
          <span><Icon name="wifi" size={15} />{copy.service}: <strong>{account.homeInternet.planName}</strong></span>
          <span><Icon name="globe" size={15} />{copy.region}: <strong>{incident.serviceAddressLabel}</strong></span>
          <span><Icon name="clock" size={15} />{copy.restoration}: <strong>{incident.estimatedRestoration}</strong></span>
        </div>
      </div>

      <div className="incident-radar" aria-hidden="true">
        <span className="incident-radar-ring incident-radar-outer" />
        <span className="incident-radar-ring incident-radar-middle" />
        <span className="incident-radar-center"><Icon name={resolved ? "check" : "wifi"} size={35} /></span>
      </div>
    </section>
  );
}

function MetricCard({ className = "", icon, label, value, unit, detail, testId }) {
  return (
    <article className={`incident-metric ${className}`}>
      <span className="incident-metric-icon"><Icon name={icon} size={20} /></span>
      <span className="incident-metric-label">{label}</span>
      <strong className="incident-metric-value" data-testid={testId}>
        {value}
        {unit && <span>{unit}</span>}
      </strong>
      <span className="incident-metric-detail">{detail}</span>
    </article>
  );
}

function CustomerEvidence({ account, copy, incident }) {
  const mismatch = incident.displayMismatch;

  return (
    <section className="incident-panel incident-evidence-panel">
      <div className="incident-section-heading">
        <span>{copy.evidenceEyebrow}</span>
        <h2>{copy.evidenceTitle}</h2>
        <p>{copy.evidenceSummary}</p>
      </div>

      <div className="incident-account-preview">
        <div className="incident-preview-heading">
          <span><Icon name="user" size={16} />{copy.accountPreview}</span>
          <span>{account.customer.firstName} W.</span>
        </div>

        <div className="incident-preview-card">
          <div className="incident-preview-card-top">
            <span><Icon name="wifi" size={20} />{copy.homeInternet}</span>
            <span className="incident-preview-limited"><span />{incident.degraded ? copy.degraded : copy.connected}</span>
          </div>

          <strong>{account.homeInternet.planName}</strong>

          <div className="incident-preview-speed-row">
            <div>
              <span>{copy.currentReading}</span>
              <strong data-testid="customer-displayed-speed">{incident.displayedSpeedMbps}<small>Mbit/s</small></strong>
            </div>
            <span className="incident-preview-divider" />
            <div>
              <span>{copy.actuallyMeasured}</span>
              <strong className="incident-preview-actual">{incident.actualSpeedMbps}<small>Mbit/s</small></strong>
            </div>
          </div>

          <div className={`incident-mismatch-note ${mismatch ? "" : "resolved"}`}>
            <Icon name={mismatch ? "alert" : "check"} size={17} />
            {mismatch ? copy.mismatchDetected : copy.consistentDisplay}
          </div>
        </div>
      </div>

      <div className="incident-impact-note">
        <span><Icon name="headset" size={19} /></span>
        <div>
          <strong>{copy.customerImpact}</strong>
          <p>{mismatch ? copy.customerImpactBody : copy.resolvedImpactBody}</p>
        </div>
      </div>

      <div className="incident-reproduction">
        <h3>{copy.reproductionTitle}</h3>
        <ol>
          {copy.reproductionSteps.map((step) => <li key={step}>{step}</li>)}
        </ol>
      </div>
    </section>
  );
}

function EngineeringEvidence({ copy, incident }) {
  return (
    <section className="incident-panel incident-technical-panel">
      <div className="incident-section-heading">
        <span>{copy.technicalEyebrow}</span>
        <h2>{copy.technicalTitle}</h2>
        <p>{copy.technicalSummary}</p>
      </div>

      <div className="incident-code-card">
        <div className="incident-code-heading">
          <span>{copy.sourceAccount}</span>
          <code>server/seed-data.js</code>
        </div>
        <pre><code>{`homeInternet: {\n  advertisedSpeedMbps: ${incident.advertisedSpeedMbps},\n  currentSpeedMbps: ${incident.actualSpeedMbps},\n  connectionStatus: "${incident.degraded ? "degraded" : "connected"}",\n}`}</code></pre>
      </div>

      <div className="incident-code-card incident-code-card-secondary">
        <div className="incident-code-heading">
          <span>{copy.sourcePresentation}</span>
          <code>src/lib/internet-status.js</code>
        </div>
        <pre><code>{`getDisplayedInternetSpeed(connection)\n\nDisplayed: ${incident.displayedSpeedMbps} Mbit/s\nMeasured:  ${incident.actualSpeedMbps} Mbit/s`}</code></pre>
      </div>

      <div className="incident-expected-fix">
        <h3><Icon name="check" size={18} />{copy.expectedFix}</h3>
        <ul>
          {copy.expectedItems.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
    </section>
  );
}

function IncidentTimeline({ account, copy, incident, locale }) {
  const detected = account.auditEvents.find((event) => event.action === "network_detected");
  const resolved = incident.status === "resolved";

  return (
    <section className="incident-panel incident-timeline-panel">
      <div className="incident-section-heading">
        <span>{copy.timelineEyebrow}</span>
        <h2>{copy.timelineTitle}</h2>
      </div>

      <div className="incident-timeline">
        <div className="incident-timeline-item complete">
          <span className="incident-timeline-marker"><Icon name="wifi" size={16} /></span>
          <div><strong>{copy.networkDetected}</strong><p>{copy.networkDetail}</p></div>
          <span>{detected ? formatTime(detected.timestamp, locale) : copy.liveVerification}</span>
        </div>

        <div className={`incident-timeline-item ${resolved ? "complete" : "active"}`}>
          <span className="incident-timeline-marker"><Icon name={resolved ? "check" : "alert"} size={16} /></span>
          <div>
            <strong>{resolved ? copy.correctionVerified : copy.discrepancyDetected}</strong>
            <p>{resolved ? copy.correctionDetail : copy.discrepancyDetail}</p>
          </div>
          <span>{copy.liveVerification}</span>
        </div>

        {!resolved && (
          <div className="incident-timeline-item pending">
            <span className="incident-timeline-marker"><Icon name="clock" size={16} /></span>
            <div><strong>{copy.awaitingFix}</strong><p>{copy.awaitingDetail}</p></div>
            <span>{copy.pending}</span>
          </div>
        )}
      </div>
    </section>
  );
}

function VerificationCard({ copy, incident, lastCheckedAt, locale }) {
  const resolved = incident.status === "resolved";

  return (
    <section className={`incident-verification ${resolved ? "resolved" : ""}`}>
      <span className="incident-verification-icon"><Icon name={resolved ? "check" : "alert"} size={22} /></span>
      <div className="incident-verification-copy">
        <span>{copy.verificationEyebrow}</span>
        <h2>{copy.verificationTitle}</h2>
        <p>{resolved ? copy.verificationResolved : copy.verificationOpen}</p>
      </div>
      <div className="incident-verification-result">
        <strong>{incident.displayedSpeedMbps} <span>/</span> {incident.actualSpeedMbps} <small>Mbit/s</small></strong>
        <span>{copy.checkedAt}: {formatTime(lastCheckedAt, locale)}</span>
      </div>
    </section>
  );
}

export default function IncidentPage() {
  const [account, setAccount] = useState(null);
  const [locale, setLocale] = useState("de");
  const [refreshing, setRefreshing] = useState(false);
  const [lastCheckedAt, setLastCheckedAt] = useState(new Date().toISOString());
  const [error, setError] = useState(null);
  const copy = useMemo(() => getIncidentCopy(locale), [locale]);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const session = await api.getSession();
        const result = await api.getAccount();

        if (!active) return;

        setLocale(session.locale);
        setAccount(result.account);
        setLastCheckedAt(new Date().toISOString());
      } catch (loadError) {
        if (active) setError(loadError.message);
      }
    }

    load();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = `INC-8239 | Connect ${copy.product}`;
  }, [copy.product, locale]);

  async function refreshIncident() {
    if (refreshing) return;
    setRefreshing(true);

    try {
      const result = await api.getAccount();
      setAccount(result.account);
      setLastCheckedAt(new Date().toISOString());
      setError(null);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setRefreshing(false);
    }
  }

  async function changeLanguage(nextLocale) {
    if (nextLocale === locale) return;

    try {
      await api.setLanguage(nextLocale);
      setLocale(nextLocale);
      setError(null);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  if (error && !account) {
    return (
      <div className="loading-screen error-screen">
        <Icon name="alert" size={32} />
        <h1>{copy.errorLoading}</h1>
        <p>{error}</p>
        <button type="button" onClick={() => window.location.reload()}>{copy.retry}</button>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="loading-screen incident-loading-screen">
        <span><Icon name="signal" size={29} /></span>
        <p>{copy.loading}</p>
      </div>
    );
  }

  const incident = getInternetIncident(account.homeInternet);

  return (
    <div className="incident-shell">
      <IncidentHeader
        copy={copy}
        locale={locale}
        onChangeLanguage={changeLanguage}
        onRefresh={refreshIncident}
        refreshing={refreshing}
      />

      <main className="incident-main">
        <div className="incident-breadcrumb"><span>{copy.incidentResponse}</span><Icon name="chevron" size={14} /><strong>{incident.id}</strong></div>

        {error && <div className="incident-inline-error" role="alert">{error}</div>}

        <IncidentHero account={account} copy={copy} incident={incident} />

        <section className="incident-metric-grid" aria-label={copy.serviceHealth}>
          <MetricCard
            className="incident-metric-warning"
            icon="wifi"
            label={copy.serviceHealth}
            value={incident.degraded ? copy.degraded : copy.connected}
            detail={copy.networkOutageActive}
          />
          <MetricCard
            className="incident-metric-critical"
            icon="chart"
            label={copy.currentSpeed}
            value={incident.actualSpeedMbps}
            unit="Mbit/s"
            detail={`${incident.speedReductionPercent}% ${copy.speedReduction}`}
            testId="actual-speed-metric"
          />
          <MetricCard
            className="incident-metric-display"
            icon="devices"
            label={copy.displayedSpeed}
            value={incident.displayedSpeedMbps}
            unit="Mbit/s"
            detail={copy.customerSees}
            testId="displayed-speed-metric"
          />
          <MetricCard
            icon="signal"
            label={copy.advertisedSpeed}
            value={incident.advertisedSpeedMbps}
            unit="Mbit/s"
            detail={copy.contractedMaximum}
          />
        </section>

        <div className="incident-evidence-grid">
          <CustomerEvidence account={account} copy={copy} incident={incident} />
          <EngineeringEvidence copy={copy} incident={incident} />
        </div>

        <IncidentTimeline account={account} copy={copy} incident={incident} locale={locale} />
        <VerificationCard copy={copy} incident={incident} lastCheckedAt={lastCheckedAt} locale={locale} />

        <footer className="incident-footer">
          <span><Icon name="shield" size={16} />{copy.outageBoundary}</span>
          <span>{copy.dataBoundary}</span>
        </footer>
      </main>
    </div>
  );
}
