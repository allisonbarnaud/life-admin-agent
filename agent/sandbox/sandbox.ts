import { defaultBackend, defineSandbox } from "eve/sandbox";

/**
 * Learning default: pick the best available backend.
 * On Vercel → Vercel Sandbox; locally → Docker → microsandbox → just-bash.
 *
 * To force hosted Vercel Sandbox even from local (needs Vercel creds):
 *   import { vercel } from "eve/sandbox/vercel";
 *   export default defineSandbox({ backend: vercel({ resources: { vcpus: 2 } }) });
 */
export default defineSandbox({
  backend: defaultBackend({
    vercel: { resources: { vcpus: 2 } },
  }),
});
