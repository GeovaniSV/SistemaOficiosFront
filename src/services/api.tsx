import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
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

    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    if (status === 403 && error.response) {
      const message = error.response.data?.message;
      if (!message || message === "This action is unauthorized.") {
        error.response.data = {
          ...error.response.data,
          message: "Você não tem permissão para realizar esta ação.",
        };
      }
    }

    return Promise.reject(error);
  },
);

export { api };
