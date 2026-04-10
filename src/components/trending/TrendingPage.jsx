import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAllTrending } from "../../services/TrendingService";

const TrendingPage = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadTrending = async ({ showLoader = true } = {}) => {
      try {
        if (showLoader && isMounted) {
          setIsLoading(true);
        }
        if (isMounted) {
          setError("");
        }

        const events = await getAllTrending();

        if (isMounted) {
          setData(events);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError?.response?.data?.message || loadError.message || "Failed to load trending events");
        }
      } finally {
        if (showLoader && isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadTrending({ showLoader: true });
    const intervalId = setInterval(() => {
      loadTrending({ showLoader: false });
    }, 15000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const summary = useMemo(() => {
    const totalEvents = data.length;
    const totalRegistrations = data.reduce((count, event) => count + Number(event.registeredCount || 0), 0);

    return { totalEvents, totalRegistrations };
  }, [data]);

  return (
    <section className="events-page">
      <div className="events-heading-row">
        <div>
          <h1>Events & Services</h1>
          <p>
            Discover what&apos;s happening in your neighborhood and access
            essential city resources.
          </p>
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

      {isLoading ? (
        <p className="muted">Loading trending events...</p>
      ) : data.length === 0 ? (
        <div className="event-empty-state">
          <h3>No events available</h3>
          <p>Once events are saved in the database, they will appear here automatically.</p>
        </div>
      ) : (
        <div className="events-cards-grid">
          {data.map((item) => (
            <article key={item.id} className="events-card">
              <div className="events-card-image-wrap">
                <img src={item.image} alt={item.title} />
                <span>{item.tag}</span>
              </div>

              <div className="events-card-body">
                <h3>{item.title}</h3>
                <p className="events-meta">{item.date}</p>
                <p className="events-meta">{item.time}</p>
                <p className="events-meta">{item.location}</p>
                <p className="events-description">{item.description}</p>
                <p className="events-registered">{item.registeredCount} registered</p>

                <div className="events-card-actions">
                  <Link to={`/trending/${item.id}`}>Details</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default TrendingPage;
