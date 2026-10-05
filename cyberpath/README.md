# CyberPath

A free, interactive cybersecurity learning site: roadmap, career paths, team types, encryption explained, certificates with official links, curated resources, and hands-on practice (quiz, lab, terminal game).

Built with **React 18**, **TypeScript (strict)**, **Three.js** and **Vite**. No backend, no accounts. Progress is stored in the browser (`localStorage`).

> Educational use only. Practice only on systems you own or have written permission to test. Unauthorized access is illegal.

## Table of contents
1. [Features](#features)
2. [Quick start](#quick-start)
3. [Scripts](#scripts)
4. [Project structure](#project-structure)
5. [How it works](#how-it-works)
6. [Customizing content](#customizing-content)
7. [Deployment](#deployment)
8. [Accessibility and privacy](#accessibility-and-privacy)
9. [Roadmap ideas](#roadmap-ideas)

## Features

| Area | Pages |
|---|---|
| Learn | Roadmap (with progress tracker), Study planner, Careers, Cyber teams, Encryption, Attack vs defense (kill chain) |
| Prove | Certificates (filterable, with official links), Quiz |
| Explore | Resources (searchable), Commands cheat sheet, Glossary, Home lab guide |
| Practice | Practice lab (12 challenges), Terminal game (3 flags), Toolbox (encoder, hash, password strength) |

Extras: rotating 3D network sphere with attack packets (Three.js), typewriter headline, dark/light mode, rank and XP system, command palette (`Ctrl/Cmd + K`), copy buttons for commands, mobile-friendly layout.

## Quick start

Requirements: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Type-check (`tsc`) and build to `dist/` as a single self-contained `index.html` |
| `npm run preview` | Serve the production build locally |

## Project structure

```
cyberpath/
├─ index.html            App shell
├─ vite.config.ts        Vite + React + single-file output
├─ tsconfig.json         Strict TypeScript config
└─ src/
   ├─ main.tsx           Entry point
   ├─ App.tsx            Layout, hash router, theme, XP, command palette
   ├─ Pages.tsx          Home, Roadmap, Careers, Teams, Encryption, Certificates,
   │                     Resources, Commands, Glossary, Home lab
   ├─ Lab.tsx            12 browser challenges with hints and saved progress
   ├─ Terminal.tsx       Fake Linux shell, capture 3 flags
   ├─ KillChain.tsx      Interactive kill chain (red/blue views)
   ├─ Quiz.tsx           10-question quiz
   ├─ Tools.tsx          Toolbox (encode/decode, hashes, password strength) and Study planner
   ├─ Globe.tsx          Three.js scene
   ├─ hooks.ts           useLS (localStorage), useHash, caesar, sha helpers
   ├─ data.ts            Teams, encryption, certificates, careers, commands, glossary, resources
   └─ styles.css         Design tokens (light/dark), layout, components
```

## How it works

- **Routing:** hash-based (`#road`, `#lab`, ...). The page list lives in the `META` array in `App.tsx`; the sidebar, Back/Next buttons, home grid and command palette are all generated from it.
- **Theme:** CSS custom properties in `styles.css`. The toggle sets `data-theme` on `<html>`; the first visit follows the OS setting.
- **State:** `useLS` wraps `localStorage` (with try/catch) and emits an `ls` event so the sidebar XP updates live.
- **XP:** roadmap item = 10, lab challenge = 40, terminal flag = 50, best quiz score point = 20. Ranks: Newbie, Apprentice, Analyst, Hunter, Operator, Architect.
- **Crypto helpers:** hashing uses the browser Web Crypto API (`crypto.subtle`).

## Customizing content

| To change | Edit |
|---|---|
| Teams, encryption cards, careers, commands, glossary, resources | `src/data.ts` |
| Certificate rows | `certs` in `src/data.ts` |
| Certificate links | `CU` map in `src/Pages.tsx` (keyed by certificate name) |
| Roadmap stages and checklist items | `ST` in `src/Pages.tsx` |
| Lab challenges | `C` in `src/Lab.tsx` |
| Quiz questions | `Q` in `src/Quiz.tsx` |
| Terminal files, commands and flags | `FS`, `FL`, `run()` in `src/Terminal.tsx` |
| Colors and fonts | CSS variables at the top of `src/styles.css` |
| Add a page | Add a row to `META` and a `case` in `view()` in `src/App.tsx` |

## Deployment

`npm run build` produces one self-contained file, `dist/index.html`. Host it on any static host (GitHub Pages, Netlify, Cloudflare Pages, an S3 bucket) or open it directly from disk.

## Accessibility and privacy

- Keyboard navigable, visible focus states, labeled inputs, `prefers-reduced-motion` respected (typing cursor and 3D rotation calm down).
- No tracking, no network requests, no data leaves the browser. Passwords typed into the strength tool are never sent anywhere.

## Roadmap ideas

- 3D clickable attack-path map
- Daily challenge and streaks
- Per-certificate study plans and flashcards
- More terminal levels (privilege escalation, log forensics)
- Language translations

## Notes on content

Certificate prices, free tiers and promotions change often. The links point to vendor pages; always verify current details there.
