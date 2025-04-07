import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { Clock, Users } from "lucide-react";

// Common CSS classes for theming
const getBgAndBorder = (darkMode: boolean) =>
  darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";

const getTextSecondary = (darkMode: boolean) =>
  darkMode ? "text-gray-400" : "text-gray-500";

interface SharedWithMeSectionProps {
  viewMode: string;
  sharedDocuments: any[];
}

// Create a DocumentListRow component for shared documents
interface Document {
  id: string;
  title: string;
  owner: string;
  sharedAt: string;
}

const DocumentListRow = ({ doc }: { doc: Document }) => {
  const { darkMode } = useContext(ThemeContext);
  const hoverBgColor = darkMode ? "hover:bg-gray-750" : "hover:bg-gray-50";

  return (
    <tr className={`${hoverBgColor} cursor-pointer`}>
      <td className="px-4 py-3">{doc.title}</td>
      <td className="px-4 py-3">{doc.owner}</td>
      <td className="px-4 py-3">{doc.sharedAt}</td>
      <td className="px-4 py-3">
        <div className="flex space-x-2">
          <button className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
            View
          </button>
        </div>
      </td>
    </tr>
  );
};

const DocumentShared = ({
  viewMode,
  sharedDocuments,
}: SharedWithMeSectionProps) => {
  const { darkMode } = useContext(ThemeContext);
  const textSecondary = getTextSecondary(darkMode);
  const bgAndBorder = getBgAndBorder(darkMode);
  const cardBgColor = darkMode ? "bg-gray-700" : "bg-gray-100";
  const theadBgColor = darkMode
    ? "bg-gray-750 text-gray-300"
    : "bg-gray-50 text-gray-600";
  const tbodyHoverBgColor = darkMode ? "bg-gray-750" : "bg-gray-50";

  if (!sharedDocuments || sharedDocuments.length === 0) {
    return null;
  }

  return (
    <section className="mb-10">
      <h2 className={`text-sm font-medium mb-4 ${textSecondary}`}>
        Shared with me
      </h2>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {sharedDocuments.map((doc) => (
            <div
              key={doc.id}
              className={`${bgAndBorder} hover:${tbodyHoverBgColor} border rounded-lg overflow-hidden cursor-pointer transition-colors duration-200`}
            >
              <div
                className={`h-32 ${cardBgColor} flex items-center justify-center`}
              >
                <img
                  src="/api/placeholder/200/120"
                  alt="Document preview"
                  className="max-h-full"
                />
              </div>
              <div className="p-3">
                <div className="font-medium truncate">{doc.title}</div>
                <div
                  className={`text-xs mt-1 flex items-center justify-between ${textSecondary}`}
                >
                  <div className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    <span>From {doc.owner}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{doc.sharedAt}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`${bgAndBorder} border rounded-lg overflow-hidden`}>
          <table className="w-full">
            <thead className={`text-xs ${theadBgColor}`}>
              <tr>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Owner</th>
                <th className="text-left px-4 py-3 font-medium">Shared</th>
                <th className="text-left px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sharedDocuments.map((doc) => (
                <DocumentListRow key={doc.id} doc={doc} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default DocumentShared;
