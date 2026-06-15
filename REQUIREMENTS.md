# Photographer Portfolio Template — Requirements

## Overview

A reusable, full-width single-page photography portfolio template built with React + Vite + Tailwind CSS. Designed so a single config file drives all branding, content, and theming — enabling rapid deployment for multiple photography clients.

## Tech Stack

- **Framework**: React 18 (Vite 8)
- **Styling**: Tailwind CSS 4 (CSS-first config, no JS config file needed)
- **Language**: JavaScript (JSX)
- **Deployment**: S3 + CloudFront via GitHub Actions
- **Analytics**: Fathom (already integrated)
- **Contact Backend**: AWS API Gateway + Lambda (existing)

### Why Vite 8 + Tailwind 4

- **Vite 8**: Rust-based Rolldown bundler, 10–30x faster builds, drop-in upgrade.
- **Tailwind 4**: CSS-first configuration via `@theme` directive. Theme values become native CSS custom properties — no `tailwind.config.js` needed. This eliminates the dynamic theming problem (Tailwind can't resolve JS values at runtime) because CSS variables are the native approach now.
- **Removed files**: `tailwind.config.js`, `postcss.config.js` (Tailwind 4 uses its own Vite plugin)

## Template Configuration

All client-specific content lives in a single config file (`src/config.js`). Kept as flat as possible:

```js
export default {
  // Branding
  siteName: 'Gina Z Photography',
  tagline: 'Capturing your sweetest moments!',
  location: 'Serving Tampa Bay',
  logo: '/logo512.png',

  // SEO & Metadata (used by react-helmet-async)
  metaTitle: 'Gina Z Photography | Tampa Bay Portrait Photographer',
  metaDescription: 'Specializing in family, milestone, and event photography in the Tampa Bay area.',
  metaUrl: 'https://ginazphoto.com',
  ogImage: '/gz01.webp',
  schemaType: 'LocalBusiness',
  schemaCity: 'Tampa',
  schemaState: 'FL',

  // Theme (maps to CSS custom properties via @theme in index.css)
  googleFontUrl: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&display=swap',
  fontFamily: '"Cormorant Garamond", serif',
  primaryColor: '#E9C18D',
  backgroundColor: '#FFF3E3',
  textColor: '#1a1a1a',

  // Navigation
  sections: ['home', 'services', 'portfolio', 'about', 'contact'],

  // Hero
  heroImages: ['/gz01.webp', '/gz02.webp', '/gz05.webp'],
  ctaText: 'Get a Free Quote',
  ctaLink: '#contact',

  // Services
  services: [
    { name: 'Self Portraits', description: 'The best light to make you look your best!' },
    { name: 'Couples Session', description: 'Look great with your partner!' },
    { name: 'Family Session', description: 'Capturing family time!' },
    { name: 'Milestone Moments', description: "I'll be there for your meaningful moments." },
    { name: 'Event Photography', description: 'Capturing your favorite memories.' },
  ],

  // Portfolio (with categories and dimensions for CLS prevention)
  portfolioCategories: ['All', 'Portraits', 'Families', 'Events'],
  portfolio: [
    { src: '/gz01.webp', alt: 'Couples session outdoors', category: 'Portraits', width: 800, height: 1200 },
    { src: '/gz02.webp', alt: 'Event photography', category: 'Events', width: 1200, height: 800 },
    { src: '/gz03square.webp', alt: 'Self portrait session', category: 'Portraits', width: 800, height: 800 },
    { src: '/gz04square.webp', alt: 'Family session', category: 'Families', width: 800, height: 800 },
    { src: '/gz05.webp', alt: 'Family session at the park', category: 'Families', width: 1200, height: 800 },
    { src: '/gz06.webp', alt: 'Milestone celebration', category: 'Events', width: 1200, height: 800 },
    { src: '/gz07.webp', alt: 'Milestone moment', category: 'Events', width: 1200, height: 800 },
  ],

  // About
  bio: "Hi! I'm Gina and I'm so excited you stopped by. I have a passion for photography but the best part of photography for me is the relationship I build with a client. They say my smile and positive attitude are infectious. I enjoy spreading love through photography.",
  portrait: '/ginaZphoto.webp',

  // Social (render conditionally — only non-null values show)
  facebook: 'https://www.facebook.com/Gina-Zaffino-Photography-107431728394570/',
  instagram: 'https://www.instagram.com/ginazaffinophoto/',

  // Contact (render conditionally)
  phone: '19417797064',
  email: null,

  // Footer & Legal
  footerCredit: 'Cloud Realm LLC',
  footerCreditUrl: 'https://cloudrealmllc.com',
  privacyPolicyUrl: null, // set to URL string if client has one
};
```

## Design — Full-Width Vertical Layout

### Structure (top to bottom)

1. **Navbar** (fixed, full-width)
   - Logo left, nav links right
   - Transparent over hero, solid with subtle shadow on scroll
   - Mobile: hamburger → slide-in overlay

2. **Hero Section** (full-viewport)
   - Full-bleed featured image (or slow crossfade between 2–3 images)
   - Semi-transparent overlay for text legibility
   - Site name + tagline + CTA button centered
   - Subtle scroll-down indicator at bottom

3. **Services** (full-width section)
   - Section heading
   - Responsive grid of cards (1 col mobile, 2 col tablet, 3 col desktop)
   - Each card: service name + short description
   - Accent color border or background on hover

4. **Portfolio Gallery** (full-width section)
   - Section heading
   - Category filter buttons at top (from `portfolioCategories` config)
   - Uniform cropped grid using `aspect-[3/2] object-cover` (handles mixed portrait/landscape cleanly)
   - Responsive columns: 2 mobile, 3 tablet, 4 desktop
   - Images rendered with explicit `width`/`height` to prevent CLS
   - Subtle hover effect (slight zoom or shadow)
   - Click opens lightbox modal:
     - Lightbox receives the **currently filtered** image array (not full portfolio)
     - Full-size uncropped image display
     - Left/right arrows + keyboard navigation
     - Close button + Escape key
     - Image counter ("3 of 7")

5. **About** (full-width section)
   - Two-column on desktop: portrait left, bio text right
   - Stacked on mobile: portrait then text
   - Social media icon links below bio

6. **Contact** (full-width section)
   - Section heading
   - Centered form (max-width for readability)
   - Fields: Full Name, Email, Message
   - reCAPTCHA widget
   - Submit button (visible after captcha verified)
   - Success/error feedback messages
   - Phone number as clickable `tel:` link

7. **Footer**
   - Social links (conditionally rendered — only non-null values)
   - Privacy policy link (if `privacyPolicyUrl` is set)
   - Copyright (dynamic year) + developer credit
   - Back-to-top button

### Visual Style

- Clean, minimal, generous whitespace
- Warm neutral background (driven by `--color-background` CSS variable)
- Accent color for interactive elements (driven by `--color-primary`)
- Elegant serif or sans-serif typography (driven by `--font-display`)
- Subtle animations: fade-in on scroll (IntersectionObserver), smooth hover transitions
- No jarring effects — the photography is the star

### Theming via CSS Custom Properties (Tailwind 4)

`src/index.css` replaces `tailwind.config.js`:

```css
@import "tailwindcss";

@theme {
  --color-primary: #E9C18D;
  --color-background: #FFF3E3;
  --color-text: #1a1a1a;
  --font-display: "Cormorant Garamond", serif;
}
```

At runtime, `App.jsx` overrides these from config via inline styles on the root element:

```jsx
<div style={{ '--color-primary': config.primaryColor, '--color-background': config.backgroundColor }}>
```

This allows Tailwind classes like `bg-background`, `text-primary`, `font-display` to work dynamically per client.

### Font Loading Strategy

The Google Font `<link>` tag is injected dynamically via `react-helmet-async` from `config.googleFontUrl`. This ensures the font asset is requested immediately before text renders, avoiding FOIT/FOUT when the CSS variable references a font that hasn't loaded yet.

## Component Architecture

```
src/
├── config.js                  ← all client content + theming
├── App.jsx                    ← wraps layout
├── main.jsx                   ← Vite entry
├── index.css                  ← Tailwind directives + font import
└── components/
    ├── Navbar.jsx             ← fixed nav, scroll-aware styling
    ├── Hero.jsx               ← full-viewport hero with image crossfade
    ├── Services.jsx           ← card grid from config.services
    ├── Gallery.jsx            ← image grid from config.portfolio
    ├── Lightbox.jsx           ← modal overlay for full-size images
    ├── About.jsx              ← bio + portrait from config.about
    ├── Contact.jsx            ← form + reCAPTCHA
    └── Footer.jsx             ← credits + social + back-to-top
```

## Functional Requirements

### Navigation
- Smooth scroll to sections on anchor click
- Active section highlighted in nav (IntersectionObserver)
- Mobile menu closes on link click

### Gallery & Lightbox
- Lazy loading for all gallery images (`loading="lazy"`)
- Lightbox traps focus (accessibility)
- Prevents body scroll when lightbox is open
- Swipe support (stretch goal, can use pointer events)

### Contact Form
- Client-side validation with early-return pattern (no nested ifs)
- Loading/submitting state to prevent double-submit
- API URL and reCAPTCHA key from environment variables
- Clear feedback on success or failure

### Performance
- Images already in WebP ✅
- Explicit `width`/`height` on all images to prevent Cumulative Layout Shift (CLS)
- `loading="lazy"` on below-fold images; hero image(s) eager-loaded
- Vite code splitting (dynamic imports for Lightbox)
- Target: Lighthouse Performance 90+

### SEO & Accessibility
- Semantic HTML (`<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`)
- Single `<h1>` (site name in hero), `<h2>` per section
- Descriptive alt text for all images (from config)
- Dynamic meta tags via `react-helmet-async` (driven by config — title, description, OG, Twitter Card)
- Structured data (LocalBusiness JSON-LD) generated from config fields
- `robots.txt` and `sitemap.xml` in `public/`
- ARIA labels on interactive elements (lightbox, nav toggle)
- Focus visible outlines preserved
- Canonical URL meta tag

## Environment Variables

```
VITE_RECAPTCHA_SITE_KEY=6LdYBxgdAAAAALsuzUelSW-rZlbD4e-y5XNLlmKq
VITE_CONTACT_API_URL=https://6bdqrjta4g.execute-api.us-east-1.amazonaws.com/Prod
```

## CI/CD Updates

```yaml
- actions/checkout@v4
- actions/setup-node@v4 (node-version: '20')
- aws-actions/configure-aws-credentials@v4
- CloudFront distribution ID → ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }}
- Deploy: aws s3 sync dist/ s3://${{ env.BUCKET_NAME }} --delete
```

## Migration Plan (from current state)

1. Upgrade Vite to v8, Tailwind to v4; remove `tailwind.config.js`, `postcss.config.js`; add `@tailwindcss/vite` plugin
2. Add `react-helmet-async` dependency
3. Rewrite `index.css` with Tailwind 4 `@theme` directive
4. Create `src/config.js` with all Gina Z content
5. Rewrite `App.jsx` — apply CSS variable overrides from config, wrap with `HelmetProvider`
6. Replace `AppLayout.jsx` → simple vertical section stack
7. Create `Navbar.jsx` — fixed, scroll-aware, mobile hamburger
8. Replace `Carousel.jsx` → `Hero.jsx` (full-viewport hero with crossfade)
9. Rewrite `Services.jsx` → card grid reading from config
10. Create `Gallery.jsx` + `Lightbox.jsx` (new, with category filter)
11. Create `About.jsx` (new)
12. Rewrite `Contact.jsx` — env vars, flatten validation, add loading state
13. Create `Footer.jsx` (new, with conditional privacy link)
14. Update `index.html` — remove duplicate font import, clean up
15. Add `.env` file (gitignored) + `.env.example`
16. Update CI/CD workflow (Node 20, actions v4, secrets for CloudFront ID)
17. Delete unused files
18. Test Lighthouse scores, fix issues

## Files to Delete

- `src/components/Sidebar.jsx`
- `src/components/Subheader.jsx`
- `src/components/CarouselIndicators.jsx`
- `src/components/Logo.jsx`
- `src/components/Carousel.jsx`
- `src/components/AppLayout.jsx`
- `tailwind.config.js`
- `postcss.config.js`
- `.eslintrc.json` (duplicate — keep `.eslintrc.cjs`)
- `ACTION_PLAN.md` (superseded by this document)

## Out of Scope (Future Enhancements)

- Blog section
- Client reviews/testimonials
- Online booking integration
- CMS for photographer self-managed updates
- Dark mode
- Multi-page routing
- Touch/swipe in lightbox

## Success Criteria

- [ ] Site loads in under 2 seconds on 4G
- [ ] Lighthouse: Performance 90+, Accessibility 95+, SEO 95+
- [ ] All content driven by `config.js` (swap file → new client site)
- [ ] Contact form works with existing API Gateway backend
- [ ] Responsive across mobile, tablet, desktop
- [ ] Lightbox works with keyboard navigation
- [ ] No hardcoded secrets in source
- [ ] CI deploys successfully on push to master
