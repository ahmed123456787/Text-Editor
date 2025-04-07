import { useEffect, useState, useContext } from "react";
import Header from "../components/home/Header";
import Footer from "../components/home/Footer";
import { ThemeContext } from "../context/ThemeContext";
import { getDocuments } from "../services/apis/documentApi";
import { Document } from "../types/index";
import DocumentCreation from "../components/document/DocumentCreation";
import DocumentHeader from "../components/document/DocumentHeader";
import RecentDocumentsSection from "../components/document/RecentDocumentsSection";
import DocumentShared from "../components/document/DocumentShared";

export default function HomePage() {
  const [viewMode, setViewMode] = useState("grid");
  const { darkMode } = useContext(ThemeContext);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic classes based on dark mode state
  const mainBg = darkMode ? "bg-gray-900" : "bg-gray-50";
  const textColor = darkMode ? "text-gray-100" : "text-gray-900";

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        const response = await getDocuments();
        setDocuments(response.data);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const recentDocuments = [
    { id: 1, title: "Project Proposal", editedAt: "Apr 2", starred: true },
    { id: 2, title: "Meeting Notes", editedAt: "Apr 1", starred: false },
    { id: 3, title: "Quarterly Report", editedAt: "Mar 28", starred: false },
    { id: 4, title: "Marketing Strategy", editedAt: "Mar 25", starred: true },
    { id: 5, title: "Product Roadmap", editedAt: "Mar 22", starred: false },
  ];

  const sharedDocuments = [
    { id: 6, title: "Team Budget", sharedAt: "Mar 30", owner: "Sarah K." },
    { id: 7, title: "Project Timeline", sharedAt: "Mar 18", owner: "Mike T." },
    { id: 8, title: "Research Notes", sharedAt: "Mar 10", owner: "Alex D." },
  ];

  return (
    <div className={`min-h-screen flex flex-col ${mainBg} ${textColor}`}>
      {/* Header */}
      <Header />
      {/* Main content */}
      <main className="flex-grow px-4 py-6 max-w-6xl mx-auto w-full">
        <DocumentHeader viewMode={viewMode} setViewMode={setViewMode} />
        <DocumentCreation />
        <RecentDocumentsSection
          viewMode={viewMode}
          documents={documents}
          recentDocuments={recentDocuments}
          isLoading={isLoading}
        />
        <DocumentShared viewMode={viewMode} sharedDocuments={sharedDocuments} />
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
}
