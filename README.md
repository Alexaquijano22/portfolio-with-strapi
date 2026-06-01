# Personal Creative Portfolio + Products Demo

A decoupled (headless) application built for a front-end technical assessment:

- **Exercise 1 — Portfolio:** a personal portfolio whose content (profile, skills, projects) is managed in **Strapi 5** and consumed by a **React (Vite)** SPA. Nothing is hardcoded — everything is editable from the Strapi admin panel.
- **Exercise 2 — Products demo:** a `/products` page that integrates an external API (Fake Store API), lists the products as a store-style grid, and pulls its editorial copy from Strapi — reusing the same architecture and error handling as Exercise 1.

Both exercises live in this single repository (backend + frontend).

## Tech stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Backend | Strapi 5 (SQLite) | Headless CMS, created with `--quickstart` (file-based DB) |
| Frontend | React 19 + Vite | SPA consuming the Strapi REST API |
| Routing | React Router | Routes `/` (portfolio) and `/products` (Exercise 2) |
| Styling | Tailwind CSS v4 | Official Vite plugin, `@theme` design tokens |
| Testing | Vitest + React Testing Library | Unit tests for the HTTP layer, services, and components |
| Package manager | pnpm | Used for both backend and frontend |

## Project structure

```
portfolio-with-strapi/
├── backend/          # Strapi 5 API
│   └── .tmp/data.db  # SQLite database (versioned, see "Seeded data" below)
├── frontend/         # React + Vite SPA
│   └── src/
│       ├── shared/       # Cross-cutting infrastructure (api, ui components)
│       └── features/     # User-facing features (profile, skills, projects, products)
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

The app runs at `http://localhost:5173`. The portfolio is at `/`; the products demo is at `/products` (also reachable from the "Products" link in the header).

### Seeded data

The SQLite database (`backend/.tmp/data.db`) is **intentionally versioned** so the app shows real content immediately after cloning, with no manual data entry. In a production environment this would be handled with seeds/migrations instead of committing the database.

## Testing

```bash
cd frontend
pnpm test
```

The suite covers the typed HTTP client (success, 4xx, 5xx, network, and absolute-URL pass-through), the services, and key UI components.

## Exercise 2 — Products demo

The `/products` page demonstrates external API integration with resilient error handling:

- **External API:** product data is fetched from the Fake Store API (`https://fakestoreapi.com/products`).
- **Reused error handling:** the same `httpClient` and typed `ApiError` from Exercise 1 are reused, so 4xx / 5xx / network errors are handled consistently. The client was extended to pass absolute URLs straight through (for the external API) while still prefixing `VITE_API_URL` for relative Strapi paths.
- **Strapi for page copy:** the page heading and intro come from a Strapi `products-page` Single Type — the page text is editable from the CMS, not hardcoded.
- **Presentation:** products render as a responsive store-style grid (image, title, price, rating, category), reusing the shared `Card` and `Badge` components.
- **States:** loading shows a spinner, errors show a retry action, and an empty result shows a graceful message.

## Technical decisions

**Headless architecture.** Content lives in Strapi and the React SPA consumes it over REST, decoupling content from presentation: content is editable from the admin panel without redeploying the frontend.

**Strapi 5 flat responses.** Strapi 5 returns flattened data (no `data.attributes` nesting from v4). Endpoints with media or components require `?populate=*` to include them (profile, skills, projects); simple text-only endpoints like the products page don't. Media URLs are relative, so the frontend prefixes them with `VITE_API_URL`.

**Separation of concerns.** A single `httpClient` (`src/shared/api/httpClient.js`) is the only place that calls `fetch`. Services wrap the endpoints, custom hooks own data/loading/error state, and components only render. `src/shared/` holds cross-cutting infrastructure; `src/features/` holds user-facing features (profile, skills, projects, products).

**One HTTP client for internal and external APIs.** Rather than duplicating fetch/error logic, the existing client was extended with a minimal rule: absolute URLs (starting with `http`) are used as-is; relative paths are prefixed with `VITE_API_URL`. This lets Exercise 2 reuse the same `ApiError` handling for the external API.

**Profile via React Context.** Three sections (Hero, About, Footer) consume the same profile data, so a `ProfileProvider` fetches it once and shares it via Context — avoiding duplicate requests and prop drilling, without an external state library.

**Typed error handling.** The HTTP client throws a typed `ApiError` classifying client (4xx), server (5xx), and network failures, so the UI can show the right message and a retry action.

**Routing.** React Router separates the portfolio (`/`) from the products demo (`/products`); the portfolio's `ProfileProvider` stays scoped to its route.

**Tailwind v4 design tokens.** Theme tokens are defined once in `@theme` (dark, minimalist palette with a single accent), and consumed through the generated utilities.

**Configuration by environment.** The API base URL is read from `VITE_API_URL`; no URLs are hardcoded.

## AI Usage

I used **Claude Code** as a development assistant, following a **Spec-Driven Development (SDD)** approach. I chose SDD because it forces the work to be organized up front — design, requirements, and tasks — and once it's clear what needs to be built, guiding the step-by-step implementation becomes much simpler and the results are more predictable. Each feature (profile, skills, projects, products) was specified first in the `spec/` folder and implemented against that spec.

Concretely, the AI helped me move faster on the repetitive parts: scaffolding the project, generating the folder structure from the spec, writing boilerplate for services, hooks, and components, and setting up the tests. Working from explicit, requirement-driven prompts — instead of vague requests — kept the output consistent and aligned with the architecture I had defined.

The important decisions, though, were mine. I designed the architecture around a few principles and applied them deliberately:

- **Single responsibility** — components only render, services own all API calls, and hooks own data and state, so each piece has one clear job.
- **Separation of shared vs feature code** — cross-cutting infrastructure lives in `shared/`, while each feature stays self-contained in `features/`, which keeps the codebase easy to navigate and scale.
- **Configuration by environment** — the API URL comes from an environment variable, so the same code runs in any environment without changes.
- **Maintainability and reuse** — a single HTTP client with typed error handling is reused across the whole app, including the external API in Exercise 2, so changes happen in one place.

In short, the AI accelerated the build, but the architecture, the trade-offs, and the reasoning behind them were decisions made by me throughout the development process.
