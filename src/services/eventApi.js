import api from "./apiClient";

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

export const registerForEvent = async (id) => {
  const response = await api.put(`/event/register/${id}`);
  return response.data;
};

export { normalizeEvent };
