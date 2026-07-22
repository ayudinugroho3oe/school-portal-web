# CMS Content Inventory

Version: 0.1
Status: APPROVED
Implementation Authority: ALLOWED
Owner: Product Owner
Date: 2026-07-20

## Repository Snapshot

Sprint 4.3 foundation commit is `7e97c6b52948e7567b74605bee1769e26d6698f7` on `main`. The working tree contains pre-existing public UI changes in 16 files. They are user-owned and must not be reset, stashed, overwritten, or attributed to Sprint 5.1.

The current repository is pilot-oriented and uses `PRIMARY_SCHOOL` plus Ar Rahmah-specific fallback content. Sprint 5 treats these values as this installation's migration/seed input, not product-core defaults for every school. New installations use the same source/schema/migrations and receive different database, storage, domain, environment, users, branding, configuration, and content. CMS records retain `schoolId`; no SchoolMembership or shared-database tenant router is required initially.

Technology: Next.js 16.2.10 App Router, React 19.2.4, TypeScript 5, Tailwind CSS 4, PostgreSQL, Prisma 7.8, Better Auth 1.6, Zod 4, React Hook Form 7, Vitest 4, and Playwright 1.61.

## Public Route Inventory

| Route | Current source | CMS target | State |
| --- | --- | --- | --- |
| `/` | Hero/Stats/Programs/ClassPrograms/Gallery/Testimonials | Homepage plus referenced entities | Partially dynamic |
| `/profil` | JSX literals and `/sekolah.jpg` | SchoolProfile | Static |
| `/program` | local array plus class program data | Program | Static |
| `/program/[slug]` | `data/programs.ts`, `data/school-programs.ts` | Program + Media | Static/generated |
| `/galeri` | `data/gallery.ts` | GalleryAlbum/GalleryItem | Static |
| `/galeri/[slug]` | `data/gallery.ts` | Gallery publication | Static/generated |
| `/guru` | `data/teachers.ts` plus JSX | Teacher | Static |
| `/kontak` | JSX/config plus mailto form | ContactContent | Static/partially functional |
| `/ppdb` | JSX and class program data | PpdbContent | Static presentation |
| `/ppdb/register` | client form state | Separate future admissions domain | Prototype only |

## Dynamic School Settings Mapping

`lib/public-school-content.ts` reads `PRIMARY_SCHOOL` and supplies fallback values. Current consumers:

- `app/layout.tsx`
- `components/Navbar.tsx`: school name, tagline, logo
- `components/Footer.tsx`: name, tagline, motto, logo, email, WhatsApp, hours
- `components/FloatingWhatsApp.tsx`: WhatsApp
- `components/Hero.tsx`: school name, WhatsApp, hero image
- `components/HeroCarousel.tsx`: first slide and school name

Available but not yet consistently consumed: building image, address, history, vision, mission, principal name/photo/welcome.

## Static TypeScript Data

### `data/programs.ts`

- Four homepage-featured programs and six program-catalog entries.
- Fields: IDs, slugs, title, summary, image, about, objectives, activities, benefits, frequency.
- Learning-moment arrays are keyed by program slug and reuse school images.
- Target: `Program`, `MediaAsset`, and publication snapshot.

### `data/school-programs.ts`

- PAUD, TK A, TK B descriptions, focus areas, activities, images, and accents.
- Class album prototypes generated from three shared image files.
- Target: installation Program records with configurable category/taxonomy references plus gallery/media references; PAUD, TK A, and TK B are pilot content, not fixed product types.

### `data/gallery.ts`

- Seven albums, categories, dates, status, cover, images, captions, and alt text.
- All albums reuse three placeholder school images.
- Target: GalleryAlbum, GalleryItem, MediaAsset, and School-configured gallery category taxonomy.

### `data/teachers.ts`

- Four public profiles with name, position, education, and logo placeholder as photo.
- Target: Teacher and MediaAsset. Names/data require administrator verification before migration.

### `data/testimonials.ts`

- Three parent testimonials with name, relationship, and message.
- Target: Testimonial with configurable source taxonomy. Publication must wait for consent verification.

### `config/school-contact.ts`

- Placeholder WhatsApp number and display string.
- Target: ContactChannel collection/School Identity; fallback remains until a verified channel is configured.

## JSX-Hardcoded Content

