import { useContext, useEffect, useRef } from "react";
import { DocumentContext } from "../context/DocumentContext";

const EditorArea = () => {
  const context = useContext(DocumentContext);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  if (!context) {
    throw new Error("DocumentContext is not provided.");
  }

  const {
    currentDocument,
    updateContent,
    handleUndo,
    wsConnected,
    handleredo,
  } = context;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        if (wsConnected && currentDocument) {
          handleUndo();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        if (wsConnected && currentDocument) {
          handleredo();
        }
      }
    };

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (textarea) {
        textarea.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [currentDocument, wsConnected, handleUndo]);

  if (!currentDocument) {
    return <div>No document selected</div>;
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-4 h-full relative">
      <textarea
        ref={textareaRef}
        className="w-full h-full resize-none outline-none"
        placeholder="Start typing your document..."
        value={currentDocument.content}
        onChange={(e) => updateContent(e.target.value)}
      />
    </div>
  );
};

export default EditorArea;
