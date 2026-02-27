# Mahis Studio — Web Boilerplate

Boutique brand elevation & web experience studio site.

## Stack
- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** with Mahis design tokens
- **GSAP** + ScrollTrigger + SplitText for animations
- **Three.js** for WebGL scenes
- **Lenis** for buttery smooth scrolling

## Get Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout — Nav, Cursor, Lenis
│   └── page.tsx            # Home page
├── components/
│   ├── ui/
│   │   ├── Cursor.tsx      # Custom GSAP-powered cursor
│   │   ├── Nav.tsx         # Fixed navigation
│   │   └── SmoothScrollProvider.tsx  # Lenis initialiser
│   ├── gsap/
│   │   └── Hero.tsx        # Hero section with GSAP entrance
│   └── three/
│       └── HeroCanvas.tsx  # Three.js particle field
├── lib/
│   ├── useLenis.ts         # Lenis + GSAP ScrollTrigger sync
│   ├── useWebGLScene.ts    # Three.js scene bootstrap hook
│   └── gsapUtils.ts        # Reusable GSAP animation hooks
└── styles/
    └── globals.css         # Design tokens, Lenis CSS, base styles
```

## Design Tokens

All tokens live in `tailwind.config.ts` and `globals.css`:

| Token | Value |
|-------|-------|
| `mahis-black` | `#0A0A0A` |
| `mahis-white` | `#F5F2ED` |
| `mahis-gold` | `#C9A96E` |
| `mahis-cream` | `#E8E0D0` |

**Fonts:** Cormorant Garamond (display) + DM Sans (body) + DM Mono (mono)

## Pages to Build Next
- `/work` — Selected case studies
- `/studio` — About Mahis
- `/services` — Offerings + pricing
- `/contact` — Project enquiry

## Notes
- GSAP SplitText requires a Club GreenSock licence for production — the hook is wired up, just swap the import if needed.
- WebGL particle scene is in `HeroCanvas.tsx` — extend this for more complex Three.js work.
- Lenis is synced with GSAP ticker in `useLenis.ts` so ScrollTrigger works seamlessly.
