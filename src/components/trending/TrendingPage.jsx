import { Link } from "react-router-dom";
import { getAllTrending } from "../../services/TrendingService";

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
