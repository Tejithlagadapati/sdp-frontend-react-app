import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Sidebar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <div className="admin-brand-icon">🏙️</div>
        <div>
          <h2>SmartCity</h2>
          <p>Management System</p>
        </div>
      </div>

      <nav className="admin-nav">
        <p className="admin-nav-section">OVERVIEW</p>
        <NavLink to="/admin" end className="admin-nav-link">
          Dashboard
        </NavLink>

        <p className="admin-nav-section">MANAGEMENT</p>
        <NavLink to="/admin/public-services" className="admin-nav-link">
          Public Services
        </NavLink>
        <NavLink to="/admin/infrastructure" className="admin-nav-link">
          Infrastructure
        </NavLink>
        <NavLink to="/admin/amenities" className="admin-nav-link">
          Amenities
        </NavLink>
        <NavLink to="/admin/events" className="admin-nav-link">
          Events
        </NavLink>

        <p className="admin-nav-section">CITIZEN REPORTS</p>
        <NavLink to="/admin/issue-reports" className="admin-nav-link">
          Issue Reports
        </NavLink>
      </nav>

      <div className="admin-sidebar-footer">
        <div className="admin-profile">
          <span className="admin-profile-avatar">{user?.name?.charAt(0)?.toUpperCase() || "A"}</span>
          <div>
            <strong>{user?.name || "Administrator"}</strong>
            <small>Admin</small>
          </div>
        </div>

        <button type="button" className="admin-logout-btn" onClick={handleLogout}>
          ⎋
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;