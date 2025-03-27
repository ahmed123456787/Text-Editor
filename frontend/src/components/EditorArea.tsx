const EditorArea = () => {
  return (
    <div className="bg-white shadow-sm rounded-lg p-4 h-full relative">
      {/* Fake Editor Content */}
      <textarea
        className="w-full h-full resize-none outline-none"
        placeholder="Start typing your document..."
      />
    </div>
  );
};

export default EditorArea;
