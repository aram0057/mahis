"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroCanvas } from "@/components/three/HeroCanvas";
import { LaptopCanvas } from "@/components/three/LaptopCanvas";
import { usePreloaderDone } from "@/components/ui/LayoutClient";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 24, suffix: "+", label: "Projects" },
  { value: 100, suffix: "%", label: "Custom" },
  { value: 4, suffix: "", label: "Years" },
];

export function Hero() {
  const isReady = usePreloaderDone();
  const [isMobile, setIsMobile] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<number>(0);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Individual refs for staggered entry
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const line3Ref = useRef<HTMLDivElement>(null);
  const subtextRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 1024);
  }, []);

  // Hide everything immediately so there's no flash before preloader clears
  useEffect(() => {
    gsap.set(
      [eyebrowRef.current, subtextRef.current, ctasRef.current, scrollIndicatorRef.current],
      { opacity: 0, y: 20 }
    );
    gsap.set([line1Ref.current, line2Ref.current, line3Ref.current], { opacity: 0, y: 120 });
    gsap.set(statsRef.current, { opacity: 0, x: 30 });
  }, []);

  // Entry animations — fires once preloader completes
  useEffect(() => {
    if (!isReady) return;

    const tl = gsap.timeline({ delay: 0.2, defaults: { ease: "power4.out" } });

    tl.to(eyebrowRef.current, { y: 0, opacity: 1, duration: 0.8 })
      .to(line1Ref.current, { y: 0, opacity: 1, duration: 1 }, "-=0.5")
      .to(line2Ref.current, { y: 0, opacity: 1, duration: 1 }, "-=0.75")
      .to(line3Ref.current, { y: 0, opacity: 1, duration: 1 }, "-=0.75")
      .to(subtextRef.current, { y: 0, opacity: 1, duration: 0.8 }, "-=0.6")
      .to(ctasRef.current, { y: 0, opacity: 1, duration: 0.8 }, "-=0.6")
      .to(statsRef.current, { x: 0, opacity: 1, duration: 0.8 }, "-=0.8")
      .to(scrollIndicatorRef.current, { y: 0, opacity: 0.4, duration: 0.8 }, "-=0.5");

    return () => { tl.kill(); };
  }, [isReady]);

  // Scroll-pinned sequence — desktop only
  useEffect(() => {
    if (!isReady || isMobile || !sectionRef.current) return;

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "+=300%",
      pin: true,
      scrub: 0.8,
      onUpdate: (self) => {
        const p = self.progress;
        progressRef.current = p;

        // Editorial text block fades out by p=0.20
        gsap.set(heroTextRef.current, {
          opacity: Math.max(0, 1 - p / 0.2),
        });

        // Stats fade with text
        gsap.set(statsRef.current, {
          opacity: Math.max(0, 1 - p / 0.2),
        });

        // Scroll indicator fades faster
        gsap.set(scrollIndicatorRef.current, {
          opacity: Math.max(0, 1 - p / 0.12) * 0.4,
        });

        // Laptop canvas wrapper fades out at the very end (p=0.90 → 1.0)
        gsap.set(canvasWrapperRef.current, {
          opacity: p > 0.9 ? Math.max(0, 1 - (p - 0.9) / 0.1) : 1,
        });
      },
    });

    return () => { st.kill(); };
  }, [isReady, isMobile]);

  // Stats counters — fire after entry animations settle
  useEffect(() => {
    if (!isReady) return;

    const timer = setTimeout(() => {
      stats.forEach((stat, i) => {
        const el = counterRefs.current[i];
        if (!el) return;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: stat.value,
          duration: 1.5,
          ease: "power2.out",
          onUpdate: () => { el.textContent = Math.round(obj.val) + stat.suffix; },
        });
      });
    }, 1200);

    return () => clearTimeout(timer);
  }, [isReady]);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden bg-mahis-black"
    >
      {/* Yellow particle field — background layer */}
      <HeroCanvas />

      {/* ── Editorial text block ── z-[1], three-tier layout, fades out as scroll begins */}
      <div
        ref={heroTextRef}
        className="absolute inset-0 z-[1] flex flex-col pt-28 pb-16 px-8 lg:px-16 pointer-events-none select-none"
      >
        {/* Top — eyebrow */}
        <p
          ref={eyebrowRef}
          className="font-sans font-medium text-mahis-muted text-fluid-xs uppercase tracking-mono"
        >
          Mahis — Boutique Studio
        </p>

        {/* Middle — heading centered vertically, sits behind the laptop GLB */}
        <div className="flex-1 flex flex-col justify-center">
          {/* BRAND */}
          <div className="overflow-hidden">
            <div
              ref={line1Ref}
              className="font-sans font-bold text-mahis-white uppercase leading-none whitespace-nowrap"
              style={{ fontSize: "clamp(5rem, 12vw, 11rem)", letterSpacing: "-0.04em" }}
            >
              BRAND
            </div>
          </div>

          {/* ELEVATION — outlined yellow stroke */}
          <div className="overflow-hidden">
            <div
              ref={line2Ref}
              className="font-sans font-bold uppercase leading-none whitespace-nowrap"
              style={{
                fontSize: "clamp(5rem, 12vw, 11rem)",
                letterSpacing: "-0.04em",
                WebkitTextStroke: "2px #FFE500",
                color: "transparent",
              }}
            >
              ELEVATION
            </div>
          </div>

          {/* STUDIO */}
          <div className="overflow-hidden">
            <div
              ref={line3Ref}
              className="font-sans font-bold text-mahis-white uppercase leading-none whitespace-nowrap"
              style={{ fontSize: "clamp(5rem, 12vw, 11rem)", letterSpacing: "-0.04em" }}
            >
              STUDIO
            </div>
          </div>
        </div>

        {/* Bottom — subtext + CTAs */}
        <p
          ref={subtextRef}
          className="font-sans font-light text-mahis-muted text-fluid-lg max-w-lg mb-8"
        >
          We craft digital experiences that position ambitious brands at the top of their market.
        </p>

        {/* CTAs — re-enable pointer events for clicks */}
        <div ref={ctasRef} className="flex items-center gap-4 pointer-events-auto">
          <a
            href="/contact"
            data-magnetic
            className="font-sans font-bold text-fluid-xs uppercase tracking-mono bg-mahis-yellow text-mahis-black px-8 py-4 transition-colors duration-300 hover:bg-mahis-white"
            style={{ transitionTimingFunction: "cubic-bezier(0.76, 0, 0.24, 1)" }}
          >
            Start a project
          </a>
          <a
            href="/work"
            data-magnetic
            className="font-sans font-bold text-fluid-xs uppercase tracking-mono border border-mahis-white text-mahis-white px-8 py-4 transition-all duration-300 hover:border-mahis-yellow hover:text-mahis-yellow"
            style={{ transitionTimingFunction: "cubic-bezier(0.76, 0, 0.24, 1)" }}
          >
            View work
          </a>
        </div>
      </div>

      {/* ── Stats — bottom-right, hidden on mobile, fades with text ── */}
      <div
        ref={statsRef}
        className="absolute bottom-16 right-8 lg:right-16 z-[1] hidden lg:flex flex-col gap-8"
      >
        {stats.map((stat, i) => (
          <div key={stat.label} className="flex flex-col gap-1 items-end">
            <span
              ref={(el) => { counterRefs.current[i] = el; }}
              className="font-sans font-bold text-mahis-yellow leading-none tabular-nums"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
            >
              0{stat.suffix}
            </span>
            <span className="font-sans font-medium text-mahis-muted text-fluid-xs uppercase tracking-mono">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* ── Laptop Three.js canvas — z-[2], pointer-events-none ── */}
      {!isMobile && (
        <LaptopCanvas ref={canvasWrapperRef} progressRef={progressRef} />
      )}

      {/* ── Scroll indicator ── */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 right-8 z-20 flex flex-col items-center gap-2"
      >
        <span className="font-sans font-medium text-mahis-muted text-[10px] tracking-mono uppercase rotate-90 origin-center mb-4">
          Scroll
        </span>
        <div className="w-px h-12 bg-mahis-muted animate-pulse" />
      </div>
    </section>
  );
}
