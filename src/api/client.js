// Central fetch wrapper for all backend calls.
// Set VITE_API_BASE_URL in your .env file to point this at your Flask backend,
// e.g. VITE_API_BASE_URL=http://localhost:5000
// See .env.example for the expected shape.

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Flask routes in this project are expected to be namespaced under /api.
const API_PREFIX = "/api";

/**
 * ApiError — thrown for any non-2xx response.
 *
 * Carries `fieldErrors` when the backend returns a Marshmallow-style
 * validation error, e.g. from a schema.load() ValidationError:
 *   { "errors": { "email": ["Not a valid email address."], "price": ["Must be greater than 0."] } }
 *
 * `message` is always a plain string (the first field error, or a generic
 * server message) so callers that don't care about field-level detail can
 * just render err.message. Callers that do (forms) can read err.fieldErrors.
 */
export class ApiError extends Error {
  constructor(message, { status, fieldErrors } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors || null;
  }
}

// Marshmallow's ValidationError.messages (and most hand-rolled Flask
// wrappers around it) come back as { field: ["msg1", "msg2"], ... }.
// This pulls that out and picks a single headline message for display.
function parseErrorPayload(data, status) {
  const rawErrors = data?.errors;
  const isFieldErrorMap =
    rawErrors && typeof rawErrors === "object" && !Array.isArray(rawErrors);

  if (isFieldErrorMap) {
    const firstField = Object.keys(rawErrors)[0];
    const firstMessage = Array.isArray(rawErrors[firstField])
      ? rawErrors[firstField][0]
      : String(rawErrors[firstField]);
    return { message: firstMessage || "Please check the highlighted fields.", fieldErrors: rawErrors };
  }

  // Flask-JWT-Extended errors use "msg"; hand-rolled handlers commonly use
  // "error" or "message"; fall back to a generic status-based message.
  const message = data?.msg || data?.error || data?.message || `Request failed (${status})`;
  return { message, fieldErrors: null };
}

async function parseJsonSafely(res) {
  try {
    return await res.json();
  } catch {
    return null; // empty or non-JSON response body — fine for some endpoints
  }
}

/**
 * apiRequest — thin wrapper around fetch() that:
 *  - prefixes every call with VITE_API_BASE_URL + /api
 *  - attaches the JWT as a Bearer header, matching Flask-JWT-Extended's
 *    expected "Authorization: Bearer <token>" header
 *  - parses JSON responses and throws ApiError on non-2xx status codes,
 *    including Marshmallow field-level validation errors
 *
 * This file intentionally contains NO backend logic — it only knows how
 * to talk to whatever backend URL is configured. Swap the base URL and
 * every request in the app follows automatically.
 */
export async function apiRequest(path, { method = "GET", body, token, headers = {} } = {}) {
  if (!API_BASE_URL) {
    throw new Error(
      "VITE_API_BASE_URL is not set. Add it to your .env file to connect this frontend to a backend."
    );
  }

  const res = await fetch(`${API_BASE_URL}${API_PREFIX}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : undefined),
      ...headers,
    },
    ...(method !== "GET" && body ? { body: JSON.stringify(body) } : {}),
  });

  const data = await parseJsonSafely(res);

  if (!res.ok) {
    const { message, fieldErrors } = parseErrorPayload(data, res.status);
    throw new ApiError(message, { status: res.status, fieldErrors });
  }

  return data;
}

/**
 * apiUpload — like apiRequest, but for multipart/form-data requests
 * (product create/update with an image file). Flask's request.files
 * expects a real multipart body, so we skip the JSON Content-Type header
 * and let the browser set the multipart boundary itself.
 */
export async function apiUpload(path, { method = "POST", formData, token } = {}) {
  if (!API_BASE_URL) {
    throw new Error(
      "VITE_API_BASE_URL is not set. Add it to your .env file to connect this frontend to a backend."
    );
  }

  const res = await fetch(`${API_BASE_URL}${API_PREFIX}${path}`, {
    method,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: formData && method !== "GET" ? formData : undefined,
  });

  const data = await parseJsonSafely(res);

  if (!res.ok) {
    const { message, fieldErrors } = parseErrorPayload(data, res.status);
    throw new ApiError(message, { status: res.status, fieldErrors });
  }

  return data;
}
