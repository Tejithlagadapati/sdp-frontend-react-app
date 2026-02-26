import Sidebar from "./Sidebar";
import AdminTopbar from "./AdminTopbar";

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-shell">
      <Sidebar />
      <div className="admin-main">
        <AdminTopbar />
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;