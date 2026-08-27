import Icon from "./Icon.jsx";
import { formatDate, formatMoney } from "../lib/formatting.js";

function TravelOfferCard({ offer, copy, locale, onAsk, account }) {
  const active = account.mobilePlan.activeAddOns.some((item) => item.id === offer.id);

  return (
    <div className="travel-offer-card">
      <div className="travel-illustration" aria-hidden="true">
        <svg viewBox="0 0 280 144" preserveAspectRatio="none">
          <defs>
            <linearGradient id="mountain-sky" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ffd6eb" />
              <stop offset="100%" stopColor="#fff2f8" />
            </linearGradient>
          </defs>
          <path fill="url(#mountain-sky)" d="M0 0h280v144H0z" />
          <circle cx="224" cy="35" r="19" fill="#fff" opacity="0.9" />
          <path d="M0 125l54-58 44 38 48-73 52 76 40-36 42 53v19H0z" fill="#cd649b" />
          <path d="M0 144l72-55 46 38 48-51 46 47 32-23 36 44H0z" fill="#a82672" />
          <path d="M133 50l13-18 14 20-14-7z" fill="#fff" />
          <path d="M44 78l10-11 13 12-11-3z" fill="#fff" opacity="0.85" />
        </svg>
        <span className="swiss-flag" aria-label="Switzerland">
          +
        </span>
      </div>

      <div className="travel-offer-body">
        <div className="offer-heading">
          <div>
            <span className="offer-eyebrow">{copy.avoidFutureCharges}</span>
            <h4>{copy.travelPass}</h4>
          </div>
          <span className="offer-price">{formatMoney(offer.price, locale)}</span>
        </div>

        <p>{copy.travelPassDescription}</p>

        <div className="offer-footer">
          <div className="offer-specifications">
            <span>
              <Icon name="calendar" size={15} />
              {offer.durationDays} {copy.days}
            </span>
            <span>
              <Icon name="signal" size={15} />
              {offer.includedDataGb} GB
            </span>
          </div>
          <button className="small-primary-button" disabled={active} onClick={() => onAsk(copy.activationRequest)}>
            {active ? copy.active : copy.activatePass}
          </button>
        </div>
      </div>
    </div>
  );
}

function BillExplanationCard({ billing, offer, copy, locale, onAsk, account }) {
  const lineLabels = {
    mobile: copy.mobilePlanLine,
    internet: copy.internetPlanLine,
    swiss_roaming: copy.switzerlandRoaming,
  };

  return (
    <div className="rich-card-stack">
      <section className="explanation-card bill-explanation">
        <div className="explanation-heading">
          <span className="explanation-heading-icon">
            <Icon name="receipt" size={18} />
          </span>
          <h4>{copy.billingBreakdown}</h4>
          <span className="bill-delta-pill">+{formatMoney(18, locale)}</span>
        </div>

        <div className="comparison-row">
          <div>
            <span>{copy.previousMonth}</span>
            <strong>{formatMoney(billing.previousBillTotal, locale)}</strong>
          </div>
          <Icon name="chevron" size={19} />
          <div>
            <span>{copy.currentMonth}</span>
            <strong>{formatMoney(billing.currentBillTotal, locale)}</strong>
          </div>
        </div>

        <div className="line-items">
          {billing.lineItems.map((item) => (
            <div className={`line-item ${item.type === "swiss_roaming" ? "roaming" : ""}`} key={item.id}>
              <div>
                <span>{lineLabels[item.type]}</span>
                {item.type === "swiss_roaming" && <small>{copy.roamingExplanation}</small>}
              </div>
              <strong>{item.type === "swiss_roaming" ? "+" : ""}{formatMoney(item.amount, locale)}</strong>
            </div>
          ))}
        </div>

        <div className="total-line">
          <span>{copy.totalDue}</span>
          <strong>{formatMoney(billing.currentBillTotal, locale)}</strong>
        </div>
      </section>

      <TravelOfferCard offer={offer} copy={copy} locale={locale} onAsk={onAsk} account={account} />
    </div>
  );
}

