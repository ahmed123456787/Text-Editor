import { Share2, Save, Check } from "lucide-react";
import { useContext, useState } from "react";
import { DocumentContext } from "../context/DocumentContext";
import { getDocumentAccessToken } from "../services/apis/documentApi";
import { PermissionType } from "../services/apis/documentApi";
interface TopToolbarProps {
  documentTitle: string;
}

const TopBar = ({ documentTitle }: TopToolbarProps) => {
  const context = useContext(DocumentContext);
  const [showSaveText, setShowSaveText] = useState(false);
  const [showShareBox, setShowShareBox] = useState(false);
  const [permissions, setPermissions] = useState<PermissionType[]>(["read"]);
  const [copied, setCopied] = useState(false);

  if (!context) {
    throw new Error("DocumentContext is not provided.");
  }

  const { setName, setSaved } = context;

  const handleSave = () => {
    setSaved(true);
    setShowSaveText(true);
    setTimeout(() => setShowSaveText(false), 2000);
  };

  const togglePermission = (perm: string) => {
    setPermissions((prev) =>
      prev.includes(perm as PermissionType)
        ? prev.filter((p) => p !== perm)
        : [...prev, perm as PermissionType]
    );
  };

  const handleShare = async () => {
    if (permissions.length === 0) return;
    try {
      const { token } = await getDocumentAccessToken(
        context.currentDocument?.id ?? "",
        permissions
      );
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to retrieve document access URL", error);
    }
  };

  return (
    <div className="bg-white border-b pl-4 p-1 flex justify-between items-center relative">
      <div className="flex items-center">
        <input
          type="text"
          value={documentTitle}
          className="text-xl font-semibold bg-transparent outline-none"
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          {/* Share Button */}
          <button
            className="p-2 hover:bg-gray-100 rounded relative"
            onClick={() => setShowShareBox(!showShareBox)}
          >
            <Share2 size={20} />
          </button>
          {/* Share Options Popup */}
          {showShareBox && (
            <div className="absolute right-10 top-10 bg-white border shadow-md p-4 rounded w-48 z-10">
              <p className="text-sm font-semibold mb-2">Share Options</p>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={permissions.includes("read")}
                  onChange={() => togglePermission("read")}
                />
                <span>Read</span>
              </label>
              <label className="flex items-center space-x-2 mt-2">
                <input
                  type="checkbox"
                  checked={permissions.includes("write")}
                  onChange={() => togglePermission("write")}
                />
                <span>Write</span>
              </label>
              <button
                className="mt-3 bg-blue-500 text-white px-3 py-1 rounded w-full"
                onClick={handleShare}
              >
                Get Access Link
              </button>
              {copied && (
                <div className="text-green-500 text-sm mt-2 flex items-center">
                  <Check size={16} className="mr-1" /> Link copied!
                </div>
              )}
            </div>
          )}

          {/* Save Button */}
          <button
            className="p-2 hover:bg-gray-100 rounded"
            onClick={handleSave}
          >
            <Save size={20} />
            {showSaveText ? (
              <span className="text-green-500">Saved</span>
            ) : (
              <span className="text-gray-500">Unsaved</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
