import { useContext, useState } from "react";
import Card from "../common/Card";
import { AuthContext } from "../../context/AuthContext";
import { submitIssue } from "../../services/IssueService";
import { addNotification } from "../../services/NotificationService";

const ReportIssue = () => {
  const { user } = useContext(AuthContext);
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const issue = {
      category,
      location,
      description,
    };

    try {
      await submitIssue(issue, user.id);

      setMsg("Issue submitted successfully.");
      setCategory("");
      setLocation("");
      setDescription("");
      addNotification("New issue reported successfully");
    } catch (error) {
      setMsg("Error: " + (error.message || "Failed to submit issue"));
    }
  };

  return (
    <Card>
      <h2>Report an Issue</h2>
      <p className="muted">Submit civic issues to help improve our city.</p>

      {msg && <p className="success">{msg}</p>}

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Category (Water, Road, Light...)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <textarea
          placeholder="Describe the issue"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <button type="submit">Submit</button>
      </form>
    </Card>
  );
};

export default ReportIssue;