function DiagnosticCard({ card, copy, onAsk }) {
  const routerIssue = card.scenario === "router_issue";

  return (
    <section className="explanation-card diagnostic-card">
      <div className="diagnostic-title-row">
        <span className="diagnostic-icon">
          <Icon name="wifi" size={21} />
        </span>
        <div>
          <h4>{routerIssue ? copy.routerIssue : copy.outageDetected}</h4>
          <span>
            {routerIssue ? card.homeInternet.router : `${copy.localOutage} - ${card.homeInternet.serviceAddressLabel}`}
          </span>
        </div>
      </div>

      {routerIssue ? (
        <div className="router-instruction">
          <Icon name="reset" size={18} />
          <span>{copy.routerRecommendation}</span>
        </div>
      ) : (
        <>
          <div className="diagnostic-timeline">
            {copy.diagnosisSteps.map((step, index) => (
              <div className={`timeline-step ${index < 2 ? "complete" : index === 2 ? "current" : ""}`} key={step}>
                <span>{index < 2 ? <Icon name="check" size={15} /> : index + 1}</span>
                <small>{step}</small>
              </div>
            ))}
          </div>

          <div className="restoration-time">
            <Icon name="clock" size={19} />
            <span>{copy.estimatedResolution}</span>
            <strong>{card.homeInternet.estimatedRestoration}</strong>
          </div>

          <p className="outage-help">
            <Icon name="shield" size={16} />
            {copy.outageHelp}
          </p>

          {!card.homeInternet.restorationNotificationRequested && (
            <button className="diagnostic-action-button" onClick={() => onAsk(copy.notificationRequest)}>
              <Icon name="bell" size={17} />
              {copy.notifyWhenResolved}
            </button>
          )}
        </>
      )}
    </section>
  );
}

function DataUsageCard({ plan, copy }) {
  const percent = Math.round((plan.usedDataGb / plan.includedDataGb) * 100);

  return (
    <section className="explanation-card data-usage-card">
      <div className="explanation-heading">
        <Icon name="signal" size={18} />
        <h4>{copy.monthlyData}</h4>
      </div>
      <div className="data-values">
        <strong>{plan.remainingDataGb} GB</strong>
        <span>{copy.dataRemaining}</span>
      </div>
      <div className="linear-progress">
        <span style={{ width: `${percent}%` }} />
      </div>
      <p>{plan.usedDataGb} {copy.of} {plan.includedDataGb} GB {copy.dataUsed}</p>
    </section>
  );
}

function PlanComparisonCard({ plans, currentPlan, copy, locale }) {
  return (
    <section className="explanation-card plan-comparison-card">
      <div className="explanation-heading">
        <Icon name="chart" size={19} />
        <h4>{copy.planComparison}</h4>
      </div>
      <div className="comparison-plans">
        {plans.map((plan) => (
          <div className={plan.name === currentPlan ? "comparison-plan current" : "comparison-plan"} key={plan.id}>
            <div>
              <strong>{plan.name}</strong>
              <span>{plan.dataGb} GB</span>
            </div>
            <span>{formatMoney(plan.monthlyPrice, locale)} <small>{copy.perMonth}</small></span>
          </div>
        ))}
      </div>
    </section>
  );
}

function DevicesCard({ devices, simCards, copy }) {
  return (
    <section className="explanation-card devices-card">
      <div className="explanation-heading">
        <Icon name="devices" size={19} />
        <h4>{copy.simOverview}</h4>
      </div>
      {devices.map((device) => {
        const sim = simCards.find((item) => item.id === device.linkedSimId);
        return (
          <div className="device-row" key={device.id}>
            <Icon name={device.deviceType === "smartphone" ? "phone" : "clock"} size={19} />
            <div>
              <strong>{device.deviceName}</strong>
              <span>{sim.type} · {sim.maskedPhoneNumber}</span>
            </div>
            <span className={`sim-status ${sim.status}`}>{sim.status === "active" ? copy.simActive : copy.simBlocked}</span>
          </div>
        );
      })}
    </section>
  );
}

function ContractCard({ plan, copy, locale }) {
  return (
    <section className="explanation-card contract-card">
      <div className="explanation-heading">
        <Icon name="receipt" size={18} />
        <h4>{copy.contractDetails}</h4>
      </div>
      <div className="contract-line"><span>{copy.currentPlan}</span><strong>{plan.name}</strong></div>
      <div className="contract-line"><span>{copy.includedData}</span><strong>{plan.includedDataGb} GB</strong></div>
      <div className="contract-line"><span>{copy.renewalDate}</span><strong>{formatDate(plan.contractRenewalDate, locale)}</strong></div>
      <div className="contract-line"><span>{copy.phoneNumber}</span><strong>{plan.maskedPhoneNumber}</strong></div>
    </section>
  );
}

