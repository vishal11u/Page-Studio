# Page Studio MVP

Production-oriented MVP for a **CMS-backed, schema-driven landing page** system with a **Redux-powered studio**, **RBAC**, **immutable semver releases**, and **quality gates** (Vitest, Playwright, axe).

## Architecture overview

The application follows a **schema-driven** architecture where the UI is a pure function of a JSON page definition.

| Layer | Responsibility |
|--------|----------------|
| **Contentful adapter** (`src/lib/contentful/*`) | Isolate CMS access; map entries → `Page` model; handle **preview vs published** tokens/hosts; mock fallback |
| **Validation** (`src/lib/validation/*`) | Zod schemas per section type; safe parse helpers; invalid data → `InvalidSection` (graceful failure) |
| **Registry** (`src/registry/sectionRegistry.ts`) | Central mapping of section types to React components, default props, and Zod schemas |
| **Rendering** (`src/components/sections/*`) | Dynamic recursive renderer; **UnsupportedSection** for unknown types; **error boundaries** per section |
| **Studio** (`src/components/studio/*`, `src/redux/*`) | WYSIWYG-lite editor; Redux-managed draft; **dnd-kit** reorder; property editors; publish orchestration |
| **Auth / RBAC** (`src/lib/auth/*`, `src/proxy.ts`) | Mock session via httpOnly cookies; **server + proxy** enforcement for studio and publish APIs |
| **Publish** (`src/lib/publish/*`, `src/lib/semver/*`, `app/api/publish`) | Structural diffing → **semver bump** detection + changelog; immutable release snapshots in `releases/` |

### Folder structure (`src/`)

```text
src/
├── app/                    # App Router routes, API routes, layout
├── components/
│   ├── common/             # Header, role switcher, error boundary
│   ├── sections/           # Schema-driven blocks + renderer
│   ├── studio/             # Sidebar, DnD list, publish modal
│   └── ui/                 # shadcn-style primitives (Button, Dialog, …)
├── registry/               # sectionRegistry
├── redux/
│   ├── slices/             # draftPage, ui, publish
│   └── store.ts            # Redux + redux-persist
├── lib/
│   ├── contentful/         # client + adapters + mock pages
│   ├── semver/             # comparePages, detectVersionBump
│   ├── publish/            # changelog, snapshot, releaseStore
│   ├── validation/         # Zod section schemas + helpers
│   └── auth/               # roles, session cookies
├── types/
├── hooks/
├── styles/                 # Reserved for shared CSS tokens (see .gitkeep)
└── tests/                  # Vitest unit tests
```

## Redux slices

| Slice | Responsibility | Key Actions / State |
|--------|----------------|---------------------|
| **draftPage** | Canonical draft state management | `loadPage`, `addSection`, `removeSection`, `reorderSections`, `updateSectionProps`, `isDirty` flag |
| **ui** | Global UI state & status | `toggleSidebar`, `openPublishModal`, `setPublishing` status, `statusMessage` (toast-lite) |
| **publish** | Post-publish metadata & feedback | `publishSuccess` (version/changelog), `publishFailed` (error state) |

Persisted slice: **`draftPage`** only (whitelist in `src/redux/store.ts`).

## Contentful model + adapter

### Content Model
The application expects a Contentful content type named **`page`** with the following fields:
- **`slug`**: (Symbol) Unique identifier for routing.
- **`title`**: (Symbol) Internal display title.
- **`sections`**: (JSON or Reference List) Array of section objects. Each section requires a `type` (matching the registry) and a `props` object.

### Adapter Layer
- **`contentfulClient.ts`**: Factory that builds the SDK client based on environment variables (`CONTENTFUL_SPACE_ID`, etc.). It automatically switches between `cdn.contentful.com` (Delivery) and `preview.contentful.com` (Preview) based on the requested mode.
- **`adapters.ts`**: Contains `mapContentfulPageToPageModel` which transforms raw Contentful entries into the application's internal `Page` TypeScript model. This decoupling ensures that CMS-specific structure changes don't leak into the React components.
- **Mock Fallback**: If credentials are missing or the API is unreachable, the adapter gracefully falls back to mock JSON data in `mockData.ts`, allowing for zero-config local development.

