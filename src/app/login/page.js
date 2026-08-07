import { redirect } from "next/navigation";
import { Suspense } from "react";
import { requirePageAuth } from "@/lib/require-auth";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const auth = await requirePageAuth();
  if (auth.ok) {
    redirect("/");
  }

  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-slate-100 px-6 py-16">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-teal-700">
          Life Admin
        </p>
        <h1 className="mt-2 text-xl font-semibold text-slate-900">Password</h1>
        <p className="mt-1 text-sm text-slate-600">
          This chat is locked. Enter the shared password to continue.
        </p>
        <Suspense fallback={<p className="mt-8 text-sm text-slate-500">Loading…</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
