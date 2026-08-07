import { redirect } from "next/navigation";
import { Chat } from "./components/chat";
import { LogoutButton } from "./components/logout-button";
import { requirePageAuth } from "@/lib/require-auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  const auth = await requirePageAuth();
  if (!auth.ok) {
    redirect(
      auth.reason === "unconfigured" ? "/login?error=unconfigured" : "/login?from=/",
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-teal-700">
              Learning lab
            </p>
            <h1 className="mt-1 font-[family-name:var(--font-geist-sans)] text-2xl font-semibold tracking-tight text-slate-900">
              Life Admin Agent
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">
              Eve agent plus labs for Vercel Workflows and Sandbox. Chat uses{" "}
              <code className="rounded bg-slate-100 px-1 text-teal-800">useEveAgent</code>.
              Hit <code className="rounded bg-slate-100 px-1 text-teal-800">/api/labs/*</code> for
              raw primitives.
            </p>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-6">
        <div className="flex min-h-[70vh] flex-1 flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <Chat />
        </div>

        <section className="mt-6 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
          <div>
            <h2 className="font-medium text-slate-900">Eve</h2>
            <p className="mt-1">
              Agent files under <code className="text-teal-800">agent/</code> —
              instructions, tools, sandbox.
            </p>
          </div>
          <div>
            <h2 className="font-medium text-slate-900">Workflows</h2>
            <p className="mt-1">
              Raw durable pipeline:{" "}
              <code className="text-teal-800">POST /api/labs/workflow</code>
            </p>
          </div>
          <div>
            <h2 className="font-medium text-slate-900">Sandbox</h2>
            <p className="mt-1">
              Raw microVM run:{" "}
              <code className="text-teal-800">POST /api/labs/sandbox</code>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
