import { memo } from "react";
import { Button } from "@/components/ui/button";

export type OutputMode = "labeled" | "flat" | "json";

interface Props {
  value: OutputMode;
  onChange: (mode: OutputMode) => void;
}

const MODES: { id: OutputMode; label: string }[] = [
  { id: "labeled", label: "Labeled" },
  { id: "flat", label: "Flat" },
  { id: "json", label: "JSON" },
];

export default memo(function OutputToggle({ value, onChange }: Props) {
  return (
    <div className="inline-flex rounded-full bg-muted p-0.5">
      {MODES.map((m) => (
        <Button
          key={m.id}
          variant="ghost"
          size="xs"
          onClick={() => onChange(m.id)}
          className={`rounded-full px-2.5 text-[11px] font-semibold tracking-wide ${
            m.id === value
              ? "bg-background text-foreground shadow-sm hover:bg-background"
              : "text-muted-foreground hover:text-foreground hover:bg-transparent"
          }`}
        >
          {m.label}
        </Button>
      ))}
    </div>
  );
});
