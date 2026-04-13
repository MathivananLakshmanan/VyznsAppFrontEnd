import axios from "axios";

const api = axios.create({
    baseURL: "https://vyznsappspringbootbackendhostinginrender.onrender.com",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        if (!error.response || status >= 500) {
            window.location.href = `/error?code=${status ?? 503}`;
        }
        return Promise.reject(error);
    }
);

export default api;