## Publish + SemVer

- **`comparePages`**: Structural diff (add/remove sections, type changes, flat prop changes, optional additions, required-key removals heuristics via Zod shape).
- **`detectVersionBump`**: **MAJOR** — removed section, type change, or removed required-ish field; **MINOR** — new section or new optional prop path; **PATCH** — text/prop value edits.
- **`generateSnapshot` / `generateChangelog`**: Immutable `ReleaseSnapshot` JSON; human-readable changelog lines.
- **Idempotency**: If the normalized page matches the latest release fingerprint, **no new file** is written; API returns `created: false`.

> **Vercel / serverless**: The default store uses the local filesystem (`releases/`). On Vercel, the filesystem is not a durable writable store—swap `releaseStore` for S3, KV, or a database for production.

## Accessibility

- Semantic regions/headings; visible **focus rings** on interactive elements; skip link to `#main-content` in root layout.
- **Dialog** uses a dedicated close control and `role="dialog"` / `aria-modal`.
- **`prefers-reduced-motion`** in `globals.css` minimizes motion.
- **Playwright + `@axe-core/playwright`**: E2E writes `a11y-report.json`; CI fails on violations.

*(WCAG 2.2 AAA is used as a **design target**; full AAA certification would need formal audit.)*

## CI/CD (`.github/workflows/ci.yml`)

Install → **ESLint** → **`tsc --noEmit`** → **Vitest** → **Playwright** (includes axe) → **build**. Fails on type errors, lint, test failures, or accessibility violations.

## Environment variables

Copy `.env.example` to `.env.local`:

- `CONTENTFUL_SPACE_ID`
- `CONTENTFUL_ACCESS_TOKEN` (delivery)
- `CONTENTFUL_PREVIEW_TOKEN` (optional; preview API)

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build + serve |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Vitest |
| `npm run test:e2e` | Playwright (starts app via `playwright.config`) |
| `npm run encoding` | Convert UTF-16 LE **with BOM only** (`FF FE`) to UTF-8 (safe no-op on normal UTF-8) |
| `npm run repair-encoding` | Heuristic repair when UTF-8 files were accidentally decoded as UTF-16 (fixes `\0` padding / Turbopack `Unexpected character '\\0'`) |

## Troubleshooting: mangled encoding after tooling on Windows

If `next build` shows **`Unexpected character '\0'`** or ESLint **`Parsing error: Invalid character`**, run once:

```bash
npm run repair-encoding
npm run typecheck
```

Then commit only UTF-8 files. Prefer editor **UTF-8** (no BOM) for `.ts`/`.tsx`.

## Tradeoffs

- **Mock Contentful** keeps onboarding zero-config; production teams supply real space + content model (`page` with `slug`, `title`, `sections[]` { `id`, `type`, `props` }).
- **Local JSON releases** are simple and auditable in dev; not serverless-durable without a blob/DB backend.
- **Mock RBAC** via cookies is explicit and testable; real auth would replace `getSession` + cookie setters.

## Assumptions

- Contentful **content type** `page` with fields above (or rely on mocks).
- Editors use modern evergreen browsers; E2E targets Chromium.

## Incomplete / next steps

- Full multi-feature editing for `featureGrid` (all rows from studio UI without touching remaining defaults).
- Real identity provider (Auth0, Cognito, etc.) instead of cookie mock roles.
- Durable release storage and optional Git integration for snapshots.
- Contentful GraphQL / linked entries if sections are separate entries.

---

## Troubleshooting: UTF-16 / binary-looking `.ts` files

1. **`npm run encoding`** — safe on CI/Linux; converts **only** UTF-16 LE files that start with BOM `FF FE`.
2. **`npm run repair-encoding`** — Windows recovery after accidental mangling (when UTF-8 sources picked up NUL/`\\0` spacing). Run once, then verify with `npm run typecheck`.
3. Avoid broad PowerShell “odd-byte zero” loops on UTF-8 trees; they can corrupt valid UTF-8.

