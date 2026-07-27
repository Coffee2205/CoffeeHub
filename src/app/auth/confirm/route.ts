import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tokenHash = url.searchParams.get("token_hash");
  const code = url.searchParams.get("code");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const next = url.searchParams.get("next");
  const destination = next?.startsWith("/app") && !next.startsWith("//") ? next : "/app/dashboard";
  const supabase = await createClient();

  const result = tokenHash && type
    ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
    : code
      ? await supabase.auth.exchangeCodeForSession(code)
      : { error: new Error("Missing confirmation token") };

  if (result.error) return NextResponse.redirect(new URL("/login?reason=confirmation-failed", url.origin));
  return NextResponse.redirect(new URL(destination, url.origin));
}
