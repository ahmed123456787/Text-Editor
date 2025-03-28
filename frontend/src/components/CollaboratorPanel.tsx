import { Users } from "lucide-react";
import { Collaborator } from "../types";
import { useContext } from "react";
import { DocumentContext } from "../context/DocumentContext";

interface CollaborationPanelProps {
  collaborators: Collaborator[];
}

const CollaborationPanel = ({ collaborators }: CollaborationPanelProps) => {
  const documents = useContext(DocumentContext);

  console.log(documents);
  return (
    <div className="w-40 bg-gray-50 border-l p-4">
      <div className="flex items-center mb-4">
        <Users className="mr-2" />
        <h3 className="font-semibold">Collaborators</h3>
      </div>

      {collaborators.map((collaborator) => (
        <div key={collaborator.id} className="flex items-center mb-2">
          <div
            className="w-6 h-6 rounded-full mr-2"
            style={{ backgroundColor: collaborator.color }}
          />
          <div>
            <div className="font-medium text-sm">{collaborator.name}</div>
            <div className="text-xs text-gray-500">Online</div>
          </div>
        </div>
      ))}

      <div className="mt-4">
        <button className=" bg-blue-500 text-white p-2 rounded hover:bg-blue-600 text-xs">
          Invite Collaborators
        </button>
      </div>
    </div>
  );
};

export default CollaborationPanel;
