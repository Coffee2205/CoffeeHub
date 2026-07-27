"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginAction, signupAction, type AuthActionState } from "@/app/login/actions";

const initialState: AuthActionState = { status: "idle", message: "" };

function SubmitButton({ mode }: { mode: "login" | "signup" }) {
  const { pending } = useFormStatus();
  return <Button type="submit" className="w-full" disabled={pending}>{pending ? "Đang xử lý…" : mode === "login" ? "Đăng nhập" : "Tạo tài khoản"}</Button>;
}

export function AuthForm({ mode, nextPath }: { mode: "login" | "signup"; nextPath: string }) {
  const action = mode === "login" ? loginAction : signupAction;
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <input type="hidden" name="next" value={nextPath} />
      <div className="space-y-1.5"><label htmlFor={`${mode}-email`} className="text-sm font-medium text-foreground-secondary">Email</label><Input id={`${mode}-email`} name="email" type="email" autoComplete="email" defaultValue={state.fields?.email} required invalid={state.status === "error"} /></div>
      <div className="space-y-1.5"><label htmlFor={`${mode}-password`} className="text-sm font-medium text-foreground-secondary">Mật khẩu</label><Input id={`${mode}-password`} name="password" type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={8} required invalid={state.status === "error"} /></div>
      {state.message ? <p role={state.status === "error" ? "alert" : "status"} className={state.status === "error" ? "rounded-sm border border-error/30 bg-error/10 p-3 text-sm text-red-200" : "rounded-sm border border-success/30 bg-success/10 p-3 text-sm text-green-200"}>{state.message}</p> : null}
      <SubmitButton mode={mode} />
    </form>
  );
}
