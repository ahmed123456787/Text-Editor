import { Share2, Save } from "lucide-react";
import { Collaborator } from "../types";
import { useContext } from "react";
import { DocumentContext } from "../context/DocumentContext";

interface TopToolbarProps {
  documentTitle: string;
  collaborators: Collaborator[];
}

const TopBar = ({ documentTitle, collaborators }: TopToolbarProps) => {
  const context = useContext(DocumentContext);

  if (!context) {
    throw new Error("DocumentContext is not provided.");
  }

  const { setName, setSaved } = context;

  const handleSave = () => {
    // In a real app, you'd save to server here
    setSaved(true);
  };

  return (
    <div className="bg-white border-b p-1 flex justify-between items-center">
      <div className="flex items-center">
        <input
          type="text"
          value={documentTitle}
          className="text-xl font-semibold bg-transparent outline-none"
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="flex items-center space-x-4">
        {/* Collaborator Avatars */}
        <div className="flex -space-x-2">
          {collaborators.map((collaborator) => (
            <div
              key={collaborator.id}
              className="w-4 h-4 rounded-full border-2 border-white"
              style={{
                backgroundColor: collaborator.color,
                boxShadow: "0 0 0 2px rgba(0,0,0,0.1)",
              }}
              title={collaborator.name}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button className="p-2 hover:bg-gray-100 rounded">
            <Share2 size={20} />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded"
            onClick={handleSave}
          >
            <Save size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
