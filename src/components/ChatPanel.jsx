import { useEffect, useRef, useState } from "react";
import Icon from "./Icon.jsx";
import MessageCard, { ActionConfirmation } from "./MessageCards.jsx";
import { formatTime } from "../lib/formatting.js";

function greeting(copy) {
  const hour = new Date().getHours();
  if (hour < 11) return copy.goodMorning;
  if (hour < 18) return copy.goodAfternoon;
  return copy.goodEvening;
}

function AssistantAvatar({ compact = false }) {
  return (
    <span className={compact ? "assistant-avatar compact" : "assistant-avatar"} aria-hidden="true">
      <Icon name="sparkles" size={compact ? 19 : 25} />
    </span>
  );
}

function Message({ message, account, locale, copy, onAsk, onConfirm, onCancel, actionBusy }) {
  const assistant = message.role === "assistant";

  return (
    <article className={`chat-message ${assistant ? "assistant-message" : "user-message"}`}>
      {assistant && <AssistantAvatar compact />}
      <div className="message-content">
        {assistant && (
          <div className="message-byline">
            <strong>{copy.assistantName}</strong>
            <span>{formatTime(message.createdAt, locale)}</span>
          </div>
        )}
        <div className="message-bubble">{message.content}</div>
        {message.card && <MessageCard card={message.card} account={account} copy={copy} locale={locale} onAsk={onAsk} />}
        {message.proposal && (
          <ActionConfirmation
            message={message}
            account={account}
            copy={copy}
            locale={locale}
            onConfirm={onConfirm}
            onCancel={onCancel}
            actionBusy={actionBusy}
          />
        )}
      </div>
    </article>
  );
}

export default function ChatPanel({ account, locale, copy, messages, sending, actionBusy, onAsk, onConfirm, onCancel }) {
  const [draft, setDraft] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: messages.length > 1 ? "smooth" : "instant", block: "end" });
  }, [messages, sending]);

  function submit(event) {
    event.preventDefault();
    const message = draft.trim();

    if (!message || sending) return;

    setDraft("");
    onAsk(message);
    inputRef.current?.focus();
  }

  return (
    <main className="chat-panel">
      <section className="welcome-banner">
        <div className="welcome-copy">
          <span className="welcome-eyebrow">{copy.verifiedCustomer}</span>
          <h1>{greeting(copy)}, {account.customer.firstName}</h1>
          <p>{copy.personalAssistant}</p>
        </div>
        <div className="welcome-orb"><AssistantAvatar /></div>
      </section>

      <section className="conversation-panel" aria-label={copy.assistantName}>
        <div className="conversation-header">
          <div className="assistant-identity">
            <AssistantAvatar compact />
            <div><strong>{copy.assistantName}</strong><span>{copy.availableNow}</span></div>
          </div>
          <span className="assistant-online"><span />{copy.online}</span>
        </div>

        <div className="messages-scroll" aria-live="polite" aria-relevant="additions">
          {messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              account={account}
              locale={locale}
              copy={copy}
              onAsk={onAsk}
              onConfirm={onConfirm}
              onCancel={onCancel}
              actionBusy={actionBusy}
            />
          ))}
          {sending && (
            <div className="typing-indicator" aria-label={copy.assistantName}>
              <span /><span /><span />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="conversation-footer">
          <div className="suggested-prompts">
            {copy.prompts.map((prompt) => (
              <button key={prompt.id} onClick={() => onAsk(prompt.message)} disabled={sending}>
                <Icon name={prompt.icon} size={15} />
                {prompt.label}
              </button>
            ))}
          </div>

          <form className="message-composer" onSubmit={submit}>
            <input
              ref={inputRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={copy.composerPlaceholder}
              aria-label={copy.composerPlaceholder}
              maxLength={2000}
            />
            <button type="submit" disabled={!draft.trim() || sending} aria-label={copy.sendMessage}>
              <Icon name="send" size={19} />
            </button>
          </form>

          <p className="chat-disclaimer"><Icon name="shield" size={13} />{copy.assistantDisclaimer}</p>
        </div>
      </section>
    </main>
  );
}
