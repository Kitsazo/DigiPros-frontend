# DigiPros Marketing — Website

Single-page marketing site built with React + Vite + TypeScript.
Outputs static files, ready to host anywhere DNS points to.

## Project structure

```
Frontend/
├── index.html
├── package.json
├── tsconfig.json · tsconfig.app.json · tsconfig.node.json
├── vite.config.ts
├── public/
│   └── favicon.svg
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── vite-env.d.ts
    ├── styles/
    │   └── global.css        # design tokens + base styles
    ├── auth/
    │   ├── types.ts          # User, payloads, OAuthProvider
    │   ├── api.ts            # fetch wrapper + tokenStore
    │   └── AuthContext.tsx   # AuthProvider + useAuth()
    └── components/
        ├── Navbar.(tsx|css)
        ├── Hero.(tsx|css)
        ├── About.(tsx|css)
        ├── Packages.(tsx|css)
        ├── Contact.(tsx|css)
        ├── Footer.(tsx|css)
        ├── AuthModal.(tsx|css)
        └── AuthCallback.tsx
```

Each component owns its own CSS file. Color tokens (white / blue / yellow)
live in `src/styles/global.css` under `:root` — change them in one place to
re-skin the whole site.

Auth lives under `src/auth/`:
- `types.ts` — shared TypeScript types.
- `api.ts` — typed `fetch` wrapper, `ApiError`, and `tokenStore`
  (localStorage).
- `AuthContext.tsx` — `useAuth()` exposes `user`, `login`, `signup`,
  `logout`, `oauthLogin('google'|'apple')`, and which providers the
  backend has configured.

`AuthModal.tsx` renders the email form + OAuth buttons. After an OAuth
redirect the backend lands at `/auth/callback?token=…` which is handled
by `AuthCallback.tsx`.

## Local development

```bash
cd Frontend
npm install
copy .env.example .env       # adjust VITE_API_URL if your backend isn't on :8000
npm run dev                  # http://localhost:5173
```

## Build for production

```bash
npm run typecheck    # tsc -b --noEmit, optional pre-flight
npm run build        # type-checks, then outputs static files to Frontend/dist
npm run preview      # local smoke-test of the production build
```

## Deploy to Porkbun + DNS

`npm run build` produces a fully static site in `Frontend/dist/`. Pick one:

**Option A — Porkbun Static Hosting (simplest):**
1. In Porkbun, open your domain → **Static Hosting** → enable it.
2. Upload the **contents** of `Frontend/dist/` (not the folder itself).
3. In **DNS Records**, Porkbun auto-creates the `A` / `ALIAS` records for
   the static hosting target. Verify the apex (`@`) and `www` records both
   point at it.

**Option B — Host on Netlify / Vercel / Cloudflare Pages:**
1. Deploy the `Frontend` folder; build command `npm run build`, publish
   directory `dist`.
2. Copy the host's target (e.g. `cname.vercel-dns.com`).
3. In Porkbun **DNS Records**, set:
   - `A` `@` → host's IP, **or** `ALIAS` `@` → host's CNAME target
   - `CNAME` `www` → host's CNAME target
4. Wait for DNS to propagate (usually < 1 hour).

Email/contact links in `Contact.jsx` are placeholders — update them before
launch.
