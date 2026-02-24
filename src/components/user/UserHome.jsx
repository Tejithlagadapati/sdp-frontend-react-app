import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const UserHome = () => {
  const { user } = useContext(AuthContext);

  return (
    <>

      {/* Welcome */}
      <h2>Welcome, {user?.name || "Citizen"} 👋</h2>
      <p className="muted">
        Manage your city services from one place
      </p>

      {/* Status Banner */}
      <div className="status-banner">
        ✅ All systems are running normally
      </div>

      {/* Stats */}
      <div className="stats-row">

        <div className="stat-box">
          <h3>6</h3>
          <p>Total Complaints</p>
        </div>

        <div className="stat-box">
          <h3>3</h3>
          <p>Resolved</p>
        </div>

        <div className="stat-box">
          <h3>3</h3>
          <p>Pending</p>
        </div>

        <div className="stat-box">
          <h3>24</h3>
          <p>Wards Covered</p>
        </div>

      </div>

      {/* Quick Actions */}
      <h3 className="section-title">Quick Actions</h3>

      <div className="user-home-grid">

        <Link to="/user/report" className="home-card">
          <h3>📝 Report Issue</h3>
          <p>Submit new complaints</p>
        </Link>

        <Link to="/user/issues" className="home-card">
          <h3>📋 My Issues</h3>
          <p>Track your complaints</p>
        </Link>

        <Link to="/user/services" className="home-card">
          <h3>🏥 Services</h3>
          <p>View city services</p>
        </Link>

        <Link to="/user/feedback" className="home-card">
          <h3>💬 Feedback</h3>
          <p>Share your opinion</p>
        </Link>

      </div>

      {/* Tips */}
      <div className="tips-box">
        💡 Tip: Reporting accurate location helps resolve issues faster.
      </div>

    </>
  );
};

export default UserHome;