import AdminLayout from "../layouts/AdminLayout";
import AdminOverview from "../components/admin/AdminOverview";
import CityManagement from "../components/admin/CityManagement";
import ViewIssues from "../components/admin/ViewIssues";
import Infrastructure from "../components/admin/Infrastructure";
import Amenities from "../components/admin/Amenities";

const AdminPage = ({ page = "overview" }) => {
  return (
    <AdminLayout>
      {page === "overview" && <AdminOverview />}
      {page === "public-services" && <CityManagement />}
      {page === "infrastructure" && <Infrastructure />}
      {page === "amenities" && <Amenities />}
      {page === "issue-reports" && <ViewIssues />}
    </AdminLayout>
  );
};

export default AdminPage;