import { useRef, useCallback } from "react";
import { prepare, layout } from "@chenglou/pretext";

interface MeasureResult {
  height: number;
  lineCount: number;
}

const FONT_MONO = '400 13px "Geist Mono", ui-monospace, monospace';
const FONT_MONO_SM = '400 12px "Geist Mono", ui-monospace, monospace';
const LINE_HEIGHT = 1.7;
const LINE_HEIGHT_SM = 1.6;

export function useTextMeasure() {
  const cacheRef = useRef<Map<string, ReturnType<typeof prepare>>>(new Map());

  const measure = useCallback(
    (text: string, width: number, variant: "default" | "json" = "default"): MeasureResult => {
      if (!text || width <= 0) return { height: 0, lineCount: 0 };

      const font = variant === "json" ? FONT_MONO_SM : FONT_MONO;
      const lh = variant === "json" ? LINE_HEIGHT_SM : LINE_HEIGHT;
      const cacheKey = `${variant}:${text}`;

      let prepared = cacheRef.current.get(cacheKey);
      if (!prepared) {
        prepared = prepare(text, font, { whiteSpace: "pre-wrap" });
        cacheRef.current.set(cacheKey, prepared);
        if (cacheRef.current.size > 50) {
          const first = cacheRef.current.keys().next().value;
          if (first) cacheRef.current.delete(first);
        }
      }

      const fontSize = variant === "json" ? 12 : 13;
      return layout(prepared, width, fontSize * lh);
    },
    []
  );

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  return { measure, clearCache };
}

