# GreyVoice — Healthcare Integration

React 19 landing page, built with the Sites Vinext/Vite starter. English product copy and illustrative USD per-minute pricing. Inspired by Appycamper's dark editorial typography, visual collage, and numbered storytelling sections.

## Local development

Install: `npm ci`
Preview: `npm run dev -- --port 5188`
Build: `npm run build`
Pricing checks: `node scripts/check-pricing.mjs`
Type check: `node node_modules/typescript/bin/tsc --noEmit`

On this Windows machine, the npm command shim cannot launch cmd.exe. Equivalent direct commands after dependencies are installed:

- Preview: `node node_modules/vinext/dist/cli.js dev --port 5188`
- Build: `node scripts/run-framework.mjs build`

## Content and configuration

- `app/page.tsx`: copy, navigation, fictional clinical draft demonstration, approval gate, EMR mapping, UI-only demo request modal.
- `app/globals.css`: responsive design, reduced-motion support, typography.
- `hooks/use-page-motion.ts`: staggered scroll reveals, desktop hero parallax, active navigation, and reading progress. Uses native browser APIs; reduced motion and keyboard focus keep content immediately accessible.
- `lib/pricing.mjs`: illustrative rates ($0.012 transcription / $0.024 clinical draft) and calculator.
- `public/images/`: two original AI-generated healthcare images, optimized as WebP.

## Integration status

Dev2 deployment and Cloudflare DNS instructions: [deploy/dev2/README.md](deploy/dev2/README.md). Run `npm run build:dev2` for a public static export of the same React page.

The landing page is a marketing experience. It does not record real consultations, contact a backend, submit leads, take payments, or send data to an EMR. The draft demo uses fictional data and exports a sample JSON file. The Request a demo form validates required fields and shows a local preview confirmation; it does not submit or persist the entered information. Connect a real sales contact or lead endpoint before public launch.

Product context was read from `D:/Kerja/emr-voice-to-text` and the Puskesmas medical-record source. Neither source project was modified. Current adapters are proof-of-concept; client connectors require separate implementation and validation. No patient data, credentials, recordings, or proprietary source from those projects is published here. Prices, billing rules, and the GreyVoice brand are starting points for review.
