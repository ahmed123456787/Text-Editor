import { useEffect, useContext } from "react";
import { useParams, useSearchParams } from "react-router";
import { DocumentContext } from "../context/DocumentContext";
import EditorArea from "./EditorArea";

const DocumentViewer = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const context = useContext(DocumentContext);

  if (!context) {
    throw new Error("DocumentContext is not provided.");
  }

  const { selectDocument, currentDocument } = context;
  const permission = searchParams.get("permission");

  useEffect(() => {
    if (id) {
      selectDocument(id);
    }
  }, [id, selectDocument]);

  if (!currentDocument) {
    return <div>Loading document...</div>;
  }

  return (
    <div className="h-screen bg-gray-100">
      {permission === "write" ? (
        <EditorArea />
      ) : (
        <div className="p-4">
          <h1 className="text-xl font-bold">{currentDocument.name}</h1>
          <p>{currentDocument.content}</p>
        </div>
      )}
    </div>
  );
};

export default DocumentViewer;
