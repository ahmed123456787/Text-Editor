import axios from "axios";

const BASE_URL = "http://localhost:8000/api";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzNTQyMjkwLCJpYXQiOjE3NDM1Mzg2OTAsImp0aSI6ImVkM2UwMzRiZDI0NzQxZDZhMDI5ZGJmNzM5YTI3NjQyIiwidXNlcl9pZCI6MX0.o_eWAHUpZrDEn6pC5Rk3k8T3urZC2tnr_Cma1C2dTTc";
export const apis = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});
