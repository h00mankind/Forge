import { useState, useRef, useEffect, memo } from "react";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  title: string;
  description: string;
  filled: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  children?: ReactNode;
  defaultOpen?: boolean;
}

export default memo(function LayerAccordion({
  icon,
  title,
  description,
  filled,
  value,
  onChange,
  placeholder,
  children,
  defaultOpen = false,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(
    defaultOpen ? undefined : 0
  );

  useEffect(() => {
    if (!contentRef.current) return;
    if (open) {
      setHeight(contentRef.current.scrollHeight);
      const timer = setTimeout(() => setHeight(undefined), 260);
      return () => clearTimeout(timer);
    } else {
      setHeight(contentRef.current.scrollHeight);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setHeight(0));
      });
    }
  }, [open]);

  return (
    <div
      className={`surface-lift border ${
        open
          ? "border-border-strong bg-surface-1/40"
          : "border-border bg-transparent hover:border-border-strong/50"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3 text-left
                   transition-[background-color] duration-[160ms] ease-out
                   hover:bg-surface-2/30 active:scale-[0.998]"
      >
        <span className="flex-shrink-0 text-text-tertiary">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-text-primary">
              {title}
            </span>
            {filled && (
              <span className="h-1.5 w-1.5 bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.4)]" />
            )}
          </div>
          <span className="text-[11px] text-text-tertiary leading-tight">{description}</span>
        </div>
        <ChevronRight
          size={13}
          className={`flex-shrink-0 text-text-tertiary/50 transition-transform duration-[220ms] ease-[var(--ease-smooth)] ${
            open ? "rotate-90" : ""
          }`}
        />
      </button>

      <div
        ref={contentRef}
        aria-hidden={!open}
        style={{ height: height !== undefined ? `${height}px` : "auto" }}
        className={`overflow-hidden transition-[height,opacity] duration-[240ms] ease-[var(--ease-smooth)] ${
          !open ? "pointer-events-none" : ""
        }`}
      >
        <div className="space-y-3 px-4 pb-4 pt-1">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={2}
            className="w-full resize-none border border-border bg-surface-0 px-3 py-2.5 text-[13px]
                       text-text-primary placeholder:text-text-tertiary/40 outline-none
                       transition-[border-color,box-shadow,transform] duration-150 ease-out
                       focus:border-accent/40 focus:ring-1 focus:ring-accent/15
                       min-h-[56px]"
          />
          {children}
        </div>
      </div>
    </div>
  );
});
