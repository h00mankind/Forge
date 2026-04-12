import { memo } from "react";
import { Button } from "@/components/ui/button";
import type { Preset } from "../data/presets";

interface Props {
  presets: Preset[];
  onSelect: (prompt: string) => void;
}

export default memo(function PresetChips({ presets, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-1.5 stagger-in">
      {presets.map((p) => (
        <Button
          key={p.id}
          variant="outline"
          size="xs"
          onClick={() => onSelect(p.prompt)}
          className="text-muted-foreground hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
        >
          {p.label}
        </Button>
      ))}
    </div>
  );
});
