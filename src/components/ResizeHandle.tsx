import { useCallback, useRef } from "react";

interface Props {
  onResize: (delta: number) => void;
  side: "left" | "right";
}

export default function ResizeHandle({ onResize, side }: Props) {
  const dragging = useRef(false);
  const lastX = useRef(0);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      dragging.current = true;
      lastX.current = e.clientX;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);

      const onMove = (ev: PointerEvent) => {
        if (!dragging.current) return;
        const delta = ev.clientX - lastX.current;
        lastX.current = ev.clientX;
        onResize(side === "left" ? delta : -delta);
      };

      const onUp = () => {
        dragging.current = false;
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerup", onUp);
      };

      document.addEventListener("pointermove", onMove);
      document.addEventListener("pointerup", onUp);
    },
    [onResize, side]
  );

  return (
    <div
      onPointerDown={onPointerDown}
      className="hidden md:flex w-1.5 flex-shrink-0 cursor-col-resize items-center justify-center
                 group hover:bg-accent/10 active:bg-accent/20
                 transition-colors duration-100"
    >
      <div className="h-8 w-0.5 bg-border group-hover:bg-accent/50 group-active:bg-accent transition-colors duration-100" />
    </div>
  );
}
