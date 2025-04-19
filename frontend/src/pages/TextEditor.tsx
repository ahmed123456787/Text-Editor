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

  const [content, setContent] = useState("");
  const [lastSaved] = useState<Date | null>(null);
  const [isStarred, setIsStarred] = useState(false);
  const [showCollaborators, setShowCollaborators] = useState(true);
  const editorRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef(content);
  const isLocalUpdate = useRef(false);

  // Update the content ref when the state changes
  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  // Initial document content setup
  useEffect(() => {
    if (currentDocument && currentDocument.content) {
      // Get the content string, handling different formats
      const documentContent =
        typeof currentDocument.content === "string"
          ? currentDocument.content
          : currentDocument.content.content || "";

      // Only update if content has actually changed and it's not a local update
      if (!isLocalUpdate.current && documentContent !== contentRef.current) {
        setContent(documentContent);

        // Update editor DOM content if needed
        if (editorRef.current) {
          const selection = window.getSelection();
          const hadFocus = document.activeElement === editorRef.current;

          // Save cursor position if we have a selection
          let savedRange = null;
          if (selection && selection.rangeCount > 0) {
            savedRange = selection.getRangeAt(0).cloneRange();
          }

          // Update content
          editorRef.current.innerText = documentContent;

          // Restore focus and cursor position
          if (hadFocus && savedRange) {
            editorRef.current.focus();
            try {
              // Create a new range within the valid text nodes
              const newRange = document.createRange();
              const textNode =
                editorRef.current.firstChild || editorRef.current;

              // Calculate safe positions
              const safeStart = Math.min(
                savedRange.startOffset,
                documentContent.length
              );
              const safeEnd = Math.min(
                savedRange.endOffset,
                documentContent.length
              );

              newRange.setStart(textNode, safeStart);
              newRange.setEnd(textNode, safeEnd);

              // Apply selection
              const currentSelection = window.getSelection();
              if (currentSelection) {
                currentSelection.removeAllRanges();
                currentSelection.addRange(newRange);
              }
            } catch (e) {
              console.log("Error restoring cursor:", e);
            }
          }
        }
      }

      // Reset the local update flag
      isLocalUpdate.current = false;
    }
  }, [currentDocument]);

  // Event handlers
  useEffect(() => {
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
  }, [currentDocument, wsConnected, handleUndo, handleredo]);

  const handleContentChange = useCallback(
    (e: React.FormEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement;
      const newContent = target.innerText;

      // Set flag to indicate this is a local update
      isLocalUpdate.current = true;

      setContent(newContent);

      if (currentDocument) {
        updateContent(newContent);
      }
    },
    [currentDocument, updateContent]
  );

  // If no document is selected, show a message
  if (!currentDocument) {
    return <p>No document selected</p>;
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navigation Bar */}
      <Header
        document={currentDocument}
        isStarred={isStarred}
        setDocumentTitle={(title) => {
          currentDocument.title = title;
          setContent(title);
        }}
        setIsStarred={setIsStarred}
      />
      {/* Toolbar */}
      <TopBar />
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto">
          <div className="max-w-8xl mx-auto p-8 min-h-full">
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
