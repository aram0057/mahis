"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const items = [
  "Brand Elevation",
  "Web Experience",
  "UI/UX Design",
  "Motion Design",
  "Three.js",
  "GSAP",
  "Digital Presence",
  "Brand Identity",
];

const allItems = [...items, ...items];

export function MarqueeStrip() {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const totalWidth = track.scrollWidth / 2;

    tweenRef.current = gsap.to(track, {
      x: -totalWidth,
      duration: 28,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
      },
    });

    const slow = () => tweenRef.current?.timeScale(0.3);
    const restore = () => tweenRef.current?.timeScale(1);

    const strip = track.parentElement;
    strip?.addEventListener("mouseenter", slow);
    strip?.addEventListener("mouseleave", restore);

    return () => {
      tweenRef.current?.kill();
      strip?.removeEventListener("mouseenter", slow);
      strip?.removeEventListener("mouseleave", restore);
    };
  }, []);

  return (
    <div
      data-section="marquee"
      className="overflow-hidden bg-mahis-black border-t border-b py-5 cursor-default"
      style={{ borderColor: "#1F1F1F", borderWidth: "1.5px 0" }}
    >
      <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
        {allItems.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-8 font-sans font-bold text-mahis-yellow uppercase tracking-mono px-8"
            style={{ fontSize: "clamp(0.65rem, 1vw, 0.75rem)", letterSpacing: "0.15em" }}
          >
            {item}
            <span className="text-mahis-yellow opacity-40 text-[0.55em]">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
