import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:2026";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const normalizeEvent = (event = {}) => ({
  id: event.id,
  title: String(event.title || ""),
  category: String(event.category || ""),
  date: String(event.date || ""),
  time: String(event.time || ""),
  location: String(event.location || ""),
  description: String(event.description || ""),
  registeredCount: Number(event.registeredCount ?? 0),
  imageUrl: String(event.imageUrl || ""),
});

const normalizeEventRegistration = (registration = {}) => {
  const event = registration.event || registration.eventDto || registration.eventDetails || {};
  const user = registration.user || registration.userDto || registration.userDetails || {};

  return {
    registrationId: registration.id ?? registration.registrationId ?? null,
    eventId: event.id ?? registration.eventId ?? null,
    userId: user.id ?? registration.userId ?? null,
    title: String(event.title || registration.title || "Untitled Event"),
    category: String(event.category || registration.category || "Event"),
    location: String(event.location || registration.location || "N/A"),
    date: String(event.date || registration.date || ""),
    time: String(event.time || registration.time || ""),
    status: String(registration.status || "Registered"),
    imageUrl: String(event.imageUrl || registration.imageUrl || ""),
  };
};

const extractEvents = (payload) => {
  const rawEvents = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.events)
        ? payload.events
        : [];

  return rawEvents.map(normalizeEvent);
};

export const fetchAllEvents = async () => {
  const response = await api.get("/event/all");
  return extractEvents(response.data);
};

export const addEvent = async (eventPayload) => {
  const payload = {
    title: String(eventPayload.title || "").trim(),
    category: String(eventPayload.category || "").trim(),
    date: String(eventPayload.date || "").trim(),
    time: String(eventPayload.time || "").trim(),
    location: String(eventPayload.location || "").trim(),
    description: String(eventPayload.description || "").trim(),
    imageUrl: String(eventPayload.imageUrl || "").trim(),
    registeredCount: 0,
  };

  const response = await api.post("/event/add", payload);
  const createdEvent = response.data?.data || response.data?.event || response.data || payload;

  return normalizeEvent(createdEvent);
};

export const registerForEvent = async (userId, eventId) => {
  if (!userId || !eventId) {
    throw new Error("userId and eventId are required to register for an event");
  }

  const response = await api.post(`/api/events/register/${userId}/${eventId}`);
  return response.data;
};

export const fetchUserEventRegistrations = async (userId) => {
  if (!userId) {
    return [];
  }

  const response = await api.get(`/api/events/registrations/user/${userId}`);
  const payload = response.data;
  const registrations = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.registrations)
        ? payload.registrations
        : [];

  return registrations.map(normalizeEventRegistration);
};

export const cancelEventRegistration = async (userId, eventId) => {
  if (!userId || !eventId) {
    throw new Error("userId and eventId are required to cancel registration");
  }

  const response = await api.delete(`/api/events/registrations/${userId}/${eventId}`);
  return response.data;
};

export { normalizeEvent, normalizeEventRegistration };