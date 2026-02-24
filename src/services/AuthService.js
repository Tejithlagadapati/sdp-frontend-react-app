// TEMP USERS (Later → Backend)
const users = [
  {
    id: 1,
    name: "Admin",
    email: "admin@gmail.com",
    password: "admin123",
    role: "ADMIN",
  },
  {
    id: 2,
    name: "Citizen User",
    email: "user@gmail.com",
    password: "user123",
    role: "USER",
  },
];

export const login = async (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        resolve({
          token: "fake-jwt-token",
          user,
        });
      } else {
        reject("Invalid Credentials");
      }
    }, 500);
  });
};

export const logout = () => {
  localStorage.clear();
};