import { Link } from "react-router-dom";
import Slider from "./Slider";

import { getAllTrending } from "../../services/TrendingService";
const TrendingPage = () => {
  const data = getAllTrending();

  const handlePointerMove = (event) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const relativeX = (event.clientX - rect.left) / rect.width;
    const relativeY = (event.clientY - rect.top) / rect.height;

    const rotateY = (relativeX - 0.5) * 18;
    const rotateX = (0.5 - relativeY) * 16;

    card.style.setProperty("--rx", `${rotateX.toFixed(2)}deg`);
    card.style.setProperty("--ry", `${rotateY.toFixed(2)}deg`);
    card.style.setProperty("--mx", `${(relativeX * 100).toFixed(2)}%`);
    card.style.setProperty("--my", `${(relativeY * 100).toFixed(2)}%`);
  };

  const resetTilt = (event) => {
    const card = event.currentTarget;
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
    card.style.setProperty("--mx", "50%");
    card.style.setProperty("--my", "50%");
  };

  return (
    <div className="trending-page">
      <h2 className="trending-title">Trending in Your City</h2>

      {/* Slider */}
      <Slider items={data} />

      {/* Cards */}
      <div className="trending-grid">
        {data.map((item, index) => (
          <Link
            to={`/trending/${item.id}`}
            key={item.id}
            className={`trending-card trending-card--${index % 3}`}
            onMouseMove={handlePointerMove}
            onMouseLeave={resetTilt}
          >
            <img src={item.image} alt={item.title} />
            <div className="trending-card-overlay"></div>
            <div className="trending-card-glow"></div>
            <div className="trending-content">
              <h3>{item.title}</h3>
              <p>{item.category}</p>
              <span className="trending-cta">Learn More</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TrendingPage;
