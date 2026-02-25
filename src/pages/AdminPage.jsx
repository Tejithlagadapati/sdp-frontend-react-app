import AdminLayout from "../layouts/AdminLayout";
import AdminOverview from "../components/admin/AdminOverview";
import CityManagement from "../components/admin/CityManagement";
import ViewIssues from "../components/admin/ViewIssues";
import SystemSettings from "../components/admin/SystemSettings";

const AdminPage = ({ page = "overview" }) => {
  return (
    <AdminLayout>
      {page === "overview" && <AdminOverview />}
      {page === "city-management" && <CityManagement />}
      {page === "citizen-reports" && <ViewIssues />}
      {page === "system-settings" && <SystemSettings />}
    </AdminLayout>
  );
};

export default AdminPage;