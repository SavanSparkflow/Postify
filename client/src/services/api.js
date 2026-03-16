import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://postify-ai-server.vercel.app/api",
    // baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
});

API.interceptors.request.use((req) => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
        const { token } = JSON.parse(userInfo);
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;
