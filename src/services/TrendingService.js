const trendingData = [

  {
    id: 1,
    title: "Art & Culture Night",
    category: "Events",
    location: "City Cultural Center",
    date: "15 March 2026",

    description:
      "Experience a vibrant evening of art exhibitions, live performances, and cultural workshops featuring local and national artists. A perfect place to explore creativity and heritage.",

    image:
      "https://picsum.photos/seed/art-culture-night/800/500"
  },

  {
    id: 2,
    title: "City Music Festival",
    category: "Events",
    location: "Open Air Stadium",
    date: "18 March 2026",

    description:
      "Join thousands of music lovers for an electrifying night featuring popular bands, DJs, and solo artists. Enjoy live concerts, food stalls, and entertainment zones.",

    image:
      "https://picsum.photos/seed/city-music-festival/800/500"
  },

  {
    id: 3,
    title: "Street Food Carnival",
    category: "Restaurants",
    location: "Central Market",
    date: "20 March 2026",

    description:
      "Enjoy a wide range of local and international street food, live music, and cultural performances. A perfect destination for families and food lovers.",

    image:
      "https://picsum.photos/seed/street-food-carnival/800/500"
  },

  {
    id: 4,
    title: "Heritage Museum Tour",
    category: "Tourism",
    location: "National Heritage Museum",
    date: "25 March 2026",

    description:
      "Explore ancient artifacts, historical monuments, and interactive exhibitions with guided tours by expert historians. A must-visit for history enthusiasts.",

    image:
      "https://picsum.photos/seed/heritage-museum-tour/800/500"
  }

];

export const getAllTrending = () => {
  return trendingData;
};

/* Get By ID */
export const getTrendingById = (id) => {
  return trendingData.find(item => item.id === Number(id));
};