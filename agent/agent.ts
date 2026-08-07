import { defineAgent, defineDynamic } from "eve";
import {
  DEFAULT_CHAT_MODEL,
  isAllowedChatModel,
} from "../src/lib/chat-models.js";

function modelFromAuth(ctx: {
  session: {
    auth: {
      initiator?: { attributes: Readonly<Record<string, string | readonly string[]>> } | null;
      current?: { attributes: Readonly<Record<string, string | readonly string[]>> } | null;
    };
  };
}): string | null {
  const raw =
    ctx.session.auth.initiator?.attributes.model ??
    ctx.session.auth.current?.attributes.model;
  const modelId = Array.isArray(raw) ? raw[0] : raw;
  return isAllowedChatModel(modelId) ? modelId : null;
}

export default defineAgent({
  // Routed through Vercel AI Gateway (OIDC on Vercel, or AI_GATEWAY_API_KEY locally).
  // Browser chat sends x-life-admin-model; channel auth stamps attributes.model.
  model: defineDynamic({
    fallback: DEFAULT_CHAT_MODEL,
    events: {
      "session.started": (_event, ctx) => modelFromAuth(ctx),
    },
  }),
});
