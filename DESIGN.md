# Photographer Portfolio Template — Design Document

## Purpose

This document describes how the requirements are implemented: component contracts, state management, data flow, and key technical decisions.

## Data Flow

```
config.js (static content)
    │
    ├── App.jsx
    │     ├── Injects CSS variables (theme) on root <div>
    │     ├── Wraps app in <HelmetProvider>
    │     └── Renders section components in order
    │
    ├── <Helmet> (in App.jsx)
    │     ├── <link> for Google Font (from config.googleFontUrl)
    │     ├── <title>, <meta> OG/Twitter (from config.meta*)
    │     └── <script type="application/ld+json"> (structured data)
    │
    └── Each component reads from config directly (import config from '../config')

.env (secrets — not in source)
    └── Contact.jsx reads via import.meta.env.VITE_*
```

## Component Contracts

### App.jsx

```jsx
// Responsibilities:
// 1. Apply theme CSS variables from config
// 2. Provide HelmetProvider context
// 3. Render Helmet with meta/font tags
// 4. Render page sections in order

import config from './config';
import { HelmetProvider, Helmet } from 'react-helmet-async';

// Root div applies CSS variable overrides:
// style={{ '--color-primary': config.primaryColor, ... }}
```

**Props**: None (root component)
**State**: None

---

### Navbar.jsx

**Props**: None (reads config directly for `logo`, `siteName`, `sections`)

**State**:
- `isScrolled` (boolean) — true when page scrolled past hero height
- `isMobileOpen` (boolean) — mobile menu visibility

**Behavior**:
- `useEffect` with scroll listener → toggles `isScrolled`
- When `isScrolled`: solid background + shadow
- When not: transparent background (over hero)
- Click nav link → smooth scroll via `element.scrollIntoView({ behavior: 'smooth' })`, closes mobile menu
- Active section detection via IntersectionObserver on each `<section>` element

**Accessibility**:
- `<nav aria-label="Main navigation">`
- Mobile toggle: `aria-expanded={isMobileOpen}`, `aria-controls="mobile-menu"`
- Mobile overlay traps focus when open

---

### Hero.jsx

**Props**: None (reads config for `heroImages`, `siteName`, `tagline`, `ctaText`, `ctaLink`)

**State**:
- `activeIndex` (number) — current image in crossfade rotation
- `images` (array) — resolved hero images

**Behavior**:
- On mount: fetches `/gallery.json`, filters for entries with `featured: true`, uses their `src` values
- Falls back to `config.heroImages` if fetch fails or no featured images exist
- `useEffect` with `setInterval` (6s) to advance `activeIndex`
- Images stacked via `absolute inset-0`, opacity transition on active
- Hero images loaded eagerly (no `loading="lazy"`)
- Cleanup: clear interval on unmount

**Layout**:
```
<section id="home" class="relative h-screen overflow-hidden">
  {heroImages.map → absolute positioned <img> with opacity transition}
  <div class="absolute inset-0 bg-black/30"> <!-- overlay -->
    <h1>{siteName}</h1>
    <p>{tagline}</p>
    <a href={ctaLink}>{ctaText}</a>
  </div>
</section>
```

---

### Services.jsx

**Props**: None (reads config for `services`)

**State**: None

**Layout**:
```
<section id="services" class="py-20 px-6 max-w-6xl mx-auto">
  <h2>Services</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {services.map → <ServiceCard>}
  </div>
</section>
```

Each card: bordered container with `hover:border-primary` transition.

---

### Gallery.jsx

**Props**: None (reads config for `portfolio`, `portfolioCategories`)

**State**:
- `activeCategory` (string) — defaults to `'All'`
- `lightboxIndex` (number | null) — null = closed, number = open at index

**Derived**:
- `filteredImages` = activeCategory === 'All' ? portfolio : portfolio.filter(...)

**Behavior**:
- Filter buttons set `activeCategory`
- Image click sets `lightboxIndex` (index within `filteredImages`)
- Passes `filteredImages` and `lightboxIndex` to `<Lightbox>`

