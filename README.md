# SJ_Consulting_Frontend
The Code reposotory for an Education Consulting Firm
# SJ Consult — Unauthenticated Frontend

A Next.js (App Router) + TypeScript build of the **public, unauthenticated**
part of SJ Consult — an education consulting platform for JAMB aspirants and
UNILAG undergraduates. Built from the project brief
`THE_DEVELOPMENT_OF_SJ_CONSULTING_CUSTOMER-FACING_APPLICATION_AND_ADMIN_DASHBOARD`.

Everything here is real UI wired to **dummy/mock data** — there is no backend
integration yet. That's intentional: this phase is about getting the layout,
design system, and component structure right before wiring the API contracts
documented in the brief (`api/v1/signup`, `api/v1/dashboard/*`, etc.).

## Why "unauthenticated"

Per the brief, the unauthenticated part of the application is everything a
visitor can see **before** signing in: Home, Services, About, Blog, Sign up,
and Sign in. It doesn't require a session and doesn't touch the authenticated
dashboards (aspirant/undergraduate), which are a later build phase.

## Getting started

```bash
npm install
npm run dev
```

Visit http://localhost:3000. `npm run build && npm run start` runs a
production build.

## Pages

| Route       | Purpose |
|-------------|---------|
| `/`         | Landing page: hero, information feed, impact metrics, testimonials |
| `/services` | Full breakdown of what SJ Consult offers, alternating image/text rows |
| `/about`    | Credibility (CAC/registration), the founder, the platform's purpose, and the five departments |
| `/blog`     | Searchable article grid ("Blog & performance" in the brief) |
| `/signup`   | Account creation — aspirant or undergraduate, with conditional fields |
| `/signin`   | Username-or-email + password sign in |

Every route shares the same sticky navbar and footer, rendered once in
`src/app/layout.tsx` so they're never re-mounted per page.

## Design system

The brief specifies a **black, white, and metallic gold** identity. Rather
than leave that to chance per-component, it's centralized in
`tailwind.config.js`:

- **Colors** — `ink` (near-black surfaces), `paper` (white/light surfaces),
  and a `gold` scale (`50`–`700`) used for accents, borders and CTAs. A
  `gold-metal` gradient and a `text-gold-foil` utility (in `globals.css`)
  give headings and buttons a genuine metallic look instead of a flat yellow.
- **Type** — `font-display` (Georgia-led serif stack, for headings) and
  `font-sans` (system sans stack, for body/UI copy), per the brief's
  "Georgia or clean sans-serif" instruction.
- **Dark/light mode** — a `ThemeProvider` (`src/components/theme/`) persists
  the choice to `localStorage`, respects `prefers-color-scheme` on first
  visit, and a small inline script in `layout.tsx` sets the `dark` class
  before hydration so there's no flash of the wrong theme. The Sun/Moon
  toggle (`theme-toggle.tsx`) lives in the navbar on every screen size.

## Component structure

Everything is broken into small, reusable pieces rather than one large file
per page:

```
src/components/
├── layout/        Navbar, Footer — present on every route
├── theme/         ThemeProvider, ThemeToggle
├── ui/            ScrollCue (the "preview text + arrow" control under sections)
├── home/          Hero, Information, Metrics, Testimonials
├── services/      ServicesGrid (used on /services)
├── about/         CacSection, TutorSection, PurposeSection, DepartmentsCarousel
├── blog/          BlogList (search + animated grid)
└── forms/         TextField, SelectField, SegmentedControl, AuthLayout,
                   SignUpForm, SignInForm
```

`src/lib/mock-data.ts` holds all placeholder content (services, testimonials,
blog posts, department descriptions, etc.) in one place, so swapping in real
API responses later means changing the data source, not the components.

## Interaction notes

- **Scroll cues** — beneath each home-page section, a short line of text plus
  a bouncing `ChevronDown` (`lucide-react`) smooth-scrolls to the next
  section (`ScrollCue` component).
- **Information section** — five topic cards (mentorship, college guidelines,
  exam body info, UTME calculator, undergraduate essentials) laid out as a
  wrapping grid on desktop and a single stacked column on mobile, with a
  staggered `framer-motion` reveal on scroll.
- **Services grid** — alternates image/text placement per row using CSS
  `order` utilities, each row illustrated with a custom SVG motif (question
  bank, guideline desk, one-on-one guidance, accommodation) instead of stock
  photography.
- **Metrics** — the "0 to total clients served" counter uses an
  `IntersectionObserver` so it only animates once, when scrolled into view,
  and jumps straight to the final value if the visitor has reduced motion
  enabled.
- **Testimonials** — a staggered, gently floating card grid (flex/grid +
  `framer-motion`), matching the brief's "bouncing" testimonial cards.
- **About / CAC** — a hoverable seal mark (SVG, not a photo) that lifts on
  hover, alongside registration details.
- **About / Departments** — a horizontally slidable, scroll-snapping carousel
  with left/right controls that disable at the ends.
- **Blog** — a client-side search field filters the mock article list by
  title and summary; results animate in as a grid on desktop and stack on
  mobile.
- **Sign up** — a segmented control switches between "JAMB aspirant" and
  "UNILAG undergraduate", which conditionally swaps in a year selector or a
  "have you written JAMB before?" toggle, matching the brief's signup fields.

## What's intentionally not done yet

- No API calls — forms `preventDefault()` and stop; see inline comments in
  `sign-up-form.tsx` and `sign-in-form.tsx` for where `api/v1/signup`,
  `api/v1/send`, `api/v1/verify_email` and `api/v1/signin` will plug in.
- No authenticated dashboards (aspirant/undergraduate) — a separate build
  phase per the brief.
- No CMS — blog posts, services, testimonials and department data are all in
  `src/lib/mock-data.ts`.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v3 · `framer-motion` ·
`lucide-react`
