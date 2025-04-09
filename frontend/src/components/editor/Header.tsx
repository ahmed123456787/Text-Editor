import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Clock, Save, Share, Star, StarOff, FileText } from "lucide-react";

interface HeaderProps {
  documentTitle: string | undefined;
  isStarred: boolean;
  setDocumentTitle: (title: string) => void;
  setIsStarred: (starred: boolean) => void;
}

const Header = ({
  documentTitle,
  isStarred,
  setDocumentTitle,
  setIsStarred,
}: HeaderProps) => {
  return (
    <header className="flex items-center justify-between border-b p-2">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 flex items-center justify-center">
          <FileText className="text-blue-600" />
        </div>
        <div className="flex flex-col">
          <Input
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            className="h-7 border-0 p-0 text-lg font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => setIsStarred(!isStarred)}
            >
              {isStarred ? (
                <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" />
              ) : (
                <StarOff className="h-4 w-4 mr-1" />
              )}
              {isStarred ? "Starred" : "Star"}
            </Button>
            <span>All changes saved in Drive</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Save className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Clock className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Version history</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button variant="ghost" size="sm" className="gap-1">
          <Share className="h-4 w-4" />
          Share
        </Button>

        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default Header;
