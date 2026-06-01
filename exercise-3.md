# Exercise 3: Architecture Reasoning (AI-assisted)

**Goal:** Design a scalable front-end architecture using microfrontends and DevOps practices.

---

## 1. Chosen Microfrontend Strategy

**Decision: Webpack Module Federation with client-side composition and a shell host.**

### Architecture

- A **host (shell)** that manages the global layout, authentication, top-level routing, and the loading of the remotes.
- Several **remotes**, one per business domain (e.g., `mfe-products`, `mfe-cart`, `mfe-profile`), each independently deployable.
- **Runtime composition**: the host loads remotes through `remoteEntry.js`, allowing a single MFE to be deployed without redeploying the host.

### Key Decisions

- **Routing**: the host defines root routes (e.g., `/cart/*`) and delegates sub-routing to the corresponding remote (nested React Router).
- **Shared dependencies**: `react` and `react-dom` are declared as `singleton` to avoid two React instances in memory.
- **Inter-MFE communication**: decoupled events (Custom Events or a lightweight event bus) plus session state exposed by the host through context. A global shared store is intentionally avoided to keep remotes loosely coupled.

### Justification vs. Alternatives

- **iframes** provide strong isolation but break UX and SEO.
- **Web Components** add framework interoperability complexity.
- **Build-time integration** loses independent deployment, which is the primary objective here.

Module Federation offers the best balance of independent deployment, dependency sharing, and native React integration.

---

## 2. CI/CD Pipeline Design

Each microfrontend has its **own independent pipeline** (GitHub Actions):

```
Trigger: push / PR to main
  │
  ├─ Lint (ESLint + Prettier)
  ├─ Unit tests (Jest + React Testing Library)
  ├─ Build (webpack production, generates remoteEntry.js)
  ├─ Quality analysis (SonarQube / coverage gate)
  ├─ E2E tests (Playwright) in a preview environment
  └─ Deploy:
        ├─ Upload artifacts to a static storage bucket (one per MFE)
        ├─ Invalidate the CDN cache
        └─ Update the version manifest
```

### Key Points

- **Independent deployment**: the host consumes a *manifest* (e.g., `{ "mfe-cart": "https://cdn/.../cart/v2.3/remoteEntry.js" }`) instead of hardcoded URLs, allowing versions to be promoted without rebuilding the host.
- **Release strategy**: canary or blue/green by publishing the new `remoteEntry` to a versioned path and switching the manifest; rollback is simply reverting the manifest.
- **Feature flags** enable functionality without redeployment.
- **Shared dependency versioning** is controlled to prevent incompatibilities between remotes.

---

## 3. Scalability, Maintainability, and Performance Considerations

### Scalability

- Organizational scaling: autonomous teams per domain, owning their MFE end to end.
- CDN distribution with layered caching; static assets scale without dedicated servers.
- Independent deployment: release throughput is not blocked between teams.

### Maintainability

- Clear domain boundaries and explicit contracts between host and remotes (shared types via a versioned package).
- **Shared design system** (versioned component library) for visual consistency.
- Low coupling: event-based communication, no global shared store.
- Semantic versioning of shared dependencies.

### Performance

- **Lazy loading** of remotes: only the `remoteEntry` for the visited route is loaded.
- **Shared singletons** (`react`, `react-dom`) to avoid duplicate bundles.
- Code splitting within each MFE.
- **Performance budgets** in CI (the build fails if the bundle exceeds the limit).
- Prefetch of likely remotes after initial load.

---

## Context and Approach

The architecture was designed for a platform with multiple autonomous development
teams, each owning a separate business domain. The design goal was independent
deployability without rebuilding the entire application. I used Claude to explore
trade-offs between strategies and validate technical decisions — the prompts below
show the progression from an initial comparison to specific implementation details.

---

## 4. AI Prompts Used (Transcription)

```
Prompt 1 (initial):
"Design a scalable micro-frontend architecture in React. Compare
Module Federation, Web Components and iframes, and recommend one
for a platform requiring independent team deployments."

Prompt 2 (refinement):
"Using Webpack Module Federation, detail how the host should consume
remotes at runtime via a version manifest, and how to handle shared
React singletons to avoid duplicate instances."

Prompt 3 (CI/CD):
"Design a per-MFE CI/CD pipeline on GitHub Actions deploying to a
static storage bucket + CDN, supporting independent deploys and
canary releases via a manifest. Include lint, test, build and
quality gate stages."

Prompt 4 (trade-offs refinement):
"List scalability, maintainability and performance trade-offs of this
architecture, focusing on lazy loading, shared dependencies and
performance budgets."
```

The iteration shows a progression: a broad initial prompt, followed by specific refinements, and validation/adjustment of the AI's responses.

---

## Reflection

Working through this exercise, the decision to choose Module Federation over the
alternatives came down to one priority: independent deployability per team without
giving up the React ecosystem. Iframes and Web Components introduce too much friction
with UX and shared state; build-time integration defeats the main objective. The AI
helped structure the pipeline and identify the singleton pattern for shared
dependencies, but decisions like using a runtime manifest for version promotion —
instead of hardcoded remote URLs — came from reasoning about the rollback and release
scenarios that matter in production. One limitation worth acknowledging: this
architecture assumes team maturity and solid DevOps practices; without those, the
complexity it introduces can outweigh the benefits.
