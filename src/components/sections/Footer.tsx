"use client";

const navLinks = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Studio", href: "/studio" },
  { label: "Contact", href: "/contact" },
];

const socials = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Twitter / X", href: "https://twitter.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
];

export function Footer() {
  return (
    <footer
      data-section="footer"
      className="bg-mahis-black border-t"
      style={{ borderColor: "#1F1F1F", borderWidth: "1.5px 0 0" }}
    >
      {/* Main footer grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-px bg-mahis-border"
        style={{ borderBottom: "1.5px solid #1F1F1F" }}
      >
        {/* Col 1 — Logo + tagline */}
        <div
          className="bg-mahis-black flex flex-col justify-between"
          style={{ padding: "clamp(2.5rem, 5vw, 4rem)" }}
        >
          <div>
            <p
              className="font-sans font-bold text-mahis-white uppercase"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", letterSpacing: "-0.04em" }}
            >
              MAHIS
            </p>
            <p
              className="font-sans font-light text-mahis-muted mt-3 max-w-xs"
              style={{ fontSize: "clamp(0.85rem, 1.1vw, 0.95rem)", lineHeight: 1.6 }}
            >
              Boutique brand elevation &amp; web experience studio.
            </p>
          </div>

          <p
            className="font-sans font-medium text-mahis-muted uppercase mt-10"
            style={{ fontSize: "clamp(0.58rem, 0.75vw, 0.65rem)", letterSpacing: "0.15em" }}
          >
            Est. 2024 — Global
          </p>
        </div>

        {/* Col 2 — Nav */}
        <div
          className="bg-mahis-black flex flex-col"
          style={{ padding: "clamp(2.5rem, 5vw, 4rem)" }}
        >
          <p
            className="font-sans font-medium text-mahis-muted uppercase mb-8"
            style={{ fontSize: "clamp(0.58rem, 0.75vw, 0.65rem)", letterSpacing: "0.15em" }}
          >
            Navigate
          </p>
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-sans font-bold text-mahis-white uppercase transition-colors duration-300 hover:text-mahis-yellow w-fit"
                style={{ fontSize: "clamp(0.9rem, 1.4vw, 1.1rem)", letterSpacing: "-0.02em" }}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Col 3 — Contact + socials */}
        <div
          className="bg-mahis-black flex flex-col justify-between"
          style={{ padding: "clamp(2.5rem, 5vw, 4rem)" }}
        >
          <div>
            <p
              className="font-sans font-medium text-mahis-muted uppercase mb-8"
              style={{ fontSize: "clamp(0.58rem, 0.75vw, 0.65rem)", letterSpacing: "0.15em" }}
            >
              Contact
            </p>
            <a
              href="mailto:hello@mahis.studio"
              className="font-sans font-bold text-mahis-white uppercase transition-colors duration-300 hover:text-mahis-yellow block mb-8"
              style={{ fontSize: "clamp(0.9rem, 1.4vw, 1.1rem)", letterSpacing: "-0.02em" }}
            >
              hello@mahis.studio
            </a>
          </div>

          <div>
            <p
              className="font-sans font-medium text-mahis-muted uppercase mb-5"
              style={{ fontSize: "clamp(0.58rem, 0.75vw, 0.65rem)", letterSpacing: "0.15em" }}
            >
              Socials
            </p>
            <div className="flex flex-col gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans font-medium text-mahis-muted uppercase transition-colors duration-300 hover:text-mahis-yellow w-fit"
                  style={{ fontSize: "clamp(0.58rem, 0.75vw, 0.65rem)", letterSpacing: "0.15em" }}
                >
                  {s.label} ↗
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{ padding: "1.5rem clamp(1.5rem, 5vw, 5rem)" }}
      >
        <p
          className="font-sans font-medium text-mahis-muted uppercase"
          style={{ fontSize: "clamp(0.58rem, 0.75vw, 0.65rem)", letterSpacing: "0.15em" }}
        >
          © {new Date().getFullYear()} Mahis Studio — All rights reserved
        </p>
        <p
          className="font-sans font-medium text-mahis-muted uppercase"
          style={{ fontSize: "clamp(0.58rem, 0.75vw, 0.65rem)", letterSpacing: "0.15em" }}
        >
          Crafted with intent
        </p>
      </div>
    </footer>
  );
}
