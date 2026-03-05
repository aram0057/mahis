"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote:
      "Mahis transformed how our brand shows up online. The site they built is unlike anything in our space — every detail considered.",
    author: "Sofia R.",
    role: "Founder, Kova",
  },
  {
    quote:
      "Working with Mahis felt like a true creative partnership. They pushed our identity further than we thought possible.",
    author: "James M.",
    role: "Creative Director, Solace",
  },
  {
    quote:
      "The result exceeded every expectation. Our conversion rate jumped 40% in the first month after launch.",
    author: "Lena K.",
    role: "CEO, Meridian Studio",
  },
];

export function SocialProof() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(headingRef.current, { y: 60, opacity: 0 });
      gsap.set(cardRefs.current, { x: 60, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        defaults: { ease: "power3.out", duration: 0.9 },
      });

      tl.to(headingRef.current, { y: 0, opacity: 1 })
        .to(cardRefs.current, { x: 0, opacity: 1, stagger: 0.15 }, "-=0.5");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-section="social-proof"
      className="bg-mahis-black border-t"
      style={{
        borderColor: "#1F1F1F",
        borderWidth: "1.5px 0 0",
        padding: `clamp(5rem, 10vw, 10rem) clamp(1.5rem, 5vw, 5rem)`,
      }}
    >
      {/* Header */}
      <div
        className="flex items-end justify-between mb-14 pb-6 border-b"
        style={{ borderColor: "#1F1F1F", borderWidth: "0 0 1.5px" }}
      >
        <h2
          ref={headingRef}
          className="font-sans font-bold text-mahis-white uppercase leading-none"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.03em" }}
        >
          What They Say
        </h2>
        <span
          className="font-sans font-medium text-mahis-muted uppercase"
          style={{ fontSize: "clamp(0.6rem, 0.85vw, 0.7rem)", letterSpacing: "0.15em" }}
        >
          Client Words
        </span>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-mahis-border">
        {testimonials.map((t, i) => (
          <div
            key={t.author}
            ref={(el) => { cardRefs.current[i] = el; }}
            className="bg-mahis-black flex flex-col gap-8 p-10"
          >
            {/* Opening quote mark */}
            <span
              className="font-sans font-bold text-mahis-yellow leading-none select-none"
              style={{ fontSize: "4rem", lineHeight: 1 }}
              aria-hidden
            >
              "
            </span>

            <p
              className="font-sans font-light text-mahis-white leading-relaxed flex-1"
              style={{ fontSize: "clamp(0.95rem, 1.3vw, 1.1rem)" }}
            >
              {t.quote}
            </p>

            <div
              className="pt-6 border-t"
              style={{ borderColor: "#1F1F1F", borderWidth: "1.5px" }}
            >
              <p
                className="font-sans font-bold text-mahis-white uppercase"
                style={{ fontSize: "clamp(0.7rem, 0.9vw, 0.78rem)", letterSpacing: "-0.01em" }}
              >
                {t.author}
              </p>
              <p
                className="font-sans font-medium text-mahis-muted uppercase mt-1"
                style={{ fontSize: "clamp(0.58rem, 0.75vw, 0.65rem)", letterSpacing: "0.15em" }}
              >
                {t.role}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
