const REQUEST_TIMEOUT_MS = 6500;

function extractText(payload) {
  if (typeof payload.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  for (const item of payload.output ?? []) {
    for (const content of item.content ?? []) {
      if (content.type === "output_text" && typeof content.text === "string") {
        return content.text.trim();
      }
    }
  }

  return null;
}

export async function optionallyRefineReply({ message, response, locale }) {
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (!apiKey || response.proposal || response.resetRequested) {
    return { ...response, mode: "local" };
  }

  try {
    const result = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        input: [
          {
            role: "developer",
            content:
              "Rewrite the provided fictional telecom support answer in a natural, concise tone. Preserve every number and factual statement. Do not claim to perform actions. Return only the rewritten answer in the requested language.",
          },
          {
            role: "user",
            content: JSON.stringify({ language: locale, question: message, answer: response.reply }),
          },
        ],
        max_output_tokens: 180,
      }),
    });

    if (!result.ok) {
      return { ...response, mode: "local" };
    }

    const text = extractText(await result.json());
    return text ? { ...response, reply: text, mode: "openai" } : { ...response, mode: "local" };
  } catch {
    return { ...response, mode: "local" };
  }
}
