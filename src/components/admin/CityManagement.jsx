import { useEffect, useMemo, useState } from "react";
import {
  createService,
  deleteService,
  getServicesByType,
  updateService,
} from "../../services/CityService";
import Card from "../common/Card";

const emptyForm = {
  name: "",
  category: "",
  location: "",
  status: "Active",
  contact: "",
  description: "",
};

const CityManagement = () => {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [formData, setFormData] = useState(emptyForm);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const loadServices = async () => {
      const data = await getServicesByType("public-service");
      setServices(data);
    };

    loadServices();
  }, []);

  const refreshData = async () => {
    const data = await getServicesByType("public-service");
    setServices(data);
  };

  const openCreateForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setFormOpen(true);
  };

  const openEditForm = (service) => {
    setEditingId(service.id);
    setFormData({
      name: service.name,
      category: service.category,
      location: service.location,
      status: service.status,
      contact: service.contact,
      description: service.description || "",
    });
    setFormOpen(true);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      ...formData,
      entityType: "public-service",
      name: formData.name.trim(),
      category: formData.category.trim(),
      location: formData.location.trim(),
      contact: formData.contact.trim(),
      description: formData.description.trim(),
    };

    if (editingId) {
      await updateService(editingId, payload);
    } else {
      await createService(payload);
    }

    setFormOpen(false);
    setEditingId(null);
    setFormData(emptyForm);
    await refreshData();
  };

  const handleDelete = async (serviceId) => {
    await deleteService(serviceId);
    await refreshData();
  };

  const categories = useMemo(() => {
    return ["All Categories", ...new Set(services.map((service) => service.category))];
  }, [services]);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const searchValue = search.trim().toLowerCase();
      const searchMatch =
        !searchValue ||
        service.name.toLowerCase().includes(searchValue) ||
        service.location.toLowerCase().includes(searchValue);
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
              name="description"
              value={formData.description}
              onChange={handleFormChange}
              placeholder="Short description"
            />

            <div className="city-form-actions">
              <button type="submit" className="primary-btn">
                {editingId ? "Save Changes" : "Create Service"}
              </button>
              <button
                type="button"
                className="ghost-btn"
                onClick={() => {
                  setFormOpen(false);
                  setEditingId(null);
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
        <div className="admin-table-title">All Services ({filteredServices.length})</div>
        <div className="city-table-wrap">
          <table className="data-table admin-data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Location</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map((service) => (
                <tr key={service.id}>
                  <td>{service.name}</td>
                  <td><span className="category-pill">{service.category}</span></td>
                  <td>{service.location}</td>
                  <td><span className={`status ${service.status.toLowerCase()}`}>{service.status}</span></td>
                  <td>{new Date(service.updatedAt || Date.now()).toISOString().slice(0, 10)}</td>
                  <td>
                    <div className="admin-table-actions">
                      <button type="button" className="table-action-btn" onClick={() => openEditForm(service)}>✎</button>
                      <button type="button" className="table-action-btn" onClick={() => handleDelete(service.id)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
};

export default CityManagement;