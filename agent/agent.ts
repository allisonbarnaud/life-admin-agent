import { defineAgent } from "eve";

export default defineAgent({
  // Routed through Vercel AI Gateway (OIDC on Vercel, or AI_GATEWAY_API_KEY locally).
  model: "anthropic/claude-sonnet-5",
});
