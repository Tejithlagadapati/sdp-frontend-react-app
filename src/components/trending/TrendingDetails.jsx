import { useContext, useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { addNotification } from "../../services/NotificationService";
import { fetchUserEventRegistrations } from "../../services/eventApi";
import {
  getTrendingById,
  registerTrendingEvent,
} from "../../services/TrendingService";

const TrendingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [alreadyBooked, setAlreadyBooked] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadEvent = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [event, registrations] = await Promise.all([
          getTrendingById(id),
          user?.id ? fetchUserEventRegistrations(user.id) : Promise.resolve([]),
        ]);

        if (isMounted) {
          setItem(event);
          setAlreadyBooked(
            Array.isArray(registrations)
              ? registrations.some((registration) => Number(registration.eventId) === Number(id))
              : false,
          );
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError?.response?.data?.message || loadError.message || "Failed to load event details");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadEvent();

    return () => {
      isMounted = false;
    };
  }, [id, user?.id]);

  if (!user) {
    localStorage.setItem("redirectAfterLogin", `/trending/${id}`);
    return <Navigate to="/login" />;
  }

  if (isLoading) return <p>Loading event...</p>;
  if (error) return <p>{error}</p>;
  if (!item) return <p>Not Found</p>;

  const handleClose = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/user/trending");
  };

  const handleBookTrending = async () => {
    if (alreadyBooked) {
      setBookingMessage("You have already registered for this event.");
      return;
    }

    try {
      await registerTrendingEvent(user.id, item.id);
      setAlreadyBooked(true);
      addNotification(`Trending event booked: ${item.title} (${item.date})`);
      setBookingMessage("Registration successful. Check My Bookings for details.");
      setItem((currentItem) =>
        currentItem
          ? {
            ...currentItem,
            registeredCount: Number(currentItem.registeredCount || 0) + 1,
            registered: Number(currentItem.registeredCount || 0) + 1,
          }
          : currentItem,
      );
    } catch (registerError) {
      setBookingMessage(
        registerError?.response?.data?.message || registerError.message || "Failed to register for this event.",
      );
    }
  };

  return (
    <div
      className="trending-details-page"
      style={{ "--details-bg-image": `url(${item.image})` }}
    >
      <div className="trending-details-bg"></div>
      <div className="trending-details">
        <button
          type="button"
          className="trending-close-btn"
          aria-label="Back to events page"
          onClick={handleClose}
        >
          &times;
        </button>

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
          <p>
            <b>Registered:</b> {Number(item.registeredCount || item.registered || 0)}
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
