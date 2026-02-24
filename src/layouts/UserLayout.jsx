import Topbar from "./Topbar";
import { NavLink } from "react-router-dom";

const UserLayout = ({ children, notifCount }) => {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2 className="logo">CityOS</h2>
        <p className="sidebar-subtitle">Citizen Portal</p>

        <nav>
          <NavLink to="/user">Home</NavLink>
          <NavLink to="/user/report">Report Issue</NavLink>
          <NavLink to="/user/issues">My Issues</NavLink>
          <NavLink to="/user/services">Services</NavLink>
          <NavLink to="/user/feedback">Feedback</NavLink>

          <NavLink to="/user/notifications">
            Notifications
            {notifCount > 0 && <span className="notif-badge">{notifCount}</span>}
          </NavLink>

          <NavLink to="/trending">Trending</NavLink>
        </nav>
      </aside>

      <div className="main">
        <Topbar />
        <div className="content">{children}</div>
      </div>
    </div>
  );
};

export default UserLayout;
