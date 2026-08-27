async function request(path, options = {}) {
  const response = await fetch(path, {
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const payload = await response.json();

  if (!response.ok) {
    const error = new Error(payload.error ?? "The request could not be completed.");
    error.code = payload.code;
    throw error;
  }

  return payload;
}

function post(path, body = {}) {
  return request(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export const api = {
  getSession: () => request("/api/session"),
  getAccount: () => request("/api/account"),
  sendMessage: (message) => post("/api/chat", { message }),
  confirmAction: (token) => post("/api/actions/confirm", { token }),
  cancelAction: (token) => post("/api/actions/cancel", { token }),
  setLanguage: (locale) => post("/api/language", { locale }),
  reset: () => post("/api/reset"),
};
