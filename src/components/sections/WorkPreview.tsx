"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  { title: "Kova", tag: "Brand + Web", year: "2024", span: "col" },
  { title: "Solace", tag: "Web Experience", year: "2024", span: "col" },
  { title: "Meridian Studio", tag: "Brand Elevation", year: "2023", span: "full" },
];

export function WorkPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(headingRef.current, { y: 60, opacity: 0 });
      gsap.set(cardRefs.current, { y: 80, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        defaults: { ease: "power3.out", duration: 0.9 },
      });

      tl.to(headingRef.current, { y: 0, opacity: 1 })
        .to(cardRefs.current, { y: 0, opacity: 1, stagger: 0.15 }, "-=0.5");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const topProjects = projects.filter((p) => p.span === "col");
  const bottomProject = projects.find((p) => p.span === "full");

  return (
    <section
      ref={sectionRef}
      data-section="work-preview"
      className="bg-mahis-black border-t"
      style={{
        borderColor: "#1F1F1F",
        borderWidth: "1.5px 0 0",
        padding: `clamp(5rem, 10vw, 10rem) clamp(1.5rem, 5vw, 5rem)`,
      }}
    >
      {/* Header row */}
      <div
        className="flex items-end justify-between mb-14 pb-6 border-b"
        style={{ borderColor: "#1F1F1F", borderWidth: "0 0 1.5px" }}
      >
        <h2
          ref={headingRef}
          className="font-sans font-bold text-mahis-white uppercase leading-none"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.03em" }}
        >
          Selected Work
        </h2>
        <a
          href="/work"
          className="font-sans font-medium text-mahis-muted uppercase transition-colors duration-300 hover:text-mahis-yellow"
          style={{ fontSize: "clamp(0.6rem, 0.85vw, 0.7rem)", letterSpacing: "0.15em" }}
        >
          All projects →
        </a>
      </div>

      {/* 2-col top row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-mahis-border mb-px">
        {topProjects.map((project, i) => (
          <WorkCard
            key={project.title}
            project={project}
            ref={(el) => { cardRefs.current[i] = el; }}
            aspectClass="aspect-[4/3]"
          />
        ))}
      </div>

      {/* Full-width bottom */}
      {bottomProject && (
        <WorkCard
          key={bottomProject.title}
          project={bottomProject}
          ref={(el) => { cardRefs.current[2] = el; }}
          aspectClass="aspect-[16/7]"
        />
      )}
    </section>
  );
}

import { forwardRef } from "react";

const WorkCard = forwardRef<
  HTMLDivElement,
  { project: { title: string; tag: string; year: string }; aspectClass: string }
>(({ project, aspectClass }, ref) => (
  <div
    ref={ref}
    className={`group relative ${aspectClass} bg-mahis-surface flex items-end overflow-hidden cursor-pointer`}
    style={{ padding: "clamp(1.2rem, 2.5vw, 2rem)" }}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLDivElement).style.outline = "1.5px solid #FFE500";
      gsap.to(e.currentTarget.querySelector(".card-bg"), { scale: 1.04, duration: 0.7, ease: "power3.out" });
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLDivElement).style.outline = "none";
      gsap.to(e.currentTarget.querySelector(".card-bg"), { scale: 1, duration: 0.7, ease: "power3.out" });
    }}
  >
    {/* Noise + gradient overlay */}
    <div
      className="card-bg absolute inset-0 bg-mahis-surface will-change-transform"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-mahis-black/80 to-transparent z-10" />

    {/* Content */}
    <div className="relative z-20">
      <p
        className="font-sans font-medium text-mahis-yellow uppercase mb-2"
        style={{ fontSize: "clamp(0.6rem, 0.8vw, 0.68rem)", letterSpacing: "0.15em" }}
      >
        {project.tag} — {project.year}
      </p>
      <h3
        className="font-sans font-bold text-mahis-white uppercase leading-none"
        style={{ fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)", letterSpacing: "-0.02em" }}
      >
        {project.title}
      </h3>
    </div>
  </div>
));

WorkCard.displayName = "WorkCard";
