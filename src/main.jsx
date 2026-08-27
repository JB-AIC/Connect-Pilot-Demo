import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import IncidentPage from "./pages/IncidentPage.jsx";
import "./styles.css";
import "./pages/incident-page.css";

const incidentRoute = window.location.pathname.replace(/\/$/, "") === "/demo/incidents/8239";

createRoot(document.getElementById("root")).render(incidentRoute ? <IncidentPage /> : <App />);
