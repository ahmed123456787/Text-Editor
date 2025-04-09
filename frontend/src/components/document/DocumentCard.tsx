import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { File } from "lucide-react";
import { DocumentState } from "../../types/index";
import { useNavigate } from "react-router";
import { DocumentContext } from "../../context/DocumentContext";

interface DocumentCardProps {
  doc: DocumentState;
}

const DocumentCard = ({ doc }: DocumentCardProps) => {
  const { darkMode } = useContext(ThemeContext);
  const context = useContext(DocumentContext);
  const navigate = useNavigate();

  if (!context) {
    throw new Error("DocumentContext is not provided.");
  }
  const { setCurrentDocument } = context;
  console.log(doc, "def");
  // Create a theme class mapping object to avoid direct conditionals in JSX
  const theme = {
    card: darkMode
      ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
      : "bg-white border-gray-200 hover:bg-gray-50",
    preview: darkMode ? "bg-gray-700" : "bg-gray-100",
    metadata: darkMode ? "text-gray-400" : "text-gray-500",
  };

  return (
    <div
      key={doc.id}
      className={`${theme.card} border rounded-lg overflow-hidden cursor-pointer transition-colors duration-200`}
      onClick={() => {
        // Navigate to the document editor
        setCurrentDocument(doc);
        navigate(`/document/${doc.id}`);
      }}
    >
      <div className={`h-32 ${theme.preview} flex items-center justify-center`}>
        <img
          src="/api/placeholder/200/120"
          alt="Document preview"
          className="max-h-full"
        />
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="font-medium truncate">{doc.title}</div>
        </div>
        <div className={`text-xs mt-1 flex items-center ${theme.metadata}`}>
          <File className="h-3 w-3 mr-1" />
          <span>Edited {doc.last_update}</span>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
