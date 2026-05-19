# AGENTS.md

## Cursor Cloud specific instructions

- **Stack**: Next.js 16 (App Router, static export), React 19, TypeScript 5, Tailwind CSS 4, shadcn/ui. Fully client-side — no backend, no database.
- **Package manager**: npm (`package-lock.json`). Run `npm install` to restore dependencies.
- **Dev server**: `npm run dev` starts on `localhost:3000`.
- **Scripts**: `npm run lint` (ESLint), `npm run test` (Vitest), `npm run build` (static export).
- **Pre-existing lint errors**: The repo has ~9 `react-hooks/set-state-in-effect` errors and a few `@next/next/no-img-element` warnings. These are pre-existing and not caused by agent changes.
- **No env vars required**: The single optional var `NEXT_PUBLIC_SITE_URL` defaults to `https://tukarqr.my`.
- **Static export**: `next build` produces a fully static site (`output: "export"` in `next.config.ts`). No server runtime needed.
