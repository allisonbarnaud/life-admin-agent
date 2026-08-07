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
# Set AI_GATEWAY_API_KEY, or: npx vercel link && npx vercel env pull

npm run dev          # Next.js UI + Eve (via withEve)
# or
npm run eve:dev      # Eve TUI / REPL
```

Open [http://localhost:3000](http://localhost:3000) for chat.

## Layout

| Path | Role |
| --- | --- |
| `agent/` | Eve agent — instructions, tools, sandbox, channel |
| `agent/tools/` | Typed tools (`list_life_admin_tasks`, `run_in_sandbox`) |
| `agent/sandbox/` | Sandbox backend + seeded `/workspace` |
| `workflows/` | **Lab:** raw Workflow SDK pipeline |
| `src/app/api/labs/` | **Lab:** HTTP entrypoints for raw Workflow + Sandbox |
| `src/lib/sandbox.js` | **Lab:** direct `@vercel/sandbox` helper |

## Labs

**Workflow (durable steps)**

```bash
curl -X POST http://localhost:3000/api/labs/workflow \
  -H 'content-type: application/json' \
  -d '{"topic":"weekly meal plan"}'

npx workflow web   # inspect runs
```

**Sandbox (raw microVM)** — needs Vercel auth locally or a Vercel deploy:

```bash
curl -X POST http://localhost:3000/api/labs/sandbox \
  -H 'content-type: application/json' \
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

`agent/channels/eve.ts` allows Vercel OIDC + local Eve/Vercel dev. Replace `placeholderAuth()` before real production browser traffic (or use `none()` only for public demos).
