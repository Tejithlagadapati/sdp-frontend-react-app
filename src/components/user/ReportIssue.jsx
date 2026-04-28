import { useContext, useState, useEffect } from "react";
import Card from "../common/Card";
import { AuthContext } from "../../context/AuthContext";
import { addNotification } from "../../services/NotificationService";

const ReportIssue = () => {
  const { user } = useContext(AuthContext);
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [msg, setMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Basic validation
    if (!category.trim() || !location.trim() || !description.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    const formData = new FormData();
    formData.append("category", category);
    formData.append("location", location);
    formData.append("description", description);
    formData.append("userId", user?.id);
    if (file) formData.append("file", file);

    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:2026/issuesapi", {
        method: "POST",
        body: formData,
      });

      let data = null;
      try {
        data = await res.json();
      } catch (jsonErr) {
        data = await res.text().catch(() => null);
      }

      if (!res.ok) {
        const backendMsg = (data && (data.message || data.error)) || data || res.statusText || `Request failed with status ${res.status}`;
        setError(String(backendMsg));
        return;
      }

      setMsg("Issue submitted successfully.");
      setCategory("");
      setLocation("");
      setDescription("");
      setFile(null);
      setPreviewUrl("");
      addNotification("New issue reported successfully");
    } catch (err) {
      setError("Error: " + (err?.message || "Failed to submit issue"));
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    // cleanup preview URL when component unmounts or file changes
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const selected = e.target.files && e.target.files[0];
    if (!selected) {
      setFile(null);
      setPreviewUrl("");
      return;
    }

    // accept only images
    const allowed = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowed.includes(selected.type)) {
      setError("Only JPG, JPEG or PNG images are allowed.");
      e.target.value = null;
      return;
    }

    setError("");
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
  };

  return (
    <Card>
      <h2>Report an Issue</h2>
      <p className="muted">Submit civic issues to help improve our city.</p>

      {msg && <p className="success">{msg}</p>}
      {error && <p className="error">{error}</p>}

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

        <div style={{ margin: "10px 0" }}>
          <label style={{ display: "block", marginBottom: 6 }}>Upload Image (optional)</label>
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleFileChange}
          />
          {file && <div style={{ marginTop: 6 }}>Selected file: {file.name}</div>}
          {previewUrl && (
            <div style={{ marginTop: 8 }}>
              <img src={previewUrl} alt="preview" style={{ maxWidth: "200px", maxHeight: "150px", borderRadius: 4 }} />
            </div>
          )}
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </Card>
  );
};

export default ReportIssue;
