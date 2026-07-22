# Sprint 5.2.5 — Structured Content Domain Report

Version: 1.0
Status: APPROVED — CLOSED
Implementation Authority: COMPLETED FOR SPRINT 5.2.5
Date: 2026-07-20

## Scope

Implemented reusable School-scoped foundations for Program, Teacher Profile, Gallery Album/Item, and Testimonial. No UI, publishing, upload, public integration, taxonomy, page builder, or next-sprint work was added.

## Domain and Persistence

All entities use UUID, canonical `schoolId`, deterministic `sortOrder`, explicit `isActive`, timestamps, and `updatedAt` concurrency. Program has School-unique code/slug and structured text fields. Teacher Profile remains public content independent of authentication. Gallery Item is unique by album/media and retains its own School boundary. Testimonial uses bounded plain structured text. Media references are UUID FKs without copied provider metadata.

## Authorization and Tenant Isolation

Only approved `cms.program.*`, `cms.teacher.*`, `cms.gallery.*`, and `cms.testimonial.*` permissions are used. School Admin receives approved view/create/edit/archive/reorder operations; eligible hard delete remains Super Admin-only. Staff/Teacher receive no grants. Authorization executes before School resolution, relation validation, or repository access. Every repository operation requires `schoolId`; client-supplied School context is not part of service inputs.

## Validation and Media Policy

Zod schemas enforce safe slugs/codes, explicit lengths, UUIDs, nonnegative ordering, concurrency tokens, and strict-object mass-assignment rejection. Script/iframe/object/embed/style and script-like URL content are rejected; no rich HTML sanitizer/editor was introduced. Media references are resolved through the existing scoped Media repository and only `ACTIVE` or `READY` assets are usable. Missing, cross-School, `ARCHIVED`, and `FAILED` media are rejected.

## Repository and Transactions

Concrete Prisma repositories provide scoped list/read/create/update/activation/reorder. Updates match UUID, School, and `updatedAt`; zero rows distinguish not-found from stale writes. Reorder validates the complete collection and latest collection token inside a Prisma transaction. Gallery Item duplicate media in one album maps to a safe conflict.

## Migration

`20260720030000_add_structured_content_domain` is additive. It creates five tables, scoped uniqueness/indexes, canonical School FKs, and MediaAsset FKs. Authentication, existing CMS data, and public source code are not migrated or deleted. No pilot-specific seed exists.

## API Contract Gap

No structured-content API routes were added in this milestone. The approved Program wire contract requires `name`, taxonomy/category UUID, structured lists, draft/publish/archive/delete semantics, while the authorized Sprint domain requires `code`, `title`, active state, and explicitly excludes Publishing Engine and taxonomy. Teacher/Testimonial routes are described as a standard publishing pattern and Gallery includes publish/delete semantics not authorized for this foundation. Implementing partial or reinterpreted payloads would create a parallel contract. Per the explicit API-gap rule, implementation stops at domain/application/repository until Product Owner approves a non-publishing working-copy CRUD contract or aligns field names.

## Testing

Tests cover valid/invalid payloads, unsafe content, boundaries, permissions, authorization ordering, media lifecycle/School ownership, repository scoped CRUD, uniqueness across Schools, duplicate Gallery Items, optimistic conflicts, transaction reorder, relational integrity, and migration from clean/Sprint 4/Sprint 5.2.1/Sprint 5.2.3/Sprint 5.2.4 baselines. Final regression results are reported in the checkpoint.

## Risks and Deferred Scope

- API payload/route semantics require Product Owner alignment.
- Physical delete and archive lifecycle policy remain tied to future publishing/usage tracking.
- Public pages still use existing fallback/static sources by design.
- Admin UI, publication snapshots, taxonomy, audit generalization, import, and cache invalidation remain deferred.

These statements record the historical Sprint 5.2.5 checkpoint. Sprint 5.2.6 subsequently aligned the working-copy API and implemented immutable publication history/head plus publication audit; Admin UI, preview, taxonomy, import, and cache integration remain deferred.

## Closure

Sprint 5.2.5 was approved and closed by Product Owner.
