import CollaborativeTextEditor from "./components/CollaborativeTextEditor";
import { DocumentProvider } from "./context/DocumentContext.tsx";
import WebSocketIntegration from "./components/WebSocketIntegration.tsx";
import { DocumentContext } from "./context/DocumentContext.tsx";
import { useContext } from "react";

function App() {
  return (
    <DocumentProvider>
      <EditorWithWebSocket />
    </DocumentProvider>
  );
}

// This component only runs after DocumentProvider is available
function EditorWithWebSocket() {
  const context = useContext(DocumentContext);

  if (!context) {
    return <div>Context not available</div>;
  }

  const { currentDocument } = context;

  if (!currentDocument) {
    return <div>No document selected</div>;
  }

  return (
    <WebSocketIntegration documentId={currentDocument.id}>
      <CollaborativeTextEditor />
    </WebSocketIntegration>
  );
}

export default App;
