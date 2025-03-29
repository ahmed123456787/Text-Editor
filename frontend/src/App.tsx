import CollaborativeTextEditor from "./components/TextEditor.tsx";
import { DocumentProvider } from "./context/DocumentContext.tsx";

function App() {
  return (
    <DocumentProvider>
      <CollaborativeTextEditor />
    </DocumentProvider>
  );
}

export default App;
