import axios from "axios";

export const api = axios.create({
  baseURL: "https://hrms-backend-2u9b.onrender.com",
});
