"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.login(email, password);
      localStorage.setItem("nv_admin_token", res.access_token);
      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-sm mx-auto grid gap-6" data-testid="login-form">
      <div>
        <label className="block text-[10px] uppercase tracking-[0.14em] text-greige mb-2">Email</label>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-transparent border-b border-ink/20 py-2 outline-none focus:border-maroon"
        />
      </div>
      <div>
        <label className="block text-[10px] uppercase tracking-[0.14em] text-greige mb-2">Password</label>
        <input
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-transparent border-b border-ink/20 py-2 outline-none focus:border-maroon"
        />
      </div>
      {error && <p className="text-sm text-maroon">{error}</p>}
      <button disabled={loading} className="bg-ink text-bone py-4 text-[11px] uppercase tracking-[0.16em] font-semibold disabled:opacity-60">
        {loading ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
