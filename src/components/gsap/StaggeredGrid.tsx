"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePreloaderDone } from "@/components/ui/LayoutClient";

gsap.registerPlugin(ScrollTrigger);

const COLORS = [
  "#2952E3", "#6B8AF7", "#0D0D0D", "#3A86FF", "#F72585",
  "#06D6A0", "#8338EC", "#FFBE0B", "#FB5607", "#00B4D8",
  "#E8E8E8", "#FF3366", "#7B2D8B", "#38B000", "#EF233C",
  "#4CC9F0", "#F77F00", "#D62828", "#023E8A", "#6D6875",
];

export function StaggeredGrid() {
  const isReady = usePreloaderDone();
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isReady) return;
    const grid = gridRef.current;
    if (!grid) return;

    const ctx = gsap.context(() => {
      const gridItems = Array.from(
        grid.querySelectorAll<HTMLElement>(".grid__item")
      );

      const numColumns = getComputedStyle(grid)
        .gridTemplateColumns.split(" ").length;
      const middleColumnIndex = Math.floor(numColumns / 2);

      const columns: HTMLElement[][] = Array.from(
        { length: numColumns },
        () => []
      );
      gridItems.forEach((item, index) => {
        columns[index % numColumns].push(item);
      });

      columns.forEach((columnItems, columnIndex) => {
        const delayFactor = Math.abs(columnIndex - middleColumnIndex) * 0.2;

        const imgs = columnItems
          .map((item) => item.querySelector<HTMLElement>(".grid__item-img"))
          .filter((el): el is HTMLElement => el !== null);

        gsap
          .timeline({
            scrollTrigger: {
              trigger: grid,
              start: "top bottom",
              end: "center center",
              scrub: true,
            },
          })
          .from(columnItems, {
            yPercent: 450,
            autoAlpha: 0,
            delay: delayFactor,
            ease: "sine",
          })
          .from(
            imgs,
            {
              rotateX: 90,
              transformOrigin: "50% 0%",
              ease: "sine",
            },
            0
          );
      });
    }, grid);

    return () => ctx.revert();
  }, [isReady]);

  return (
    <section className="bg-mahis-white">
      <div
        ref={gridRef}
        className="grid grid-cols-5 gap-1"
      >
        {COLORS.map((color, i) => (
          <div
            key={i}
            className="grid__item aspect-[2/3] [perspective:600px]"
          >
            <div
              className="grid__item-img w-full h-full"
              style={{ backgroundColor: color }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
