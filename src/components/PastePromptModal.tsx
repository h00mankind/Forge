import { useState, useCallback, useRef, useEffect, memo } from "react";
import {
  X,
  ClipboardPaste,
  ArrowRight,
  ImagePlus,
  Sparkles,
  Loader2,
  Upload,
  FileText,
} from "lucide-react";
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

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter" && e.metaKey && preview) handleImport();
    },
    [onClose, preview, handleImport]
  );

  if (!open) return null;

  const filledFields = preview
    ? Object.entries(preview).filter(([, v]) => v && v.trim())
    : [];

  const hasKey = hasAPIKey();
  const tabClass = (t: Tab) =>
    `px-3 py-1.5 text-[12px] font-semibold transition-[color,background-color] duration-150 ease-out ${
      tab === t
        ? "bg-accent/12 text-accent"
        : "text-text-tertiary hover:text-text-secondary hover:bg-surface-2/70"
    }`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onKeyDown={handleKeyDown}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 flex w-full max-w-2xl flex-col border border-border bg-surface-0 shadow-2xl mx-4 max-h-[80vh]">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <ClipboardPaste size={14} className="text-accent" />
            <span className="text-[14px] font-semibold">Import Prompt</span>
            <div className="flex gap-0.5 ml-2">
              <button onClick={() => setTab("text")} className={tabClass("text")}>
                <span className="flex items-center gap-1.5">
                  <FileText size={11} />
                  Text
                </span>
              </button>
              <button onClick={() => setTab("image")} className={tabClass("image")}>
                <span className="flex items-center gap-1.5">
                  <ImagePlus size={11} />
                  Image
                </span>
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-7 w-7 place-items-center text-text-tertiary
                       transition-[color,background-color] duration-150 ease-out
                       hover:bg-surface-2 hover:text-text-secondary active:scale-95"
          >
            <X size={13} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {tab === "text" && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[12px] font-semibold text-text-secondary">
                  Paste your prompt below
                </label>
                {hasKey && (
                  <button
                    onClick={handleAIAnalyze}
                    disabled={loading || !text.trim()}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold
                                transition-[transform,opacity,background-color,color] duration-150 ease-out
                                active:scale-[0.97]
                                ${loading || !text.trim()
                                  ? "bg-surface-2 text-text-tertiary cursor-not-allowed opacity-50"
                                  : "bg-accent/12 text-accent hover:bg-accent/20"}`}
                  >
                    {loading ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                    Analyze with AI
                  </button>
                )}
              </div>
              <p className="mb-3 text-[11px] text-text-tertiary/70 leading-relaxed">
                Supports labeled format (<code className="text-accent/60">[Subject] ... [Lighting] ...</code>),
                JSON objects, or plain text.
                {hasKey && " Use \"Analyze with AI\" for smarter parsing."}
              </p>
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder={'[Subject] A striking fashion model...\n[Action] Posing with a confident stance...\n[Lighting] Three-point softbox setup...'}
                rows={6}
                className="w-full resize-none border border-border bg-surface-1/40 px-4 py-3 text-[13px] font-mono
                           text-text-primary placeholder:text-text-tertiary/30 outline-none
                           transition-[border-color,box-shadow] duration-150 ease-out
                           focus:border-accent/40 focus:ring-1 focus:ring-accent/15"
              />
            </div>
          )}

          {tab === "image" && (
            <div>
              {!imageData ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border border-dashed border-border hover:border-accent/30
                             bg-surface-1/20 hover:bg-accent-muted/20
                             flex flex-col items-center justify-center gap-3 py-14
                             transition-[border-color,background-color] duration-200 ease-out
                             cursor-pointer group"
                >
                  <div className="grid h-12 w-12 place-items-center bg-surface-2/60 text-text-tertiary
                                  group-hover:bg-accent/12 group-hover:text-accent transition-[background-color,color] duration-200">
                    <Upload size={18} />
                  </div>
                  <div className="text-center">
                    <p className="text-[13px] font-medium text-text-secondary group-hover:text-text-primary transition-colors">
                      Click to upload or drag and drop
                    </p>
                    <p className="mt-1.5 text-[11px] text-text-tertiary/60">
                      JPG, PNG, WebP up to 20MB
                    </p>
                  </div>
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-start gap-4 border border-border bg-surface-1/30 p-4">
                    {imagePreviewUrl && (
                      <img
                        src={imagePreviewUrl}
                        alt="Preview"
                        className="h-24 w-24 object-cover flex-shrink-0 border border-border"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-semibold text-text-primary truncate">
                        {imageData.name}
                      </p>
                      <p className="mt-1 text-[11px] text-text-tertiary">
                        {imageData.mimeType}
                      </p>
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={handleImageAnalyze}
                          disabled={loading}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold
                                      transition-[transform,opacity,background-color] duration-150 ease-out
                                      active:scale-[0.97]
                                      ${loading
                                        ? "bg-accent/50 text-white cursor-wait"
                                        : "bg-accent text-white hover:brightness-110"}`}
                        >
                          {loading ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                          {loading ? "Analyzing..." : "Extract Prompt"}
                        </button>
                        <button
                          onClick={() => {
                            setImageData(null);
                            setImagePreviewUrl(null);
                            setPreview(null);
                          }}
                          disabled={loading}
                          className="px-3 py-1.5 text-[11px] font-medium text-text-tertiary
                                     hover:text-text-secondary hover:bg-surface-2 transition-colors"
                        >
                          Remove
                        </button>
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
              className="w-full flex items-center gap-2.5 border border-accent/20 bg-accent/5 px-4 py-3 text-left
                         hover:bg-accent/8 transition-colors"
            >
              <Sparkles size={12} className="text-accent flex-shrink-0" />
              <span className="text-[11px] text-accent">
                Configure an API key in Settings to unlock AI-powered analysis
              </span>
            </button>
          )}

          {loading && tab === "text" && (
            <div className="flex items-center gap-2 text-accent text-[12px]">
              <Loader2 size={12} className="animate-spin" />
              <span>AI is analyzing your prompt...</span>
            </div>
          )}

          {filledFields.length > 0 && (
            <div>
              <span className="mb-2.5 block text-[10px] font-bold uppercase tracking-[0.12em] text-text-tertiary">
                Detected {filledFields.length} field{filledFields.length > 1 ? "s" : ""}
              </span>
              <div className="space-y-1">
                {filledFields.map(([key, value]) => (
                  <div
                    key={key}
                    className="flex gap-3 border border-border bg-surface-1/30 px-4 py-2.5"
                  >
                    <span className="flex-shrink-0 text-[11px] font-semibold text-accent w-28">
                      {FIELD_LABELS[key] ?? key}
                    </span>
                    <span className="text-[12px] text-text-secondary leading-relaxed line-clamp-2">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <span className="text-[11px] text-text-tertiary">
            {preview ? `${filledFields.length} fields ready` : "Waiting for input..."}
          </span>
          <button
            onClick={handleImport}
            disabled={!preview}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-[13px] font-semibold
                        transition-[transform,opacity,background-color] duration-150 ease-out
                        active:scale-[0.97]
                        ${preview
                          ? "bg-accent text-white hover:brightness-110"
                          : "bg-surface-2 text-text-tertiary cursor-not-allowed opacity-50"
                        }`}
          >
            Import
            <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
});
