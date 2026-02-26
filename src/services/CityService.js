const CITY_SERVICES_STORAGE_KEY = "city-services";

const INFRA_CATEGORIES = new Set(["road", "water supply", "electricity"]);
const AMENITY_CATEGORIES = new Set(["park", "mall", "library"]);

const inferEntityType = (entity) => {
  if (entity.entityType) {
    return entity.entityType;
  }

  const category = String(entity.category || "").toLowerCase();

  if (INFRA_CATEGORIES.has(category)) {
    return "infrastructure";
  }

  if (AMENITY_CATEGORIES.has(category)) {
    return "amenity";
  }

  return "public-service";
};

const defaultServices = [
  {
    id: 1,
    entityType: "public-service",
    name: "City General Hospital",
    category: "Health",
    location: "10 Health Plaza",
    status: "Active",
    contact: "(555) 222-3333",
    description: "24x7 emergency and general healthcare center.",
    isVisible: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    entityType: "public-service",
    name: "District 9 Fire Station",
    category: "Emergency",
    location: "88 Rescue Lane",
    status: "Active",
    contact: "(555) 911-0000",
    description: "Rapid fire and disaster response unit.",
    isVisible: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    entityType: "public-service",
    name: "Northside Public Library",
    category: "Education",
    location: "200 Knowledge St",
    status: "Active",
    contact: "(555) 444-5555",
    description: "Community reading and learning hub.",
    isVisible: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 4,
    entityType: "infrastructure",
    name: "NH-44 Highway Stretch",
    category: "Road",
    location: "North Zone",
    zone: "North",
    status: "Operational",
    contact: "(555) 900-1122",
    description: "12 km 6-lane national highway expansion.",
    isVisible: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 5,
    entityType: "infrastructure",
    name: "Water Treatment Plant A",
    category: "Water Supply",
    location: "South Zone",
    zone: "South",
    status: "Operational",
    contact: "(555) 712-4501",
    description: "Treats 200 MLD water daily for southern zones.",
    isVisible: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 6,
    entityType: "infrastructure",
    name: "Zone-C Power Substation",
    category: "Electricity",
    location: "Central Zone",
    zone: "Central",
    status: "Operational",
    contact: "(555) 604-8821",
    description: "220kV substation powering central district.",
    isVisible: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 7,
    entityType: "amenity",
    name: "Nehru Botanical Gardens",
    category: "Park",
    location: "North Zone",
    zone: "North",
    status: "Open",
    contact: "(555) 312-1400",
    description: "40-acre garden with jogging track and botanical collection.",
    rating: 4.5,
    reviews: 1,
    isVisible: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 8,
    entityType: "amenity",
    name: "City Central Mall",
    category: "Mall",
    location: "Central Zone",
    zone: "Central",
    status: "Open",
    contact: "(555) 310-2255",
    description: "3-floor retail and entertainment complex.",
    rating: 4.2,
    reviews: 0,
    isVisible: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 9,
    entityType: "amenity",
    name: "Dr. Ambedkar Library",
    category: "Library",
    location: "East Zone",
    zone: "East",
    status: "Open",
    contact: "(555) 988-1020",
    description: "Largest public library with digital reading room.",
    rating: 4.7,
    reviews: 1,
    isVisible: true,
    updatedAt: new Date().toISOString(),
  },
];

const sanitizeEntity = (entity) => {
  const normalizedType = inferEntityType(entity);

  return {
    ...entity,
    entityType: normalizedType,
    status: entity.status || (normalizedType === "amenity" ? "Open" : "Active"),
    zone: entity.zone || "-",
    contact: entity.contact || "N/A",
    description: entity.description || "",
    rating: entity.rating ?? 0,
    reviews: entity.reviews ?? 0,
    isVisible: entity.isVisible !== false,
    updatedAt: entity.updatedAt || new Date().toISOString(),
  };
};

const getStoredServices = () => {
  const parsed = JSON.parse(localStorage.getItem(CITY_SERVICES_STORAGE_KEY)) || [];

  if (parsed.length === 0) {
    localStorage.setItem(
      CITY_SERVICES_STORAGE_KEY,
      JSON.stringify(defaultServices.map((entity) => sanitizeEntity(entity)))
    );
    return defaultServices;
  }

  const sanitized = parsed.map((entity) => sanitizeEntity(entity));
  const hadLegacyData = parsed.some((entity) => !entity.entityType);

  if (hadLegacyData) {
    saveServices(sanitized);
  }

  return sanitized;
};

const saveServices = (services) => {
  localStorage.setItem(CITY_SERVICES_STORAGE_KEY, JSON.stringify(services));
};

const sortByLatest = (services) => {
  return [...services].sort(
    (a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
  );
};

export const getAllServices = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(sortByLatest(getStoredServices()));
    }, 200);
  });
};

export const getPublicServices = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const services = getStoredServices().filter((service) => service.isVisible !== false);
      resolve(sortByLatest(services));
    }, 200);
  });
};

export const getServicesByType = async (entityType, onlyVisible = false) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const entities = getStoredServices().filter(
        (entity) =>
          entity.entityType === entityType &&
          (!onlyVisible || entity.isVisible !== false)
      );
      resolve(sortByLatest(entities));
    }, 200);
  });
};

export const createService = async (servicePayload) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const services = getStoredServices();

      const newService = sanitizeEntity({
        id: Date.now(),
        ...servicePayload,
        updatedAt: new Date().toISOString(),
      });

      saveServices([newService, ...services]);
      resolve(newService);
    }, 250);
  });
};

export const updateService = async (serviceId, servicePayload) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const services = getStoredServices();

      const updatedServices = services.map((service) =>
        service.id === serviceId
          ? {
            ...service,
            ...servicePayload,
            updatedAt: new Date().toISOString(),
          }
          : service
      );

      saveServices(updatedServices);

      const updatedService = updatedServices.find((service) => service.id === serviceId);
      resolve(updatedService);
    }, 250);
  });
};

export const deleteService = async (serviceId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const services = getStoredServices();
      const updatedServices = services.filter((service) => service.id !== serviceId);
      saveServices(updatedServices);
      resolve(true);
    }, 200);
  });
};