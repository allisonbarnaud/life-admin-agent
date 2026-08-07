/**
 * Curated AI Gateway model IDs for the chat selector.
 * Pricing is approximate $/MTok from Gateway catalog — for UI estimates only.
 */

export const CHAT_MODEL_HEADER = "x-life-admin-model";

export const DEFAULT_CHAT_MODEL = "anthropic/claude-sonnet-5";

/** @typedef {{ id: string, label: string, inputPerMTok: number | null, outputPerMTok: number | null }} ChatModelOption */

/** @type {readonly ChatModelOption[]} */
export const CHAT_MODELS = [
  {
    id: "anthropic/claude-sonnet-5",
    label: "Claude Sonnet 5",
    inputPerMTok: 2,
    outputPerMTok: 10,
  },
  {
    id: "anthropic/claude-opus-5",
    label: "Claude Opus 5",
    inputPerMTok: 5,
    outputPerMTok: 25,
  },
  {
    id: "openai/gpt-5",
    label: "GPT-5",
    inputPerMTok: 1.25,
    outputPerMTok: 10,
  },
  {
    id: "openai/gpt-5.4-mini",
    label: "GPT-5.4 Mini",
    inputPerMTok: 0.15,
    outputPerMTok: 0.6,
  },
  {
    id: "google/gemini-3.6-flash",
    label: "Gemini 3.6 Flash",
    inputPerMTok: 1.5,
    outputPerMTok: 7.5,
  },
  {
    id: "google/gemini-3.5-flash-lite",
    label: "Gemini 3.5 Flash Lite",
    inputPerMTok: 0.3,
    outputPerMTok: 2.5,
  },
];

const ALLOWED = new Set(CHAT_MODELS.map((m) => m.id));

/** @param {unknown} modelId */
export function isAllowedChatModel(modelId) {
  return typeof modelId === "string" && ALLOWED.has(modelId);
}

/** @param {unknown} modelId */
export function normalizeChatModel(modelId) {
  return isAllowedChatModel(modelId) ? modelId : DEFAULT_CHAT_MODEL;
}

/** @param {string} modelId */
export function getChatModelOption(modelId) {
  return CHAT_MODELS.find((m) => m.id === modelId) ?? null;
}

/**
 * Estimate USD cost from token counts and the static pricing table.
 * Prefer provider-reported `costUsd` from stream events when available.
 *
 * @param {string} modelId
 * @param {{ inputTokens?: number | null, outputTokens?: number | null }} usage
 */
export function estimateTokenCostUsd(modelId, usage) {
  const option = getChatModelOption(modelId);
  if (!option || option.inputPerMTok == null || option.outputPerMTok == null) {
    return null;
  }
  const input = Number(usage.inputTokens) || 0;
  const output = Number(usage.outputTokens) || 0;
  if (input <= 0 && output <= 0) return null;
  return (input * option.inputPerMTok + output * option.outputPerMTok) / 1_000_000;
}

/**
 * Read and validate the model preference header from an inbound Request.
 * @param {Request} request
 */
export function chatModelFromRequest(request) {
  const raw = request.headers.get(CHAT_MODEL_HEADER);
  return isAllowedChatModel(raw) ? raw : null;
}
