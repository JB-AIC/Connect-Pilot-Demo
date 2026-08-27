import Icon from "./Icon.jsx";

export default function AppHeader({ account, locale, onLanguageChange, onReset, onOpenMenu, copy, resetting }) {
  return (
    <header className="topbar">
      <div className="topbar-leading">
        <button className="mobile-menu-button" onClick={onOpenMenu} aria-label={copy.openNavigation}>
          <Icon name="menu" size={21} />
        </button>

        <div className="brand-lockup" aria-label="Connect Copilot">
          <div className="brand-symbol">
            <span>C</span>
            <Icon name="sparkles" size={16} className="brand-spark" />
          </div>
          <div className="brand-copy">
            <span className="brand-primary">Connect</span>
            <span className="brand-product">Copilot</span>
          </div>
        </div>

        <span className="demo-badge">
          <span className="demo-badge-dot" />
          {copy.conceptDemo}
        </span>
      </div>

      <div className="topbar-actions">
        <div className="customer-session">
          <span className="customer-avatar" aria-hidden="true">
            LW
          </span>
          <span className="customer-session-copy">
            <strong>{account.customer.displayName}</strong>
            <span>{copy.verifiedCustomer}</span>
          </span>
        </div>

        <div className="language-toggle" role="group" aria-label="Language / Sprache">
          {[
            ["de", "DE"],
            ["en", "EN"],
          ].map(([value, label]) => (
            <button
              key={value}
              className={locale === value ? "language-option active" : "language-option"}
              onClick={() => onLanguageChange(value)}
              aria-pressed={locale === value}
              aria-label={value === "de" ? "Deutsch" : "English"}
            >
              {label}
            </button>
          ))}
        </div>

        <button className="reset-button" onClick={onReset} disabled={resetting}>
          <Icon name="reset" size={17} />
          <span>{resetting ? copy.resetting : copy.resetDemo}</span>
        </button>
      </div>
    </header>
  );
}
