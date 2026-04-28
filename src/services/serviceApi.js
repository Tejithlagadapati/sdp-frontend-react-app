import apiClient from "./apiClient";

export const SERVICE_TYPES = {
    PUBLIC_SERVICE: "PUBLIC_SERVICE",
    INFRASTRUCTURE: "INFRASTRUCTURE",
    AMENITY: "AMENITY",
};

export const api = apiClient;

const extractServiceList = (payload) => {
    if (Array.isArray(payload)) {
        return payload;
    }

    if (Array.isArray(payload?.data)) {
        return payload.data;
    }

    if (Array.isArray(payload?.services)) {
        return payload.services;
    }

    if (Array.isArray(payload?.content)) {
        return payload.content;
    }

    if (Array.isArray(payload?.serviceList)) {
        return payload.serviceList;
    }

    return [];
};

const normalizeType = (value) => String(value || "").trim().toUpperCase();

const normalizeService = (service = {}) => ({
    id: service.id ?? service.serviceId,
    name: service.name || service.serviceName || "",
    type: normalizeType(service.type || service.serviceType),
    category: service.category || service.serviceCategory || "",
    location: service.location || service.address || "",
    zone: service.zone || service.area || "",
    contact: service.contact || service.contactNo || service.phone || "",
    info: service.info || service.description || service.details || "",
    status: service.status || service.serviceStatus || "",
});

const fetchAllServicesFromBackend = async () => {
    const response = await api.get("/service/all");
    return extractServiceList(response.data).map(normalizeService);
};

const fetchServicesByType = async (type) => {
    try {
        const response = await api.get(`/service/type/${type}`);
        return extractServiceList(response.data).map(normalizeService);
    } catch (error) {
        if (error?.response?.status === 404 || error?.response?.status === 405) {
            const allServices = await fetchAllServicesFromBackend();
            return allServices.filter((service) => service.type === type);
        }

        throw error;
    }
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
    const createdService = response.data?.data || response.data?.service || response.data || payload;
    return normalizeService(createdService);
};

export const deleteService = async (serviceId) => {
    if (!serviceId) {
        return;
    }

    await api.delete(`/service/${serviceId}`);
};

export const fetchUserServiceBookings = async (userId) => {
    if (!userId) {
        return [];
    }

    const response = await api.get(`/service/bookings/${userId}`);
    return extractServiceList(response.data);
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
