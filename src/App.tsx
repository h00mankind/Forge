import { useCallback, useState } from "react";
import Header from "./components/Header";
import StylePanel from "./components/StylePanel";
import BuilderPanel from "./components/BuilderPanel";
import PreviewPanel from "./components/PreviewPanel";
import PastePromptModal from "./components/PastePromptModal";
import SettingsModal from "./components/SettingsModal";
import ResizeHandle from "./components/ResizeHandle";
import { usePromptStore } from "./hooks/usePromptStore";
import { templates } from "./data/templates";
import { generateRandomPrompt } from "./utils/randomPrompt";
import { generateCreativePrompt, hasAPIKey } from "./utils/ai";
import { detectStyleCategory } from "./utils/detectStyle";
import { useToast } from "./components/Toast";
import type { PromptType, PromptLayers } from "./hooks/usePromptStore";
import type { StyleCategoryId } from "./data/presets";

const LEFT_MIN = 180;
const LEFT_MAX = 360;
const LEFT_DEFAULT = 240;
const RIGHT_MIN = 300;
const RIGHT_MAX = 560;
const RIGHT_DEFAULT = 420;

export default function App() {
  const { state, setType, setLayer, loadLayers, reset } =
    usePromptStore();

  const [pasteOpen, setPasteOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [activeCategory, setActiveCategory] = useState<StyleCategoryId | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const [leftWidth, setLeftWidth] = useState(LEFT_DEFAULT);
  const [rightWidth, setRightWidth] = useState(RIGHT_DEFAULT);

  const { showToast } = useToast();

  const handleLeftResize = useCallback((delta: number) => {
    setLeftWidth((w) => Math.min(LEFT_MAX, Math.max(LEFT_MIN, w + delta)));
  }, []);

  const handleRightResize = useCallback((delta: number) => {
    setRightWidth((w) => Math.min(RIGHT_MAX, Math.max(RIGHT_MIN, w + delta)));
  }, []);

  const handleTypeChange = useCallback(
    (type: PromptType) => {
      setType(type);
      const template = templates[type];
      if (template) loadLayers(template);
    },
    [setType, loadLayers]
  );

  const handleImport = useCallback(
    (layers: Partial<PromptLayers>) => {
      loadLayers(layers);
      if (layers.style) {
        const detected = detectStyleCategory(layers.style);
        if (detected) setActiveCategory(detected);
      }
    },
    [loadLayers]
  );

  const handleSurprise = useCallback(() => {
    const result = generateRandomPrompt();
    setActiveCategory(result.categoryId);
    loadLayers(result.layers);
  }, [loadLayers]);

  const handleAIGenerate = useCallback(async () => {
    if (!hasAPIKey()) {
      setSettingsOpen(true);
      return;
    }
    setAiLoading(true);
    try {
      const styleName = activeCategory ?? undefined;
      const result = await generateCreativePrompt(styleName);
      if (result.categoryId) setActiveCategory(result.categoryId);
      loadLayers(result.layers);
      showToast("AI prompt generated", "success");
    } catch (err: unknown) {
      showToast((err as Error).message || "AI generation failed", "error");
    } finally {
      setAiLoading(false);
    }
  }, [activeCategory, loadLayers, showToast]);

  return (
    <div className="flex h-screen flex-col bg-surface-0">
      <Header
        onReset={reset}
        onPaste={() => setPasteOpen(true)}
        onSurprise={handleSurprise}
        onAIGenerate={handleAIGenerate}
        aiLoading={aiLoading}
        onOpenSettings={() => setSettingsOpen(true)}
        leftOpen={leftOpen}
        rightOpen={rightOpen}
        onToggleLeft={() => setLeftOpen(true)}
        onToggleRight={() => setRightOpen(true)}
      />

      <div className="flex flex-1 min-h-0 flex-col md:flex-row">
        {/* Panel 1: Purpose + Style */}
        <div
          className={`
            w-full md:h-full overflow-hidden border-r border-border
            transition-[width,min-width,opacity] duration-200 ease-out
            ${leftOpen
              ? "opacity-100"
              : "md:w-0 md:min-w-0 opacity-0 pointer-events-none md:pointer-events-none md:border-r-0"}
          `}
          style={leftOpen ? { width: leftWidth, minWidth: leftWidth, flexShrink: 0 } : undefined}
        >
          <StylePanel
            promptType={state.type}
            onTypeChange={handleTypeChange}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            styleValue={state.layers.style}
            onStyleChange={(v) => setLayer("style", v)}
            onCollapse={() => setLeftOpen(false)}
          />
        </div>

        {leftOpen && (
          <ResizeHandle side="left" onResize={handleLeftResize} />
        )}

        {/* Panel 2: Refine */}
        <div className="flex-1 min-w-0 md:h-full h-[50vh]">
          <BuilderPanel
            layers={state.layers}
            setLayer={setLayer}
            styleCategory={activeCategory}
          />
        </div>

        {rightOpen && (
          <ResizeHandle side="right" onResize={handleRightResize} />
        )}

        {/* Panel 3: Output */}
        <div
          className={`
            w-full md:h-full overflow-hidden border-l border-border
            transition-[width,min-width,opacity] duration-200 ease-out
            ${rightOpen
              ? "opacity-100"
              : "md:w-0 md:min-w-0 opacity-0 pointer-events-none md:pointer-events-none md:border-l-0"}
          `}
          style={rightOpen ? { width: rightWidth, minWidth: rightWidth, flexShrink: 0 } : undefined}
        >
          <PreviewPanel
            layers={state.layers}
            promptType={state.type}
            onCollapse={() => setRightOpen(false)}
          />
        </div>
      </div>

      <PastePromptModal
        open={pasteOpen}
        onClose={() => setPasteOpen(false)}
        onImport={handleImport}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
