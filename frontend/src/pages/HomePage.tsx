import { useState, useEffect } from "react";
import {
  Grid,
  List,
  Plus,
  File,
  ChevronDown,
  Star,
  Users,
  Clock,
  Share,
} from "lucide-react";
import Header from "../components/home/Header";
import Footer from "../components/home/Footer";
export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    // Check for user's preferred color scheme
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Sample document data
  const recentDocuments = [
    { id: 1, title: "Project Proposal", editedAt: "Apr 2", starred: true },
    { id: 2, title: "Meeting Notes", editedAt: "Apr 1", starred: false },
    { id: 3, title: "Quarterly Report", editedAt: "Mar 28", starred: false },
    { id: 4, title: "Marketing Strategy", editedAt: "Mar 25", starred: true },
    { id: 5, title: "Product Roadmap", editedAt: "Mar 22", starred: false },
  ];

  const sharedDocuments = [
    { id: 6, title: "Team Budget", sharedAt: "Mar 30", owner: "Sarah K." },
    { id: 7, title: "Project Timeline", sharedAt: "Mar 18", owner: "Mike T." },
    { id: 8, title: "Research Notes", sharedAt: "Mar 10", owner: "Alex D." },
  ];

  const allDocuments = [
    ...recentDocuments.map((doc) => ({ ...doc, type: "owned" })),
    ...sharedDocuments.map((doc) => ({ ...doc, type: "shared" })),
  ];

  return (
    <div
      className={`min-h-screen flex flex-col ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      {/* Main content */}
      <main className="flex-grow px-4 py-6 max-w-6xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-medium">My documents</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${
                viewMode === "grid"
                  ? darkMode
                    ? "bg-gray-700"
                    : "bg-gray-200"
                  : ""
              }`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded ${
                viewMode === "list"
                  ? darkMode
                    ? "bg-gray-700"
                    : "bg-gray-200"
                  : ""
              }`}
            >
              <List className="h-5 w-5" />
            </button>
            <div className="relative">
              <button
                className={`px-4 py-2 rounded flex items-center ${
                  darkMode
                    ? "bg-gray-800 hover:bg-gray-700"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                <span className="mr-2">Sort</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Create new document button */}
        <div
          className={`cursor-pointer w-40 h-40 ${
            darkMode
              ? "bg-gray-800 border-gray-700 hover:border-blue-500"
              : "bg-white border-gray-300 hover:border-blue-500"
          } border rounded-lg mb-8 flex flex-col items-center justify-center transition-colors duration-200`}
        >
          <div
            className={`text-4xl mb-2 ${
              darkMode ? "text-blue-400" : "text-blue-500"
            }`}
          >
            <Plus />
          </div>
          <span className="text-sm">Create new document</span>
        </div>

        {/* Recent documents */}
        <section className="mb-10">
          <h2
            className={`text-sm font-medium mb-4 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Recent documents
          </h2>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recentDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className={`${
                    darkMode
                      ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  } border rounded-lg overflow-hidden cursor-pointer transition-colors duration-200`}
                >
                  <div
                    className={`h-32 ${
                      darkMode ? "bg-gray-700" : "bg-gray-100"
                    } flex items-center justify-center`}
                  >
                    <img
                      src="/api/placeholder/200/120"
                      alt="Document preview"
                      className="max-h-full"
                    />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium truncate">{doc.title}</div>
                      <button
                        className={`p-1 rounded-full ${
                          doc.starred
                            ? darkMode
                              ? "text-yellow-300"
                              : "text-yellow-500"
                            : "text-gray-400"
                        }`}
                      >
                        <Star
                          className="h-4 w-4"
                          fill={doc.starred ? "currentColor" : "none"}
                        />
                      </button>
                    </div>
                    <div
                      className={`text-xs mt-1 flex items-center ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      <File className="h-3 w-3 mr-1" />
                      <span>Edited {doc.editedAt}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } border rounded-lg overflow-hidden`}
            >
              <table className="w-full">
                <thead
                  className={`text-xs ${
                    darkMode
                      ? "bg-gray-750 text-gray-300"
                      : "bg-gray-50 text-gray-600"
                  }`}
                >
                  <tr>
                    <th className="text-left px-4 py-3 font-medium">Name</th>
                    <th className="text-left px-4 py-3 font-medium">
                      Last modified
                    </th>
                    <th className="text-left px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentDocuments.map((doc) => (
                    <tr
                      key={doc.id}
                      className={`hover:${
                        darkMode ? "bg-gray-750" : "bg-gray-50"
                      } cursor-pointer`}
                    >
                      <td className="px-4 py-3 flex items-center">
                        <File
                          className={`h-4 w-4 mr-3 ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        />
                        <span className="font-medium">{doc.title}</span>
                      </td>
                      <td
                        className={`px-4 py-3 text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {doc.editedAt}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button
                            className={`p-1 rounded-full hover:${
                              darkMode ? "bg-gray-700" : "bg-gray-200"
                            }`}
                          >
                            <Star
                              className={`h-4 w-4 ${
                                doc.starred
                                  ? darkMode
                                    ? "text-yellow-300"
                                    : "text-yellow-500"
                                  : "text-gray-400"
                              }`}
                              fill={doc.starred ? "currentColor" : "none"}
                            />
                          </button>
                          <button
                            className={`p-1 rounded-full hover:${
                              darkMode ? "bg-gray-700" : "bg-gray-200"
                            }`}
                          >
                            <Share className="h-4 w-4 text-gray-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Shared with me */}
        <section className="mb-10">
          <h2
            className={`text-sm font-medium mb-4 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Shared with me
          </h2>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sharedDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className={`${
                    darkMode
                      ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  } border rounded-lg overflow-hidden cursor-pointer transition-colors duration-200`}
                >
                  <div
                    className={`h-32 ${
                      darkMode ? "bg-gray-700" : "bg-gray-100"
                    } flex items-center justify-center`}
                  >
                    <img
                      src="/api/placeholder/200/120"
                      alt="Document preview"
                      className="max-h-full"
                    />
                  </div>
                  <div className="p-3">
                    <div className="font-medium truncate">{doc.title}</div>
                    <div
                      className={`text-xs mt-1 flex items-center justify-between ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        <span>From {doc.owner}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{doc.sharedAt}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } border rounded-lg overflow-hidden`}
            >
              <table className="w-full">
                <thead
                  className={`text-xs ${
                    darkMode
                      ? "bg-gray-750 text-gray-300"
                      : "bg-gray-50 text-gray-600"
                  }`}
                >
                  <tr>
                    <th className="text-left px-4 py-3 font-medium">Name</th>
                    <th className="text-left px-4 py-3 font-medium">Owner</th>
                    <th className="text-left px-4 py-3 font-medium">Shared</th>
                    <th className="text-left px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sharedDocuments.map((doc) => (
                    <tr
                      key={doc.id}
                      className={`hover:${
                        darkMode ? "bg-gray-750" : "bg-gray-50"
                      } cursor-pointer`}
                    >
                      <td className="px-4 py-3 flex items-center">
                        <File
                          className={`h-4 w-4 mr-3 ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        />
                        <span className="font-medium">{doc.title}</span>
                      </td>
                      <td
                        className={`px-4 py-3 text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {doc.owner}
                      </td>
                      <td
                        className={`px-4 py-3 text-sm ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {doc.sharedAt}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          className={`p-1 rounded-full hover:${
                            darkMode ? "bg-gray-700" : "bg-gray-200"
                          }`}
                        >
                          <Share className="h-4 w-4 text-gray-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
}
