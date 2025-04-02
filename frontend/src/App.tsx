import { BrowserRouter as Router, Routes, Route } from "react-router";
import CollaborativeTextEditor from "./components/TextEditor";
import DocumentViewer from "./components/DocumentViewer";
import { DocumentProvider } from "./context/DocumentContext";
function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <DocumentProvider>
              <CollaborativeTextEditor />
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
}

export default App;
