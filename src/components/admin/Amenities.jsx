import { useMemo, useState } from "react";
import { useEffect } from "react";
import {
    createService,
    deleteService,
    getServicesByType,
    updateService,
} from "../../services/CityService";
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
    description: "",
    rating: "4.5",
};

const Amenities = () => {
    const [amenities, setAmenities] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All Categories");
    const [formData, setFormData] = useState(emptyForm);
    const [formOpen, setFormOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            const data = await getServicesByType("amenity");
            setAmenities(data);
        };
        loadData();
    }, []);

    const refreshData = async () => {
        const data = await getServicesByType("amenity");
        setAmenities(data);
    };

    const filteredAmenities = useMemo(() => {
        return amenities.filter((item) => {
            const query = searchTerm.trim().toLowerCase();
            const searchMatch = !query || item.name.toLowerCase().includes(query);
            const categoryMatch = categoryFilter === "All Categories" || item.category === categoryFilter;
            return searchMatch && categoryMatch;
        });
    }, [amenities, searchTerm, categoryFilter]);

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
            description: item.description || "",
            rating: String(item.rating || 4.5),
        });
        setFormOpen(true);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const payload = {
            entityType: "amenity",
            name: formData.name.trim(),
            category: formData.category,
            zone: formData.zone,
            location: `${formData.zone} Zone`,
            status: "Open",
            contact: "N/A",
            description: formData.description.trim(),
            rating: Number(formData.rating) || 0,
            reviews: editingId
                ? amenities.find((item) => item.id === editingId)?.reviews || 0
                : 0,
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
                    <h2>Amenities</h2>
                    <p>Manage parks, malls, libraries and recreational spaces.</p>
                </div>
                <button type="button" className="primary-btn" onClick={openCreateForm}>+ Add Amenity</button>
            </div>

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
                        <input
                            name="rating"
                            value={formData.rating}
                            onChange={handleFormChange}
                            placeholder="Rating"
                            type="number"
                            min="0"
                            max="5"
                            step="0.1"
                        />
                        <input
                            name="description"
                            value={formData.description}
                            onChange={handleFormChange}
                            placeholder="Short description"
                        />

                        <div className="city-form-actions">
                            <button type="submit" className="primary-btn">
                                {editingId ? "Save Changes" : "Create Amenity"}
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

            <div className="admin-amenity-grid">
                {filteredAmenities.map((item) => (
                    <Card key={item.id} className="admin-amenity-card">
                        <span className="admin-amenity-icon">{iconByCategory[item.category] || "🏙️"}</span>
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>

                        <div className="admin-amenity-tags">
                            <span className="category-pill">{item.category}</span>
                            <span className="category-pill">📍 {item.zone}</span>
                        </div>

                        <small>💬 {item.reviews} reviews</small>
                        <div className="admin-amenity-rating">★★★★★ <span>{item.rating}</span></div>

                        <div className="admin-amenity-actions">
                            <button type="button" className="table-action-btn" onClick={() => openEditForm(item)}>✎ Edit</button>
                            <button type="button" className="table-action-btn" onClick={() => handleDelete(item.id)}>🗑 Delete</button>
                        </div>
                    </Card>
                ))}
            </div>
        </section>
    );
};

export default Amenities;
