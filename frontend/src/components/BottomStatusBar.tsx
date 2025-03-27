import { Clock } from "lucide-react";

const BottomStatusBar = () => {
  return (
    <div className="bg-white border-t p-2 flex justify-between text-xs text-gray-600">
      <div className="flex items-center">
        <Clock size={14} className="mr-2" />
        Last saved: 2 minutes ago
      </div>
      <div>Words: 245 | Characters: 1,320</div>
    </div>
  );
};

export default BottomStatusBar;
