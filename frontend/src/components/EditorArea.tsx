import { useContext } from "react";
import { DocumentContext } from "../context/DocumentContext";

const EditorArea = () => {
  const context = useContext(DocumentContext);

  if (!context) {
    throw new Error("DocumentContext is not provided.");
  }

  const { currentDocument, updateContent } = context;

  if (!currentDocument) {
    return <div>No document selected</div>;
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-4 h-full relative">
      <textarea
        className="w-full h-full resize-none outline-none"
        placeholder="Start typing your document..."
        value={currentDocument.content}
        onChange={(e) => updateContent(e.target.value)}
      />
    </div>
  );
};

export default EditorArea;
