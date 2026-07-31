import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Lock, Mail, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import FieldError from "../components/FieldError";

export default function Login() {
  const { login, loading, error, fieldErrors } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });

  const from = location.state?.from?.pathname || "/admin";

  async function handleSubmit(e) {
    e.preventDefault();
    const success = await login(form.email, form.password);
    if (success) navigate(from, { replace: true });
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto rounded-full bg-market-green text-gold flex items-center justify-center mb-4">
            <Lock size={20} />
          </div>
          <h1 className="text-2xl font-semibold text-ink mb-1">Admin login</h1>
          <p className="text-sm text-ink/50">Manage products and stock for Fresh Mini Mart.</p>
        </div>

        <form onSubmit={handleSubmit} className="crate-tag p-6 space-y-4" noValidate>
          {error && (
            <div className="flex items-start gap-2 text-sm text-tomato bg-tomato/5 border border-tomato/20 rounded-md px-3 py-2.5">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="label-field">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@freshminimart.co.ke"
                className={`input pl-10 ${fieldErrors?.email ? "!border-tomato" : ""}`}
              />
            </div>
            <FieldError errors={fieldErrors} field="email" />
          </div>

          <div>
            <label className="label-field">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className={`input pl-10 ${fieldErrors?.password ? "!border-tomato" : ""}`}
              />
            </div>
            <FieldError errors={fieldErrors} field="password" />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <p className="text-xs text-ink/40 text-center pt-1">
            No backend connected yet? Set <code className="font-mono">VITE_API_BASE_URL</code> in
            your <code className="font-mono">.env</code> file first.
          </p>
        </form>

        <p className="text-center text-sm text-ink/50 mt-6">
          <Link to="/" className="hover:text-market-green transition-colors">← Back to store</Link>
        </p>
      </div>
    </div>
  );
}
