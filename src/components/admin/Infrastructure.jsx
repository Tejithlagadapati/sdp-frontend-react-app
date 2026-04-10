import { useMemo, useState } from "react";
import { useEffect } from "react";
import {
    addService,
    fetchInfrastructureServices,
    SERVICE_TYPES,
} from "../../services/serviceApi";
import Card from "../common/Card";

const emptyForm = {
    name: "",
    category: "Road",
    zone: "North",
    status: "Operational",
    info: "",
};

const Infrastructure = () => {
    const [infrastructure, setInfrastructure] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("All Types");
    const [formData, setFormData] = useState(emptyForm);
    const [formOpen, setFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                setError("");
                const data = await fetchInfrastructureServices();
                setInfrastructure(data);
            } catch (loadError) {
                setError(loadError?.response?.data?.message || loadError.message || "Failed to load infrastructure");
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const refreshData = async () => {
        const data = await fetchInfrastructureServices();
        setInfrastructure(data);
    };

    const filteredData = useMemo(() => {
        return infrastructure.filter((item) => {
            const query = searchTerm.trim().toLowerCase();
            const searchMatch = !query || String(item.name || "").toLowerCase().includes(query) || String(item.zone || "").toLowerCase().includes(query);
            const typeMatch = typeFilter === "All Types" || item.category === typeFilter;
            return searchMatch && typeMatch;
        });
    }, [infrastructure, searchTerm, typeFilter]);

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({ ...previous, [name]: value }));
    };

    const openCreateForm = () => {
        setError("");
        setFormData(emptyForm);
        setFormOpen(true);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setIsSubmitting(true);
            setError("");

            const payload = {
                type: SERVICE_TYPES.INFRASTRUCTURE,
                name: formData.name,
                category: formData.category,
                zone: formData.zone,
                location: `${formData.zone} Zone`,
                status: formData.status,
                contact: "N/A",
                info: formData.info,
            };

            await addService(payload);

            setFormOpen(false);
            setFormData(emptyForm);
            await refreshData();
        } catch (submitError) {
            setError(submitError?.response?.data?.message || submitError.message || "Failed to add infrastructure");
        } finally {
            setIsSubmitting(false);
        }
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

            {error && <p className="muted">{error}</p>}

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
                            name="info"
                            value={formData.info}
                            onChange={handleFormChange}
                            placeholder="Info"
                        />
                        <div className="city-form-actions">
                            <button type="submit" className="primary-btn" disabled={isSubmitting}>
                                {isSubmitting ? "Creating..." : "Create Infrastructure"}
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
                <div className="admin-table-title">All Infrastructure ({isLoading ? 0 : filteredData.length})</div>
                <div className="city-table-wrap">
                    <table className="data-table admin-data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Zone</th>
                                <th>Status</th>
                                <th>Info</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!isLoading && filteredData.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <div className="admin-inline-title">{item.name}</div>
                                        <small>{item.location || item.zone}</small>
                                    </td>
                                    <td><span className="category-pill">{item.category}</span></td>
                                    <td>{item.zone}</td>
                                    <td>
                                        <span className={`status ${String(item.status || "Operational").toLowerCase().replace(/\s+/g, "-")}`}>
                                            {item.status || "Operational"}
                                        </span>
                                    </td>
                                    <td>{item.info || "-"}</td>
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
