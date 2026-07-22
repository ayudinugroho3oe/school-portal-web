# Admin CMS System Blueprint

Version: 0.2
Status: APPROVED
Implementation Authority: ALLOWED
Owner: Product Owner
Date: 2026-07-20

## Goal

Extend the existing Next.js modular monolith with a maintainable CMS while preserving public design, Better Auth, Prisma/PostgreSQL, Zod, React Hook Form, optimistic concurrency, and audit conventions established in Sprint 4.3.

The model is **One Product Core, Multiple Independent Installations**. TK Islam Ar Rahmah 48 is the pilot installation. Each initial installation serves one School and owns one database, domain, storage, environment, authentication boundary, configuration, and user set. Every installation runs the same canonical source, schema, migration history, test suite, and release version. `schoolId` remains in domain records for clarity and portability, not to require shared-database multi-tenancy.

## Current Baseline

- Public routes: `/`, `/profil`, `/program`, `/program/[slug]`, `/galeri`, `/galeri/[slug]`, `/guru`, `/kontak`, `/ppdb`, `/ppdb/register`.
- Admin routes: `/admin`, `/admin/login`, `/admin/settings/school`, `/admin/settings/school/setup`.
- Current API: Better Auth, School Settings, configuration collections, structured-content working-copy/lifecycle routes, and read-only public publication routes.
- Current CMS persistence: canonical School, configuration collections, MediaAsset, Program, Teacher Profile, Gallery Album/Item, Testimonial, immutable ContentPublication history, ContentPublicationHead, and ContentAuditEvent.
- Current admin UI: login, protected shell/dashboard, and School Settings. Content editors and preview UI are not implemented.
- Dynamic public boundary: navbar, footer, floating WhatsApp, and homepage hero use `SchoolSettings` with local fallback.
- Remaining content is JSX or TypeScript data. PPDB submission is a client-only prototype.

## Recommended Publishing Model

Use **Draft → Preview → Publish with immutable audit history**:

1. Save updates the typed working-copy entity.
2. Preview reads the working copy for an authenticated user.
3. Publish performs full validation, appends an immutable `ContentPublication`, and creates or moves `ContentPublicationHead` atomically.
4. Republish always creates the next immutable version; earlier snapshots are never mutated during the normal lifecycle.
5. Public resolvers read only the head snapshot, falling back to approved static data until migration completes.
6. Unpublish deletes the head and returns the working copy to `DRAFT`; archive remains a separate working-copy restriction.

This is safer than direct activation while retaining an audit-grade history. Full history restoration UI and scheduled publication are deferred. A single working copy per entity avoids branching and merge complexity.

## Admin Information Architecture

The sidebar is grouped exactly as approved:

- **Dashboard**: Ringkasan.
- **Website**: Beranda, Profil, Program, Guru & Staf, Galeri, Testimoni, Kontak, PPDB, Navigasi & Footer.
- **Media**: Media Library.
- **Pengaturan**: Identitas Sekolah and installation configuration.
- **Pengguna**: users and access, Super Admin only.

| Sidebar | Route | Notes |
| --- | --- | --- |
| Ringkasan | `/admin` | Counts, recent changes, unpublished indicators |
| Identitas Sekolah | `/admin/settings/school` | Tenant settings, technical fields restricted |
| Beranda | `/admin/content/homepage` | Singleton working copy and preview |
| Profil | `/admin/content/profile` | Singleton structured content |
| Program | `/admin/programs` | List, filter, order, archive |
| Program detail | `/admin/programs/[id]` | Edit and preview one program |
| Guru & Staf | `/admin/teachers` | List, order, visibility |
| Galeri | `/admin/galleries` | Album list |
| Album detail | `/admin/galleries/[id]` | Ordered media and captions |
| Testimoni | `/admin/testimonials` | Consent and visibility |
| Kontak | `/admin/content/contact` | Singleton contact presentation |
| PPDB | `/admin/content/ppdb` | Display/configuration only |
| Navigasi & Footer | `/admin/content/navigation` | Configurable menus, columns, links, CTAs, social/contact references |
| Media | `/admin/media` | Search, upload lifecycle, usage |
| Pengguna & Akses | `/admin/access` | Super Admin only within this installation |

Each page uses a consistent breadcrumb, active sidebar item, unsaved-change guard, `Draft`/`Published`/`Archived` badge, last-updated metadata, Preview action, and Publish action. School Admin is approved to publish within the installation. Mobile uses a drawer; tables progressively become cards. Preview opens the public presentation in a new tab with an authenticated, short-lived preview context.

## Public Login Entry

- Add a discreet `Masuk` link to desktop navbar and mobile menu.
- Destination is `/admin/login` for anonymous users and `/admin` for authenticated users.
- Do not expose role, email, or administrative state in public markup.
- Do not add the link to the footer initially; navbar placement is sufficient. A school may later configure a footer login link through safe system-link configuration.
- Public page styling remains subordinate to PPDB and other visitor CTAs.

