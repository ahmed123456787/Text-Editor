import { useContext } from "react";
import { Link } from "react-router";
import { ThemeContext } from "../context/ThemeContext";

export default function LandingPage() {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-[#111827] text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Header */}
      <header
        className={`${
          darkMode ? "border-b border-gray-800" : "border-b border-gray-200"
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg
              className={`h-6 w-6 ${
                darkMode ? "text-blue-500" : "text-blue-600"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span
              className={`text-xl font-semibold ${
                darkMode ? "text-blue-500" : "text-blue-600"
              }`}
            >
              TextFlow
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${
                darkMode
                  ? "text-gray-300 hover:bg-gray-800"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {darkMode ? (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
            <Link to="/login">
              <button
                className={`px-4 py-2 rounded-md ${
                  darkMode
                    ? "text-gray-300 hover:text-white hover:bg-gray-800"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                Log in
              </button>
            </Link>
            <Link to="/signup">
              <button
                className={`px-4 py-2 rounded-md ${
                  darkMode
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                Sign up
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-10 lg:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Create, Edit, Collaborate
              </h1>
              <p
                className={`text-xl mb-8 max-w-lg ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                TextFlow is a powerful text editor designed for learning and
                collaboration. Create documents, share ideas, and work together
                in real-time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <button
                    className={`px-8 py-3 rounded-md text-lg font-medium ${
                      darkMode
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    Get Started Free
                  </button>
                </Link>
                <Link to="/demo">
                  <button
                    className={`px-8 py-3 rounded-md text-lg font-medium ${
                      darkMode
                        ? "border border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    See Demo
                  </button>
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div
                className={`relative rounded-lg overflow-hidden shadow-2xl ${
                  darkMode ? "border border-gray-800" : "border border-gray-200"
                }`}
              >
                <img
                  src="https://placehold.co/800x600/1a2234/FFFFFF/png?text=TextFlow+Editor+Interface"
                  alt="TextFlow Editor Interface"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-20 ${darkMode ? "bg-[#0f1623]" : "bg-gray-50"}`}>
        <div className="container mx-auto px-4">
          <h2
            className={`text-3xl font-bold text-center mb-16 ${
              darkMode ? "" : ""
            }`}
          >
            Everything you need in a text editor
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div
              className={`p-6 rounded-lg ${
                darkMode ? "bg-[#1a2234]" : "bg-white shadow-md"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                  darkMode ? "bg-blue-600/20" : "bg-blue-100"
                }`}
              >
                <svg
                  className={`h-6 w-6 ${
                    darkMode ? "text-blue-500" : "text-blue-600"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Rich Text Editing</h3>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Format your documents with a wide range of styling options and
                tools.
              </p>
            </div>

            <div
              className={`p-6 rounded-lg ${
                darkMode ? "bg-[#1a2234]" : "bg-white shadow-md"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                  darkMode ? "bg-blue-600/20" : "bg-blue-100"
                }`}
              >
                <svg
                  className={`h-6 w-6 ${
                    darkMode ? "text-blue-500" : "text-blue-600"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">
                Real-time Collaboration
              </h3>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Work together with your team in real-time, seeing changes as
                they happen.
              </p>
            </div>

            <div
              className={`p-6 rounded-lg ${
                darkMode ? "bg-[#1a2234]" : "bg-white shadow-md"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                  darkMode ? "bg-blue-600/20" : "bg-blue-100"
                }`}
              >
                <svg
                  className={`h-6 w-6 ${
                    darkMode ? "text-blue-500" : "text-blue-600"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Version History</h3>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Track changes and revert to previous versions of your documents
                at any time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
          <p
            className={`text-xl mb-8 max-w-2xl mx-auto ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Join thousands of students and professionals who use TextFlow for
            their document editing needs.
          </p>
          <Link to="/signup">
            <button
              className={`px-8 py-3 rounded-md text-lg font-medium ${
                darkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Create Free Account
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 ${darkMode ? "bg-[#0a0f18]" : "bg-gray-100"}`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center space-x-2 mb-4">
                <svg
                  className={`h-6 w-6 ${
                    darkMode ? "text-blue-500" : "text-blue-600"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span
                  className={`text-xl font-semibold ${
                    darkMode ? "text-blue-500" : "text-blue-600"
                  }`}
                >
                  TextFlow
                </span>
              </div>
              <p
                className={`max-w-xs ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                A powerful text editor designed for learning and collaboration.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3
                  className={`text-lg font-medium mb-4 ${darkMode ? "" : ""}`}
                >
                  Product
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className={`${
                        darkMode
                          ? "text-gray-400 hover:text-white"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className={`${
                        darkMode
                          ? "text-gray-400 hover:text-white"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className={`${
                        darkMode
                          ? "text-gray-400 hover:text-white"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Tutorials
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3
                  className={`text-lg font-medium mb-4 ${darkMode ? "" : ""}`}
                >
                  Company
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className={`${
                        darkMode
                          ? "text-gray-400 hover:text-white"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      About
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className={`${
                        darkMode
                          ? "text-gray-400 hover:text-white"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className={`${
                        darkMode
                          ? "text-gray-400 hover:text-white"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Careers
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3
                  className={`text-lg font-medium mb-4 ${darkMode ? "" : ""}`}
                >
                  Legal
                </h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className={`${
                        darkMode
                          ? "text-gray-400 hover:text-white"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className={`${
                        darkMode
                          ? "text-gray-400 hover:text-white"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Terms
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className={`${
                        darkMode
                          ? "text-gray-400 hover:text-white"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Security
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div
            className={`border-t mt-12 pt-8 text-center ${
              darkMode
                ? "border-gray-800 text-gray-500"
                : "border-gray-200 text-gray-500"
            }`}
          >
            <p>
              &copy; {new Date().getFullYear()} TextFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
