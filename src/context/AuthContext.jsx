import { createContext, useState } from "react";
import { AUTH_ROLE_KEY, AUTH_USER_KEY, clearAuthStorage } from "../services/authUtils";

export const AuthContext = createContext();

const getStoredUser = () => {
  const rawUser = localStorage.getItem(AUTH_USER_KEY);

  if (!rawUser || rawUser === "undefined" || rawUser === "null") {
    const role = localStorage.getItem(AUTH_ROLE_KEY);
    return role ? { role } : null;
  }

  try {
    const storedUser = JSON.parse(rawUser);
    const role = storedUser?.role || localStorage.getItem(AUTH_ROLE_KEY);

    return role ? { ...storedUser, role } : storedUser;
  } catch {
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());

  const loginUser = (data) => {
    const normalizedUser = data?.user || data || null;
    const role = String(normalizedUser?.role || data?.role || "").toUpperCase();

    if (!normalizedUser || !role) {
      return;
    }

    const userWithRole = { ...normalizedUser, role };

    setUser(userWithRole);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userWithRole));
    localStorage.setItem(AUTH_ROLE_KEY, role);
  };

  const logoutUser = () => {
    setUser(null);
    clearAuthStorage();
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
