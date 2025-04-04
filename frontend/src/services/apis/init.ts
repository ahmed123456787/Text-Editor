import axios from "axios";

const BASE_URL = "http://localhost:8000/api";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzODEyMzYxLCJpYXQiOjE3NDM4MDg3NjEsImp0aSI6IjlhNmNjNTFlYzUyZDQ3NmZiZjkwZTZmMDc3YjNlMjFlIiwidXNlcl9pZCI6MX0.RBw87wPY5uJHB13ccbNsz8nMY1fooeaZx7jm8pCp1GY";
export const apis = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});
