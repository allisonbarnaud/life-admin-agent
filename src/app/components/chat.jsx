"use client";

import { useEveAgent } from "eve/react";
import { useState } from "react";

export function Chat() {
  const agent = useEveAgent();
  const [draft, setDraft] = useState("");
  const busy = agent.status === "submitted" || agent.status === "streaming";

  async function onSubmit(event) {
    event.preventDefault();
    const message = draft.trim();
    if (!message || busy) return;
    setDraft("");
    await agent.send({ message });
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-1 py-2">
        {agent.data.messages.length === 0 ? (
          <p className="text-sm text-slate-500">
            Ask about tasks, or try: “List my bills tasks” / “Run a node snippet
            that prints hello from the sandbox”.
          </p>
        ) : null}

        {agent.data.messages.map((message) => (
          <article
            key={message.id}
            className={
              message.role === "user"
                ? "ml-8 rounded-lg bg-teal-700 px-3 py-2 text-sm text-white"
                : "mr-8 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800"
            }
          >
            <header className="mb-1 text-[11px] font-medium uppercase tracking-wide opacity-70">
              {message.role}
            </header>
            {message.parts.map((part, index) => {
              if (part.type === "text") {
                return (
                  <p key={index} className="whitespace-pre-wrap leading-relaxed">
                    {part.text}
                  </p>
                );
              }
              if (part.type === "dynamic-tool" || part.type?.startsWith?.("tool-")) {
                return (
                  <pre
                    key={index}
                    className="mt-2 overflow-x-auto rounded bg-white p-2 text-xs text-slate-600 ring-1 ring-slate-200"
                  >
                    {JSON.stringify(part, null, 2)}
                  </pre>
                );
              }
              return null;
            })}
          </article>
        ))}

        {agent.error ? (
          <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {agent.error.message}
          </p>
        ) : null}
      </div>

      <form onSubmit={onSubmit} className="mt-3 flex gap-2 border-t border-slate-200 pt-3">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          disabled={busy}
          placeholder="Message Life Admin Agent…"
          className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-teal-600/30 placeholder:text-slate-400 focus:ring-2 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={busy || !draft.trim()}
          className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {busy ? "…" : "Send"}
        </button>
      </form>
    </div>
  );
}
