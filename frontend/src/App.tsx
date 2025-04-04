import { BrowserRouter as Router, Routes, Route } from "react-router";
// import CollaborativeTextEditor from "./components/TextEditor";
import DocumentViewer from "./components/DocumentViewer";
import { DocumentProvider } from "./context/DocumentContext";
import ThemeProvider from "./context/ThemeContext";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route
            path="/"
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
    </ThemeProvider>
  );
}

export default App;
