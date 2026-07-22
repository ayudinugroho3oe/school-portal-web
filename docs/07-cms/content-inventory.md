# CMS Content Inventory

Version: 0.2
Status: APPROVED
Implementation Authority: ALLOWED
Owner: Product Owner
Date: 2026-07-20

## Repository Snapshot

The repository checkpoint after Sprint 5.2.6 is commit `a9661005823fe6d21077f7b2825f5ade4deaec02` on `main`. The working tree still contains pre-existing public UI changes in 16 files. They are user-owned and must not be reset, stashed, overwritten, or attributed to CMS milestones.

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
- Runtime permissions cover School Settings, configuration collections, media, and Program/Teacher/Gallery/Testimonial working-copy and lifecycle actions. Sprint 5.3 identity/homepage/profile/contact/navigation/footer and preview permissions remain documented but unimplemented.
- Admin shell currently links Ringkasan and Identitas Sekolah.
- School Settings form supports typed identity/contact/brand fields, with several JSON fields not represented in the form.
- APIs: auth and School Settings; configuration collection CRUD/order; structured-content working-copy CRUD/order; publish/unpublish/status; and public published-snapshot reads.
- Optimistic concurrency via `expectedUpdatedAt`; successful changes are audited transactionally.

## Prisma Inventory

Current models include authentication, canonical School, SchoolSettings compatibility, AuditLog, ContactChannel, SocialLink, CallToAction, MediaAsset, Program, TeacherProfile, GalleryAlbum/GalleryItem, Testimonial, immutable ContentPublication history, ContentPublicationHead, and ContentAuditEvent. Homepage/Profile/Contact/PPDB/Navigation/Footer-specific entities, taxonomy, MediaUsage, and preview-session persistence remain absent.

## Reusable Deployment Gap

The repository provides one codebase, schema, migration history, test suite, migration rehearsal, and School-root provisioning/runbook. New installations still require environment-specific operational provisioning, secrets, database, storage, and domain setup. The product must not add copied school apps, school branches, custom schemas, tenant switching, centralized identity, control plane, billing, or cross-school analytics without later approval.

## Test Inventory

- Unit: permission, validation, School Settings service behavior.
- PostgreSQL integration: initialization, permissions, audit, concurrency, rollback.
- E2E admin: login, protection, settings read/update/conflict/restore, logout.
- E2E public: `/`, `/profil`, `/program`, `/galeri`, `/guru`, `/kontak` render.
- Implemented tests cover CMS context, validation, permissions, configuration CRUD/order, media foundation, structured content, immutable publish/republish/unpublish, public snapshot APIs, migration rehearsal, admin authentication, and existing public-route rendering.
- Remaining test gaps follow unimplemented scope: preview authorization, Sprint 5.3 backfill/resolvers/editors, media HTTP upload, mobile admin editors, consent, and visual-equivalence baselines.

## Repository Capability Checkpoint after Sprint 5.2.6

- Implemented independent publication roots: Program, Teacher Profile, Gallery Album, Testimonial.
- Gallery Album snapshots embed active ordered Gallery Items; Gallery Item has no independent publication head.
- Public APIs read only ContentPublicationHead snapshots.
- Public pages still use existing SchoolSettings/static fallback and are not switched to the structured publication APIs.
- Admin content editors and preview sessions remain unimplemented.

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
