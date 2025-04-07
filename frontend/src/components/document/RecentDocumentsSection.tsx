import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import DocumentCard from "./DocumentCard";
import { Document } from "../../types/index";

// Add DocumentListRow component
const DocumentListRow = ({ doc }: { doc: Document }) => {
  const { darkMode } = useContext(ThemeContext);
  const hoverBgColor = darkMode ? "hover:bg-gray-750" : "hover:bg-gray-50";

  return (
    <tr className={`${hoverBgColor} cursor-pointer`}>
      <td className="px-4 py-3">{doc.title}</td>
      <td className="px-4 py-3">{doc.lastEdited}</td>
      <td className="px-4 py-3">
        <div className="flex space-x-2">
          <button className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
            Open
          </button>
          <button className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
            Share
          </button>
        </div>
      </td>
    </tr>
  );
};

// Common CSS classes for theming
const getBgAndBorder = (darkMode: boolean) =>
  darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";

const getTextSecondary = (darkMode: boolean) =>
  darkMode ? "text-gray-400" : "text-gray-500";

interface RecentDocumentsSectionProps {
  viewMode: string;
  documents: Document[];
  recentDocuments: any[];
  isLoading?: boolean;
}

const RecentDocumentsSection = ({
  viewMode,
  documents,
  recentDocuments,
  isLoading = false,
}: RecentDocumentsSectionProps) => {
  const { darkMode } = useContext(ThemeContext);
  const textSecondary = getTextSecondary(darkMode);
  const bgAndBorder = getBgAndBorder(darkMode);
  const theadBgColor = darkMode
    ? "bg-gray-750 text-gray-300"
    : "bg-gray-50 text-gray-600";

  if (isLoading) {
    return (
      <div className={`py-8 text-center ${textSecondary}`}>
        Loading recent documents...
      </div>
    );
  }

  return (
    <section className="mb-10">
      <h2 className={`text-sm font-medium mb-4 ${textSecondary}`}>
        Recent documents
      </h2>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {documents && documents.length > 0 ? (
            documents.map((doc) => <DocumentCard key={doc.id} doc={doc} />)
          ) : (
            <div className={`col-span-full py-8 text-center ${textSecondary}`}>
              No recent documents found
            </div>
          )}
        </div>
      ) : (
        <div className={`${bgAndBorder} border rounded-lg overflow-hidden`}>
          <table className="w-full">
            <thead className={`text-xs ${theadBgColor}`}>
              <tr>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">
                  Last modified
                </th>
                <th className="text-left px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentDocuments && recentDocuments.length > 0 ? (
                recentDocuments.map((doc) => (
                  <DocumentListRow key={doc.id} doc={doc} />
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className={`px-4 py-6 text-center ${textSecondary}`}
                  >
                    No recent documents found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default RecentDocumentsSection;
