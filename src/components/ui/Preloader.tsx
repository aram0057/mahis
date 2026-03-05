"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const overlayRef = useRef<SVGSVGElement>(null);
  const path1Ref = useRef<SVGPathElement>(null);
  const path2Ref = useRef<SVGPathElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const studioRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!path1Ref.current || !path2Ref.current) return;

    const numPoints = 10;
    const numPaths = 2;
    const delayPointsMax = 0.3;
    const delayPerPath = 0.2;
    const pointsDelay: number[] = [];

    // All paths start fully covering the screen
    const allPoints: number[][] = [
      Array(numPoints).fill(100),
      Array(numPoints).fill(100),
    ];

    const paths = [path1Ref.current, path2Ref.current];

    function render() {
      for (let i = 0; i < numPaths; i++) {
        const path = paths[i];
        const points = allPoints[i];

        let d = `M 0 ${points[0]} C`;

        for (let j = 0; j < numPoints - 1; j++) {
          const p = ((j + 1) / (numPoints - 1)) * 100;
          const cp = p - (1 / (numPoints - 1)) * 100 / 2;
          d += ` ${cp} ${points[j]} ${cp} ${points[j + 1]} ${p} ${points[j + 1]}`;
        }

        d += ` V 0 H 0`;
        path.setAttribute("d", d);
      }
    }

    render();

    // Counter animation 0 → 100
    const counterObj = { val: 0 };
    gsap.to(counterObj, {
      val: 100,
      duration: 1.6,
      ease: "power2.inOut",
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = Math.round(counterObj.val)
            .toString()
            .padStart(3, "0");
        }
      },
    });

    // Wave sweep after counter
    const tl = gsap.timeline({
      delay: 1.8,
      onUpdate: render,
      defaults: { ease: "power2.inOut", duration: 0.9 },
      onComplete: () => {
        gsap.to(studioRef.current, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => onComplete(),
        });
      },
    });

    // Randomise point delays for organic wave shape
    for (let i = 0; i < numPoints; i++) {
      pointsDelay[i] = Math.random() * delayPointsMax;
    }

    // Animate each path's points to 0 (sweep upward off screen)
    for (let i = 0; i < numPaths; i++) {
      const points = allPoints[i];
      const pathDelay = delayPerPath * (numPaths - i - 1);

      for (let j = 0; j < numPoints; j++) {
        const delay = pointsDelay[j];
        tl.to(points, { [j]: 0 }, delay + pathDelay);
      }
    }

    return () => { tl.kill(); };
  }, [mounted, onComplete]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* SVG Wave overlay */}
      <svg
        ref={overlayRef}
        className="fixed inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        {/* Back path — dark, revealed after yellow sweeps away */}
        <path ref={path2Ref} fill="#0A0A0A" />
        {/* Front path — yellow, sweeps up first */}
        <path ref={path1Ref} fill="#FFE500" />
      </svg>

      {/* Studio name + counter */}
      <div
        ref={studioRef}
        className="fixed inset-0 z-10 flex flex-col items-center justify-center pointer-events-none"
      >
        <p
          className="font-sans font-bold text-mahis-black uppercase"
          style={{
            fontSize: "clamp(4rem, 10vw, 8rem)",
            letterSpacing: "-0.04em",
          }}
        >
          MAHIS
        </p>
        <div className="flex items-center gap-4 mt-6">
          <div className="w-16 h-px bg-mahis-black" />
          <span
            ref={counterRef}
            className="font-sans font-medium text-mahis-black text-fluid-xs uppercase tracking-mono"
          >
            000
          </span>
          <div className="w-16 h-px bg-mahis-black" />
        </div>
      </div>
    </div>
  );
}
