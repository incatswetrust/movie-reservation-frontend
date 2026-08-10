# Movie Reservation System — Frontend

A movie ticket booking frontend built with SvelteKit 5 and TypeScript, with a full light/dark design system, search & filtering, a visual seat-map booking flow, and a role-aware admin panel.

Live demo: **https://movie-reservation-system-puce.vercel.app**
Backend: [MovieReservationSystem.Backend](https://github.com/incatswetrust/MovieReservationSystem.Backend)

## Try the admin panel

Log in with the read-only Viewer account below to browse the admin side (Users, Cinemas, Halls, Movies, Showtimes) without being able to create, edit, or delete anything:

```
Username: AdminUser
Password: FreeAccess
```

## Features

- Browse movies with debounced search, genre filtering, poster grid
- Movie detail pages with trailer embed, cast/director, and showtimes
- Cinema and hall browsing with image galleries
- Visual seat-map booking with a live order summary
- Email/password and Google OAuth sign-in, with automatic access-token refresh on expiry
- Profile page: edit account details, view and cancel bookings
- Admin panel: manage movies, cinemas, halls, showtimes, and users
- Role-aware UI — `Admin` gets full CRUD, `Viewer` gets read-only access to the same admin views, regular `User` gets none of it
- Full dark/light theming across every page

## Tech Stack

- SvelteKit 5 + TypeScript
- Tailwind CSS
- TanStack Query (Svelte)
- Axios (generated API client)
- Deployed on Vercel; `vercel.json` proxies `/api/*` to the backend

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the dev server

The dev server proxies `/api/*` to `http://localhost:5256` (see `vite.config.ts`) — run the [backend](https://github.com/incatswetrust/MovieReservationSystem.Backend) locally first.

```bash
npm run dev
# or, to open a browser tab automatically
npm run dev -- --open
```

### 3. Build for production

```bash
npm run build
npm run preview # preview the production build locally
```

### 4. Type-check

```bash
npm run check
```

## Deploying

This app is configured for [Vercel](https://vercel.com) via `@sveltejs/adapter-vercel`. Import the repo in Vercel — no environment variables are required.

The backend is hosted separately at `https://moviereservationsystem.runasp.net`. `vercel.json` rewrites all `/api/*` requests to the backend at the edge, so the browser only ever talks to the same origin, and the relative `/api/...` calls in `src/Api.ts` work unchanged in both dev (via the Vite proxy in `vite.config.ts`) and production (via the Vercel rewrite). This also keeps auth cookies same-site without further CORS/credentials configuration.

Google sign-in is the one exception: it links directly to the backend's own domain (bypassing the proxy) so the OAuth correlation cookie is set on the same origin Google redirects back to. The resulting session is then handed off to the frontend's own origin via a short-lived one-time exchange code — see `/auth/google-complete`.

## License

Apache License 2.0 — see [LICENSE](./LICENSE).

## Security

See [SECURITY.md](./SECURITY.md) for how to report a vulnerability.
