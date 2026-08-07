import { defineTool } from "eve/tools";
import { z } from "zod";

/**
 * Uses Eve's sandbox handle (Vercel Sandbox on deploy when configured).
 * Contrast with /api/labs/sandbox which calls @vercel/sandbox directly.
 */
export default defineTool({
  description:
    "Run a short, safe Node.js snippet in the isolated sandbox and return stdout/stderr. Use only for small helpers the user asked for.",
  inputSchema: z.object({
    code: z
      .string()
      .min(1)
      .describe("JavaScript source to write to /workspace/snippet.mjs and run with node"),
  }),
  async execute({ code }, ctx) {
    const sandbox = await ctx.getSandbox();
    await sandbox.writeTextFile({ path: "snippet.mjs", content: code });
    const result = await sandbox.run({ command: "node snippet.mjs" });

    return {
      layer: "eve-sandbox",
      stdout: result.stdout,
      stderr: result.stderr,
    };
  },
});
