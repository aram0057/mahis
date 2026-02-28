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
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 bg-mahis-white border-b border-mahis-black"
    >
      {/* Logo */}
      <Link
        href="/"
        className="font-display text-mahis-black text-2xl tracking-[0.15em] uppercase"
      >
        Mahis
      </Link>

      {/* Links */}
      <ul className="flex items-center gap-8">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="font-body text-mahis-grey-mid text-fluid-xs tracking-widest uppercase hover:text-mahis-black transition-colors duration-300"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href="/contact"
        className="font-body text-fluid-xs tracking-widest uppercase bg-mahis-gold text-mahis-black border border-mahis-black px-5 py-2 hover:bg-mahis-black hover:text-mahis-gold transition-all duration-300"
      >
        Start a project
      </Link>
    </nav>
  );
}
