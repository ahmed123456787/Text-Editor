import { createContext, ReactNode, useState } from "react";

interface DocumentState {
  content: string;
  name: string;
  saved: boolean;
  id: string;
  last_update: string;
}

interface DocumentContextType {
  documents: DocumentState[];
  setDocument: React.Dispatch<React.SetStateAction<DocumentState[]>>;
  updateContent: (content: string) => void;
  setName: (name: string) => void;
  setSaved: (saved: boolean) => void;
}

export const DocumentContext = createContext<DocumentContextType | undefined>(
  undefined
);

interface DocumentProviderProps {
  children: ReactNode;
}

// 4. Enhanced provider with better initialization
export const DocumentProvider = ({ children }: DocumentProviderProps) => {
  const [documents, setDocument] = useState<DocumentState[]>([
    {
      content: "Welcome to the Text Editor!",
      name: "Welcome Document",
      saved: true,
      last_update: "2 minutes ago",
      id: "1",
    },
    {
      content: "This is a sample document.",
      name: "Sample Document",
      saved: true,
      last_update: "5 minutes ago",
      id: "2",
    },
  ]);

  const updateContent = (content: string) => {
    setDocument((prev) => ({ ...prev, content, saved: false }));
  };

  const setName = (name: string) => {
    setDocument((prev) => ({ ...prev, name }));
  };

  const setSaved = (saved: boolean) => {
    setDocument((prev) => ({ ...prev, saved }));
  };

  // 5. Memoized context value
  const value = {
    documents: documents, // Initialize documents with the current document
    setDocument,
    updateContent,
    setName,
    setSaved,
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};
