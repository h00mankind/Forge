import { memo } from "react";
import { Image, Wand2, Eraser, ArrowRightLeft, Type, PanelLeftClose } from "lucide-react";
import { styleCategories } from "../data/presets";
import type { StyleCategoryId } from "../data/presets";
import type { PromptType } from "../hooks/usePromptStore";

interface Props {
  promptType: PromptType;
  onTypeChange: (type: PromptType) => void;
  activeCategory: StyleCategoryId | null;
  onCategoryChange: (id: StyleCategoryId) => void;
  styleValue: string;
  onStyleChange: (value: string) => void;
  onCollapse: () => void;
}

const PURPOSE_OPTIONS: { id: PromptType; label: string; icon: typeof Image }[] = [
  { id: "text-to-image", label: "Text → Image", icon: Image },
  { id: "multimodal", label: "Multimodal", icon: Wand2 },
  { id: "inpainting", label: "Inpainting", icon: Eraser },
  { id: "style-transfer", label: "Style Transfer", icon: ArrowRightLeft },
  { id: "text-rendering", label: "Text Render", icon: Type },
];

export default memo(function StylePanel({
  promptType,
  onTypeChange,
  activeCategory,
  onCategoryChange,
  styleValue,
  onStyleChange,
  onCollapse,
}: Props) {
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-surface-1/30">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-tertiary">
          Purpose
        </span>
        <button
          onClick={onCollapse}
          aria-label="Hide style panel"
          className="hidden md:grid h-6 w-6 place-items-center text-text-tertiary
                     hover:text-text-secondary hover:bg-surface-2
                     transition-[color,background-color] duration-150 ease-out active:scale-95"
        >
          <PanelLeftClose size={12} />
        </button>
      </div>

      <div className="px-3 pb-3">
        <div className="flex flex-col gap-px">
          {PURPOSE_OPTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTypeChange(id)}
              className={`flex items-center gap-2.5 px-3 py-2 text-left text-[13px] font-medium
                          transition-[color,background-color] duration-150 ease-out
                          active:scale-[0.98]
                          ${id === promptType
                            ? "bg-accent/12 text-accent"
                            : "text-text-secondary hover:bg-surface-2/70 hover:text-text-primary"
                          }`}
            >
              <Icon size={13} className="flex-shrink-0" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-4 border-t border-border" />

      <div className="px-4 pt-4 pb-2">
        <span className="mb-2.5 block text-[10px] font-bold uppercase tracking-[0.12em] text-text-tertiary">
          Style
        </span>
        <div className="flex flex-col gap-px">
          {styleCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`flex items-center justify-between px-3 py-2 text-left text-[13px] font-medium
                          transition-[color,background-color] duration-150 ease-out
                          active:scale-[0.98]
                          ${cat.id === activeCategory
                            ? "bg-accent/12 text-accent"
                            : "text-text-secondary hover:bg-surface-2/70 hover:text-text-primary"
                          }`}
            >
              <span>{cat.label}</span>
              <span className="text-[10px] tabular-nums text-text-tertiary/60">
                {cat.styles.length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mx-4 border-t border-border" />

      <div className="px-4 pt-4 pb-5">
        <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-text-tertiary">
          Custom
        </span>
        <textarea
          value={styleValue}
          onChange={(e) => onStyleChange(e.target.value)}
          placeholder="Add your own style keywords..."
          rows={2}
          className="w-full resize-none border border-border bg-surface-0 px-3 py-2.5 text-[13px]
                     text-text-primary placeholder:text-text-tertiary/50 outline-none
                     transition-[border-color,box-shadow] duration-150 ease-out
                     focus:border-accent/40 focus:ring-1 focus:ring-accent/15
                     min-h-[52px]"
        />
      </div>
    </div>
  );
});
