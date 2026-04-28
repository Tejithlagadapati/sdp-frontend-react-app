import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const profileLabel = user?.role === "ADMIN"
    ? "Admin"
    : user?.role === "USER"
      ? (user?.name || "User")
      : "User";

  const handleLogout = () => {
    logoutUser();
    navigate("/login", { replace: true });
  };

  return (
    <header className="topbar">
      <input
        className="top-search"
        type="text"
        placeholder="Search services, infrastructure..."
      />

      <div className="top-actions">
        <span className="profile-pill">{profileLabel}</span>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;
