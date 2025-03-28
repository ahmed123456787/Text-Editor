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

function EditorWithWebSocket() {
  const context = useContext(DocumentContext);

  if (!context) {
    return <div>Context not available</div>;
  }

  const { currentDocument, isLoading, error } = context;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading documents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center p-6 bg-red-50 rounded-lg">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!currentDocument) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No documents available</p>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Create New Document
          </button>
        </div>
      </div>
    );
  }

  return (
    <WebSocketIntegration documentId={currentDocument.id}>
      <CollaborativeTextEditor />
    </WebSocketIntegration>
  );
}

export default App;
