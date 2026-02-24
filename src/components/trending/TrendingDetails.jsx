import { useParams, Navigate } from "react-router-dom";
import { getTrendingById } from "../../services/TrendingService";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const TrendingDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  // If not logged in → redirect
  if (!user) {
    localStorage.setItem("redirectAfterLogin", `/trending/${id}`);
    return <Navigate to="/login" />;
  }

  const item = getTrendingById(id);

  if (!item) return <p>Not Found</p>;

  return (
    <div
      className="trending-details-page"
      style={{ "--details-bg-image": `url(${item.image})` }}
    >
      <div className="trending-details-bg"></div>
      <div className="trending-details">

        <img src={item.image} alt={item.title} />

        <h1>{item.title}</h1>

        <div className="details-info">

          <p><b>Category:</b> {item.category}</p>
          <p><b>Location:</b> {item.location}</p>
          <p><b>Date:</b> {item.date}</p>

          <p style={{ marginTop: "10px" }}>
            {item.description}
          </p>

        </div>

        <button className="book-btn">
          Book / Register
        </button>

      </div>
    </div>
  );
};

export default TrendingDetails;
