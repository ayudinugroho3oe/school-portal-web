# Sprint 5.2.6 Publishing and API Alignment Report

**Version:** 1.0
**Status:** APPROVED — CLOSED
**Implementation Authority:** COMPLETED FOR SPRINT 5.2.6
**Scope:** Publishing foundation only
**Persistence decision:** Approved immutable history plus publication head

## Approved decisions implemented

- `ContentPublication` retains immutable, versioned snapshot history.
- `ContentPublicationHead` is the only current-public pointer and is unique per School, entity type, and entity ID.
- Republish inserts a new snapshot and atomically moves the head.
- Unpublish deletes the head, returns the working copy to `DRAFT`, and preserves history.
- `GalleryAlbum` is the publication aggregate root. Active, deterministically ordered Gallery Items are embedded in its snapshot; Gallery Item has no independent publication head.
- Independent publication types are `PROGRAM`, `TEACHER_PROFILE`, `GALLERY_ALBUM`, and `TESTIMONIAL`.

## Transaction and validation behavior

Publish and republish validate School ownership, lifecycle, active state, required working fields, usable referenced media, and the `updatedAt` concurrency token before inserting a snapshot. Snapshot insert, head create/move, working-copy transition, and audit event occur in one PostgreSQL transaction.

Unpublish validates ownership, concurrency, and an active head. Head deletion, transition to `DRAFT`, and audit insertion occur in one transaction. Any error rolls back the complete operation.

Snapshots contain only allowlisted public fields and media presentation metadata. They exclude storage keys, actor/session data, audit data, and mutable working-copy joins. Gallery items are ordered by `sortOrder`, then UUID, and only active items are included.

## API alignment

CMS routes are available under `/api/v1/cms/{programs|teachers|galleries|testimonials}` for working-copy list/create/read/update/reorder plus `/{id}/publish`, `/{id}/unpublish`, and `/{id}/publication-status`. Gallery Item mutations remain nested working-copy operations below the album.

Public routes are read-only under `/api/v1/public/{programs|teachers|galleries|testimonials}` and `/{id}`. They resolve the installation School server-side and read only the current publication head. Missing or unpublished content returns the standard API 404 error envelope.

## Migration safety

Migration `20260720040000_add_publishing_foundation` is forward-only, creates lifecycle columns, immutable publication history, current heads, and audit events, and does not reset or drop unrelated data. Rehearsal covers a clean schema and upgrade states through Sprint 5.2.5. Existing Sprint 5.2.5 working content is preserved and initialized as `DRAFT`; no publication is invented.

The development database is intentionally untouched. Migration and integration execution are restricted to `arrahmah_sms_test`.

## Test coverage

- Explicit authorization before School resolution/repository access.
- Publish permission grants and denials.
- Immutable publish/republish history and head movement.
- Cross-School public-read isolation.
- Unpublish history preservation and working-copy transition.
- Gallery aggregate snapshot ordering and active-item filtering.
- Stale concurrency rollback.
- Inactive content and unusable-media rejection without partial persistence.
- Authenticated CMS API lifecycle and unauthenticated public visibility boundaries.

## Quality-gate results

- Prisma format: PASS.
- Prisma validate: PASS.
- Prisma Client generate: PASS.
- TypeScript (`next typegen` plus `tsc --noEmit`): PASS.
- ESLint: PASS.
- Publishing-focused Vitest: 12/12 PASS.
- Full Vitest regression: 145/145 PASS across 25 files.
- Playwright admin, configuration, public routes, and publishing API: 9/9 PASS.
- Next.js 16.2.10 production build: PASS; all 39 static-generation units completed.
- Migration rehearsal: PASS for clean, Sprint 4, Sprint 5.2.1, Sprint 5.2.3, Sprint 5.2.4, Sprint 5.2.5, and ambiguous-data safety states.
- `git diff --check`: recorded at final checkpoint.

## Known boundaries

- No admin UI, upload workflow, preview session, public-page visual switch, or cleanup of static fallback content is included.
- Public website UI files are not modified by Sprint 5.2.6.
- Publication snapshots keep media metadata only; provider URL resolution remains a later approved media concern.
- Development-database migration and deployment were not performed. Approved repository changes were committed and pushed to `main` as `a9661005823fe6d21077f7b2825f5ade4deaec02` during sprint closure.
