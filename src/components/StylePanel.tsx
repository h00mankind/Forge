import { memo } from "react";
import { PanelLeftClose, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { styleCategories } from "../data/presets";
import type { StyleCategoryId } from "../data/presets";

interface Props {
  activeCategory: StyleCategoryId | null;
  onCategoryChange: (id: StyleCategoryId | null) => void;
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
    <div className="flex h-full flex-col overflow-y-auto bg-card/30">
      <div className="reveal-in flex items-center justify-between px-4 pt-4 pb-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-tertiary">
          Style
        </span>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onCollapse}
          aria-label="Hide style panel"
          className="hidden md:grid text-muted-foreground"
        >
          <PanelLeftClose size={12} />
        </Button>
      </div>

      <div className="px-3 pb-3">
        <div className="flex flex-col gap-px">
          {styleCategories.map((cat) => {
            const isActive = cat.id === activeCategory;
            return (
              <div key={cat.id}>
                <button
                  onClick={() => onCategoryChange(isActive ? null : cat.id)}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-[13px] font-medium transition-[color,background-color] ${
                    isActive
                      ? "bg-primary/12 text-primary"
                      : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                  }`}
                >
                  <span>{cat.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] tabular-nums text-tertiary/60">
                      {cat.styles.length}
                    </span>
                    <ChevronDown
                      size={11}
                      className={`text-muted-foreground/50 transition-transform duration-200 ${isActive ? "rotate-180" : ""}`}
                    />
                  </div>
                </button>
                {isActive && (
                  <div className="stagger-in flex flex-wrap gap-1 px-3 py-2">
                    {cat.styles.map((s) => (
                      <Button
                        key={s.id}
                        variant="outline"
                        size="xs"
                        onClick={() => onSelectStyle(s.prompt)}
                        className="text-muted-foreground hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                      >
                        {s.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Separator className="mx-4" />

      <div className="px-4 pt-4 pb-5">
        <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-tertiary">
          Custom
        </span>
        <Textarea
          value={styleValue}
          onChange={(e) => onStyleChange(e.target.value)}
          placeholder="Add your own style keywords..."
          rows={2}
          className="min-h-[52px] text-[13px]"
        />
      </div>
    </div>
  );
});
