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
    ├── hooks/
    │   ├── useReveal.ts          # IntersectionObserver-driven scroll reveal
    │   ├── useTilt.ts            # cursor-following 3D tilt
    │   └── useTypewriter.ts      # rotating typewriter text
    ├── pages/
    │   ├── Landing.tsx           # Hero + About + Services + Contact
    │   ├── QuotePage.(tsx|css)   # /quote — company-aware quote form
    │   ├── Portal.(tsx|css)      # /portal layout + sidebar
    │   ├── PortalOverview.tsx    # analytics dashboard
    │   ├── PortalQuotes.tsx      # quote history
    │   └── PortalSettings.tsx    # company info + contact
    └── components/
        ├── Navbar.(tsx|css)
        ├── Hero.(tsx|css)        # left-aligned title w/ rotating typewriter
        ├── HeroDashboard.(tsx|css) # animated dashboard mock for the right
        ├── About.(tsx|css)
        ├── Services.(tsx|css)    # ONE unified offering + "Get a free quote"
        ├── Contact.(tsx|css)
        ├── Footer.(tsx|css)
        ├── AuthModal.(tsx|css)   # 2-step company signup (company → login)
        ├── AuthCallback.tsx
        ├── Reveal.(tsx|css)      # scroll-triggered fade/slide wrapper
        ├── ScrollProgress.(tsx|css) # top page-scroll progress bar
```

Accounts are **company-based** — one company == one account. The
displayed identity throughout the portal is the company name, not the
person who manages the account.

Each component owns its own CSS file. Color tokens (white / blue / yellow)
live in `src/styles/global.css` under `:root` — change them in one place to
re-skin the whole site.

## Routes

- `/` — marketing landing page
- `/quote?service=<slug>` — quote-request form (creates the company
  account if the visitor isn't signed in yet)
- `/portal` — client portal dashboard with placeholder analytics
- `/portal/quotes` — quote history
- `/portal/settings` — company info, account-manager contact
- `/auth/callback` — OAuth redirect target

Auth lives under `src/auth/`:
- `types.ts` — shared TypeScript types (User, Business, Quote, Service…).
- `api.ts` — typed `fetch` wrapper, `ApiError`, and `tokenStore`
  (localStorage).
- `AuthContext.tsx` — `useAuth()` exposes `user`, `login`, `signup`,
  `logout`, `oauthLogin('google'|'apple')`, `updateProfile`, plus which
  providers the backend has configured.

`AuthModal.tsx` renders a 2-step signup (account → business) plus the
OAuth buttons. After an OAuth redirect the backend lands at
`/auth/callback?token=…`, handled by `AuthCallback.tsx`.

## Local development

```bash
cd Frontend
npm install
cp .env.example .env         # on Windows use: copy .env.example .env
npm run dev                  # http://localhost:5173
```

From the workspace root you can also run:

```bash
npm run dev
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
