import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { Clock, Users } from "lucide-react";
import DocumentTable, {
  getTextSecondary,
  getBgAndBorder,
} from "./DocumentTable";
import DocumentListRow from "./DocumentListRow";

interface SharedWithMeSectionProps {
  viewMode: string;
  sharedDocuments: any[];
}

const SharedDocument = ({
  viewMode,
  sharedDocuments,
}: SharedWithMeSectionProps) => {
  const { darkMode } = useContext(ThemeContext);
  const textSecondary = getTextSecondary(darkMode);
  const bgAndBorder = getBgAndBorder(darkMode);
  const cardBgColor = darkMode ? "bg-gray-700" : "bg-gray-100";
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
        <DocumentTable
          headers={["Name", "Owner", "Shared", "Actions"]}
          data={sharedDocuments}
          renderRow={(doc) => (
            <DocumentListRow
              item={doc}
              columns={[
                { key: "title" },
                { key: "owner" },
                { key: "sharedAt" },
              ]}
              actions={
                <button className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                  View
                </button>
              }
            />
          )}
          emptyMessage="No shared documents found"
        />
      )}
    </section>
  );
};

export default SharedDocument;
