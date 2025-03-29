import { Clock } from "lucide-react";

interface BottomStatusBarProps {
  lastSaved: string;
  saved: boolean;
}

const BottomBar = ({ lastSaved, saved }: BottomStatusBarProps) => {
  const wordCount = 245;
  const charCount = 1320;

  return (
    <div className="bg-white border-t p-2 flex justify-between text-xs text-gray-600">
      <div className="flex items-center">
        <Clock size={14} className="mr-2" />
        {saved ? `Last saved: ${lastSaved}` : "Unsaved changes"}
      </div>
      <div>
        Words: {wordCount.toLocaleString()} | Characters:{" "}
        {charCount.toLocaleString()}
      </div>
    </div>
  );
};

export default BottomBar;
