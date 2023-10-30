const baseUrl = "http://127.0.0.1:8081/api";

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: baseUrl,
});

export default axiosInstance;
