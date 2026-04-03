import { useState, useCallback } from "react";
import { Copy, Check } from "lucide-react";

interface Props {
  getText: () => string;
  label?: string;
}

export default function CopyButton({ getText, label = "Copy" }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(getText());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard may be unavailable */
    }
  }, [getText]);

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium
                  transition-[transform,color,background-color,border-color] duration-150 ease-out
                  active:scale-[0.97] border
                  ${
                    copied
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      : "border-border bg-surface-2 text-text-secondary hover:bg-surface-3 hover:text-text-primary"
                  }`}
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "Copied" : label}
    </button>
  );
}
