"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

type QuickToFn = (value: number) => void;

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    const lerp = 0.08;

    // Dot follows mouse instantly
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.set(dot, { x: mouseX, y: mouseY });
    };

    // Ring follows with lerp via GSAP ticker
    const tick = () => {
      ringX += (mouseX - ringX) * lerp;
      ringY += (mouseY - ringY) * lerp;
      gsap.set(ring, { x: ringX, y: ringY });
    };
    gsap.ticker.add(tick);

    // Hover states via event delegation (mouseover/mouseout bubble)
    const onMouseOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a, button, [data-cursor]")) {
        gsap.to(ring, { width: 80, height: 80, opacity: 0.2, duration: 0.3, ease: "power2.out" });
        gsap.to(dot, { opacity: 0, duration: 0.2 });
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a, button, [data-cursor]")) {
        gsap.to(ring, { width: 40, height: 40, opacity: 0.4, duration: 0.3, ease: "power2.out" });
        gsap.to(dot, { opacity: 1, duration: 0.2 });
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    // Magnetic effect — set up after DOM settles
    const magneticCleanups: (() => void)[] = [];

    const setupMagnetic = () => {
      const magneticEls = document.querySelectorAll<HTMLElement>("[data-magnetic]");

      magneticEls.forEach((el) => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" }) as QuickToFn;
        const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" }) as QuickToFn;

        const onMove = (e: MouseEvent) => {
          const rect = el.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          xTo((e.clientX - cx) * 0.3);
          yTo((e.clientY - cy) * 0.3);
        };

        const onLeave = () => {
          xTo(0);
          yTo(0);
        };

        el.addEventListener("mousemove", onMove);
        el.addEventListener("mouseleave", onLeave);
        magneticCleanups.push(() => {
          el.removeEventListener("mousemove", onMove);
          el.removeEventListener("mouseleave", onLeave);
        });
      });
    };

    // Small delay so components have mounted
    const t = setTimeout(setupMagnetic, 600);

    return () => {
      clearTimeout(t);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      gsap.ticker.remove(tick);
      magneticCleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <>
      {/* Dot — 4px, exact follow */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        aria-hidden
        style={{
          width: 4,
          height: 4,
          borderRadius: "50%",
          backgroundColor: "#FFE500",
        }}
      />
      {/* Ring — 40px, lerp follow */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2"
        aria-hidden
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "1px solid #FFE500",
          opacity: 0.4,
        }}
      />
    </>
  );
}