## Module Layout

```text
app/
  admin/(cms)/...
  api/v1/...
components/
  shared/       # design-system primitives usable by public and admin
  public/       # public-only presentation
  admin/        # authenticated CMS UI
modules/
  cms-core/     # publishing, audit coordination, shared policies
  media/
  homepage/
  profile/
  programs/
  teachers/
  galleries/
  testimonials/
  contact/
  ppdb-content/
  navigation/
  configuration/ # installation-owned taxonomies, channels, CTAs, icon keys
lib/
  auth/
  media/
  public-content/
```

Admin modules never import public components that contain fallback data. Public resolvers may consume published DTOs from modules, never admin forms or database models directly.

## Configuration-First Model

- `ContactChannel` supports arbitrary channel type, label, value/URL, icon key, order, and visibility.
- `SocialLink` supports arbitrary networks without adding columns.
- `CallToAction` is a reusable configurable entity referenced by hero, PPDB, footer, and custom sections.
- `HomepageSection` is an ordered School collection with `typeCode`, enabled state, and validated configuration. Initial type codes map to known renderers; data is flexible but arbitrary executable components are forbidden.
- `TaxonomyTerm` supplies School-specific categories for programs, galleries, testimonials, and future bounded lists.
- `FooterColumn` and `FooterLink` allow modular columns and quick links.
- `NavigationItem` supports configurable locations and ordering without a schema enum for each future placement.
- Program levels/kinds are installation configuration, not PAUD/TK-specific enums.

Configuration collections use UUID, `schoolId`, stable `code`, display label, optional safe `iconKey`, order, visibility, timestamps, and audit metadata. Codes are unique per School and namespace.

## Content Workflow

```text
Admin form -> Zod draft validation -> service authorization
           -> optimistic update + audit -> working copy
           -> authenticated preview resolver
           -> publish validation -> publication snapshot + audit (transaction)
           -> cache invalidation -> public resolver -> existing public component
```

## Status and Lifecycle

- `DRAFT`: never published or has unpublished working-copy changes.
- `PUBLISHED`: working copy matches the current publication.
- `ARCHIVED`: hidden from public reads; retained for audit.
- `DELETED`: not a public status. Hard delete is a restricted command only for never-published, unreferenced records.

No scheduled state in the initial release. `hasUnpublishedChanges` is derived by comparing entity `updatedAt` with publication `sourceUpdatedAt`.

## Ordering and Slugs

- Ordering uses integer `sortOrder`; reorder commands submit the full ordered UUID list and an expected collection version.
- Slugs are lowercase kebab-case, unique by `(schoolId, slug)` for the entity type.
- Published URL changes require an explicit warning. Redirect history is deferred; therefore changing a published slug remains Super Admin-only initially.

## Installation Resolution and Isolation

1. One installation provisions exactly one active School root in its database during the initial product phase.
2. Authentication and authorization apply only to users of that installation; there is no school selector or cross-school session.
3. Services resolve the installation School server-side and retain `schoolId` in domain operations; ordinary payloads cannot change it.
4. Database, storage, domain, environment variables, secrets, sessions, media, backups, and logs are installation-isolated.
5. There is no shared-database routing, tenant switcher, centralized identity directory, control plane, billing tenancy, or cross-school analytics in this phase.

## Repository, Release, and Provisioning Model

- One canonical repository, product mainline, Prisma schema, migration history, test suite, documentation set, and release versioning.
- No `/apps/school-a` copies, school-specific permanent branches, schema forks, or duplicated feature modules.
- New-school activation: provision runtime → database/storage → environment/domain → run migrations → create admin → initialize School → configure branding/content → verify → deploy.
- Product updates are developed/tested once and applied installation by installation using the same ordered migration history.
- Upgrade procedures must preserve users, School data, media references, configuration, publications, and audit logs.
- Centralized mass-deployment automation may be added later, but is not designed or implemented now.

## Cache and Consistency

- Publish invalidates only affected tags/routes using Next.js cache primitives supported by the installed version.
- Preview and admin reads are dynamic/no-store.
- Public fallback remains deterministic if database content is absent or temporarily unavailable.
- Publication and audit log writes occur in one PostgreSQL transaction.

## Responsive and Accessibility

- Sidebar collapses below desktop; primary actions remain reachable without horizontal scrolling.
- Form labels, validation summaries, keyboard ordering, focus visibility, status announcements, and destructive confirmations are mandatory.
- Media controls require text labels and thumbnails with meaningful alt text.

## Operational Boundaries

- No production database or object storage is provisioned in Sprint 5.1.
- No new dependency is approved.
- Existing public UI working-tree changes are preserved and excluded from this documentation scope.
