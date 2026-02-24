import api from "../api/axiosConfig";

// TEMP: Dummy Data
const services = [
  {
    id: 1,
    name: "Central Heritage Park",
    category: "Park",
    location: "District 4",
    status: "Active",
    contact: "555-102-3940",
  },
  {
    id: 2,
    name: "City Hospital",
    category: "Health",
    location: "Health Plaza",
    status: "Active",
    contact: "555-222-3333",
  },
  {
    id: 3,
    name: "Public Library",
    category: "Education",
    location: "Knowledge Street",
    status: "Closed",
    contact: "555-444-5555",
  },
];

// LATER → API call
export const getAllServices = async () => {
  // return api.get("/services");

  return new Promise((resolve) => {
    setTimeout(() => resolve(services), 500);
  });
};