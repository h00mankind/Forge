import { memo } from "react";
import type { Preset } from "../data/presets";

interface Props {
  presets: Preset[];
  onSelect: (prompt: string) => void;
}

export default memo(function PresetChips({ presets, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-1.5 stagger-in">
      {presets.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onSelect(p.prompt)}
          className="surface-lift micro-glow border border-border bg-surface-1/60 px-2.5 py-1 text-[11px] font-medium
                     text-text-secondary
                     hover:border-accent/30 hover:bg-accent-muted hover:text-accent
                     active:scale-[0.97]"
        >
          {p.label}
        </button>
      ))}
    </div>
  );
});
