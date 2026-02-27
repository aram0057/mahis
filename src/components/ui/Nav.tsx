"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";

const navLinks = [
  { label: "Work", href: "/work" },
  { label: "Studio", href: "/studio" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" },
];

export function Nav() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!navRef.current) return;

    gsap.fromTo(
      navRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.5, ease: "power3.out" }
    );
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 mix-blend-difference"
    >
      {/* Logo */}
      <Link
        href="/"
        className="font-display text-mahis-white text-xl tracking-[0.2em] uppercase"
      >
        Mahis
      </Link>

      {/* Links */}
      <ul className="flex items-center gap-8">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="font-body text-mahis-grey-light text-fluid-xs tracking-widest uppercase hover:text-mahis-white transition-colors duration-300"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href="/contact"
        className="font-body text-fluid-xs tracking-widest uppercase border border-mahis-gold text-mahis-gold px-5 py-2 hover:bg-mahis-gold hover:text-mahis-black transition-all duration-300"
      >
        Start a project
      </Link>
    </nav>
  );
}
