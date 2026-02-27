"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface WebGLSceneOptions {
  alpha?: boolean;
  antialias?: boolean;
}

// Base hook to bootstrap a Three.js scene into a canvas ref
export function useWebGLScene(
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
  setupScene: (
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer
  ) => { animate?: () => void; cleanup?: () => void },
  options: WebGLSceneOptions = {}
) {
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: options.alpha ?? true,
      antialias: options.antialias ?? true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // User setup
    const { animate, cleanup } = setupScene(scene, camera, renderer);

    // Render loop
    const tick = () => {
      animFrameRef.current = requestAnimationFrame(tick);
      if (animate) animate();
      renderer.render(scene, camera);
    };
    tick();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (cleanup) cleanup();
    };
  }, [canvasRef]);
}
