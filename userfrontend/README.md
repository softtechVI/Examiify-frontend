# User Frontend (Vite + React + TypeScript)

This is the user-facing React application built with Vite and TypeScript nd latest frontend with ai made .

## Requirements

- Node.js 18+
- npm (or pnpm/yarn)

## Install and run

```powershell
cd userfrontend
npm install
npm run dev
```

Build for production:

```powershell
npm run build
```

Preview build locally:

```powershell
npm run preview
```

## Scripts (from package.json)

- `dev` — runs `vite` for local development
- `build` — builds the production assets (`vite build`)
- `build:dev` — builds using development mode
- `lint` — runs eslint
- `preview` — serves the production build locally

## Environment

Client-side environment variables must start with `VITE_` to be exposed to the app. Example:

- `VITE_API_BASE` — URL of the backend API

## Useful paths

- `src/` — source code
- `src/pages` — route pages (e.g., `UserApp.tsx`)
- `public/` — static assets

## Notes

If TypeScript complains about CSS imports (for example `Cannot find module './index.css'`), create a global declaration file `src/declarations.d.ts` with:

```ts
declare module '*.css';
declare module '*.scss';
```
