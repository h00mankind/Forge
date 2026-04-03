import { styleCategories } from "../data/presets";
import type { StyleCategoryId } from "../data/presets";
interface Props {
  activeCategory: StyleCategoryId | null;
  onSelectStyle: (value: string) => void;
}

export default function SubStyleBar({ activeCategory, onSelectStyle }: Props) {
  const activeCat = styleCategories.find((c) => c.id === activeCategory);
  if (!activeCat) return null;

  return (
    <div className="flex-shrink-0 border-b border-border bg-surface-1/30 px-4 py-2.5">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-text-tertiary">
          {activeCat.label}
        </span>
      </div>
      <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
        {activeCat.styles.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelectStyle(s.prompt)}
            className="flex-shrink-0 border border-border bg-surface-0 px-3 py-1.5
                       text-[11px] font-medium text-text-secondary whitespace-nowrap
                       transition-[color,border-color,background-color,transform] duration-150 ease-out
                       hover:border-accent/40 hover:bg-accent-muted hover:text-accent
                       active:scale-[0.97]"
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
