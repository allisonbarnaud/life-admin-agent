"use client";

import { useEveAgent } from "eve/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CHAT_MODEL_GROUPS,
  CHAT_MODEL_HEADER,
  CHAT_MODELS,
  DEFAULT_CHAT_MODEL,
  estimateTokenCostUsd,
  normalizeChatModel,
} from "@/lib/chat-models";

function formatUsd(value) {
  if (value == null || Number.isNaN(value)) return "—";
  if (value < 0.01) return `$${value.toFixed(4)}`;
  return `$${value.toFixed(3)}`;
}

function formatMs(value) {
  if (value == null) return "—";
  return `${Math.round(value)} ms`;
}

function formatTokens(value) {
  if (value == null) return "—";
  return value.toLocaleString();
}

/**
 * One Eve session bound to a model id. Remount (via key) to hot-switch models.
 */
function ChatSession({ modelId }) {
  const sendStartedAtRef = useRef(null);
  const ttftCapturedForTurnRef = useRef(null);
  const [metrics, setMetrics] = useState({
    ttftMs: null,
    inputTokens: null,
    outputTokens: null,
    costUsd: null,
    costSource: null,
    turnId: null,
  });

  const headers = useCallback(
    () => ({ [CHAT_MODEL_HEADER]: modelId }),
    [modelId],
  );

  const onEvent = useCallback(
    (event) => {
      if (event.type === "turn.started") {
        const turnId = event.data?.turnId ?? null;
        ttftCapturedForTurnRef.current = null;
        setMetrics((prev) => ({
          ...prev,
          ttftMs: null,
          inputTokens: null,
          outputTokens: null,
          costUsd: null,
          costSource: null,
          turnId,
        }));
        return;
      }

      const isFirstToken =
        (event.type === "message.appended" || event.type === "reasoning.appended") &&
        sendStartedAtRef.current != null &&
        ttftCapturedForTurnRef.current !== event.data?.turnId;

      if (isFirstToken) {
        const ttftMs = performance.now() - sendStartedAtRef.current;
        ttftCapturedForTurnRef.current = event.data?.turnId ?? "captured";
        setMetrics((prev) => ({
          ...prev,
          ttftMs,
          turnId: event.data?.turnId ?? prev.turnId,
        }));
      }

      if (event.type === "step.completed") {
        const usage = event.data?.usage;
        if (!usage) return;
        setMetrics((prev) => {
          const inputTokens =
            (prev.inputTokens ?? 0) + (Number(usage.inputTokens) || 0);
          const outputTokens =
            (prev.outputTokens ?? 0) + (Number(usage.outputTokens) || 0);
          const stepCost =
            usage.costUsd != null && !Number.isNaN(Number(usage.costUsd))
              ? Number(usage.costUsd)
              : null;
          const reportedCost =
            stepCost != null
              ? (prev.costSource === "reported" ? (prev.costUsd ?? 0) : 0) +
                stepCost
              : prev.costSource === "reported"
                ? prev.costUsd
                : null;
          const estimated = estimateTokenCostUsd(modelId, {
            inputTokens,
            outputTokens,
          });
          const costUsd = reportedCost != null ? reportedCost : estimated;
          return {
            ...prev,
            inputTokens,
            outputTokens,
            costUsd,
            costSource:
              reportedCost != null
                ? "reported"
                : estimated != null
                  ? "estimate"
                  : null,
            turnId: event.data?.turnId ?? prev.turnId,
          };
        });
      }
    },
    [modelId],
  );

  const agent = useEveAgent({ headers, onEvent });
  const busy = agent.status === "submitted" || agent.status === "streaming";

  async function onSubmit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const message = String(form.get("message") ?? "").trim();
    if (!message || busy) return;
    event.currentTarget.reset();
    sendStartedAtRef.current = performance.now();
    ttftCapturedForTurnRef.current = null;
    await agent.send({ message });
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <dl className="mb-3 grid grid-cols-2 gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 sm:grid-cols-4">
        <div>
          <dt className="font-medium text-slate-500">First token</dt>
          <dd className="mt-0.5 font-[family-name:var(--font-geist-mono)] text-slate-900">
            {formatMs(metrics.ttftMs)}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">In</dt>
          <dd className="mt-0.5 font-[family-name:var(--font-geist-mono)] text-slate-900">
            {formatTokens(metrics.inputTokens)}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">Out</dt>
          <dd className="mt-0.5 font-[family-name:var(--font-geist-mono)] text-slate-900">
            {formatTokens(metrics.outputTokens)}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-slate-500">
            Cost
            {metrics.costSource === "estimate" ? " (est.)" : ""}
          </dt>
          <dd className="mt-0.5 font-[family-name:var(--font-geist-mono)] text-slate-900">
            {formatUsd(metrics.costUsd)}
          </dd>
        </div>
      </dl>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-1 py-2">
        {agent.data.messages.length === 0 ? (
          <p className="text-sm text-slate-500">
            Try something like “What’s on my bills list?” or “Help me plan
            errands for Thursday.”
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
          name="message"
          disabled={busy}
          placeholder="What do you need sorted?"
          className="min-w-0 flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-teal-600/30 placeholder:text-slate-400 focus:ring-2 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-md bg-teal-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {busy ? "…" : "Send"}
        </button>
      </form>
    </div>
  );
}

export function Chat() {
  const [modelId, setModelId] = useState(DEFAULT_CHAT_MODEL);
  const [sessionKey, setSessionKey] = useState(0);

  const modelLabel = useMemo(
    () => CHAT_MODELS.find((m) => m.id === modelId)?.label ?? modelId,
    [modelId],
  );

  useEffect(() => {
    try {
      const saved = localStorage.getItem("life-admin-chat-model");
      if (saved) setModelId(normalizeChatModel(saved));
    } catch {
      // ignore
    }
  }, []);

  function onModelChange(event) {
    const next = normalizeChatModel(event.target.value);
    setModelId(next);
    setSessionKey((key) => key + 1);
    try {
      localStorage.setItem("life-admin-chat-model", next);
    } catch {
      // ignore
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <label className="flex min-w-0 flex-1 flex-col gap-1 text-xs text-slate-500 sm:max-w-xs">
          <span className="font-medium uppercase tracking-wide">Model</span>
          <select
            value={modelId}
            onChange={onModelChange}
            className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900 outline-none ring-teal-600/30 focus:ring-2"
          >
            {CHAT_MODEL_GROUPS.map((group) => (
              <optgroup key={group} label={group}>
                {CHAT_MODELS.filter((model) => model.group === group).map(
                  (model) => (
                    <option key={model.id} value={model.id}>
                      {model.label}
                    </option>
                  ),
                )}
              </optgroup>
            ))}
          </select>
        </label>
        <p className="text-xs text-slate-500">
          Changing the model clears this chat and starts over with {modelLabel}.
        </p>
      </div>

      <div className="min-h-0 flex-1">
        <ChatSession key={`${modelId}:${sessionKey}`} modelId={modelId} />
      </div>
    </div>
  );
}
