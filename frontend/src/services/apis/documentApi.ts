import { apis } from "./init";

export type PermissionType = "read" | "write" | ["read", "write"];

export const getDocuments = async () => {
  const { data } = await apis.get("/documents");
  return data;
};

export const getDocumentAccessToken = async (
  documentId: string,
  permissions: PermissionType[]
) => {
  console.log(documentId, permissions);
  const { data } = await apis.post(`documents/shared/${documentId}/`, {
    permissions,
  });
  console.log(data);
  return data;
};
