export type OutputMode = "labeled" | "flat" | "json";

interface Props {
  value: OutputMode;
  onChange: (mode: OutputMode) => void;
}

const modes: { id: OutputMode; label: string }[] = [
  { id: "labeled", label: "Labeled" },
  { id: "flat", label: "Flat" },
  { id: "json", label: "JSON" },
];

export default function OutputToggle({ value, onChange }: Props) {
  return (
    <div className="inline-flex rounded-lg bg-surface-2 p-0.5 border border-border">
      {modes.map((m) => (
        <button
          key={m.id}
          onClick={() => onChange(m.id)}
          className={`rounded-md px-3 py-1 text-[11px] font-medium
                      transition-[color,background-color] duration-150 ease-out
                      active:scale-[0.97]
                      ${
                        m.id === value
                          ? "bg-surface-0 text-text-primary shadow-sm"
                          : "text-text-tertiary hover:text-text-secondary"
                      }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
