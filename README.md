# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Deploying

This app is configured for [Vercel](https://vercel.com) via `@sveltejs/adapter-vercel`. Import the repo in Vercel — no environment variables are required.

The backend is hosted separately at `http://moviereservationsystem.runasp.net` (HTTP only, no TLS). Since Vercel serves the frontend over HTTPS, the browser cannot call the backend directly (mixed-content blocking). Instead, `vercel.json` rewrites all `/api/*` requests to the backend at the edge, so the browser only ever talks to the same origin, and the existing relative `/api/...` calls in `src/Api.ts` work unchanged in both dev (via the Vite proxy in `vite.config.ts`) and production (via the Vercel rewrite). This also keeps auth cookies same-site without further CORS/credentials configuration.
