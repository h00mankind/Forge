import { Type } from "lucide-react";

interface Props {
  textContent: string;
  textFont: string;
  textPlacement: string;
  onChange: (key: "textContent" | "textFont" | "textPlacement", value: string) => void;
}

export default function TextInImageFields({
  textContent,
  textFont,
  textPlacement,
  onChange,
}: Props) {
  const inputClass = `w-full rounded-lg border border-border bg-surface-1 px-3 py-2 text-sm text-text-primary
    placeholder:text-text-tertiary outline-none
    transition-[border-color,box-shadow] duration-150 ease-out
    focus:border-accent/50 focus:ring-1 focus:ring-accent/20`;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-text-tertiary">
        <Type size={12} />
        <span className="text-[10px] font-semibold uppercase tracking-widest">
          Text Rendering
        </span>
      </div>
      <div className="space-y-2">
        <div>
          <label className="mb-1 block text-[11px] font-medium text-text-secondary">
            Text Content
          </label>
          <input
            type="text"
            value={textContent}
            onChange={(e) => onChange("textContent", e.target.value)}
            placeholder={'"URBAN EXPLORER"'}
            className={inputClass}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="mb-1 block text-[11px] font-medium text-text-secondary">
              Font
            </label>
            <input
              type="text"
              value={textFont}
              onChange={(e) => onChange("textFont", e.target.value)}
              placeholder="bold white sans-serif"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium text-text-secondary">
              Placement
            </label>
            <input
              type="text"
              value={textPlacement}
              onChange={(e) => onChange("textPlacement", e.target.value)}
              placeholder="centered at the top third"
              className={inputClass}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
