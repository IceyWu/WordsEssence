<p align="center">
  <br>
  <img width="96" src="./public/file.svg" alt="WordsEssence" />
  <br>
  <br>
</p>

<h1 align="center">WordsEssence · 言摘</h1>

<p align="center">
  <em>Between the lines — a commonplace book</em>
  <br>
  Capture and share the lines worth reading again and again.
</p>

<p align="center">
  <a href="https://wd.levwu.me">🌐 Primary</a>
  &nbsp;·&nbsp;
  <a href="https://wordsessence.netlify.app">🪂 Mirror</a>
</p>

<p align="center">
  <a href="./README.md">简体中文</a> &nbsp;|&nbsp; <b>English</b>
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss&logoColor=white">
  <img alt="pnpm" src="https://img.shields.io/badge/pnpm-11-F69220?logo=pnpm&logoColor=white">
</p>

---

## ✨ Overview

While reading or simply living, we keep running into lines that move us or make us think — a piece of quiet wisdom, a stirring turn of phrase, a poetic little image. Yet they tend to linger only briefly in the mind and fade with time.

**WordsEssence** gives those fragments a place to rest: every entry is rendered as a sheet of paper on a desk (notepaper / card / sticky note), written in a real handwriting face, complete with washi tape, paper clips, paper texture, and a slight tilt — so the words you love live on in another form.

> A personal commonplace book in a soft, hand-drawn skeuomorphic style. Every entry can be created, edited, or deleted directly — no accounts, no friction.

## 🎯 Features

- 🖋️ **Hand-drawn skeuomorphism** — paper texture, washi tape, paper clips, layered shadows and a gentle tilt, all generated in pure CSS (no bitmaps).
- 🎨 **Soft ink-wash palette** — ink, paper, seal-red and celadon-green managed through `@theme` design tokens.
- ✒️ **Real handwriting** — the self-hosted "Xinye" face renders every visible character; the ink color rotates per entry to mimic different pens.
- 📷 **Image to text** — upload an image or paste one with `Ctrl/⌘+V`; the OCR result is appended to the body automatically.
- ⚡ **Server-side fetching + caching** — built on RSC and Cache Components (`use cache`); the home page is prerendered as a static shell and revalidated by tag.
- 🔒 **Single server-side egress** — the browser never calls third-party APIs directly; all reads and writes flow through Server Actions / RSC, avoiding CORS and hiding upstreams.

## 🛠️ Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (`@theme` design tokens) |
| Data fetching | RSC server-side fetching + Cache Components (`use cache`) |
| Data writes | Server Actions (`app/actions/`) |
| Fonts | `next/font`: Inter (UI) + local "Xinye" (handwriting) |
| Icons | lucide-react |
| Package manager | pnpm |

## 🚀 Getting Started

```bash
# Install dependencies
pnpm install

# Start the dev server → http://localhost:6001
pnpm dev

# Production build (type-check + prerender)
pnpm build

# Run the production build
pnpm start
```

### Environment Variables

Both are read **only on the server** (`lib/env.ts`) and never reach the client bundle.

| Variable | Default | Description |
|----------|---------|-------------|
| `API_BASE_URL` | `http://127.0.0.1:6002` | Essays API upstream (text data) |
| `AI_BASE_URL` | `https://api.lpalette.cn` | OCR API upstream (image to text) |

## 🧭 Architecture

```
Browser
  │  Read:  RSC server-side fetching (lib/api.ts, use cache)
  │  Write: Server Action (app/actions/*)
  ▼
Next.js server (the only outbound gateway, server-only)
  ├─ lib/api.ts  → Essays API (text data)
  └─ lib/ocr.ts  → OCR API (image to text)
```

After every write (create / edit / delete), `updateTag("essays")` is called to refresh the page data instantly, giving read-your-own-writes semantics.

## 📁 Project Structure

```
app/
├─ actions/            # Server Actions (data writes / OCR)
├─ _components/        # Page components (desk, paper, editor, header…)
├─ fonts/xinye.otf     # Self-hosted handwriting face "Xinye"
├─ globals.css         # Design tokens (@theme) and skeuomorphic styles
├─ layout.tsx          # Root layout and font injection
└─ page.tsx            # Home page (server-side fetch + Suspense streaming)
lib/
├─ api.ts              # Essays server-side data layer (CRUD)
├─ ocr.ts              # OCR task wrapper (submit + poll)
├─ format.ts           # Content line-splitting, date formatting, etc.
├─ paper-style.ts      # Derives each entry's paper style from its id
├─ env.ts              # Centralized upstream Base URLs
└─ types.ts            # Essay and API response types
docs/项目说明.md        # Full design & API documentation (Chinese)
```

> For deeper notes on the visual style, data model, and API, see [`docs/项目说明.md`](./docs/项目说明.md).

## 🗺️ Roadmap

- [x] Project bootstrap
- [x] Page scaffolding
- [x] Frontend design & development
- [x] Image recognition (OCR) integration
- [x] Deployment
- [ ] More paper / decoration styles
- [ ] Theme & palette switching

## 📄 License

For learning and personal note-keeping purposes only.
