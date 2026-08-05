"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginAction, type AuthActionState } from "@/app/login/actions";

const initialState: AuthActionState = { status: "idle", message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Đang xử lý…" : "Đăng nhập"}
    </Button>
  );
}

export function AuthForm({ nextPath }: { nextPath: string }) {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <input type="hidden" name="next" value={nextPath} />
      <div className="space-y-1.5">
        <label
          htmlFor="login-email"
          className="text-sm font-medium text-foreground-secondary"
        >
          Email
        </label>
        <Input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={state.fields?.email}
          required
          invalid={state.status === "error"}
        />
      </div>
      <div className="space-y-1.5">
        <label
          htmlFor="login-password"
          className="text-sm font-medium text-foreground-secondary"
        >
          Mật khẩu
        </label>
        <Input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          minLength={8}
          required
          invalid={state.status === "error"}
        />
      </div>
      {state.message ? (
        <p
          role={state.status === "error" ? "alert" : "status"}
          className={
            state.status === "error"
              ? "rounded-sm border border-error/30 bg-error/10 p-3 text-sm text-red-200"
              : "rounded-sm border border-success/30 bg-success/10 p-3 text-sm text-green-200"
          }
        >
          {state.message}
        </p>
      ) : null}
      <SubmitButton />
    </form>
  );
}
