import { eveChannel } from "eve/channels/eve";
import { localDev, none, vercelOidc } from "eve/channels/auth";

// Learning / public demo: browser chat is open via none().
// Before a real product launch, replace none() with Auth.js, Clerk, etc.
export default eveChannel({
  auth: [
    vercelOidc(),
    localDev(),
    none(),
  ],
});
