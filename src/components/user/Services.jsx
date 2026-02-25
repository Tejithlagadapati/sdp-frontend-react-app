import { useContext, useEffect, useMemo, useState } from "react";
import Card from "../common/Card";
import { AuthContext } from "../../context/AuthContext";
import { addNotification } from "../../services/NotificationService";
import { addWorkerBooking, getWorkerCatalog } from "../../services/BookingService";
import { getPublicServices } from "../../services/CityService";

const Services = () => {
  const { user } = useContext(AuthContext);
  const catalog = getWorkerCatalog();

  const [selectedCategory, setSelectedCategory] = useState(catalog[0]?.id || "");
  const workersInCategory = useMemo(() => {
    return catalog.find((category) => category.id === selectedCategory)?.workers || [];
  }, [catalog, selectedCategory]);

  const [selectedWorkerId, setSelectedWorkerId] = useState(
    catalog[0]?.workers?.[0]?.id || ""
  );

  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [serviceAddress, setServiceAddress] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [cityServices, setCityServices] = useState([]);

  useEffect(() => {
    const loadCityServices = async () => {
      const data = await getPublicServices();
      setCityServices(data);
    };

    loadCityServices();
  }, []);

  const handleCategoryChange = (event) => {
    const categoryId = event.target.value;
    setSelectedCategory(categoryId);

    const workers = catalog.find((item) => item.id === categoryId)?.workers || [];
    setSelectedWorkerId(workers[0]?.id || "");
  };

  const handleBookAppointment = async (event) => {
    event.preventDefault();

    const category = catalog.find((item) => item.id === selectedCategory);
    const selectedWorker = category?.workers.find((worker) => worker.id === selectedWorkerId);

    if (!selectedWorker) {
      setMessage("Please choose a worker before booking.");
      return;
    }

    const workerWithCategory = {
      ...selectedWorker,
      categoryLabel: category.label,
    };

    await addWorkerBooking({
      userEmail: user.email,
      worker: workerWithCategory,
      appointmentDate,
      appointmentTime,
      serviceAddress,
      note,
    });

    addNotification(
      `Appointment booked with ${selectedWorker.name} on ${appointmentDate} at ${appointmentTime}.`
    );

    setMessage(
      `Booked with ${selectedWorker.name} for ${appointmentDate} at ${appointmentTime}.`
    );
    setNote("");
    setServiceAddress("");
  };

  return (
    <>
      <h2>City Services</h2>
      <p className="muted">Explore important public services.</p>

      <section className="stack-block">
        <h3>Available City Services</h3>
        <p className="muted">Services published by city administrators.</p>

        <div className="city-public-grid">
          {cityServices.map((service) => (
            <Card key={service.id} className="city-public-card">
              <div className="city-public-head">
                <h4>{service.name}</h4>
                <span className={`status ${service.status.toLowerCase()}`}>{service.status}</span>
              </div>
              <p><strong>Category:</strong> {service.category}</p>
              <p><strong>Location:</strong> {service.location}</p>
              <p><strong>Contact:</strong> {service.contact}</p>
            </Card>
          ))}
        </div>

        {cityServices.length === 0 && <p className="muted">No city services are published yet.</p>}
      </section>

      <div className="service-grid">
        <Card>
          <h3>Healthcare</h3>
          <p>Hospitals, clinics, ambulance services.</p>
          <p>Helpline: 108 / 104</p>
        </Card>

        <Card>
          <h3>Public Transport</h3>
          <p>Buses, metro, routes, and timing updates.</p>
          <p>Helpline: 1800-123-456</p>
        </Card>

        <Card>
          <h3>Emergency</h3>
          <p>Police, fire, and disaster response services.</p>
          <p>Helpline: 112</p>
        </Card>

        <Card>
          <h3>Tourism</h3>
          <p>Parks, monuments, and city visitor services.</p>
          <p>Helpline: 1800-555-999</p>
        </Card>
      </div>

      <section className="worker-booking-section">
        <h3>Book Local Service Worker</h3>
        <p className="muted">
          Select a category, choose a verified worker, and book an appointment.
        </p>

        <Card className="worker-booking-card">
          <form className="form worker-form" onSubmit={handleBookAppointment}>
            <div className="worker-form-grid">
              <div>
                <label htmlFor="worker-category">Category</label>
                <select
                  id="worker-category"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  required
                >
                  {catalog.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="worker-name">Worker</label>
                <select
                  id="worker-name"
                  value={selectedWorkerId}
                  onChange={(event) => setSelectedWorkerId(event.target.value)}
                  required
                >
                  {workersInCategory.map((worker) => (
                    <option key={worker.id} value={worker.id}>
                      {worker.name} - {worker.role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="appointment-date">Appointment Date</label>
                <input
                  id="appointment-date"
                  type="date"
                  value={appointmentDate}
                  onChange={(event) => setAppointmentDate(event.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="appointment-time">Appointment Time</label>
                <input
                  id="appointment-time"
                  type="time"
                  value={appointmentTime}
                  onChange={(event) => setAppointmentTime(event.target.value)}
                  required
                />
              </div>
            </div>

            <input
              type="text"
              placeholder="Service address (optional)"
              value={serviceAddress}
              onChange={(event) => setServiceAddress(event.target.value)}
            />

            <textarea
              rows="3"
              placeholder="Notes for worker (optional)"
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />

            <button type="submit">Book Appointment</button>

            {message && <p className="success">{message}</p>}
          </form>

          <div className="worker-list">
            {workersInCategory.map((worker) => (
              <div
                key={worker.id}
                className={`worker-item ${selectedWorkerId === worker.id ? "worker-item-active" : ""
                  }`}
              >
                <div>
                  <h4>{worker.name}</h4>
                  <p>{worker.role}</p>
                  <small>
                    {worker.experience} | {worker.serviceArea} | Rs.{worker.fee}
                  </small>
                </div>
                <button type="button" onClick={() => setSelectedWorkerId(worker.id)}>
                  Select
                </button>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </>
  );
};

export default Services;
