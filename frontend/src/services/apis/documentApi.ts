import { apis } from "./init";
export type PermissionType = "read" | "write" | ["read", "write"];

export const getDocuments = async () => {
  const { data } = await apis.get("/documents");
  console.log("Documents", data);
  return data;
};

export const getDocumentAccessToken = async (
  documentId: string,
  permissions: PermissionType[]
) => {
  const { data } = await apis.post(`documents/shared/${documentId}/`, {
    permissions,
  });
  console.log(data.token);
  return data.token;
};
