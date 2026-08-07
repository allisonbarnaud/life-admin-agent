# Life Admin Agent

Learning project for **Eve** (agent framework), **Vercel Workflows** (durable execution), and **Vercel Sandbox** (isolated compute).

```text
Next.js UI (useEveAgent)
        ↓  /eve/v1/*
Eve agent (agent/)
  ├─ tools, skills, channels
  ├─ durability → Workflows
  └─ isolation  → Sandbox
```

## Quick start

```bash
cp .env.example .env.local
# Set CHAT_PASSWORD (required for the login gate)
# Set AI_GATEWAY_API_KEY, or: npx vercel link && npx vercel env pull

npm run dev          # Next.js UI + Eve (via withEve)
# or
npm run eve:dev      # Eve TUI / REPL
```

Visit `/login`, enter `CHAT_PASSWORD`, then use the chat. The home page, lab
APIs, and Eve channel all check the same session cookie.

Open [http://localhost:3000](http://localhost:3000) for chat.

The chat UI includes a **model selector** (AI Gateway IDs such as
`anthropic/claude-sonnet-5`). Changing the model remounts `useEveAgent` so the
next message starts a fresh Eve session with that model. A small metrics strip
shows TTFT, input/output tokens from `step.completed`, and approximate cost.

## Layout

| Path | Role |
| --- | --- |
| `agent/` | Eve agent — instructions, tools, sandbox, channel |
| `agent/tools/` | Typed tools (`list_life_admin_tasks`, `run_in_sandbox`) |
| `agent/sandbox/` | Sandbox backend + seeded `/workspace` |
| `workflows/` | **Lab:** raw Workflow SDK pipeline |
| `src/app/api/labs/` | **Lab:** HTTP entrypoints for raw Workflow + Sandbox |
| `src/lib/sandbox.js` | **Lab:** direct `@vercel/sandbox` helper |
| `src/lib/chat-models.js` | Curated Gateway models, pricing estimates, header name |

## Labs

Lab APIs require the same session cookie as the UI (`life_admin_session` from
`/login`). After signing in in the browser, copy the cookie into `curl`, or hit
the endpoints from the logged-in origin.

**Workflow (durable steps)**

```bash
curl -X POST http://localhost:3000/api/labs/workflow \
  -H 'content-type: application/json' \
  -H "cookie: life_admin_session=$SESSION" \
  -d '{"topic":"weekly meal plan"}'

npx workflow web   # inspect runs
```

**Sandbox (raw microVM)** — needs Vercel auth locally or a Vercel deploy:

```bash
curl -X POST http://localhost:3000/api/labs/sandbox \
  -H 'content-type: application/json' \
  -H "cookie: life_admin_session=$SESSION" \
  -d '{"code":"console.log(1+1)"}'
```

## Suggested learning path

1. Chat with the agent (no custom tools needed beyond the stubs).
2. Call `list_life_admin_tasks` via chat — app-runtime Eve tool.
3. Call `run_in_sandbox` or ask the agent to `cat NOTES.md` — Eve → Sandbox.
4. Hit `/api/labs/workflow` and `/api/labs/sandbox` — same primitives without Eve.
5. Deploy to Vercel (`npx eve deploy` or Git) and watch Agent Runs / Workflows in the dashboard.

## Docs

- [Eve](https://eve.dev/docs) (also `node_modules/eve/docs/`)
- [Vercel Workflows](https://vercel.com/docs/workflows) / [Workflow SDK](https://useworkflow.dev)
- [Vercel Sandbox](https://vercel.com/docs/sandbox)
- [AI Gateway](https://vercel.com/docs/ai-gateway)

## Auth note

Browser chat is gated by `CHAT_PASSWORD` (cookie from `/login`). The Eve
channel accepts that cookie, Vercel OIDC, and local Eve/Vercel dev. The chat
UI sends `x-life-admin-model`; channel auth copies it into `attributes.model`
for per-session dynamic model selection.
