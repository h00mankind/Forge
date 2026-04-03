import { memo } from "react";
import { PanelLeftClose, ChevronDown } from "lucide-react";
import { styleCategories } from "../data/presets";
import type { StyleCategoryId } from "../data/presets";

interface Props {
  activeCategory: StyleCategoryId | null;
  onCategoryChange: (id: StyleCategoryId) => void;
  styleValue: string;
  onStyleChange: (value: string) => void;
  onCollapse: () => void;
  onSelectStyle: (value: string) => void;
}

export default memo(function StylePanel({
  activeCategory,
  onCategoryChange,
  styleValue,
  onStyleChange,
  onCollapse,
  onSelectStyle,
}: Props) {
  return (
    <div className="flex h-full flex-col overflow-y-auto bg-surface-1/30">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-tertiary">
          Style
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
          {styleCategories.map((cat) => {
            const isActive = cat.id === activeCategory;
            return (
              <div key={cat.id}>
                <button
                  onClick={() => onCategoryChange(cat.id)}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-[13px] font-medium
                              transition-[color,background-color] duration-150 ease-out
                              active:scale-[0.98]
                              ${isActive
                                ? "bg-accent/12 text-accent"
                                : "text-text-secondary hover:bg-surface-2/70 hover:text-text-primary"
                              }`}
                >
                  <span>{cat.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] tabular-nums text-text-tertiary/60">
                      {cat.styles.length}
                    </span>
                    <ChevronDown
                      size={11}
                      className={`text-text-tertiary/50 transition-transform duration-150 ${isActive ? "rotate-180" : ""}`}
                    />
                  </div>
                </button>
                {isActive && (
                  <div className="flex flex-wrap gap-1 px-3 py-2">
                    {cat.styles.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => onSelectStyle(s.prompt)}
                        className="border border-border bg-surface-0 px-2 py-1
                                   text-[11px] font-medium text-text-secondary whitespace-nowrap
                                   transition-[color,border-color,background-color,transform] duration-150 ease-out
                                   hover:border-accent/30 hover:bg-accent-muted hover:text-accent
                                   active:scale-[0.97]"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
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