**Layout**:
```
<section id="portfolio" class="py-20 px-6 max-w-7xl mx-auto">
  <h2>Portfolio</h2>
  <div class="flex gap-3 justify-center mb-8"> <!-- filter buttons -->
    {portfolioCategories.map → <button>}
  </div>
  <div class="columns-2 md:columns-3 lg:columns-4 gap-4"> <!-- CSS columns masonry layout -->
    {filteredImages.map → <img object-cover loading="lazy" width={} height={}>}
  </div>
  {lightboxIndex !== null && <Lightbox />}
</section>
```

**Note**: Gallery uses CSS columns masonry layout (not uniform grid) to display images at their natural aspect ratios.

---

### Lightbox.jsx

**Props**:
- `images` — the filtered image array
- `startIndex` — initial image to display
- `onClose` — callback to close

**State**:
- `currentIndex` (number) — initialized from `startIndex`

**Behavior**:
- `useEffect` keydown listener: ArrowLeft/ArrowRight to navigate, Escape to close
- Body scroll locked (`document.body.style.overflow = 'hidden'`) on mount, restored on unmount
- Focus restore: on mount, capture `document.activeElement` in a ref. On unmount, return focus to that element (ensures keyboard users land back on the gallery thumbnail they clicked).
- Focus trap: on mount, focus moves to close button. Tab/Shift+Tab cycle between close, prev, and next buttons only. No focus escapes to elements behind the overlay.
- Loaded via `React.lazy()` + `<Suspense>` for code splitting
- **Renders via `createPortal` onto `document.body`** to avoid z-index/overflow issues with parent containers

**Layout**:
```
<div class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
     role="dialog" aria-modal="true" aria-label="Image lightbox">
  <button aria-label="Close lightbox" onClick={onClose}>×</button>
  <button aria-label="Previous image" onClick={prev}>‹</button>
  <img src={images[currentIndex].src} alt={images[currentIndex].alt} class="max-h-[90vh] max-w-[90vw] object-contain" />
  <button aria-label="Next image" onClick={next}>›</button>
  <p>{currentIndex + 1} of {images.length}</p>
</div>
```

---

### About.jsx

**Props**: None (reads config for `portrait`, `bio`, `facebook`, `instagram`)

**State**: None

**Layout**:
```
<section id="about" class="py-20 px-6 max-w-5xl mx-auto">
  <h2>About</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
    <img src={portrait} alt="{siteName} portrait" loading="lazy" />
    <div>
      <p>{bio}</p>
      <div class="flex gap-4 mt-6">
        {config.facebook && <a ...>Facebook</a>}
        {config.instagram && <a ...>Instagram</a>}
      </div>
    </div>
  </div>
</section>
```

---

### Contact.jsx

**Props**: None (reads config for `phone`, `email`)

**State**:
- `formData` — { name, email, message }
- `status` — 'idle' | 'submitting' | 'success' | 'error'
- `errorMessage` (string)
- `hasCaptchaToken` (boolean)

**Refs**:
- `captchaRef` — reCAPTCHA instance

**Behavior** (validation with early returns):
```js
async function handleSubmit(e) {
  e.preventDefault();
  if (!isValidName(formData.name)) return setError('...');
  if (formData.message.length < 4) return setError('...');
  if (!hasCaptchaToken) return setError('...');

  setStatus('submitting');
  const token = captchaRef.current.getValue();
  captchaRef.current.reset();

  try {
    const res = await fetch(import.meta.env.VITE_CONTACT_API_URL, { ... });
    if (res.ok) { setStatus('success'); resetForm(); }
    else { setStatus('error'); }
  } catch { setStatus('error'); }
}
```

**Accessibility**:
- All inputs have associated `<label>` with `htmlFor`
- Error messages linked via `aria-describedby`
- Submit button `disabled` during submitting state

**reCAPTCHA script loading**:
- The `react-google-recaptcha` package injects the Google reCAPTCHA script automatically on component mount
- No static `<script>` tag in `index.html` — script only loads when user scrolls to Contact section
- This is intentional for performance: pages that never scroll to contact don't pay the script cost

---

### Footer.jsx

**Props**: None (reads config for `footerCredit`, `footerCreditUrl`, `privacyPolicyUrl`, social links)

**State**: None

**Layout**:
```
<footer class="py-10 text-center border-t border-primary/30">
  <div class="flex justify-center gap-4 mb-4">
    {config.facebook && ...}
    {config.instagram && ...}
  </div>
  {config.privacyPolicyUrl && <a href={...}>Privacy Policy</a>}
  <p>© {new Date().getFullYear()} {config.siteName}. Powered by <a>{footerCredit}</a></p>
  <button onClick={scrollToTop} aria-label="Back to top">↑</button>
</footer>
```

