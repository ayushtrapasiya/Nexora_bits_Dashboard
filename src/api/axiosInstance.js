import axios from "axios";
import store from "../Store/store";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_REACT_API_URL, 
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
