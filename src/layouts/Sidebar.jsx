import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h2 className="logo">CitySphere</h2>

      <nav>
        <NavLink to="/admin" end>
          Admin Overview
        </NavLink>
        <NavLink to="/admin/city-management">City Management</NavLink>
        <NavLink to="/admin/citizen-reports">Citizen Reports</NavLink>
        <NavLink to="/admin/system-settings">System Settings</NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;