function HandoffCard({ copy }) {
  return (
    <section className="explanation-card handoff-card">
      <Icon name="headset" size={22} />
      <div>
        <strong>{copy.humanHandoff}</strong>
        <span>{copy.humanHandoffNote}</span>
      </div>
      <span className="simulated-chip">{copy.simulated}</span>
    </section>
  );
}

export function ActionConfirmation({ message, account, copy, locale, onConfirm, onCancel, actionBusy }) {
  const proposal = message.proposal;
  const inactive = message.actionStatus === "confirmed" || message.actionStatus === "cancelled";
  const titles = {
    activate_travel_pass: copy.travelPassTitle,
    activate_data_addon: copy.dataBoostTitle,
    block_sim: copy.simBlockTitle,
    enable_restoration_notification: copy.notificationTitle,
  };
  const isFree = proposal.type === "enable_restoration_notification";
  const isSimBlock = proposal.type === "block_sim";
  const icon = proposal.type === "block_sim" ? "lock" : proposal.type === "enable_restoration_notification" ? "bell" : "suitcase";

  return (
    <section className={`confirmation-card ${inactive ? "inactive" : ""}`}>
      <div className="confirmation-topline">
        <span className="confirmation-icon"><Icon name={icon} size={21} /></span>
        <span>{copy.activationTitle}</span>
        <Icon name="shield" size={17} />
      </div>

      <h4>{titles[proposal.type]}</h4>

      {typeof proposal.payload.price === "number" && (
        <div className="confirmation-price">
          {isFree ? copy.notificationFee : formatMoney(proposal.payload.price, locale)}
          {!isFree && <span>{copy.oneTime}</span>}
        </div>
      )}

      <div className="confirmation-details">
        {proposal.payload.durationDays && (
          <div><span>{copy.offerDuration}</span><strong>{proposal.payload.durationDays} {copy.days}</strong></div>
        )}
        {(proposal.payload.includedDataGb || proposal.payload.dataGb) && (
          <div><span>{copy.includedData}</span><strong>{proposal.payload.includedDataGb ?? proposal.payload.dataGb} GB</strong></div>
        )}
        <div><span>{copy.associatedNumber}</span><strong>{proposal.payload.phoneNumber ?? account.mobilePlan.maskedPhoneNumber}</strong></div>
      </div>

      {!inactive && (
        <div className="confirmation-actions">
          <button className={`confirmation-primary ${isSimBlock ? "warning" : ""}`} onClick={() => onConfirm(message.id, proposal.token)} disabled={actionBusy}>
            {isSimBlock ? copy.confirmBlock : isFree ? copy.confirmFree : copy.confirmPurchase}
          </button>
          <button className="confirmation-cancel" onClick={() => onCancel(message.id, proposal.token)} disabled={actionBusy}>
            {copy.cancel}
          </button>
        </div>
      )}

      {inactive && (
        <div className={`action-result ${message.actionStatus}`}>
          <Icon name={message.actionStatus === "confirmed" ? "check" : "close"} size={16} />
          {message.actionStatus === "confirmed" ? copy.active : copy.cancel}
        </div>
      )}

      <div className="confirmation-security"><Icon name="lock" size={13} /> {copy.secureConfirmation}</div>
    </section>
  );
}

export default function MessageCard({ card, copy, locale, onAsk, account }) {
  if (!card) return null;

  if (card.kind === "bill") {
    return <BillExplanationCard {...card} copy={copy} locale={locale} onAsk={onAsk} account={account} />;
  }
  if (card.kind === "travel_offer") {
    return <TravelOfferCard {...card} copy={copy} locale={locale} onAsk={onAsk} account={account} />;
  }
  if (card.kind === "diagnostic") {
    return <DiagnosticCard card={card} copy={copy} onAsk={onAsk} />;
  }
  if (card.kind === "data_usage") {
    return <DataUsageCard {...card} copy={copy} />;
  }
  if (card.kind === "plan_comparison") {
    return <PlanComparisonCard {...card} copy={copy} locale={locale} />;
  }
  if (card.kind === "devices") {
    return <DevicesCard {...card} copy={copy} />;
  }
  if (card.kind === "contract") {
    return <ContractCard {...card} copy={copy} locale={locale} />;
  }
  if (card.kind === "handoff") {
    return <HandoffCard copy={copy} />;
  }

  return null;
}
