import { createContext, ReactNode, useState } from "react";

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
  currentDocument: DocumentState;
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
  const [documents, setDocuments] = useState<DocumentState[]>([
    {
      content: "Welcome to the Text Editor!",
      name: "Welcome Document",
      saved: true,
      last_update: "2 minutes ago",
      id: "1",
      collaborators: [{ id: "1", name: "Alice" }],
    },
    {
      content: "This is a sample document.",
      name: "Sample Document",
      saved: true,
      last_update: "5 minutes ago",
      id: "2",
      collaborators: [{ id: "2", name: "Bob" }],
    },
  ]);

  // Track the currently selected document (default to first document)
  const [currentDocument, setCurrentDocument] = useState<DocumentState>(
    documents[0]
  );

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
