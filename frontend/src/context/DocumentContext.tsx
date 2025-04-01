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
  version: number; // Add version tracking
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
  handleUndo: () => void;
  handleredo: () => void;
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
        console.log("Fetched documents:", data);
        const formattedDocuments = data.map((doc: any) => ({
          content: "",
          name: doc.title,
          saved: true,
          id: doc.id.toString(),
          last_update: doc.updated_at || "Just now",
          collaborators: doc.collaborators || [{ id: "1", name: "You" }],
          version: doc.version || 0, // Initialize version
        }));
        console.log("Formatted documents:", formattedDocuments);
        setDocuments(formattedDocuments);

        if (formattedDocuments.length > 0) {
          const initialDocument = formattedDocuments[0];
          setCurrentDocument(initialDocument);

          // Connect to WebSocket and fetch the latest content
          websocketService.connect(initialDocument.id);
          setWsConnected(true);

          const cleanup = websocketService.addMessageHandler((data) => {
            if (data.type == "INITIALIZE") {
              const updatedContent = data.document.content;
              setDocuments((prevDocs) =>
                prevDocs.map((doc) =>
                  doc.id === initialDocument.id
                    ? {
                        ...doc,
                        content: updatedContent,
                      }
                    : doc
                )
              );

              setCurrentDocument((prevDoc) =>
                prevDoc
                  ? {
                      ...prevDoc,
                      content: updatedContent,
                    }
                  : null
              );
            }
            if (
              data.type === "UPDATE" &&
              data.document.id === initialDocument.id
            ) {
              console.log(
                "WebSocket initial content received:",
                data.document.content
              );
              const updatedContent = data.document.content;
              const updatedVersion =
                data.document.version || initialDocument.version;

              setDocuments((prevDocs) =>
                prevDocs.map((doc) =>
                  doc.id === initialDocument.id
                    ? {
                        ...doc,
                        content: updatedContent,
                        version: updatedVersion,
                      }
                    : doc
                )
              );

              setCurrentDocument((prevDoc) =>
                prevDoc
                  ? {
                      ...prevDoc,
                      content: updatedContent,
                      version: updatedVersion,
                    }
                  : null
              );
            }
          });

          return () => {
            cleanup();
            websocketService.disconnect();
            setWsConnected(false);
          };
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
    const updateDocuments = (updateContent: any, updatedVersion: any) => {
      setDocuments((prevDocs) =>
        prevDocs.map((doc) =>
          doc.id === currentDocument.id
            ? { ...doc, content: updateContent, version: updatedVersion }
            : doc
        )
      );

      setCurrentDocument((prevDoc) =>
        prevDoc
          ? { ...prevDoc, content: updateContent, version: updatedVersion }
          : null
      );
    };
    const cleanup = websocketService.addMessageHandler((data) => {
      console.log("WebSocket message received:", data);
      if (data.type === "UPDATE") {
        console.log("hello", data.document.content);
        const updatedContent = data.document.content;
        const updatedVersion = data.document.version || currentDocument.version;
        updateDocuments(updatedContent, updatedVersion);
      }
      if (data.type == "UNDO") {
        console.log("Undo request received");
        const updatedContent = data.document.content;
        const updatedVersion = data.document.version || currentDocument.version;
        updateDocuments(updatedContent, updatedVersion);
      }
      if (data.type == "REDO") {
        console.log("Redo request received");
        const updatedContent = data.document.content;
        const updatedVersion = data.document.version || currentDocument.version;

        updateDocuments(updatedContent, updatedVersion);
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

      const newVersion = currentDocument.version + 1;

      const updatedDocuments = documents.map((doc) =>
        doc.id === currentDocument.id
          ? { ...doc, content, saved: false, version: newVersion }
          : doc
      );

      setDocuments(updatedDocuments);
      setCurrentDocument({
        ...currentDocument,
        content,
        saved: false,
        version: newVersion,
      });

      if (wsConnected) {
        websocketService.send({
          type: "UPDATE",
          document_id: currentDocument.id,
          content: content,
          version: newVersion, // Send the new version
        });
      }
    },
    [currentDocument, documents, wsConnected]
  );

  const handleUndo = useCallback(() => {
    if (!currentDocument || !wsConnected || currentDocument.version <= 0)
      return;

    websocketService.send({
      type: "UNDO",
      document_id: currentDocument.id,
      content: currentDocument.content,
      version: currentDocument.version, // Explicitly send the previous version number
    });

    console.log(`Requesting undo to version ${currentDocument.version - 1}`);
  }, [currentDocument, wsConnected]);

  const handleredo = useCallback(() => {
    if (!currentDocument || !wsConnected) return;

    websocketService.send({
      type: "REDO",
      document_id: currentDocument.id,
      content: currentDocument.content,
      version: currentDocument.version, // Explicitly send the previous version number
    });

    console.log(`Requesting redo to version ${currentDocument.version + 1}`);
  }, [currentDocument, documents, wsConnected]);

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
          version: currentDocument.version, // Send the current version
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
        handleUndo,
        handleredo,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};