## State Management

No external state library. All state is component-local:

| Component | State | Reason |
|-----------|-------|--------|
| Navbar | isScrolled, isMobileOpen | UI-only, no sharing needed |
| Hero | activeIndex | Internal timer |
| Gallery | activeCategory, lightboxIndex | Drives filtering + lightbox |
| Lightbox | currentIndex | Internal navigation |
| Contact | formData, status, hasCaptchaToken | Form lifecycle |

No prop drilling beyond Gallery → Lightbox (parent-child).

## Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| State library | None (useState) | App is simple, no cross-component state |
| Routing | None (anchor scroll) | Single-page, no URL routing needed |
| Image format | WebP only (no fallback) | Browser support is 97%+ in 2026 |
| Gallery layout | CSS columns masonry | Displays images at natural aspect ratios without cropping; pure CSS, no JS layout calculation |
| Lightbox loading | React.lazy + Suspense | Only loaded when user clicks an image |
| Meta tags | react-helmet-async | Dynamic per-config, works with SPA |
| Active nav detection | IntersectionObserver (threshold: 0.3, rootMargin: "-80px 0px 0px 0px") | Native API, offset accounts for fixed navbar height |
| Scroll animations | IntersectionObserver (threshold: 0.1) | Separate instances, no collision with nav observer |
| Animations | CSS transitions + IntersectionObserver | No animation library needed |
| Form validation | Early-return pattern | Flat, readable, no nesting |

## CSS Architecture (index.css)

```css
@import "tailwindcss";

@theme {
  --color-primary: #E9C18D;
  --color-background: #FFF3E3;
  --color-text: #1a1a1a;
  --font-display: "Cormorant Garamond", serif;
}

/* Base overrides */
body {
  @apply bg-background text-text font-display;
}

/* Scroll behavior */
html {
  scroll-behavior: smooth;
}

/* Fade-in animation for scroll-triggered sections */
.fade-in {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}
```

## Scroll-Triggered Fade-In Pattern

Used by Services, Gallery, About, Contact sections:

```jsx
// Custom hook
function useFadeIn() {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) entry.target.classList.add('visible'); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return ref;
}

// Usage in any section
function Services() {
  const ref = useFadeIn();
  return <section ref={ref} className="fade-in">...</section>;
}
```

## Dependency Changes

### Add
- `react-helmet-async` — dynamic meta tags
- `@tailwindcss/vite` — Tailwind 4 Vite plugin (replaces postcss setup)

### Upgrade
- `vite` → ^8.0
- `tailwindcss` → ^4.0
- `@vitejs/plugin-react` → latest compatible with Vite 8

### Remove
- `autoprefixer` (Tailwind 4 handles this)
- `postcss` (not needed with @tailwindcss/vite)

## vite.config.js

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

## File Inventory (final state)

```
├── index.html
├── package.json
├── vite.config.js
├── .env
├── .env.example
├── .eslintrc.cjs
├── prettier.config.cjs
├── .gitignore
├── REQUIREMENTS.md
├── DESIGN.md
├── TASKS.md
├── infra/
│   ├── template.yaml
│   └── upload-handler/
│       └── index.mjs
├── public/
│   ├── logo512.png
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── admin.html
│   ├── ginaZphoto.webp
│   ├── gz01.webp ... gz07.webp
│   ├── fb.png
│   └── insta.png
└── src/
    ├── config.js
    ├── App.jsx
    ├── main.jsx
    ├── index.css
    ├── hooks/
    │   └── useFadeIn.js
    └── components/
        ├── Navbar.jsx
        ├── Hero.jsx
        ├── Services.jsx
        ├── Gallery.jsx
        ├── Lightbox.jsx
        ├── About.jsx
        ├── Contact.jsx
        └── Footer.jsx
```

---

## Admin Image Upload — Design

### Data Flow

