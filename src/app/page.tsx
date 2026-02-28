import { Hero } from "@/components/gsap/Hero";
import { StaggeredGrid } from "@/components/gsap/StaggeredGrid";

export default function Home() {
  return (
    <>
      <Hero />

      {/* Marquee ticker — yellow strip like brand direction */}
      <section className="border-t border-b border-mahis-black py-4 overflow-hidden bg-mahis-gold">
        <div className="flex gap-16 whitespace-nowrap animate-marquee text-mahis-black font-condensed font-bold text-fluid-xs tracking-widest uppercase">
          {[
            "Brand Elevation",
            "Web Experience",
            "UI/UX Design",
            "Product Design",
            "Motion",
            "Three.js",
            "GSAP",
            "Brand Elevation",
            "Web Experience",
            "UI/UX Design",
            "Product Design",
            "Motion",
            "Three.js",
            "GSAP",
          ].map((item, i) => (
            <span key={i} className="flex items-center gap-16">
              {item}
              <span className="text-mahis-gold-light">✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* Selected work */}
      <section className="min-h-screen bg-mahis-white px-8 py-section flex flex-col justify-center">
        <div className="flex items-end justify-between mb-16 border-b border-mahis-black pb-6">
          <h2 className="font-condensed text-fluid-3xl text-mahis-black font-black uppercase leading-none">
            Selected <em className="italic font-light text-mahis-grey-mid">work</em>
          </h2>
          <a
            href="/work"
            className="font-condensed font-bold text-fluid-xs text-mahis-black tracking-widest uppercase border-b border-mahis-black pb-0.5 hover:text-mahis-gold hover:border-mahis-gold transition-colors"
          >
            All projects →
          </a>
        </div>

        {/* Work grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5">
          {[
            { title: "Project Name", tag: "Brand + Web", year: "2024" },
            { title: "Project Name", tag: "Web Experience", year: "2024" },
            { title: "Project Name", tag: "Brand Elevation", year: "2023" },
            { title: "Project Name", tag: "UI/UX", year: "2023" },
          ].map((project, i) => (
            <div
              key={i}
              className="group relative aspect-[4/3] bg-mahis-grey flex items-end p-6 overflow-hidden cursor-pointer"
            >
              {/* Placeholder image area */}
              <div className="absolute inset-0 bg-gradient-to-t from-mahis-black/85 to-transparent z-10" />
              <div className="absolute inset-0 bg-mahis-grey group-hover:scale-105 transition-transform duration-700 ease-mahis" />

              <div className="relative z-20">
                <p className="font-body text-mahis-gold text-[10px] tracking-widest uppercase mb-2">
                  {project.tag} — {project.year}
                </p>
                <h3 className="font-condensed text-fluid-xl text-mahis-white font-black uppercase">
                  {project.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <StaggeredGrid />

      {/* Studio statement */}
      <section className="min-h-[60vh] bg-mahis-white px-8 py-section flex items-center border-t border-mahis-black">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-condensed text-fluid-2xl text-mahis-black font-black uppercase leading-[0.92] tracking-tight text-balance">
            We don&apos;t build websites. We build{" "}
            <em className="italic font-light text-mahis-gold-light">presence</em> — the kind that
            makes luxury brands feel inevitable online.
          </p>
        </div>
      </section>

      {/* Footer — dark like brand direction */}
      <footer className="border-t border-mahis-black px-8 py-8 flex items-center justify-between bg-mahis-black">
        <p className="font-display text-mahis-white text-xl tracking-widest uppercase">Mahis</p>
        <p className="font-mono text-mahis-grey-mid text-[10px] tracking-widest uppercase">
          © {new Date().getFullYear()} — All rights reserved
        </p>
        <a
          href="/contact"
          className="font-condensed font-bold text-fluid-xs text-mahis-gold tracking-widest uppercase hover:text-mahis-gold-light transition-colors"
        >
          hello@mahis.studio
        </a>
      </footer>
    </>
  );
}
