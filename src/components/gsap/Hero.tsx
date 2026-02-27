"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { HeroCanvas } from "@/components/three/HeroCanvas";
import { usePreloaderDone } from "@/components/ui/LayoutClient";

export function Hero() {
  const isReady = usePreloaderDone();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isReady) return;
    const tl = gsap.timeline({ delay: 0.3 });

    tl.fromTo(
      lineRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 1.2, ease: "power4.inOut", transformOrigin: "left" }
    )
      .fromTo(
        headingRef.current,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power4.out" },
        "-=0.6"
      )
      .fromTo(
        subRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
        "-=0.6"
      )
      .fromTo(
        ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
        "-=0.4"
      );
  }, [isReady]);

  return (
    <section className="relative min-h-screen flex items-end pb-20 px-8 overflow-hidden bg-mahis-black">
      {/* WebGL background */}
      <HeroCanvas />

      {/* Gradient vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-mahis-black via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-mahis-black/60 via-transparent to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-[90vw]">
        {/* Horizontal rule */}
        <div
          ref={lineRef}
          className="w-24 h-px bg-mahis-gold mb-8"
          style={{ transformOrigin: "left" }}
        />

        <h1
          ref={headingRef}
          className="font-display text-fluid-4xl text-mahis-white leading-[0.9] tracking-tight mb-8 max-w-4xl"
        >
          Brand elevation
          <br />
          <span className="italic text-mahis-cream">through</span> web
          <br />
          experience
        </h1>

        <p
          ref={subRef}
          className="font-body text-fluid-base text-mahis-grey-light max-w-sm mb-12 leading-relaxed"
        >
          Mahis is a boutique studio crafting immersive digital experiences
          for luxury brands and creative agencies.
        </p>

        <div ref={ctaRef} className="flex items-center gap-8">
          <a
            href="/work"
            className="font-body text-fluid-xs tracking-widest uppercase text-mahis-white border-b border-mahis-gold pb-1 hover:text-mahis-gold transition-colors duration-300"
          >
            View selected work
          </a>
          <a
            href="/contact"
            className="font-body text-fluid-xs tracking-widest uppercase bg-mahis-gold text-mahis-black px-6 py-3 hover:bg-mahis-gold-light transition-colors duration-300"
          >
            Start a project →
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 flex flex-col items-center gap-2 opacity-40">
        <span className="font-mono text-mahis-grey-light text-[10px] tracking-widest uppercase rotate-90 origin-center mb-4">
          Scroll
        </span>
        <div className="w-px h-12 bg-mahis-grey-light animate-pulse" />
      </div>
    </section>
  );
}
