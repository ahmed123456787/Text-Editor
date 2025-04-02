import axios from "axios";

const BASE_URL = "http://localhost:8000/api";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzNjA0NjE0LCJpYXQiOjE3NDM2MDEwMTQsImp0aSI6IjM4MjkwMzdmNDczZTQxNjY4NDQ2YWExMjQ0YmVlOGIxIiwidXNlcl9pZCI6MX0.DUlV00cCVZrY2R3iVzd_pUlilJj02ihoUe8NySNchjo";
export const apis = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});
