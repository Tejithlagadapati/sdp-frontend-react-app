import { fetchAllEvents, registerForEvent } from "./eventApi";

const fallbackImage =
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80";

const getTrendingTag = (category, title) => {
  const categoryText = String(category || "").toLowerCase();
  const titleText = String(title || "").toLowerCase();

  if (categoryText.includes("fest") || titleText.includes("fest")) return "Festival";
  if (categoryText.includes("gov") || titleText.includes("town hall")) return "Governance";
  if (categoryText.includes("out") || titleText.includes("market")) return "Community";
  if (categoryText.includes("art") || titleText.includes("jazz")) return "Arts";
  if (categoryText.includes("sport") || titleText.includes("sports")) return "Sports";
  return category || "Event";
};

const normalizeTrendingEvent = (event) => ({
  id: event.id,
  tag: getTrendingTag(event.category, event.title),
  title: event.title || "Untitled Event",
  category: event.category || "Event",
  location: event.location || "TBA",
  date: event.date || "TBA",
  time: event.time || "TBA",
  registered: Number(event.registeredCount || 0),
  registeredCount: Number(event.registeredCount || 0),
  description: event.description || "No description provided.",
  image: event.imageUrl || fallbackImage,
});

export const getAllTrending = async () => {
  const events = await fetchAllEvents();
  return events
    .map(normalizeTrendingEvent)
    .sort((left, right) => Number(right.registered) - Number(left.registered));
};

export const getTrendingById = async (id) => {
  const events = await fetchAllEvents();
  const match = events.find((item) => item.id === Number(id));

  return match ? normalizeTrendingEvent(match) : null;
};

export const registerTrendingEvent = async (userId, eventId) => {
  return registerForEvent(userId, eventId);
};
