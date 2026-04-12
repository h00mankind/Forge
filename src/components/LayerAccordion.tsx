import { useState, useRef, useEffect, memo } from "react";
import { ChevronRight } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
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
      className={`rounded-xl border transition-[border-color,background-color] ${
        open
          ? "border-border-strong bg-card/40"
          : "border-border bg-transparent hover:border-border-strong/50"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3 text-left
                   transition-[background-color] duration-150
                   hover:bg-muted/30"
      >
        <span className="flex-shrink-0 text-tertiary">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold text-foreground">
              {title}
            </span>
            {filled && (
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.4)]" />
            )}
          </div>
          <span className="text-[11px] text-tertiary leading-tight">{description}</span>
        </div>
        <ChevronRight
          size={13}
          className={`flex-shrink-0 text-muted-foreground/50 transition-transform duration-200 ${
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
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={2}
            className="min-h-[56px] text-[13px]"
          />
          {children}
        </div>
      </div>
    </div>
  );
});
