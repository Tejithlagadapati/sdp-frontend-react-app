import { useEffect, useState } from "react";
import { getAllIssues, updateIssueStatus } from "../../services/IssueService";
import Card from "../common/Card";

const statusClass = (value) => {
  const normalized = String(value).toLowerCase();
  if (normalized === "pending") return "pending";
  if (normalized === "resolved") return "resolved";
  if (normalized === "in progress") return "in-progress";
  return "in-progress";
};

const formatReporterDetails = (user) => {
  if (!user) {
    return {
      reporterId: "-",
      reporterName: "-",
      reporterEmail: "-",
    };
  }

  const reporterId = user.id || "-";
  const reporterName = user.name || "-";
  const reporterEmail = user.email || "-";

  return { reporterId, reporterName, reporterEmail };
};

const isImageAttachment = (issue) => {
  const type = String(issue.attachmentType || "").toLowerCase();
  const nameOrUrl = String(issue.attachmentName || issue.attachmentUrl || "").toLowerCase();

  return type.startsWith("image/") || /\.(png|jpe?g|webp|gif)$/i.test(nameOrUrl);
};

const ViewIssues = () => {
  const [issues, setIssues] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loadingId, setLoadingId] = useState(null);
  const [previewIssue, setPreviewIssue] = useState(null);

  useEffect(() => {
    const loadIssues = async () => {
      try {
        const data = await getAllIssues();
        setIssues(data);
      } catch (error) {
        console.error("Error loading issues:", error);
        setIssues([]);
      }
    };

    loadIssues();
  }, []);

  const handleStatusUpdate = async (issueId, newStatus) => {
    setLoadingId(issueId);
    try {
      const updatedIssue = await updateIssueStatus(issueId, newStatus);

      // Update the issue in the local state
      setIssues(issues.map(issue =>
        issue.id === issueId ? { ...issue, status: newStatus } : issue
      ));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    } finally {
      setLoadingId(null);
    }
  };

  const filteredIssues = issues.filter((issue) => {
    const query = searchTerm.trim().toLowerCase();
    const reporter = issue.user || {};
    return (
      (!query ||
        issue.category.toLowerCase().includes(query) ||
        issue.location.toLowerCase().includes(query) ||
        issue.description.toLowerCase().includes(query) ||
        String(reporter.id || "").toLowerCase().includes(query) ||
        String(reporter.name || "").toLowerCase().includes(query) ||
        String(reporter.email || "").toLowerCase().includes(query)) &&
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
            <option value="In Progress">In Progress</option>
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
                <th>Reporter Details</th>
                <th>Location</th>
                <th>Evidence</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredIssues.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No issues found
                  </td>
                </tr>
              ) : (
                filteredIssues.map((issue) => (
                  <tr key={issue.id}>
                    <td>{issue.description}</td>
                    <td>{issue.category}</td>
                    <td>
                      {(() => {
                        const reporter = formatReporterDetails(issue.user);
                        return (
                          <>
                            <div>{reporter.reporterName}</div>
                            <div>{reporter.reporterEmail}</div>
                            <div>{reporter.reporterId}</div>
                          </>
                        );
                      })()}
                    </td>
                    <td>{issue.location}</td>
                    <td>
                      {issue.attachmentUrl ? (
                        <div className="issue-evidence">
                          {isImageAttachment(issue) && (
                            <button
                              type="button"
                              className="issue-evidence-preview"
                              onClick={() => setPreviewIssue(issue)}
                              title="Preview image"
                            >
                              <img src={issue.attachmentUrl} alt={`Evidence for ${issue.description}`} />
                            </button>
                          )}
                          <div className="issue-evidence-actions">
                            {isImageAttachment(issue) && (
                              <button
                                type="button"
                                className="table-action-btn issue-evidence-btn"
                                onClick={() => setPreviewIssue(issue)}
                              >
                                View
                              </button>
                            )}
                            <a
                              className="table-action-btn issue-evidence-btn"
                              href={issue.attachmentUrl}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Open
                            </a>
                            <a
                              className="table-action-btn issue-evidence-btn"
                              href={issue.attachmentUrl}
                              download={issue.attachmentName || true}
                            >
                              Download
                            </a>
                          </div>
                        </div>
                      ) : (
                        <span className="issue-no-evidence">No file</span>
                      )}
                    </td>
                    <td>
                      <span className={`status ${statusClass(issue.status)}`}>{issue.status}</span>
                    </td>
                    <td>
                      <select
                        value={issue.status}
                        onChange={(e) => handleStatusUpdate(issue.id, e.target.value)}
                        disabled={loadingId === issue.id}
                        style={{ padding: "5px", borderRadius: "4px", cursor: "pointer" }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {previewIssue && (
        <div className="issue-preview-backdrop" role="presentation" onClick={() => setPreviewIssue(null)}>
          <div className="issue-preview-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <div className="issue-preview-head">
              <div>
                <strong>{previewIssue.attachmentName || "Issue image"}</strong>
                <span>{previewIssue.description}</span>
              </div>
              <button type="button" className="issue-preview-close" onClick={() => setPreviewIssue(null)}>
                x
              </button>
            </div>
            <img src={previewIssue.attachmentUrl} alt={`Evidence for ${previewIssue.description}`} />
            <div className="issue-preview-actions">
              <a className="secondary-btn" href={previewIssue.attachmentUrl} target="_blank" rel="noreferrer">
                Open full size
              </a>
              <a className="primary-btn" href={previewIssue.attachmentUrl} download={previewIssue.attachmentName || true}>
                Download
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ViewIssues;
