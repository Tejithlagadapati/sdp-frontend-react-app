import { useMemo, useState } from "react";
import { useEffect } from "react";
import {
    createService,
    deleteService,
    getServicesByType,
    updateService,
} from "../../services/CityService";
import Card from "../common/Card";

const emptyForm = {
    name: "",
    category: "Road",
    zone: "North",
    status: "Operational",
    description: "",
};

const Infrastructure = () => {
    const [infrastructure, setInfrastructure] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("All Types");
    const [formData, setFormData] = useState(emptyForm);
    const [formOpen, setFormOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            const data = await getServicesByType("infrastructure");
            setInfrastructure(data);
        };
        loadData();
    }, []);

    const refreshData = async () => {
        const data = await getServicesByType("infrastructure");
        setInfrastructure(data);
    };

    const filteredData = useMemo(() => {
        return infrastructure.filter((item) => {
            const query = searchTerm.trim().toLowerCase();
            const searchMatch = !query || item.name.toLowerCase().includes(query) || item.zone.toLowerCase().includes(query);
            const typeMatch = typeFilter === "All Types" || item.category === typeFilter;
            return searchMatch && typeMatch;
        });
    }, [infrastructure, searchTerm, typeFilter]);

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({ ...previous, [name]: value }));
    };

    const openCreateForm = () => {
        setEditingId(null);
        setFormData(emptyForm);
        setFormOpen(true);
    };

    const openEditForm = (item) => {
        setEditingId(item.id);
        setFormData({
            name: item.name,
            category: item.category,
            zone: item.zone,
            status: item.status,
            description: item.description || "",
        });
        setFormOpen(true);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const payload = {
            entityType: "infrastructure",
            name: formData.name.trim(),
            category: formData.category,
            zone: formData.zone,
            location: `${formData.zone} Zone`,
            status: formData.status,
            contact: "N/A",
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

    const handleDelete = async (id) => {
        await deleteService(id);
        await refreshData();
    };

    return (
        <section className="admin-page-wrap">
            <div className="admin-page-head">
                <div>
                    <h2>Infrastructure</h2>
                    <p>Manage roads, water supply and electricity networks.</p>
                </div>
                <button type="button" className="primary-btn" onClick={openCreateForm}>+ Add Infrastructure</button>
            </div>

            <Card className="admin-filter-card">
                <div className="admin-filter-row">
                    <input
                        type="text"
                        placeholder="Search by name or zone..."
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                    />
                    <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
                        <option value="All Types">All Types</option>
                        <option value="Road">Road</option>
                        <option value="Water Supply">Water Supply</option>
                        <option value="Electricity">Electricity</option>
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
                            placeholder="Infrastructure name"
                            required
                        />
                        <select name="category" value={formData.category} onChange={handleFormChange}>
                            <option value="Road">Road</option>
                            <option value="Water Supply">Water Supply</option>
                            <option value="Electricity">Electricity</option>
                        </select>
                        <select name="zone" value={formData.zone} onChange={handleFormChange}>
                            <option value="North">North</option>
                            <option value="South">South</option>
                            <option value="East">East</option>
                            <option value="West">West</option>
                            <option value="Central">Central</option>
                        </select>
                        <select name="status" value={formData.status} onChange={handleFormChange}>
                            <option value="Operational">Operational</option>
                            <option value="Under Maintenance">Under Maintenance</option>
                        </select>
                        <input
                            name="description"
                            value={formData.description}
                            onChange={handleFormChange}
                            placeholder="Short description"
                        />
                        <div className="city-form-actions">
                            <button type="submit" className="primary-btn">
                                {editingId ? "Save Changes" : "Create Infrastructure"}
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
                <div className="admin-table-title">All Infrastructure ({filteredData.length})</div>
                <div className="city-table-wrap">
                    <table className="data-table admin-data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Zone</th>
                                <th>Status</th>
                                <th>Last Updated</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <div className="admin-inline-title">{item.name}</div>
                                        <small>{item.description}</small>
                                    </td>
                                    <td><span className="category-pill">{item.category}</span></td>
                                    <td>{item.zone}</td>
                                    <td>
                                        <span className={`status ${item.status === "Operational" ? "resolved" : "pending"}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td>{new Date(item.updatedAt || Date.now()).toISOString().slice(0, 10)}</td>
                                    <td>
                                        <div className="admin-table-actions">
                                            <button type="button" className="table-action-btn" onClick={() => openEditForm(item)}>✎</button>
                                            <button type="button" className="table-action-btn" onClick={() => handleDelete(item.id)}>🗑</button>
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

export default Infrastructure;
