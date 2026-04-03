import { useMemo, useCallback, useState, useRef, useEffect, memo } from "react";
import { FileText, Layers, PanelRightClose } from "lucide-react";
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

interface Props {
  layers: PromptLayers;
  promptType: PromptType;
  onCollapse: () => void;
}

export default memo(function PreviewPanel({ layers, promptType, onCollapse }: Props) {
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
    <div className="flex h-full flex-col border-t md:border-t-0">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2.5">
          <FileText size={13} className="text-text-tertiary" />
          <span className="text-[13px] font-semibold text-text-secondary">
            Output
          </span>
          <span className="flex items-center gap-1 bg-surface-2/60 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-text-tertiary border border-border">
            <Layers size={9} />
            {filled}/{TOTAL_LAYERS}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <OutputToggle value={mode} onChange={setMode} />
          <CopyButton getText={getCopyText} />
          <button
            onClick={onCollapse}
            aria-label="Hide output panel"
            className="hidden md:grid h-6 w-6 place-items-center text-text-tertiary
                       hover:text-text-secondary hover:bg-surface-2
                       transition-[color,background-color] duration-150 ease-out active:scale-95"
          >
            <PanelRightClose size={12} />
          </button>
        </div>
      </div>

      <div ref={containerRef} className="flex-1 overflow-y-auto p-5">
        {isEmpty ? (
          <div className="flex h-full items-center justify-center">
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
            className={`whitespace-pre-wrap break-words font-mono leading-[1.7] ${
              mode === "json"
                ? "text-[12px] text-accent/90"
                : "text-[13px] text-text-primary"
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
