import { useState, useEffect, useCallback, memo } from "react";
import { X, Settings, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { getAIConfig, setAIConfig } from "../utils/ai";
import { useToast } from "./Toast";

interface Props {
  open: boolean;
  onClose: () => void;
}

const INPUT_CLASS =
  "w-full border border-border bg-surface-1/60 px-3 py-2.5 text-[13px] text-text-primary placeholder:text-text-tertiary/40 outline-none transition-[border-color,box-shadow] duration-150 ease-out focus:border-accent/40 focus:ring-1 focus:ring-accent/15";

export default memo(function SettingsModal({ open, onClose }: Props) {
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onKeyDown={handleKeyDown}
    >
      <div className="absolute inset-0 animate-[reduced-fade-in_180ms_ease-out_forwards] bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="panel-enter relative z-10 mx-4 flex w-full max-w-md flex-col border border-border bg-surface-0 shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2.5">
            <Settings size={14} className="text-accent" />
            <span className="text-[14px] font-semibold">AI Settings</span>
          </div>
          <button
            onClick={onClose}
            className="surface-lift grid h-7 w-7 place-items-center text-text-tertiary
                       hover:bg-surface-2 hover:text-text-secondary"
          >
            <X size={13} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-text-secondary">
              OpenRouter API Key
            </label>
            <p className="mb-2.5 text-[11px] text-text-tertiary leading-relaxed">
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
                className={`${INPUT_CLASS} pr-9 font-mono text-[12px]`}
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
              >
                {showKey ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-text-secondary">
              Model
            </label>
            <p className="mb-2.5 text-[11px] text-text-tertiary leading-relaxed">
              OpenRouter model ID (e.g.{" "}
              <code className="text-accent/70 bg-accent/5 px-1 py-0.5">qwen/qwen-2.5-vl-72b-instruct:free</code>)
            </p>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="qwen/qwen-2.5-vl-72b-instruct:free"
              className={`${INPUT_CLASS} font-mono text-[12px]`}
            />
          </div>

          {apiKey.trim() && model.trim() && (
            <div className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
              <CheckCircle2 size={11} />
              <span>Ready to use AI features</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end border-t border-border px-6 py-4 gap-2">
          <button
            onClick={onClose}
            className="surface-lift px-3 py-1.5 text-[13px] font-medium text-text-tertiary
                       hover:text-text-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="surface-lift inline-flex items-center gap-1.5 bg-accent px-4 py-1.5 text-[13px] font-semibold
                       text-white hover:brightness-110"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
});
