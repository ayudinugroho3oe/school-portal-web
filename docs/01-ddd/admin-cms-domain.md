# Admin CMS Domain

Version: 0.2
Status: APPROVED
Implementation Authority: ALLOWED
Owner: Product Owner
Date: 2026-07-20

## Purpose and Boundary

The Admin CMS belongs to one canonical software product that can be installed repeatedly for many schools. TK Islam Ar Rahmah 48 is the first installation and pilot, not a separate product fork. In the initial deployment model, one installation serves one School with its own database, domain, storage, environment, authentication boundary, configuration, and users. Every content aggregate retains `schoolId` for domain clarity, testability, portability, and future compatibility, but the design does not require multiple schools in one database/runtime. The CMS does not own student admissions transactions, student/parent records, attendance, assessment, payment, pickup, notification, parent portal, or teacher portal.

The public website remains a separate presentation boundary. CMS publication may change content, but must not change the approved public layout or behavior unintentionally.

## Ubiquitous Language

- **Working copy**: the latest admin-edited typed entity; it is not automatically public.
- **Publication**: one immutable, versioned public snapshot in the retained history of a CMS aggregate.
- **Publication head**: the single School-scoped pointer identifying which immutable snapshot is currently public.
- **Publish**: atomically validate a working copy, append a new immutable snapshot, and move its publication head.
- **Republish**: publish a changed working copy as a new immutable version without altering earlier snapshots.
- **Unpublish**: remove the publication head and return the working copy to `DRAFT` without deleting publication history.
- **Archive**: mark a working aggregate unavailable for ordinary publication until restored; it is distinct from unpublish.
- **Media asset**: metadata and a storage reference; never image binary stored in PostgreSQL.
- **Technical identity**: stable school identifiers and security-sensitive configuration.
- **Public content**: editable copy and media displayed on the public website.
- **Preview**: authenticated rendering of a working copy without changing public content.
- **Configuration collection**: ordered School-owned records that let an installation add new types or entries without a schema migration.
- **Installation**: one independently deployed copy of the canonical product release serving one School with isolated database, storage, domain, environment, authentication, configuration, and data.
- **Product core**: shared source code, schema, migrations, modules, API, validation, tests, and release history used by every installation.

## Product Principles

- Configuration over hardcode: lists, types, labels, sections, CTAs, links, icons, categories, branding, and feature visibility are installation data.
- Reusable deployment: a new school is provisioned from the same product release without repository, branch, schema, or source-code customization.
- Installation isolation: one School per initial database/runtime/auth boundary. `schoolId` remains mandatory for domain clarity and portability, not shared-database tenant routing.
- Extensibility without schema churn: a new social network, contact method, menu, program category, testimonial source, album category, or homepage section configuration does not require migration.
- Reusable system behavior with school-specific content and ordering.
- Simple admin forms and known section renderers rather than a generic visual page builder.

## Bounded Contexts

### 1. School Identity

Owns one non-deletable working copy per School for editable public identity: `schoolName`, `shortName`, `tagline`, logo variants, and favicon. Contact methods remain ordered `ContactChannel` records; principal content belongs to School Profile. `schoolCode`, school ID, active status, timezone, and locale remain controlled technical identity outside this public content aggregate.

### 2. Homepage Content

Owns an ordered collection of `HomepageSection` records. Each section has a configurable type code, title/label, enabled state, order, appearance-safe configuration payload, and references to typed content such as Program, Testimonial, GalleryAlbum, MediaAsset, CTA, or PPDB content. Initial renderer types are Hero, Statistics, Programs, Testimonials, Gallery, PPDB, and constrained Custom Section; schools may enable, disable, reorder, and configure them without changing schema. New renderer behavior still requires reviewed code, but new instances and content do not.

### 3. Profile Content

Owns one non-deletable working copy per School containing summary, history, vision, mission, principal name/greeting/photo, and structured values. Long content uses structured plain text and repeatable values, not arbitrary HTML. Vision and mission are mandatory for the Sprint 5.3.1 editor and publication.

### 4. Academic Programs

Owns an unrestricted program collection: title, slug, summary, description, objectives, activities, benefits, frequency text, configurable category reference, media, ordering, featured flag, and visibility. PAUD, TK A, TK B, Daycare, SD, SMP, SMA, Boarding, Course, and Extracurricular are installation configuration rather than database enums. A school can add categories and programs without migration.

### 5. Teachers and Staff

Owns public staff profiles: name, position, education/short description, portrait, ordering, active status, and public visibility. It is not an HR or employment domain.

### 6. Gallery

Owns unrestricted albums and ordered gallery items: slug, title, description, event date, configurable category reference, cover, photos, captions, alt text, and public state. Album/category counts are not fixed. Gallery does not own the binary file lifecycle; it references MediaAsset.

### 7. Testimonials

Owns testimonial name, configurable source/category reference, relationship label, message, optional portrait, ordering, and visibility. Sources may include parents, alumni, teachers, partners, foundations, or community leaders without schema changes. Consent confirmation is mandatory metadata before publication.

### 8. Contact and Social Media

Owns address presentation, map link, operating-hours configuration, ordered `ContactChannel` records, and ordered `SocialLink` records. Channel `type`, label, value/URL, icon key, order, and visibility are data. Contact form delivery is outside this content context; the current `mailto` behavior remains until separately approved.

### 9. PPDB Content

