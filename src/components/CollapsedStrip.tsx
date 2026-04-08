import { memo } from "react";
import { PanelLeftOpen, PanelRightOpen } from "lucide-react";

interface Props {
  side: "left" | "right";
  label: string;
  onExpand: () => void;
}

export default memo(function CollapsedStrip({ side, label, onExpand }: Props) {
  const Icon = side === "left" ? PanelLeftOpen : PanelRightOpen;
  const borderClass = side === "left" ? "border-r" : "border-l";

  return (
    <button
      onClick={onExpand}
      aria-label={`Show ${label.toLowerCase()} panel`}
      className={`panel-enter surface-lift hidden md:flex flex-col items-center flex-shrink-0
                  w-9 h-full ${borderClass} border-border bg-surface-1/20
                  hover:bg-surface-2/50
                  cursor-pointer group`}
    >
      <div
        className="grid h-8 w-8 place-items-center mt-3 text-text-tertiary
                   group-hover:text-text-secondary transition-colors duration-150"
      >
        <Icon size={14} />
      </div>
      <span
        className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-tertiary/60
                   group-hover:text-text-tertiary transition-colors duration-150
                   [writing-mode:vertical-lr] mt-4 select-none"
      >
        {label}
      </span>
    </button>
  );
});
