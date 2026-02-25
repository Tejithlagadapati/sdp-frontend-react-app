import { useContext, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { addNotification } from "../../services/NotificationService";
import {
  addTrendingBooking,
  hasTrendingBooking,
} from "../../services/BookingService";
import { getTrendingById } from "../../services/TrendingService";

const TrendingDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [bookingMessage, setBookingMessage] = useState("");

  if (!user) {
    localStorage.setItem("redirectAfterLogin", `/trending/${id}`);
    return <Navigate to="/login" />;
  }

  const item = getTrendingById(id);
  if (!item) return <p>Not Found</p>;

  const alreadyBooked = hasTrendingBooking(user.email, item.id);

  const handleBookTrending = () => {
    const { duplicate } = addTrendingBooking({ userEmail: user.email, item });

    if (duplicate) {
      setBookingMessage("You have already registered for this event.");
      return;
    }

    addNotification(`Trending event booked: ${item.title} (${item.date})`);
    setBookingMessage("Registration successful. Check My Bookings for details.");
  };

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
          <p>
            <b>Category:</b> {item.category}
          </p>
          <p>
            <b>Location:</b> {item.location}
          </p>
          <p>
            <b>Date:</b> {item.date}
          </p>
          <p style={{ marginTop: "10px" }}>{item.description}</p>
        </div>

        <button className="book-btn" onClick={handleBookTrending}>
          Book / Register
        </button>

        {(bookingMessage || alreadyBooked) && (
          <p className="success">
            {bookingMessage || "You have already registered for this event."}
          </p>
        )}
      </div>
    </div>
  );
};

export default TrendingDetails;
