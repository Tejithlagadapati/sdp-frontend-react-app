import { useMemo, useState } from "react";
import { useEffect } from "react";
import { addService, fetchAmenityServices, SERVICE_TYPES } from "../../services/serviceApi";
import Card from "../common/Card";

const iconByCategory = {
    Park: "🌳",
    Mall: "🏢",
    Library: "📚",
};

const emptyForm = {
    name: "",
    category: "Park",
    zone: "North",
    info: "",
    status: "Open",
    contact: "N/A",
};

const Amenities = () => {
    const [amenities, setAmenities] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All Categories");
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
                const data = await fetchAmenityServices();
                setAmenities(data);
            } catch (loadError) {
                setError(loadError?.response?.data?.message || loadError.message || "Failed to load amenities");
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const refreshData = async () => {
        const data = await fetchAmenityServices();
        setAmenities(data);
    };

    const filteredAmenities = useMemo(() => {
        return amenities.filter((item) => {
            const query = searchTerm.trim().toLowerCase();
            const searchMatch = !query || String(item.name || "").toLowerCase().includes(query);
            const categoryMatch = categoryFilter === "All Categories" || item.category === categoryFilter;
            return searchMatch && categoryMatch;
        });
    }, [amenities, searchTerm, categoryFilter]);

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
                type: SERVICE_TYPES.AMENITY,
                name: formData.name,
                category: formData.category,
                zone: formData.zone,
                location: `${formData.zone} Zone`,
                status: formData.status,
                contact: formData.contact,
                info: formData.info,
            };

            await addService(payload);

            setFormOpen(false);
            setFormData(emptyForm);
            await refreshData();
        } catch (submitError) {
            setError(submitError?.response?.data?.message || submitError.message || "Failed to add amenity");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="admin-page-wrap">
            <div className="admin-page-head">
                <div>
                    <h2>Amenities</h2>
                    <p>Manage parks, malls, libraries and recreational spaces.</p>
                </div>
                <button type="button" className="primary-btn" onClick={openCreateForm}>+ Add Amenity</button>
            </div>

            {error && <p className="muted">{error}</p>}

            <Card className="admin-filter-card">
                <div className="admin-filter-row">
                    <input
                        type="text"
                        placeholder="Search amenities..."
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                    />
                    <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
                        <option value="All Categories">All Categories</option>
                        <option value="Park">Park</option>
                        <option value="Mall">Mall</option>
                        <option value="Library">Library</option>
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
                            placeholder="Amenity name"
                            required
                        />
                        <select name="category" value={formData.category} onChange={handleFormChange}>
                            <option value="Park">Park</option>
                            <option value="Mall">Mall</option>
                            <option value="Library">Library</option>
                        </select>
                        <select name="zone" value={formData.zone} onChange={handleFormChange}>
                            <option value="North">North</option>
                            <option value="South">South</option>
                            <option value="East">East</option>
                            <option value="West">West</option>
                            <option value="Central">Central</option>
                        </select>
                        <select name="status" value={formData.status} onChange={handleFormChange}>
                            <option value="Open">Open</option>
                            <option value="Closed">Closed</option>
                            <option value="Maintenance">Maintenance</option>
                        </select>
                        <input
                            name="contact"
                            value={formData.contact}
                            onChange={handleFormChange}
                            placeholder="Contact"
                        />
                        <input
                            name="info"
                            value={formData.info}
                            onChange={handleFormChange}
                            placeholder="Info"
                        />

                        <div className="city-form-actions">
                            <button type="submit" className="primary-btn" disabled={isSubmitting}>
                                {isSubmitting ? "Creating..." : "Create Amenity"}
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

            <div className="admin-amenity-grid">
                {!isLoading && filteredAmenities.map((item) => (
                    <Card key={item.id} className="admin-amenity-card">
                        <span className="admin-amenity-icon">{iconByCategory[item.category] || "🏙️"}</span>
                        <h3>{item.name}</h3>
                        <p>{item.info || "No additional info"}</p>

                        <div className="admin-amenity-tags">
                            <span className="category-pill">{item.category}</span>
                            <span className="category-pill">📍 {item.zone}</span>
                        </div>

                        <small>📞 {item.contact || "N/A"}</small>
                        <div className="admin-amenity-rating">Status: <span>{item.status || "Open"}</span></div>

                    </Card>
                ))}
            </div>
        </section>
    );
};

export default Amenities;
