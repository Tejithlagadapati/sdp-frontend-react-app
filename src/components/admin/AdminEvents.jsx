import { useEffect, useMemo, useState } from "react";
import { addEvent, fetchAllEvents } from "../../services/eventApi";
import Card from "../common/Card";

const emptyForm = {
    title: "",
    category: "General",
    date: "",
    time: "",
    location: "",
    description: "",
    imageUrl: "",
};

const AdminEvents = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All Categories");
    const [formData, setFormData] = useState(emptyForm);
    const [formOpen, setFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

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

    const refreshData = async () => {
        const data = await fetchAllEvents();
        setEvents(data);
    };

    const openCreateForm = () => {
        setError("");
        setFormData(emptyForm);
        setFormOpen(true);
    };

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({ ...previous, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setIsSubmitting(true);
            setError("");

            const payload = {
                title: formData.title,
                category: formData.category,
                date: formData.date,
                time: formData.time,
                location: formData.location,
                description: formData.description,
                imageUrl: formData.imageUrl,
            };

            await addEvent(payload);

            setFormOpen(false);
            setFormData(emptyForm);
            await refreshData();
        } catch (submitError) {
            setError(submitError?.response?.data?.message || submitError.message || "Failed to add event");
        } finally {
            setIsSubmitting(false);
        }
    };

    const categories = useMemo(() => {
        return ["All Categories", ...new Set(events.map((event) => event.category))];
    }, [events]);

    const filteredEvents = useMemo(() => {
        return events.filter((event) => {
            const searchValue = search.trim().toLowerCase();
            const searchMatch =
                !searchValue ||
                String(event.title || "").toLowerCase().includes(searchValue) ||
                String(event.location || "").toLowerCase().includes(searchValue);
            const categoryMatch = category === "All Categories" || event.category === category;
            return searchMatch && categoryMatch;
        });
    }, [events, search, category]);

    return (
        <section className="admin-page-wrap">
            <div className="admin-page-head">
                <div>
                    <h2>Events</h2>
                    <p>Manage city events and activities.</p>
                </div>
                <button type="button" className="primary-btn" onClick={openCreateForm}>+ Add Event</button>
            </div>

            {error && <p className="muted">{error}</p>}

            <Card className="admin-filter-card">
                <div className="admin-filter-row">
                    <input
                        type="text"
                        placeholder="Search by title or location..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                    <select value={category} onChange={(event) => setCategory(event.target.value)}>
                        {categories.map((option) => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </select>
                </div>
            </Card>

            {formOpen && (
                <Card>
                    <form className="city-service-form" onSubmit={handleSubmit}>
                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleFormChange}
                            placeholder="Event title"
                            required
                        />
                        <input
                            name="category"
                            value={formData.category}
                            onChange={handleFormChange}
                            placeholder="Category"
                            required
                        />
                        <input
                            name="date"
                            type="date"
                            value={formData.date}
                            onChange={handleFormChange}
                            placeholder="Date"
                            required
                        />
                        <input
                            name="time"
                            type="time"
                            value={formData.time}
                            onChange={handleFormChange}
                            placeholder="Time"
                            required
                        />
                        <input
                            name="location"
                            value={formData.location}
                            onChange={handleFormChange}
                            placeholder="Location"
                            required
                        />
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleFormChange}
                            placeholder="Description"
                            rows="3"
                            style={{ gridColumn: "1 / -1" }}
                        />
                        <input
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleFormChange}
                            placeholder="Image URL (optional)"
                            style={{ gridColumn: "1 / -1" }}
                        />

                        <div className="city-form-actions">
                            <button type="submit" className="primary-btn" disabled={isSubmitting}>
                                {isSubmitting ? "Creating..." : "Create Event"}
                            </button>
                            <button
                                type="button"
                                className="ghost-btn"
                                onClick={() => {
                                    setFormOpen(false);
                                    setFormData(emptyForm);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </Card>
            )}

            <Card className="admin-table-card">
                <div className="admin-table-title">All Events ({isLoading ? 0 : filteredEvents.length})</div>
                <div className="city-table-wrap">
                    <table className="data-table admin-data-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Date & Time</th>
                                <th>Location</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!isLoading &&
                                filteredEvents.map((event) => (
                                    <tr key={event.id}>
                                        <td>{event.title}</td>
                                        <td><span className="category-pill">{event.category}</span></td>
                                        <td>
                                            <small>{event.date}</small>
                                            <br />
                                            <small>{event.time}</small>
                                        </td>
                                        <td>{event.location || "N/A"}</td>
                                        <td>{event.description || "-"}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </Card>
        </section>
    );
};

export default AdminEvents;
