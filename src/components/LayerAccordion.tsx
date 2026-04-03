import { useState, useRef, useEffect } from "react";
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

export default function LayerAccordion({
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
      const timer = setTimeout(() => setHeight(undefined), 280);
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
      className={`rounded-xl border transition-[border-color] duration-200 ease-out ${
        open ? "border-border-strong bg-surface-1/50" : "border-border bg-transparent"
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((o) => !o);
          }
        }}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3 text-left
                   transition-[background-color] duration-150 ease-out
                   hover:bg-surface-2/50 rounded-xl active:scale-[0.998]"
      >
        <span className="flex-shrink-0 text-text-tertiary">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-primary">
              {title}
            </span>
            {filled && (
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
            )}
          </div>
          <span className="text-[11px] text-text-tertiary">{description}</span>
        </div>
        <ChevronRight
          size={14}
          className={`flex-shrink-0 text-text-tertiary transition-transform duration-200 ease-out ${
            open ? "rotate-90" : ""
          }`}
        />
      </button>

      <div
        ref={contentRef}
        aria-hidden={!open}
        style={{ height: height !== undefined ? `${height}px` : "auto" }}
        className={`overflow-hidden transition-[height,opacity] duration-[280ms] ease-out ${
          !open ? "pointer-events-none" : ""
        }`}
      >
        <div className="space-y-3 px-4 pb-4 pt-1">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={2}
            className="w-full resize-none rounded-lg border border-border bg-surface-0 px-3 py-2.5 text-sm
                       text-text-primary placeholder:text-text-tertiary outline-none
                       transition-[border-color,box-shadow] duration-150 ease-out
                       focus:border-accent/50 focus:ring-1 focus:ring-accent/20
                       min-h-[60px]"
          />
          {children}
        </div>
      </div>
    </div>
  );
}
