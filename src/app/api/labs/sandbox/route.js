import { runSnippet } from "@/lib/sandbox";
import { requireApiAuth } from "@/lib/require-auth";

export async function POST(req) {
  const unauthorized = await requireApiAuth();
  if (unauthorized) return unauthorized;

  const body = await req.json().catch(() => ({}));
  const code = body.code ?? 'console.log("hello from raw vercel sandbox")';

  try {
    const result = await runSnippet(code);
    return Response.json(result);
  } catch (error) {
    return Response.json(
      {
        error: error instanceof Error ? error.message : String(error),
        tip: "Needs Vercel auth (OIDC on deploy, or VERCEL_TOKEN / TEAM / PROJECT locally).",
      },
      { status: 500 },
    );
  }
}
