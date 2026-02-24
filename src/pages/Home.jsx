import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home">

      <header className="hero">
        <h1>Smart City Management System</h1>
        <p>Connecting citizens with city services</p>

        <div className="home-buttons">

          <Link to="/login" className="btn-primary">
            Login
          </Link>

          <Link to="/register" className="btn-outline">
            Register
          </Link>

          <Link to="/trending" className="btn-outline">
            🔥 Trending
          </Link>

        </div>
      </header>

      <section className="features">

        <div className="feature-card">
          <h3>Public Services</h3>
          <p>Find hospitals, police stations, utilities</p>
        </div>

        <div className="feature-card">
          <h3>Report Issues</h3>
          <p>Report water, road, and power problems</p>
        </div>

        <div className="feature-card">
          <h3>Infrastructure</h3>
          <p>Monitor roads, lights, and buildings</p>
        </div>

      </section>

      <footer className="footer">
        © 2026 Smart City Platform
      </footer>

    </div>
  );
};

export default Home;