import { 
  Pencil, 
  Square, 
  StickyNote, 
  Move, 
  Image, 
  Plus,
  Settings,
  MoreVertical,
  X,
  Volume2
} from "lucide-react";
import { QuranPlayer } from "@/components/quran/QuranPlayer";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function Sidebar() {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const tools = [
    { icon: Pencil, label: "Draw" },
    { icon: Square, label: "Shapes" },
    { icon: StickyNote, label: "Sticky Notes" },
    { icon: Move, label: "Move" },
    { icon: Image, label: "Images" },
    { icon: Volume2, label: "القرآن الكريم", component: QuranPlayer },
  ];

  if (isMobile) {
    return (
      <>
        <Button
          variant="default"
          size="icon"
          className="rounded-full w-12 h-12 fixed bottom-4 left-4 shadow-lg z-50 bg-primary hover:bg-primary/90"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MoreVertical className="h-6 w-6" />
          )}
        </Button>

        {isMenuOpen && (
          <>
            <div 
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
              onClick={() => setIsMenuOpen(false)}
            />
          <div className="fixed bottom-20 left-4 bg-background rounded-lg shadow-lg p-4 flex flex-col gap-2 items-center border z-40 animate-in fade-in slide-in-from-bottom-5">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full w-10 h-10 hover:bg-muted"
            >
              <Plus className="h-5 w-5" />
            </Button>

            <Separator className="my-2" />

            {tools.map((Tool, index) => (
              Tool.component ? (
                <Tool.component key={index} />
              ) : (
                <Button
                  key={index}
                  variant="ghost"
                  size="icon"
                  className="rounded-full w-10 h-10 hover:bg-muted"
                >
                  <Tool.icon className="h-5 w-5" />
                </Button>
              )
            ))}

            <Separator className="my-2" />

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full w-10 h-10 hover:bg-muted"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
          </>
        )}
      </>
    );
  }

  return (
    <div className="w-16 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-full flex flex-col items-center py-4 gap-2 fixed left-0 top-16">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full w-10 h-10 mb-2 hover:bg-muted"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Add New</TooltipContent>
        </Tooltip>

        <Separator className="my-2" />

        {tools.map((Tool, index) => (
          Tool.component ? (
            <Tool.component key={index} />
          ) : (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full w-10 h-10 hover:bg-muted"
                >
                  <Tool.icon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">{Tool.label}</TooltipContent>
            </Tooltip>
          )
        ))}

        <div className="flex-1" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full w-10 h-10 hover:bg-muted"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
