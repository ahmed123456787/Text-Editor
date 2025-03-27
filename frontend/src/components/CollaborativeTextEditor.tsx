import { useState } from "react";
import SidebarContent from "./SidebarContent";
import TopToolbar from "./TopToolbar";
import EditorArea from "./EditorArea";
import CollaborationPanel from "./CollaborationPanel";
import BottomStatusBar from "./BottomStatusBar";
import { Collaborator } from "../types";

const CollaborativeTextEditor = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    { id: 1, name: "Alice", color: "#3B82F6", cursor: { x: 100, y: 200 } },
    { id: 2, name: "Bob", color: "#10B981", cursor: { x: 150, y: 250 } },
  ]);

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
          documentTitle="Untitled Document"
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
        <BottomStatusBar />
      </div>
    </div>
  );
};

export default CollaborativeTextEditor;
