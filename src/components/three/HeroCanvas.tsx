"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useWebGLScene } from "@/lib/useWebGLScene";

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useWebGLScene(
    canvasRef,
    (scene, camera, renderer) => {
      // Particle field — subtle, luxurious
      const count = 2000;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);

      for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 20;
      }

      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      const material = new THREE.PointsMaterial({
        color: 0xc9a96e, // mahis-gold
        size: 0.015,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.6,
      });

      const particles = new THREE.Points(geometry, material);
      scene.add(particles);

      camera.position.z = 6;

      // Mouse influence
      let mouseX = 0;
      let mouseY = 0;

      const onMouseMove = (e: MouseEvent) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
      };
      window.addEventListener("mousemove", onMouseMove);

      const animate = () => {
        particles.rotation.y += 0.0003;
        particles.rotation.x += 0.0001;

        // Subtle mouse parallax
        particles.rotation.y += (mouseX - particles.rotation.y) * 0.02;
        particles.rotation.x += (-mouseY - particles.rotation.x) * 0.02;
      };

      const cleanup = () => {
        window.removeEventListener("mousemove", onMouseMove);
        geometry.dispose();
        material.dispose();
      };

      return { animate, cleanup };
    },
    { alpha: true, antialias: true }
  );

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden
    />
  );
}
