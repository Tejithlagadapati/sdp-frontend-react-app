import { useEffect, useMemo, useState } from "react";
import {
  createService,
  getAllServices,
  updateService,
} from "../../services/CityService";

import Card from "../common/Card";

const CityManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [formOpen, setFormOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const emptyForm = {
    name: "",
    category: "",
    location: "",
    status: "Active",
    contact: "",
    isVisible: true,
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    const data = await getAllServices();
    setServices(data);
    setLoading(false);
  };

  const categories = useMemo(() => {
    const allCategories = services.map((service) => service.category);
    return ["All Categories", ...new Set(allCategories)];
  }, [services]);

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const normalizedSearch = searchTerm.trim().toLowerCase();
      const searchMatch =
        normalizedSearch.length === 0 ||
        service.name.toLowerCase().includes(normalizedSearch) ||
        service.location.toLowerCase().includes(normalizedSearch);

      const categoryMatch =
        categoryFilter === "All Categories" || service.category === categoryFilter;

      const statusMatch =
        statusFilter === "All Status" || service.status === statusFilter;

      return searchMatch && categoryMatch && statusMatch;
    });
  }, [services, searchTerm, categoryFilter, statusFilter]);

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingServiceId(null);
    setFormOpen(false);
  };

  const handleFormChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddNew = () => {
    setFeedbackMessage("");
    setEditingServiceId(null);
    setFormData(emptyForm);
    setFormOpen(true);
  };

  const handleEdit = (service) => {
    setFeedbackMessage("");
    setEditingServiceId(service.id);
    setFormData({
      name: service.name,
      category: service.category,
      location: service.location,
      status: service.status,
      contact: service.contact,
      isVisible: service.isVisible !== false,
    });
    setFormOpen(true);
  };

  const handleSaveService = async (event) => {
    event.preventDefault();

    const payload = {
      name: formData.name.trim(),
      category: formData.category.trim(),
      location: formData.location.trim(),
      status: formData.status,
      contact: formData.contact.trim(),
      isVisible: formData.isVisible,
    };

    if (editingServiceId) {
      await updateService(editingServiceId, payload);
      setFeedbackMessage("Service updated successfully.");
    } else {
      await createService(payload);
      setFeedbackMessage("New service added successfully.");
    }

    await loadServices();
    resetForm();
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setCategoryFilter("All Categories");
    setStatusFilter("All Status");
  };

  const exportCsv = () => {
    const columns = [
      "Service Name",
      "Category",
      "Location",
      "Status",
      "Primary Contact",
      "Visible To Users",
    ];

    const rows = filteredServices.map((service) => [
      service.name,
      service.category,
      service.location,
      service.status,
      service.contact,
      service.isVisible !== false ? "Yes" : "No",
    ]);

    const csvContent = [columns, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", "city-services.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="city-management-wrap">
      <div className="city-management-header">
        <div>
          <h1>City Information Management</h1>
          <p className="muted">
            Centralized inventory of public amenities, critical services, and smart city
            infrastructure points.
          </p>
        </div>

        <div className="city-management-actions">
          <button
            type="button"
            className="secondary-btn"
            onClick={exportCsv}
            disabled={filteredServices.length === 0}
          >
            Export CSV
          </button>
          <button type="button" className="primary-btn" onClick={handleAddNew}>
            + Add New Service
          </button>
        </div>
      </div>

      <Card className="city-toolbar-card">
        <div className="city-toolbar">
          <input
            type="text"
            placeholder="Search services by name or location..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="All Status">All Status</option>
            <option value="Active">Active</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Closed">Closed</option>
          </select>

          <button type="button" className="ghost-btn" onClick={handleResetFilters}>
            Reset Filters
          </button>
        </div>
      </Card>

      {formOpen && (
        <Card className="city-form-card">
          <h3>{editingServiceId ? "Edit Service" : "Add New Service"}</h3>

          <form className="city-service-form" onSubmit={handleSaveService}>
            <input
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              placeholder="Service Name"
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
              placeholder="Primary Contact"
              required
            />

            <label className="city-visibility-toggle">
              <input
                type="checkbox"
                name="isVisible"
                checked={formData.isVisible}
                onChange={handleFormChange}
              />
              Visible to users
            </label>

            <div className="city-form-actions">
              <button type="submit" className="primary-btn">
                {editingServiceId ? "Save Changes" : "Create Service"}
              </button>
              <button type="button" className="ghost-btn" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </Card>
      )}

      {feedbackMessage && <p className="success">{feedbackMessage}</p>}

      <Card className="city-table-card">
        <div className="city-table-wrap">
          <table className="data-table city-data-table">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Category</th>
                <th>Location</th>
                <th>Status</th>
                <th>Primary Contact</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="city-empty-row">Loading services...</td>
                </tr>
              )}

              {!loading && filteredServices.length === 0 && (
                <tr>
                  <td colSpan={6} className="city-empty-row">No services found for selected filters.</td>
                </tr>
              )}

              {!loading &&
                filteredServices.map((service) => (
                  <tr key={service.id}>
                    <td>{service.name}</td>
                    <td>
                      <span className="category-pill">{service.category}</span>
                    </td>
                    <td>{service.location}</td>
                    <td>
                      <span className={`status ${service.status.toLowerCase()}`}>
                        {service.status}
                      </span>
                    </td>
                    <td>{service.contact}</td>
                    <td>
                      <button
                        type="button"
                        className="table-action-btn"
                        onClick={() => handleEdit(service)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <p className="muted city-table-footer">Showing {filteredServices.length} of {services.length} services</p>
      </Card>
    </section>
  );
};

export default CityManagement;