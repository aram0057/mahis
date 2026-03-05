"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ContactCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const btnRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([line1Ref.current, line2Ref.current], { y: 120, opacity: 0 });
      gsap.set([subRef.current, btnRef.current], { y: 30, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        defaults: { ease: "power3.out", duration: 0.9 },
      });

      tl.to([line1Ref.current, line2Ref.current], { y: 0, opacity: 1, stagger: 0.1 })
        .to([subRef.current, btnRef.current], { y: 0, opacity: 1, stagger: 0.1 }, "-=0.4");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="contact-cta"
      className="relative flex flex-col items-start justify-center overflow-hidden"
      style={{
        minHeight: "100vh",
        background: "#FFE500",
        padding: `clamp(5rem, 10vw, 10rem) clamp(1.5rem, 5vw, 5rem)`,
      }}
    >
      {/* Eyebrow */}
      <p
        className="font-sans font-medium uppercase mb-12"
        style={{
          fontSize: "clamp(0.6rem, 0.85vw, 0.7rem)",
          letterSpacing: "0.15em",
          color: "#0A0A0A",
          opacity: 0.6,
        }}
      >
        Ready to elevate
      </p>

      {/* Heading */}
      <div>
        <div className="overflow-hidden">
          <div
            ref={line1Ref}
            className="font-sans font-bold uppercase leading-none"
            style={{
              fontSize: "clamp(4rem, 12vw, 12rem)",
              letterSpacing: "-0.04em",
              color: "#0A0A0A",
            }}
          >
            START A
          </div>
        </div>
        <div className="overflow-hidden">
          <div
            ref={line2Ref}
            className="font-sans font-bold uppercase leading-none"
            style={{
              fontSize: "clamp(4rem, 12vw, 12rem)",
              letterSpacing: "-0.04em",
              color: "transparent",
              WebkitTextStroke: "2px #0A0A0A",
            }}
          >
            PROJECT
          </div>
        </div>
      </div>

      {/* Subtext */}
      <p
        ref={subRef}
        className="font-sans font-light mt-12 max-w-lg"
        style={{
          fontSize: "clamp(1rem, 1.5vw, 1.15rem)",
          color: "#0A0A0A",
          opacity: 0.7,
          lineHeight: 1.6,
        }}
      >
        Tell us about your brand and ambitions. We typically respond within 24 hours.
      </p>

      {/* CTA button */}
      <a
        ref={btnRef}
        href="mailto:hello@mahis.studio"
        data-magnetic
        className="inline-flex items-center gap-4 mt-10 font-sans font-bold uppercase transition-colors duration-300"
        style={{
          fontSize: "clamp(0.65rem, 0.9vw, 0.75rem)",
          letterSpacing: "0.15em",
          background: "#0A0A0A",
          color: "#FFE500",
          padding: "1.25rem 2.5rem",
          transitionTimingFunction: "cubic-bezier(0.76, 0, 0.24, 1)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.background = "#1F1F1F";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.background = "#0A0A0A";
        }}
      >
        hello@mahis.studio
        <span aria-hidden>→</span>
      </a>

      {/* Decorative corner */}
      <div
        className="absolute bottom-0 right-0 font-sans font-bold uppercase opacity-5 leading-none select-none"
        style={{
          fontSize: "clamp(8rem, 20vw, 20rem)",
          letterSpacing: "-0.04em",
          color: "#0A0A0A",
          lineHeight: 0.85,
        }}
        aria-hidden
      >
        M
      </div>
    </section>
  );
}
