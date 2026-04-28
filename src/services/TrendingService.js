import { fetchAllEvents } from "./eventApi";

// Fallback mock data in case API fails
const fallbackMockData = [
  {
    id: 1,
    tag: "Festival",
    title: "Metro Summer Festival 2024",
    category: "Concerts",
    location: "Central Heritage Park",
    date: "July 15, 2024",
    time: "10:00 AM",
    registered: 1240,
    description:
      "A day of music, local food, and community celebrations in the heart of the city.",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
  },
];

// Cache for events to avoid excessive API calls
let cachedEvents = null;
let cacheTime = 0;
const CACHE_DURATION = 60000; // 1 minute

const normalizeEventForTrending = (event) => ({
  id: event.id,
  tag: event.category || "Event",
  title: event.title || "",
  category: event.category || "General",
  location: event.location || "",
  date: event.date || "",
  time: event.time || "",
  registered: event.registeredCount || 0,
  description: event.description || "",
  image: event.imageUrl || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
});

export const getAllTrending = () => {
  // For now, return cached data synchronously if available
  // This will work for initial load, but data will update after first API call
  return cachedEvents || fallbackMockData;
};

// Fetch and cache events from backend
export const loadTrendingEvents = async () => {
  try {
    const now = Date.now();
    // Use cache if fresh
    if (cachedEvents && (now - cacheTime) < CACHE_DURATION) {
      return cachedEvents;
    }

    const events = await fetchAllEvents();
    cachedEvents = events.map(normalizeEventForTrending);
    cacheTime = now;
    return cachedEvents;
  } catch (error) {
    console.error("Failed to load trending events from API", error);
    // Fall back to mock data on error
    return fallbackMockData;
  }
};

/* Get By ID */
export const getTrendingById = (id) => {
  const allEvents = getAllTrending();
  return allEvents.find(item => item.id === Number(id));
};
