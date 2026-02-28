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

    const rimLight = new THREE.DirectionalLight(0xffe500, 0.6);
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
    let contentCanvas: HTMLCanvasElement | null = null;
    let screenViewport: HTMLCanvasElement | null = null;
    let screenViewCtx: CanvasRenderingContext2D | null = null;
    let screenTex: THREE.CanvasTexture | null = null;

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

        // Screen mesh: scrollable canvas texture (3 sections × 1200px = 3600px tall)
        contentCanvas = document.createElement("canvas");
        contentCanvas.width = 1280;
        contentCanvas.height = 3600;
        const c = contentCanvas.getContext("2d")!;

        // Helper: draw a pill/rect button
        const drawBtn = (text: string, cx: number, cy: number, variant: "outline" | "fill") => {
          c.font = "700 11px monospace";
          c.letterSpacing = "3px";
          const tw = c.measureText(text).width;
          const bw = tw + 64; const bh = 44;
          const bx = cx - bw / 2; const by = cy - bh / 2;
          if (variant === "fill") {
            c.fillStyle = "#0d0d0d"; c.fillRect(bx, by, bw, bh);
            c.fillStyle = "#ffffff";
          } else {
            c.strokeStyle = "#0d0d0d"; c.lineWidth = 1.5;
            c.strokeRect(bx, by, bw, bh);
            c.fillStyle = "#0d0d0d";
          }
          c.textAlign = "center"; c.fillText(text, cx, cy + 4);
        };

        // ── Section 1: Hero (y: 0–1200) ──────────────────────────────────
        c.fillStyle = "#ffffff";
        c.fillRect(0, 0, 1280, 1200);

        // Nav bar
        c.fillStyle = "#ffffff";
        c.fillRect(0, 0, 1280, 52);
        c.strokeStyle = "#0d0d0d";
        c.lineWidth = 1;
        c.beginPath(); c.moveTo(0, 52); c.lineTo(1280, 52); c.stroke();
        c.font = "400 10px monospace";
        c.letterSpacing = "5px";
        c.fillStyle = "#0d0d0d";
        c.textAlign = "left";
        c.fillText("MAHIS", 60, 32);
        c.textAlign = "right";
        c.fillStyle = "#999999";
        c.fillText("WORK    ABOUT    CONTACT", 1220, 32);

        // Radial glow (subtle yellow)
        const grd = c.createRadialGradient(640, 560, 20, 640, 560, 480);
        grd.addColorStop(0, "rgba(255,229,0,0.07)");
        grd.addColorStop(1, "rgba(255,255,255,0)");
        c.fillStyle = grd;
        c.fillRect(0, 0, 1280, 1200);

        // Yellow rule line
        c.strokeStyle = "#ffe500";
        c.lineWidth = 2;
        c.beginPath(); c.moveTo(560, 270); c.lineTo(720, 270); c.stroke();

        // Heading
        c.fillStyle = "#0d0d0d";
        c.font = "900 82px Arial, sans-serif";
        c.letterSpacing = "-1px";
        c.textAlign = "center";
        c.fillText("BRAND ELEVATION", 640, 390);
        c.font = "italic 300 82px Arial, sans-serif";
        c.fillStyle = "#ff6b00";
        c.letterSpacing = "0px";
        c.fillText("through web", 640, 490);
        c.font = "900 82px Arial, sans-serif";
        c.fillStyle = "#0d0d0d";
        c.fillText("EXPERIENCE", 640, 590);

        // Subtitle
        c.font = "300 19px monospace";
        c.letterSpacing = "0px";
        c.fillStyle = "#999999";
        c.fillText("A boutique studio crafting immersive digital experiences", 640, 680);
        c.fillText("for luxury brands and creative agencies.", 640, 710);

        // CTA buttons
        drawBtn("VIEW SELECTED WORK", 440, 810, "outline");
        drawBtn("START A PROJECT  →", 840, 810, "fill");

        // Section divider
        c.strokeStyle = "#0d0d0d18";
        c.lineWidth = 0.5;
        c.beginPath(); c.moveTo(80, 1160); c.lineTo(1200, 1160); c.stroke();
        c.font = "300 9px monospace";
        c.letterSpacing = "4px";
        c.fillStyle = "#999999";
        c.textAlign = "center";
        c.fillText("↓  SCROLL", 640, 1130);

        // ── Section 2: Selected Work (y: 1200–2400) ───────────────────────
        c.fillStyle = "#f7f7f5";
        c.fillRect(0, 1200, 1280, 1200);

        // Section label
        c.font = "500 10px monospace";
        c.letterSpacing = "6px";
        c.fillStyle = "#999999";
        c.textAlign = "center";
        c.fillText("SELECTED WORK", 640, 1290);
        c.strokeStyle = "#0d0d0d";
        c.lineWidth = 1;
        c.beginPath(); c.moveTo(560, 1310); c.lineTo(720, 1310); c.stroke();

        // Card 1 — Luna Collective
        const c1 = { x: 70, y: 1360, w: 530, h: 400 };
        c.fillStyle = "#e8e8e8";
        c.fillRect(c1.x, c1.y, c1.w, c1.h);
        const g1 = c.createLinearGradient(c1.x, c1.y, c1.x + c1.w, c1.y + 220);
        g1.addColorStop(0, "#fffde8"); g1.addColorStop(1, "#f0f0e8");
        c.fillStyle = g1;
        c.fillRect(c1.x, c1.y, c1.w, 220);
        c.strokeStyle = "#0d0d0d18"; c.lineWidth = 0.5;
        c.strokeRect(c1.x, c1.y, c1.w, c1.h);
        c.strokeStyle = "#ffe500"; c.lineWidth = 2;
        c.beginPath(); c.moveTo(c1.x, c1.y); c.lineTo(c1.x + 70, c1.y); c.stroke();
        // Card 1 label in image area
        c.font = "300 9px monospace"; c.letterSpacing = "4px";
        c.fillStyle = "#99999960"; c.textAlign = "left";
        c.fillText("001", c1.x + 24, c1.y + 36);
        // Card 1 info
        c.fillStyle = "#0d0d0d"; c.font = "800 26px Arial, sans-serif";
        c.letterSpacing = "0px"; c.textAlign = "left";
        c.fillText("LUNA COLLECTIVE", c1.x + 24, c1.y + 272);
        c.font = "300 10px monospace"; c.letterSpacing = "2px";
        c.fillStyle = "#999999";
        c.fillText("LUXURY FASHION  ·  IDENTITY", c1.x + 24, c1.y + 298);
        c.strokeStyle = "#0d0d0d15"; c.lineWidth = 0.5;
        c.beginPath(); c.moveTo(c1.x + 24, c1.y + 320); c.lineTo(c1.x + c1.w - 24, c1.y + 320); c.stroke();
        c.fillStyle = "#0d0d0d"; c.font = "700 10px monospace"; c.letterSpacing = "3px";
        c.fillText("VIEW CASE STUDY  →", c1.x + 24, c1.y + 368);

        // Card 2 — Aurum Labs
        const c2 = { x: 680, y: 1360, w: 530, h: 400 };
        c.fillStyle = "#e8e8e8";
        c.fillRect(c2.x, c2.y, c2.w, c2.h);
        const g2 = c.createLinearGradient(c2.x, c2.y, c2.x + c2.w, c2.y + 220);
        g2.addColorStop(0, "#f0f5ff"); g2.addColorStop(1, "#e8e8f0");
        c.fillStyle = g2;
        c.fillRect(c2.x, c2.y, c2.w, 220);
        c.strokeStyle = "#0d0d0d18"; c.lineWidth = 0.5;
        c.strokeRect(c2.x, c2.y, c2.w, c2.h);
        c.strokeStyle = "#ffe500"; c.lineWidth = 2;
        c.beginPath(); c.moveTo(c2.x, c2.y); c.lineTo(c2.x + 70, c2.y); c.stroke();
        c.font = "300 9px monospace"; c.letterSpacing = "4px";
        c.fillStyle = "#99999960"; c.textAlign = "left";
        c.fillText("002", c2.x + 24, c2.y + 36);
        c.fillStyle = "#0d0d0d"; c.font = "800 26px Arial, sans-serif";
        c.letterSpacing = "0px"; c.textAlign = "left";
        c.fillText("AURUM LABS", c2.x + 24, c2.y + 272);
        c.font = "300 10px monospace"; c.letterSpacing = "2px";
        c.fillStyle = "#999999";
        c.fillText("FINTECH  ·  WEB PLATFORM", c2.x + 24, c2.y + 298);
        c.strokeStyle = "#0d0d0d15"; c.lineWidth = 0.5;
        c.beginPath(); c.moveTo(c2.x + 24, c2.y + 320); c.lineTo(c2.x + c2.w - 24, c2.y + 320); c.stroke();
        c.fillStyle = "#0d0d0d"; c.font = "700 10px monospace"; c.letterSpacing = "3px";
        c.fillText("VIEW CASE STUDY  →", c2.x + 24, c2.y + 368);

        // Pagination + All projects button
        c.textAlign = "center";
        c.fillStyle = "#999999"; c.font = "300 10px monospace"; c.letterSpacing = "2px";
        c.fillText("01  /  06", 640, 1820);
        drawBtn("VIEW ALL PROJECTS  →", 640, 1900, "outline");

        // Section divider
        c.strokeStyle = "#0d0d0d10";
        c.lineWidth = 0.5;
        c.beginPath(); c.moveTo(80, 2360); c.lineTo(1200, 2360); c.stroke();

        // ── Section 3: Our Process (y: 2400–3600) ─────────────────────────
        c.fillStyle = "#fafafa";
        c.fillRect(0, 2400, 1280, 1200);

        // Section label
        c.font = "500 10px monospace";
        c.letterSpacing = "6px";
        c.fillStyle = "#999999";
        c.textAlign = "center";
        c.fillText("OUR PROCESS", 640, 2490);
        c.strokeStyle = "#0d0d0d";
        c.lineWidth = 1;
        c.beginPath(); c.moveTo(570, 2510); c.lineTo(710, 2510); c.stroke();

        // 4-step grid
        const steps: [string, string, string[]][] = [
          ["01", "Discovery",  ["Research, strategy &", "brand immersion."]],
          ["02", "Design",     ["Visual systems &", "interaction design."]],
          ["03", "Build",      ["Next.js, Three.js &", "motion engineering."]],
          ["04", "Launch",     ["QA, deployment &", "ongoing refinement."]],
        ];
        steps.forEach(([num, title, desc], i) => {
          const x = i % 2 === 0 ? 120 : 760;
          const y = 2570 + Math.floor(i / 2) * 260;
          // Step number
          c.font = "300 10px monospace"; c.letterSpacing = "3px";
          c.fillStyle = "#dddddd"; c.textAlign = "left";
          c.fillText(num, x, y);
          // Separator
          c.strokeStyle = "#0d0d0d12"; c.lineWidth = 0.5;
          c.beginPath(); c.moveTo(x, y + 14); c.lineTo(x + 440, y + 14); c.stroke();
          // Title
          c.fillStyle = "#0d0d0d"; c.font = "800 24px Arial, sans-serif";
          c.letterSpacing = "0px";
          c.fillText(title.toUpperCase(), x, y + 54);
          // Description lines
          c.fillStyle = "#999999"; c.font = "300 13px monospace";
          desc.forEach((line, li) => c.fillText(line, x, y + 84 + li * 22));
        });

        // Bottom CTA
        drawBtn("START YOUR PROJECT  →", 640, 3450, "fill");

        // Footer
        c.font = "300 9px monospace"; c.letterSpacing = "4px";
        c.fillStyle = "#999999"; c.textAlign = "center";
        c.fillText("MAHIS STUDIO  ©  2025", 640, 3540);

        // Viewport canvas — the actual texture (1280×800 window into contentCanvas)
        screenViewport = document.createElement("canvas");
        screenViewport.width = 1280;
        screenViewport.height = 800;
        screenViewCtx = screenViewport.getContext("2d")!;
        screenViewCtx.drawImage(contentCanvas, 0, 0, 1280, 800, 0, 0, 1280, 800);
        screenTex = new THREE.CanvasTexture(screenViewport);

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

        // Screen content scrolls only after lid fully open (p=0.45 → 0.90)
        if (screenViewCtx && screenTex && contentCanvas) {
          const scrollP = Math.max(0, Math.min(1, (p - 0.45) / 0.45));
          const scrollY = Math.round(scrollP * (contentCanvas.height - 800));
          screenViewCtx.drawImage(contentCanvas, 0, scrollY, 1280, 800, 0, 0, 1280, 800);
          screenTex.needsUpdate = true;
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
      screenTex?.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
