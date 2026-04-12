import { useState, useCallback, useRef, useEffect, memo } from "react";
import {
  ClipboardPaste,
  ArrowRight,
  ImagePlus,
  Sparkles,
  Loader2,
  Upload,
  FileText,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { parsePromptInput } from "../utils/parsePrompt";
import { parsePromptWithAI, extractPromptFromImage, hasAPIKey } from "../utils/ai";
import { useToast } from "./Toast";
import type { PromptLayers } from "../hooks/usePromptStore";

type Tab = "text" | "image";

interface Props {
  open: boolean;
  onClose: () => void;
  onImport: (layers: Partial<PromptLayers>) => void;
  onOpenSettings: () => void;
}

const FIELD_LABELS: Record<string, string> = {
  subject: "Subject",
  action: "Action / Pose",
  setting: "Setting",
  composition: "Composition",
  lighting: "Lighting",
  camera: "Camera / Lens",
  color: "Color / Film",
  material: "Material / Texture",
  style: "Style",
  textContent: "Text Content",
  textFont: "Text Font",
  textPlacement: "Text Placement",
};

export default memo(function PastePromptModal({ open, onClose, onImport, onOpenSettings }: Props) {
  const [tab, setTab] = useState<Tab>("text");
  const [text, setText] = useState("");
  const [preview, setPreview] = useState<Partial<PromptLayers> | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageData, setImageData] = useState<{ base64: string; mimeType: string; name: string } | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (open) {
      setText("");
      setPreview(null);
      setLoading(false);
      setImageData(null);
      setImagePreviewUrl(null);
      setTab("text");
      setTimeout(() => textareaRef.current?.focus(), 60);
    } else {
      abortRef.current?.abort();
    }
  }, [open]);

  const handleTextChange = useCallback((value: string) => {
    setText(value);
    const parsed = parsePromptInput(value);
    const hasContent = Object.values(parsed).some((v) => v && v.trim());
    setPreview(hasContent ? parsed : null);
  }, []);

  const handleAIAnalyze = useCallback(async () => {
    if (!text.trim()) return;
    if (!hasAPIKey()) {
      onClose();
      onOpenSettings();
      return;
    }
    setLoading(true);
    abortRef.current = new AbortController();
    try {
      const result = await parsePromptWithAI(text, abortRef.current.signal);
      const hasContent = Object.values(result).some((v) => v && v.trim());
      setPreview(hasContent ? result : null);
      if (!hasContent) showToast("AI could not extract any fields from this text.", "error");
    } catch (err: unknown) {
      if ((err as Error).name !== "AbortError") {
        showToast((err as Error).message || "AI analysis failed", "error");
      }
    } finally {
      setLoading(false);
    }
  }, [text, onClose, onOpenSettings, showToast]);

  const handleImageSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      showToast("Please select an image file (JPG, PNG, WebP)", "error");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      showToast("Image too large. Maximum size is 20MB.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(",")[1];
      setImageData({ base64, mimeType: file.type, name: file.name });
      setImagePreviewUrl(dataUrl);
      setPreview(null);
    };
    reader.readAsDataURL(file);
  }, [showToast]);

  const handleImageAnalyze = useCallback(async () => {
    if (!imageData) return;
    if (!hasAPIKey()) {
      onClose();
      onOpenSettings();
      return;
    }
    setLoading(true);
    abortRef.current = new AbortController();
    try {
      const result = await extractPromptFromImage(
        imageData.base64,
        imageData.mimeType,
        abortRef.current.signal
      );
      const hasContent = Object.values(result).some((v) => v && v.trim());
      setPreview(hasContent ? result : null);
      if (!hasContent) showToast("AI could not extract prompt data from this image.", "error");
    } catch (err: unknown) {
      if ((err as Error).name !== "AbortError") {
        showToast((err as Error).message || "Image analysis failed", "error");
      }
    } finally {
      setLoading(false);
    }
  }, [imageData, onClose, onOpenSettings, showToast]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) {
        setTab("image");
        handleImageSelect(file);
      }
    },
    [handleImageSelect]
  );

  const handleImport = useCallback(() => {
    if (!preview) return;
    onImport(preview);
    onClose();
  }, [preview, onImport, onClose]);

  const filledFields = preview
    ? Object.entries(preview).filter(([, v]) => v && v.trim())
    : [];

  const hasKey = hasAPIKey();

  const tabBtnClass = (t: Tab) =>
    `rounded-full px-3 text-[12px] font-semibold ${
      tab === t
        ? "bg-background text-foreground shadow-sm hover:bg-background"
        : "text-muted-foreground hover:text-foreground hover:bg-transparent"
    }`;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent
        className="max-w-2xl max-h-[80vh] flex flex-col"
        onDrop={handleDrop}
        onDragOver={(e: React.DragEvent) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <ClipboardPaste size={14} className="text-primary" />
            Import Prompt
            <div className="inline-flex rounded-full bg-muted p-0.5 ml-2">
              <Button variant="ghost" size="xs" onClick={() => setTab("text")} className={tabBtnClass("text")}>
                <FileText size={11} />
                Text
              </Button>
              <Button variant="ghost" size="xs" onClick={() => setTab("image")} className={tabBtnClass("image")}>
                <ImagePlus size={11} />
                Image
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4">
          {tab === "text" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-semibold text-muted-foreground">
                  Paste your prompt below
                </label>
                {hasKey && (
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={handleAIAnalyze}
                    disabled={loading || !text.trim()}
                    className="gap-1.5 text-[11px] font-semibold text-primary"
                  >
                    {loading ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                    Analyze with AI
                  </Button>
                )}
              </div>
              <p className="text-[11px] text-tertiary/70 leading-relaxed">
                Supports labeled format (<code className="text-primary/60">[Subject] ... [Lighting] ...</code>),
                JSON objects, or plain text.
                {hasKey && " Use \"Analyze with AI\" for smarter parsing."}
              </p>
              <Textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder={'[Subject] A striking fashion model...\n[Action] Posing with a confident stance...\n[Lighting] Three-point softbox setup...'}
                rows={6}
                className="px-4 py-3 text-[13px] font-mono"
              />
            </div>
          )}

          {tab === "image" && (
            <div>
              {!imageData ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border border-dashed border-border hover:border-primary/30
                             bg-card/20 hover:bg-primary/5
                             flex flex-col items-center justify-center gap-3 py-14
                             cursor-pointer group"
                >
                  <div className="grid h-12 w-12 place-items-center bg-muted/60 text-tertiary
                                  group-hover:bg-primary/12 group-hover:text-primary transition-[background-color,color] duration-200">
                    <Upload size={18} />
                  </div>
                  <div className="text-center">
                    <p className="text-[13px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                      Click to upload or drag and drop
                    </p>
                    <p className="mt-1.5 text-[11px] text-tertiary/60">
                      JPG, PNG, WebP up to 20MB
                    </p>
                  </div>
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-start gap-4 border border-border bg-card/30 p-4">
                    {imagePreviewUrl && (
                      <img
                        src={imagePreviewUrl}
                        alt="Preview"
                        className="h-24 w-24 object-cover flex-shrink-0 border border-border"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-foreground truncate">
                        {imageData.name}
                      </p>
                      <p className="mt-1 text-[11px] text-tertiary">
                        {imageData.mimeType}
                      </p>
                      <div className="mt-3 flex gap-2">
                        <Button
                          size="xs"
                          onClick={handleImageAnalyze}
                          disabled={loading}
                          className="gap-1.5 text-[11px] font-semibold"
                        >
                          {loading ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                          {loading ? "Analyzing..." : "Extract Prompt"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          onClick={() => {
                            setImageData(null);
                            setImagePreviewUrl(null);
                            setPreview(null);
                          }}
                          disabled={loading}
                          className="text-[11px] font-medium text-tertiary"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageSelect(file);
                  e.target.value = "";
                }}
              />
            </div>
          )}

          {!hasKey && (
            <button
              onClick={() => { onClose(); onOpenSettings(); }}
              className="w-full flex items-center gap-2.5 border border-primary/20 bg-primary/5 px-4 py-3 text-left
                         hover:bg-primary/8"
            >
              <Sparkles size={12} className="text-primary flex-shrink-0" />
              <span className="text-[11px] text-primary">
                Configure an API key in Settings to unlock AI-powered analysis
              </span>
            </button>
          )}

          {loading && tab === "text" && (
            <div className="flex items-center gap-2 text-primary text-[12px]">
              <Loader2 size={12} className="animate-spin" />
              <span>AI is analyzing your prompt...</span>
            </div>
          )}

          {filledFields.length > 0 && (
            <div>
              <span className="mb-2.5 block text-[10px] font-bold uppercase tracking-[0.12em] text-tertiary">
                Detected {filledFields.length} field{filledFields.length > 1 ? "s" : ""}
              </span>
              <div className="stagger-in space-y-1">
                {filledFields.map(([key, value]) => (
                  <div
                    key={key}
                    className="flex gap-3 border border-border bg-card/30 px-4 py-2.5"
                  >
                    <span className="flex-shrink-0 text-[11px] font-semibold text-primary w-28">
                      {FIELD_LABELS[key] ?? key}
                    </span>
                    <span className="text-[12px] text-muted-foreground leading-relaxed line-clamp-2">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-row items-center justify-between sm:justify-between">
          <span className="text-[11px] text-tertiary">
            {preview ? `${filledFields.length} fields ready` : "Waiting for input..."}
          </span>
          <Button
            onClick={handleImport}
            disabled={!preview}
            className="gap-1.5"
          >
            Import
            <ArrowRight size={12} />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
