"use client";

import { useRef, forwardRef } from "react";
import { useLaptopScene } from "@/lib/useLaptopScene";

interface LaptopCanvasProps {
  progressRef: React.MutableRefObject<number>;
  onReady?: () => void;
}

// z-[2] so it sits above the background MAHIS text (z-[1])
// alpha:true renderer means transparent canvas pixels let the bg text show through
export const LaptopCanvas = forwardRef<HTMLDivElement, LaptopCanvasProps>(
  ({ progressRef, onReady }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useLaptopScene(canvasRef, { progressRef, onReady });

    return (
      <div ref={ref} className="absolute inset-0 z-[2]">
        <canvas ref={canvasRef} className="w-full h-full" aria-hidden />
      </div>
    );
  }
);

LaptopCanvas.displayName = "LaptopCanvas";
