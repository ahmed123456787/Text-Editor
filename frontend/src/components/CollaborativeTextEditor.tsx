import { useState, useContext } from "react";
import SidebarContent from "./SidebarContent";
import TopToolbar from "./TopToolbar";
import EditorArea from "./EditorArea";
import CollaborationPanel from "./CollaboratorPanel";
import BottomStatusBar from "./BottomStatusBar";
import { DocumentContext } from "../context/DocumentContext";
import { Collaborator } from "../types";

const CollaborativeTextEditor = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const context = useContext(DocumentContext);

  if (!context) {
    throw new Error("DocumentContext is not provided.");
  }

  const { currentDocument } = context;

  // If no document is selected, show a default state
  if (!currentDocument) {
    return (
      <div className="flex h-screen items-center justify-center">
        No document selected
      </div>
    );
  }

  // Convert document collaborators to the expected format
  const collaborators: Collaborator[] = currentDocument.collaborators.map(
    (collab) => ({
      id: parseInt(collab.id),
      name: collab.name,
      color: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"][
        parseInt(collab.id) % 4
      ], // Assign a color based on ID
      cursor: { x: 0, y: 0 }, // Default cursor position
    })
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`
        ${isSidebarOpen ? "w-44" : "w-16"} 
        bg-white border-r transition-all duration-300 ease-in-out
      `}
      >
        <SidebarContent
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <TopToolbar
          documentTitle={currentDocument.name}
          collaborators={collaborators}
        />

        {/* Editor and Collaboration Panel */}
        <div className="flex flex-1">
          {/* Text Editor */}
          <div className="flex-1 p-4 relative">
            <EditorArea />
          </div>

          {/* Collaboration Panel */}
          <CollaborationPanel collaborators={collaborators} />
        </div>

        {/* Bottom Status Bar */}
        <BottomStatusBar
          lastSaved={currentDocument.last_update}
          saved={currentDocument.saved}
        />
      </div>
    </div>
  );
};

export default CollaborativeTextEditor;
