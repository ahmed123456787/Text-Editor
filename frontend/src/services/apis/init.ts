import axios from "axios";

const BASE_URL = "http://localhost:8000/api";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzMjk2NTE3LCJpYXQiOjE3NDMyOTI5MTcsImp0aSI6IjE1ZTdmMmM0NThiYjRlMzFiNzJhN2Q0ZDM0YTRiMDcwIiwidXNlcl9pZCI6MX0.GT7byyPUVfP1_bz9zFFa_STMtlYniR-Esq4y_fVRd04";
export const apis = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});
