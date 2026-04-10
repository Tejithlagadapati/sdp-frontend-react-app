import { useEffect, useState } from "react";
import Card from "../common/Card";
import { addEvent, fetchAllEvents } from "../../services/eventApi";

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
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        setError("");

        const data = await fetchAllEvents();
        setEvents(data);
      } catch (loadError) {
        setError(loadError?.response?.data?.message || loadError.message || "Failed to load events");
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, []);

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

      const data = await fetchAllEvents();
      setEvents(data);

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

      <Card className="admin-table-card">
        <div className="admin-table-title">All Events ({isLoading ? 0 : events.length})</div>

        {isLoading ? (
          <p className="muted">Loading events...</p>
        ) : (
          <div className="city-table-wrap">
            <table className="data-table admin-data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Location</th>
                  <th>Registrations</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td>{event.id}</td>
                    <td>{event.title || "-"}</td>
                    <td>{event.category || "-"}</td>
                    <td>{event.date || "-"}</td>
                    <td>{event.time || "-"}</td>
                    <td>{event.location || "-"}</td>
                    <td>{Number(event.registeredCount || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </section>
  );
};

export default AdminEventForm;