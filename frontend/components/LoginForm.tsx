"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { api, TOKEN_KEY } from "@/lib/api";
import { TextField } from "@/components/FormFields";
import { isEmail } from "@/lib/validation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const busy = useRef(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy.current) return;

    const found: typeof errors = {};
    if (!isEmail(email.trim())) found.email = "Enter the email address you sign in with.";
    if (!password) found.password = "Enter your password.";
    setErrors(found);
    setError("");
    if (found.email || found.password) {
      document.getElementById(found.email ? "login-email" : "login-password")?.focus();
      return;
    }

    busy.current = true;
    setLoading(true);
    try {
      const res = await api.login(email.trim(), password);
      localStorage.setItem(TOKEN_KEY, res.access_token);
      router.push("/admin");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign in failed. Please try again.");
    } finally {
      busy.current = false;
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="on-dark mx-auto grid w-full max-w-sm gap-8" data-testid="login-form" aria-label="Owner sign in">
      <TextField dark required id="login-email" label="Email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />
      <TextField dark required id="login-password" label="Password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
      <div role="alert" className="empty:hidden">
        {error && <p className="border-l-2 border-white bg-white/10 p-4 text-[15px] font-medium">{error}</p>}
      </div>
      <button disabled={loading} className="btn-cobalt w-full">{loading ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}
