import { Hero } from "@/components/gsap/Hero";

export default function Home() {
  return (
    <>
      <Hero />

      {/* Marquee ticker — placeholder for selected work strip */}
      <section className="border-t border-mahis-grey py-5 overflow-hidden bg-mahis-black">
        <div className="flex gap-16 whitespace-nowrap animate-marquee text-mahis-grey-mid font-mono text-fluid-xs tracking-widest uppercase">
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
              <span className="text-mahis-gold">✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* Selected work — placeholder */}
      <section className="min-h-screen bg-mahis-black px-8 py-section flex flex-col justify-center">
        <div className="flex items-end justify-between mb-16 border-b border-mahis-grey pb-6">
          <h2 className="font-display text-fluid-3xl text-mahis-white italic">
            Selected Work
          </h2>
          <a
            href="/work"
            className="font-mono text-fluid-xs text-mahis-grey-light tracking-widest uppercase hover:text-mahis-gold transition-colors"
          >
            All projects →
          </a>
        </div>

        {/* Work grid placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <div className="absolute inset-0 bg-gradient-to-t from-mahis-black/80 to-transparent z-10" />
              <div className="absolute inset-0 bg-mahis-grey group-hover:scale-105 transition-transform duration-700 ease-mahis" />

              <div className="relative z-20">
                <p className="font-mono text-mahis-gold text-[10px] tracking-widest uppercase mb-2">
                  {project.tag} — {project.year}
                </p>
                <h3 className="font-display text-fluid-xl text-mahis-white italic">
                  {project.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Studio statement — placeholder */}
      <section className="min-h-[60vh] bg-mahis-black px-8 py-section flex items-center">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-display text-fluid-2xl text-mahis-white italic leading-[1.2] text-balance">
            "We don't build websites. We build{" "}
            <span className="text-mahis-gold">presence</span> — the kind that
            makes luxury brands feel inevitable online."
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-mahis-grey px-8 py-8 flex items-center justify-between">
        <p className="font-display text-mahis-grey-light italic">Mahis Studio</p>
        <p className="font-mono text-mahis-grey-mid text-[10px] tracking-widest uppercase">
          © {new Date().getFullYear()} — All rights reserved
        </p>
        <a
          href="/contact"
          className="font-mono text-fluid-xs text-mahis-gold tracking-widest uppercase hover:text-mahis-gold-light transition-colors"
        >
          hello@mahis.studio
        </a>
      </footer>
    </>
  );
}
