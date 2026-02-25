import { Link } from "react-router-dom";
import { getAllTrending } from "../../services/TrendingService";

const popularFilters = ["All", "Concerts", "Arts", "Outdoors", "Health", "Education"];

const TrendingPage = () => {
  const data = getAllTrending();

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
            <strong>12</strong>
            <span>NEW EVENTS</span>
          </article>
          <article>
            <strong>48</strong>
            <span>ACTIVE SERVICES</span>
          </article>
        </div>
      </div>

      <div className="events-toolbar">
        <div className="events-tabs">
          <button type="button" className="is-active">
            Upcoming Events
          </button>
          <button type="button">Public Services</button>
        </div>

        <div className="events-actions">
          <input type="text" placeholder="Search..." />
          <button type="button">Filter</button>
          <button type="button" className="date-filter-btn">
            Date Filter
          </button>
        </div>
      </div>

      <div className="events-chips">
        <span>POPULAR:</span>
        {popularFilters.map((chip, index) => (
          <button
            key={chip}
            type="button"
            className={index === 0 ? "is-selected" : ""}
          >
            {chip}
          </button>
        ))}
      </div>

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
              <p className="events-registered">{item.registered} registered</p>

              <div className="events-card-actions">
                <button type="button">RSVP Now</button>
                <Link to={`/trending/${item.id}`}>Details</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default TrendingPage;
