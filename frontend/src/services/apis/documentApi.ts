import { apis } from "./init";

export const getDocuments = async () => {
  const { data } = await apis.get("/documents");
  return data; 
};
