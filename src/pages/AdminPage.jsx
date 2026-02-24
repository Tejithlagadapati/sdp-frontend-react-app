import AdminLayout from "../layouts/AdminLayout";
import ViewIssues from "../components/admin/ViewIssues";
import AdminAnalytics from "../components/admin/AdminAnalytics";
import { getAllIssues } from "../services/IssueService";
import { useEffect, useState } from "react";
const AdminPage = () => {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    getAllIssues().then((data) => setIssues(data));
  }, []);
  return (
    
    <>
    <h2>Admin Dashboard</h2>
    <AdminAnalytics issues={issues} />
    <AdminLayout>
      <ViewIssues />
    </AdminLayout>
  </>
  );
};

export default AdminPage;