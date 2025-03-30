import axios from "axios";

const BASE_URL = "http://localhost:8000/api";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzMzUyNTM2LCJpYXQiOjE3NDMzNDg5MzYsImp0aSI6ImIzYTdkMDk3MmMwNTQ2NDZiNzM1ZTcyNWRjNDA2NDgwIiwidXNlcl9pZCI6MX0.CWxxz_4FmHS5O_uKOs7kcFF5RbLuzrHaitsZSP81s94";
export const apis = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});
