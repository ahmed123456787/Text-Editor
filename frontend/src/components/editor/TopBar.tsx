import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link,
  ImageIcon,
  MoreVertical,
  ChevronDown,
} from "lucide-react";
import { useState, useRef, useContext, useEffect } from "react";
import { DocumentContext } from "@/context/DocumentContext";
import { v4 as uuidv4 } from "uuid";
import ReactDOM from "react-dom/client";

interface ImageProps {
  id: string;
  url: string;
  alt: string;
  onDelete: (id: string) => void;
}

const ImageComponent = ({ id, url, alt, onDelete }: ImageProps) => {
  const [dimensions, setDimensions] = useState({
    width: "100%",
    height: "auto",
  });
  const [isResizing, setIsResizing] = useState(false);
  const startDimensions = useRef({ width: 0, height: 0 });
  const startPosition = useRef({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startPosition.current = { x: e.clientX, y: e.clientY };
    if (imageRef.current) {
      startDimensions.current = {
        width: imageRef.current.offsetWidth,
        height: imageRef.current.offsetHeight,
      };
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;

    const deltaX = e.clientX - startPosition.current.x;
    const deltaY = e.clientY - startPosition.current.y;

    const newWidth = Math.max(50, startDimensions.current.width + deltaX);
    const newHeight = Math.max(50, startDimensions.current.height + deltaY);

    setDimensions({
      width: `${newWidth}px`,
      height: `${newHeight}px`,
    });
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  // Add and remove document-level event listeners
  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div className="relative inline-block my-4 group hover:outline hover:outline-2 hover:outline-dashed hover:outline-blue-500">
      <img
        ref={imageRef}
        src={url}
        alt={alt}
        className="max-w-full h-auto block select-none cursor-move"
        style={{ width: dimensions.width, height: dimensions.height }}
      />
      <button
        onClick={() => onDelete(id)}
        className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer border-none flex items-center justify-center hover:bg-red-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 6h18"></path>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
        </svg>
      </button>
      <div
        className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full z-10"
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};

const TopBar = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const context = useContext(DocumentContext);
  const { addImage, removeImage } = context || {};

  const formatText = (command: string, value = "") => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      if (!addImage) return;

      const imageUrl = URL.createObjectURL(file);
      const imageId = uuidv4();

      // Add image to context
      addImage({
        id: imageId,
        url: imageUrl,
        alt: file.name,
      });

      // Create a temporary div to hold the image component
      const tempDiv = document.createElement("div");
      tempDiv.className = "image-container";

      // Get the editor element
      const editor = document.querySelector('[contenteditable="true"]');
      if (!editor) return;

      // Insert at cursor position or at the end
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.insertNode(tempDiv);
      } else {
        editor.appendChild(tempDiv);
      }

      // Add a line break after the image
      const br = document.createElement("br");
      tempDiv.parentNode?.insertBefore(br, tempDiv.nextSibling);

      // Render the React component into the temporary div
      const root = ReactDOM.createRoot(tempDiv);
      root.render(
        <ImageComponent
          id={imageId}
          url={imageUrl}
          alt={file.name}
          onDelete={(id) => {
            if (removeImage) {
              removeImage(id);
              tempDiv.remove();
            }
          }}
        />
      );
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="border-b p-1 flex items-center flex-wrap gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1">
            Normal text
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Normal text</DropdownMenuItem>
          <DropdownMenuItem>Heading 1</DropdownMenuItem>
          <DropdownMenuItem>Heading 2</DropdownMenuItem>
          <DropdownMenuItem>Heading 3</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="h-6" />

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => formatText("bold")}
            >
              <Bold className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Bold (Ctrl+B)</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => formatText("italic")}
            >
              <Italic className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Italic (Ctrl+I)</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => formatText("underline")}
            >
              <Underline className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Underline (Ctrl+U)</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Separator orientation="vertical" className="h-6" />

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => formatText("justifyLeft")}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align left</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => formatText("justifyCenter")}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align center</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => formatText("justifyRight")}
            >
              <AlignRight className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Align right</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Separator orientation="vertical" className="h-6" />

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => formatText("insertUnorderedList")}
            >
              <List className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Bullet list</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => formatText("insertOrderedList")}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Numbered list</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Separator orientation="vertical" className="h-6" />

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const url = prompt("Enter link URL:");
                if (url) formatText("createLink", url);
              }}
            >
              <Link className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Insert link</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleImageUpload(file);
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <ImageIcon className="h-4 w-4 pointer-events-none" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Insert image</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Button variant="ghost" size="icon">
        <MoreVertical className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default TopBar;
