import { createContext, ReactNode, useState, useEffect } from "react";
import { getDocuments } from "../services/apis/documentApi";

interface Collaborator {
  id: string;
  name: string;
}

interface DocumentState {
  content: string;
  name: string;
  saved: boolean;
  id: string;
  last_update: string;
  collaborators: Collaborator[];
}

interface DocumentContextType {
  documents: DocumentState[];
  currentDocument: DocumentState | null;
  isLoading: boolean; // Add loading state
  error: string | null; // Add error state
  setDocuments: React.Dispatch<React.SetStateAction<DocumentState[]>>;
  updateContent: (content: string) => void;
  setName: (name: string) => void;
  setSaved: (saved: boolean) => void;
  selectDocument: (id: string) => void;
}

export const DocumentContext = createContext<DocumentContextType | undefined>(
  undefined
);

interface DocumentProviderProps {
  children: ReactNode;
}

export const DocumentProvider = ({ children }: DocumentProviderProps) => {
  const [documents, setDocuments] = useState<DocumentState[]>([]);
  const [currentDocument, setCurrentDocument] = useState<DocumentState | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch documents on component mount
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        const data = await getDocuments();

        // Map API data to our document state structure
        const formattedDocuments = data.map((doc: any) => ({
          content: doc.content || "",
          name: doc.title,
          saved: true,
          id: doc.id.toString(),
          last_update: doc.updated_at || "Just now",
          collaborators: doc.collaborators || [{ id: "1", name: "You" }],
        }));

        setDocuments(formattedDocuments);

        // Set the first document as current if available
        if (formattedDocuments.length > 0) {
          setCurrentDocument(formattedDocuments[0]);
        }
      } catch (err) {
        console.error("Failed to fetch documents:", err);
        setError("Failed to load documents. Please try again later.");

        // Fallback to sample documents if API fails
        const sampleDocuments = [
          {
            content: "Welcome to the Text Editor!",
            name: "Welcome Document",
            saved: true,
            last_update: "2 minutes ago",
            id: "1",
            collaborators: [{ id: "1", name: "You" }],
          },
          {
            content: "This is a sample document.",
            name: "Sample Document",
            saved: true,
            last_update: "5 minutes ago",
            id: "2",
            collaborators: [{ id: "2", name: "Bob" }],
          },
        ];

        setDocuments(sampleDocuments);
        setCurrentDocument(sampleDocuments[0]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  // Select a document by ID
  const selectDocument = (id: string) => {
    console.log("Selecting document with ID:", id);
    const selected = documents.find((doc) => doc.id === id);
    if (selected) {
      setCurrentDocument(selected);
    }
  };

  const updateContent = (content: string) => {
    if (!currentDocument) return;

    const updatedDocuments = documents.map((doc) =>
      doc.id === currentDocument.id ? { ...doc, content, saved: false } : doc
    );

    setDocuments(updatedDocuments);
    setCurrentDocument({ ...currentDocument, content, saved: false });
  };

  const setName = (name: string) => {
    if (!currentDocument) return;

    // Update the name of the current document
    const updatedDocuments = documents.map((doc) =>
      doc.id === currentDocument.id ? { ...doc, name } : doc
    );

    setDocuments(updatedDocuments);
    setCurrentDocument({ ...currentDocument, name });
  };

  const setSaved = (saved: boolean) => {
    if (!currentDocument) return;

    // Update the saved status of the current document
    const updatedDocuments = documents.map((doc) =>
      doc.id === currentDocument.id ? { ...doc, saved } : doc
    );

    setDocuments(updatedDocuments);
    setCurrentDocument({ ...currentDocument, saved });
  };

  return (
    <DocumentContext.Provider
      value={{
        documents,
        currentDocument,
        isLoading,
        error,
        setDocuments,
        updateContent,
        setName,
        setSaved,
        selectDocument,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};
