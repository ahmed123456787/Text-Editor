import { useEffect, useContext, useState, useCallback } from "react";
import { useParams } from "react-router";
import { DocumentContext } from "../context/DocumentContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

const TextViewer = () => {
  const { sharedId } = useParams<{ sharedId: string }>();
  const context = useContext(DocumentContext);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (!context) {
    throw new Error("DocumentContext is not provided");
  }

  const {
    // connectAsGuest,
    currentDocument,
    wsConnected,
    // isGuest,
    // canEdit,
    updateContent,
  } = context;

  useEffect(() => {
    if (!sharedId) {
      setError("Invalid shared link");
      setIsLoading(false);
      return;
    }

    const initializeGuestSession = async () => {
      try {
        await connectAsGuest(sharedId);
      } catch (err) {
        console.error("Failed to connect as guest:", err);
        setError("Failed to load the shared document");
      } finally {
        setIsLoading(false);
      }
    };

    initializeGuestSession();

    return () => {
      // Cleanup will be handled by the cleanup function from connectAsGuest
    };
  }, [sharedId, connectAsGuest]);

  const handleContentChange = useCallback(
    (e: React.FormEvent<HTMLDivElement>) => {
      if (!canEdit) return;

      const target = e.target as HTMLDivElement;
      updateContent(target.innerText);
    },
    [canEdit, updateContent]
  );

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2 text-lg">Loading shared document...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500">Error</h2>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!currentDocument || !wsConnected) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>
          Unable to load the document. Please check your link and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Simple header */}
      <div className="border-b p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">
          {currentDocument?.title || "Shared Document"}
        </h1>
        <div className="text-sm text-muted-foreground">
          {canEdit ? "You can edit this document" : "Read-only mode"}
        </div>
      </div>

      {/* Document content */}
      <ScrollArea className="flex-1">
        <div className="max-w-3xl mx-auto p-8">
          {canEdit ? (
            <div
              contentEditable
              className="outline-none min-h-[calc(100vh-200px)]"
              suppressContentEditableWarning={true}
              onInput={handleContentChange}
            >
              {currentDocument?.content}
            </div>
          ) : (
            <div className="prose max-w-none">
              {currentDocument?.content.split("\n").map((line, i) => (
                <p key={i}>{line || <br />}</p>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Simple footer */}
      <div className="border-t p-2 text-xs text-muted-foreground">
        <p>
          Shared document •{" "}
          {isGuest ? "Viewing as guest" : "Authenticated user"} • Last updated:{" "}
          {currentDocument?.last_update}
        </p>
      </div>
    </div>
  );
};

export default TextViewer;
