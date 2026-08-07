import { start } from "workflow/api";
import { researchPipeline } from "../../../../../workflows/research-pipeline";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const topic = body.topic ?? "life admin";
  const run = await start(researchPipeline, [topic]);
  return Response.json({
    layer: "workflow-sdk",
    runId: run.runId,
    tip: "Inspect with: npx workflow web",
  });
}
