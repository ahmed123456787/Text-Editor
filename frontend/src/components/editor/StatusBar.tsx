import { Clock } from "lucide-react";
import { useState, useEffect } from "react";

interface StatusBarProps {
  content: string | undefined;
  lastSaved: Date | null;
}

const StatusBar = ({ content, lastSaved }: StatusBarProps) => {
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    if (content) {
      setCharCount(content.length);
      // setWordCount(content.trim().split(/\s+/).filter(Boolean).length);
    } else {
      setCharCount(0);
      setWordCount(0);
    }
  }, [content]);
  const formatLastSaved = () => {
    if (!lastSaved) return "Never saved";
    console.log("lastSaved", lastSaved);
    const now = new Date();
    const diffMs = now.getTime() - lastSaved.getTime();
    const diffMins = Math.round(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins === 1) return "1 min ago";
    return `${diffMins} mins ago`;
  };
  return (
    <footer className="border-t p-2 flex items-center justify-between text-xs text-muted-foreground">
      <div className="flex items-center gap-2">
        <Clock className="h-3 w-3" />
        <span>Last saved: {formatLastSaved()}</span>
      </div>
      <div>
        Words: {wordCount} | Characters: {charCount}
      </div>
    </footer>
  );
};

export default StatusBar;
