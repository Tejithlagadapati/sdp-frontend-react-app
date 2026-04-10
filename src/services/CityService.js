import {
  SERVICE_TYPES,
  addService,
  fetchAllServices,
  fetchAmenityServices,
  fetchInfrastructureServices,
  fetchPublicServices,
} from "./serviceApi";

const LEGACY_TO_BACKEND_TYPE = {
  "public-service": SERVICE_TYPES.PUBLIC_SERVICE,
  infrastructure: SERVICE_TYPES.INFRASTRUCTURE,
  amenity: SERVICE_TYPES.AMENITY,
};

export const getAllServices = async () => {
  return fetchAllServices();
};

export const getPublicServices = async () => {
  return fetchPublicServices();
};

export const getServicesByType = async (entityType) => {
  const normalizedType = LEGACY_TO_BACKEND_TYPE[entityType] || entityType;

  if (normalizedType === SERVICE_TYPES.PUBLIC_SERVICE) {
    return fetchPublicServices();
  }

  if (normalizedType === SERVICE_TYPES.INFRASTRUCTURE) {
    return fetchInfrastructureServices();
  }

  if (normalizedType === SERVICE_TYPES.AMENITY) {
    return fetchAmenityServices();
  }

  return [];
};

export const createService = async (servicePayload) => {
  return addService(servicePayload);
};

export const updateService = async () => {
  throw new Error("Update endpoint is not configured in frontend API integration");
};

export const deleteService = async () => {
  throw new Error("Delete endpoint is not configured in frontend API integration");
};