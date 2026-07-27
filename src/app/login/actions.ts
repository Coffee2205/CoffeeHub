"use server";

import { redirect } from "next/navigation";

import { getPublicAppUrl } from "@/lib/env/public";
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

function safeNextPath(formData: FormData) {
  const candidate = String(formData.get("next") ?? "");
  return candidate.startsWith("/app") && !candidate.startsWith("//")
    ? candidate
    : "/app/dashboard";
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

  redirect(safeNextPath(formData));
}

export async function signupAction(_state: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const credentials = readCredentials(formData);

  if (!credentials.ok) {
    return { status: "error", message: credentials.error, fields: { email: credentials.email } };
  }

  const supabase = await createClient();
  const appUrl = (() => {
    try {
      return getPublicAppUrl();
    } catch {
      return null;
    }
  })();

  if (!appUrl) {
    return { status: "error", message: "Cấu hình ứng dụng chưa đầy đủ. Vui lòng thử lại sau.", fields: { email: credentials.email } };
  }

  const { data, error } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
    options: { emailRedirectTo: new URL("/auth/confirm", appUrl).toString() },
  });

  if (error) {
    return { status: "error", message: "Không thể tạo tài khoản. Email có thể đã được sử dụng hoặc yêu cầu chưa hợp lệ.", fields: { email: credentials.email } };
  }

  if (data.session) {
    redirect(safeNextPath(formData));
  }

  return { status: "success", message: "Kiểm tra email để xác nhận tài khoản, sau đó quay lại đăng nhập.", fields: { email: credentials.email } };
}

export async function logoutAction() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect("/login?reason=logout-failed");
  }

  redirect("/login?reason=signed-out");
}