```
admin.html
    │ POST /upload
    │ Headers: { X-Admin-Password: <plaintext password> }
    │ Body: multipart/form-data { image, alt, category, featured }
    │
    │ POST /delete
    │ Headers: { X-Admin-Password: <plaintext password> }
    │ Body: JSON { src }
    │
    │ POST /feature
    │ Headers: { X-Admin-Password: <plaintext password> }
    │ Body: JSON { src, featured }
    ▼
API Gateway (HTTP API, POST routes: /upload, /delete, /feature)
    │
    ▼
Lambda (upload-handler)
    │
    ├── 1. Extract password from header
    ├── 2. bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH)
    │       → 401 if mismatch
    ├── 3. Parse multipart body (image buffer, alt, category)
    ├── 4. sharp(buffer).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 80 })
    ├── 5. Get image metadata (width, height) from sharp
    ├── 6. Generate key: uploads/{Date.now()}-{slugify(alt)}.webp
    ├── 7. PutObject to S3 (ContentType: image/webp)
    ├── 8. GetObject gallery.json from S3 (or [] if doesn't exist)
    ├── 9. Append { src: '/{key}', alt, category, width, height, featured }
    ├── 10. PutObject gallery.json (Cache-Control: public, max-age=60)
    └── 11. Return 200 { src, alt, category, width, height }
```

**Client-side resize**: Before upload, admin.html resizes images to max 2000px wide via Canvas API to avoid 413 payload errors from API Gateway.

**Admin page category filter**: The admin gallery view includes a category filter dropdown to allow the photographer to view/manage images by category.

### Lambda Contract (`infra/upload-handler/index.mjs`)

**Environment variables:**
- `ADMIN_PASSWORD_HASH` — bcrypt hash of the admin password
- `BUCKET_NAME` — S3 bucket (e.g., `ginazphoto.com`)

**Input (API Gateway event):**
- `headers['x-admin-password']` — plaintext password
- `body` — base64-encoded multipart form data
- `isBase64Encoded` — true

**Output:**
- `200` — `{ src, alt, category, width, height }`
- `401` — `{ error: 'Unauthorized' }`
- `400` — `{ error: '<validation message>' }`
- `500` — `{ error: 'Upload failed' }`

**Additional Routes:**

`POST /delete`:
- Input: `{ src }` (JSON body)
- Behavior: Removes image from S3 and from gallery.json
- Output: `200` — `{ success: true }` | `401` | `500`

`POST /feature`:
- Input: `{ src, featured }` (JSON body)
- Behavior: Updates `featured` field for matching entry in gallery.json
- Output: `200` — `{ success: true }` | `401` | `500`

**Dependencies:**
- `sharp` (via Lambda layer, linux-arm64)
- `bcryptjs` (pure JS, no native bindings — bundled with function)
- `@aws-sdk/client-s3` (available in Lambda runtime)
- `busboy` (multipart parsing — bundled with function)

### SAM Template Contract (`infra/template.yaml`)

**Parameters:**
- `AdminPasswordHash` (String, NoEcho) — bcrypt hash
- `BucketName` (String, Default: ginazphoto.com)

**Resources:**
- `UploadFunction` — Lambda, arm64, Node 20, 512MB memory, 30s timeout
- `UploadFunctionLayer` — sharp layer (pre-built for arm64)
- `HttpApi` — API Gateway HTTP API
- `UploadRoute` — POST /upload → UploadFunction
- `DeleteRoute` — POST /delete → UploadFunction
- `FeatureRoute` — POST /feature → UploadFunction
- `UploadFunctionRole` — IAM role with s3:GetObject, s3:PutObject, s3:DeleteObject on bucket

**Outputs:**
- `ApiUrl` — the upload endpoint URL (used in admin.html and .env)

### Admin Page Contract (`public/admin.html`)

**State (in-page JS):**
- `password` — stored in sessionStorage after entry
- `uploading` — boolean, disables form during upload
- `message` — success/error text

**Behavior:**
1. On load: check sessionStorage for password → show upload form or password prompt
2. Password submit: store in sessionStorage, reveal upload form
3. File select (input or drag-drop): show preview + metadata fields
4. Upload submit: POST to API with `X-Admin-Password` header + FormData body
5. On 401: clear sessionStorage, show password prompt again
6. On success: show confirmation, reset form
7. On error: show error message

