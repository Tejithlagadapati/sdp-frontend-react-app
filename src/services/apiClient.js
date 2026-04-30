import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://fsad-sdp-backend-citizen-x2ui.onrender.com";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
