import React from "react";

const Footer = () => {
  return (
    <footer
      className={`py-4 px-6 ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } border-t text-xs`}
    >
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div
          className={`mb-4 md:mb-0 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          © 2025 TextFlow. All rights reserved.
        </div>
        <div className="flex space-x-6">
          <a
            href="#"
            className={`${
              darkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Privacy
          </a>
          <a
            href="#"
            className={`${
              darkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Terms
          </a>
          <a
            href="#"
            className={`${
              darkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Help
          </a>
          <a
            href="#"
            className={`${
              darkMode
                ? "text-gray-400 hover:text-gray-300"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Feedback
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
