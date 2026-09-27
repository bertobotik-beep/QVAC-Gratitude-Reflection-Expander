// QVAC Gratitude Reflection Expander — core logic.
// completion() writes a short warm reflection on why the user's stated
// gratitude might matter. The prompt explicitly forbids inventing new
// concrete specifics (names, places, numbers) beyond what was mentioned.

import { completion } from "@qvac/sdk";

function looksUnusable(text) {
  if (!text || text.trim().length === 0) return true;
  if (text.length > 500) return true;
  const bad = ["i cannot", "i can't", "as an ai", "i'm not able", "i do not have", "please provide"];
  const lower = text.toLowerCase();
  return bad.some((phrase) => lower.includes(phrase));
}

const FALLBACK = (gratitude) =>
  `Being grateful for "${gratitude}" is a quiet reminder of what actually holds your life together. ` +
  `It's easy to overlook the things that steady us until we stop and name them. Taking a moment to ` +
  `appreciate this is its own small act of care for yourself.`;

export async function generate(modelId, gratitude) {
  const run = completion({
    modelId,
    history: [
      {
        role: "system",
        content:
          "Write a short, warm reflective paragraph (3-5 sentences) about why the thing the user is " +
          "grateful for might genuinely matter in their life. Stay grounded in the general theme of what " +
          "they said. Do NOT invent new specific facts, names, people, places, or events that were not " +
          "mentioned by the user. Reply with ONLY the reflection paragraph, no preamble, no explanation.",
      },
      { role: "user", content: "Grateful for: my morning coffee" },
      {
        role: "assistant",
        content:
          "There's something grounding about a small ritual like morning coffee — it marks the start of " +
          "the day and gives you a moment that belongs only to you before everything else demands your " +
          "attention. It's easy to overlook something so ordinary, but ordinary comforts are often what " +
          "carry us through. Being grateful for it is a way of noticing the steadiness it quietly provides.",
      },
      { role: "user", content: `Grateful for: ${gratitude}` },
    ],
    stream: true,
    completionOpts: { temperature: 0.75, maxTokens: 200 },
  });

  let text = "";
  for await (const token of run.tokenStream) text += token;
  text = text
    .trim()
    .replace(/^here'?s[^:\n]*:\s*/i, "")
    .trim()
    .replace(/^["'“]|["'”]$/g, "")
    .trim();

  const reflection = looksUnusable(text) ? FALLBACK(gratitude) : text;
  return { reflection };
}
