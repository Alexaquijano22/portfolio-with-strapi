# Personal Creative Portfolio

A personal portfolio built as a decoupled (headless) application: a **Strapi 5** API manages all content, and a **React 19 (Vite)** single-page app consumes it. No content is hardcoded in the frontend — everything (profile, skills, projects) is editable from the Strapi admin panel without touching code.

## Tech stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Backend | Strapi 5 (SQLite) | Headless CMS, created with `--quickstart` (file-based DB) |
| Frontend | React 19 + Vite | SPA consuming the Strapi REST API |
| Styling | Tailwind CSS v4 | Official Vite plugin, `@theme` design tokens |
| Testing | Vitest + React Testing Library | Unit tests for the HTTP layer and components |
| Package manager | pnpm | Used for both backend and frontend |

## Project structure

```
portfolio-with-strapi/
├── backend/          # Strapi 5 API
│   └── .tmp/data.db  # SQLite database (versioned, see "Seeded data" below)
├── frontend/         # React + Vite SPA
│   └── src/
│       ├── shared/       # Cross-cutting infrastructure (api, ui components)
│       └── features/     # User-facing features (profile, skills, projects)
├── spec/             # Spec-Driven Development docs (constitution, overview, features)
└── README.md
```

## Prerequisites

- **Node.js** — an Active/Maintenance LTS version (20, 22, or 24).
- **pnpm** — used for both the backend and the frontend (`npm install -g pnpm` if you don't have it).

## Installation

The repo is a monorepo. Run the backend and the frontend in **two separate terminals**.

### 1. Backend (Strapi)

```bash
cd backend
pnpm install
pnpm approve-builds   # approve native builds (better-sqlite3, esbuild, sharp)
```

Strapi needs secret keys, which are kept out of version control. Create the `.env` file:

```bash
# Generate a .env with random keys (run from backend/, in a bash-like shell):
node -e "const c=require('crypto');const k=()=>c.randomBytes(16).toString('base64');console.log('HOST=0.0.0.0\nPORT=1337\nAPP_KEYS='+k()+','+k()+','+k()+','+k()+'\nAPI_TOKEN_SALT='+k()+'\nADMIN_JWT_SECRET='+k()+'\nTRANSFER_TOKEN_SALT='+k()+'\nJWT_SECRET='+k()+'\nENCRYPTION_KEY='+k())" | tee .env
```

> If `| tee .env` doesn't write the file in your shell, run the command without it and paste the printed output into a new `backend/.env` file. A `backend/.env.example` is included as a reference.

Then start Strapi:

```bash
pnpm run develop
```

The admin panel runs at `http://localhost:1337/admin`. Because the keys are freshly generated, the first time you may be asked to **create a new admin user** — the content is already seeded and intact regardless.

### 2. Frontend (React)

```bash
cd frontend
pnpm install
```

Create `frontend/.env` (a `.env.example` is included):

```
VITE_API_URL=http://localhost:1337
```

Then start the dev server:

```bash
pnpm dev
```

The app runs at `http://localhost:5173`.

### Seeded data

The SQLite database (`backend/.tmp/data.db`) is **intentionally versioned** so the portfolio shows real content immediately after cloning, with no manual data entry. In a production environment this would be handled with seeds/migrations instead of committing the database.

## Testing

```bash
cd frontend
pnpm test
```

The suite covers the typed HTTP client (success, 4xx, 5xx, and network error cases) and key UI components.

## Technical decisions

**Headless architecture.** Content lives in Strapi and the React SPA consumes it over REST. This decouples content from presentation: content can be edited from the admin panel without redeploying the frontend.

**Strapi 5 flat responses.** Strapi 5 returns flattened data (no `data.attributes` nesting from v4) and requires `?populate=*` to include media and components. Media URLs are relative, so the frontend prefixes them with `VITE_API_URL`.

**Separation of concerns.** A single HTTP client (`src/shared/api/httpClient.js`) is the only place that calls `fetch`. Services wrap the endpoints, custom hooks own data/loading/error state, and components only render. `src/shared/` holds cross-cutting infrastructure (HTTP client, reusable UI primitives); `src/features/` holds user-facing features (profile, skills, projects).

**Profile via React Context.** Three sections (Hero, About, Footer) consume the same profile data, so a `ProfileProvider` wraps the whole app and fetches it once, sharing it via Context — avoiding duplicate requests and prop drilling, without an external state library.

**Typed error handling.** The HTTP client throws a typed `ApiError` classifying client (4xx), server (5xx), and network failures, so the UI can show the right message and a retry action.

**Tailwind v4 design tokens.** Theme tokens are defined once in `@theme` (dark, minimalist palette with a single accent), and consumed through the generated utilities.

**Configuration by environment.** The API base URL is read from `VITE_API_URL`; no URLs are hardcoded.

## AI Usage

This project was built using **Spec-Driven Development (SDD)** with AI assistance (Claude / Claude Code), documented in the `spec/` folder.

Instead of ad-hoc prompting, the work followed an explicit pipeline:

1. **Constitution** — engineering principles (stack, architecture, design language, testing policy).
2. **Specify** — sections, the Strapi data contract, behavior, and acceptance criteria.
3. **Plan** — folder structure, services/hooks/components split, design tokens, error-handling strategy.
4. **Tasks** — an ordered, independently-verifiable breakdown per feature.
5. **Implement** — one prompt per task, reviewed before moving on.

AI accelerated boilerplate (services, hooks, components, test setup) while all architectural and design decisions were made and reviewed by me. Several commits are co-authored to reflect this collaboration honestly.
