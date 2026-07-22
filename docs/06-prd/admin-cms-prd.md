# Admin CMS Product Requirements Document

Version: 0.1
Status: APPROVED
Implementation Authority: ALLOWED
Owner: Product Owner
Date: 2026-07-20

## Product Goal

Enable TK Islam Ar Rahmah 48 administrators to safely update public website content without source-code changes while maintaining the existing public design, security foundation, and fallback behavior.

TK Islam Ar Rahmah 48 is the pilot installation. The product must support many schools through repeated independent installations without source-code changes. Each installation serves one School with separate database, storage, domain, environment, authentication, users, and configuration. School-specific channels, social networks, sections, menus, CTAs, categories, footer columns, links, labels, and ordering are configuration collections rather than fixed fields or closed school-specific enums.

## Approved Product Principles

- Configuration over Hardcode.
- Every CMS entity retains `schoolId` for domain clarity and portability, while each initial installation contains one School.
- School Admin may publish within the installation.
- Draft → Preview → Publish is mandatory.
- Rich HTML editor is not used in the pilot.
- PostgreSQL stores media metadata, never binary.
- Development uses local storage; production targets Vercel Blob.
- Sprint 5 PPDB manages content only.
- Sidebar groups: Dashboard, Website, Media, Pengaturan, Pengguna.

## Users

- **Super Admin**: full CMS, user/access management, technical identity, publish/archive/delete.
- **Admin Sekolah**: content, media, preview, and direct publishing within the installation; no security or user-management authority.
- **Public visitor**: sees only published content or approved static fallback.
- **Guru**: future role; no CMS access in this sprint.

## Success Criteria

1. Admin can save incomplete work without exposing it publicly.
2. Admin can preview and explicitly publish complete content.
3. Public pages retain their current visual structure and routes.
4. Media is replaceable through metadata/storage references, not source-code edits.
5. Unauthorized users cannot read drafts or mutate CMS content.
6. Every material change and publication is auditable.
7. Concurrent edits cannot silently overwrite each other.

## Functional Requirements

### CMS-001 Authentication

All admin pages and `/api/v1/cms/*` endpoints require a valid Better Auth session. Anonymous users are redirected to `/admin/login` for pages and receive 401 for APIs.

### CMS-002 Admin Navigation

Group navigation as Dashboard (Ringkasan), Website (Beranda, Profil, Program, Guru & Staf, Galeri, Testimoni, Kontak, PPDB, Navigasi & Footer), Media, Pengaturan (Identitas Sekolah and installation configuration), and Pengguna (Super Admin-only users/access).

### CMS-003 Publishing

Each content domain supports save working copy, preview, publish, and archive where applicable. Public readers must never consume a partially edited working copy.

### CMS-004 School Identity

Manage public school identity and contact presentation. Contact methods and social networks are ordered extensible collections. Stable identifiers and security settings remain Super Admin-controlled and separate from ordinary content publishing.

### CMS-005 Homepage

Manage an ordered collection of enabled/disabled Homepage Sections. Initial types include Hero, Statistics, Programs, Testimonials, Gallery, PPDB, and constrained Custom Section. Each section references reusable CTAs/media/content and validated configuration without changing page layout or requiring migration for new section instances.

### CMS-006 Profile

Manage short profile, history, vision, mission, values, principal identity/photo, and welcome message using structured text fields.

### CMS-007 Programs

Create, edit, categorize, order, preview, publish, and archive any School program, including Daycare, PAUD, TK, SD, SMP, SMA, Boarding, Course, and Extracurricular variants. Program categories are School-managed taxonomy records. Slugs are School-unique and published slug changes require an explicit warning/restricted permission.

### CMS-008 Teachers

Manage public teacher/staff presentation only. Do not collect sensitive HR information.

### CMS-009 Gallery

Manage an unrestricted album collection with configurable categories, covers, ordered images, dates, captions, alt text, preview, publish, and archive.

### CMS-010 Testimonials

Manage testimonial content, optional portrait, and configurable source category such as parent, alumni, teacher, partner, foundation, or community leader. Publication requires recorded consent confirmation.

### CMS-011 Contact

Manage public address, arbitrary ordered ContactChannel and SocialLink collections, maps URL, and operating hours. Adding a new channel/network does not require migration. Contact-form transport remains unchanged until separately approved.

### CMS-012 PPDB Content

Manage open/closed status, academic year, copy, configurable requirement/step collections, reusable CTA/contact-channel references, and available Program references. Do not store or manage applicant submissions.

### CMS-013 Navigation and Footer

Manage navigation labels, icon keys, allowed destinations, locations, ordering, and visibility. Footer uses configurable columns and ordered links/references. Reusable CallToAction records may be added without migration. System login CTA remains safe and fixed to admin routes.

### CMS-014 Media

Upload through a provider abstraction, validate file metadata, require alt text, track usage, replace safely, and block deletion while referenced.

### CMS-015 Public Login Link

