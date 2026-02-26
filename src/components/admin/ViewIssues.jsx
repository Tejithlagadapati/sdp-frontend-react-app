import { useEffect, useState } from "react";
import { getAllIssues } from "../../services/IssueService";
import Card from "../common/Card";

const statusClass = (value) => {
  const normalized = String(value).toLowerCase();
  if (normalized === "pending") return "pending";
  if (normalized === "resolved") return "resolved";
  if (normalized === "in progress") return "in-progress";
  return "in-progress";
};

const ViewIssues = () => {
  const [issues, setIssues] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const loadIssues = async () => {
      const data = await getAllIssues();
      setIssues(data);
    };

    loadIssues();
  }, []);

  const filteredIssues = issues.filter((issue) => {
    const query = searchTerm.trim().toLowerCase();
    return (
      (!query ||
        issue.category.toLowerCase().includes(query) ||
        issue.location.toLowerCase().includes(query) ||
        issue.description.toLowerCase().includes(query)) &&
      (statusFilter === "All" || issue.status === statusFilter)
    );
  });

  return (
    <section className="admin-page-wrap">
      <div className="admin-page-head">
        <div>
          <h2>Issue Reports</h2>
          <p>Track and review all citizen-submitted issues.</p>
        </div>
      </div>

      <Card className="admin-filter-card">
        <div className="admin-filter-row">
          <input
            type="text"
            placeholder="Search by category, location or title..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </Card>

      <Card className="admin-table-card">
        <div className="admin-table-title">Recent Issue Reports</div>
        <div className="city-table-wrap">
          <table className="data-table admin-data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Reported By</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredIssues.map((issue) => (
                <tr key={issue.id}>
                  <td>{issue.description}</td>
                  <td>{issue.category}</td>
                  <td>@{issue.userEmail?.split("@")[0] || "user"}</td>
                  <td>{new Date(issue.id).toISOString().slice(0, 10)}</td>
                  <td>
                    <span className={`status ${statusClass(issue.status)}`}>{issue.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
};

export default ViewIssues;