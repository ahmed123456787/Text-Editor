import { apis } from "./init";

export const login = async (email: string, password: string) => {
  const { data } = await apis.post("token/", {
    email,
    password,
  });
  console.log("Login response:", data);
  return data;
};
