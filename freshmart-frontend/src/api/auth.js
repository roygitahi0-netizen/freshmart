import { apiRequest, API_BASE_URL } from "./client";

// Matches the companion Flask backend (see freshmart-backend/app/auth/routes.py),
// which uses Flask-JWT-Extended:
//   POST /api/auth/login   { email, password }  -> { access_token, user }
//   POST /api/auth/logout  (Bearer token)         -> { msg }
//   GET  /api/auth/me       (Bearer token)         -> { user }
//
// Flask-JWT-Extended issues a token under the key "access_token" (not
// "token"), so login() below normalizes that to { token, user } for the
// rest of the app to consume consistently.

export async function login({ email, password }) {
  if (!API_BASE_URL) {
    throw new Error(
      "No backend connected yet. Set VITE_API_BASE_URL in .env to enable real login."
    );
  }
  const data = await apiRequest("/auth/login", { method: "POST", body: { email, password } });
  return {
    token: data.access_token,
    user: data.user,
  };
}

export async function logout(token) {
  if (!API_BASE_URL) return { success: true };
  return apiRequest("/auth/logout", { method: "POST", token });
}

export async function fetchCurrentUser(token) {
  if (!API_BASE_URL) return null;
  const data = await apiRequest("/auth/me", { token });
  return data.user;
}
