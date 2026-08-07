import { eveChannel } from "eve/channels/eve";
import {
  localDev,
  UnauthenticatedError,
  vercelOidc,
  type AuthFn,
} from "eve/channels/auth";
import {
  isAuthConfigured,
  isRequestAuthenticated,
} from "../../src/lib/site-auth.js";
import { chatModelFromRequest } from "../../src/lib/chat-models.js";

/**
 * Stamp a validated chat model preference onto auth attributes so
 * agent.ts defineDynamic can select the Gateway model per session.
 */
function withChatModel(authFn: AuthFn<Request>): AuthFn<Request> {
  return async (request) => {
    const result = await authFn(request);
    if (!result) return result;
    const model = chatModelFromRequest(request);
    if (!model) return result;
    return {
      ...result,
      attributes: { ...result.attributes, model },
    };
  };
}

/**
 * Accept browser sessions created by POST /api/auth/login (CHAT_PASSWORD cookie).
 */
function sitePassword(): AuthFn<Request> {
  return async (request) => {
    if (!isAuthConfigured()) {
      throw new UnauthenticatedError({
        code: "authentication_required",
        message: "CHAT_PASSWORD is not configured.",
      });
    }
    if (!(await isRequestAuthenticated(request))) {
      return null;
    }
    return {
      authenticator: "site-password",
      principalId: "site-user",
      principalType: "user",
      attributes: {},
    };
  };
}

export default eveChannel({
  auth: [
    withChatModel(sitePassword()),
    vercelOidc(),
    withChatModel(localDev()),
  ],
});
