# Dynamic Public Content Boundary

Version: 1.1
Status: APPROVED — ALIGNED AFTER SPRINT 5.2.6
Implementation Authority: COMPLETED FOR CURRENT BOUNDARY; FUTURE MIGRATION REQUIRES SPRINT APPROVAL
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

## Media Foundation Checkpoint

- Store metadata and a storage key/URL, never large binaries in PostgreSQL.
- MediaAsset metadata, MIME/size/magic-byte validation, checksums, School ownership, lifecycle, and a local development storage adapter are implemented.
- Media HTTP upload and production object-storage signed operations remain unimplemented.
- Preserve local fallback images when media is null, unavailable, or rejected.
- Storage provider selection and upload implementation require a separate approved sprint.

## Next Roadmap Scope

Sprint 5.3 is Identity, Homepage, Profile, Contact, Navigation, and Footer: add their approved typed working copies, admin editors/APIs, preview boundary, verified backfill, and domain-by-domain public snapshot resolvers with fallback. Do not redesign public pages. Programs/Teachers/Testimonials, Gallery/Media UI, and PPDB content remain assigned to later roadmap milestones.

Sprint 5.2.6 implemented immutable ContentPublication history plus one ContentPublicationHead pointer for Program, Teacher Profile, Gallery Album, and Testimonial. Gallery Album is the publication aggregate root; Gallery Item is embedded working content and has no head.
