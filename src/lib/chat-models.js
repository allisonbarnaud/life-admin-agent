/**
 * Curated AI Gateway model IDs for the chat selector.
 * Pricing is approximate $/MTok from Gateway catalog — for UI estimates only.
 */

export const CHAT_MODEL_HEADER = "x-life-admin-model";

export const DEFAULT_CHAT_MODEL = "anthropic/claude-sonnet-5";

/**
 * @typedef {{
 *   id: string,
 *   label: string,
 *   group: "Frontier" | "Open weight",
 *   inputPerMTok: number | null,
 *   outputPerMTok: number | null,
 * }} ChatModelOption
 */

/** @type {readonly ChatModelOption[]} */
export const CHAT_MODELS = [
  // Frontier (closed / proprietary weights)
  {
    id: "anthropic/claude-sonnet-5",
    label: "Claude Sonnet 5",
    group: "Frontier",
    inputPerMTok: 2,
    outputPerMTok: 10,
  },
  {
    id: "anthropic/claude-opus-5",
    label: "Claude Opus 5",
    group: "Frontier",
    inputPerMTok: 5,
    outputPerMTok: 25,
  },
  {
    id: "openai/gpt-5",
    label: "GPT-5",
    group: "Frontier",
    inputPerMTok: 1.25,
    outputPerMTok: 10,
  },
  {
    id: "openai/gpt-5.4-mini",
    label: "GPT-5.4 Mini",
    group: "Frontier",
    inputPerMTok: 0.15,
    outputPerMTok: 0.6,
  },
  {
    id: "google/gemini-3.6-flash",
    label: "Gemini 3.6 Flash",
    group: "Frontier",
    inputPerMTok: 1.5,
    outputPerMTok: 7.5,
  },
  {
    id: "google/gemini-3.5-flash-lite",
    label: "Gemini 3.5 Flash Lite",
    group: "Frontier",
    inputPerMTok: 0.3,
    outputPerMTok: 2.5,
  },

  // Open weight
  {
    id: "meta/llama-4-maverick",
    label: "Llama 4 Maverick",
    group: "Open weight",
    inputPerMTok: 0.24,
    outputPerMTok: 0.97,
  },
  {
    id: "meta/llama-4-scout",
    label: "Llama 4 Scout",
    group: "Open weight",
    inputPerMTok: 0.17,
    outputPerMTok: 0.66,
  },
  {
    id: "meta/llama-3.3-70b",
    label: "Llama 3.3 70B",
    group: "Open weight",
    inputPerMTok: 0.72,
    outputPerMTok: 0.72,
  },
  {
    id: "openai/gpt-oss-120b",
    label: "GPT-OSS 120B",
    group: "Open weight",
    inputPerMTok: 0.1,
    outputPerMTok: 0.5,
  },
  {
    id: "openai/gpt-oss-20b",
    label: "GPT-OSS 20B",
    group: "Open weight",
    inputPerMTok: 0.05,
    outputPerMTok: 0.2,
  },
  {
    id: "google/gemma-4-31b-it",
    label: "Gemma 4 31B",
    group: "Open weight",
    inputPerMTok: 0.14,
    outputPerMTok: 0.4,
  },
  {
    id: "google/gemma-4-26b-a4b-it",
    label: "Gemma 4 26B A4B",
    group: "Open weight",
    inputPerMTok: 0.15,
    outputPerMTok: 0.6,
  },
  {
    id: "mistral/mistral-large-3",
    label: "Mistral Large 3",
    group: "Open weight",
    inputPerMTok: 0.5,
    outputPerMTok: 1.5,
  },
  {
    id: "mistral/mistral-small",
    label: "Mistral Small",
    group: "Open weight",
    inputPerMTok: 0.1,
    outputPerMTok: 0.3,
  },
  {
    id: "mistral/ministral-8b",
    label: "Ministral 8B",
    group: "Open weight",
    inputPerMTok: 0.15,
    outputPerMTok: 0.15,
  },
  {
    id: "deepseek/deepseek-v4-pro",
    label: "DeepSeek V4 Pro",
    group: "Open weight",
    inputPerMTok: 1.74,
    outputPerMTok: 3.48,
  },
  {
    id: "deepseek/deepseek-v4-flash",
    label: "DeepSeek V4 Flash",
    group: "Open weight",
    inputPerMTok: 0.2,
    outputPerMTok: 0.4,
  },
  {
    id: "deepseek/deepseek-r1",
    label: "DeepSeek R1",
    group: "Open weight",
    inputPerMTok: 1.35,
    outputPerMTok: 5.4,
  },
  {
    id: "alibaba/qwen3.5-plus",
    label: "Qwen 3.5 Plus",
    group: "Open weight",
    inputPerMTok: 0.4,
    outputPerMTok: 2.4,
  },
  {
    id: "alibaba/qwen3.5-flash",
    label: "Qwen 3.5 Flash",
    group: "Open weight",
    inputPerMTok: 0.1,
    outputPerMTok: 0.4,
  },
  {
    id: "alibaba/qwen3-coder-next",
    label: "Qwen3 Coder Next",
    group: "Open weight",
    inputPerMTok: 0.5,
    outputPerMTok: 1.2,
  },
  {
    id: "moonshotai/kimi-k2.5",
    label: "Kimi K2.5",
    group: "Open weight",
    inputPerMTok: 0.6,
    outputPerMTok: 3,
  },
  {
    id: "zai/glm-5",
    label: "GLM-5",
    group: "Open weight",
    inputPerMTok: 1,
    outputPerMTok: 3.2,
  },
  {
    id: "zai/glm-4.7-flash",
    label: "GLM-4.7 Flash",
    group: "Open weight",
    inputPerMTok: 0.07,
    outputPerMTok: 0.4,
  },
  {
    id: "minimax/minimax-m2.5",
    label: "MiniMax M2.5",
    group: "Open weight",
    inputPerMTok: 0.3,
    outputPerMTok: 1.2,
  },
];

export const CHAT_MODEL_GROUPS = ["Frontier", "Open weight"];

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
