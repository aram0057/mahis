"use client";

import { useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

interface UseLaptopSceneOptions {
  progressRef: React.MutableRefObject<number>;
  onReady?: () => void;
}

export function useLaptopScene(
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>,
  { progressRef, onReady }: UseLaptopSceneOptions
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animFrameId = 0;

    // ── Renderer ─────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // ── Scene + Camera ────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 8);

    // ── Lighting ──────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const keyLight = new THREE.DirectionalLight(0xfff5e0, 1.5);
    keyLight.position.set(3, 5, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xc9a96e, 0.6);
    rimLight.position.set(-4, 1, -4);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(0, -3, 3);
    scene.add(fillLight);

    // ── Particles ────────────────────────────────────────────────────────
    const pCount = 1500;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i++) pPos[i] = (Math.random() - 0.5) * 30;
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xc9a96e,
      size: 0.015,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.5,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ── Laptop model ──────────────────────────────────────────────────────
    let laptopGroup: THREE.Group | null = null;
    let mixer: THREE.AnimationMixer | null = null;
    let lidAction: THREE.AnimationAction | null = null;
    let clipDuration = 0;
    let screenMat: THREE.MeshStandardMaterial | null = null;

    const loader = new GLTFLoader();
    loader.load(
      "/models/macbook_pro_13_inch_2020.glb",
      (gltf) => {
        laptopGroup = gltf.scene;

        const box = new THREE.Box3().setFromObject(laptopGroup);
        const center = box.getCenter(new THREE.Vector3());
        laptopGroup.position.sub(center);
        laptopGroup.scale.setScalar(1.2);
        laptopGroup.position.z = 7.5;
        laptopGroup.position.y = -0.1;

        scene.add(laptopGroup);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).laptop = laptopGroup;

        // Screen mesh: hero content painted onto canvas texture
        const screenCanvas = document.createElement("canvas");
        screenCanvas.width = 1280;
        screenCanvas.height = 800;
        const ctx = screenCanvas.getContext("2d")!;

        // Background
        ctx.fillStyle = "#080808";
        ctx.fillRect(0, 0, 1280, 800);

        // Subtle radial glow behind text
        const grd = ctx.createRadialGradient(640, 380, 20, 640, 380, 380);
        grd.addColorStop(0, "rgba(201,169,110,0.08)");
        grd.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, 1280, 800);

        // Gold rule line
        ctx.strokeStyle = "#c9a96e";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(520, 220);
        ctx.lineTo(760, 220);
        ctx.stroke();

        // Main heading — "Brand elevation"
        ctx.fillStyle = "#c9a96e";
        ctx.font = "700 82px Georgia, serif";
        ctx.textAlign = "center";
        ctx.fillText("Brand elevation", 640, 310);

        // Italic "through" + "web"
        ctx.font = "italic 700 82px Georgia, serif";
        ctx.fillStyle = "#e8d5a3";
        ctx.fillText("through web", 640, 400);

        // "experience"
        ctx.font = "700 82px Georgia, serif";
        ctx.fillStyle = "#c9a96e";
        ctx.fillText("experience", 640, 490);

        // Subtitle
        ctx.font = "300 22px monospace";
        ctx.fillStyle = "#666";
        ctx.fillText("Mahis is a boutique studio crafting immersive digital experiences", 640, 570);
        ctx.fillText("for luxury brands and creative agencies.", 640, 600);

        // CTA hint
        ctx.font = "500 16px monospace";
        ctx.fillStyle = "#c9a96e";
        ctx.letterSpacing = "4px";
        ctx.fillText("VIEW SELECTED WORK  ·  START A PROJECT →", 640, 660);

        const screenTex = new THREE.CanvasTexture(screenCanvas);

        laptopGroup.traverse((node) => {
          if (node instanceof THREE.Mesh) {
            const mats = Array.isArray(node.material) ? node.material : [node.material];
            mats.forEach((m) => {
              if (m instanceof THREE.MeshStandardMaterial && m.name === "Material.002") {
                m.map = screenTex;
                m.color.set(0xffffff);
                m.roughness = 0.1;
                m.metalness = 0.0;
                m.emissive.set(0xc9a96e);
                m.emissiveIntensity = 0; // starts off, driven in render loop
                m.needsUpdate = true;
                screenMat = m;
              }
            });
          }
        });

        // Lid animation
        if (gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(laptopGroup);
          const clip = gltf.animations[0];
          clipDuration = clip.duration;
          lidAction = mixer.clipAction(clip);
          lidAction.play();
          // Set initial pose at time=0 without advancing
          lidAction.time = 0;
          mixer.update(0);
        }

        onReady?.();
      },
      undefined,
      (err) => console.error("GLB load error:", err)
    );

    // ── Mouse parallax ────────────────────────────────────────────────────
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    // ── Render loop ───────────────────────────────────────────────────────
    const tick = () => {
      animFrameId = requestAnimationFrame(tick);
      const p = Math.min(1, Math.max(0, progressRef.current));

      // Particles fade out after halfway
      particles.rotation.y += 0.0002;
      particles.rotation.x += 0.0001;
      pMat.opacity = 0.5 * (1 - Math.max(0, (p - 0.5) / 0.5));

      if (laptopGroup) {
        // position.z is NOT reset here — set it once on load, tweak via console: laptop.position.z = -3

        // Subtle mouse parallax only
        laptopGroup.rotation.y = THREE.MathUtils.lerp(
          laptopGroup.rotation.y,
          mouseX * 0.04,
          0.05
        );
        laptopGroup.rotation.x = THREE.MathUtils.lerp(
          laptopGroup.rotation.x,
          mouseY * 0.02,
          0.05
        );

        // Lid: only play the opening half of the clip (clip contains open+close cycle)
        if (mixer && lidAction && clipDuration > 0) {
          const lidP = Math.max(0, Math.min(1, (p - 0.05) / 0.8));
          lidAction.time = lidP * (clipDuration * 0.22);
          mixer.update(0);
          // Screen glows as lid approaches fully open (last 30% of lid travel)
          if (screenMat) {
            screenMat.emissiveIntensity = Math.max(0, (lidP - 0.7) / 0.3) * 0.25;
          }
        }
      }

      renderer.render(scene, camera);
    };

    tick();

    // ── Resize ────────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      pGeo.dispose();
      pMat.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
