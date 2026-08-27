import test from "node:test";
import assert from "node:assert/strict";
import { getCopy } from "../src/lib/translations.js";
import { formatDate, formatMoney } from "../src/lib/formatting.js";

test("German and English translations have the same complete set of UI strings", () => {
  assert.deepEqual(Object.keys(getCopy("de")).sort(), Object.keys(getCopy("en")).sort());
});

test("both languages expose the four executive demo prompts", () => {
  for (const locale of ["de", "en"]) {
    const prompts = getCopy(locale).prompts;
    assert.deepEqual(prompts.map((prompt) => prompt.id), ["bill", "travel", "internet", "data"]);
    assert.ok(prompts.every((prompt) => prompt.label && prompt.message));
  }
});

test("currency formatting follows the selected language", () => {
  assert.match(formatMoney(87.95, "de"), /87,95/);
  assert.match(formatMoney(87.95, "en"), /87\.95/);
});

test("dates are formatted for both supported languages", () => {
  assert.match(formatDate("2027-03-31", "de"), /2027/);
  assert.match(formatDate("2027-03-31", "en"), /2027/);
});
