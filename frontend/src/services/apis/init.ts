import axios from "axios";

const BASE_URL = "http://localhost:8000/api";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzODA4NTk5LCJpYXQiOjE3NDM4MDQ5OTksImp0aSI6IjNiMjg2MjZjOTgxMjQwOTViNWZhZGRiZDAzMTIxNDljIiwidXNlcl9pZCI6MX0.hFUQvIaZ3991dZZWwVbEyHHrBvTTo3AVQ_fVAceHla0";
export const apis = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});
