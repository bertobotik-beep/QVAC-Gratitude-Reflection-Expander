# QVAC Gratitude Reflection Expander

Enter one thing you're grateful for and an on-device AI writes a short, warm reflection paragraph expanding on why it might matter — grounded in the actual thing you mentioned, no invented specifics. No cloud call, no API key.

## How it works

1. You type something you're grateful for (e.g. `my morning coffee`) into the single input field and submit.
2. The server sends it to the on-device model with a system instruction to write a 3-5 sentence reflective paragraph on why it might genuinely matter — while explicitly forbidding the model from inventing new names, people, places, or events that weren't mentioned.
3. The reply is streamed token-by-token and cleaned up (stripped of quotes and preambles like "Here's...").
4. `logic.js` checks the result: if the model refuses or produces something unusably long or empty, the app falls back to a guaranteed-safe generic reflection paragraph instead.

### Example

- Input: `my morning coffee`
- Typical output: `"There's something grounding about a small ritual like morning coffee — it marks the start of the day and gives you a moment that belongs only to you before everything else demands your attention..."`

### QVAC functions used

- `loadModel({ modelSrc: LLAMA_3_2_1B_INST_Q4_0 })` — loads the model on-device at startup (`src/gui.js`).
- `completion({ modelId, history, stream: true, completionOpts })` — generates the reflection, streamed via `run.tokenStream` (`src/logic.js`).
- `unloadModel({ modelId })` — releases the model when the server shuts down (`src/gui.js`).

## Run

```bash
npm install
npm start
```

Then open http://localhost:31023

The port can be overridden with the `PORT` environment variable.

## QVAC SDK version

`@qvac/sdk` ^0.19.0 (see `package.json`).

## License

MIT
