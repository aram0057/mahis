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
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.3, ease: "power3.out" }
    );
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 bg-mahis-black border-b border-mahis-border"
    >
      {/* Logo */}
      <Link
        href="/"
        data-magnetic
        className="font-sans font-bold text-mahis-white text-xl uppercase"
        style={{ letterSpacing: "-0.03em" }}
      >
        MAHIS
      </Link>

      {/* Links */}
      <ul className="hidden md:flex items-center gap-10">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              data-magnetic
              className="font-sans font-medium text-mahis-muted text-fluid-xs uppercase tracking-mono hover:text-mahis-white transition-colors duration-300"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href="/contact"
        data-magnetic
        className="font-sans font-bold text-fluid-xs uppercase tracking-mono bg-mahis-yellow text-mahis-black px-6 py-3 transition-all duration-300 hover:bg-mahis-white"
        style={{ transitionTimingFunction: "cubic-bezier(0.76, 0, 0.24, 1)" }}
      >
        Start a project
      </Link>
    </nav>
  );
}
