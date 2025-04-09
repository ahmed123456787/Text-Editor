import { useState, useContext, useEffect, useRef, useCallback } from "react";
import { ChevronDown, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Header from "../components/editor/Header";
import TopBar from "../components/editor/TopBar";
import StatusBar from "../components/editor/StatusBar";
import { DocumentContext } from "../context/DocumentContext";

export default function TextEditor() {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error("DocumentContext is not provided.");
  }
  const {
    currentDocument,
    updateContent,
    handleUndo,
    handleredo,
    wsConnected,
  } = context;
  console.log("currentDocument", currentDocument);
  const [content, setContent] = useState("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isStarred, setIsStarred] = useState(false);
  const [showCollaborators, setShowCollaborators] = useState(true);
  const editorRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef(content); // Ref to track content without causing re-renders

  // Update the content ref when the state changes
  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  // Set initial content from document
  useEffect(() => {
    if (currentDocument && currentDocument.content !== contentRef.current) {
      setContent(currentDocument.content);

      // Update editor content if needed
      if (
        editorRef.current &&
        editorRef.current.innerText !== currentDocument.content
      ) {
        editorRef.current.innerText = currentDocument.content;
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        if (wsConnected && currentDocument) {
          handleUndo();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        if (wsConnected && currentDocument) {
          handleredo();
        }
      }
    };
    const textarea = editorRef.current;
    if (textarea) {
      textarea.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (textarea) {
        textarea.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [currentDocument]);

  // Separate effect for auto-save to prevent content dependency issues
  // useEffect(() => {
  //   const saveInterval = setInterval(() => {
  //     if (contentRef.current) {
  //       setLastSaved(new Date());
  //       // Here you would actually save the document
  //     }
  //   }, 5000);

  //   return () => clearInterval(saveInterval);
  // }, []); // No dependencies to prevent re-renders

  const handleContentChange = useCallback(
    (e: React.FormEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement;
      console.log("target", target.innerHTML);
      setContent(target.innerText);
      updateContent(target.innerText);
    },
    []
  );

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navigation Bar */}
      {currentDocument && (
        <Header
          document={currentDocument}
          isStarred={isStarred}
          setDocumentTitle={(title) => {
            currentDocument.title = title;
            setContent(title);
          }}
          setIsStarred={setIsStarred}
        />
      )}
      {/* Toolbar */}
      <TopBar />
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto">
          <div className="max-w-3xl mx-auto p-8 min-h-full">
            <div
              ref={editorRef}
              contentEditable
              className="outline-none min-h-[calc(100vh-200px)]"
              onInput={handleContentChange}
              suppressContentEditableWarning={true}
            />
          </div>
        </div>

        {/* Collaborators Sidebar */}
        {showCollaborators && (
          <div className="w-64 border-l">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Collaborators
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setShowCollaborators(false)}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="default"
                className="w-full mb-4 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Invite Collaborators
              </Button>

              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    No collaborators yet
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <StatusBar content={content} lastSaved={lastSaved} />
    </div>
  );
}
