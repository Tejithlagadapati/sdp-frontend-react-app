import { useContext, useEffect, useState } from "react";
import Card from "../common/Card";
import { AuthContext } from "../../context/AuthContext";
import { getUserBookings } from "../../services/BookingService";

const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadBookings = async () => {
      const data = await getUserBookings(user.email);
      if (isMounted) {
        setBookings(data);
      }
    };

    loadBookings();

    return () => {
      isMounted = false;
    };
  }, [user.email]);

  return (
    <>
      <h2>My Bookings</h2>
      <p className="muted">
        All your service worker appointments and trending event registrations.
      </p>

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
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <span
                        className={`booking-type booking-type-${booking.type}`}
                      >
                        {booking.type === "worker" ? "Worker" : "Trending"}
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