**UI elements:**
- Password input + submit button
- Drag-drop zone / file input (accept: image/*)
- Alt text input (required)
- Category dropdown (values from known categories)
- Upload button
- Status message area

### Gallery.jsx Changes

**Current:** reads `config.portfolio` statically

**New behavior:**
```jsx
const [images, setImages] = useState(config.portfolio);

useEffect(() => {
  fetch('/gallery.json')
    .then((res) => res.ok ? res.json() : Promise.reject())
    .then((data) => { if (data.length > 0) setImages(data); })
    .catch(() => {}); // silent fallback to config.portfolio
}, []);
```

- If `gallery.json` exists and has entries → replaces static config
- If fetch fails or returns empty → keeps `config.portfolio` as fallback
- No loading spinner needed — static config renders immediately, dynamic data swaps in seamlessly

### Security Considerations

- Admin page URL is unlisted (not in nav, not in sitemap, not linked anywhere)
- Password transmitted over HTTPS (API Gateway enforces TLS)
- bcrypt comparison in Lambda prevents timing attacks
- No file type trust — sharp will reject non-image buffers
- S3 objects are public-read (served via CloudFront) — this is intentional for a portfolio
- Lambda has minimal IAM permissions (only the one bucket, only Get/Put)

---

## About Photo Management — Design

### Data Flow

```
admin.html ("About Photo" card)
    │ POST /portrait
    │ Headers: { X-Admin-Password: <plaintext password> }
    │ Body: multipart/form-data { image }
    ▼
API Gateway (HTTP API)
    │
    ▼
Lambda (upload-handler)
    ├── 1. Validate password (bcrypt)
    ├── 2. Parse multipart body (image buffer)
    ├── 3. sharp(buffer).resize({ width: 1200, withoutEnlargement: true }).webp({ quality: 80 })
    ├── 4. PutObject to S3 key: portrait.webp (ContentType: image/webp, Cache-Control: max-age=60)
    └── 5. Return 200 { src: '/portrait.webp' }

About.jsx (frontend)
    │ GET /portrait
    ▼
API Gateway → Lambda
    └── GetObjectMetadata for portrait.webp → return { src } or 404
```

### Lambda Changes

Two new routes added to the existing `upload-handler/index.mjs`:

**`POST /portrait`**:
- Same auth flow as other routes
- Parses multipart body, extracts single image
- Resizes with sharp (1200px max width, WebP quality 80)
- Writes to fixed S3 key `portrait.webp` (overwrites previous)
- Sets `Cache-Control: public, max-age=60`
- Returns `{ src: '/portrait.webp' }`

**`GET /portrait`**:
- No auth required
- Checks if `portrait.webp` exists in S3 (HeadObject)
- If exists: returns `{ src: '/portrait.webp' }`
- If not: returns 404

### SAM Template Changes

Add two routes to existing HttpApi:
- `PortraitUploadRoute` — POST /portrait → UploadFunction
- `PortraitGetRoute` — GET /portrait → UploadFunction

No new Lambda functions needed — same handler, new route paths.

### Admin UI Changes (`public/admin.html`)

New card between Upload and Gallery cards:

```
┌─────────────────────────────────┐
│ ABOUT PHOTO                     │
├─────────────────────────────────┤
│  ┌──────────┐  ┌─────────────┐ │
│  │ current  │  │  Drop zone  │ │
│  │ portrait │  │  or click   │ │
│  │  image   │  │  to select  │ │
│  └──────────┘  └─────────────┘ │
│                                 │
│  [Replace Photo]                │
│  ✓ Photo updated!               │
└─────────────────────────────────┘
```

**State**: Reuses existing `password` from sessionStorage. New local state for preview/upload status.

**Behavior**:
1. On app load (after auth): fetches `GET /portrait` to display current photo, falls back to `/ginaZphoto.webp`
2. File select/drop: shows preview
3. "Replace Photo" click: client-side resize (2000px max), POST /portrait with FormData
4. On success: updates displayed image, shows confirmation
5. On 401: redirects to login

### About.jsx Changes

```jsx
const [portrait, setPortrait] = useState(config.portrait);

useEffect(() => {
  fetch(`${API}/portrait`)
    .then(res => res.ok ? res.json() : Promise.reject())
    .then(data => setPortrait(data.src))
    .catch(() => {}); // keep config.portrait fallback
}, []);
```

- Renders immediately with `config.portrait` (no loading flash)
- Swaps to API-provided URL if available
- No loading state needed — static fallback is seamless
