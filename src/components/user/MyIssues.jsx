import { useEffect, useState, useContext } from "react";
import { getUserIssues } from "../../services/IssueService";
import { AuthContext } from "../../context/AuthContext";
import Card from "../common/Card";

const MyIssues = () => {
  const [issues, setIssues] = useState([]);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    loadMyIssues();
  }, []);

  const loadMyIssues = async () => {
    try {
      const data = await getUserIssues(user.id);
      setIssues(data);
    } catch (error) {
      console.error("Error loading issues:", error);
      setIssues([]);
    }
  };

  return (
    <>
      <h2>My Issues</h2>
      <p className="muted">Track all submitted issues and their current status.</p>

      <Card>
        <table className="data-table">

          <thead>
            <tr>
              <th>Category</th>
              <th>Location</th>
              <th>Description</th>
              <th>Image</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {issues.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No issues reported yet
                </td>
              </tr>
            ) : (
              issues.map((i) => (
                <tr key={i.id}>
                  <td>{i.category}</td>
                  <td>{i.location}</td>
                  <td>{i.description}</td>
                  <td>{i.attachmentName || "-"}</td>
                  <td>
                    <span
                      className={`status ${String(i.status)
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {i.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </Card>
    </>
  );
};

export default MyIssues;
