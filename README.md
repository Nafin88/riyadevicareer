# Riyadvi Software Technologies – Website Revamp

A multi-page, dynamic corporate website with a 3D interactive experience, a Node/Express API and a MongoDB database.

- **Frontend:** Next.js (App Router) + React 19 + Tailwind CSS 4 → `/frontend`
- **Backend:** Node.js + Express + MongoDB (Mongoose) → `/backend`

| | URL |
|---|---|
| Frontend (Vercel) | _add after deploying_ |
| Backend API (Render/Railway) | _add after deploying_ |
| Admin dashboard | `<frontend-url>/admin` |

## Quick start (Windows)

1. Install Node.js 20 or newer from nodejs.org.
2. Double-click `install.bat` (installs both apps), then double-click `start.bat`.
3. Open http://localhost:3000. Admin: http://localhost:3000/admin (`admin@example.com` / `admin123`).

The included `backend/.env` and `frontend/.env.local` are ready to run. With `MONGODB_URI` empty the API stores data in `backend/data` (development only). For production, set `MONGODB_URI` to a MongoDB Atlas connection string and change the admin password and `JWT_SECRET`.

## Features

- **Homepage:** interactive 3D hero (connected-node ecosystem reacting to cursor, scroll and device tilt), GSAP-pinned "Challenge → Growth" story, shared 3D service stage, orbiting technology constellation, scroll-filled company timeline, Business Health Checkup teaser, end-to-end journey, featured portfolio.
- **Services:** `/services` plus six pages from **one reusable template** (`/services/[slug]`) driven by data: interactive 3D hero, problem, solution, features, use cases, stack, process, related portfolio, "Get a Quote" CTA.
- **Portfolio:** 10 projects, tilt cards, reusable case-study template (`/portfolio/[slug]`); `laxmi-astro-ai` ships an interactive 3D orrery.
- **Lead generation:** `/business-health-checkup` (6-step form with scoring), `/software-project-planning-guide` (validated lead magnet + PDF download), `/contact` (contact + consultation/quote intents, Calendly + WhatsApp hooks).
- **Blog:** featured post, categories, tags, search, related articles, `/blog/[slug]`.
- **Careers:** department/designation/experience filters, `/careers/[slug]`, application form with resume upload.
- **About:** story, vision, mission, values, approach, milestones timeline.
- **Admin dashboard (`/admin`):** JWT login, totals, enquiries, health-checkup leads, lead-magnet leads, applications (resume download), status updates.
- Accessibility basics: skip link, focus rings, labelled forms, `aria-live` errors, reduced-motion support.

## Tech stack

Next.js 16, React 19, Tailwind CSS 4, Express API, Mongoose, Zod, Multer, Nodemailer, Helmet, express-rate-limit, JWT.

### 3D libraries used
`three`, `@react-three/fiber`, `@react-three/drei` (Float, RoundedBox, Environment/Lightformer, MeshDistortMaterial, OrbitControls, Line, Html, PerformanceMonitor).

### Animation libraries used
`gsap` + **ScrollTrigger** (pinned storytelling), **Lenis** (smooth scroll synced to GSAP ticker), **Motion** (`motion/react`: reveals, route-level micro-interactions, scroll-linked timeline, step transitions). That is five technologies in total, including Three.js and R3F.

### Third-party assets
No external image/3D assets. All 3D geometry is procedural. Fonts: Inter and Poppins via `@fontsource` (self-hosted, no render-blocking CDN). Lighting uses drei `Lightformer` rather than downloaded HDRIs. The planning-guide PDF in `frontend/public/downloads` is a **starter placeholder**: replace with the final guide.

## Installation

```bash
# Backend
cd backend
cp .env.example .env     # fill in values
npm install
npm run dev              # http://localhost:5000

# Frontend (new terminal)
cd frontend
cp .env.example .env.local
npm install
npm run dev              # http://localhost:3000
```

## Environment variables

**backend/.env**

