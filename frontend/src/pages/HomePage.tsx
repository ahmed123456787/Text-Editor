import { useEffect, useState, useContext } from "react";
import Header from "../components/home/Header";
import Footer from "../components/home/Footer";
import { ThemeContext } from "../context/ThemeContext";
import { getDocuments } from "../services/apis/documentApi";
import DocumentCreation from "../components/document/DocumentCreation";
import DocumentHeader from "../components/document/DocumentHeader";
import RecentDocuments from "../components/document/RecentDocument";
import SharedDocument from "../components/document/SharedDocument";
import { DocumentState } from "../types/index";

export default function HomePage() {
  const [viewMode, setViewMode] = useState("grid");
  const { darkMode } = useContext(ThemeContext);
  const [documents, setDocuments] = useState<DocumentState[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic classes based on dark mode state
  const mainBg = darkMode ? "bg-gray-900" : "bg-gray-50";
  const textColor = darkMode ? "text-gray-100" : "text-gray-900";

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        const documents = await getDocuments();
        setDocuments(documents);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const sharedDocuments = [
    { id: 6, title: "Team Budget", sharedAt: "Mar 30", owner: "Sarah K." },
    { id: 7, title: "Project Timeline", sharedAt: "Mar 18", owner: "Mike T." },
    { id: 8, title: "Research Notes", sharedAt: "Mar 10", owner: "Alex D." },
  ];

  return (
    <div className={`min-h-screen flex flex-col ${mainBg} ${textColor}`}>
      {/* Header */}
      <Header documents={documents} />
      {/* Main content */}
      <main className="flex-grow px-4 py-6 max-w-6xl mx-auto w-full">
        <DocumentHeader viewMode={viewMode} setViewMode={setViewMode} />
        <DocumentCreation />
        <RecentDocuments viewMode={viewMode} isLoading={isLoading} />
        <SharedDocument viewMode={viewMode} sharedDocuments={sharedDocuments} />
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
}
