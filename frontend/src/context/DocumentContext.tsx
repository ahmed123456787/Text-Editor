import {
  createContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import { getDocuments } from "../services/apis/documentApi";
import { websocketService } from "../services/websocket";

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
  isLoading: boolean;
  error: string | null;
  setDocuments: React.Dispatch<React.SetStateAction<DocumentState[]>>;
  updateContent: (content: string) => void;
  setName: (name: string) => void;
  setSaved: (saved: boolean) => void;
  selectDocument: (id: string) => void;
  wsConnected: boolean;
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
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        const data = await getDocuments();

        const formattedDocuments = data.map((doc: any) => ({
          content: doc.content || "",
          name: doc.title,
          saved: true,
          id: doc.id.toString(),
          last_update: doc.updated_at || "Just now",
          collaborators: doc.collaborators || [{ id: "1", name: "You" }],
        }));

        setDocuments(formattedDocuments);

        if (formattedDocuments.length > 0) {
          setCurrentDocument(formattedDocuments[0]);
        }
      } catch (err) {
        console.error("Failed to fetch documents:", err);
        setError("Failed to load documents. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  useEffect(() => {
    if (!currentDocument) return;

    websocketService.connect(currentDocument.id);
    setWsConnected(true);

    const cleanup = websocketService.addMessageHandler((data) => {
      console.log("WebSocket message received:", data);
      if (data.type === "UPDATE") {
        console.log("hello", data.document.content);
        const updatedContent = data.document.content;
        setDocuments((prevDocs) =>
          prevDocs.map((doc) =>
            doc.id === currentDocument.id
              ? { ...doc, content: updatedContent }
              : doc
          )
        );

        setCurrentDocument((prevDoc) =>
          prevDoc ? { ...prevDoc, content: updatedContent } : null
        );
      }
    });

    return () => {
      cleanup();
      websocketService.disconnect();
      setWsConnected(false);
    };
  }, [currentDocument?.id]);

  const selectDocument = useCallback(
    (id: string) => {
      console.log("Selecting document with ID:", id);
      const selected = documents.find((doc) => doc.id === id);
      if (selected) {
        if (currentDocument && currentDocument.id !== id) {
          websocketService.disconnect();
          setWsConnected(false);
        }

        setCurrentDocument(selected);
      }
    },
    [documents, currentDocument]
  );

  const updateContent = useCallback(
    (content: string) => {
      if (!currentDocument) return;

      const updatedDocuments = documents.map((doc) =>
        doc.id === currentDocument.id ? { ...doc, content, saved: false } : doc
      );

      setDocuments(updatedDocuments);
      setCurrentDocument({ ...currentDocument, content, saved: false });

      if (wsConnected) {
        websocketService.send({
          type: "UPDATE",
          document_id: currentDocument.id,
          content: content,
        });
      }
    },
    [currentDocument, documents, wsConnected]
  );

  const setName = useCallback(
    (name: string) => {
      if (!currentDocument) return;

      const updatedDocuments = documents.map((doc) =>
        doc.id === currentDocument.id ? { ...doc, name } : doc
      );

      setDocuments(updatedDocuments);
      setCurrentDocument({ ...currentDocument, name });

      if (wsConnected) {
        websocketService.send({
          type: "name_update",
          document_id: currentDocument.id,
          name: name,
        });
      }
    },
    [currentDocument, documents, wsConnected]
  );

  const setSaved = useCallback(
    (saved: boolean) => {
      if (!currentDocument) return;

      const updatedDocuments = documents.map((doc) =>
        doc.id === currentDocument.id ? { ...doc, saved } : doc
      );

      setDocuments(updatedDocuments);
      setCurrentDocument({ ...currentDocument, saved });
    },
    [currentDocument, documents]
  );

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
        wsConnected,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};
