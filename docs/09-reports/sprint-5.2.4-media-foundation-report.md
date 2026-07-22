# Sprint 5.2.4 — Media Foundation Report

Version: 1.0
Status: APPROVED — CLOSED
Implementation Authority: COMPLETED FOR SPRINT 5.2.4
Date: 2026-07-20

## Scope and Domain Model

Implemented the reusable, School-scoped MediaAsset foundation only. MediaAsset stores UUID identity, canonical School ownership, provider/key, sanitized display filename, MIME, bytes, optional dimensions/text metadata, SHA-256 checksum, lifecycle, creator, and timestamps. Binary data is never stored in PostgreSQL. `updatedAt` is the optimistic-concurrency token. No Media Library UI, Gallery, publishing, production provider, transformation, or public redesign was added.

Lifecycle supports the approved intent strategy (`PENDING`, `READY`, `FAILED`) and Sprint 5.2.4 minimum (`ACTIVE`, `ARCHIVED`, `FAILED`). The current local application pipeline creates `ACTIVE` only after storage and metadata both succeed.

## Permission Status

The approved matrix provides `cms.media.view|create|edit|archive|delete|manage_media`. These exact permissions are used; no hypothetical `cms.media.read/manage`, wildcard, role shortcut, implicit grant, role, or hierarchy was introduced. School Admin may view/create/edit/archive/manage media; physical deletion remains Super Admin only. Authorization runs before School resolution, validation, storage, or repository access.

## Storage, Pipeline, and Compensation

`MediaStorage` defines upload, delete, exists, metadata, and URL resolution without provider dependencies in domain/application contracts. `LocalMediaStorage` writes only below ignored `public/uploads`, rejects traversal/unsafe and duplicate keys, and returns `/uploads/...` URLs. Keys use `schools/{school UUID}/{year}/{month}/{asset UUID}/original.ext`.

The service authorizes, resolves canonical School, validates input, computes SHA-256, checks School-local duplicates, generates a key, stores bytes, then writes metadata. Storage failure creates no row. Database failure deletes the stored object. Cleanup failure returns safe `UPLOAD_COMPENSATION_FAILED` for operational attention.

## Validation

JPEG, PNG, and WebP up to 8 MiB are allowed. Declared MIME, a single safe extension, magic bytes, non-empty content, traversal, and double extensions are checked. SVG, PDF, HTML/JavaScript, archives, executables, mismatched content, and oversized files are rejected. Filenames are display metadata only.

Without a newly approved dependency, validation uses deterministic header signatures but does not provide malware/polyglot scanning, full image decoding, EXIF stripping, or dimension extraction. These remain production limitations.

## Repository, Migration, and Isolation

Every repository method requires `schoolId`; reads, checksum lookup, create, metadata updates, and archive are scoped. Cross-School IDs resolve as not found. Migration `20260720020000_add_media_foundation` is additive, changes no authentication table, deletes no data, and creates no seed. It adds the enum/table, restrictive School FK, scoped key uniqueness, and status/checksum indexes.

## API Boundary Gap

No media API route was added. The approved API Contract specifies JSON upload-intent plus completion, while this sprint also asks for multipart upload. A direct local multipart endpoint or a precise multipart mapping into intent/completion is not authorized. Per the explicit sprint gate, foundation stops at domain/application/repository until Product Owner selects the wire protocol.

## Testing

Tests cover media validation, local storage lifecycle/key isolation, authorization ordering, upload/storage/database-compensation/duplicate behavior, repository metadata/archive/checksum/uniqueness/cross-School isolation, permissions, and clean/Sprint 4/Sprint 5.2.1/Sprint 5.2.3 migration paths. Final regression results are reported at checkpoint.

## Deferred Scope and Risks

Local filesystem is development-only. Vercel Blob, physical deletion/retention, usage tracking, signed URLs, rate limiting, consent/takedown, malware scanning, transformations, UI, and API implementation are deferred. `createdBy` is retained as UUID metadata without a database FK pending user-retention policy.

## Closure

Sprint 5.2.4 was approved and closed by Product Owner; no implementation was reopened during repository alignment.
