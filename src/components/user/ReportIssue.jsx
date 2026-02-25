import { useContext, useRef, useState } from "react";
import Card from "../common/Card";
import { AuthContext } from "../../context/AuthContext";
import { submitIssue } from "../../services/IssueService";
import { addNotification } from "../../services/NotificationService";

const ReportIssue = () => {
  const { user } = useContext(AuthContext);
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [attachmentName, setAttachmentName] = useState("");
  const [msg, setMsg] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setAttachmentName(file?.name || "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const issue = {
      category,
      location,
      description,
      attachmentName: attachmentName || "",
    };

    await submitIssue(issue, user.email);

    setMsg("Issue submitted successfully.");
    setCategory("");
    setLocation("");
    setDescription("");
    setAttachmentName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    addNotification("New issue reported successfully");
  };

  return (
    <Card>
      <h2>Report an Issue</h2>
      <p className="muted">Submit civic issues and add a photo if available.</p>

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

        <div className="upload-field">
          <label htmlFor="issue-image">Add image (Optional but Recommended)</label>
          <input
            id="issue-image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          <small>
            {attachmentName ? `Selected: ${attachmentName}` : "No file selected"}
          </small>
        </div>

        <button type="submit">Submit</button>
      </form>
    </Card>
  );
};

export default ReportIssue;
