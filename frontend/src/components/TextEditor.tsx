import { useState, useContext } from "react";
import SidebarContent from "./SidebarContent";
import TopBar from "./TopBar";
import EditorArea from "./EditorArea";
import CollaborationPanel from "./CollaboratorPanel";
import BottomBar from "./BottomBar";
import { DocumentContext } from "../context/DocumentContext";
import { Collaborator } from "../types";
import Loading from "./Loading";
import Eror from "./Eror";

const CollaborativeTextEditor = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const context = useContext(DocumentContext);

  if (!context) {
    throw new Error("DocumentContext is not provided.");
  }

  const { currentDocument, isLoading, error } = context;

  // If no document is selected, show a default state
  if (!currentDocument) {
    return (
      <div className="flex h-screen items-center justify-center">
        No document selected
      </div>
    );
  }

  if (!context) {
    return <div>Context not available</div>;
  }

  if (isLoading) <Loading />;

  if (error) <Eror error={error} />;

  if (!currentDocument) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No documents available</p>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Create New Document
          </button>
        </div>
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
        <TopBar documentTitle={currentDocument.name} />

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
        <BottomBar
          lastSaved={currentDocument.last_update}
          saved={currentDocument.saved}
        />
      </div>
    </div>
  );
};

export default CollaborativeTextEditor;
