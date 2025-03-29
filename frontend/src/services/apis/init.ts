import axios from "axios";

const BASE_URL = "http://localhost:8000/api";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzMjYzNDE1LCJpYXQiOjE3NDMyNTk4MTUsImp0aSI6IjkyZDA2ZTcxM2E1MTQ0ZWFiMjE2NmMxNTM1NzAxYzBjIiwidXNlcl9pZCI6MX0.VfCKLoS-iFvX-aLVqDezyjiRtoV2dp_i_-xoneHi-Wg";

export const apis = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});
