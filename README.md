# PCPS College Library Management System

A modern frontend for the PCPS College Library backend — an admin dashboard for
librarians/staff and a student portal for members, built on the existing
library API (the same backend used by the previous ShelfWise-Client frontend).

## Tech stack

- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui (Radix UI primitives)
- TanStack React Query for server state
- React Router for routing
- Axios for API calls

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example env file and adjust it if your backend runs somewhere other
than the default:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Base URL of the backend API (no trailing slash) | `https://libraryapi.patancollege.edu.np/api` |
| `VITE_RES_URL` | Base URL for images/files served by the backend (cover photos, profile pictures) — keep the trailing slash | `https://libraryapi.patancollege.edu.np/res/` |

`.env` is gitignored, so local overrides never get committed. If no `.env`
file is present, the app falls back to the defaults above (see
`src/api/constants.ts`).

### 3. Run the dev server

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
npm run start   # serve the production build
```

Other useful scripts:

```bash
npm run typecheck   # TypeScript check, no emit
npm run test        # run tests (vitest)
npm run format.fix   # format the codebase with Prettier
```

## Project structure

```
src/
  api/            # axios client, env-driven constants, entity types, API service definitions
  hooks/api/      # React Query hooks, one file per domain (books, users, circulation, ...)
  components/     # shared layout/UI (admin Layout+Sidebar, student PortalLayout, dialogs)
  components/ui/  # shadcn/ui primitives
  pages/          # one file per route — admin pages and Portal* (student) pages
```

## Roles & routing

Login authenticates with a **card ID** and password (not email). After login,
the app fetches the authoritative user profile (`GET /me`) and routes based on
role:

- Roles that outrank `Member` (i.e. anything other than `Member` or `Faculty`
  — typically `Manager`, `AssistantManager`, `Coordinator`) land on the **admin
  dashboard** (`/`).
- `Member` and `Faculty` land on the **student portal** (`/portal`).

Admin routes are guarded by `ProtectedRoute staffOnly` and redirect non-staff
to `/portal`; all other authenticated routes just require a logged-in session.

## Notes on API coverage

This frontend implements every endpoint that exists in the backend's previous
reference client, including features the old UI never exposed (online books,
book requests, lost-book reporting, purchase entries, enrollment approval,
attribute management). A few admin pages that had no corresponding backend
endpoint in the old client (system-wide analytics, audit logs, generic
settings) were intentionally left out rather than built against invented
endpoints — see `src/api/services.ts` for the full list of wired routes.
