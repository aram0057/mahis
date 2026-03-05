"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    number: "01",
    title: "Brand Elevation",
    body: "We sharpen identity into a weapon. From naming and positioning to visual systems built for scale — we create brands that own their category.",
    items: ["Brand Strategy", "Visual Identity", "Naming & Tone", "Brand Systems"],
  },
  {
    number: "02",
    title: "Web Experience",
    body: "Sites that command attention. We build high-performance, motion-rich digital experiences that convert visitors into believers.",
    items: ["UX / UI Design", "Next.js Development", "GSAP + Three.js", "CMS Integration"],
  },
];

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(cardRefs.current, { y: 80, opacity: 0 });

      gsap.to(cardRefs.current, {
        y: 0,
        opacity: 1,
        stagger: 0.18,
        ease: "power3.out",
        duration: 0.9,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="services"
      className="bg-mahis-black border-t"
      style={{
        borderColor: "#1F1F1F",
        borderWidth: "1.5px 0 0",
        padding: `clamp(5rem, 10vw, 10rem) clamp(1.5rem, 5vw, 5rem)`,
      }}
    >
      {/* Section label */}
      <p
        className="font-sans font-medium text-mahis-muted uppercase mb-12"
        style={{ fontSize: "clamp(0.6rem, 0.85vw, 0.7rem)", letterSpacing: "0.15em" }}
      >
        What we do
      </p>

      {/* Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-mahis-border">
        {services.map((svc, i) => (
          <div
            key={svc.number}
            ref={(el) => { cardRefs.current[i] = el; }}
            className="group bg-mahis-black p-10 flex flex-col gap-8 transition-colors duration-500 hover:bg-mahis-surface cursor-default"
            style={{
              borderStyle: "solid",
              borderWidth: "1.5px",
              borderColor: "transparent",
              transition: "background-color 0.5s cubic-bezier(0.76,0,0.24,1), border-color 0.5s cubic-bezier(0.76,0,0.24,1)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "#FFE500";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "transparent";
            }}
          >
            <span
              className="font-sans font-bold text-mahis-yellow"
              style={{ fontSize: "clamp(0.65rem, 0.9vw, 0.75rem)", letterSpacing: "0.15em" }}
            >
              {svc.number}
            </span>

            <h3
              className="font-sans font-bold text-mahis-white uppercase leading-none"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", letterSpacing: "-0.03em" }}
            >
              {svc.title}
            </h3>

            <p
              className="font-sans font-light text-mahis-muted leading-relaxed"
              style={{ fontSize: "clamp(0.9rem, 1.2vw, 1rem)" }}
            >
              {svc.body}
            </p>

            <ul className="flex flex-col gap-3 mt-auto pt-8 border-t" style={{ borderColor: "#1F1F1F", borderWidth: "1.5px" }}>
              {svc.items.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 font-sans font-medium text-mahis-muted uppercase"
                  style={{ fontSize: "clamp(0.6rem, 0.8vw, 0.68rem)", letterSpacing: "0.15em" }}
                >
                  <span className="text-mahis-yellow text-[0.5em]">◆</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
