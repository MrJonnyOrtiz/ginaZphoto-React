# Photographer Portfolio Template — Tasks

## Phase 1: Project Setup & Tooling

- [ ] **1.1** Upgrade Vite to v8 (`npm install vite@latest @vitejs/plugin-react@latest`)
- [ ] **1.2** Upgrade Tailwind to v4 (`npm install tailwindcss@latest @tailwindcss/vite@latest`)
- [ ] **1.3** Remove `autoprefixer`, `postcss` from devDependencies
- [ ] **1.4** Delete `tailwind.config.js`, `postcss.config.js`
- [ ] **1.5** Rewrite `vite.config.js` (react + tailwindcss plugins only)
- [ ] **1.6** Add `react-helmet-async` (`npm install react-helmet-async`)
- [ ] **1.7** Rewrite `src/index.css` with Tailwind 4 `@import "tailwindcss"` + `@theme` block
- [ ] **1.8** Create `.env` with `VITE_RECAPTCHA_SITE_KEY` and `VITE_CONTACT_API_URL`
- [ ] **1.9** Create `.env.example` (same keys, no values)
- [ ] **1.10** Add `.env` to `.gitignore`
- [ ] **1.11** Delete `.eslintrc.json` (keep `.eslintrc.cjs`)
- [ ] **1.12** Verify `npm run dev` starts without errors

## Phase 2: Config & App Shell

- [ ] **2.1** Create `src/config.js` with all Gina Z content
- [ ] **2.2** Rewrite `src/App.jsx` — HelmetProvider, Helmet (meta + font link), CSS variable root div, section layout
- [ ] **2.3** Rewrite `src/main.jsx` if needed (should be minimal)
- [ ] **2.4** Update `index.html` — remove duplicate font import, remove inline `<style>` block, clean up `<head>`

## Phase 3: Components

- [ ] **3.1** Create `src/components/Navbar.jsx` — fixed, scroll-aware, mobile hamburger, active section highlighting
- [ ] **3.2** Create `src/components/Hero.jsx` — full-viewport, image crossfade, overlay, CTA
- [ ] **3.3** Rewrite `src/components/Services.jsx` — card grid from config
- [ ] **3.4** Create `src/components/Gallery.jsx` — category filter, uniform grid, lightbox trigger
- [ ] **3.5** Create `src/components/Lightbox.jsx` — modal, keyboard nav, focus trap, code-split with React.lazy
- [ ] **3.6** Create `src/components/About.jsx` — two-column layout, conditional social links
- [ ] **3.7** Rewrite `src/components/Contact.jsx` — env vars, early-return validation, loading state
- [ ] **3.8** Create `src/components/Footer.jsx` — conditional links, dynamic year, back-to-top

## Phase 4: Shared Utilities

- [ ] **4.1** Create `src/hooks/useFadeIn.js` — IntersectionObserver scroll animation hook
- [ ] **4.2** Apply `useFadeIn` to Services, Gallery, About, Contact sections

## Phase 5: SEO & Public Assets

- [ ] **5.1** Add `public/robots.txt`
- [ ] **5.2** Add `public/sitemap.xml`
- [ ] **5.3** Verify structured data (JSON-LD) renders correctly in Helmet output
- [ ] **5.4** Verify Open Graph + Twitter Card meta tags render

## Phase 6: Cleanup

- [ ] **6.1** Delete `src/components/Sidebar.jsx`
- [ ] **6.2** Delete `src/components/Subheader.jsx`
- [ ] **6.3** Delete `src/components/CarouselIndicators.jsx`
- [ ] **6.4** Delete `src/components/Logo.jsx`
- [ ] **6.5** Delete `src/components/Carousel.jsx`
- [ ] **6.6** Delete `src/components/AppLayout.jsx`
- [ ] **6.7** Delete `ACTION_PLAN.md`
- [ ] **6.8** Remove unused media files (if any)

## Phase 7: CI/CD

- [ ] **7.1** Update `.github/workflows/main.yaml` — Node 20, actions v4, secrets for CloudFront ID
- [ ] **7.2** Verify build succeeds locally (`npm run build`)
- [ ] **7.3** Test deploy pipeline (push to branch, confirm S3 sync + CloudFront invalidation)

## Phase 8: Testing & Validation

- [ ] **8.1** Run Lighthouse audit — target Performance 90+, Accessibility 95+, SEO 95+
- [ ] **8.2** Test responsive layout: mobile (375px), tablet (768px), desktop (1440px)
- [ ] **8.3** Test lightbox: open, arrow keys, Escape, focus trap, Tab cycling
- [ ] **8.4** Test contact form: validation errors, success submission, double-submit prevention
- [ ] **8.5** Test gallery filter: category switching, lightbox navigates filtered subset only
- [ ] **8.6** Test navbar: scroll-aware styling, active section highlight, mobile menu open/close
- [ ] **8.7** Verify no hardcoded secrets in source (`grep` for API keys/URLs)
- [ ] **8.8** Verify config swap: change `config.js` values, confirm site reflects changes

---

## Phase 9: Admin Image Upload Feature

### Infrastructure

- [ ] **9.1** Create `infra/` directory
- [ ] **9.2** Create `infra/template.yaml` — SAM template (HttpApi, Lambda, IAM role, Layer)
- [ ] **9.3** Create `infra/upload-handler/index.mjs` — Lambda code (auth, resize, manifest update)
- [ ] **9.4** Create `infra/upload-handler/package.json` — dependencies (bcryptjs, busboy)
- [ ] **9.5** Generate admin password, create bcrypt hash, store in `.env`

### Frontend

- [ ] **9.6** Create `public/admin.html` — standalone upload page with drag-drop, password gate
- [ ] **9.7** Update `src/components/Gallery.jsx` — fetch `/gallery.json` at runtime, fallback to config
- [ ] **9.8** Add `VITE_GALLERY_API_URL` to `.env` and `.env.example`

### Deploy & Test

- [ ] **9.9** Run `sam build` in `infra/` — verify template is valid
- [ ] **9.10** Run `sam deploy --guided` — deploy Lambda + API Gateway
- [ ] **9.11** Update `.env` with actual API URL from deploy output
- [ ] **9.12** Test: upload image via admin page → verify it appears in gallery.json
- [ ] **9.13** Test: verify uploaded image renders in Gallery on site
- [ ] **9.14** Test: upload with wrong password → verify 401 rejection
- [ ] **9.15** Verify `npm run build` still passes

### Enhancements (Completed)

- [x] **9.16** Featured toggle — POST /feature Lambda route + admin UI toggle + Hero.jsx fetches featured images
- [x] **9.17** Delete capability — POST /delete Lambda route + admin UI delete button
- [x] **9.18** Client-side image resize (max 2000px via Canvas API) before upload to avoid 413 errors
- [x] **9.19** Gallery masonry layout — CSS columns for natural aspect ratio display
- [x] **9.20** Lightbox portal fix — uses `createPortal` to render on `document.body`
- [x] **9.21** CI exclude — `gallery.json` and `uploads/` excluded from S3 `--delete` sync
