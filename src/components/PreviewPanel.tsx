import { useMemo, useCallback, useState, useRef, useEffect, memo } from "react";
import { FileText, Layers, PanelRightClose, Image, Wand2, Eraser, ArrowRightLeft, Type } from "lucide-react";
import OutputToggle from "./OutputToggle";
import type { OutputMode } from "./OutputToggle";
import CopyButton from "./CopyButton";
import {
  assembleTextPrompt,
  assembleFlatPrompt,
  assembleJSON,
  filledLayerCount,
  TOTAL_LAYERS,
} from "../utils/assemblePrompt";
import { useTextMeasure } from "../hooks/useTextMeasure";
import type { PromptLayers, PromptType } from "../hooks/usePromptStore";

const PURPOSE_OPTIONS: { id: PromptType; label: string; icon: typeof Image }[] = [
  { id: "text-to-image", label: "Text → Image", icon: Image },
  { id: "multimodal", label: "Multimodal", icon: Wand2 },
  { id: "inpainting", label: "Inpainting", icon: Eraser },
  { id: "style-transfer", label: "Style Transfer", icon: ArrowRightLeft },
  { id: "text-rendering", label: "Text Render", icon: Type },
];

interface Props {
  layers: PromptLayers;
  promptType: PromptType;
  onTypeChange: (type: PromptType) => void;
  onCollapse: () => void;
}

export default memo(function PreviewPanel({ layers, promptType, onTypeChange, onCollapse }: Props) {
  const [mode, setMode] = useState<OutputMode>("labeled");
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const { measure } = useTextMeasure();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const labeledText = useMemo(
    () => assembleTextPrompt(layers, promptType),
    [layers, promptType]
  );

  const flatText = useMemo(
    () => assembleFlatPrompt(layers, promptType),
    [layers, promptType]
  );

  const jsonText = useMemo(
    () => JSON.stringify(assembleJSON(layers, promptType), null, 2),
    [layers, promptType]
  );

  const displayText = mode === "labeled" ? labeledText : mode === "flat" ? flatText : jsonText;
  const filled = filledLayerCount(layers);
  const isEmpty = filled === 0;

  const estimatedHeight = useMemo(() => {
    if (isEmpty || containerWidth <= 0) return 0;
    const variant = mode === "json" ? "json" as const : "default" as const;
    return measure(displayText, containerWidth - 40, variant).height;
  }, [displayText, containerWidth, mode, isEmpty, measure]);

  const getCopyText = useCallback(() => displayText, [displayText]);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto">
      <div className="reveal-in flex items-center justify-between px-4 pt-4 pb-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-tertiary">
          Purpose
        </span>
        <button
          onClick={onCollapse}
          aria-label="Hide output panel"
          className="surface-lift hidden md:grid h-6 w-6 place-items-center text-text-tertiary
                     hover:text-text-secondary hover:bg-surface-2"
        >
          <PanelRightClose size={12} />
        </button>
      </div>

      <div className="border-b border-border px-3 pb-3">
        <div className="flex flex-col gap-px">
          {PURPOSE_OPTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTypeChange(id)}
              className={`surface-lift flex items-center gap-2.5 px-3 py-2 text-left text-[13px] font-medium
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

      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2.5">
          <FileText size={13} className="flex-shrink-0 text-text-tertiary" />
          <span className="flex-shrink-0 text-[13px] font-semibold text-text-secondary">
            Output
          </span>
          <OutputToggle value={mode} onChange={setMode} />
        </div>
        <div className="flex flex-shrink-0 items-center gap-2">
          <CopyButton getText={getCopyText} />
        </div>
      </div>

      <div className="flex items-center px-5 py-2">
        <span className="flex items-center gap-1 border border-border bg-surface-2/60 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-text-tertiary">
          <Layers size={9} />
          {filled}/{TOTAL_LAYERS}
        </span>
      </div>

      <div ref={containerRef} className="flex-1 overflow-y-auto p-5">
        {isEmpty ? (
          <div className="reveal-in flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-3 grid h-10 w-10 place-items-center bg-surface-2/50 text-text-tertiary/60">
                <FileText size={16} />
              </div>
              <p className="text-[13px] font-medium text-text-tertiary">
                Start building your prompt
              </p>
              <p className="mt-1.5 text-[11px] text-text-tertiary/50 max-w-[200px] mx-auto leading-relaxed">
                Fill in layers to see your assembled prompt here
              </p>
            </div>
          </div>
        ) : (
          <pre
            key={`${mode}-${promptType}`}
            className={`whitespace-pre-wrap break-words font-mono leading-[1.7] ${
              mode === "json"
                ? "reveal-in text-[12px] text-accent/90"
                : "reveal-in text-[13px] text-text-primary"
            }`}
            style={estimatedHeight > 0 ? { minHeight: estimatedHeight } : undefined}
          >
            {displayText}
          </pre>
        )}
      </div>
    </div>
  );
});
