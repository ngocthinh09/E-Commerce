import axios, { type InternalAxiosRequestConfig, type AxiosResponse } from "axios";

const axiosClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        console.error("Session expired. Redirecting...");
        localStorage.removeItem("access_token");
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
