import axios from "axios";

const BASE_URL = "https://text-editor-production-6731.up.railway.app/api";
const token = document.cookie
  .split("; ")
  .find((row) => row.startsWith("token="))
  ?.split("=")[1];
console.log("Token from cookie:", token);
export const apis = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});
