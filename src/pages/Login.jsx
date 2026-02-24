import { useState, useContext } from "react";
import { login } from "../services/AuthService";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      const data = await login(email, password);
      loginUser(data);
      const redirect = localStorage.getItem("redirectAfterLogin");

      if (redirect) {
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirect);
      } else {
        navigate(data.user.role === "ADMIN" ? "/admin" : "/user");
      }
    } catch {
      setError("Invalid Email or Password");
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <h2>Login</h2>
        <p className="auth-sub">Welcome back 👋</p>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>

        </form>

        <p className="auth-footer">
          Don’t have an account?{" "}
          <Link to="/register">Register</Link>
        </p>

      </div>

    </div>
  );
};

export default Login;