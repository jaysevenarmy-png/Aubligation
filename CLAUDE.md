# CLAUDE.md — aubligation

This file documents the codebase for AI assistants. Read it before making changes.

## Project overview

**Aubligation** is a French-language investigation game themed around the history and personalities of the Aube department (northeastern France). Players solve 15 riddles spread across 5 historical acts, earning points based on accuracy and speed.

The name is a portmanteau of *Aube* (the department) + *obligation* (suggesting a civic/cultural duty to know the region).

## Tech stack

| Tool | Version | Role |
|------|---------|------|
| Next.js | 14.2.x | Framework (App Router) |
| React | 18.3 | UI |
| TypeScript | 6 | Language (strict mode) |
| Tailwind CSS | 4 | Styling (CSS `@import` syntax, no config file) |
| @supabase/supabase-js | 2.108 | Optional persistence backend |
| Playwright | 1.61 | E2E testing (installed, no tests yet) |

## Directory structure

```
/
├── app/                         # Next.js App Router pages
│   ├── layout.tsx               # Root layout with nav (Jouer / Classement / Profil)
│   ├── page.tsx                 # Homepage: countdown or "Start" CTA (client)
│   ├── globals.css              # CSS variables + utility classes (.btn-primary, .card)
│   ├── game/
│   │   ├── page.tsx             # Game hub: act grid, requires player profile (client)
│   │   └── [actId]/
│   │       └── page.tsx         # Act player: riddle-by-riddle flow (client)
│   ├── leaderboard/
│   │   └── page.tsx             # Top scores from localStorage (client)
│   └── profile/
│       └── page.tsx             # Create/edit player, reset progress (client)
├── components/
│   ├── ActCard.tsx              # Clickable/locked act card
│   ├── Countdown.tsx            # DD:HH:MM:SS countdown, fires onExpired() (client)
│   ├── Leaderboard.tsx          # Ranked table with medal icons
│   ├── PointsBadge.tsx          # Gold/red badge for points earned/lost
│   └── riddles/
│       ├── MCQRiddle.tsx        # Multiple-choice with wrong-answer flash (client)
│       ├── TextRiddle.tsx       # Free-text input, Enter submits (client)
│       ├── PhotoRiddle.tsx      # Placeholder image + text answer (client)
│       └── MapRiddle.tsx        # SVG map of Aube, click-to-identify (client)
├── lib/
│   ├── gameData.ts              # GAME_ACTS: all 5 acts with their riddles
│   ├── localStorage.ts          # Read/write helpers for player, session, leaderboard
│   ├── scoring.ts               # POINTS constants, calculatePoints(), validators
│   └── supabase.ts              # Optional Supabase client (null if env vars absent)
├── types/
│   └── game.ts                  # All game types (Act, Riddle, Player, GameSession, …)
├── supabase/
│   └── schema.sql               # DB schema: players, game_sessions, riddle_attempts
├── global.d.ts                  # CSS module declaration
├── next.config.mjs
└── tsconfig.json
```

## Game model

### Acts and riddles

- 5 acts in `lib/gameData.ts` (GAME_ACTS). Each act covers a city/period in the Aube and 2–3 historical personalities.
- Each act has exactly 3 riddles. Acts unlock sequentially — complete act N to unlock act N+1.
- Riddle types: `"mcq"` | `"text"` | `"photo"` | `"map"`.

| Type | Component | Answer mechanism |
|------|-----------|------------------|
| mcq | MCQRiddle | Click one of the option buttons |
| text | TextRiddle | Free-text input, Enter key or button |
| photo | PhotoRiddle | Coloured placeholder div + text input |
| map | MapRiddle | Click a city dot on an SVG Aube map |

### Scoring (`lib/scoring.ts`)

```
points = basePoints − (hintsUsed × 30) − (wrongAttempts × 20) + speedBonus
speedBonus = min(50, floor(50 × (30 − timeTakenSeconds) / 30))  if timeTaken < 30s
points = max(0, points)
```

Base points per type: MCQ 100 · Text 150 · Map 120 · Photo 100.

### Storage