| Variable | Purpose |
|---|---|
| `PORT` | API port (default 5000) |
| `MONGODB_URI` | MongoDB connection string (Atlas or local) |
| `CORS_ORIGINS` | Comma-separated allowed frontend origins |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` / `ADMIN_PASSWORD_HASH` | Admin login (prefer a bcrypt hash in production) |
| `JWT_SECRET` | Secret for admin tokens |
| `SMTP_HOST/PORT/USER/PASS`, `MAIL_FROM`, `NOTIFY_TO` | Optional email notification on every submission |
| `GUIDE_URL` | Optional URL of the lead-magnet PDF |

**frontend/.env.local**

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend base URL (no trailing slash) |
| `NEXT_PUBLIC_CONTENT_SOURCE` | Set to `api` to read services/portfolio/blog/jobs from the API instead of bundled JSON |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Enables the WhatsApp button (international format, digits) |
| `NEXT_PUBLIC_CALENDLY_URL` | Enables the Calendly booking button |

## Database setup

MongoDB only. Collections are created automatically by Mongoose:
`enquiries` (contact + consultation, distinguished by `type`), `healthcheckups`, `leadmagnets`, `applications`.
Use a free MongoDB Atlas cluster and put its URI in `MONGODB_URI`.

## API endpoints

All responses: `{ success, message, data }` or `{ success: false, message, errors:[{field,message}] }`.

| Method | Path | Notes |
|---|---|---|
| POST | `/api/contact` | Validated, stored, emailed |
| POST | `/api/consultation` | Phone required |
| POST | `/api/health-checkup` | Nested payload, returns score |
| POST | `/api/lead-magnet` | Returns `downloadUrl` |
| POST | `/api/applications` | `multipart/form-data`, resume PDF/DOC/DOCX ≤ 5 MB |
| GET | `/api/services`, `/api/services/:slug` | Content API |
| GET | `/api/portfolio`, `/api/portfolio/:slug` | Content API |
| GET | `/api/blog` (`?q=&category=&tag=`), `/api/blog/:slug` | Content API |
| GET | `/api/jobs` (`?department=&designation=&experience=`), `/api/jobs/:slug` | Content API |
| POST | `/api/admin/login` | Returns JWT |
| GET | `/api/admin/stats` | Dashboard totals (JWT) |
| GET | `/api/admin/enquiries`, `/health-checkups`, `/lead-magnets`, `/applications` | Paginated lists (JWT) |
| PATCH | `/api/admin/:collection/:id/status` | Update status (JWT) |
| GET | `/api/admin/applications/:id/resume` | Download resume (JWT) |
| GET | `/api/health` | Liveness + DB state |

## Dynamic content architecture

All content is accessed through `frontend/src/lib/content.js`; pages never import JSON directly. Data lives in `backend/src/data/*.json` (copied to `frontend/src/data` via `npm run sync-content`).

- **Add a service / project / blog post / job:** add an object to the matching JSON file, then redeploy. The template pages and `generateStaticParams` pick it up with no new component.
- **Move to a CMS or database:** change only the `load*` functions in `backend/src/routes/content.js` (and/or `lib/content.js`) to call Strapi, Sanity, WordPress or Mongo models. Components stay unchanged.

## Deployment

1. **Database:** create a MongoDB Atlas cluster, allow the backend host's IPs, copy the URI.
2. **Backend (Render):** New Web Service → root `backend`, build `npm install`, start `npm start`, add the backend env vars (set `CORS_ORIGINS` to the Vercel URL). Note: Render's disk is ephemeral, so for production move resume uploads to S3/Cloudinary (see Known limitations).
3. **Frontend (Vercel):** import the repo, set Root Directory to `frontend`, set `NEXT_PUBLIC_API_URL` to the Render URL.
4. Visit `<backend-url>/api/health` and `<frontend-url>`, then submit each form once and check `/admin`.

## Performance optimization

- Every 3D scene is a separate `next/dynamic` chunk (`ssr: false`), mounted only when within 200 px of the viewport and **paused (`frameloop="never"`) when scrolled away**.
- Three quality tiers (`useQuality`): `full`, `lite` (phones/≤4 cores/low memory: fewer nodes, lower geometry detail, DPR 1, no AA) and `static` (reduced-motion, Save-Data, no WebGL → CSS/SVG fallback, no three.js download).
- `PerformanceMonitor` lowers DPR automatically if frame rate drops.
- One shared WebGL canvas for the six service visuals instead of six contexts.
- Procedural geometry (zero model/texture downloads), instanced node meshes, `Lightformer` environments rendered once (`frames={1}`).
- Self-hosted fonts, static generation (SSG) for all content pages, `prefers-reduced-motion` respected for Lenis, GSAP pinning and CSS animation.

## AI tools used

> ⚠️ **Candidate: review and complete this section in your own words before submitting.** The assignment evaluates your understanding of generated code. Fill in the *Manual work* fields only with changes you actually made.

**AI Tool: Claude (Claude Code agentic session)**
- **Purpose:** Generate the initial full-stack implementation: Next.js frontend, R3F scenes, GSAP/Lenis/Motion integration, Express API, Mongoose models, validation, admin dashboard and this README.
- **Example prompt:** _"Build the Riyadvi website per the attached assignment brief"_ (with the PDF brief attached), then iterating on structure, quality tiers and docs.
- **What was generated:** Everything in this repository as the first draft, including the architecture (data → reusable templates), the `useQuality` + `Scene3D` mobile strategy, form validation schemas and the API.
- **Manual work:** _<list what you changed: e.g. visual tuning of the hero scene, copy rewrites, real milestones/awards, replacing sample portfolio results, deployment fixes, bugs you debugged>_
- **Why selected:** Strong at coordinated multi-file generation and explaining trade-offs, which suited a front-end + back-end build.

_Add other tools you actually use (e.g. Cursor/Copilot for refactors, Midjourney for imagery, ChatGPT/Gemini for copy) using the same fields._

## Known limitations

- Sample content: portfolio results, blog posts, job listings and the company milestones are **illustrative placeholders**; confirm real facts, awards and dates with Riyadvi. Awards/recognition is not yet populated.
- 3D scenes were built and compiled but not profiled on physical devices; tune counts after testing on a mid-range phone and run Lighthouse.
- Resume uploads are stored on the server's local disk (ephemeral on most hosts). Use object storage in production.
- The lead-magnet PDF is a placeholder.
- No automated tests; admin auth is a single env-configured account.
- Content updates require editing JSON (no CMS UI yet).

## Future improvements

Headless CMS (Sanity/Strapi) for content, S3 for uploads, Playwright + API tests, GLB models authored in Blender, Draco/KTX2 compression, richer case-study scroll-stories, i18n, CRM/webhook integrations, role-based admin, rate-limit store in Redis, Lighthouse CI.
#   r i y a d e v i c a r e e r  
 