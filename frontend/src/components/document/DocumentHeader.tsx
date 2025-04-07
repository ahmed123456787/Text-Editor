import { useContext } from "react";
import { Grid, List, ChevronDown } from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

interface DocumentListHeaderProps {
  viewMode: string;
  setViewMode: (mode: string) => void;
}

const DocumentHeader = ({ viewMode, setViewMode }: DocumentListHeaderProps) => {
  const { darkMode } = useContext(ThemeContext);
  const bgColorGrid =
    viewMode === "grid" ? (darkMode ? "bg-gray-700" : "bg-gray-200") : "";
  const bgColorList =
    viewMode === "list" ? (darkMode ? "bg-gray-700" : "bg-gray-200") : "";
  const bgSortButton = darkMode
    ? "bg-gray-800 hover:bg-gray-700"
    : "bg-gray-200 hover:bg-gray-300";

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-xl font-medium">My documents</h1>
      <div className="flex space-x-2">
        <button
          onClick={() => setViewMode("grid")}
          className={`p-2 rounded ${bgColorGrid}`}
        >
          <Grid className="h-5 w-5" />
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={`p-2 rounded ${bgColorList}`}
        >
          <List className="h-5 w-5" />
        </button>
        <div className="relative">
          <button
            className={`px-4 py-2 rounded flex items-center ${bgSortButton}`}
          >
            <span className="mr-2">Sort</span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentHeader;
