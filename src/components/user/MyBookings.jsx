import { useContext, useEffect, useState } from "react";
import Card from "../common/Card";
import { AuthContext } from "../../context/AuthContext";
import { getUserBookings, deleteBooking } from "../../services/BookingService";
import { fetchUserServiceBookings, deleteServiceBooking } from "../../services/serviceApi";

const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);

  const formatDateValue = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString();
    }
    return String(value);
  };

  const formatTimeValue = (value, fallbackDate) => {
    if (value) {
      const date = new Date(value);
      if (!Number.isNaN(date.getTime())) {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      }
      return String(value);
    }

    if (fallbackDate) {
      const date = new Date(fallbackDate);
      if (!Number.isNaN(date.getTime())) {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      }
    }

    return "";
  };

  useEffect(() => {
    let isMounted = true;

    const loadBookings = async () => {
      try {
        const trendingBookings = user?.email ? await getUserBookings(user.email) : [];
        const serviceBookings = user?.id ? await fetchUserServiceBookings(user.id) : [];

        const normalizedTrending = (trendingBookings || []).map((booking) => {
          const rawDate = booking.date || booking.createdAt || "";
          const rawTime = booking.time || "";

          return {
            id: booking.id,
            type: booking.type || "trending",
            title: booking.title || booking.name || booking.serviceName || "Trending Booking",
            category: booking.category || booking.type || "Trending",
            location: booking.location || booking.zone || "N/A",
            date: formatDateValue(rawDate),
            time: formatTimeValue(rawTime, booking.createdAt || rawDate),
            status: booking.status || "Registered",
          };
        });

        const normalizedService = (serviceBookings || []).map((booking) => {
          const rawDate = booking.bookingDate || booking.date || booking.createdAt || "";
          const rawTime = booking.bookingTime || booking.time || "";

          return {
            id: booking.id,
            type: "service",
            title: booking.title || booking.serviceName || "Service Booking",
            category: booking.category || "Service",
            location: booking.location || booking.zone || "N/A",
            date: formatDateValue(rawDate),
            time: formatTimeValue(rawTime, booking.createdAt || rawDate),
            status: booking.status || "Booked",
          };
        });

        const combined = [...normalizedService, ...normalizedTrending];

        if (isMounted) {
          setBookings(combined);
        }
      } catch (error) {
        console.error("Failed to load bookings", error);
        if (isMounted) {
          setBookings([]);
        }
      }
    };

    loadBookings();

    return () => {
      isMounted = false;
    };
  }, [user?.email, user?.id]);

  const handleDeleteBooking = async (bookingId, type) => {
    const confirmed = window.confirm("Delete this booking?");
    if (!confirmed) {
      return;
    }

    if (type === "service") {
      try {
        await deleteServiceBooking(bookingId);
      } catch (error) {
        console.error("Failed to delete service booking", error);
      }
    } else {
      deleteBooking(bookingId);
    }

    setBookings((current) => current.filter((booking) => booking.id !== bookingId));
  };

  return (
    <>
      <h2>My Bookings</h2>
      <p className="muted">All your bookings and registrations.</p>

      <Card>
        {bookings.length === 0 ? (
          <p>No bookings found yet.</p>
        ) : (
          <div className="bookings-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <span className={`booking-type booking-type-${booking.type}`}>
                        {booking.type === "worker"
                          ? "Worker"
                          : booking.type === "trending"
                          ? "Trending"
                          : "Service"}
                      </span>
                    </td>
                    <td>{booking.title}</td>
                    <td>{booking.category}</td>
                    <td>{booking.location}</td>

                    <td>{booking.date}</td>
                    <td>{booking.time}</td>
                    <td>
                      <span
                        className={`status ${String(booking.status)
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="booking-delete-button"
                        onClick={() => handleDeleteBooking(booking.id, booking.type)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
};

export default MyBookings;
