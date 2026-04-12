import { useCallback, useState } from "react";
import Header from "./components/Header";
import StylePanel from "./components/StylePanel";
import BuilderPanel from "./components/BuilderPanel";
import PreviewPanel from "./components/PreviewPanel";
import PastePromptModal from "./components/PastePromptModal";
import SettingsModal from "./components/SettingsModal";
import ResizeHandle from "./components/ResizeHandle";
import CollapsedStrip from "./components/CollapsedStrip";
import { usePromptStore } from "./hooks/usePromptStore";
import { useMediaQuery } from "./hooks/useMediaQuery";
import { templates } from "./data/templates";
import { generateRandomPrompt } from "./utils/randomPrompt";
import { generateCreativePrompt, hasAPIKey } from "./utils/ai";
import { detectStyleCategory } from "./utils/detectStyle";
import { useToast } from "./components/Toast";
import type { PromptType, PromptLayers } from "./hooks/usePromptStore";
import type { StyleCategoryId } from "./data/presets";

const LEFT_MIN = 200;
const LEFT_MAX = 360;
const LEFT_DEFAULT = 250;
const RIGHT_MIN = 320;
const RIGHT_MAX = 560;
const RIGHT_DEFAULT = 420;

export default function App() {
  const { state, setType, setLayer, loadLayers, reset } = usePromptStore();

  const [pasteOpen, setPasteOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [activeCategory, setActiveCategory] = useState<StyleCategoryId | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const [leftWidth, setLeftWidth] = useState(LEFT_DEFAULT);
  const [rightWidth, setRightWidth] = useState(RIGHT_DEFAULT);

  const { showToast } = useToast();
  const isDesktop = useMediaQuery("(min-width: 768px)");

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

  const openPaste = useCallback(() => setPasteOpen(true), []);
  const closePaste = useCallback(() => setPasteOpen(false), []);
  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);
  const showLeft = useCallback(() => setLeftOpen(true), []);
  const hideLeft = useCallback(() => setLeftOpen(false), []);
  const showRight = useCallback(() => setRightOpen(true), []);
  const hideRight = useCallback(() => setRightOpen(false), []);

  return (
    <div className="app-shell flex h-screen flex-col bg-background">
      <Header
        onReset={reset}
        onPaste={openPaste}
        onSurprise={handleSurprise}
        onAIGenerate={handleAIGenerate}
        aiLoading={aiLoading}
        onOpenSettings={openSettings}
      />

      <div className="flex flex-1 min-h-0 flex-col md:flex-row">
        {leftOpen ? (
          <>
            <div
              className="panel-enter flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden border-b border-border md:h-full md:min-w-0 md:flex-none md:flex-shrink-0 md:border-b-0 md:border-r md:border-border"
              style={
                isDesktop
                  ? { width: leftWidth, minWidth: leftWidth, flexShrink: 0 }
                  : undefined
              }
            >
              <StylePanel
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                styleValue={state.layers.style}
                onStyleChange={(v) => setLayer("style", v)}
                onCollapse={hideLeft}
                onSelectStyle={(v) => setLayer("style", v)}
              />
            </div>
            <ResizeHandle side="left" onResize={handleLeftResize} />
          </>
        ) : (
          <CollapsedStrip side="left" label="Style" onExpand={showLeft} />
        )}

        <div className="panel-enter-delayed flex min-h-0 w-full min-w-0 flex-1 flex-col border-b border-border md:h-full md:flex-1 md:border-b-0">
          <BuilderPanel
            layers={state.layers}
            setLayer={setLayer}
            styleCategory={activeCategory}
          />
        </div>

        {rightOpen ? (
          <>
            <ResizeHandle side="right" onResize={handleRightResize} />
            <div
              className="panel-enter flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden border-border md:h-full md:min-w-0 md:flex-none md:flex-shrink-0 md:border-l md:border-border"
              style={
                isDesktop
                  ? { width: rightWidth, minWidth: rightWidth, flexShrink: 0 }
                  : undefined
              }
            >
              <PreviewPanel
                layers={state.layers}
                promptType={state.type}
                onTypeChange={handleTypeChange}
                onCollapse={hideRight}
              />
            </div>
          </>
        ) : (
          <CollapsedStrip side="right" label="Output" onExpand={showRight} />
        )}
      </div>

      <PastePromptModal
        open={pasteOpen}
        onClose={closePaste}
        onImport={handleImport}
        onOpenSettings={openSettings}
      />

      <SettingsModal
        open={settingsOpen}
        onClose={closeSettings}
      />
    </div>
  );
}