Owns only public presentation/configuration: open/closed status, academic year, title, description, configurable requirement/step collections, CTA references, contact-channel references, and available Program references. It explicitly does not persist registration submissions or applicant data.

### 10. Navigation and Footer

Owns ordered public menu items with configurable label, target, icon key, location, visibility, and external behavior. Footer owns ordered `FooterColumn` records containing ordered `FooterLink` references plus configurable contact/social/CTA blocks, copy, and copyright. Columns, quick links, CTA instances, and social/contact references may grow without schema changes. Route safety rules prevent admin-only or unsafe destinations from being published as ordinary public navigation.

### 11. Media Library

Owns media metadata, storage provider/key, URL resolution, MIME type, size, dimensions, checksum, alt text, ownership, lifecycle, and usage references. Storage implementation is behind a provider interface.

### 12. Publishing and Audit

Coordinates preview, validation, immutable publication snapshots, current publication heads, unpublish, archival, optimistic concurrency, and audit events across CMS contexts. It retains history but does not provide a full historical restoration UI in the pilot.

## Aggregate Rules

- Every aggregate uses UUID, mandatory `schoolId`, `createdAt`, `updatedAt`, and `updatedByUserId`.
- Mutable commands require `expectedUpdatedAt`.
- Public list entities use unique slug per school and explicit integer ordering.
- A working copy may be incomplete; publication must pass the full publish schema.
- Public reads use only the snapshot referenced by `ContentPublicationHead` and never an unpublished working copy.
- Publish, republish, and unpublish write a `ContentAuditEvent` in the same transaction; other material CMS mutations follow their approved audit contract.
- Hard delete is restricted to never-published, unreferenced content. Published content uses archive/soft delete.
- Media deletion is blocked while referenced by a working copy or publication.
- `schoolId` is explicit in content relations, publications, media, audit, cache tags, and unique constraints even though the initial installation contains one School.
- Database, storage, domain, environment, secrets, auth sessions, and backups are never shared between initial school installations.
- Configuration `type` and `iconKey` values are validated safe strings; business behavior never depends on an unbounded executable value from an admin.

## Domain Events

- `CMS_CONTENT_CREATED`
- `CMS_CONTENT_UPDATED`
- `CMS_CONTENT_PUBLISHED`
- `CMS_CONTENT_ARCHIVED`
- `CMS_CONTENT_DELETED`
- `MEDIA_ASSET_CREATED`
- `MEDIA_ASSET_REPLACED`
- `MEDIA_ASSET_ARCHIVED`
- `NAVIGATION_REORDERED`
- `CMS_PERMISSION_DENIED`

Audit retention remains unlimited. Audit payloads must exclude passwords, session tokens, signed upload credentials, and binary content.

## Publishing Decision

Use a simplified Draft → Preview → Publish model. Typed tables contain the latest working copy. `ContentPublication` appends immutable, monotonically versioned JSON snapshots, while `ContentPublicationHead` stores the one current-public pointer per School/type/entity. Republish inserts history and moves the head. Unpublish deletes the head, returns the working copy to `DRAFT`, and preserves history. There is no full history-restoration UI, scheduled publishing, or multi-stage approval in the pilot.

Independent publication roots implemented in Sprint 5.2.6 are Program, Teacher Profile, Gallery Album, and Testimonial. Gallery Album is the gallery aggregate root: its snapshot embeds active Gallery Items in deterministic order. Gallery Item is a working record and never owns a publication head.

## Repository Checkpoint after Sprint 5.2.6

The canonical School/CMS context, configuration collections, MediaAsset foundation, structured working-copy repositories, immutable publication history/head, publish/republish/unpublish transactions, audit events, CMS structured-content routes, and public snapshot routes are implemented. Preview sessions, Admin CMS editors, homepage/profile/contact/navigation/footer entities, media HTTP upload flow, and public visual resolver migration remain future authorized milestones.

## Invariants

1. `PRIMARY_SCHOOL` exists once and bootstrap never overwrites admin content.
2. Technical identity is not editable by School Admin.
3. A published slug is unique within its content type and school.
4. Archived records cannot appear in public queries.
5. Testimonial publication requires consent confirmation.
6. Media must be `READY`, safe, and owned by the same school before it can be published.
7. PPDB content configuration cannot create or mutate registration records.
8. Public fallback remains available until each static domain is migrated and verified.

## Out of Scope

Applicant workflows, students, parents, attendance, grades, finance, pickup QR, notifications, portals, scheduled publishing, approval chains, localization beyond `id-ID`, complete revision history, and production storage provisioning.

## Approved Product Decisions

- School Admin may publish content within the installation's School.
- Draft → Preview → Publish remains mandatory.
- Pilot content uses structured text; no rich HTML editor.
- PostgreSQL stores media metadata, never binary files.
- Development uses local storage; production targets Vercel Blob.
- Sprint 5 PPDB scope is content configuration only.
- Admin sidebar groups are Dashboard, Website, Media, Pengaturan, and Pengguna.
- Configuration over Hardcode is mandatory for all new design.

## Remaining Policy Decisions

- Confirm testimonial and identifiable-child media consent evidence retention format.
- Confirm unused-media retention duration and takedown workflow.

## Product Release Invariant

School number two is activated by provisioning a new installation, running the same migration history, creating its admin, and entering its branding/configuration/content. It does not receive a copied repository, permanent school branch, schema fork, duplicated module, or custom source code. Product features are developed and tested once, released once, then adopted by installations without overwriting their data or configuration.
