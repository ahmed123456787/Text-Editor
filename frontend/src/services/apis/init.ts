import axios from "axios";

const BASE_URL = "http://localhost:8000/api";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzMTgzOTE3LCJpYXQiOjE3NDMxODAzMTcsImp0aSI6ImI2ZTEwZTYwNjcxYTRlYzQ5MDVkMzk4MWUyNmM4N2EzIiwidXNlcl9pZCI6MX0.P4YgU_AlAeYs8dW5F2SzZYwUFQK6ER19LLOdNJb799E";

export const apis = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});
