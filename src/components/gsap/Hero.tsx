"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LaptopCanvas } from "@/components/three/LaptopCanvas";
import { usePreloaderDone } from "@/components/ui/LayoutClient";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const isReady = usePreloaderDone();
  const [isMobile, setIsMobile] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<number>(0);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  // Detect mobile on mount
  useEffect(() => {
    setIsMobile(window.innerWidth < 1024);
  }, []);

  // ── Main effect: desktop scroll sequence ──────────────────────────────
  useEffect(() => {
    if (!isReady) return;
    if (isMobile) return;

    if (!sectionRef.current) return;

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "+=300%",
      pin: true,
      scrub: 0.8,
      onUpdate: (self) => {
        const p = self.progress;
        progressRef.current = p;

        // Background MAHIS text: fade out by p=0.20
        gsap.set(bgTextRef.current, {
          opacity: Math.max(0, 1 - p / 0.20),
        });

        // Canvas: fade out from p=0.90 → p=1.0
        gsap.set(canvasWrapperRef.current, {
          opacity: p > 0.90 ? Math.max(0, 1 - (p - 0.90) / 0.10) : 1,
        });

        // Scroll indicator: fade out by p=0.15
        gsap.set(scrollIndicatorRef.current, {
          opacity: Math.max(0, 1 - p / 0.15) * 0.4,
        });
      },
    });

    return () => {
      st.kill();
    };
  }, [isReady, isMobile]);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex items-center justify-center overflow-hidden bg-mahis-white"
    >
      {/* Background MAHIS Studio text — z-[1], behind canvas */}
      <div
        ref={bgTextRef}
        className="absolute inset-0 z-[1] flex flex-col items-center justify-center pointer-events-none select-none"
      >
        <p
          className="font-display leading-none text-mahis-gold/35 tracking-[0.25em]"
          style={{ fontSize: "18vw" }}
        >
          MAHIS
        </p>
        <p
          className="font-mono text-mahis-gold/50 uppercase tracking-[0.5em]"
          style={{ fontSize: "1.2vw" }}
        >
          Studio
        </p>
      </div>

      {/* Laptop + particle canvas — z-[2], desktop only */}
      {!isMobile && (
        <LaptopCanvas ref={canvasWrapperRef} progressRef={progressRef} />
      )}

      {/* Gradient vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-mahis-white/30 via-transparent to-transparent pointer-events-none z-10" />

      {/* Scroll indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 right-8 flex flex-col items-center gap-2 opacity-40 z-20"
      >
        <span className="font-mono text-mahis-grey-mid text-[10px] tracking-widest uppercase rotate-90 origin-center mb-4">
          Scroll
        </span>
        <div className="w-px h-12 bg-mahis-grey-mid animate-pulse" />
      </div>
    </section>
  );
}
