const BOOKING_STORAGE_KEY = "bookings";

const workerCatalog = [
  {
    id: "plumbers",
    label: "Plumbers",
    workers: [
      {
        id: "pl-1",
        name: "Ravi Kumar",
        role: "Senior Plumber",
        experience: "8 years",
        serviceArea: "Ward 2 to Ward 6",
        fee: 450,
      },
      {
        id: "pl-2",
        name: "Arjun Mehta",
        role: "Pipe Fitting Specialist",
        experience: "6 years",
        serviceArea: "Sector 8 to Sector 14",
        fee: 400,
      },
      {
        id: "pl-3",
        name: "Sahil Verma",
        role: "Leak Repair Expert",
        experience: "5 years",
        serviceArea: "Downtown and Riverside",
        fee: 380,
      },
    ],
  },
  {
    id: "electricians",
    label: "Electricians",
    workers: [
      {
        id: "el-1",
        name: "Neeraj Singh",
        role: "Licensed Electrician",
        experience: "7 years",
        serviceArea: "Ward 1 to Ward 5",
        fee: 500,
      },
      {
        id: "el-2",
        name: "Karan Malhotra",
        role: "Home Wiring Specialist",
        experience: "9 years",
        serviceArea: "North City",
        fee: 550,
      },
      {
        id: "el-3",
        name: "Ankit Sharma",
        role: "Appliance Repair Electrician",
        experience: "4 years",
        serviceArea: "South City",
        fee: 420,
      },
    ],
  },
  {
    id: "general-workers",
    label: "General Workers",
    workers: [
      {
        id: "gw-1",
        name: "Imran Ali",
        role: "Carpenter",
        experience: "10 years",
        serviceArea: "Old Town and Central Market",
        fee: 600,
      },
      {
        id: "gw-2",
        name: "Pawan Yadav",
        role: "Painter",
        experience: "6 years",
        serviceArea: "East Side",
        fee: 450,
      },
      {
        id: "gw-3",
        name: "Manoj Das",
        role: "AC Technician",
        experience: "7 years",
        serviceArea: "West End",
        fee: 700,
      },
    ],
  },
];

const getStoredBookings = () => {
  return JSON.parse(localStorage.getItem(BOOKING_STORAGE_KEY)) || [];
};

const saveBookings = (bookings) => {
  localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(bookings));
};

export const getWorkerCatalog = () => {
  return workerCatalog;
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

export const addWorkerBooking = async ({
  userEmail,
  worker,
  appointmentDate,
  appointmentTime,
  serviceAddress,
  note,
}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const bookings = getStoredBookings();

      const newBooking = {
        id: Date.now(),
        type: "worker",
        sourceId: worker.id,
        userEmail,
        title: `${worker.name} (${worker.role})`,
        category: worker.categoryLabel,
        location: serviceAddress || worker.serviceArea,
        date: appointmentDate,
        time: appointmentTime,
        status: "Booked",
        note: note || "",
        createdAt: new Date().toISOString(),
      };

      saveBookings([newBooking, ...bookings]);
      resolve(newBooking);
    }, 250);
  });
};
