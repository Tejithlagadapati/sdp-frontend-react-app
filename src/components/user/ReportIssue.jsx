
import { useState } from "react";
import { submitIssue } from "../../services/IssueService";
import Card from "../common/Card";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
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

  await submitIssue(issue, user.email); // 👈 pass email

  setMsg("Issue Submitted Successfully ✅");

  setCategory("");
  setLocation("");
  setDescription("");
  addNotification("New issue reported successfully");
  
};

  return (
    <Card>
      <h2>Report an Issue</h2>

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