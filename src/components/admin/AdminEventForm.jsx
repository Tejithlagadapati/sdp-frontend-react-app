import { useState } from "react";
import Card from "../common/Card";
import { addEvent } from "../../services/eventApi";

const emptyForm = {
  title: "",
  category: "",
  date: "",
  time: "",
  location: "",
  description: "",
  imageUrl: "",
};

const AdminEventForm = () => {
  const [formData, setFormData] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError("");
      setSuccess("");

      await addEvent({ ...formData, registeredCount: 0 });

      setSuccess("Event added successfully");
      setFormData(emptyForm);
    } catch (submitError) {
      setError(submitError?.response?.data?.message || submitError.message || "Failed to add event");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="admin-page-wrap">
      <div className="admin-page-head">
        <div>
          <h2>Events Management</h2>
          <p>Create events that appear dynamically in the user events list.</p>
        </div>
      </div>

      {error && <p className="muted event-feedback event-feedback-error">{error}</p>}
      {success && <p className="muted event-feedback event-feedback-success">{success}</p>}

      <Card className="event-form-card">
        <form className="event-form-grid" onSubmit={handleSubmit}>
          <label className="event-field">
            <span>Title</span>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Event title"
              required
            />
          </label>

          <label className="event-field">
            <span>Category</span>
            <input
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Category"
              required
            />
          </label>

          <label className="event-field">
            <span>Date</span>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </label>

          <label className="event-field">
            <span>Time</span>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </label>

          <label className="event-field">
            <span>Location</span>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Event location"
              required
            />
          </label>

          <label className="event-field event-field-wide">
            <span>Description</span>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the event"
              rows="4"
              required
            />
          </label>

          <label className="event-field event-field-wide">
            <span>Image URL</span>
            <input
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://..."
            />
          </label>

          <div className="event-form-actions">
            <button type="submit" className="primary-btn" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Add Event"}
            </button>
            <button
              type="button"
              className="ghost-btn"
              onClick={() => {
                setFormData(emptyForm);
                setError("");
                setSuccess("");
              }}
            >
              Reset
            </button>
          </div>
        </form>
      </Card>
    </section>
  );
};

export default AdminEventForm;