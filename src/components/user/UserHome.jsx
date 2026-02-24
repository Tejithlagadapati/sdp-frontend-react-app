import { Link } from "react-router-dom";
import "../../styles/userhome.css";

const UserHome = () => {
  return (
    <div className="user-home">

      {/* ================= SEARCH SECTION ================= */}
      <section className="search-section">

        <h1>What are you looking for today?</h1>

        <p>
          Search for garbage collection schedules, nearest parks, or report
          local issues directly to city hall.
        </p>

        <div className="search-box">

          <input
            type="text"
            placeholder="e.g. Garbage collection, Nearest Park, Street light broken..."
          />

          <button>Search</button>

        </div>

        <div className="popular-tags">
          Popular:
          <span> Utility Bills</span>
          <span> Parking Permits</span>
          <span> Event Calendar</span>
          <span> Pet Licensing</span>
        </div>

      </section>


      {/* ================= QUICK SERVICES ================= */}
      <section className="quick-services">

        <div className="section-header">
          <h2>Quick Services</h2>
          <Link to="/user/services">View All →</Link>
        </div>

        <div className="services-grid">

          <div className="service-card blue">
            🚍
            <h4>Public Transport</h4>
            <p>Routes, schedules, and alerts</p>
          </div>

          <div className="service-card green">
            🌳
            <h4>Parks & Rec</h4>
            <p>Explore green spaces</p>
          </div>

          <div className="service-card yellow">
            ⚡
            <h4>Utilities</h4>
            <p>Water, power, waste</p>
          </div>

          <div className="service-card red">
            🚨
            <h4>Emergency</h4>
            <p>Public safety links</p>
          </div>

          <Link to="/user/report" className="service-card orange">
            📝
            <h4>Report Issue</h4>
            <p>Log problems</p>
          </Link>

          <Link to="/user/feedback" className="service-card purple">
            💬
            <h4>Feedback</h4>
            <p>Share opinions</p>
          </Link>

        </div>

      </section>


      {/* ================= COMMUNITY ACTION ================= */}
      <section className="community-section">

        <div className="community-box">

          <div>
            <span className="tag">Community Action</span>

            <h3>See something, say something.</h3>

            <p>
              Spotted a pothole? Street light out?
              Report it in under 2 minutes.
            </p>
          </div>

          <Link to="/user/report" className="assistant-btn">
            Launch Report Assistant
          </Link>

        </div>


        <div className="steps">

          <div className="step">
            📍
            <h4>1. Locate</h4>
            <p>Select issue location</p>
          </div>

          <div className="step">
            📷
            <h4>2. Capture</h4>
            <p>Upload photo</p>
          </div>

          <div className="step">
            ⚙️
            <h4>3. Resolve</h4>
            <p>Track resolution</p>
          </div>

        </div>

      </section>


      {/* ================= UPDATES + NOTIFY ================= */}
      <section className="updates-section">


        {/* CITY UPDATES */}
        <div className="updates-box">

          <div className="section-header">
            <h3>City Updates</h3>
            <span>View Newsroom</span>
          </div>

          <div className="update-item">
            🚦 Annual Marathon: Main St. Closed
            <span>Oct 24, 2026</span>
          </div>

          <div className="update-item">
            ♻️ New Recycling Center Opens
            <span>Oct 22, 2026</span>
          </div>

          <div className="update-item">
            🗳️ Citizen Budget Hearing
            <span>Oct 20, 2026</span>
          </div>

          <div className="update-item">
            🚰 Water Maintenance
            <span>Oct 18, 2026</span>
          </div>

        </div>


        {/* STAY NOTIFIED */}
        <div className="notify-box">

          🔔
          <h3>Stay Notified</h3>

          <p>
            Get real-time alerts for road closures,
            outages and maintenance.
          </p>

          <button>Enable Alerts</button>

        </div>

      </section>


      {/* ================= FEEDBACK ================= */}
      <section className="rating-section">

        <h3>Rate your Recent Service</h3>

        <div className="rating-box">

          <div>
            <strong>Public Transport Feedback</strong>
            <p>How was your last bus ride?</p>
          </div>

          <div className="stars">
            ⭐ ⭐ ⭐ ⭐ ⭐
          </div>

          <button>Write Review</button>

        </div>

      </section>


    </div>
  );
};

export default UserHome;