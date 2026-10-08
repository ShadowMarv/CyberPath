# CyberPath

A free, interactive cybersecurity learning site: roadmap, career paths, team types, encryption explained, certificates with official links, curated resources, and hands-on practice (quiz, lab, terminal game).

Built with **React 18**, **TypeScript (strict)**, **Three.js**, **GSAP** and **Vite**. No backend, no accounts. Progress is stored in the browser (`localStorage`).

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
| Learn | Concept atlas (58 advanced concepts), Roadmap (with progress tracker), Study planner, Careers, Cyber teams, Encryption, Attack vs defense (kill chain), Risk matrix |
| Prove | Certificates (filterable, with official links), Quiz |
| Explore | Arsenal (tools and techniques, with XP), Threat radar (simulated), Resources (searchable), Commands cheat sheet, Glossary, Home lab guide |
| Practice | Practice lab (12 challenges), Terminal game (3 flags), Firewall duel, Phish spotter, Incident simulator, Network lab (subnets, ports, hash avalanche), Toolbox (encoder, hash, password strength) |

Extras: an illustrated hero scene (shield over a connected city, with parallax), a large animated icon watermark on every page, seven more lesson diagrams, a skill radar chart on My progress, Analyzers (local link, file, email-header and auth-log analysis, indicative only), a goal-based tools and certificate finder, a Home page organized into Learn, Analyze, Practice, Protect and Reference pillars, a regrouped top navigation with an Analyze menu, Nova, an original 3D mascot built from Three.js primitives that stays in place, looks at the pointer, blinks, can be dragged and sparkles when clicked (no text; toggle in the footer), CTF arena (11 challenges, points, hints, scoreboard), packet analyzer with Wireshark-style filters, Crypto lab (Vigenere, frequency analysis, RSA and Diffie-Hellman with toy numbers), achievements with unlock toasts, a printable progress certificate, more simulations (SOC case files with log triage, Defense lab with ransomware spread / DDoS load / cracking cost, voice scam and spot-the-vulnerability drills, 10 step-by-step attack simulations including TLS handshake), optional cyber effects (drifting network nodes with a rare packet, faint binary streams, a slow scan line, grain and scanlines, title glitch on page change, card hover scan) behind an FX toggle and fully off for reduced motion, Stay safe page (checklist of ~60 habits, attack-to-protection table, what to do if hacked), SOC dashboard (simulated), interactive network map, attack simulations (phishing, SQLi, DDoS, MITM), threat intel and timeline page, status chips from real browser state, custom animated SVG diagrams in lessons (defense in depth, CIA triad, encryption flow, ports, permission bits, OAuth sequence), animated journey map, tip of the day, myth-or-fact flip cards, My progress page (skill tree, streak, next lessons), a hidden easter egg, Linux security lessons, chmod calculator, a more realistic terminal game, skip link and focus management, `/` search shortcut, an About page with live stats, animated GSAP stroke icons and four rotating Three.js 3D icons, ~80 extra glossary keywords shared with CyberBot, CyberBot (offline assistant that answers from the site's own data: terms, tools, ports, certificates, careers, navigation), GSAP scroll reveals, 3D card tilt, magnetic buttons, cursor glow, aurora background and scroll progress bar; rotating 3D network sphere with attack packets (Three.js), typewriter headline, dark/light mode, rank and XP system, command palette (`Ctrl/Cmd + K`), copy buttons for commands, mobile-friendly layout.

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
   ├─ App.tsx            Layout, fixed top navigation bar (dropdown groups, hamburger on mobile), hash router, theme, XP, command palette
   ├─ Pages.tsx          Home, Roadmap, Careers, Teams, Encryption, Certificates,
   │                     Resources, Commands, Glossary, Home lab
   ├─ Lab.tsx            12 browser challenges with hints and saved progress
   ├─ Terminal.tsx       Fake Linux shell, capture 3 flags
   ├─ KillChain.tsx      Interactive kill chain (red/blue views)
   ├─ Quiz.tsx           10-question quiz
   ├─ Tools.tsx          Toolbox (encode/decode, hashes, password strength) and Study planner
   ├─ Globe.tsx          Three.js scene
   ├─ fx.ts              GSAP effects (page reveals, tilt, magnetic buttons, aurora)
   ├─ Radar.tsx, NetLab.tsx, Risk.tsx   Canvas radar, network/crypto visuals, risk heatmap
   ├─ Drill.tsx, drills.ts   Shared scenario engine (firewall, phishing, incident response)
   ├─ Atlas.tsx          Concept atlas; data in content/atlas.ts
   ├─ LessonPage.tsx     Lesson viewer (what/why/how/where/wrong/defend/practice + quiz)
   ├─ content/lessons.ts Lesson content and metadata: add lessons here
   ├─ Icon.tsx, Icons3D.tsx  GSAP self-drawing SVG icons and Three.js 3D icon strip
   ├─ content/keywords.ts  Field keywords used by the Glossary page and CyberBot
   ├─ Diagram.tsx, Delight.tsx, Progress.tsx, Rain.tsx   Lesson diagrams, home extras, progress dashboard, easter egg
   ├─ Safety.tsx, Soc.tsx, NetMap.tsx, Sims.tsx, Intel.tsx   Safety advice, SOC dashboard, network map, attack simulations, intel and timeline
   ├─ Background.tsx     One lightweight canvas for the background effects (about 30 fps, paused when the tab is hidden)
   ├─ SocCase.tsx, DefenseLab.tsx, Drills2.tsx   Log triage cases, defense simulations and scenario drills
   ├─ Ctf.tsx, Packets.tsx, CryptoLab.tsx, Achievements.tsx   CTF arena, packet analyzer, crypto toys, achievements
   ├─ Nova.tsx           3D mascot (Three.js, draggable, no autonomous roaming; hidden below 600px)
   ├─ Analyze.tsx, Finder.tsx   Local analyzers and the goal-based finder
   ├─ Skyline.tsx        Illustrated hero scene (SVG + GSAP)
   ├─ About.tsx          Principles, live counts and what is coming later
   ├─ Bot.tsx            CyberBot: rule-based assistant, no API key or network needed
   ├─ ArsenalPage.tsx        Tool/technique explorer; data in arsenalData.ts
   ├─ hooks.ts           useLS (localStorage), useHash, caesar, sha helpers
   ├─ data.ts            Teams, encryption, certificates, careers, commands, glossary, resources
   └─ styles.css         Design tokens (light/dark), layout, components
```

## How it works

- **Routing:** hash-based (`#road`, `#lab`, ...). The page list lives in the `META` array in `App.tsx`; the sidebar, Back/Next buttons, home grid and command palette are all generated from it.
- **Theme:** CSS custom properties in `styles.css`. The toggle sets `data-theme` on `<html>`; the first visit follows the OS setting.
- **State:** `useLS` wraps `localStorage` (with try/catch) and emits an `ls` event so the sidebar XP updates live.
- **XP:** roadmap item = 10, lab challenge = 40, terminal flag = 50, best quiz score point = 20. Ranks: Newbie, Apprentice, Analyst, Hunter, Operator, Architect. All GSAP effects switch off when the OS requests reduced motion.
- **Crypto helpers:** hashing uses the browser Web Crypto API (`crypto.subtle`).

## Customizing content

| To change | Edit |
|---|---|
| Teams, encryption cards, careers, commands, glossary, resources | `src/data.ts` |
| Certificate rows | `certs` in `src/data.ts` |
| Certificate links | `CU` map in `src/Pages.tsx` (keyed by certificate name) |
| Concept atlas entries | `src/content/atlas.ts` |
| Guided lessons | `src/content/lessons.ts` |
| Roadmap stages and checklist items | `ST` in `src/Pages.tsx` |
| Lab challenges | `C` in `src/Lab.tsx` |
| Arsenal tools and techniques | `src/arsenalData.ts` |
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
