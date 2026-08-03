import { createContext, useContext, useEffect, useState } from "react";
import { login as loginRequest, logout as logoutRequest, register as registerRequest } from "../api/auth";

const AuthContext = createContext(null);

const TOKEN_KEY = "freshmart_token";
const USER_KEY = "freshmart_user";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState(null);

  useEffect(() => {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  }, [user]);

  async function login(email, password) {
    setLoading(true);
    setError("");
    setFieldErrors(null);
    try {
      const data = await loginRequest({ email, password });
      setToken(data.token);
      setUser(data.user || { email });
      return true;
    } catch (err) {
      setError(err.message || "Login failed");
      setFieldErrors(err.fieldErrors || null);
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function register({ fullName, email, phone, password, location }) {
    setLoading(true);
    setError("");
    setFieldErrors(null);
    try {
      const data = await registerRequest({ fullName, email, phone, password, location });
      setToken(data.token);
      setUser(data.user || { email });
      return true;
    } catch (err) {
      setError(err.message || "Registration failed");
      setFieldErrors(err.fieldErrors || null);
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    try {
      await logoutRequest(token);
    } catch {
      // ignore network errors on logout — clear local state regardless
    }
    setToken(null);
    setUser(null);
  }

  const value = {
    token,
    user,
    isAuthenticated: Boolean(token),
    loading,
    error,
    fieldErrors,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
