"use server";

import { redirect } from "next/navigation";

import { safeOwnerNextPath } from "@/lib/auth/redirects";
import { createClient } from "@/lib/supabase/server";

export type AuthActionState = {
  status: "idle" | "error" | "success";
  message: string;
  fields?: { email: string };
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type CredentialsResult =
  | { ok: true; email: string; password: string }
  | { ok: false; error: string; email: string };

function readCredentials(formData: FormData): CredentialsResult {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!emailPattern.test(email)) {
    return { ok: false, error: "Vui lòng nhập địa chỉ email hợp lệ.", email };
  }

  if (password.length < 8) {
    return { ok: false, error: "Mật khẩu phải có ít nhất 8 ký tự.", email };
  }

  return { ok: true, email, password };
}

export async function loginAction(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const credentials = readCredentials(formData);

  if (!credentials.ok) {
    return { status: "error", message: credentials.error, fields: { email: credentials.email } };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: credentials.email, password: credentials.password });

  if (error) {
    return { status: "error", message: "Không thể đăng nhập. Hãy kiểm tra email và mật khẩu.", fields: { email: credentials.email } };
  }

  redirect(safeOwnerNextPath(String(formData.get("next") ?? "")));
}

export async function logoutAction() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect("/login?reason=logout-failed");
  }

  redirect("/");
}
