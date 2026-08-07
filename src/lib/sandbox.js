import { Sandbox } from "@vercel/sandbox";

/**
 * LAB: call @vercel/sandbox directly (no Eve).
 * On Vercel, OIDC is automatic. Locally set VERCEL_TOKEN + TEAM + PROJECT
 * (or use `vercel link` / `vercel env pull`).
 */
export async function runSnippet(code) {
  const sandbox = await Sandbox.create({
    runtime: "node24",
    timeout: 60_000,
    persistent: false,
  });

  try {
    await sandbox.writeFiles([
      {
        path: "snippet.js",
        content: Buffer.from(code),
      },
    ]);
    const result = await sandbox.runCommand("node", ["snippet.js"]);
    return {
      layer: "vercel-sandbox-sdk",
      exitCode: result.exitCode,
      stdout: await result.stdout(),
      stderr: await result.stderr(),
    };
  } finally {
    await sandbox.stop();
  }
}
