import { BrowserRouter as Router, Routes, Route } from "react-router";
import DocumentViewer from "./components/DocumentViewer";
import { DocumentProvider } from "./context/DocumentContext";
import ThemeProvider from "./context/ThemeContext";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { useContext, useEffect } from "react";
import { ThemeContext } from "./context/ThemeContext";

const AppRoutes = () => {
  const { darkMode } = useContext(ThemeContext);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/home"
          element={
            <DocumentProvider>
              <HomePage />
            </DocumentProvider>
          }
        />
        <Route
          path="/document/:id"
          element={
            <DocumentProvider>
              <DocumentViewer />
            </DocumentProvider>
          }
        />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
