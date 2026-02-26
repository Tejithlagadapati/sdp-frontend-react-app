import { useEffect, useState } from "react";
import Card from "../common/Card";
import { getServicesByType } from "../../services/CityService";

const Services = () => {
  const [publicServices, setPublicServices] = useState([]);
  const [infrastructure, setInfrastructure] = useState([]);
  const [amenities, setAmenities] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      const [servicesData, infraData, amenitiesData] = await Promise.all([
        getServicesByType("public-service", true),
        getServicesByType("infrastructure", true),
        getServicesByType("amenity", true),
      ]);

      if (!isMounted) return;

      setPublicServices(servicesData);
      setInfrastructure(infraData);
      setAmenities(amenitiesData);
    };

    loadData();
    const timer = setInterval(loadData, 2500);

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, []);

  return (
    <>
      <h2>City Services</h2>
      <p className="muted">Explore public services, infrastructure, and amenities updated by admin.</p>

      <section className="stack-block">
        <h3>Public Services</h3>
        <p className="muted">Services published by city administrators.</p>

        <div className="city-public-grid">
          {publicServices.map((service) => (
            <Card key={service.id} className="city-public-card">
              <div className="city-public-head">
                <h4>{service.name}</h4>
                <span className={`status ${service.status.toLowerCase()}`}>{service.status}</span>
              </div>
              <p><strong>Category:</strong> {service.category}</p>
              <p><strong>Location:</strong> {service.location}</p>
              <p><strong>Contact:</strong> {service.contact}</p>
              {service.description && <p><strong>Info:</strong> {service.description}</p>}
            </Card>
          ))}
        </div>

        {publicServices.length === 0 && <p className="muted">No city services are published yet.</p>}
      </section>

      <section className="stack-block">
        <h3>Infrastructure</h3>
        <p className="muted">Roads, water supply and electricity records.</p>

        <div className="city-public-grid">
          {infrastructure.map((item) => (
            <Card key={item.id} className="city-public-card">
              <div className="city-public-head">
                <h4>{item.name}</h4>
                <span className={`status ${item.status === "Operational" ? "resolved" : "pending"}`}>
                  {item.status}
                </span>
              </div>
              <p><strong>Type:</strong> {item.category}</p>
              <p><strong>Zone:</strong> {item.zone}</p>
              {item.description && <p><strong>Info:</strong> {item.description}</p>}
            </Card>
          ))}
        </div>

        {infrastructure.length === 0 && <p className="muted">No infrastructure records available.</p>}
      </section>

      <section className="stack-block">
        <h3>Amenities</h3>
        <p className="muted">Parks, malls and libraries maintained by admin.</p>

        <div className="city-public-grid">
          {amenities.map((item) => (
            <Card key={item.id} className="city-public-card">
              <div className="city-public-head">
                <h4>{item.name}</h4>
                <span className="status resolved">{item.status}</span>
              </div>
              <p><strong>Category:</strong> {item.category}</p>
              <p><strong>Zone:</strong> {item.zone}</p>
              <p><strong>Rating:</strong> {item.rating || 0} / 5</p>
              {item.description && <p><strong>Info:</strong> {item.description}</p>}
            </Card>
          ))}
        </div>

        {amenities.length === 0 && <p className="muted">No amenities records available.</p>}
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
    </>
  );
};

export default Services;
