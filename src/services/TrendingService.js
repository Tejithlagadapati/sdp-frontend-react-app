const trendingData = [
  {
    id: 1,
    tag: "Festival",
    title: "Metro Summer Festival 2024",
    category: "Concerts",
    location: "Central Heritage Park",
    date: "July 15, 2024",
    time: "10:00 AM - 10:00 PM",
    registered: 1240,
    description:
      "A day of music, local food, and community celebrations in the heart of the city.",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    tag: "Governance",
    title: "Smart City Town Hall",
    category: "Education",
    location: "City Hall - Room 302",
    date: "July 18, 2024",
    time: "6:30 PM - 8:00 PM",
    registered: 85,
    description:
      "Discuss the new infrastructure projects planned for the upcoming fiscal quarter.",
    image:
      "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    tag: "Community",
    title: "Farmers Market Weekend",
    category: "Outdoors",
    location: "Market Square Plaza",
    date: "Every Saturday",
    time: "8:00 AM - 1:00 PM",
    registered: 450,
    description:
      "Fresh local produce, handmade crafts, and artisanal goods from regional vendors.",
    image:
      "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    tag: "Education",
    title: "Clean Green Workshop",
    category: "Health",
    location: "Public Library Annex",
    date: "July 22, 2024",
    time: "2:00 PM - 4:00 PM",
    registered: 32,
    description:
      "Learn effective composting and recycling techniques for urban households.",
    image:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 5,
    tag: "Arts",
    title: "Jazz in the Botanical Garden",
    category: "Arts",
    location: "Botanical Garden Amphitheater",
    date: "July 25, 2024",
    time: "7:00 PM - 9:00 PM",
    registered: 210,
    description:
      "An evening of smooth jazz under the stars surrounded by tropical flora.",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 6,
    tag: "Sports",
    title: "Youth Sports Tryouts",
    category: "Outdoors",
    location: "Metropolis Sports Complex",
    date: "July 27, 2024",
    time: "9:00 AM - 12:00 PM",
    registered: 150,
    description:
      "Annual basketball and soccer tryouts for the city competitive youth leagues.",
    image:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80",
  },
];

export const getAllTrending = () => {
  return trendingData;
};

/* Get By ID */
export const getTrendingById = (id) => {
  return trendingData.find(item => item.id === Number(id));
};
