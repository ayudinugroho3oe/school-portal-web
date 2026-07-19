# Dynamic Public Content Boundary

Version: 1.0
Status: APPROVED BY PRODUCT OWNER REVISION
Date: 2026-07-19

## Technical Identity

The bootstrap-owned, stable identity is limited to `id`, singleton `key = PRIMARY_SCHOOL`, immutable `schoolCode`, `schoolName`, `isActive`, timestamps, and actor metadata. Bootstrap creates missing identity once and never overwrites admin-managed content.

## Dynamic School Settings

Nullable, admin-managed settings include principal name/photo/welcome, WhatsApp, email, address, logo variants, favicon, hero/building images, motto, history, vision, mission, school values, operating hours, academic-year label, social links, Google Maps URL, contact/footer/PPDB content, and public announcements. Media fields store file paths or URLs only; binary payloads are not stored in PostgreSQL.

## Current Public Runtime Mapping

Navbar, footer, floating WhatsApp, and homepage hero resolve current School Settings from PostgreSQL. A local fallback preserves the approved public design and existing content when the database or a field is unavailable. Dynamic external images remain replaceable references; upload storage is intentionally not implemented in Sprint 4.3.

## Static Content Still Requiring CMS Migration

| Surface | Current source | Future CMS aggregate |
| --- | --- | --- |
| Profil narrative, principal welcome, vision/mission/values | `app/profil/page.tsx` | ProfileContent |
| Program descriptions and media | `data/programs.ts`, `data/school-programs.ts`, program components | ProgramContent + MediaAsset |
| Gallery albums and photos | gallery data/components | GalleryAlbum + MediaAsset |
| Teacher records and photos | `app/guru/page.tsx` and related data | TeacherProfile + MediaAsset |
| Contact details, map, operating hours | contact/footer/config components | ContactContent |
| PPDB copy, schedule, announcements | PPDB pages/components | PpdbContent + Announcement |
| Homepage testimonials and supporting copy | homepage components | PageSectionContent |

## Media Contract for the Next CMS Sprint

- Store metadata and a storage key/URL, never large binaries in PostgreSQL.
- Define MIME allowlist, maximum size, dimensions/aspect-ratio policy, checksum, alt text, ownership, visibility, and lifecycle status.
- Upload requires authenticated, authorized, rate-limited server endpoints and object-storage signed operations.
- Preserve local fallback images when media is null, unavailable, or rejected.
- Storage provider selection and upload implementation require a separate approved sprint.

## Next Recommended Scope

Build an Admin CMS module with typed aggregates for media assets, profile, programs, galleries, teachers, contact/PPDB content, announcements, draft/published states, granular permissions, audit events, and an object-storage adapter. Migrate static content incrementally with visual regression checks; do not redesign public pages.
