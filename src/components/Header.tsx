import { memo } from "react";
import {
  RotateCcw,
  ClipboardPaste,
  Shuffle,
  Wand2,
  Settings,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import ThemeToggle from "./ThemeToggle";

interface Props {
  onReset: () => void;
  onPaste: () => void;
  onSurprise: () => void;
  onAIGenerate: () => void;
  aiLoading: boolean;
  onOpenSettings: () => void;
}

export default memo(function Header({
  onReset,
  onPaste,
  onSurprise,
  onAIGenerate,
  aiLoading,
  onOpenSettings,
}: Props) {
  return (
    <header className="relative flex items-center justify-between border-b border-border px-5 py-3 grain">
      <div className="reveal-in flex items-center gap-2.5">
        <div className="relative grid h-7 w-7 place-items-center bg-primary/15 text-primary">
          <div className="absolute inset-0 bg-primary/10 blur-md" />
          <Wand2 size={13} className="relative" />
        </div>
        <h1 className="font-display text-[15px] font-bold tracking-tight">
          Forge
        </h1>
      </div>

      <div className="stagger-in flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onSurprise}
          aria-label="Generate random prompt"
          className="text-muted-foreground"
        >
          <Shuffle size={12} />
          <span className="hidden sm:inline">Surprise</span>
        </Button>
        <Button
          onClick={onAIGenerate}
          disabled={aiLoading}
          aria-label="AI Generate prompt"
          size="sm"
          className={aiLoading ? "bg-primary/20 text-primary/70 cursor-wait" : ""}
        >
          {aiLoading ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
          <span className="hidden sm:inline">{aiLoading ? "Working..." : "Generate"}</span>
        </Button>
        <Separator orientation="vertical" className="mx-1 h-4" />
        <Button
          variant="ghost"
          size="sm"
          onClick={onPaste}
          aria-label="Import prompt"
          className="text-muted-foreground"
        >
          <ClipboardPaste size={12} />
          <span className="hidden sm:inline">Import</span>
        </Button>
        <Tooltip>
          <TooltipTrigger render={
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onReset}
              aria-label="Reset all layers"
              className="text-muted-foreground"
            />
          }>
            <RotateCcw size={13} />
          </TooltipTrigger>
          <TooltipContent>Reset all layers</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger render={
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onOpenSettings}
              aria-label="Settings"
              className="text-muted-foreground"
            />
          }>
            <Settings size={13} />
          </TooltipTrigger>
          <TooltipContent>Settings</TooltipContent>
        </Tooltip>
        <ThemeToggle />
      </div>
    </header>
  );
});
