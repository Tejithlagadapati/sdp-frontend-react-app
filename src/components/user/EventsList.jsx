import { useEffect, useMemo, useState } from "react";
import { fetchAllEvents, registerForEvent } from "../../services/eventApi";

const fallbackImage =
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80";

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [registeringId, setRegisteringId] = useState(null);

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

  const summary = useMemo(() => {
    const totalEvents = events.length;
    const totalRegistrations = events.reduce(
      (count, event) => count + Number(event.registeredCount || 0),
      0,
    );

    return { totalEvents, totalRegistrations };
  }, [events]);

  const handleRegister = async (eventId) => {
    try {
      setRegisteringId(eventId);
      setError("");
      setSuccess("");

      await registerForEvent(eventId);

      setEvents((previous) =>
        previous.map((event) =>
          event.id === eventId
            ? { ...event, registeredCount: Number(event.registeredCount || 0) + 1 }
            : event,
        ),
      );
      setSuccess("Registered successfully");
    } catch (registerError) {
      setError(registerError?.response?.data?.message || registerError.message || "Failed to register for event");
    } finally {
      setRegisteringId(null);
    }
  };

  return (
    <section className="events-page">
      <div className="events-heading-row">
        <div>
          <h1>Events</h1>
          <p>Browse upcoming city events and register instantly without leaving the page.</p>
        </div>

        <div className="events-stats">
          <article>
            <strong>{summary.totalEvents}</strong>
            <span>LIVE EVENTS</span>
          </article>
          <article>
            <strong>{summary.totalRegistrations}</strong>
            <span>TOTAL REGISTRATIONS</span>
          </article>
        </div>
      </div>

      {error && <p className="muted event-feedback event-feedback-error">{error}</p>}
      {success && <p className="muted event-feedback event-feedback-success">{success}</p>}

      {isLoading ? (
        <p className="muted">Loading events...</p>
      ) : events.length === 0 ? (
        <div className="event-empty-state">
          <h3>No events available</h3>
          <p>Once the admin publishes an event, it will appear here automatically.</p>
        </div>
      ) : (
        <div className="events-cards-grid">
          {events.map((event) => (
            <article key={event.id} className="events-card">
              <div className="events-card-image-wrap">
                <img src={event.imageUrl || fallbackImage} alt={event.title} />
                <span>{event.category || "Event"}</span>
              </div>

              <div className="events-card-body">
                <h3>{event.title}</h3>
                <p className="events-meta">📅 {event.date || "TBA"}</p>
                <p className="events-meta">🕒 {event.time || "TBA"}</p>
                <p className="events-meta">📍 {event.location || "TBA"}</p>
                <p className="events-description">{event.description || "No description provided."}</p>
                <p className="events-registered">{Number(event.registeredCount || 0)} registered</p>

                <div className="events-card-actions">
                  <button
                    type="button"
                    onClick={() => handleRegister(event.id)}
                    disabled={registeringId === event.id}
                  >
                    {registeringId === event.id ? "Registering..." : "Register"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default EventsList;