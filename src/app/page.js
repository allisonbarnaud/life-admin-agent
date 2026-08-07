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
              Life Admin
            </p>
            <h1 className="mt-1 font-[family-name:var(--font-geist-sans)] text-2xl font-semibold tracking-tight text-slate-900">
              Your everyday admin desk
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">
              Bills, errands, reminders, and short plans. Pick a model, ask for
              help, and keep an eye on speed and cost in the strip above the chat.
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
            <h2 className="font-medium text-slate-900">Chat</h2>
            <p className="mt-1">
              Ask in plain language. Task lists from tools are sample data until
              you connect a real store.
            </p>
          </div>
          <div>
            <h2 className="font-medium text-slate-900">Models</h2>
            <p className="mt-1">
              Switching models starts a fresh conversation. Costs in the strip
              are estimates unless the provider reports them.
            </p>
          </div>
          <div>
            <h2 className="font-medium text-slate-900">Limits</h2>
            <p className="mt-1">
              Not for medical, legal, or tax advice. Do not paste passwords or
              bank details into the chat.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
