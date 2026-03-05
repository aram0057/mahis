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

    const rimLight = new THREE.DirectionalLight(0x2952e3, 0.6);
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
      color: 0x0d0d0d,
      size: 0.015,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.35,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ── Laptop model ──────────────────────────────────────────────────────
    let laptopGroup: THREE.Group | null = null;
    let mixer: THREE.AnimationMixer | null = null;
    let lidAction: THREE.AnimationAction | null = null;
    let clipDuration = 0;
    let screenMat: THREE.MeshStandardMaterial | null = null;
    let screenTex: THREE.VideoTexture | null = null;
    let videoEl: HTMLVideoElement | null = null;

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

        // ── Video texture on the laptop screen ────────────────────────────
        // Drop your video at /public/videos/screen.mp4
        videoEl = document.createElement("video");
        videoEl.src = "/videos/screen.mp4";
        videoEl.loop = true;
        videoEl.muted = true;
        videoEl.playsInline = true;
        videoEl.autoplay = true;
        videoEl.play().catch(() => { /* autoplay blocked — user gesture will resume */ });
        screenTex = new THREE.VideoTexture(videoEl);
        screenTex.colorSpace = THREE.SRGBColorSpace;

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

        // Lid opens over first 45% of scroll (p=0.05 → 0.45)
        const lidP = (mixer && lidAction && clipDuration > 0)
          ? Math.max(0, Math.min(1, (p - 0.05) / 0.40))
          : 0;

        if (mixer && lidAction && clipDuration > 0) {
          lidAction.time = lidP * (clipDuration * 0.22);
          mixer.update(0);
          // Screen glows as lid approaches fully open (last 30% of lid travel)
          if (screenMat) {
            screenMat.emissiveIntensity = Math.max(0, (lidP - 0.7) / 0.3) * 0.25;
          }
        }

        // VideoTexture refreshes automatically each frame — no manual update needed
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
      screenTex?.dispose();
      if (videoEl) { videoEl.pause(); videoEl.src = ""; }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
