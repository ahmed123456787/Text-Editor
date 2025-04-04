import {
  File,
  Search,
  HelpCircle,
  Settings,
  Bell,
  Moon,
  Sun,
} from "lucide-react";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext"; // Import ThemeContext

const Header = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext); // Consume ThemeContext

  return (
    <header
      className={`sticky top-0 z-10 ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } border-b px-4 py-2`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-xl font-medium">
            <File
              className={`mr-2 ${darkMode ? "text-blue-400" : "text-blue-600"}`}
            />
            <span className={darkMode ? "text-blue-400" : "text-blue-600"}>
              TextFlow
            </span>
          </div>

          <div
            className={`hidden md:flex items-center px-4 py-2 rounded-lg ${
              darkMode ? "bg-gray-700" : "bg-gray-100"
            } max-w-xl flex-grow`}
          >
            <Search className="h-5 w-5 text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search documents"
              className={`bg-transparent border-none focus:outline-none focus:ring-0 w-full ${
                darkMode ? "placeholder-gray-400" : "placeholder-gray-500"
              }`}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full hover:${
              darkMode ? "bg-gray-700" : "bg-gray-200"
            }`}
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
          <button
            className={`p-2 rounded-full hover:${
              darkMode ? "bg-gray-700" : "bg-gray-200"
            }`}
          >
            <HelpCircle className="h-5 w-5" />
          </button>
          <button
            className={`p-2 rounded-full hover:${
              darkMode ? "bg-gray-700" : "bg-gray-200"
            }`}
          >
            <Settings className="h-5 w-5" />
          </button>
          <button
            className={`p-2 rounded-full hover:${
              darkMode ? "bg-gray-700" : "bg-gray-200"
            }`}
          >
            <Bell className="h-5 w-5" />
          </button>
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center ${
              darkMode ? "bg-blue-600" : "bg-blue-500"
            } text-white font-medium`}
          >
            U
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
