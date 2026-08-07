import { start } from "workflow/api";
import { researchPipeline } from "../../../../../workflows/research-pipeline";
import { requireApiAuth } from "@/lib/require-auth";

export async function POST(req) {
  const unauthorized = await requireApiAuth();
  if (unauthorized) return unauthorized;

  const body = await req.json().catch(() => ({}));
  const topic = body.topic ?? "life admin";
  const run = await start(researchPipeline, [topic]);
  return Response.json({
    layer: "workflow-sdk",
    runId: run.runId,
    tip: "Inspect with: npx workflow web",
  });
}
