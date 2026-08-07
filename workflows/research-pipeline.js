import { sleep, FatalError } from "workflow";

/**
 * LAB: raw Workflow SDK (what Eve uses under the hood for durability).
 * Start from POST /api/labs/workflow — inspect runs with `npx workflow web`.
 */
export async function researchPipeline(topic) {
  "use workflow";

  const draft = await generateDraft(topic);
  await sleep("2s");
  const summary = await summarizeDraft(draft);
  return { topic, draft, summary, layer: "workflow-sdk" };
}

async function generateDraft(topic) {
  "use step";
  if (!topic?.trim()) {
    throw new FatalError("topic is required");
  }
  return `Draft notes about: ${topic.trim()}`;
}

async function summarizeDraft(draft) {
  "use step";
  return draft.slice(0, 120);
}
