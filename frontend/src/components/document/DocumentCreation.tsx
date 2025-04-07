import { useContext } from "react";
import { Plus } from "lucide-react";
import { ThemeContext } from "../../context/ThemeContext";

// Common CSS classes for theming
const getBgAndBorder = (darkMode: boolean) =>
  darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";

const DocumentCreation = () => {
  const { darkMode } = useContext(ThemeContext);
  const bgAndBorder = getBgAndBorder(darkMode);
  const textColor = darkMode ? "text-blue-400" : "text-blue-500";

  return (
    <div
      className={`cursor-pointer w-40 h-40 ${bgAndBorder} hover:border-blue-500 border rounded-lg mb-8 flex flex-col items-center justify-center transition-colors duration-200`}
    >
      <div className={`text-4xl mb-2 ${textColor}`}>
        <Plus />
      </div>
      <span className="text-sm">Create new document</span>
    </div>
  );
};

export default DocumentCreation;
