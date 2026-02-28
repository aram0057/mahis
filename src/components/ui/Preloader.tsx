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

    // All paths start fully covering the screen (points at 100 = bottom fills up to top)
    const allPoints: number[][] = [
      Array(numPoints).fill(100),
      Array(numPoints).fill(100),
    ];

    const paths = [path1Ref.current, path2Ref.current];

    // Render function — redraws SVG paths each tick
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

    // Initialise — draw paths in closed (covering) state
    render();

    // Counter animation
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

    // After counter — sweep the wave off screen
    const tl = gsap.timeline({
      delay: 1.8,
      onUpdate: render,
      defaults: { ease: "power2.inOut", duration: 0.9 },
      onComplete: () => {
        // Fade out the studio name text then call onComplete
        gsap.to(studioRef.current, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => onComplete(),
        });
      },
    });

    // Randomise point delays for organic wave
    for (let i = 0; i < numPoints; i++) {
      pointsDelay[i] = Math.random() * delayPointsMax;
    }

    // Animate each path's points to 0 (sweep upward off screen)
    for (let i = 0; i < numPaths; i++) {
      const points = allPoints[i];
      const pathDelay = delayPerPath * (numPaths - i - 1);

      for (let j = 0; j < numPoints; j++) {
        const delay = pointsDelay[j];
        tl.to(
          points,
          { [j]: 0 },
          delay + pathDelay
        );
      }
    }

    return () => {
      tl.kill();
    };
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
        <defs>
          {/* Mahis yellow gradient — path 2 (back) */}
          <linearGradient id="mahis-gradient-1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2952E3" />
            <stop offset="100%" stopColor="#4D6FE8" />
          </linearGradient>
          {/* Mahis dark gradient — path 1 (front) */}
          <linearGradient id="mahis-gradient-2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0D0D0D" />
            <stop offset="100%" stopColor="#2A2A2A" />
          </linearGradient>
        </defs>

        {/* Back path — gold */}
        <path ref={path2Ref} fill="url(#mahis-gradient-1)" />
        {/* Front path — dark, reveals first */}
        <path ref={path1Ref} fill="url(#mahis-gradient-2)" />
      </svg>

      {/* Studio name + counter — sits above wave */}
      <div
        ref={studioRef}
        className="fixed inset-0 z-10 flex flex-col items-center justify-center pointer-events-none"
      >
        <p className="font-display text-mahis-white text-fluid-3xl italic tracking-tight mb-6">
          Mahis
        </p>
        <div className="flex items-center gap-3">
          <div className="w-12 h-px bg-mahis-gold" />
          <span
            ref={counterRef}
            className="font-mono text-mahis-gold text-fluid-xs tracking-widest"
          >
            000
          </span>
          <div className="w-12 h-px bg-mahis-gold" />
        </div>
      </div>
    </div>
  );
}
