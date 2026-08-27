import { useEffect, useMemo, useState } from "react";
import AccountRail from "./components/AccountRail.jsx";
import AppHeader from "./components/AppHeader.jsx";
import ChatPanel from "./components/ChatPanel.jsx";
import Icon from "./components/Icon.jsx";
import Sidebar from "./components/Sidebar.jsx";
import { api } from "./lib/api.js";
import { createMessage } from "./lib/formatting.js";
import { getCopy } from "./lib/translations.js";

function welcomeMessage(locale) {
  return createMessage("assistant", getCopy(locale).welcome, { welcome: true });
}

export default function App() {
  const [account, setAccount] = useState(null);
  const [locale, setLocale] = useState("de");
  const [messages, setMessages] = useState([]);
  const [activeSection, setActiveSection] = useState("overview");
  const [sending, setSending] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [error, setError] = useState(null);
  const copy = useMemo(() => getCopy(locale), [locale]);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const session = await api.getSession();
        const result = await api.getAccount();

        if (!active) return;

        setLocale(session.locale);
        setAccount(result.account);
        setMessages([welcomeMessage(session.locale)]);
      } catch (loadError) {
        if (active) setError(loadError.message);
      }
    }

    load();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = "Connect Copilot";
  }, [locale]);

  async function sendMessage(message) {
    const normalized = message.trim();
    if (!normalized || sending) return;

    setMessages((current) => [...current, createMessage("user", normalized)]);
    setSending(true);

    try {
      const response = await api.sendMessage(normalized);
      const assistant = createMessage("assistant", response.reply, {
        card: response.card,
        proposal: response.proposal,
        mode: response.mode,
      });

      if (response.resetRequested) {
        setAccount(response.account);
        setMessages([welcomeMessage(locale), assistant]);
        setActiveSection("overview");
      } else {
        setMessages((current) => [...current, assistant]);
      }
    } catch (requestError) {
      setMessages((current) => [...current, createMessage("assistant", requestError.message)]);
    } finally {
      setSending(false);
    }
  }

  async function changeLanguage(nextLocale) {
    if (nextLocale === locale) return;

    try {
      await api.setLanguage(nextLocale);
      setLocale(nextLocale);
      setMessages((current) => current.map((message) => message.welcome
        ? { ...message, content: getCopy(nextLocale).welcome }
        : message));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  async function resetDemo() {
    setResetting(true);

    try {
      const result = await api.reset();
      setAccount(result.account);
      setMessages([welcomeMessage(locale)]);
      setActiveSection("overview");
    } catch (requestError) {
      setMessages((current) => [...current, createMessage("assistant", requestError.message)]);
    } finally {
      setResetting(false);
    }
  }

  async function confirmAccountAction(messageId, token) {
    setActionBusy(true);

    try {
      const result = await api.confirmAction(token);
      setAccount(result.account);
      setMessages((current) => [
        ...current.map((message) => message.id === messageId ? { ...message, actionStatus: "confirmed" } : message),
        createMessage("assistant", result.reply),
      ]);
    } catch (requestError) {
      setMessages((current) => [...current, createMessage("assistant", requestError.message)]);
    } finally {
      setActionBusy(false);
    }
  }

  async function cancelAccountAction(messageId, token) {
    setActionBusy(true);

    try {
      await api.cancelAction(token);
      setMessages((current) => [
        ...current.map((message) => message.id === messageId ? { ...message, actionStatus: "cancelled" } : message),
        createMessage("assistant", copy.actionCancelled),
      ]);
    } catch (requestError) {
      setMessages((current) => [...current, createMessage("assistant", requestError.message)]);
    } finally {
      setActionBusy(false);
    }
  }

  function navigate(section) {
    setActiveSection(section);
    setMobileMenuOpen(false);

    const messagesBySection = {
      mobile: locale === "de" ? "Zeig mir meinen Vertrag und Tarif." : "Show me my contract and plan.",
      internet: copy.prompts.find((item) => item.id === "internet").message,
      bills: copy.prompts.find((item) => item.id === "bill").message,
      devices: locale === "de" ? "Zeig mir meine Geräte und SIM-Karten." : "Show me my devices and SIM cards.",
      support: locale === "de" ? "Kann ein Service-Mitarbeiter übernehmen?" : "Can a human support agent take over?",
    };

    if (messagesBySection[section]) sendMessage(messagesBySection[section]);
  }

  if (error && !account) {
    return (
      <div className="loading-screen error-screen">
        <Icon name="alert" size={32} />
        <h1>{copy.errorLoading}</h1>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>{copy.retry}</button>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="loading-screen">
        <div className="loading-symbol"><Icon name="sparkles" size={28} /></div>
        <p>{copy.loading}</p>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <AppHeader
        account={account}
        locale={locale}
        onLanguageChange={changeLanguage}
        onReset={resetDemo}
        onOpenMenu={() => setMobileMenuOpen(true)}
        copy={copy}
        resetting={resetting}
      />

      <div className="workspace">
        <Sidebar
          activeSection={activeSection}
          onNavigate={navigate}
          copy={copy}
          mobileOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        <ChatPanel
          account={account}
          locale={locale}
          copy={copy}
          messages={messages}
          sending={sending}
          actionBusy={actionBusy}
          onAsk={sendMessage}
          onConfirm={confirmAccountAction}
          onCancel={cancelAccountAction}
        />

        <AccountRail account={account} locale={locale} copy={copy} onAsk={sendMessage} />
      </div>
    </div>
  );
}
