import { Link } from "react-router-dom";
import "../styles/home.css";
const Home = () => {
  return (
    <div className="home">

      {/* ================= HERO SECTION ================= */}
      <section className="hero-video">

        <video autoPlay loop muted playsInline>
          <source src="/videos/city.mp4" type="video/mp4" />
        </video>

        <div className="hero-overlay"></div>

        <div className="hero-content">

          <h1>Smart City Management System</h1>

          <p>
            Connecting citizens with governance for a smarter,
            faster and more transparent city.
          </p>

          <div className="hero-buttons">
            <Link to="/login" className="btn-primary">Login</Link>
            <Link to="/register" className="btn-outline">Register</Link>
            <Link to="/trending" className="btn-outline">🔥 Trending Events</Link>
          </div>

        </div>
      </section>


      {/* ================= FEATURES SECTION ================= */}
      <section className="features-section">

        <h2>Our Key Features</h2>

        <div className="features-grid">

          <div className="feature-card">
            <h4>🚨 Issue Reporting</h4>
            <p>Report civic problems instantly with location tracking.</p>
          </div>

          <div className="feature-card">
            <h4>📊 Real-Time Tracking</h4>
            <p>Track the status of your complaints live.</p>
          </div>

          <div className="feature-card">
            <h4>🔔 Smart Notifications</h4>
            <p>Receive instant updates and alerts.</p>
          </div>

          <div className="feature-card">
            <h4>🌆 City Services</h4>
            <p>Access hospitals, utilities, and emergency services.</p>
          </div>

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}
      <section className="steps-section">

        <h2>How It Works</h2>

        <div className="steps-grid">

          <div className="step-box">
            <h4>1️⃣ Register</h4>
            <p>Create your citizen account securely.</p>
          </div>

          <div className="step-box">
            <h4>2️⃣ Report Issue</h4>
            <p>Submit problems with complete details.</p>
          </div>

          <div className="step-box">
            <h4>3️⃣ Admin Review</h4>
            <p>City officials verify and assign the issue.</p>
          </div>

          <div className="step-box">
            <h4>4️⃣ Resolution</h4>
            <p>Track and confirm resolution in real-time.</p>
          </div>

        </div>

      </section>


      {/* ================= STATS SECTION ================= */}
      <section className="stats-section">

        <div className="stat-box">
          <h3>10K+</h3>
          <p>Registered Users</p>
        </div>

        <div className="stat-box">
          <h3>5K+</h3>
          <p>Issues Resolved</p>
        </div>

        <div className="stat-box">
          <h3>100+</h3>
          <p>Wards Covered</p>
        </div>

        <div className="stat-box">
          <h3>24/7</h3>
          <p>Support Available</p>
        </div>

      </section>


      {/* ================= WHY CHOOSE US ================= */}
      <section className="why-section">

        <h2>Why Choose SmartCity?</h2>

        <ul>
          <li>✔ Secure & Reliable Platform</li>
          <li>✔ Fast Issue Resolution</li>
          <li>✔ Transparent Governance System</li>
          <li>✔ User-Friendly Dashboard</li>
          <li>✔ 24/7 Support & Monitoring</li>
        </ul>

      </section>


      {/* ================= FOOTER ================= */}
      <footer className="footer">

        <div className="footer-grid">

          <div>
            <h4>About SmartCity</h4>
            <p>
              SmartCity connects citizens with city authorities
              to enable faster issue resolution, transparency,
              and efficient governance.
            </p>
          </div>

          <div>
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/trending">Trending</Link></li>
            </ul>
          </div>

          <div>
            <h4>Contact Us</h4>
            <p>📧 support@smartcity.com</p>
            <p>📞 +91 98765 43210</p>
            <p>📍 India</p>
          </div>

          <div>
            <h4>Follow Us</h4>
            <p>🌐 Facebook</p>
            <p>📸 Instagram</p>
            <p>🐦 Twitter</p>
            <p>💼 LinkedIn</p>
          </div>

        </div>

        <div className="footer-bottom">
          © 2026 Smart City Management System | All Rights Reserved
        </div>

      </footer>

    </div>
  );
};

export default Home;