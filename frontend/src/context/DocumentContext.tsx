import {
  createContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import { getDocuments } from "../services/apis/documentApi";
import { websocketService } from "../services/websocket";
import { DocumentState, Image } from "../types/index";

interface DocumentContextType {
  documents: DocumentState[];
  currentDocument: DocumentState | null;
  filteredDocuments: DocumentState[];
  setFilteredDocuments: React.Dispatch<React.SetStateAction<DocumentState[]>>;
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
  setCurrentDocument: React.Dispatch<
    React.SetStateAction<DocumentState | null>
  >;
  connectAsGuest: (sharedId: string) => Promise<void>;
  isGuest: boolean;
  canEdit: boolean;
  addImage: (image: Image) => void;
  removeImage: (imageId: string) => void;
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
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentState[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        const documents = await getDocuments();
        console.log("Fetched documents:", documents);
        const formattedDocuments = documents.map((doc: any) => ({
          content: "",
          title: doc.title,
          saved: true,
          id: doc.id.toString(),
          last_update: doc.updated_at || "Just now",
          collaborators: doc.collaborators || [{ id: "1", name: "You" }],
          version: doc.version || 0,
          images: doc.images || [],
        }));
        setDocuments(formattedDocuments);

        if (formattedDocuments.length > 0) {
          const initialDocument = formattedDocuments[0];
          setCurrentDocument(initialDocument);

          // Connect to WebSocket and fetch the latest content
          websocketService.connectOwner(initialDocument.id);
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
    if (!currentDocument || isGuest) return; // Add isGuest check here

    websocketService.connectOwner(currentDocument.id);
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
  }, [currentDocument?.id, isGuest]); // Add isGuest to dependencies

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
      console.log(currentDocument);
      if (!currentDocument) return;
      console.log("Updating content:", currentDocument.version);
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
      setCurrentDocument({ ...currentDocument, title: name });

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

  const connectAsGuest = useCallback(async (sharedId: string) => {
    try {
      setIsLoading(true);
      websocketService.connectGuest(sharedId);
      setWsConnected(true);
      setIsGuest(true);

      return new Promise<void>((resolve, reject) => {
        const cleanup = websocketService.addMessageHandler((data) => {
          if (data.type === "INITIALIZE") {
            console.log("Guest connection initialized:", data);
            const documentData = data.document;

            // Determine if user can edit based on role/permissions from server
            const hasEditPermission = data.role === "Writer";
            console.log("User can edit:", hasEditPermission);
            setCanEdit(hasEditPermission);

            const guestDocument: DocumentState = {
              content: documentData.content || "",
              title: documentData.title || "Shared Document",
              saved: true,
              id: documentData.id.toString(),
              last_update: documentData.updated_at || "Just now",
              collaborators: documentData.collaborators || [
                { id: "guest", name: "Guest" },
              ],
              version: documentData.version || 0,
              images: documentData.images || [],
            };

            setCurrentDocument(guestDocument);

            // Add to documents list if not already there
            setDocuments((prev) => {
              if (!prev.some((doc) => doc.id === guestDocument.id)) {
                return [...prev, guestDocument];
              }
              return prev;
            });

            resolve();
          } else if (data.error) {
            console.error("Guest connection error:", data.error);
            setError(data.error);
            reject(new Error(data.error));
          }
        });

        // Set a timeout for the initialization
        const timeoutId = setTimeout(() => {
          cleanup();
          reject(new Error("Connection timeout"));
        }, 5000);

        // Cleanup function that will be returned
        const finalCleanup = () => {
          clearTimeout(timeoutId);
          cleanup();
        };

        // Keep track of the cleanup function
        return finalCleanup;
      });
    } catch (err) {
      console.error("Failed to connect as guest:", err);
      setError("Failed to connect to the shared document");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addImage = useCallback(
    (image: Image) => {
      if (!currentDocument) return;

      const updatedDocuments = documents.map((doc) =>
        doc.id === currentDocument.id
          ? { ...doc, images: [...doc.images, image] }
          : doc
      );

      setDocuments(updatedDocuments);
      setCurrentDocument({
        ...currentDocument,
        images: [...currentDocument.images, image],
      });

      if (wsConnected) {
        websocketService.send({
          type: "IMAGE_ADD",
          document_id: currentDocument.id,
          image,
          version: currentDocument.version,
        });
      }
    },
    [currentDocument, documents, wsConnected]
  );

  const removeImage = useCallback(
    (imageId: string) => {
      if (!currentDocument) return;

      const updatedDocuments = documents.map((doc) =>
        doc.id === currentDocument.id
          ? { ...doc, images: doc.images.filter((img) => img.id !== imageId) }
          : doc
      );

      setDocuments(updatedDocuments);
      setCurrentDocument({
        ...currentDocument,
        images: currentDocument.images.filter((img) => img.id !== imageId),
      });

      if (wsConnected) {
        websocketService.send({
          type: "IMAGE_REMOVE",
          document_id: currentDocument.id,
          imageId,
          version: currentDocument.version,
        });
      }
    },
    [currentDocument, documents, wsConnected]
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
        setCurrentDocument,
        wsConnected,
        handleUndo,
        handleredo,
        filteredDocuments,
        setFilteredDocuments,
        connectAsGuest,
        isGuest,
        canEdit,
        addImage,
        removeImage,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
};
