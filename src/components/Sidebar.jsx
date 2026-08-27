import Icon from "./Icon.jsx";

export default function Sidebar({ activeSection, onNavigate, copy, mobileOpen, onClose }) {
  const sections = [
    { id: "overview", label: copy.overview, icon: "home" },
    { id: "mobile", label: copy.mobile, icon: "phone" },
    { id: "internet", label: copy.internet, icon: "wifi" },
    { id: "bills", label: copy.bills, icon: "receipt" },
    { id: "devices", label: copy.devices, icon: "devices" },
    { id: "support", label: copy.support, icon: "headset" },
  ];

  return (
    <>
      {mobileOpen && <button className="navigation-backdrop" onClick={onClose} aria-label={copy.closeNavigation} />}
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-heading">
          <span>{copy.accountDetails}</span>
          <button className="sidebar-close" onClick={onClose} aria-label={copy.closeNavigation}>
            <Icon name="close" />
          </button>
        </div>

        <nav className="navigation-list" aria-label={copy.navigationLabel}>
          {sections.map((section) => (
            <button
              key={section.id}
              className={section.id === activeSection ? "navigation-item active" : "navigation-item"}
              onClick={() => onNavigate(section.id)}
              aria-current={section.id === activeSection ? "page" : undefined}
            >
              <Icon name={section.icon} size={19} />
              <span>{section.label}</span>
              {section.id === "internet" && <span className="attention-dot" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="privacy-tile">
            <Icon name="shield" size={18} />
            <span>{copy.privacyNotice}</span>
          </div>
          <span className="sidebar-demo-label">{copy.localOnly}</span>
        </div>
      </aside>
    </>
  );
}
