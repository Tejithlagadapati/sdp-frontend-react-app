import { clearAuthStorage } from "./authUtils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:2026";

const parseResponseBody = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
};

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const normalizeName = (name) => String(name || "").trim();

const LOGIN_CONFIG = {
  USER: {
    url: "/userapi/login",
    role: "USER",
  },
  ADMIN: {
    url: "/adminapi/login",
    role: "ADMIN",
  },
};

const normalizeLoginResponse = (data, fallbackRole, fallbackIdentifier) => {
  if (!data || typeof data !== "object") {
    return null;
  }

  if (data.user && typeof data.user === "object") {
    return {
      user: {
        ...data.user,
        role: data.user.role || fallbackRole || "USER",
        name: data.user.name || fallbackIdentifier || data.user.email,
      },
    };
  }

  // Some backends return user fields at top-level instead of nesting under `user`.
  if (data.id || data.email || data.role || data.name) {
    return {
      user: {
        id: data.id,
        name: data.name || fallbackIdentifier,
        email: data.email,
        role: data.role || fallbackRole || "USER",
      },
    };
  }

  return null;
};

export const login = async (identifier, password, role = "USER") => {
  const loginRole = String(role || "USER").toUpperCase();
  const config = LOGIN_CONFIG[loginRole] || LOGIN_CONFIG.USER;
  const normalizedIdentifier =
    loginRole === "ADMIN" ? normalizeName(identifier) : normalizeEmail(identifier);

  const payload =
    loginRole === "ADMIN"
      ? { name: normalizedIdentifier, password }
      : { email: normalizedIdentifier, password };

  const response = await fetch(`${API_BASE_URL}${config.url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await parseResponseBody(response);

  if (!response.ok) {
    const message =
      typeof data === "string" ? data : data?.message || "Invalid Credentials";
    throw new Error(message);
  }

  const normalized = normalizeLoginResponse(
    data,
    config.role,
    normalizedIdentifier,
  );

  if (!normalized?.user) {
    throw new Error("Invalid login response from server");
  }

  return normalized;
};

export const register = async ({ name, email, password, contact }) => {
  const normalizedEmail = normalizeEmail(email);

  const response = await fetch(`${API_BASE_URL}/userapi/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: String(name || "").trim(),
      email: normalizedEmail,
      userEmail: normalizedEmail,
      password,
      contact: String(contact || "").trim(),
    }),
  });

  const data = await parseResponseBody(response);

  if (!response.ok) {
    const message =
      typeof data === "string" ? data : data?.message || "Registration failed";
    throw new Error(message);
  }

  return typeof data === "string" ? data : data?.message || "Registration successful";
};

export const logout = () => {
  clearAuthStorage();
};
