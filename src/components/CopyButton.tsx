import { useState, useCallback, memo } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  getText: () => string;
  label?: string;
}

export default memo(function CopyButton({ getText, label = "Copy" }: Props) {
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
    <Button
      variant="outline"
      size="xs"
      onClick={handleCopy}
      className={copied ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : ""}
    >
      {copied ? <Check size={11} /> : <Copy size={11} />}
      {copied ? "Copied" : label}
    </Button>
  );
});
