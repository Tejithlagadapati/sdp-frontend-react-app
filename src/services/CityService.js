const CITY_SERVICES_STORAGE_KEY = "city-services";

const defaultServices = [
  {
    id: 1,
    name: "Central Heritage Park",
    category: "Park",
    location: "122 Greenway Blvd, District 4",
    status: "Active",
    contact: "(555) 102-3940",
    isVisible: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Metropolis Water Works",
    category: "Utility",
    location: "45 Industrial Pkwy",
    status: "Maintenance",
    contact: "(555) 900-1122",
    isVisible: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "District 9 Fire Station",
    category: "Emergency",
    location: "88 Rescue Lane",
    status: "Active",
    contact: "(555) 911-0000",
    isVisible: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 4,
    name: "City General Hospital",
    category: "Health",
    location: "10 Health Plaza",
    status: "Active",
    contact: "(555) 222-3333",
    isVisible: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 5,
    name: "Northside Public Library",
    category: "Education",
    location: "200 Knowledge St",
    status: "Closed",
    contact: "(555) 444-5555",
    isVisible: true,
    updatedAt: new Date().toISOString(),
  },
];

const getStoredServices = () => {
  const parsed = JSON.parse(localStorage.getItem(CITY_SERVICES_STORAGE_KEY)) || [];

  if (parsed.length === 0) {
    localStorage.setItem(CITY_SERVICES_STORAGE_KEY, JSON.stringify(defaultServices));
    return defaultServices;
  }

  return parsed;
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

export const createService = async (servicePayload) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const services = getStoredServices();

      const newService = {
        id: Date.now(),
        ...servicePayload,
        isVisible: servicePayload.isVisible !== false,
        updatedAt: new Date().toISOString(),
      };

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