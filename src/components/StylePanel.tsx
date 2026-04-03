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
  { id: "text-to-image", label: "Text-to-Image", icon: Image },
  { id: "multimodal", label: "Multimodal", icon: Wand2 },
  { id: "inpainting", label: "Inpainting", icon: Eraser },
  { id: "style-transfer", label: "Style Transfer", icon: ArrowRightLeft },
  { id: "text-rendering", label: "Text Rendering", icon: Type },
];

export default function StylePanel({
  promptType,
  onTypeChange,
  activeCategory,
  onCategoryChange,
  styleValue,
  onStyleChange,
  onCollapse,
}: Props) {
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-surface-1/40">
      {/* Panel header with collapse */}
      <div className="flex items-center justify-between px-3 pt-3 pb-1">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-text-tertiary">
          Purpose
        </span>
        <button
          onClick={onCollapse}
          aria-label="Hide style panel"
          className="hidden md:grid h-6 w-6 place-items-center text-text-tertiary
                     hover:text-text-primary hover:bg-surface-2
                     transition-[color,background-color] duration-150 ease-out active:scale-95"
        >
          <PanelLeftClose size={13} />
        </button>
      </div>

      <div className="px-3 pb-2">
        <div className="flex flex-col gap-0.5">
          {PURPOSE_OPTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTypeChange(id)}
              className={`flex items-center gap-2 px-2.5 py-1.5 text-left text-xs font-medium
                          transition-[color,background-color] duration-150 ease-out
                          active:scale-[0.98]
                          ${
                            id === promptType
                              ? "bg-accent/15 text-accent"
                              : "text-text-secondary hover:bg-surface-2 hover:text-text-primary"
                          }`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-3 border-t border-border" />

      {/* Style Categories */}
      <div className="px-3 pt-3 pb-2">
        <span className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-text-tertiary">
          Style
        </span>
        <div className="flex flex-col gap-0.5">
          {styleCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`flex items-center justify-between px-2.5 py-1.5 text-left text-xs font-medium
                          transition-[color,background-color] duration-150 ease-out
                          active:scale-[0.98]
                          ${
                            cat.id === activeCategory
                              ? "bg-accent/15 text-accent"
                              : "text-text-secondary hover:bg-surface-2 hover:text-text-primary"
                          }`}
            >
              <span>{cat.label}</span>
              <span className="text-[10px] text-text-tertiary">
                {cat.styles.length}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mx-3 border-t border-border" />

      {/* Custom style textarea */}
      <div className="px-3 pt-3 pb-4">
        <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-widest text-text-tertiary">
          Custom
        </span>
        <textarea
          value={styleValue}
          onChange={(e) => onStyleChange(e.target.value)}
          placeholder="Add your own style keywords..."
          rows={2}
          className="w-full resize-none border border-border bg-surface-0 px-2.5 py-2 text-xs
                     text-text-primary placeholder:text-text-tertiary outline-none
                     transition-[border-color,box-shadow] duration-150 ease-out
                     focus:border-accent/50 focus:ring-1 focus:ring-accent/20
                     min-h-[48px]"
        />
      </div>
    </div>
  );
}
