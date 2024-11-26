import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

// Function to get the token (this should be replaced with your actual method of retrieving the token)
const getToken = () => {
  return localStorage.getItem("token");
};

const redirectToLogin = () => {
  const { hostname } = window.location;
  if (hostname !== "localhost") {
    window.location.replace(window.loginUrl);
  }
};

// Request interceptor to add the token to the headers
AxiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
AxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("call the refresh token api here");
      redirectToLogin();
    }
    return Promise.reject(error);
  }
);

export default AxiosInstance;
