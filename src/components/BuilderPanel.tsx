import { memo } from "react";
import {
  User,
  Zap,
  MapPin,
  Frame,
  Lightbulb,
  Camera,
  Palette,
  Box,
} from "lucide-react";
import LayerAccordion from "./LayerAccordion";
import PresetChips from "./PresetChips";
import TextInImageFields from "./TextInImageFields";
import SubStyleBar from "./SubStyleBar";
import {
  compositionPresets,
  lightingPresets,
  cameraPresets,
  colorPresets,
  materialExamples,
} from "../data/presets";
import type { StyleCategoryId } from "../data/presets";
import { stylePlaceholders, defaultPlaceholders } from "../data/stylePlaceholders";
import type { PromptLayers, LayerKey } from "../hooks/usePromptStore";

interface Props {
  layers: PromptLayers;
  setLayer: (key: LayerKey, value: string) => void;
  styleCategory: StyleCategoryId | null;
}

type PlaceholderKey = keyof typeof defaultPlaceholders;

function ph(category: StyleCategoryId | null, key: PlaceholderKey): string {
  if (category && stylePlaceholders[category]) {
    return stylePlaceholders[category][key];
  }
  return defaultPlaceholders[key];
}

export default memo(function BuilderPanel({ layers, setLayer, styleCategory }: Props) {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <SubStyleBar
        activeCategory={styleCategory}
        onSelectStyle={(v) => setLayer("style", v)}
      />

      <div className="flex-1 overflow-y-auto p-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          <LayerAccordion
            icon={<User size={14} />}
            title="Subject"
            description="Who or what is the main focus"
            filled={!!layers.subject.trim()}
            value={layers.subject}
            onChange={(v) => setLayer("subject", v)}
            placeholder={ph(styleCategory, "subject")}
            defaultOpen
          />

          <LayerAccordion
            icon={<Zap size={14} />}
            title="Action / Pose"
            description="What is happening"
            filled={!!layers.action.trim()}
            value={layers.action}
            onChange={(v) => setLayer("action", v)}
            placeholder={ph(styleCategory, "action")}
          />

          <LayerAccordion
            icon={<MapPin size={14} />}
            title="Setting"
            description="Where, what environment"
            filled={!!layers.setting.trim()}
            value={layers.setting}
            onChange={(v) => setLayer("setting", v)}
            placeholder={ph(styleCategory, "setting")}
          />

          <LayerAccordion
            icon={<Frame size={14} />}
            title="Composition"
            description="Framing, angle, distance"
            filled={!!layers.composition.trim()}
            value={layers.composition}
            onChange={(v) => setLayer("composition", v)}
            placeholder={ph(styleCategory, "composition")}
          >
            <PresetChips
              presets={compositionPresets}
              onSelect={(p) => setLayer("composition", p)}
            />
          </LayerAccordion>

          <LayerAccordion
            icon={<Lightbulb size={14} />}
            title="Lighting"
            description="How the scene is lit"
            filled={!!layers.lighting.trim()}
            value={layers.lighting}
            onChange={(v) => setLayer("lighting", v)}
            placeholder={ph(styleCategory, "lighting")}
          >
            <PresetChips
              presets={lightingPresets}
              onSelect={(p) => setLayer("lighting", p)}
            />
          </LayerAccordion>

          <LayerAccordion
            icon={<Camera size={14} />}
            title="Camera / Lens"
            description="Hardware and focal length"
            filled={!!layers.camera.trim()}
            value={layers.camera}
            onChange={(v) => setLayer("camera", v)}
            placeholder={ph(styleCategory, "camera")}
          >
            <PresetChips
              presets={cameraPresets}
              onSelect={(p) => setLayer("camera", p)}
            />
          </LayerAccordion>

          <LayerAccordion
            icon={<Palette size={14} />}
            title="Color / Film"
            description="Grading, film stock, palette"
            filled={!!layers.color.trim()}
            value={layers.color}
            onChange={(v) => setLayer("color", v)}
            placeholder={ph(styleCategory, "color")}
          >
            <PresetChips
              presets={colorPresets}
              onSelect={(p) => setLayer("color", p)}
            />
          </LayerAccordion>

          <LayerAccordion
            icon={<Box size={14} />}
            title="Material / Texture"
            description="Physical surfaces and finishes"
            filled={!!layers.material.trim()}
            value={layers.material}
            onChange={(v) => setLayer("material", v)}
            placeholder={ph(styleCategory, "material")}
          >
            <PresetChips
              presets={materialExamples}
              onSelect={(p) => setLayer("material", p)}
            />
          </LayerAccordion>

          <div className="lg:col-span-2 border border-border bg-transparent p-5">
            <TextInImageFields
              textContent={layers.textContent}
              textFont={layers.textFont}
              textPlacement={layers.textPlacement}
              onChange={(key, value) => setLayer(key, value)}
            />
          </div>
        </div>

        <div className="h-5 flex-shrink-0" />
      </div>
    </div>
  );
});
