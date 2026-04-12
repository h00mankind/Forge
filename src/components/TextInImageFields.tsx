import { memo } from "react";
import { Type } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Props {
  textContent: string;
  textFont: string;
  textPlacement: string;
  onChange: (key: "textContent" | "textFont" | "textPlacement", value: string) => void;
}

export default memo(function TextInImageFields({
  textContent,
  textFont,
  textPlacement,
  onChange,
}: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-tertiary">
        <Type size={12} />
        <span className="text-[10px] font-bold uppercase tracking-[0.12em]">
          Text in Image
        </span>
      </div>
      <div className="space-y-2">
        <div>
          <label className="mb-1.5 block text-[11px] font-medium text-muted-foreground">
            Text Content
          </label>
          <Input
            type="text"
            value={textContent}
            onChange={(e) => onChange("textContent", e.target.value)}
            placeholder={'"URBAN EXPLORER"'}
            className="px-3 py-2.5 text-[13px]"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="mb-1.5 block text-[11px] font-medium text-muted-foreground">
              Font
            </label>
            <Input
              type="text"
              value={textFont}
              onChange={(e) => onChange("textFont", e.target.value)}
              placeholder="bold white sans-serif"
              className="px-3 py-2.5 text-[13px]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-medium text-muted-foreground">
              Placement
            </label>
            <Input
              type="text"
              value={textPlacement}
              onChange={(e) => onChange("textPlacement", e.target.value)}
              placeholder="centered at the top third"
              className="px-3 py-2.5 text-[13px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
});
