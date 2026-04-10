import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:2026";

export const SERVICE_TYPES = {
    PUBLIC_SERVICE: "PUBLIC_SERVICE",
    INFRASTRUCTURE: "INFRASTRUCTURE",
    AMENITY: "AMENITY",
};

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

const normalizeService = (service) => ({
    id: service.id,
    name: service.name || "",
    type: service.type || "",
    category: service.category || "",
    location: service.location || "",
    zone: service.zone || "",
    contact: service.contact || "",
    info: service.info || "",
    status: service.status || "",
});

const fetchServicesByType = async (type) => {
    const response = await api.get(`/service/type/${type}`);
    const data = Array.isArray(response.data) ? response.data : [];
    return data.map(normalizeService);
};

export const fetchPublicServices = async () => {
    return fetchServicesByType(SERVICE_TYPES.PUBLIC_SERVICE);
};

export const fetchInfrastructureServices = async () => {
    return fetchServicesByType(SERVICE_TYPES.INFRASTRUCTURE);
};

export const fetchAmenityServices = async () => {
    return fetchServicesByType(SERVICE_TYPES.AMENITY);
};

export const addService = async (servicePayload) => {
    const payload = {
        name: String(servicePayload.name || "").trim(),
        type: servicePayload.type,
        category: String(servicePayload.category || "").trim(),
        location: String(servicePayload.location || "").trim(),
        zone: String(servicePayload.zone || "").trim(),
        contact: String(servicePayload.contact || "").trim(),
        info: String(servicePayload.info || "").trim(),
        status: String(servicePayload.status || "").trim(),
    };

    const response = await api.post("/service/add", payload);
    return normalizeService(response.data || payload);
};

export const fetchUserServiceBookings = async (userId) => {
    if (!userId) {
        return [];
    }

    const response = await api.get(`/service/bookings/${userId}`);
    return Array.isArray(response.data) ? response.data : [];
};

export const deleteServiceBooking = async (bookingId) => {
    if (!bookingId) {
        return;
    }

    await api.delete(`/service/booking/${bookingId}`);
};

export const fetchAllServices = async () => {
    const [publicServices, infrastructureServices, amenityServices] = await Promise.all([
        fetchPublicServices(),
        fetchInfrastructureServices(),
        fetchAmenityServices(),
    ]);

    return [...publicServices, ...infrastructureServices, ...amenityServices];
};
