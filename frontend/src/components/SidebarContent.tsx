import { useContext, useState } from "react";
import { File, Menu } from "lucide-react";
import { DocumentContext } from "../context/DocumentContext";

interface SidebarContentProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const SidebarContent = ({ isOpen, toggleSidebar }: SidebarContentProps) => {
  const context = useContext(DocumentContext);

  if (!context) {
    throw new Error("DocumentContext is not provided.");
  }

  const { documents } = context;
  return (
    <>
      <div className="flex items-center justify-between p-4">
        {isOpen && <h2 className="text-lg ">Documents</h2>}
        <button onClick={toggleSidebar} className="p-2">
          <Menu className="w-4 h-4" />
        </button>
      </div>

      <nav className="mt-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
          >
            <File className="mr-2" size={20} />
            {isOpen && (
              <div className="flex-1">
                <div className="text-sm font-medium">{doc.name}</div>
                <div className="text-xs text-gray-500">{doc.last_update}</div>
              </div>
            )}
          </div>
        ))}
      </nav>
    </>
  );
};

export default SidebarContent;
