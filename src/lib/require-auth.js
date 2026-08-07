import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  isAuthConfigured,
  verifySessionToken,
} from "@/lib/site-auth";

export async function requirePageAuth() {
  if (!isAuthConfigured()) {
    return { ok: false, reason: "unconfigured" };
  }
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    return { ok: false, reason: "unauthorized" };
  }
  return { ok: true };
}

export async function requireApiAuth() {
  if (!isAuthConfigured()) {
    return NextResponse.json(
      { error: "CHAT_PASSWORD is not configured on the server." },
      { status: 503 },
    );
  }
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
