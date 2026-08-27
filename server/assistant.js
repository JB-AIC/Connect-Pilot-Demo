import { createActionProposal } from "./actions.js";

export function normalizeMessage(message) {
  return String(message ?? "")
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function containsAny(value, patterns) {
  return patterns.some((pattern) => value.includes(pattern));
}

function localize(locale, values) {
  return locale === "en" ? values.en : values.de;
}

function makeProposal(session, type, payload) {
  return createActionProposal(session, type, payload);
}

function offerCard(account) {
  return {
    kind: "travel_offer",
    offer: account.availableOffers.switzerlandTravelPass,
  };
}

export function handleAssistantMessage(message, session) {
  const input = normalizeMessage(message);
  const { account, locale } = session;

  if (!input) {
    return {
      intent: "empty",
      reply: localize(locale, {
        de: "Stellen Sie mir einfach eine Frage zu Ihrer Rechnung, Ihrem Tarif oder Ihrem Internetanschluss.",
        en: "Ask me anything about your bill, your mobile plan, or your home internet connection.",
      }),
    };
  }

  if (
    containsAny(input, ["reset demo", "restart demo", "demo reset", "demo zurucksetzen", "demo neu starten"])
  ) {
    return {
      intent: "reset_demo",
      resetRequested: true,
      reply: localize(locale, {
        de: "Die Demo wurde zurückgesetzt. Alle fiktiven Kontodaten sind wieder im Ausgangszustand.",
        en: "The demo has been reset. All fictional account data is back to its original state.",
      }),
    };
  }

  if (
    containsAny(input, [
      "benachrichtig",
      "benachrichtige",
      "notify",
      "notification",
      "let me know",
      "give me an update",
      "inform me",
    ])
  ) {
    if (account.homeInternet.restorationNotificationRequested) {
      return {
        intent: "notification_already_active",
        reply: localize(locale, {
          de: "Ihre Benachrichtigung ist bereits aktiv. Wir informieren Sie, sobald der Anschluss wieder stabil läuft.",
          en: "Your notification is already active. We will let you know as soon as the connection is stable again.",
        }),
      };
    }

    return {
      intent: "enable_restoration_notification",
      reply: localize(locale, {
        de: "Gern informiere ich Sie, sobald die Störung behoben ist. Bitte bestätigen Sie die kostenfreie Benachrichtigung.",
        en: "I can let you know when the outage has been resolved. Please confirm the free service notification.",
      }),
      proposal: makeProposal(session, "enable_restoration_notification", {
        price: 0,
        phoneNumber: account.mobilePlan.maskedPhoneNumber,
      }),
    };
  }

  const isLostPhone = containsAny(input, ["lost my phone", "lost phone", "phone was stolen", "handy verloren", "handy gestohlen"]);
  const isSimBlock =
    input.includes("sim") && containsAny(input, ["block", "sperr", "disable", "stolen", "verloren"]);

  if (isLostPhone || isSimBlock) {
    const sim = account.simCards.find((item) => item.id === "sim-main");

    if (sim.status === "blocked") {
      return {
        intent: "sim_already_blocked",
        reply: localize(locale, {
          de: `Die SIM-Karte ${sim.maskedPhoneNumber} ist bereits gesperrt.`,
          en: `The SIM card ${sim.maskedPhoneNumber} is already blocked.`,
        }),
      };
    }

    return {
      intent: "block_sim",
      reply: localize(locale, {
        de: `Ich kann die SIM-Karte ${sim.maskedPhoneNumber} vorübergehend sperren. Anrufe, SMS und mobile Daten sind danach nicht mehr verfügbar. Bitte bestätigen Sie die Sperrung.`,
        en: `I can temporarily block the SIM card ${sim.maskedPhoneNumber}. Calls, texts, and mobile data will stop working. Please confirm the block.`,
      }),
      proposal: makeProposal(session, "block_sim", {
        simId: sim.id,
        phoneNumber: sim.maskedPhoneNumber,
      }),
    };
  }

  const isBill = containsAny(input, [
    "rechnung",
    "bill",
    "invoice",
    "charge",
    "18 euro",
    "18 eur",
    "teurer",
    "more expensive",
    "hoher",
    "higher",
  ]);

  if (isBill) {
    return {
      intent: "explain_bill",
      reply: localize(locale, {
        de: "Ihre aktuelle Rechnung beträgt 87,95 € statt 69,95 €. Der Unterschied von 18,00 € stammt aus mobiler Datennutzung in der Schweiz. In Ihrem fiktiven Tarif ist die Schweiz nicht im regulären EU-Roaming enthalten.",
        en: "Your current bill is €87.95 instead of €69.95. The €18.00 difference comes from mobile data usage in Switzerland, which is not included in standard EU roaming for your fictional plan.",
      }),
      card: {
        kind: "bill",
        billing: account.billing,
        offer: account.availableOffers.switzerlandTravelPass,
      },
    };
  }

  const isTravelPass = containsAny(input, [
    "travel pass",
    "reisepass",
    "reise pass",
    "roaming pass",
    "schweiz pass",
    "switzerland pass",
    "schweiz paket",
    "switzerland package",
    "swiss pass",
    "roaming paket",
    "travel package",
    "schweiz",
    "switzerland",
    "swiss roaming",
  ]);

  if (isTravelPass) {
    const offer = account.availableOffers.switzerlandTravelPass;
    const active = account.mobilePlan.activeAddOns.some((item) => item.id === offer.id);

    if (active) {
      return {
        intent: "travel_pass_already_active",
        reply: localize(locale, {
          de: "Ihr Schweiz Travel Pass ist bereits aktiv. Sie können ihn direkt in Ihrer Tarifübersicht sehen.",
          en: "Your Switzerland Travel Pass is already active. You can see it in your plan overview.",
        }),
        card: offerCard(account),
      };
    }

    const wantsActivation = containsAny(input, [
      "aktivier",
      "buch",
      "hinzufug",
      "abschliess",
      "activate",
      "add ",
      "add the",
      "book",
      "purchase",
      "buy",
      "get me",
      "can you add",
    ]);

    if (wantsActivation) {
      return {
        intent: "activate_travel_pass",
        reply: localize(locale, {
          de: "Der Schweiz Travel Pass kostet einmalig 9,95 €, gilt 7 Tage und enthält 3 GB mobiles Datenvolumen. Bitte bestätigen Sie die kostenpflichtige Aktivierung.",
          en: "The Switzerland Travel Pass costs €9.95, is valid for 7 days, and includes 3 GB of mobile data. Please confirm the purchase to activate it.",
        }),
        proposal: makeProposal(session, "activate_travel_pass", {
          offerId: offer.id,
          name: offer.name,
          price: offer.price,
          durationDays: offer.durationDays,
          includedDataGb: offer.includedDataGb,
        }),
      };
    }

    return {
      intent: "recommend_travel_pass",
      reply: localize(locale, {
        de: "Für Ihre nächste Reise empfehle ich den Schweiz Travel Pass: 7 Tage, 3 GB Datenvolumen und ein transparenter Einmalpreis von 9,95 €.",
        en: "For your next trip, I recommend the Switzerland Travel Pass: 7 days, 3 GB of data, and a transparent one-time price of €9.95.",
      }),
      card: offerCard(account),
    };
  }

  const isDataAddOn = containsAny(input, [
    "data boost",
    "data add on",
    "data addon",
    "extra data",
    "more data",
    "additional data",
    "mehr daten",
    "daten nachbuchen",
    "daten zubuchen",
    "datenvolumen buchen",
    "datenvolumen erhohen",
    "5 gb buchen",
    "5 gb datenvolumen",
    "zusatzlich 5 gb",
  ]);

  if (isDataAddOn) {
    const offer = account.availableOffers.mobileDataAddOn;

    if (account.mobilePlan.activeAddOns.some((item) => item.id === offer.id)) {
      return {
        intent: "data_addon_already_active",
        reply: localize(locale, {
          de: `Ihr Data Boost ist bereits aktiv. Aktuell sind ${account.mobilePlan.remainingDataGb} GB verfügbar.`,
          en: `Your Data Boost is already active. You currently have ${account.mobilePlan.remainingDataGb} GB available.`,
        }),
      };
    }

    return {
      intent: "activate_data_addon",
      reply: localize(locale, {
        de: "Ich kann 5 GB zusätzliches Datenvolumen für einmalig 7,95 € aktivieren. Bitte bestätigen Sie die kostenpflichtige Buchung.",
        en: "I can add 5 GB of mobile data for a one-time charge of €7.95. Please confirm the purchase.",
      }),
      proposal: makeProposal(session, "activate_data_addon", {
        offerId: offer.id,
        name: offer.name,
        price: offer.price,
        dataGb: offer.dataGb,
      }),
    };
  }

  const isInternet = containsAny(input, [
    "internet",
    "wlan",
    "wifi",
    "wi fi",
    "router",
    "outage",
    "storung",
    "slow connection",
    "broadband",
    "verbindung langsam",
  ]);

  if (isInternet) {
    const routerIssue = input.includes("router") && !containsAny(input, ["outage", "storung"]);
    const scenario = routerIssue ? "router_issue" : account.homeInternet.diagnosticScenario;

    return {
      intent: "diagnose_internet",
      reply: routerIssue
        ? localize(locale, {
            de: "Ihr Connect Router meldet eine instabile WLAN-Verbindung. Bitte trennen Sie den Router 30 Sekunden vom Strom und prüfen Sie anschließend die Statusanzeige.",
            en: "Your Connect Router reports an unstable Wi-Fi connection. Unplug the router for 30 seconds, reconnect it, and then check the status indicator.",
          })
        : localize(locale, {
            de: "Für München-Schwabing liegt eine lokale Netzstörung vor. Ihr Anschluss ist erreichbar, aber die Bandbreite ist reduziert. Die voraussichtliche Behebung ist heute um 16:30 Uhr.",
            en: "There is a local network outage in Munich-Schwabing. Your connection is available, but speeds are reduced. Service is expected to be restored today at 16:30.",
          }),
      card: {
        kind: "diagnostic",
        scenario,
        homeInternet: account.homeInternet,
      },
    };
  }

  if (containsAny(input, ["compare", "vergleich", "alternative", "anderer tarif", "other plans", "upgrade plan"])) {
    return {
      intent: "compare_plans",
      reply: localize(locale, {
        de: "Hier sind Ihre passenden Mobilfunktarife im Vergleich. Ihr aktueller Tarif liegt genau zwischen der Einstiegs- und Premiumoption.",
        en: "Here are the mobile plans available to you. Your current plan sits between the entry-level and premium options.",
      }),
      card: {
        kind: "plan_comparison",
        plans: account.availableOffers.alternativePlans,
        currentPlan: account.mobilePlan.name,
      },
    };
  }

  if (containsAny(input, ["vertrag", "contract", "tarif", "renewal", "kundigung", "my plan", "mein plan"])) {
    return {
      intent: "contract_overview",
      reply: localize(locale, {
        de: "Ihr Tarif Connect Mobile L kostet 39,95 € pro Monat und enthält 40 GB im 5G-Netz. Die nächste Vertragsverlängerung ist am 31. März 2027.",
        en: "Your Connect Mobile L plan costs €39.95 per month and includes 40 GB on the 5G network. Your next contract renewal is March 31, 2027.",
      }),
      card: {
        kind: "contract",
        plan: account.mobilePlan,
      },
    };
  }

  if (containsAny(input, ["gerat", "devices", "device", "sim", "handy", "smartphone", "watch"])) {
    return {
      intent: "devices_overview",
      reply: localize(locale, {
        de: "Zu Ihrem Konto gehören ein iPhone 16 Pro und eine Apple Watch. Ich habe die zugehörigen SIM-Karten und ihren aktuellen Status für Sie zusammengestellt.",
        en: "Your account includes an iPhone 16 Pro and an Apple Watch. Here are the associated SIM cards and their current status.",
      }),
      card: {
        kind: "devices",
        devices: account.devices,
        simCards: account.simCards,
      },
    };
  }

  if (containsAny(input, ["data", "daten", "gb", "allowance", "verbrauch", "remaining", "verfugbar"])) {
    const plan = account.mobilePlan;
    return {
      intent: "remaining_data",
      reply: localize(locale, {
        de: `Sie haben ${plan.usedDataGb} von ${plan.includedDataGb} GB verbraucht. Für den aktuellen Abrechnungsmonat stehen noch ${plan.remainingDataGb} GB zur Verfügung.`,
        en: `You have used ${plan.usedDataGb} of ${plan.includedDataGb} GB. You still have ${plan.remainingDataGb} GB available this billing month.`,
      }),
      card: {
        kind: "data_usage",
        plan,
      },
    };
  }

  if (containsAny(input, ["human", "agent", "person", "berater", "mitarbeiter", "support team", "kundendienst"])) {
    return {
      intent: "human_handoff",
      reply: localize(locale, {
        de: "Auf Wunsch übernimmt ein Service-Mitarbeiter. Ihre bisherigen Fragen und die relevanten Kontodaten würden sicher übergeben. Diese Übergabe ist in der Demo simuliert.",
        en: "A customer-service specialist can take over if needed. Your conversation and relevant account context would be handed off securely. This handoff is simulated in the demo.",
      }),
      card: {
        kind: "handoff",
      },
    };
  }

  return {
    intent: "fallback",
    reply: localize(locale, {
      de: "Ich helfe Ihnen gern mit Ihrer Rechnung, Ihrem Datenvolumen, einem Schweiz Travel Pass, Ihrem Internetanschluss oder Ihren SIM-Karten. Was möchten Sie prüfen?",
      en: "I can help with your bill, remaining data, a Switzerland Travel Pass, your home internet connection, or your SIM cards. What would you like to check?",
    }),
  };
}

export function actionSuccessMessage(action, account, locale) {
  const messages = {
    activate_travel_pass: {
      de: "Erledigt. Ihr Schweiz Travel Pass ist jetzt für 7 Tage aktiv. Sie finden ihn sofort in Ihren aktiven Optionen.",
      en: "Done. Your Switzerland Travel Pass is now active for 7 days. You can see it immediately in your active add-ons.",
    },
    activate_data_addon: {
      de: `Erledigt. Ihr Data Boost wurde aktiviert. Ihnen stehen jetzt ${account.mobilePlan.remainingDataGb} GB zur Verfügung.`,
      en: `Done. Your Data Boost is active. You now have ${account.mobilePlan.remainingDataGb} GB available.`,
    },
    block_sim: {
      de: "Die SIM-Karte wurde vorübergehend gesperrt. Anrufe, SMS und mobile Daten sind für diese SIM jetzt deaktiviert.",
      en: "The SIM card has been temporarily blocked. Calls, texts, and mobile data are now disabled for this SIM.",
    },
    enable_restoration_notification: {
      de: "Alles klar. Wir informieren Sie kostenfrei, sobald die Störung in München-Schwabing behoben ist.",
      en: "You're all set. We will notify you free of charge as soon as the outage in Munich-Schwabing has been resolved.",
    },
  };

  return localize(locale, messages[action]);
}
