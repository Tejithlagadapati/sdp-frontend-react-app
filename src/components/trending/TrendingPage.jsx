import { Link } from "react-router-dom";
import Slider from "./Slider";

import { getAllTrending } from "../../services/TrendingService";
const TrendingPage = () => {
  const data = getAllTrending();

  return (
    <div>

      <h2>Trending in Your City</h2>

      {/* Slider */}
      <Slider items={data} />

      {/* Cards */}
      <div className="trending-grid">

        {data.map((item) => (
          <Link
            to={`/trending/${item.id}`}
            key={item.id}
            className="trending-card"
          >
            <img src={item.image} alt={item.title} />

            <h4>{item.title}</h4>
            <p>{item.category}</p>
          </Link>
        ))}

      </div>

    </div>
  );
};

export default TrendingPage;