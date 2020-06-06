import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.100.19:1010/",
});
export default api;
