"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LaptopCanvas } from "@/components/three/LaptopCanvas";
import { usePreloaderDone } from "@/components/ui/LayoutClient";

gsap.registerPlugin(ScrollTrigger);

function splitIntoChars(el: HTMLElement): HTMLSpanElement[] {
  if (el.dataset.charSplit === "1")
    return Array.from(el.querySelectorAll<HTMLSpanElement>("[data-char]"));
  el.dataset.charSplit = "1";
  const chars: HTMLSpanElement[] = [];
  function walk(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? "";
      const frag = document.createDocumentFragment();
      for (const char of text) {
        const span = document.createElement("span");
        span.textContent = char;
        span.style.display = "inline-block";
        if (char.trim()) {
          span.dataset.char = "1";
          chars.push(span);
        }
        frag.appendChild(span);
      }
      node.parentNode?.replaceChild(frag, node);
    } else if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName !== "BR") {
      Array.from(node.childNodes).forEach(walk);
    }
  }
  Array.from(el.childNodes).forEach(walk);
  return chars;
}

const DISSOLVE_RADIUS = 90;

export function Hero() {
  const isReady = usePreloaderDone();
  const [isMobile, setIsMobile] = useState(false);
  const [mobileRevealed, setMobileRevealed] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<number>(0);
  const charsRef = useRef<HTMLSpanElement[]>([]);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  // Detect mobile on mount
  useEffect(() => {
    setIsMobile(window.innerWidth < 1024);
  }, []);

  // ── Main effect: desktop scroll sequence or mobile direct reveal ──────
  useEffect(() => {
    if (!isReady) return;

    if (isMobile) {
      setMobileRevealed(true);
      return;
    }

    // ── Desktop ───────────────────────────────────────────────────────────
    // Set all text to invisible initially
    gsap.set(lineRef.current, { scaleX: 0, opacity: 0 });
    gsap.set([headingRef.current, subRef.current, ctaRef.current], { opacity: 0, y: 0 });

    if (!sectionRef.current) return;

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "+=200%",
      pin: true,
      scrub: 0.8,
      onUpdate: (self) => {
        const p = self.progress;
        progressRef.current = p;

        // Background MAHIS text: fade out by p=0.35
        gsap.set(bgTextRef.current, {
          opacity: Math.max(0, 1 - p / 0.35),
        });

        // Canvas: fade out from p=0.82 → p=0.95
        gsap.set(canvasWrapperRef.current, {
          opacity: p > 0.82 ? Math.max(0, 1 - (p - 0.82) / 0.13) : 1,
        });

        // Scroll indicator: fade out by p=0.25
        gsap.set(scrollIndicatorRef.current, {
          opacity: Math.max(0, 1 - p / 0.25) * 0.4,
        });

        // Hero text reveal: p=0.85 → 1.0 (staggered by element)
        const textP = Math.max(0, Math.min(1, (p - 0.85) / 0.15));
        const subP  = Math.max(0, Math.min(1, (p - 0.88) / 0.12));
        const ctaP  = Math.max(0, Math.min(1, (p - 0.91) / 0.09));

        gsap.set(lineRef.current,    { scaleX: textP, opacity: textP > 0 ? 1 : 0, transformOrigin: "center" });
        gsap.set(headingRef.current, { opacity: textP, y: (1 - textP) * 40 });
        gsap.set(subRef.current,     { opacity: subP,  y: (1 - subP)  * 25 });
        gsap.set(ctaRef.current,     { opacity: ctaP,  y: (1 - ctaP)  * 15 });
      },
    });

    // Split chars for dissolve (desktop)
    if (headingRef.current) {
      charsRef.current = splitIntoChars(headingRef.current);
    }

    const section = sectionRef.current;
    const onMove = (e: MouseEvent) => {
      if (progressRef.current < 0.85) return;
      charsRef.current.forEach((char) => {
        const rect = char.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
        const t = Math.max(0, 1 - dist / DISSOLVE_RADIUS);
        gsap.set(char, { opacity: 1 - t * 0.9, filter: `blur(${(t * 7).toFixed(1)}px)` });
      });
    };
    const onLeave = () => {
      if (progressRef.current < 0.85) return;
      gsap.to(charsRef.current, { opacity: 1, filter: "blur(0px)", duration: 0.8, stagger: 0.006, ease: "power2.out" });
    };

    section?.addEventListener("mousemove", onMove);
    section?.addEventListener("mouseleave", onLeave);

    return () => {
      st.kill();
      section?.removeEventListener("mousemove", onMove);
      section?.removeEventListener("mouseleave", onLeave);
    };
  }, [isReady, isMobile]);

  // ── Mobile: direct text reveal after preloader ────────────────────────
  useEffect(() => {
    if (!mobileRevealed || !headingRef.current) return;

    const chars = splitIntoChars(headingRef.current);
    charsRef.current = chars;

    const tl = gsap.timeline({ delay: 0.2 });
    tl.fromTo(lineRef.current,    { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "power4.inOut", transformOrigin: "center" })
      .fromTo(headingRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: "power4.out" }, "-=0.6")
      .fromTo(subRef.current,     { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" }, "-=0.6")
      .fromTo(ctaRef.current,     { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, "-=0.4");

    const section = sectionRef.current;
    const onMove = (e: MouseEvent) => {
      chars.forEach((char) => {
        const rect = char.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
        const t = Math.max(0, 1 - dist / DISSOLVE_RADIUS);
        gsap.set(char, { opacity: 1 - t * 0.9, filter: `blur(${(t * 7).toFixed(1)}px)` });
      });
    };
    const onLeave = () => {
      gsap.to(chars, { opacity: 1, filter: "blur(0px)", duration: 0.8, stagger: 0.006, ease: "power2.out" });
    };
    section?.addEventListener("mousemove", onMove);
    section?.addEventListener("mouseleave", onLeave);

    return () => {
      tl.kill();
      section?.removeEventListener("mousemove", onMove);
      section?.removeEventListener("mouseleave", onLeave);
    };
  }, [mobileRevealed]);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex items-center justify-center overflow-hidden bg-mahis-black"
    >
      {/* Background MAHIS Studio text — z-[1], gold, behind canvas */}
      <div
        ref={bgTextRef}
        className="absolute inset-0 z-[1] flex flex-col items-center justify-center pointer-events-none select-none"
      >
        <p
          className="font-display leading-none text-mahis-gold/30 tracking-[0.25em]"
          style={{ fontSize: "18vw" }}
        >
          MAHIS
        </p>
        <p
          className="font-mono text-mahis-gold/40 uppercase tracking-[0.5em]"
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
      <div className="absolute inset-0 bg-gradient-to-t from-mahis-black/50 via-transparent to-transparent pointer-events-none z-10" />

      {/* Hero text — revealed by scroll progress (desktop) or entrance anim (mobile) */}
      <div className="relative z-20 max-w-3xl mx-auto px-8 text-center">
        <div
          ref={lineRef}
          className="w-24 h-px bg-mahis-gold mb-8 mx-auto"
          style={{ transformOrigin: "center" }}
        />

        <h1
          ref={headingRef}
          className="font-display text-fluid-4xl text-mahis-gold leading-[0.9] tracking-tight mb-8"
          style={{
            textShadow:
              "0 0 40px rgba(201,169,110,0.9), 0 0 80px rgba(201,169,110,0.5), 0 0 120px rgba(201,169,110,0.25)",
          }}
        >
          Brand{" "}elevation
          <br />
          <span className="italic text-mahis-gold-light">through</span> web
          <br />
          experience
        </h1>

        <p
          ref={subRef}
          className="font-body text-fluid-base text-mahis-grey-light max-w-sm mx-auto mb-12 leading-relaxed"
        >
          Mahis is a boutique studio crafting immersive digital experiences
          for luxury brands and creative agencies.
        </p>

        <div ref={ctaRef} className="flex items-center justify-center gap-8">
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
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 right-8 flex flex-col items-center gap-2 opacity-40 z-20"
      >
        <span className="font-mono text-mahis-grey-light text-[10px] tracking-widest uppercase rotate-90 origin-center mb-4">
          Scroll
        </span>
        <div className="w-px h-12 bg-mahis-grey-light animate-pulse" />
      </div>
    </section>
  );
}