All state is currently stored in `localStorage` via helpers in `lib/localStorage.ts`:

| Key | Contents |
|-----|----------|
| `aubligation_player` | `Player` (id, nickname, email) |
| `aubligation_session` | `GameSession` (score, act progress, attempts) |
| `aubligation_leaderboard` | `LeaderboardEntry[]` (top 50, sorted by score) |

Supabase is wired but dormant — `isSupabaseEnabled` is `false` unless both env vars are set. No production calls are made to Supabase yet.

## Environment variables

```bash
# Copy .env.local.example to .env.local
NEXT_PUBLIC_GAME_START_DATE=2026-07-31T22:00:00Z   # ISO date; omit or set to past date to open immediately
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

- Without Supabase vars the app works fully with localStorage.
- The countdown on the homepage is driven by `NEXT_PUBLIC_GAME_START_DATE`. Once expired (or if unset/past), the "Start" CTA appears.

## Key conventions

### Styling

Tailwind CSS 4 is used with the `@import "tailwindcss"` syntax in `globals.css` — there is no `tailwind.config.*` file. Do not create one.

CSS custom properties are the source of truth for brand colours:

```css
--color-burgundy: #7B1F3A
--color-gold:     #C9A84C
--color-cream:    #FAF5E4
--color-slate:    #1C1C2E
```

Use `style={{ color: "var(--color-gold)" }}` or the `--color-*` variables in CSS. Global utility classes `.btn-primary`, `.btn-secondary`, and `.card` are defined in `globals.css` and should be reused rather than recreated inline.

### Client vs server components

All interactive pages are `"use client"` (game, profile, leaderboard, homepage). This is intentional — the game requires `localStorage` access and real-time state. Do not add `"use server"` actions until Supabase integration is completed.

### Path alias

`@/*` resolves to the repo root. Always use `@/components/...`, `@/lib/...`, `@/types/...`.

### Types

All game types live in `types/game.ts`. Import from there — never redefine inline.

Critical types:
- `Riddle` — union-typed: fields like `options`, `correctAnswer`, `mapTargetCoords` are optional depending on `type`.
- `GameSession.actProgress` — array of `ActProgress`, one entry per act, indexed in the same order as `GAME_ACTS`.
- `LeaderboardEntry` — display-only; derived from session data at submit time.

### Adding content

**New riddle to an existing act**: edit `lib/gameData.ts`. Follow the existing object shape for the riddle type. Add `hint` and `basePoints`. For `map` riddles, `mapTargetCoords` are percentages (0–100) of the SVG viewport.

**New act**: append to `GAME_ACTS` in `lib/gameData.ts`. The game hub and act unlocking logic in `app/game/page.tsx` derive everything from the array index, so order matters.

**Real photos for PhotoRiddle**: replace the coloured placeholder `<div>` in `components/riddles/PhotoRiddle.tsx` with a `<next/image>` tag. Add the image host domain to `next.config.mjs`.

### Supabase migration path

When wiring Supabase:
1. Set env vars so `isSupabaseEnabled` becomes `true` in `lib/supabase.ts`.
2. Replace the `localStorage` calls in `app/game/[actId]/page.tsx` and `app/leaderboard/page.tsx` with Supabase queries.
3. The schema in `supabase/schema.sql` is ready with RLS enabled and a `leaderboard` view.
4. Do not delete `lib/localStorage.ts` until fallback is no longer needed.

## Development workflow

```bash
npm run dev      # Dev server (http://localhost:3000)
npm run build    # Production build + type-check
npm run start    # Start production build
```

No test suite is configured yet (Playwright is installed but has no spec files).

## What NOT to do

- Do not create a `tailwind.config.*` file — Tailwind 4 is configured purely via CSS `@import`.
- Do not hardcode colour hex values inline — use `var(--color-*)` CSS variables.
- Do not call `localStorage` outside of `lib/localStorage.ts` — route all reads/writes through the helpers there.
- Do not reorder `GAME_ACTS` — act unlocking depends on array index matching `actProgress` index.
- Do not remove the `isSupabaseEnabled` guard in `lib/supabase.ts` — the app must work without Supabase credentials.
