export const AUTH_ROLE_KEY = "role";
export const AUTH_USER_KEY = "user";

export const getRole = () => localStorage.getItem(AUTH_ROLE_KEY);

export const clearAuthStorage = () => {
  localStorage.removeItem(AUTH_ROLE_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
};

export const redirectToLogin = () => {
  if (window.location.pathname !== "/login") {
    window.location.assign("/login");
  }
};

export const handleUnauthorized = () => {
  clearAuthStorage();
  redirectToLogin();
};
