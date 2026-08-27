# Connect Pilot Codex Workshop Workbook

# English

# Before you begin

## Option 1: Download from GitHub

If you downloaded this project as a ZIP from [GitHub](https://github.com/JB-AIC/Connect-Pilot-Demo), open the extracted project folder in a terminal and run these commands before starting the workshop:

```
git init
git add .
git commit -m "Initial commit"
```

GitHub ZIP downloads do not include the .git directory. Codex Worktrees require an initialized Git repository.

## Option 2: Use the provided ZIP directly

Use the provided workshop ZIP that already includes the Git repository. Extract the ZIP, open the project in Codex, and continue \- git init is not necessary.

# How To Use This Workbook

This facilitator-ready Deutsche Telekom workbook follows one continuous Connect Pilot scenario: first start and explore the existing application, then design an intelligent mobile-plan recommendation, build the customer-facing and secure switching flow, and review the same journey end to end. Each task provides a copy-ready prompt, customer value, expected output, and verification guidance.

# Task Map

| Task | Mode | Title | Main output |
| :---- | :---- | :---- | :---- |
| 0 | Setup | Start and Explore Connect Pilot | Running app, observed baseline customer journey, current plan-comparison gap. |
| 1 | Plan | Plan the Intelligent Plan-Switching Journey | Recommendation logic, recurring-price impact, secure-switch design. |
| 2-3 | Build | Build the Secure Plan-Switching Flow | Bilingual recommendation, confirmed switch, live account updates. |
| 3A (optional) | Worktree | Fix a Simulated Incident in Parallel | Isolated incident hotfix, accurate speed display, regression coverage, and uninterrupted feature development. |
| 4 | Review | Review the Complete Plan-Switching Journey | Verified switching journey, safeguards, regression tests, and build. |
| 5 | Test | Test the Complete Customer Journey | Manual walkthrough, verified upgrade, audit history, reset. |

# Workshop Scenario

Deutsche Telekom workshop through-line: Extend Connect Pilot from a read-only tariff comparison into an intelligent, trustworthy mobile-plan recommendation and secure plan-switching journey. Lara Weber currently uses Connect Mobile L with 40 GB for EUR 39.95 per month and has already used 22 GB. Compare Connect Mobile S with 20 GB for EUR 29.95 and Connect Mobile XL with 80 GB for EUR 49.95, explain why S is currently ineligible, and guide an XL upgrade with a transparent EUR 10 monthly increase. Carry this same customer story from the initial baseline walkthrough through Plan, Build, and Review while preserving bilingual support, explicit consent, backend authority, current invoices, and visible audit events.

## Before and After: Plan Switching

### Before implementation

1\. Ask: "Compare available mobile plans."

2\. Observe the existing, read-only comparison.

3\. Ask: "Switch me to Connect Mobile XL."

4\. Observe that no upgrade action or confirmation flow appears.

### After implementation

1\. Ask: "Compare available mobile plans."

2\. See eligibility, personalized recommendations, and price differences.

3\. Ask: "Switch me to Connect Mobile XL."

4\. Review the proposed change, confirm it, and see the account update.



# Task 0: Start the Application and Explore the Baseline

Setup | 5 min

**Recommended model:** GPT-5.6 Luna | Reasoning effort: Low

**The task:** Open the existing Connect Pilot project, start the application locally, and explore its current customer experience before planning or implementing a new feature.

**Desired outcome:** A running local application, a clear visual understanding of the dashboard and bilingual assistant, and a verified baseline showing that mobile plans can already be compared but cannot yet be switched.

**Input Prompt:**

```
Open the extracted Connect Pilot workshop folder as a Codex project. Read README.md, run npm install if needed, start the app with npm start, and open http://127.0.0.1:4175. Ask "Compare available mobile plans" to inspect the existing read-only comparison, then ask "Switch me to Connect Mobile XL" to confirm that plan switching is not yet supported. Keep the application running, do not edit files, and use this before-and-after gap as the starting point for Task 1.
```

**Expected output**
A running local Connect Pilot application, a verified read-only plan comparison, an unsupported upgrade request, and a clear starting point for Task 1\.

# Task 1: Plan the Intelligent Plan-Switching Journey

Plan | 5 min

**Recommended model:** GPT-5.6 Sol | Reasoning effort: High

**The task:** Trace the existing tariff-comparison UI, fictional account and offer data, assistant intents, confirmation-token lifecycle, and audit updates. Define the smallest safe design for intelligent plan recommendations and an explicitly confirmed plan switch before editing files.

**Desired outcome:** A source-backed implementation plan and acceptance criteria for Lara's current 40 GB plan, the ineligible 20 GB downgrade, the 80 GB upgrade, its EUR 10 recurring monthly increase, confirmation safeguards, projected billing, and bilingual customer experience.

**Input Prompt:**

```
Use Plan mode and inspect Connect Pilot without editing files. Design one end-to-end intelligent tariff recommendation and secure plan-switching journey for Lara Weber. Trace the seeded Connect Mobile L plan (40 GB, EUR 39.95/month, 22 GB used), Connect Mobile S (20 GB, EUR 29.95/month), and Connect Mobile XL (80 GB, EUR 49.95/month) through server/seed-data.js, server/assistant.js, server/actions.js, src/App.jsx, src/components/MessageCards.jsx, src/components/AccountRail.jsx, src/lib/translations.js, and test/. Explain why the S downgrade must be rejected, calculate the XL upgrade as +40 GB and +EUR 10/month, and identify the current-invoice versus next-bill-preview boundary. Map the existing proposal, explicit confirmation, session-scoped single-use token, account mutation, cancellation, and audit flow. Produce an ordered frontend/backend implementation plan, bilingual acceptance criteria, and targeted tests. Do not invent contract consequences or modify files.
```

**Expected output**

A concrete feature design, customer-value and recurring-price calculations, exact implementation touchpoints, explicit confirmation boundaries, and testable acceptance criteria for the Build steps.

# Task 2: Build the Intelligent Plan Recommendation

Build | 10 min

**Recommended model:** GPT-5.6 Sol | Reasoning effort: Medium

**The task:** Continue the Task 1 design by turning the existing plan-comparison card into a bilingual, actionable recommendation experience that explains suitability, recurring price changes, and the next step without changing account state.

**Desired outcome:** A polished English/German comparison that highlights Lara's current plan, explains why the 20 GB option is unavailable after 22 GB of usage, recommends the 80 GB XL plan, displays \+EUR 10 per month, and routes the upgrade request into the assistant's confirmation flow.

**Input Prompt:**

```
Implement the customer-facing part of the plan. Extend the existing plan comparison to show eligibility, personalized recommendations, and monthly price differences. Add an Upgrade action that starts the existing assistant confirmation flow without changing account state directly. Support German and English, preserve the current design, add relevant frontend tests, and run npm run build. Leave backend activation to Task 3.
```

**Expected output**

An interactive bilingual recommendation and upgrade entry point, clear eligibility and monthly-price explanations, responsive account-card behavior, frontend coverage, and a passing production build.

# Task 3: Build the Secure Plan-Switching Flow

Build | 10 min

**Recommended model:** GPT-5.6 Sol | Reasoning effort: High

**The task:** Complete the same plan-switching journey by extending the bilingual assistant, secure proposal and confirmation lifecycle, backend account mutation, projected billing, and audit trail.

**Desired outcome:** A working English/German XL upgrade that discloses the EUR 10 recurring monthly increase, requires explicit single-use confirmation, updates the plan and remaining data only after approval, preserves the current invoice, and records a bilingual audit event.

**Input Prompt:**

```
Complete the plan-switching feature from Task 2. Extend the bilingual assistant to propose and confirm plan changes using the existing secure action flow. Validate eligibility server-side, update account details and billing projections, preserve existing invoices and add-ons, and record an audit event. Clearly display recurring pricing, add relevant security and integration tests, and run npm test and npm run build.
```

**Expected output**

One complete bilingual plan-switching implementation with transparent recurring pricing, explicit consent, backend validation, updated account and billing preview, visible audit history, and automated safety coverage.

# Task 3A: Fix a Simulated Incident in Parallel Using Worktrees **(Optional)**

Build | 10 min

**Recommended model:** GPT-5.6 Terra | Reasoning effort: Medium

This exercise is optional. Continue directly to Task 4 if you are not exploring parallel development.

**The task:** While the intelligent plan-switching feature from Tasks 2 and 3 continues in your Local checkout, investigate and fix simulated incident INC-8239 in a separate Codex Worktree. The customer dashboard displays the advertised 100 Mbps plan speed even though the connection is degraded and currently delivers only 12 Mbps.

**Desired outcome:** Use Codex Worktrees to fix an urgent customer-facing issue without switching branches, stashing changes, or interrupting the ongoing plan-switching implementation.

## Step 1: Keep feature development running

Continue the plan-switching implementation from Tasks 2 and 3 in the original Local task. Do not switch branches, stash local changes, or stop the feature task.

## Step 2: Inspect the incident

Open the incident dashboard:

[http://127.0.0.1:4175/demo/incidents/8239](http://127.0.0.1:4175/demo/incidents/8239)

If your application uses another port, open the same path on that port. Confirm the initial incident state:

* Incident INC-8239 | P1 \- simulated | Open
* Current connection speed: 12 Mbps
* Displayed customer-dashboard speed: 100 Mbps
* Connection status: Degraded

## Step 3: Create a separate Codex Worktree

Open a new Codex task in the same project, select Worktree as the task environment, and start from the committed workshop baseline, typically main. Keep the original feature task running in Local.

Create a dedicated incident branch: agent/incident-8239-speed-display

Local task: Intelligent plan recommendations and secure plan switching.

Worktree task: INC-8239 \- Incorrect internet-speed display.

## Step 4: Give the incident task to Codex

**Input Prompt:**

```
Investigate and fix incident INC-8239: http://127.0.0.1:4175/demo/incidents/8239
Work only in this Worktree. Do not modify or interrupt the Local checkout.
Inspect the incident page and relevant code. Update the dashboard to show the actual 12 Mbps connection speed while clearly labeling the advertised 100 Mbps plan speed. Preserve the degraded status, active outage, bilingual support, and existing functionality.
Update the incident tests, add regression coverage, and run npm test and npm run build. Confirm the incident is resolved and summarize the changes. Do not merge the hotfix branch.
```

## Step 5: Verify both workstreams independently

* Current connection speed: 12 Mbps
* Displayed customer-dashboard speed: 12 Mbps
* Advertised plan speed: Up to 100 Mbps
* Incident status: Resolved
* Network outage: Still active

If both application versions run simultaneously, use port 4175 for the Local feature checkout and port 4180 for the incident Worktree. Install dependencies in the Worktree if needed, then start its application with PORT=4180 npm start.

Use separate browser profiles or an incognito window when switching between both versions because simulated session cookies can otherwise interfere.

Confirm that the feature task continues independently, the incident fix exists only in its dedicated Worktree and branch, npm test and npm run build succeed, both changes can be reviewed separately, and neither branch is merged during the exercise.

**Expected output:** One ongoing intelligent plan-switching feature in the Local checkout and one independently verified incident hotfix in a separate Codex Worktree.

# Task 4: Review the Complete Plan-Switching Journey

Review | 5 min

**Recommended model:** GPT-5.6 Sol | Reasoning effort: High

**The task:** Review the same intelligent recommendation and secure XL upgrade from Task 1 through Task 3 end to end, then check consent, pricing, eligibility, account consistency, auditability, bilingual behavior, and existing telecom journeys.

**Desired outcome:** A verified customer demo and concise pass/fail matrix proving the recommendation is accurate, no plan changes before confirmation, the XL switch and EUR 10 monthly increase are correct, unsafe requests fail, existing journeys still pass, and reset restores the baseline.

**Input Prompt:**

```
Review the plan-switching feature built in Tasks 2 and 3. Ask "Compare available mobile plans," then "Switch me to Connect Mobile XL," and confirm the upgrade. Verify plan eligibility, recurring pricing, explicit confirmation, secure token handling, account updates, bilingual support, and audit logging. Check existing features for regressions, run npm test and npm run build, fix any issues, and summarize the results.
```

**Expected output**

A verified end-to-end XL upgrade demo, documented consent and pricing checks, protected existing customer journeys, passing automated tests, a successful production build, and confirmed reset behavior.

# Task 5: Test the Complete Customer Journey

Review | 5 min

**Recommended model:** GPT-5.6 Luna | Reasoning effort: Low

**The task:** Manually test the new plan-switching feature from the customer's perspective, using the same customer questions before and after the upgrade.

**Desired outcome:** Confirm that plan recommendations, eligibility checks, recurring pricing, explicit confirmation, account updates, bilingual support, audit logging, and reset behavior work as expected.

**Input Prompt:**

```
Restart the running application, reset the demo, and test the complete plan-switching journey step by step. Ask "Compare available mobile plans" and verify the current plan, eligibility, recommendations, and monthly price differences. Ask "Switch me to Connect Mobile XL," review the recurring price, and confirm the upgrade. Verify the updated account, remaining data, audit history, German/English experience, and final reset. Report whether each step passes or fails.
```

**Expected output**
A repeatable customer-facing walkthrough with the expected plan, pricing, consent, data allowance, audit, language, and reset results clearly verified.

## Step-by-Step Manual Test

1. Reset the application
2. Open the application at http://127.0.0.1:4175.
3. Select Reset demo to restore the original account before testing.
4. Confirm the current plan is Connect Mobile L: 40 GB, EUR 39.95/month, and 22 GB used.
5. Ask: "Compare available mobile plans."
6. Verify Connect Mobile S with 20 GB is marked ineligible because 22 GB have already been used.
7. Verify Connect Mobile XL offers 80 GB for EUR 49.95/month, an increase of EUR 10/month.
8. Ask: "Switch me to Connect Mobile XL."
9. Verify that the application requests explicit confirmation and shows the recurring monthly price.
10. Confirm the upgrade.
11. Verify that the dashboard shows Connect Mobile XL, 80 GB total, and 58 GB remaining.
12. Confirm that the upgrade appears in the activity or audit history.
13. Switch between German and English and verify that the customer experience remains accurate.
14. Reset the application and confirm that the original Connect Mobile L account returns.

# Appendix A: Workshop Toolbox

If participants get stuck, use the toolbox to choose the smallest capability needed for the current task. Enable only what is useful for that step so Codex stays focused.

## Recommended Plugins And Skills

| Capability | Use when | What it helps with |
| :---- | :---- | :---- |
| Plan Mode | Planning | Scope work before edits, compare options, and avoid risky changes. |
| Build Web Apps | UI build | Build frontend features, UI states, and responsive app flows. |
| ImageGen | Visuals | Create mockups, diagrams, visual assets, and design variants. |
| OpenAI Developers | API work | Use API, Agents SDK, realtime, and platform best practices. |
| OpenAI Docs | Guidance | Find official guidance, examples, and implementation patterns. |
| Google Drive | Drive context | Use shared docs, feedback trackers, sheets, and workshop files. |
| Browser Use | Testing | Open local apps, test flows, inspect UI, and catch visual issues. |
| Subagents | Parallel work | Run parallel review, research, or implementation tasks. |

# Appendix B: Documentation And Knowledge Hub

Start with Codex Best Practices and the OpenAI API Docs, then jump into the specific guide for subagents, browser testing, realtime, image generation, or computer use.

* **OpenAI Developers Portal:** [https://developers.openai.com/](https://developers.openai.com/) \- Main entry point for OpenAI developer resources.
* **Codex Overview:** [https://developers.openai.com/codex/](https://developers.openai.com/codex/) \- Product overview and core Codex capabilities.
* **Codex Best Practices:** [https://developers.openai.com/codex/learn/best-practices](https://developers.openai.com/codex/learn/best-practices) \- Recommended ways to structure effective Codex work.
* **Codex Subagents:** [https://developers.openai.com/codex/concepts/subagents](https://developers.openai.com/codex/concepts/subagents) \- Parallel review and task delegation concepts.
* **Codex In-App Browser:** [https://developers.openai.com/codex/app/browser](https://developers.openai.com/codex/app/browser) \- Browser testing guidance for app flows.
* **OpenAI API Docs:** [https://developers.openai.com/api/docs](https://developers.openai.com/api/docs) \- Guides and references for building with OpenAI APIs.
* **Agents SDK Guide:** [https://developers.openai.com/api/docs/guides/agents](https://developers.openai.com/api/docs/guides/agents) \- Patterns for building agentic applications.
* **Realtime API Guide:** [https://developers.openai.com/api/docs/guides/realtime](https://developers.openai.com/api/docs/guides/realtime) \- Voice and realtime interaction patterns.
* **Image Generation Guide:** [https://developers.openai.com/api/docs/guides/tools-image-generation](https://developers.openai.com/api/docs/guides/tools-image-generation) \- Image generation implementation guidance.
* **Computer Use Guide:** [https://developers.openai.com/api/docs/guides/tools-computer-use](https://developers.openai.com/api/docs/guides/tools-computer-use) \- Computer-use implementation guidance.
* **OpenAI Documentation:** [https://platform.openai.com/docs](https://platform.openai.com/docs) \- Official technical documentation for OpenAI APIs, models, and guides.

# Deutsch

# Connect Pilot Codex Workshop-Arbeitsbuch

Anwendung: Connect Pilot | Bereich: Telekommunikations-Kundenservice

# Vor dem Start: Git bei ZIP-Downloads initialisieren

## Option 1: Über GitHub herunterladen

Wenn Sie dieses Projekt als ZIP-Datei von GitHub heruntergeladen haben, öffnen Sie den entpackten Projektordner im Terminal und führen Sie vor dem Workshop folgende Befehle aus:

git init

git add .

git commit \-m "Initial commit"

GitHub-ZIP-Downloads enthalten kein .git-Verzeichnis. Codex-Worktrees benötigen ein initialisiertes Git-Repository mit mindestens einem Commit.

## Option 2: Die bereitgestellte ZIP-Datei direkt verwenden

Verwenden Sie die bereitgestellte Workshop-ZIP-Datei, die das Git-Repository bereits enthält. Entpacken Sie die ZIP-Datei, öffnen Sie das Projekt in Codex und fahren Sie fort \- git init ist nicht erforderlich.

# So verwenden Sie dieses Arbeitsbuch

Dieses direkt einsetzbare Workshop-Arbeitsbuch für die Deutsche Telekom folgt einem durchgängigen Connect-Pilot-Szenario: Zuerst starten und erkunden Sie die bestehende Anwendung. Anschließend entwickeln Sie eine intelligente Mobilfunktarif-Empfehlung, implementieren den kundenorientierten und sicheren Tarifwechsel und prüfen denselben Ablauf von Anfang bis Ende. Jede Aufgabe enthält einen direkt verwendbaren Prompt, den Kundennutzen, das erwartete Ergebnis und Hinweise zur Überprüfung.

# Aufgabenübersicht

| Aufgabe | Modus | Titel | Hauptergebnis |
| :---- | :---- | :---- | :---- |
| 0 | Setup | Connect Pilot starten und erkunden | Laufende Anwendung, beobachteter bestehender Kundenablauf und aktuelle Lücke beim Tarifvergleich. |
| 1 | Plan | Den intelligenten Tarifwechsel planen | Empfehlungslogik, Auswirkungen auf den monatlichen Preis und Entwurf des sicheren Tarifwechsels. |
| 2-3 | Build | Den sicheren Tarifwechsel implementieren | Zweisprachige Empfehlung, bestätigter Tarifwechsel und sofort aktualisierte Kontodaten. |
| 3A (optional) | Worktree | Einen simulierten Incident parallel beheben | Isolierter Incident-Hotfix, korrekte Geschwindigkeitsanzeige, Regressionstests und ungestörte Feature-Entwicklung. |
| 4 | Review | Den vollständigen Tarifwechsel überprüfen | Überprüfter Tarifwechsel, Sicherheitsmaßnahmen, Regressionstests und erfolgreicher Build. |
| 5 | Test | Den vollständigen Kundenablauf testen | Manueller Durchlauf, überprüftes Upgrade, Audit-Verlauf und Zurücksetzen. |

# Workshop-Szenario

Durchgängiges Szenario für den Deutsche-Telekom-Workshop: Erweitern Sie Connect Pilot von einem reinen Tarifvergleich zu einer intelligenten, vertrauenswürdigen Mobilfunktarif-Empfehlung mit sicherem Tarifwechsel. Lara Weber nutzt aktuell Connect Mobile L mit 40 GB für 39,95 EUR pro Monat und hat bereits 22 GB verbraucht. Vergleichen Sie Connect Mobile S mit 20 GB für 29,95 EUR und Connect Mobile XL mit 80 GB für 49,95 EUR. Erklären Sie, warum S derzeit nicht infrage kommt, und begleiten Sie ein XL-Upgrade mit einer transparenten monatlichen Preiserhöhung von 10 EUR. Führen Sie dieselbe Kundengeschichte vom ersten Baseline-Durchlauf über Plan, Build und Review fort und erhalten Sie Zweisprachigkeit, ausdrückliche Zustimmung, serverseitige Kontrolle, bestehende Rechnungen und sichtbare Audit-Ereignisse.

## Vorher und nachher: Tarifwechsel

### Vor der Implementierung

1\. Fragen Sie: „Vergleiche die verfügbaren Mobilfunktarife.“

2\. Betrachten Sie den bestehenden Tarifvergleich ohne Wechselmöglichkeit.

3\. Fragen Sie: „Wechsle mich zu Connect Mobile XL.“

4\. Stellen Sie fest, dass weder eine Upgrade-Aktion noch ein Bestätigungsablauf angezeigt wird.

### Nach der Implementierung

1\. Fragen Sie: „Vergleiche die verfügbaren Mobilfunktarife.“

2\. Prüfen Sie Verfügbarkeit, personalisierte Empfehlungen und Preisunterschiede.

3\. Fragen Sie: „Wechsle mich zu Connect Mobile XL.“

4\. Prüfen Sie den vorgeschlagenen Wechsel, bestätigen Sie ihn und beobachten Sie die Aktualisierung des Kontos.



# Aufgabe 0: Anwendung starten und Ausgangszustand erkunden

Setup | 5 Min.

**Empfohlenes Modell:** GPT-5.6 Luna | Reasoning-Effort: Low

**Die Aufgabe:** Öffnen Sie das bestehende Connect-Pilot-Projekt, starten Sie die Anwendung lokal und erkunden Sie das aktuelle Kundenerlebnis, bevor Sie eine neue Funktion planen oder implementieren.

**Gewünschtes Ergebnis:** Eine laufende lokale Anwendung, ein klares Verständnis des Dashboards und des zweisprachigen Assistenten sowie ein überprüfter Ausgangszustand, der zeigt, dass Mobilfunktarife bereits verglichen, aber noch nicht gewechselt werden können.

**Eingabe-Prompt:**

```
Öffne den entpackten Connect-Pilot-Workshop-Ordner als Codex-Projekt. Lies README.md, führe bei Bedarf npm install aus, starte die Anwendung mit npm start und öffne http://127.0.0.1:4175. Frage „Vergleiche die verfügbaren Mobilfunktarife“, um den bestehenden Vergleich zu prüfen. Frage anschließend „Wechsle mich zu Connect Mobile XL“, um zu bestätigen, dass der Tarifwechsel noch nicht unterstützt wird. Lass die Anwendung laufen, ändere keine Dateien und nutze diese Vorher-nachher-Lücke als Ausgangspunkt für Aufgabe 1.
```

**Erwartetes Ergebnis**
Eine laufende lokale Connect-Pilot-Anwendung, ein überprüfter Tarifvergleich ohne Wechselmöglichkeit, eine noch nicht unterstützte Upgrade-Anfrage und ein klarer Ausgangspunkt für Aufgabe 1\.

# Aufgabe 1: Den intelligenten Tarifwechsel planen

Plan | 5 Min.

**Empfohlenes Modell:** GPT-5.6 Sol | Reasoning-Effort: High

**Die Aufgabe:** Analysieren Sie die bestehende Tarifvergleichsoberfläche, fiktive Konto- und Angebotsdaten, Assistenten-Intents, den Lebenszyklus der Bestätigungstoken und Audit-Aktualisierungen. Definieren Sie vor jeder Dateiänderung den kleinstmöglichen sicheren Entwurf für intelligente Tarifempfehlungen und einen ausdrücklich bestätigten Tarifwechsel.

**Gewünschtes Ergebnis:** Ein auf dem Quellcode basierender Implementierungsplan mit Akzeptanzkriterien für Laras aktuellen 40-GB-Tarif, das unzulässige 20-GB-Downgrade, das 80-GB-Upgrade, die wiederkehrende monatliche Preiserhöhung um 10 EUR, sichere Bestätigungen, die Rechnungsvorschau und das zweisprachige Kundenerlebnis.

**Eingabe-Prompt:**

```
Verwende den Plan-Modus und untersuche Connect Pilot, ohne Dateien zu ändern. Entwirf für Lara Weber einen durchgängigen Ablauf für intelligente Tarifempfehlungen und einen sicheren Tarifwechsel. Verfolge den vorbereiteten Tarif Connect Mobile L (40 GB, 39,95 EUR/Monat, 22 GB verbraucht), Connect Mobile S (20 GB, 29,95 EUR/Monat) und Connect Mobile XL (80 GB, 49,95 EUR/Monat) durch server/seed-data.js, server/assistant.js, server/actions.js, src/App.jsx, src/components/MessageCards.jsx, src/components/AccountRail.jsx, src/lib/translations.js und test/. Erkläre, warum das Downgrade auf S abgelehnt werden muss, berechne das XL-Upgrade mit +40 GB und +10 EUR/Monat und unterscheide die aktuelle Rechnung von der Vorschau auf die nächste Rechnung. Dokumentiere den bestehenden Ablauf für Vorschlag, ausdrückliche Bestätigung, sitzungsgebundenes Einmal-Token, Kontoänderung, Abbruch und Audit-Protokoll. Erstelle einen geordneten Frontend-/Backend-Implementierungsplan, zweisprachige Akzeptanzkriterien und gezielte Tests. Erfinde keine Vertragsfolgen und ändere keine Dateien.
```

**Erwartetes Ergebnis**

Ein konkreter Funktionsentwurf, Berechnungen zu Kundennutzen und wiederkehrenden Kosten, präzise Implementierungspunkte, klare Bestätigungsgrenzen und überprüfbare Akzeptanzkriterien für die Build-Schritte.

# Aufgabe 2: Die intelligente Tarifempfehlung implementieren

Build | 10 Min.

**Empfohlenes Modell:** GPT-5.6 Sol | Reasoning-Effort: Medium

**Die Aufgabe:** Setzen Sie den Entwurf aus Aufgabe 1 fort und entwickeln Sie die bestehende Tarifvergleichskarte zu einer zweisprachigen, handlungsorientierten Empfehlung weiter. Sie soll Eignung, wiederkehrende Preisänderungen und den nächsten Schritt erklären, ohne den Kontostatus zu verändern.

**Gewünschtes Ergebnis:** Ein hochwertiger deutsch-englischer Tarifvergleich, der Laras aktuellen Tarif hervorhebt, die Nichtverfügbarkeit der 20-GB-Option nach 22 GB Verbrauch erklärt, den XL-Tarif mit 80 GB empfiehlt, \+10 EUR pro Monat anzeigt und die Upgrade-Anfrage in den Bestätigungsablauf des Assistenten überführt.

**Eingabe-Prompt:**

```
Implementiere den kundenorientierten Teil des Plans. Erweitere den bestehenden Tarifvergleich um Verfügbarkeit, personalisierte Empfehlungen und monatliche Preisunterschiede. Ergänze eine Upgrade-Aktion, die den bestehenden Bestätigungsablauf des Assistenten startet, ohne den Kontostatus direkt zu ändern. Unterstütze Deutsch und Englisch, erhalte das bestehende Design, ergänze geeignete Frontend-Tests und führe npm run build aus. Die serverseitige Aktivierung folgt in Aufgabe 3.
```

**Erwartetes Ergebnis**

Eine interaktive zweisprachige Tarifempfehlung mit Upgrade-Einstieg, verständlichen Erläuterungen zu Verfügbarkeit und monatlichem Preis, responsiver Kontokarte, Frontend-Testabdeckung und erfolgreichem Produktions-Build.

# Aufgabe 3: Den sicheren Tarifwechsel implementieren

Build | 10 Min.

**Empfohlenes Modell:** GPT-5.6 Sol | Reasoning-Effort: High

**Die Aufgabe:** Vervollständigen Sie denselben Tarifwechsel, indem Sie den zweisprachigen Assistenten, den sicheren Vorschlags- und Bestätigungsablauf, die serverseitige Kontoänderung, die Rechnungsvorschau und das Audit-Protokoll erweitern.

**Gewünschtes Ergebnis:** Ein funktionierendes deutsch-englisches XL-Upgrade, das die wiederkehrende monatliche Erhöhung um 10 EUR transparent macht, eine ausdrückliche einmalige Bestätigung verlangt, Tarif und verbleibendes Datenvolumen erst nach Zustimmung aktualisiert, die aktuelle Rechnung unverändert lässt und ein zweisprachiges Audit-Ereignis protokolliert.

**Eingabe-Prompt:**

```
Vervollständige die Tarifwechselfunktion aus Aufgabe 2. Erweitere den zweisprachigen Assistenten so, dass er Tarifänderungen über den bestehenden sicheren Aktionsablauf vorschlägt und bestätigt. Prüfe die Berechtigung serverseitig, aktualisiere Kontodaten und Rechnungsvorschau, erhalte bestehende Rechnungen und Zusatzoptionen und protokolliere ein Audit-Ereignis. Zeige wiederkehrende Kosten transparent an, ergänze geeignete Sicherheits- und Integrationstests und führe npm test sowie npm run build aus.
```

**Erwartetes Ergebnis**

Eine vollständige zweisprachige Tarifwechsel Implementierung mit transparenten wiederkehrenden Kosten, ausdrücklicher Zustimmung, serverseitiger Validierung, aktualisiertem Konto und Rechnungsvorschau, sichtbarem Audit-Verlauf und automatisierter Sicherheitsabdeckung.

# Aufgabe 3A: Einen simulierten Incident parallel mit Worktrees beheben (optional)

Build | 10 Min.

**Empfohlenes Modell:** GPT-5.6 Terra | Reasoning-Effort: Medium

Diese Übung ist optional. Fahren Sie direkt mit Aufgabe 4 fort, wenn Sie parallele Entwicklung nicht vertiefen möchten.

**Die Aufgabe:** Während die intelligente Tarifwechsel Funktion aus den Aufgaben 2 und 3 in Ihrem Local-Checkout weiterentwickelt wird, untersuchen und beheben Sie den simulierten Incident INC-8239 in einem separaten Codex-Worktree. Das Kunden-Dashboard zeigt die beworbene Tarif Geschwindigkeit von 100 Mbit/s an, obwohl die Verbindung beeinträchtigt ist und aktuell nur 12 Mbit/s erreicht.

**Gewünschtes Ergebnis:** Nutzen Sie Codex-Worktrees, um ein dringendes kunden relevantes Problem zu beheben, ohne den Branch zu wechseln, Änderungen zwischenzuspeichern oder die laufende Tarifwechsel Implementierung zu unterbrechen.

## Schritt 1: Feature-Entwicklung weiterlaufen lassen

Setzen Sie die Tarifwechsel Implementierung aus den Aufgaben 2 und 3 in der ursprünglichen Local-Aufgabe fort. Wechseln Sie nicht den Branch, speichern Sie lokale Änderungen nicht zwischen und stoppen Sie die Feature-Aufgabe nicht.

## Schritt 2: Incident untersuchen

Öffnen Sie das Incident-Dashboard:

[http://127.0.0.1:4175/demo/incidents/8239](http://127.0.0.1:4175/demo/incidents/8239)

Falls Ihre Anwendung einen anderen Port verwendet, öffnen Sie denselben Pfad auf diesem Port. Prüfen Sie den ursprünglichen Incident-Zustand:

* Incident INC-8239 | P1 \- simuliert | Offen
* Aktuelle Verbindungsgeschwindigkeit: 12 Mbit/s
* Angezeigte Geschwindigkeit im Kunden-Dashboard: 100 Mbit/s
* Verbindungsstatus: Beeinträchtigt

## Schritt 3: Einen separaten Codex-Worktree erstellen

Öffnen Sie eine neue Codex-Aufgabe im selben Projekt, wählen Sie Worktree als Aufgabenumgebung und starten Sie vom eingecheckten Workshop-Ausgangszustand, normalerweise main. Lassen Sie die ursprüngliche Feature-Aufgabe in Local weiterlaufen.

Erstellen Sie einen eigenen Incident-Branch: agent/incident-8239-speed-display

Local-Aufgabe: Intelligente Tarifempfehlungen und sicherer Tarifwechsel.

Worktree-Aufgabe: INC-8239 \- Fehlerhafte Anzeige der Internetgeschwindigkeit.

## Schritt 4: Die Incident-Aufgabe an Codex übergeben

**Eingabe-Prompt:**

```
Untersuche und behebe Incident INC-8239: http://127.0.0.1:4175/demo/incidents/8239
Arbeite ausschließlich in diesem Worktree. Ändere oder unterbrich den Local-Checkout nicht.
Untersuche die Incident-Seite und den relevanten Code. Aktualisiere das Dashboard so, dass die tatsächliche Verbindungsgeschwindigkeit von 12 Mbit/s angezeigt und die beworbene Tarifgeschwindigkeit von 100 Mbit/s klar gekennzeichnet wird. Erhalte den beeinträchtigten Status, die aktive Störung, die Zweisprachigkeit und bestehende Funktionen.
Aktualisiere die Incident-Tests, ergänze Regressionstests und führe npm test sowie npm run build aus. Bestätige, dass der Incident behoben wurde, und fasse die Änderungen zusammen. Merge den Hotfix-Branch nicht.
```

## Schritt 5: Beide Arbeitsstränge unabhängig voneinander überprüfen

* Aktuelle Verbindungsgeschwindigkeit: 12 Mbit/s
* Angezeigte Geschwindigkeit im Kunden-Dashboard: 12 Mbit/s
* Beworbene Tarif Geschwindigkeit: Bis zu 100 Mbit/s
* Incident-Status: Behoben
* Netzstörung: Weiterhin aktiv

Falls beide Anwendungs Versionen gleichzeitig laufen, verwenden Sie Port 4175 für den Local-Feature-Checkout und Port 4180 für den Incident-Worktree. Installieren Sie bei Bedarf die Abhängigkeiten im Worktree und starten Sie dessen Anwendung anschließend mit PORT=4180 npm start.

Verwenden Sie beim Wechsel zwischen beiden Versionen getrennte Browser Profile oder ein Inkognito-Fenster, da sich simulierte Session-Cookies sonst gegenseitig beeinflussen können.

Bestätigen Sie, dass die Feature-Aufgabe unabhängig weiterläuft, der Incident-Fix ausschließlich in seinem eigenen Worktree und Branch existiert, npm test und npm run build erfolgreich sind, beide Änderungen separat überprüft werden können und während der Übung kein Branch gemergt wird.

**Erwartetes Ergebnis: Eine laufende intelligente Tarifwechsel Funktion im Local-Checkout und ein unabhängig überprüfter Incident-Hotfix in einem separaten Codex-Worktree.**

# Aufgabe 4: Den vollständigen Tarifwechsel überprüfen

Review | 5 Min.

**Empfohlenes Modell:** GPT-5.6 Sol | Reasoning-Effort: High

**Die Aufgabe:** Überprüfen Sie dieselbe intelligente Empfehlung und das sichere XL-Upgrade aus den Aufgaben 1 bis 3 vollständig. Kontrollieren Sie anschließend Zustimmung, Preise, Berechtigung, Konto Konsistenz, Nachvollziehbarkeit, Zweisprachigkeit und bestehende Telekommunikation Abläufe.

**Gewünschtes Ergebnis:** Eine überprüfte Kundendemo und eine kompakte Bestanden/Nicht-bestanden-Matrix, die belegt, dass die Empfehlung korrekt ist, vor der Bestätigung kein Tarifwechsel erfolgt, XL-Wechsel und monatliche Preiserhöhung um 10 EUR stimmen, unsichere Anfragen scheitern, bestehende Abläufe weiterhin funktionieren und ein Reset den Ausgangszustand wiederhergestellt.

**Eingabe-Prompt:**

```
Überprüfe die in den Aufgaben 2 und 3 implementierte Tarifwechselfunktion. Frage „Vergleiche die verfügbaren Mobilfunktarife“, anschließend „Wechsle mich zu Connect Mobile XL“, und bestätige das Upgrade. Prüfe Tarifverfügbarkeit, wiederkehrende Kosten, ausdrückliche Bestätigung, sichere Token-Verarbeitung, Kontoaktualisierungen, Zweisprachigkeit und Audit-Protokollierung. Untersuche bestehende Funktionen auf Regressionen, führe npm test und npm run build aus, behebe mögliche Probleme und fasse die Ergebnisse zusammen.
```

**Erwartetes Ergebnis**

Eine vollständig überprüfte XL-Upgrade-Demo, dokumentierte Zustimmungs- und Preisprüfungen, geschützte bestehende Kunden Abläufe, erfolgreiche automatisierte Tests, ein erfolgreicher Produktions-Build und ein bestätigtes Reset-Verhalten.

# Aufgabe 5: Den vollständigen Kundenablauf testen

Review | 5 Min.

**Empfohlenes Modell:** GPT-5.6 Luna | Reasoning-Effort: Low

**Die Aufgabe:** Testen Sie die neue Tarifwechsel Funktion manuell aus Kundensicht und verwenden Sie vor und nach dem Upgrade dieselben Kundenfragen.

**Gewünschtes Ergebnis:** Bestätigen Sie, dass Tarifempfehlungen, Verfügbarkeitsprüfungen, wiederkehrende Kosten, ausdrückliche Bestätigung, Konto Aktualisierungen, Zweisprachigkeit, Audit-Protokollierung und Reset-Verhalten erwartungsgemäß funktionieren.

**Eingabe-Prompt:**

```
Starte die laufende Anwendung neu, setze die Demo zurück und teste den vollständigen Tarifwechsel Schritt für Schritt. Frage „Vergleiche die verfügbaren Mobilfunktarife“ und prüfe den aktuellen Tarif, die Verfügbarkeit, Empfehlungen und monatlichen Preisunterschiede. Frage „Wechsle mich zu Connect Mobile XL“, prüfe die wiederkehrenden Kosten und bestätige das Upgrade. Kontrolliere das aktualisierte Konto, das verbleibende Datenvolumen, den Audit-Verlauf, das deutsch-englische Kundenerlebnis und den abschließenden Reset. Berichte für jeden Schritt, ob er bestanden wurde.
```

**Erwartetes Ergebnis**
Ein wiederholbarer Kundendurchlauf, bei dem Tarif, Preise, Zustimmung, Datenvolumen, Audit-Protokoll, Sprache und Reset-Verhalten nachvollziehbar überprüft werden.

## Manueller Test Schritt für Schritt

15. Anwendung zurücksetzen
16. Öffnen Sie die Anwendung unter http://127.0.0.1:4175.
17. Wählen Sie Reset demo, um vor dem Test das ursprüngliche Konto wiederherzustellen.
18. Bestätigen Sie den aktuellen Tarif Connect Mobile L: 40 GB, 39,95 EUR/Monat und 22 GB verbraucht.
19. Fragen Sie: „Vergleiche die verfügbaren Mobilfunktarife.“
20. Prüfen Sie, dass Connect Mobile S mit 20 GB nicht verfügbar ist, weil bereits 22 GB verbraucht wurden.
21. Prüfen Sie, dass Connect Mobile XL 80 GB für 49,95 EUR/Monat bietet \- eine Erhöhung um 10 EUR/Monat.
22. Fragen Sie: „Wechsle mich zu Connect Mobile XL.“
23. Prüfen Sie, dass die Anwendung eine ausdrückliche Bestätigung verlangt und den wiederkehrenden monatlichen Preis anzeigt.
24. Bestätigen Sie das Upgrade.
25. Prüfen Sie, dass das Dashboard Connect Mobile XL, insgesamt 80 GB und 58 GB verbleibendes Datenvolumen anzeigt.
26. Bestätigen Sie, dass das Upgrade im Aktivitäts- oder Audit-Verlauf erscheint.
27. Wechseln Sie zwischen Deutsch und Englisch und prüfen Sie, dass das Kundenerlebnis korrekt bleibt.
28. Setzen Sie die Anwendung zurück und bestätigen Sie, dass das ursprüngliche Connect-Mobile-L-Konto wiederhergestellt wird.

# Anhang A: Workshop-Werkzeugkasten

Wenn Teilnehmende nicht weiterkommen, wählen Sie im Werkzeugkasten die kleinstmögliche Fähigkeit für die aktuelle Aufgabe. Aktivieren Sie nur die für diesen Schritt hilfreichen Funktionen, damit Codex fokussiert bleibt.

## Empfohlene Plugins und Skills

| Fähigkeit | Einsatzbereich | Unterstützt bei |
| :---- | :---- | :---- |
| Plan-Modus | Planung | Arbeitsumfang vor Änderungen festlegen, Optionen vergleichen und riskante Änderungen vermeiden. |
| Webanwendungen erstellen | UI-Entwicklung | Frontend-Funktionen, UI-Zustände und responsive Anwendungsabläufe entwickeln. |
| ImageGen | Visualisierung | Mock-ups, Diagramme, visuelle Assets und Designvarianten erstellen. |
| OpenAI Developers | API-Entwicklung | API, Agents SDK, Realtime und bewährte Plattformverfahren nutzen. |
| OpenAI Docs | Orientierung | Offizielle Anleitungen, Beispiele und Implementierungsmuster finden. |
| Google Drive | Drive-Kontext | Freigegebene Dokumente, Feedback-Tracker, Tabellen und Workshop-Dateien nutzen. |
| Browser-Nutzung | Tests | Lokale Anwendungen öffnen, Abläufe testen, Oberflächen prüfen und Darstellungsprobleme erkennen. |
| Subagenten | Parallele Arbeit | Review-, Recherche- oder Implementierungsaufgaben parallel durchführen. |

# Anhang B: Dokumentation und Wissensdatenbank

Beginnen Sie mit Codex Best Practices und den OpenAI API Docs. Wechseln Sie anschließend zu den passenden Anleitungen für Subagenten, Browser-Tests, Realtime, Bildgenerierung oder Computer Use.

* **OpenAI-Entwicklerportal:** [https://developers.openai.com/](https://developers.openai.com/) \- Zentraler Einstiegspunkt für OpenAI-Entwicklerressourcen.
* **Codex-Überblick:** [https://developers.openai.com/codex/](https://developers.openai.com/codex/) \- Produktüberblick und zentrale Codex-Funktionen.
* **Codex Best Practices:** [https://developers.openai.com/codex/learn/best-practices](https://developers.openai.com/codex/learn/best-practices) \- Empfehlungen für eine wirkungsvolle Strukturierung der Arbeit mit Codex.
* **Codex-Subagenten:** [https://developers.openai.com/codex/concepts/subagents](https://developers.openai.com/codex/concepts/subagents) \- Konzepte für parallele Reviews und Aufgabendelegation.
* **Codex In-App-Browser:** [https://developers.openai.com/codex/app/browser](https://developers.openai.com/codex/app/browser) \- Anleitung für Browser-Tests von Anwendungsabläufen.
* **OpenAI API-Dokumentation:** [https://developers.openai.com/api/docs](https://developers.openai.com/api/docs) \- Anleitungen und Referenzen für die Entwicklung mit OpenAI APIs.
* **Agents-SDK-Anleitung:** [https://developers.openai.com/api/docs/guides/agents](https://developers.openai.com/api/docs/guides/agents) \- Muster für die Entwicklung agentischer Anwendungen.
* **Realtime-API-Anleitung:** [https://developers.openai.com/api/docs/guides/realtime](https://developers.openai.com/api/docs/guides/realtime) \- Muster für Sprach- und Echtzeitinteraktionen.
* **Anleitung zur Bildgenerierung:** [https://developers.openai.com/api/docs/guides/tools-image-generation](https://developers.openai.com/api/docs/guides/tools-image-generation) \- Hinweise zur Implementierung der Bildgenerierung.
* **Computer-Use-Anleitung:** [https://developers.openai.com/api/docs/guides/tools-computer-use](https://developers.openai.com/api/docs/guides/tools-computer-use) \- Hinweise zur Implementierung von Computer Use.
* **OpenAI-Dokumentation:** [https://platform.openai.com/docs](https://platform.openai.com/docs) \- Offizielle technische Dokumentation zu OpenAI APIs, Modellen und Anleitungen.
# Facilitator Notes

# Connect Pilot Facilitator Notes

# Purpose and Audience

Use this tab to facilitate the current Deutsche Telekom Connect Pilot workshop: participants turn a read-only mobile-plan comparison into an intelligent, bilingual recommendation and secure plan-switching journey. Suitable audiences include engineering leaders, product owners, customer-service stakeholders, developers, solution architects, and security reviewers.

**Format:** hands-on workshop with a baseline walkthrough, Plan mode, focused frontend and backend implementation, optional parallel Worktree incident response, review, and manual verification.

**Suggested duration:** approximately 40 minutes for Tasks 0-5. Adjust to participant experience and available time.

**Working languages:** English and German. Use the matching workbook tab and switch the application with its DE / EN control.

# Pre-Workshop Readiness

* Verify that Node.js and npm are available, then open the extracted Connect Pilot workshop folder as a Codex project.
* Check that participants start from the committed workshop baseline and can access the README.md, source code, and test/ directory.
* Run npm install if dependencies are missing, start the application with npm start, and open [http://127.0.0.1:4175](http://127.0.0.1:4175).
* Run npm test and npm run build before participants arrive. Record the actual results instead of quoting a fixed test count.
* Use Reset demo, ask "Compare available mobile plans," and confirm the existing comparison is read-only and plan switching is not yet supported.
* Verify Lara Weber starts on Connect Mobile L: 40 GB, EUR 39.95/month, 22 GB used, and 18 GB remaining. Check the S and XL comparison options.
* For optional Task 3A, confirm the simulated INC-8239 incident page, a committed baseline, and a separate Codex Worktree are available.

# Five-Minute Before-and-After Demonstration

* **Step 1:** Reset the demo and show Lara's Connect Mobile L baseline: 40 GB for EUR 39.95/month, with 22 GB used and 18 GB remaining.
* **Step 2:** Ask "Compare available mobile plans." Explain that Connect Mobile S offers 20 GB for EUR 29.95/month but is ineligible after 22 GB have already been used.
* **Step 3:** Highlight Connect Mobile XL: 80 GB for EUR 49.95/month, representing \+40 GB and a transparent \+EUR 10 recurring monthly increase.
* **Step 4:** Contrast the unsupported baseline upgrade with the completed feature. Ask "Switch me to Connect Mobile XL" and show that no account change occurs before explicit confirmation.
* **Step 5:** Confirm the switch. Verify Connect Mobile XL, 80 GB total, 58 GB remaining, the updated next-bill preview, an unchanged current invoice, and a visible audit event.
* **Step 6:** Switch between German and English, demonstrate cancellation or another safeguard if time permits, and reset to the original Connect Mobile L account.

# Suggested Workshop Flow

* **Task 0 \- Setup (5 min):** Start Connect Pilot, inspect the current dashboard, compare the existing plans, and confirm that switching is not yet available. Do not edit files.
* **Task 1 \- Plan (5 min):** Use Plan mode without editing files. Trace seeded plan data, UI, assistant intents, confirmation tokens, billing boundaries, and tests; define the ordered implementation.
* **Task 2 \- Build frontend (10 min):** Add bilingual eligibility, personalized recommendations, monthly price differences, and an Upgrade entry point. Do not mutate account state directly.
* **Task 3 \- Build backend (10 min):** Add server-side eligibility, explicit confirmation, plan and allowance updates, next-bill preview, and audit logging. Offer Task 3A as an optional 10-minute parallel Worktree exercise.
* **Tasks 4-5 \- Review and test (5 min each):** Review the complete feature, run npm test and npm run build, then manually verify recommendations, consent, pricing, account state, languages, audit history, and reset.

# Optional Worktree Challenge: Incident INC-8239

* **Incident baseline:** Open [http://127.0.0.1:4175/demo/incidents/8239](http://127.0.0.1:4175/demo/incidents/8239). Confirm the connection delivers 12 Mbps while the customer dashboard incorrectly displays the advertised 100 Mbps.
* **Separate Worktree:** Create a new Codex task in a Worktree from the committed workshop baseline, using the dedicated branch agent/incident-8239-speed-display.
* **Isolation:** Keep the plan-switching feature running in the Local checkout. Do not switch branches, stash changes, stop the feature task, or modify its checkout.
* **Expected fix:** Show the actual 12 Mbps connection speed and separately label the plan as "Up to 100 Mbps." Preserve the degraded state, active outage, bilingual support, and existing functionality.
* **Parallel runtime:** Keep the Local checkout on port 4175 and start the Worktree with PORT=4180 npm start. Use separate browser profiles or an incognito window to avoid session-cookie interference.
* **Independent verification:** Run npm test and npm run build in the Worktree, verify the incident is resolved while the outage remains active, review both workstreams separately, and do not merge either branch.

# Architecture and Safety Discussion

* Trace the existing implementation through server/seed-data.js, server/assistant.js, server/actions.js, src/App.jsx, src/components/MessageCards.jsx, src/components/AccountRail.jsx, src/lib/translations.js, and test/.
* The backend owns seeded account data, eligibility decisions, sessions, action proposals, explicit confirmations, account mutations, audit events, and resets.
* Reject the Connect Mobile S downgrade server-side because 22 GB already used exceeds its 20 GB allowance. Recommendations and Upgrade buttons must never change account state directly.
* Account changes require explicit consent and a session-scoped, single-use confirmation token. Verify cancellation, replay protection, invalid or expired tokens, and cross-session isolation.
* Disclose Connect Mobile XL as EUR 49.95/month and the recurring increase as \+EUR 10/month. Do not invent contract consequences, activation fees, or unsupported pricing assumptions.
* Preserve the existing current invoice and add-ons. Reflect the confirmed recurring change in the next-bill preview and update account cards, remaining data, and audit history consistently.
* Customer identities, plan offers, incident data, and integrations are fictional or simulated. Preserve English/German behavior and existing telecom customer journeys.
* Discuss customer understanding, service efficiency, transparent commercial recommendations, observability, and safe account actions without claiming measured savings, live integrations, production readiness, certification, or approval.

# Acceptance and Verification

* **Baseline:** Connect Pilot starts successfully, the original account shows Connect Mobile L with 40 GB and 22 GB used, and the initial comparison does not support switching.
* **Recommendation:** Connect Mobile S is ineligible after 22 GB used; Connect Mobile XL offers 80 GB for EUR 49.95/month; \+40 GB and \+EUR 10/month are clearly shown in both languages.
* **Confirmed switch:** No account change occurs before consent. After confirmation, the account shows Connect Mobile XL, 80 GB total, 58 GB remaining, an updated next-bill preview, and an audit event.
* **Safety:** The backend rejects ineligible downgrades, cancellation causes no mutation, confirmation tokens cannot be replayed or reused across sessions, and the current invoice and add-ons remain unchanged.
* **Regression and optional incident:** Existing telecom journeys remain functional. If Task 3A was completed, the isolated Worktree shows 12 Mbps actual speed, labels the 100 Mbps plan speed, and leaves the outage active.
* **Final checks:** npm test passes, npm run build completes, German and English remain accurate, and Reset demo restores the original Connect Mobile L account.

# Troubleshooting and Presenter Recovery

* If port 4175 is occupied, choose an available port with PORT=\<port\> npm start and use the printed URL. Reserve port 4180 for the optional Worktree when running both versions.
* If a previous participant changed the account, select Reset demo and confirm Connect Mobile L, 40 GB total, 22 GB used, and 18 GB remaining before continuing.
* If switching does not work before Tasks 2 and 3, treat that as the expected baseline. After implementation, inspect the assistant intent, server-side proposal, confirmation token, and account update.
* If Local and Worktree behavior appears mixed, verify the checkout, branch, port, and browser profile. Use a separate profile or incognito window to isolate simulated session cookies.
* If tests fail or participants broaden the scope, return to the current task, reproduce one customer-facing failure, make the smallest safe fix, and rerun npm test and npm run build.

# Closing Narrative

Connect Pilot demonstrates how Codex can turn an existing read-only telecom plan comparison into an intelligent, bilingual customer recommendation and a secure, explicitly confirmed account change.

Close on the verified customer journey: correct plan eligibility, transparent recurring pricing, trusted server-side consent, consistent account and billing state, auditability, optional isolated incident response, and repeatable verification.
