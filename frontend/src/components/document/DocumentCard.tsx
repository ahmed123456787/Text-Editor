import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { File, Star } from "lucide-react";
import { Document } from "../../types/index";
interface DocumentCardProps {
  doc: Document;
}

const DocumentCard = ({ doc }: DocumentCardProps) => {
  const { darkMode } = useContext(ThemeContext);

  // Create a theme class mapping object to avoid direct conditionals in JSX
  const theme = {
    card: darkMode
      ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
      : "bg-white border-gray-200 hover:bg-gray-50",
    preview: darkMode ? "bg-gray-700" : "bg-gray-100",
    star: doc.starred
      ? darkMode
        ? "text-yellow-300"
        : "text-yellow-500"
      : "text-gray-400",
    metadata: darkMode ? "text-gray-400" : "text-gray-500",
  };

  return (
    <div
      key={doc.id}
      className={`${theme.card} border rounded-lg overflow-hidden cursor-pointer transition-colors duration-200`}
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
          <button className={`p-1 rounded-full ${theme.star}`}>
            <Star
              className="h-4 w-4"
              fill={doc?.starred ? "currentColor" : "none"}
            />
          </button>
        </div>
        <div className={`text-xs mt-1 flex items-center ${theme.metadata}`}>
          <File className="h-3 w-3 mr-1" />
          <span>Edited {doc.last_updated}</span>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
