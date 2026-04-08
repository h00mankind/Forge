import { memo } from "react";
import {
  RotateCcw,
  ClipboardPaste,
  Shuffle,
  Wand2,
  Settings,
  Loader2,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";

interface Props {
  onReset: () => void;
  onPaste: () => void;
  onSurprise: () => void;
  onAIGenerate: () => void;
  aiLoading: boolean;
  onOpenSettings: () => void;
}

const ICON_BTN =
  "surface-lift micro-glow grid h-8 w-8 place-items-center text-text-tertiary hover:bg-surface-2 hover:text-text-secondary";

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
        <div className="relative grid h-7 w-7 place-items-center bg-accent/15 text-accent">
          <div className="absolute inset-0 bg-accent/10 blur-md" />
          <Wand2 size={13} className="relative" />
        </div>
        <h1 className="font-display text-[15px] font-bold tracking-tight">
          Forge
        </h1>
      </div>

      <div className="stagger-in flex items-center gap-1">
        <button
          onClick={onSurprise}
          aria-label="Generate random prompt"
          className="surface-lift micro-glow inline-flex h-8 items-center gap-1.5 px-3
                     text-text-secondary text-[13px] font-medium
                     hover:bg-surface-2 hover:text-text-primary"
        >
          <Shuffle size={12} />
          <span className="hidden sm:inline">Surprise</span>
        </button>
        <button
          onClick={onAIGenerate}
          disabled={aiLoading}
          aria-label="AI Generate prompt"
          className={`surface-lift micro-glow inline-flex h-8 items-center gap-1.5 px-3 text-[13px] font-semibold
                     ${aiLoading
                       ? "bg-accent/20 text-accent/70 cursor-wait"
                       : "bg-accent text-white hover:brightness-110"}`}
        >
          {aiLoading ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
          <span className="hidden sm:inline">{aiLoading ? "Working..." : "Generate"}</span>
        </button>
        <div className="mx-1 h-4 w-px bg-border" />
        <button
          onClick={onPaste}
          aria-label="Import prompt"
          className="surface-lift micro-glow inline-flex h-8 items-center gap-1.5 px-2.5
                     text-text-tertiary text-[13px] font-medium
                     hover:bg-surface-2 hover:text-text-secondary"
        >
          <ClipboardPaste size={12} />
          <span className="hidden sm:inline">Import</span>
        </button>
        <button onClick={onReset} aria-label="Reset all layers" className={ICON_BTN}>
          <RotateCcw size={13} />
        </button>
        <button onClick={onOpenSettings} aria-label="Settings" className={ICON_BTN}>
          <Settings size={13} />
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
});
