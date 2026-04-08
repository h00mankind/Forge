import { memo } from "react";

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
    <div className="inline-flex bg-surface-2/60 p-0.5 border border-border">
      {MODES.map((m) => (
        <button
          key={m.id}
          onClick={() => onChange(m.id)}
          className={`surface-lift relative px-2.5 py-1 text-[11px] font-semibold tracking-wide
                      ${m.id === value
                        ? "bg-surface-0 text-text-primary shadow-sm"
                        : "text-text-tertiary hover:text-text-secondary"
                      }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
});
