import {
  Sparkles,
  RotateCcw,
  ClipboardPaste,
  PanelLeftOpen,
  PanelRightOpen,
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
  leftOpen: boolean;
  rightOpen: boolean;
  onToggleLeft: () => void;
  onToggleRight: () => void;
}

export default function Header({
  onReset,
  onPaste,
  onSurprise,
  onAIGenerate,
  aiLoading,
  onOpenSettings,
  leftOpen,
  rightOpen,
  onToggleLeft,
  onToggleRight,
}: Props) {
  const iconBtn =
    "grid h-8 w-8 place-items-center bg-surface-2 text-text-secondary transition-[transform,background-color,color] duration-150 ease-out hover:bg-surface-3 hover:text-text-primary active:scale-95";

  return (
    <header className="flex items-center justify-between border-b border-border px-4 py-2.5">
      <div className="flex items-center gap-2">
        {!leftOpen && (
          <button
            onClick={onToggleLeft}
            aria-label="Show style panel"
            className={`${iconBtn} hidden md:grid`}
          >
            <PanelLeftOpen size={14} />
          </button>
        )}
        <div className="flex items-center gap-2.5">
          <div className="grid h-7 w-7 place-items-center bg-accent/20 text-accent flex-shrink-0">
            <Sparkles size={14} />
          </div>
          <h1 className="text-sm font-semibold tracking-tight whitespace-nowrap">
            Prompt Architect
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={onSurprise}
          aria-label="Generate random prompt"
          className="inline-flex h-8 items-center gap-1.5 px-2.5
                     bg-accent/15 text-accent text-xs font-medium
                     transition-[transform,background-color,color] duration-150 ease-out
                     hover:bg-accent/25 hover:text-accent
                     active:scale-[0.97]"
        >
          <Shuffle size={13} />
          <span className="hidden sm:inline">Surprise me</span>
        </button>
        <button
          onClick={onAIGenerate}
          disabled={aiLoading}
          aria-label="AI Generate prompt"
          className={`inline-flex h-8 items-center gap-1.5 px-2.5 text-xs font-medium
                     transition-[transform,background-color,color] duration-150 ease-out
                     active:scale-[0.97]
                     ${aiLoading
                       ? "bg-accent/30 text-accent cursor-wait"
                       : "bg-accent text-white hover:brightness-110"}`}
        >
          {aiLoading ? <Loader2 size={13} className="animate-spin" /> : <Wand2 size={13} />}
          <span className="hidden sm:inline">{aiLoading ? "Generating..." : "AI Generate"}</span>
        </button>
        <button
          onClick={onPaste}
          aria-label="Import prompt"
          className="inline-flex h-8 items-center gap-1.5 px-2.5
                     bg-surface-2 text-text-secondary text-xs font-medium
                     transition-[transform,background-color,color] duration-150 ease-out
                     hover:bg-surface-3 hover:text-text-primary
                     active:scale-[0.97]"
        >
          <ClipboardPaste size={13} />
          <span className="hidden sm:inline">Import</span>
        </button>
        <button onClick={onReset} aria-label="Reset all layers" className={iconBtn}>
          <RotateCcw size={14} />
        </button>
        <button onClick={onOpenSettings} aria-label="Settings" className={iconBtn}>
          <Settings size={14} />
        </button>
        <ThemeToggle />
        {!rightOpen && (
          <button
            onClick={onToggleRight}
            aria-label="Show output panel"
            className={`${iconBtn} hidden md:grid`}
          >
            <PanelRightOpen size={14} />
          </button>
        )}
      </div>
    </header>
  );
}
