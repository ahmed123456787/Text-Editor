import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Clock,
  Save,
  Share,
  Star,
  StarOff,
  FileText,
  Copy,
  Check,
} from "lucide-react";
import { getDocumentAccessToken } from "../../services/apis/documentApi";
import { DocumentState } from "@/types";
import { PermissionType } from "../../services/apis/documentApi";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface HeaderProps {
  document: DocumentState;
  isStarred: boolean;
  setDocumentTitle: (title: string) => void;
  setIsStarred: (starred: boolean) => void;
}

const Header = ({
  document,
  isStarred,
  setDocumentTitle,
  setIsStarred,
}: HeaderProps) => {
  const [permissions, setPermissions] = useState<PermissionType[]>([
    "read",
    "write",
  ]);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePermissionChange = (
    permission: PermissionType,
    checked: boolean
  ) => {
    if (checked) {
      setPermissions((prev) => [
        ...prev.filter((p) => p !== permission),
        permission,
      ]);
    } else {
      setPermissions((prev) => prev.filter((p) => p !== permission));
    }
  };

  const getLinkToDocument = async () => {
    setIsLoading(true);
    try {
      const accessToken = await getDocumentAccessToken(
        document.id,
        permissions
      );
      const link = `${window.location.origin}/document/${document.id}?access_token=${accessToken}`;
      setShareLink(link);
    } catch (error) {
      console.error("Error generating share link:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setIsLinkCopied(true);
    setTimeout(() => setIsLinkCopied(false), 2000);
  };

  return (
    <header className="flex items-center justify-between border-b p-2">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 flex items-center justify-center">
          <FileText className="text-blue-600" />
        </div>
        <div className="flex flex-col">
          <Input
            value={document.title}
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

        <Button
          variant="ghost"
          size="sm"
          className="gap-1"
          onClick={() => setIsShareOpen(true)}
        >
          <Share className="h-4 w-4" />
          Share
        </Button>

        <Avatar className="h-8 w-8">
          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>

      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Document</DialogTitle>
            <DialogDescription>
              Choose permissions and generate a shareable link
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="read-permission"
                  checked={permissions.includes("read")}
                  onCheckedChange={(checked) =>
                    handlePermissionChange("read", !!checked)
                  }
                />
                <Label htmlFor="read-permission">Read permission</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="write-permission"
                  checked={permissions.includes("write")}
                  onCheckedChange={(checked) =>
                    handlePermissionChange("write", !!checked)
                  }
                />
                <Label htmlFor="write-permission">Write permission</Label>
              </div>
            </div>

            <Button
              onClick={getLinkToDocument}
              disabled={isLoading || permissions.length === 0}
            >
              {isLoading ? "Generating..." : "Generate Link"}
            </Button>

            {shareLink && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Input value={shareLink} readOnly className="flex-1" />
                  <Button size="sm" variant="outline" onClick={copyToClipboard}>
                    {isLinkCopied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Anyone with this link can access the document with the
                  selected permissions.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
