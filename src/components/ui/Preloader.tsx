"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const overlay = overlayRef.current;
    const letters = lettersRef.current;
    const counter = counterRef.current;
    if (!overlay || !counter) return;

    const count = { val: 0 };
    const tl = gsap.timeline();

    // 1. Letters stagger in
    tl.fromTo(
      letters,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: "power3.out" }
    )
      // 2. Counter 0 → 100
      .to(
        count,
        {
          val: 100,
          duration: 1.4,
          ease: "power2.inOut",
          onUpdate() {
            if (counter) {
              counter.textContent =
                String(Math.floor(count.val)).padStart(2, "0") + "%";
            }
          },
        },
        "+=0.1"
      )
      // 3. Brief pause
      .to({}, { duration: 0.3 })
      // 4. Curtain wipe up
      .to(overlay, {
        yPercent: -100,
        duration: 0.7,
        ease: "power4.inOut",
        onComplete() {
          document.body.style.overflow = "";
          onComplete();
        },
      });

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[10000] bg-mahis-black flex flex-col items-center justify-center"
    >
      <h1 className="font-display text-fluid-4xl text-mahis-white tracking-[0.4em] flex">
        {["M", "A", "H", "I", "S"].map((char, i) => (
          <span
            key={i}
            ref={(el) => {
              if (el) lettersRef.current[i] = el;
            }}
            style={{ display: "inline-block" }}
          >
            {char}
          </span>
        ))}
      </h1>
      <span
        ref={counterRef}
        className="font-mono text-fluid-sm text-mahis-gold mt-8 tracking-widest"
      >
        00%
      </span>
    </div>
  );
}
