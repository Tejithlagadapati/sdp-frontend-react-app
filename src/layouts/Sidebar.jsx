const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h2 className="logo">CityOS</h2>

      <nav>
        <a className="active">Dashboard</a>
        <a>City Management</a>
        <a>Infrastructure</a>
        <a>Reports</a>
      </nav>
    </aside>
  );
};

export default Sidebar;