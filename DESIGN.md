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

**Behavior**:
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
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {filteredImages.map → <img aspect-[3/2] object-cover loading="lazy" width={} height={}>}
  </div>
  {lightboxIndex !== null && <Lightbox />}
</section>
```

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
| Gallery layout | Uniform cropped grid | Predictable, no JS layout calculation. `aspect-[3/2] object-cover` reserves layout space; config `width`/`height` used in Lightbox for uncropped display |
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
├── public/
│   ├── favicon.ico
│   ├── logo512.png
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── ginaZphoto.webp
│   ├── gz01.webp ... gz07.webp
│   ├── fb.png
│   └── insta.png
└── src/
    ├── config.js
    ├── App.jsx
    ├── main.jsx
    ├── index.css
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
