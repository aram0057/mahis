"use client";

import { useEffect, useRef, MutableRefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

// Fade up on scroll — use on any element
export function useFadeUp(
  ref: MutableRefObject<HTMLElement | null>,
  options?: { delay?: number; duration?: number }
) {
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    gsap.fromTo(
      el,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: options?.duration ?? 1,
        delay: options?.delay ?? 0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [ref, options?.delay, options?.duration]);
}

// Reveal text line by line
export function useTextReveal(ref: MutableRefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const split = new SplitText(el, { type: "lines", linesClass: "line" });

    gsap.fromTo(
      split.lines,
      { y: "110%", opacity: 0 },
      {
        y: "0%",
        opacity: 1,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );

    return () => {
      split.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [ref]);
}

// Horizontal marquee / infinite scroll
export function useMarquee(
  ref: MutableRefObject<HTMLElement | null>,
  speed = 40
) {
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const width = el.offsetWidth / 2;

    gsap.to(el, {
      x: -width,
      duration: speed,
      ease: "none",
      repeat: -1,
    });

    return () => {
      gsap.killTweensOf(el);
    };
  }, [ref, speed]);
}
