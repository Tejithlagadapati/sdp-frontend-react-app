import { useEffect, useState } from "react";
import { getAllIssues } from "../../services/IssueService";
import Card from "../common/Card";

const ViewIssues = () => {
  const [issues, setIssues] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = async () => {
    const data = await getAllIssues();
    setIssues(data);
  };

  // Filtering Logic
  const filteredIssues = issues.filter((i) => {
    return (
      (i.category.toLowerCase().includes(search.toLowerCase()) ||
        i.location.toLowerCase().includes(search.toLowerCase())) &&
      (status === "All" || i.status === status)
    );
  });

  return (
    <>
      <h2>Reported Issues</h2>

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by category or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>All</option>
          <option>Pending</option>
          <option>Resolved</option>
        </select>
      </div>

      <Card>
        <table className="data-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Location</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredIssues.map((i) => (
              <tr key={i.id}>
                <td>{i.category}</td>
                <td>{i.location}</td>
                <td>{i.description}</td>
                <td>
                  <span className="status pending">{i.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
};

export default ViewIssues;