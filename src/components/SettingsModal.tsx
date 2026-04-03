import { useState, useEffect, useCallback } from "react";
import { X, Settings, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { getAIConfig, setAIConfig } from "../utils/ai";
import { useToast } from "./Toast";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function SettingsModal({ open, onClose }: Props) {
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("");
  const [showKey, setShowKey] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (open) {
      const config = getAIConfig();
      setApiKey(config.apiKey);
      setModel(config.model);
      setShowKey(false);
    }
  }, [open]);

  const handleSave = useCallback(() => {
    setAIConfig({ apiKey: apiKey.trim(), model: model.trim() });
    showToast("Settings saved", "success");
    onClose();
  }, [apiKey, model, onClose, showToast]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter" && e.metaKey) handleSave();
    },
    [onClose, handleSave]
  );

  if (!open) return null;

  const inputClass =
    "w-full border border-border bg-surface-1 px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary outline-none transition-[border-color,box-shadow] duration-150 ease-out focus:border-accent/50 focus:ring-1 focus:ring-accent/20";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onKeyDown={handleKeyDown}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 flex w-full max-w-md flex-col border border-border bg-surface-0 shadow-2xl mx-4">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <div className="flex items-center gap-2">
            <Settings size={15} className="text-accent" />
            <span className="text-sm font-semibold">AI Settings</span>
          </div>
          <button
            onClick={onClose}
            className="grid h-7 w-7 place-items-center text-text-tertiary
                       transition-[color,background-color] duration-150 ease-out
                       hover:bg-surface-2 hover:text-text-primary active:scale-95"
          >
            <X size={14} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-secondary">
              OpenRouter API Key
            </label>
            <p className="mb-2 text-[11px] text-text-tertiary leading-relaxed">
              Get a free key at{" "}
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                openrouter.ai/keys
              </a>
            </p>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-or-v1-..."
                className={`${inputClass} pr-9 font-mono text-xs`}
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors"
              >
                {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-text-secondary">
              Model
            </label>
            <p className="mb-2 text-[11px] text-text-tertiary leading-relaxed">
              OpenRouter model ID (e.g.{" "}
              <code className="text-accent/80">qwen/qwen-2.5-vl-72b-instruct:free</code>)
            </p>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="qwen/qwen-2.5-vl-72b-instruct:free"
              className={`${inputClass} font-mono text-xs`}
            />
          </div>

          {apiKey.trim() && model.trim() && (
            <div className="flex items-center gap-1.5 text-green-400 text-[11px]">
              <CheckCircle2 size={12} />
              <span>Ready to use AI features</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end border-t border-border px-5 py-3 gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-text-secondary
                       hover:text-text-primary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold
                       bg-accent text-white hover:brightness-110
                       transition-[transform,opacity,background-color] duration-150 ease-out
                       active:scale-[0.97]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