Show a low-emphasis `Masuk` link in desktop navbar and mobile menu. Anonymous destination is `/admin/login`; authenticated destination is `/admin`. Footer duplication is not required initially but may be enabled later through a safe system-link configuration.

## Publishing Requirements

- Model: Draft → Preview → Publish.
- One working copy and one current publication snapshot per entity.
- No scheduled publishing or complete version-history UI.
- Publication is atomic with audit creation.
- Archive is reversible; hard delete is limited to unreferenced, never-published drafts.
- `hasUnpublishedChanges` is visible in list and edit views.

## Content Validation Limits

| Field | Limit/rule |
| --- | --- |
| Short labels/navigation | 40 characters |
| Titles/names | 120–150 depending on domain |
| Summary | 300 characters |
| CTA label | 40 characters |
| Long description | 10,000 characters |
| Testimonial | 2,000 characters |
| Principal welcome | 5,000 characters |
| Slug | 2–120, lowercase kebab-case |
| Email | valid, ≤254 |
| WhatsApp | 10–15 digits, normalized to country format |
| URL | HTTPS or approved local path; no unsafe protocols |
| Repeatable lists | maximum 30 items unless gallery |
| Gallery | 1–100 items per published album |

No arbitrary HTML or script is accepted. Pilot content uses plain text and validated structured arrays.

## Media Requirements

- JPEG, PNG, WebP; ICO/PNG for favicon. SVG uploads deferred.
- Maximum: favicon 512 KB, logo 2 MB, portrait 5 MB, hero/program/gallery 8 MB.
- Recommended: hero 1600×1000, program/gallery 1200×800, portrait 800×1000, logo ≥512×512 transparent where suitable.
- Meaningful alt text required before publication, except explicitly decorative assets.
- Database stores metadata/reference only.

## Non-Functional Requirements

- Responsive at 360, 390, 430, 768, 1024, 1280, and 1440 px.
- Keyboard-operable forms, dialogs, media controls, and navigation.
- Visible focus, accessible validation summary, and polite save/publish announcements.
- Public route performance must not materially regress; image dimensions prevent layout shift.
- Public fallback remains available throughout incremental migration.
- All CMS writes are rate-limited, authorized, validated, concurrency-protected, and audited.

## Acceptance Criteria

- **CMS-AC-001** Anonymous CMS access is denied.
- **CMS-AC-002** Role matrix is enforced in UI and service layer.
- **CMS-AC-003** Saving a draft does not alter public output.
- **CMS-AC-004** Preview displays the working copy only to authorized users.
- **CMS-AC-005** Publish atomically changes the relevant public DTO and audit log.
- **CMS-AC-006** Failed publication preserves the previous public snapshot.
- **CMS-AC-007** Stale writes return HTTP 409.
- **CMS-AC-008** Unsafe URLs/HTML and invalid slugs are rejected.
- **CMS-AC-009** Invalid or oversized media is rejected before readiness.
- **CMS-AC-010** Referenced media cannot be deleted.
- **CMS-AC-011** Public pages remain visually and behaviorally equivalent except approved content changes and the `Masuk` link.
- **CMS-AC-012** Static fallback is used while a domain has no valid publication.
- **CMS-AC-013** PPDB CMS contains no applicant transaction or personal submission storage.
- **CMS-AC-014** Program/gallery ordering is deterministic.
- **CMS-AC-015** Audit payloads contain no credentials or signed upload secrets.
- **CMS-AC-016** Mobile admin does not horizontally overflow.
- **CMS-AC-017** Every content/query/mutation/publication/media record is associated with the installation School through `schoolId`.
- **CMS-AC-018** A new social link, contact channel, CTA, menu item, footer column/link, homepage section instance, program category, gallery category, or testimonial source can be added without schema migration.
- **CMS-AC-019** One installation cannot access another installation's database, storage, sessions, secrets, or content.

## Product and Deployment KPI

- A second school can be activated without rebuilding or forking the application.
- No school-specific source customization, schema, permanent branch, repository, or duplicated module.
- Onboarding is primarily provisioning plus configuration/content entry.
- Product features and fixes are implemented once in the canonical core.
- Every installation can follow the same product release and migration history.
- Product updates preserve installation-specific users, data, media, branding, configuration, publications, and audit history.

## Metrics for Pilot

- Content update can be completed without developer intervention.
- No draft exposure incidents.
- No unauthorized mutation in permission tests.
- Publish-to-public propagation within an agreed cache window (target ≤10 seconds locally/pilot).
- Zero regressions in existing public route E2E suite.

## Out of Scope

Applicant transactions, student/parent data, attendance, assessment, payment, pickup, notifications, parent/teacher portals, full DAM features, image editing, scheduled publishing, approval chains, and full version restoration.

## Remaining Dependencies and Decisions

- Vercel Blob is approved as direction; plan, region, budget, credentials, and deployment security still require environment approval.
- Production database and secret-management plan before deployment.
- Consent evidence and takedown policy confirmation for testimonials and identifiable child photos.
- Unused-media retention duration.
