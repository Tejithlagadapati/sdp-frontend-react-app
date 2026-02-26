const BOOKING_STORAGE_KEY = "bookings";

const getStoredBookings = () => {
  return JSON.parse(localStorage.getItem(BOOKING_STORAGE_KEY)) || [];
};

const saveBookings = (bookings) => {
  localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(bookings));
};

export const getUserBookings = async (userEmail) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const bookings = getStoredBookings()
        .filter((booking) => booking.userEmail === userEmail)
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
      resolve(bookings);
    }, 200);
  });
};

export const hasTrendingBooking = (userEmail, trendingId) => {
  const bookings = getStoredBookings();
  return bookings.some(
    (booking) =>
      booking.userEmail === userEmail &&
      booking.type === "trending" &&
      booking.sourceId === Number(trendingId)
  );
};

export const addTrendingBooking = ({ userEmail, item }) => {
  const bookings = getStoredBookings();
  const existing = bookings.find(
    (booking) =>
      booking.userEmail === userEmail &&
      booking.type === "trending" &&
      booking.sourceId === item.id
  );

  if (existing) {
    return { booking: existing, duplicate: true };
  }

  const newBooking = {
    id: Date.now(),
    type: "trending",
    sourceId: item.id,
    userEmail,
    title: item.title,
    category: item.category,
    location: item.location,
    date: item.date,
    time: "Event",
    status: "Registered",
    createdAt: new Date().toISOString(),
  };

  saveBookings([newBooking, ...bookings]);
  return { booking: newBooking, duplicate: false };
};
