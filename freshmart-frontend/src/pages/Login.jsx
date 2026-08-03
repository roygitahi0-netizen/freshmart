import { useMemo, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Lock, Mail, AlertCircle, Smartphone, UserRound, MapPin, KeyRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import FieldError from "../components/FieldError";
import { forgotPassword } from "../api/auth";

export default function Login() {
  const { login, register, loading, error, fieldErrors } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", fullName: "", phone: "", location: "Nairobi" });
  const [resetMessage, setResetMessage] = useState("");

  const from = useMemo(() => location.state?.from?.pathname || "/admin", [location.state]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (mode === "register") {
      const success = await register({
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        location: form.location,
      });
      if (success) navigate(from, { replace: true });
      return;
    }

    const success = await login(form.email, form.password);
    if (success) navigate(from, { replace: true });
  }

  async function handleForgotPassword(e) {
    e.preventDefault();
    setResetMessage("");
    try {
      const data = await forgotPassword(form.email);
      setResetMessage(data.message || "Check your inbox.");
    } catch (err) {
      setResetMessage(err.message || "Unable to reset password right now.");
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-5 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto rounded-full bg-market-green text-gold flex items-center justify-center mb-4">
            <Lock size={20} />
          </div>
          <h1 className="text-2xl font-semibold text-ink mb-1">Welcome to Fresh Mini Mart</h1>
          <p className="text-sm text-ink/50">Sign in or create your account to shop, track orders, and earn loyalty rewards.</p>
        </div>

        <div className="flex rounded-md border border-market-green/15 p-1 mb-6 bg-white">
          {[
            { key: "login", label: "Log in" },
            { key: "register", label: "Register" },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setMode(item.key)}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors ${mode === item.key ? "bg-market-green text-paper" : "text-ink/60"}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="crate-tag p-6 space-y-4" noValidate>
          {error && (
            <div className="flex items-start gap-2 text-sm text-tomato bg-tomato/5 border border-tomato/20 rounded-md px-3 py-2.5">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {mode === "register" && (
            <>
              <div>
                <label className="label-field">Full name</label>
                <div className="relative">
                  <UserRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
                  <input
                    required
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    placeholder="Jane Doe"
                    className={`input pl-10 ${fieldErrors?.full_name ? "!border-tomato" : ""}`}
                  />
                </div>
                <FieldError errors={fieldErrors} field="full_name" />
              </div>

              <div>
                <label className="label-field">Phone number</label>
                <div className="relative">
                  <Smartphone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
                  <input
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+254712345678"
                    className={`input pl-10 ${fieldErrors?.phone ? "!border-tomato" : ""}`}
                  />
                </div>
                <FieldError errors={fieldErrors} field="phone" />
              </div>

              <div>
                <label className="label-field">Location</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
                  <input
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="Nairobi"
                    className="input pl-10"
                  />
                </div>
              </div>
            </>
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
                placeholder="you@example.com"
                className={`input pl-10 ${fieldErrors?.email ? "!border-tomato" : ""}`}
              />
            </div>
            <FieldError errors={fieldErrors} field="email" />
          </div>

          <div>
            <label className="label-field">Password</label>
            <div className="relative">
              <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="At least 8 chars, include a number"
                className={`input pl-10 ${fieldErrors?.password ? "!border-tomato" : ""}`}
              />
            </div>
            <FieldError errors={fieldErrors} field="password" />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? (mode === "register" ? "Creating account…" : "Signing in…") : mode === "register" ? "Create account" : "Sign in"}
          </button>

          {mode === "login" && (
            <button type="button" onClick={handleForgotPassword} className="text-sm text-market-green hover:underline">
              Forgot password?
            </button>
          )}

          {resetMessage && <p className="text-sm text-basil">{resetMessage}</p>}
        </form>

        <p className="text-center text-sm text-ink/50 mt-6">
          <Link to="/" className="hover:text-market-green transition-colors">← Back to store</Link>
        </p>
      </div>
    </div>
  );
}
