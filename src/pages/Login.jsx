import { useState, useContext } from "react";
import { login } from "../services/AuthService";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [role, setRole] = useState("USER");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await login(identifier, password, role);
      loginUser(data);
      const redirect = localStorage.getItem("redirectAfterLogin");

      if (redirect) {
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirect);
      } else {
        navigate(data.user.role === "ADMIN" ? "/admin" : "/user");
      }
    } catch (err) {
      setError(err?.message || "Invalid credentials");
    }
  };

  const switchRole = (nextRole) => {
    setRole(nextRole);
    setIdentifier("");
    setPassword("");
    setError("");
  };

  const isAdmin = role === "ADMIN";

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-role-switch" role="tablist" aria-label="Login role selector">
          <button
            type="button"
            className={role === "USER" ? "active" : ""}
            onClick={() => switchRole("USER")}
          >
            User
          </button>
          <button
            type="button"
            className={role === "ADMIN" ? "active" : ""}
            onClick={() => switchRole("ADMIN")}
          >
            Admin
          </button>
        </div>

        <h2>{isAdmin ? "Admin Login" : "User Login"}</h2>
        <p className="auth-sub">
          {isAdmin ? "Sign in with admin name and password" : "Welcome back"}
        </p>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type={isAdmin ? "text" : "email"}
            placeholder={isAdmin ? "Admin Name" : "Email"}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">{isAdmin ? "Login as Admin" : "Login as User"}</button>
        </form>

        {!isAdmin && (
          <p className="auth-footer">
            Don’t have an account? <Link to="/register">Register</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;