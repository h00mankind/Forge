import { useState, useEffect, useCallback, memo } from "react";
import { Settings, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAIConfig, setAIConfig } from "../utils/ai";
import { useToast } from "./Toast";

interface Props {
  open: boolean;
  onClose: () => void;
}

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

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5">
            <Settings size={14} className="text-primary" />
            AI Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-muted-foreground">
              OpenRouter API Key
            </label>
            <p className="mb-2.5 text-[11px] text-tertiary leading-relaxed">
              Get a free key at{" "}
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                openrouter.ai/keys
              </a>
            </p>
            <div className="relative">
              <Input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-or-v1-..."
                className="pr-9 font-mono text-[12px]"
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showKey ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[12px] font-semibold text-muted-foreground">
              Model
            </label>
            <p className="mb-2.5 text-[11px] text-tertiary leading-relaxed">
              OpenRouter model ID (e.g.{" "}
              <code className="text-primary/70 bg-primary/5 px-1 py-0.5">qwen/qwen-2.5-vl-72b-instruct:free</code>)
            </p>
            <Input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="qwen/qwen-2.5-vl-72b-instruct:free"
              className="font-mono text-[12px]"
            />
          </div>

          {apiKey.trim() && model.trim() && (
            <div className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
              <CheckCircle2 size={11} />
              <span>Ready to use AI features</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
