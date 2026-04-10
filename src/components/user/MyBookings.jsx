import { useContext, useEffect, useState } from "react";
import Card from "../common/Card";
import { AuthContext } from "../../context/AuthContext";
import {
  cancelEventRegistration,
  fetchUserEventRegistrations,
} from "../../services/eventApi";

const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadBookings = async () => {
      try {
        setIsLoading(true);
        setError("");
        setSuccessMessage("");

        const registrations = user?.id
          ? await fetchUserEventRegistrations(user.id)
          : [];

        const normalizedEvents = (registrations || []).map((registration) => {
          return {
            id: registration.eventId || registration.registrationId,
            registrationId: registration.registrationId,
            eventId: registration.eventId,
            userId: registration.userId || user?.id || null,
            title: registration.title || "Event",
            status: registration.status || "Registered",
          };
        });

        if (isMounted) {
          setBookings(normalizedEvents);
        }
      } catch (error) {
        console.error("Failed to load bookings", error);
        if (isMounted) {
          setError(error?.response?.data?.message || error.message || "Failed to load registered events");
          setBookings([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadBookings();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const handleCancelRegistration = async (eventId) => {
    const confirmed = window.confirm("Cancel this registration?");
    if (!confirmed) {
      return;
    }

    try {
      setError("");
      await cancelEventRegistration(user?.id, eventId);
      setBookings((current) => current.filter((booking) => booking.id !== eventId));
      setSuccessMessage("Registration Cancelled");
    } catch (cancelError) {
      setError(
        cancelError?.response?.data?.message || cancelError.message || "Failed to cancel registration",
      );
    }
  };

  return (
    <>
      <h2>My Bookings</h2>
      <p className="muted">Registered events linked to your account.</p>

      {error && <p className="muted event-feedback event-feedback-error">{error}</p>}
      {successMessage && <p className="muted event-feedback event-feedback-success">{successMessage}</p>}

      <Card>
        {isLoading ? (
          <p>Loading registered events...</p>
        ) : bookings.length === 0 ? (
          <p>No registered events found yet.</p>
        ) : (
          <div className="city-public-grid">
            {bookings.map((booking) => (
              <Card key={`${booking.registrationId || "reg"}-${booking.id}`} className="city-public-card">
                <div className="city-public-head">
                  <h4>{booking.title}</h4>
                  <span
                    className={`status ${String(booking.status)
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {booking.status}
                  </span>
                </div>

                <p><strong>Event ID:</strong> {booking.eventId ?? "N/A"}</p>
                <p><strong>User ID:</strong> {booking.userId ?? user?.id ?? "N/A"}</p>
                <p><strong>Status:</strong> {booking.status}</p>

                <button
                  type="button"
                  className="booking-delete-button"
                  onClick={() => handleCancelRegistration(booking.eventId || booking.id)}
                >
                  Cancel
                </button>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </>
  );
};

export default MyBookings;
