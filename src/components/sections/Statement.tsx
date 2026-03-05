"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const words = ["WE", "BUILD", "PRESENCE"];

export function Statement() {
  const sectionRef = useRef<HTMLElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const lineRef = useRef<HTMLDivElement>(null);
  const estRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(wordRefs.current, { y: 150, opacity: 0 });
      gsap.set(lineRef.current, { scaleY: 0 });
      gsap.set(estRef.current, { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        defaults: { ease: "power3.out", duration: 0.9 },
      });

      tl.to(lineRef.current, { scaleY: 1, duration: 0.7 })
        .to(
          wordRefs.current,
          { y: 0, opacity: 1, stagger: 0.12 },
          "-=0.4"
        )
        .to(estRef.current, { opacity: 1, duration: 0.5 }, "-=0.3");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="statement"
      className="relative bg-mahis-black flex items-center"
      style={{
        minHeight: "100vh",
        padding: `clamp(5rem, 10vw, 10rem) clamp(1.5rem, 5vw, 5rem)`,
      }}
    >
      {/* Left yellow vertical line */}
      <div
        ref={lineRef}
        className="absolute left-0 top-0 bottom-0 origin-top"
        style={{
          width: "1.5px",
          background: "#FFE500",
        }}
      />

      {/* Right — rotated EST. 2024 */}
      <span
        ref={estRef}
        className="absolute right-0 bottom-1/2 font-sans font-medium text-mahis-muted uppercase"
        style={{
          fontSize: "clamp(0.6rem, 0.85vw, 0.7rem)",
          letterSpacing: "0.15em",
          writingMode: "vertical-rl",
          transform: "translateY(50%) rotate(180deg)",
          padding: "0 clamp(1rem, 2vw, 2rem)",
        }}
      >
        Est. 2024
      </span>

      {/* Heading words */}
      <div className="overflow-hidden">
        {words.map((word, i) => (
          <div key={word} className="overflow-hidden">
            <span
              ref={(el) => { wordRefs.current[i] = el; }}
              className="block font-sans font-bold uppercase leading-none"
              style={{
                fontSize: "clamp(4rem, 12vw, 12rem)",
                letterSpacing: "-0.04em",
                color: word === "PRESENCE" ? "transparent" : "#F5F5F5",
                WebkitTextStroke: word === "PRESENCE" ? "1.5px #FFE500" : undefined,
              }}
            >
              {word}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
