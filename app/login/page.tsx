"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.detail ?? "Incorrect email or password.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("We couldn't connect right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-enter" style={{ paddingTop: "calc(var(--header-height) + var(--space-4xl))", paddingBottom: "var(--space-4xl)" }}>
      <div className="container">
        <div className="auth-card" data-testid="admin-login">
          <span className="eyebrow">Studio login</span>
          <h1 style={{ marginTop: "var(--space-s)" }}>Nandini Vision</h1>
          <p>Owner dashboard — bookings, calendar and consultations.</p>

          <form onSubmit={onSubmit} noValidate>
            <div className="field">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nandinistudio.demo"
              />
            </div>
            <div className="field">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="form-alert" role="alert">{error}</p>
            )}

            <button type="submit" className="btn btn--maroon btn--full" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="auth-hint">
            <strong>Demo credentials</strong>
            <br />
            Email: <code>admin@nandinistudio.demo</code>
            <br />
            Password: <code>Nandini@2026</code> (set via <code>ADMIN_PASSWORD</code> in production)
          </div>
        </div>
      </div>
    </div>
  );
}
