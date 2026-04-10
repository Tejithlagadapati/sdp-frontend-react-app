import { useEffect, useState } from "react";
import Card from "../common/Card";
import {
  fetchAmenityServices,
  fetchInfrastructureServices,
  fetchPublicServices,
} from "../../services/serviceApi";

const Services = () => {
  const [publicServices, setPublicServices] = useState([]);
  const [infrastructure, setInfrastructure] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setIsLoading(true);
        setError("");

        const [servicesData, infraData, amenitiesData] = await Promise.all([
          fetchPublicServices(),
          fetchInfrastructureServices(),
          fetchAmenityServices(),
        ]);

        if (!isMounted) {
          return;
        }

        setPublicServices(servicesData);
        setInfrastructure(infraData);
        setAmenities(amenitiesData);
      } catch (fetchError) {
        if (!isMounted) {
          return;
        }

        setError(fetchError?.response?.data?.message || fetchError.message || "Failed to load services");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const renderServiceCard = (service) => (
    <Card key={service.id} className="city-public-card">
      <div className="city-public-head">
        <h4>{service.name}</h4>
        <span className={`status ${String(service.status || "active").toLowerCase().replace(/\s+/g, "-")}`}>
          {service.status || "Active"}
        </span>
      </div>
      <p><strong>Category:</strong> {service.category || "N/A"}</p>
      <p><strong>Location/Zone:</strong> {service.location || service.zone || "N/A"}</p>
      {service.info && <p><strong>Info:</strong> {service.info}</p>}
    </Card>
  );

  return (
    <>
      <h2>City Services</h2>
      <p className="muted">Explore public services, infrastructure, and amenities updated by admin.</p>

      {isLoading && <p className="muted">Loading services from backend...</p>}
      {error && <p className="muted">{error}</p>}

      <section className="stack-block">
        <h3>Public Services</h3>
        <p className="muted">Services published by city administrators.</p>

        <div className="city-public-grid">
          {publicServices.map(renderServiceCard)}
        </div>

        {!isLoading && publicServices.length === 0 && <p className="muted">No city services are published yet.</p>}
      </section>

      <section className="stack-block">
        <h3>Infrastructure</h3>
        <p className="muted">Roads, water supply and electricity records.</p>

        <div className="city-public-grid">
          {infrastructure.map(renderServiceCard)}
        </div>

        {!isLoading && infrastructure.length === 0 && <p className="muted">No infrastructure records available.</p>}
      </section>

      <section className="stack-block">
        <h3>Amenities</h3>
        <p className="muted">Parks, malls and libraries maintained by admin.</p>

        <div className="city-public-grid">
          {amenities.map(renderServiceCard)}
        </div>

        {!isLoading && amenities.length === 0 && <p className="muted">No amenities records available.</p>}
      </section>
    </>
  );
};

export default Services;
