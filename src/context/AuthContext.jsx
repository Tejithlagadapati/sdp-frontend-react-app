import { createContext, useState } from "react";

export const AuthContext = createContext();

const getStoredUser = () => {
  const rawUser = localStorage.getItem("user");

  if (!rawUser || rawUser === "undefined" || rawUser === "null") {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());

  const loginUser = (data) => {
    const normalizedUser = data?.user || data || null;

    if (!normalizedUser) {
      return;
    }

    setUser(normalizedUser);
    localStorage.setItem("user", JSON.stringify(normalizedUser));

    if (data?.token) {
      localStorage.setItem("token", data.token);
    }
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;