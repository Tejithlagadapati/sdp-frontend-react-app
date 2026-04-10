import { useEffect, useMemo, useState } from "react";
import { addService, fetchPublicServices, SERVICE_TYPES } from "../../services/serviceApi";
import Card from "../common/Card";

const emptyForm = {
  name: "",
  category: "",
  location: "",
  status: "Active",
  contact: "",
  info: "",
};

const CityManagement = () => {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [formData, setFormData] = useState(emptyForm);
  const [formOpen, setFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        setIsLoading(true);
        setError("");
        const data = await fetchPublicServices();
        setServices(data);
      } catch (loadError) {
        setError(loadError?.response?.data?.message || loadError.message || "Failed to load services");
      } finally {
        setIsLoading(false);
      }
    };

    loadServices();
  }, []);

  const refreshData = async () => {
    const data = await fetchPublicServices();
    setServices(data);
  };

  const openCreateForm = () => {
    setError("");
    setFormData(emptyForm);
    setFormOpen(true);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError("");

      const payload = {
        type: SERVICE_TYPES.PUBLIC_SERVICE,
        name: formData.name,
        category: formData.category,
        location: formData.location,
        zone: formData.location,
        contact: formData.contact,
        info: formData.info,
        status: formData.status,
      };

      await addService(payload);

      setFormOpen(false);
      setFormData(emptyForm);
      await refreshData();
    } catch (submitError) {
      setError(submitError?.response?.data?.message || submitError.message || "Failed to add service");
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = useMemo(() => {
    return ["All Categories", ...new Set(services.map((service) => service.category))];
  }, [services]);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const searchValue = search.trim().toLowerCase();
      const searchMatch =
        !searchValue ||
        String(service.name || "").toLowerCase().includes(searchValue) ||
        String(service.location || service.zone || "").toLowerCase().includes(searchValue);
      const categoryMatch = category === "All Categories" || service.category === category;
      return searchMatch && categoryMatch;
    });
  }, [services, search, category]);

  return (
    <section className="admin-page-wrap">
      <div className="admin-page-head">
        <div>
          <h2>Public Services</h2>
          <p>Manage city-level public service records and visibility.</p>
        </div>
        <button type="button" className="primary-btn" onClick={openCreateForm}>+ Add Service</button>
      </div>

      {error && <p className="muted">{error}</p>}

      <Card className="admin-filter-card">
        <div className="admin-filter-row">
          <input
            type="text"
            placeholder="Search by name or location..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </Card>

      {formOpen && (
        <Card>
          <form className="city-service-form" onSubmit={handleSubmit}>
            <input
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              placeholder="Service name"
              required
            />
            <input
              name="category"
              value={formData.category}
              onChange={handleFormChange}
              placeholder="Category"
              required
            />
            <input
              name="location"
              value={formData.location}
              onChange={handleFormChange}
              placeholder="Location"
              required
            />
            <select name="status" value={formData.status} onChange={handleFormChange}>
              <option value="Active">Active</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Closed">Closed</option>
            </select>
            <input
              name="contact"
              value={formData.contact}
              onChange={handleFormChange}
              placeholder="Contact"
              required
            />
            <input
              name="info"
              value={formData.info}
              onChange={handleFormChange}
              placeholder="Info"
            />

            <div className="city-form-actions">
              <button type="submit" className="primary-btn" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Service"}
              </button>
              <button
                type="button"
                className="ghost-btn"
                onClick={() => {
                  setFormOpen(false);
                  setFormData(emptyForm);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </Card>
      )}

      <Card className="admin-table-card">
        <div className="admin-table-title">All Services ({isLoading ? 0 : filteredServices.length})</div>
        <div className="city-table-wrap">
          <table className="data-table admin-data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Location</th>
                <th>Status</th>
                <th>Info</th>
              </tr>
            </thead>
            <tbody>
              {!isLoading &&
                filteredServices.map((service) => (
                  <tr key={service.id}>
                    <td>{service.name}</td>
                    <td><span className="category-pill">{service.category}</span></td>
                    <td>{service.location || service.zone || "N/A"}</td>
                    <td><span className={`status ${String(service.status || "active").toLowerCase().replace(/\s+/g, "-")}`}>{service.status || "Active"}</span></td>
                    <td>{service.info || "-"}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
};

export default CityManagement;