import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { DocumentContext } from "../../context/DocumentContext";
import DocumentCard from "./DocumentCard";
import DocumentTable, { getTextSecondary } from "./DocumentTable";
import DocumentListRow from "./DocumentListRow";

interface RecentDocumentsSectionProps {
  viewMode: string;
  isLoading?: boolean;
}

const RecentDocuments = ({
  viewMode,
  isLoading = false,
}: RecentDocumentsSectionProps) => {
  const { darkMode } = useContext(ThemeContext);
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error("RecentDocuments must be used within a DocumentProvider");
  }
  const { documents, filteredDocuments } = context;
  const textSecondary = getTextSecondary(darkMode);

  // Use filteredDocuments if they exist, otherwise fall back to regular documents
  const displayDocuments =
    filteredDocuments && filteredDocuments.length > 0
      ? filteredDocuments
      : documents;

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
          {displayDocuments && displayDocuments.length > 0 ? (
            displayDocuments.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} />
            ))
          ) : (
            <div className={`col-span-full py-8 text-center ${textSecondary}`}>
              No recent documents found
            </div>
          )}
        </div>
      ) : (
        <DocumentTable
          headers={["Name", "Last modified", "Actions"]}
          data={displayDocuments}
          renderRow={(doc) => (
            <DocumentListRow
              item={doc}
              columns={[{ key: "title" }, { key: "last_updated" }]}
              actions={
                <>
                  <button className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                    Open
                  </button>
                  <button className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                    Share
                  </button>
                </>
              }
            />
          )}
          emptyMessage="No recent documents found"
        />
      )}
    </section>
  );
};

export default RecentDocuments;
