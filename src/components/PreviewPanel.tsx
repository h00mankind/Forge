import { useMemo, useCallback, useState } from "react";
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
import type { PromptLayers, PromptType } from "../hooks/usePromptStore";

interface Props {
  layers: PromptLayers;
  promptType: PromptType;
  onCollapse: () => void;
}

export default function PreviewPanel({ layers, promptType, onCollapse }: Props) {
  const [mode, setMode] = useState<OutputMode>("labeled");

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

  const getCopyText = useCallback(() => displayText, [displayText]);

  return (
    <div className="flex h-full flex-col border-t md:border-t-0">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="flex items-center gap-2">
          <FileText size={14} className="text-text-tertiary" />
          <span className="text-xs font-medium text-text-secondary">
            Output
          </span>
          <span className="flex items-center gap-1 rounded-md bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-text-tertiary">
            <Layers size={10} />
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
                       hover:text-text-primary hover:bg-surface-2
                       transition-[color,background-color] duration-150 ease-out active:scale-95"
          >
            <PanelRightClose size={13} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isEmpty ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-xl bg-surface-2 text-text-tertiary">
                <FileText size={18} />
              </div>
              <p className="text-sm font-medium text-text-tertiary">
                Start building your prompt
              </p>
              <p className="mt-1 text-xs text-text-tertiary/60">
                Fill in layers on the left to see your assembled prompt here
              </p>
            </div>
          </div>
        ) : (
          <pre
            className={`whitespace-pre-wrap break-words font-mono leading-relaxed ${
              mode === "json"
                ? "text-xs text-accent"
                : "text-[13px] text-text-primary"
            }`}
          >
            {displayText}
          </pre>
        )}
      </div>
    </div>
  );
}