- Homepage section labels, hero copy, statistics, benefits, CTA labels, and PPDB year.
- Profile hero, history, vision, mission, values, principal welcome, and image.
- Program-page heading/copy and a second inline six-program array duplicating domain data.
- Contact headings, email, hours, and `mailto` destination.
- PPDB headings, descriptions, requirements, steps, CTA, and simulated success text.
- Navigation labels/order/routes.
- Footer menu labels, copyright year, and layout copy.

## Configuration-First Gaps

The current code assumes fixed arrays/fields for menus, hero CTAs, homepage section order, class groups, gallery categories, footer menus, WhatsApp/email, and testimonial relationships. The CMS target replaces these assumptions with installation configuration collections:

- ContactChannel
- SocialLink
- CallToAction
- NavigationItem
- HomepageSection
- TaxonomyTerm
- FooterColumn and FooterLink
- unrestricted Program and GalleryAlbum collections

Configuration values are School installation data. New renderer behavior or unsafe icon/code execution is not data and still requires reviewed product-core support.

## Public Media Inventory

| File | Current uses | CMS treatment |
| --- | --- | --- |
| `/logo.png` | Navbar/footer, teacher placeholders | Seed/fallback logo; not valid teacher portrait |
| `/sekolah.jpg` | Hero, profile, programs, galleries | Fallback media |
| `/sekolah.png` | Program image | Fallback media |
| `/sekolah2.png` | Hero/program/gallery | Fallback media |
| `/sekolah3.png` | Hero/program/gallery | Fallback media |
| `/favicon.ico` | App favicon | Fallback favicon |
| boilerplate SVG files | Unrelated defaults | Review for later cleanup; not CMS seed |

No `public/uploads` exists. No object-storage integration exists.

## Form Inventory

### Contact Form

Client-side HTML validation and status states; opens a `mailto:` draft to a hardcoded address. It has no backend, rate limiting, persistence, or delivery confirmation. CMS may change displayed contact details, but transport changes need a separate scope.

### PPDB Registration Form

Five-step client prototype with program selection, student/parent fields, document filename state, review, and simulated success. It does not upload files or persist data. Sprint 5 CMS may configure presentation and choices only; submission processing remains excluded.

## Admin, API, Auth, and Permission Inventory

- Better Auth email/password, Prisma adapter, UUID generation.
- Roles: `SUPER_ADMIN`, `SCHOOL_ADMIN`, `STAFF`, `TEACHER`.
- Current permissions only cover initialize/read/update School Settings.
- Admin shell currently links Ringkasan and Identitas Sekolah.
- School Settings form supports typed identity/contact/brand fields, with several JSON fields not represented in the form.
- APIs: auth catch-all and School Settings GET/PATCH/initialize POST.
- Optimistic concurrency via `expectedUpdatedAt`; successful changes are audited transactionally.

## Prisma Inventory

Current models: User, Session, Account, Verification, SchoolSettings, AuditLog. SchoolSettings holds both technical identity and many nullable future content fields/JSON and currently behaves as one installation singleton. There are no Program, Teacher, Gallery, Testimonial, Media, Publication, Navigation, configuration collection, or PPDB-content entities yet. That is a CMS capability gap, not a requirement for shared-database multi-tenancy.

## Reusable Deployment Gap

The repository already provides one codebase, schema, migration history, and test suite, but repeatable school provisioning is not yet documented as an executable runbook. Sprint 5.2 must keep CMS schema/configuration school-neutral and add idempotent single-School initialization boundaries. It must not add copied school apps, school branches, custom schemas, tenant switching, centralized identity, control plane, billing, or cross-school analytics.

## Test Inventory

- Unit: permission, validation, School Settings service behavior.
- PostgreSQL integration: initialization, permissions, audit, concurrency, rollback.
- E2E admin: login, protection, settings read/update/conflict/restore, logout.
- E2E public: `/`, `/profil`, `/program`, `/galeri`, `/guru`, `/kontak` render.
- Missing CMS tests: publish/preview, media, CRUD/order/archive, API contracts, fallback per migrated domain, mobile admin, and public content assertions.

## Migration Priority

1. Identity/home/profile/navigation/footer because current dynamic boundary already exists.
2. Programs/teachers/testimonials because data is structured and modest.
3. Gallery/media because lifecycle and storage are more complex.
4. PPDB presentation after program IDs are stable.

## Content Requiring Administrative Verification

- Principal and teacher names/qualifications/photos.
- Testimonials and consent.
- School address details, official phone/WhatsApp, social URLs, maps URL.
- Academic year and PPDB status/requirements.
- Program frequency and final media.
- Copyright year policy and footer copy.

No unverified value should be promoted from fallback to a publication automatically.
