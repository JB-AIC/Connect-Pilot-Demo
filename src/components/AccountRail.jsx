import Icon from "./Icon.jsx";
import { formatDate, formatMoney, formatTime } from "../lib/formatting.js";
import { getDisplayedInternetSpeed } from "../lib/internet-status.js";

function SectionHeader({ icon, title, trailing }) {
  return (
    <div className="account-card-heading">
      <span className="card-heading-icon">
        <Icon name={icon} size={18} />
      </span>
      <span>{title}</span>
      {trailing}
    </div>
  );
}

function MobilePlanCard({ plan, copy, locale, onAsk }) {
  const usagePercent = Math.round((plan.usedDataGb / plan.includedDataGb) * 100);

  return (
    <section className="account-card mobile-card">
      <SectionHeader icon="phone" title={copy.mobilePlan} />
      <div className="plan-name-row">
        <strong>{plan.name}</strong>
        <span className="network-pill">{plan.network}</span>
      </div>

      <div className="usage-layout">
        <div className="usage-ring" style={{ "--usage-progress": `${usagePercent}%` }}>
          <div className="usage-ring-inner">
            <strong>{plan.remainingDataGb}</strong>
            <span>GB</span>
          </div>
        </div>
        <div className="usage-copy">
          <strong>{copy.dataRemaining}</strong>
          <span>
            {plan.usedDataGb} {copy.of} {plan.includedDataGb} GB {copy.dataUsed}
          </span>
          <button className="inline-action" onClick={() => onAsk(copy.requestDataBoost)}>
            {copy.dataBoostAction}
            <Icon name="chevron" size={14} />
          </button>
        </div>
      </div>

      <div className="addons-section">
        <span className="addons-label">{copy.activeAddOns}</span>
        {plan.activeAddOns.length ? (
          <div className="addons-list">
            {plan.activeAddOns.map((item) => (
              <span className="addon-chip" key={item.id}>
                <Icon name="check" size={13} />
                {item.id === "switzerland-pass" && locale === "en" ? "Switzerland Travel Pass" : item.name}
              </span>
            ))}
          </div>
        ) : (
          <span className="empty-addons">{copy.noActiveAddOns}</span>
        )}
      </div>
    </section>
  );
}

function InternetCard({ connection, copy, onAsk }) {
  const limited = connection.connectionStatus === "degraded";

  return (
    <section className="account-card internet-card">
      <SectionHeader icon="wifi" title={copy.homeInternet} />
      <div className="internet-plan-row">
        <strong>{connection.planName}</strong>
        <span className={`service-status ${limited ? "attention" : "healthy"}`}>
          <span />
          {limited ? copy.connectionLimited : copy.connectionOnline}
        </span>
      </div>

      <div className="internet-speed">
        <strong>{getDisplayedInternetSpeed(connection)}</strong>
        <span>Mbit/s</span>
      </div>

      <div className="connection-meta">
        <span>{connection.serviceAddressLabel}</span>
        <button className="icon-link" onClick={() => onAsk(copy.prompts.find((item) => item.id === "internet").message)} aria-label={copy.viewDetails}>
          <Icon name="chevron" size={18} />
        </button>
      </div>

      {connection.restorationNotificationRequested && (
        <div className="notification-chip">
          <Icon name="bell" size={14} />
          {copy.notificationEnabled}
        </div>
      )}
    </section>
  );
}

function BillingCard({ billing, locale, copy, onAsk }) {
  return (
    <section className="account-card billing-card">
      <SectionHeader icon="receipt" title={copy.currentBill} />
      <div className="bill-amount-row">
        <strong>{formatMoney(billing.currentBillTotal, locale)}</strong>
        <span className="bill-change">+{formatMoney(billing.currentBillTotal - billing.previousBillTotal, locale)}</span>
      </div>
      <span className="billing-due-date">
        {copy.dueOn} {formatDate(billing.dueDate, locale)}
      </span>
      <button className="bill-details-button" onClick={() => onAsk(copy.prompts.find((item) => item.id === "bill").message)}>
        {copy.viewDetails}
        <Icon name="chevron" size={15} />
      </button>
    </section>
  );
}

function ActivityCard({ events, locale, copy }) {
  return (
    <section className="activity-section">
      <div className="activity-header">
        <h3>{copy.recentActivity}</h3>
        <Icon name="shield" size={17} />
      </div>
      <div className="activity-list">
        {events.slice(0, 5).map((event) => (
          <div className="activity-item" key={event.id}>
            <span className={`activity-indicator ${event.outcome === "attention" ? "attention" : ""}`}>
              <Icon name={event.outcome === "attention" ? "alert" : "check"} size={14} />
            </span>
            <div className="activity-copy">
              <strong>{event.description[locale]}</strong>
              <span>{formatTime(event.timestamp, locale)}</span>
            </div>
          </div>
        ))}
      </div>
      <p className="audit-hint">{copy.auditHint}</p>
    </section>
  );
}

export default function AccountRail({ account, locale, copy, onAsk }) {
  return (
    <aside className="account-rail" aria-label={copy.yourAccount}>
      <div className="rail-header">
        <div>
          <h2>{copy.yourAccount}</h2>
          <p>{copy.accountSubtitle}</p>
        </div>
        <span className="live-indicator" />
      </div>

      <MobilePlanCard plan={account.mobilePlan} locale={locale} copy={copy} onAsk={onAsk} />
      <InternetCard connection={account.homeInternet} copy={copy} onAsk={onAsk} />
      <BillingCard billing={account.billing} locale={locale} copy={copy} onAsk={onAsk} />
      <ActivityCard events={account.auditEvents} locale={locale} copy={copy} />
    </aside>
  );
}
