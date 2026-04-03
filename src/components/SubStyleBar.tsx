import { memo } from "react";
import { styleCategories } from "../data/presets";
import type { StyleCategoryId } from "../data/presets";

interface Props {
  activeCategory: StyleCategoryId | null;
  onSelectStyle: (value: string) => void;
}

export default memo(function SubStyleBar({ activeCategory, onSelectStyle }: Props) {
  const activeCat = styleCategories.find((c) => c.id === activeCategory);
  if (!activeCat) return null;

  return (
    <div className="flex-shrink-0 border-b border-border bg-surface-1/20 px-5 py-3">
      <div className="mb-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-tertiary">
          {activeCat.label}
        </span>
      </div>
      <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
        {activeCat.styles.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelectStyle(s.prompt)}
            className="flex-shrink-0 border border-border bg-surface-0 px-3 py-1.5
                       text-[12px] font-medium text-text-secondary whitespace-nowrap
                       transition-[color,border-color,background-color,transform] duration-150 ease-out
                       hover:border-accent/30 hover:bg-accent-muted hover:text-accent
                       active:scale-[0.97]"
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
});
