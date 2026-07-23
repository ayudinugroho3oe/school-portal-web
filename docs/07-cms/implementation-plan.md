# Admin CMS Implementation Plan

Version: 0.2
Status: APPROVED
Implementation Authority: ALLOWED
Owner: Product Owner
Date: 2026-07-20

## Gate

This plan does not authorize coding. Each sub-sprint requires Product Owner review, approved scope, migration safety plan, and actual quality-gate execution. Existing public UI working-tree changes must be preserved throughout.

## Recommended Sequence

### Sprint 5.1 — Discovery and Blueprint

- Audit repository and content sources.
- Approve bounded contexts, publishing model, conceptual ERD, API, media strategy, permissions, PRD, and phased plan.
- Apply approved product-first reusable-deployment, configuration-first, School Admin publishing, structured-text, local-storage, Vercel Blob, PPDB-content-only, and sidebar-grouping principles.
- Resolve remaining consent, production environment, and media-retention policies.
- No implementation, schema, migration, dependency, route, commit, push, or deployment.

Exit: all documents become approved and implementation authority is explicitly granted for Sprint 5.2.

### Sprint 5.2 — CMS Foundation

- Add typed CMS entities, ContentPublication, MediaAsset metadata, MediaUsage, and generalized audit relation.
- Establish a clear single-School installation root or approved compatibility bridge from `PRIMARY_SCHOOL`; do not add SchoolMembership or shared-database tenant routing.
- Add configuration collections for contact channels, social links, CTAs, taxonomy terms, homepage sections, navigation, and footer columns/links.
- Create reviewed Prisma migration and idempotent seed/backfill tooling.
- Expand permission codes and service authorization.
- Implement publishing/preview core, concurrency, archive policy, and public snapshot repository.
- Retain `schoolId` in repositories, compound uniqueness, media keys, preview, cache, publication, and audit for domain clarity/portability while resolving one School per installation.
- Document an idempotent installation provisioning flow using the same canonical schema and migration history.
- Add shared admin primitives and responsive sidebar shell.
- Add media provider interface plus local development adapter only.
- Do not migrate all public domains yet.

Quality gates: Prisma validate/generate, empty-test migration, migration from current schema, unit permission/validation/service tests, PostgreSQL integration, API tests, admin shell E2E, existing public regression/build/lint/typecheck.

**Closure:** APPROVED and CLOSED through Sprint 5.2.6. Implemented sub-milestones cover the canonical School root, shared CMS foundation, configuration collections, media foundation, structured content, immutable publication history/head, publishing audit, structured-content CMS APIs, and public snapshot APIs. Preview sessions, full Admin CMS editors, homepage/profile/contact/navigation/footer persistence, media HTTP upload, and public visual resolver migration were not implemented and remain assigned to their relevant later roadmap milestones.

### Sprint 5.3 — Identity, Homepage, Profile, Navigation and Footer

**Sprint 5.3.1 checkpoint:** School Identity and School Profile foundations implemented with singleton working copies, additive backfill migration, Admin CMS editors, CMS/public APIs, and the Sprint 5.2.6 immutable publication lifecycle. Public visual resolver adoption remains intentionally deferred; the static fallback and public UI are unchanged.

- Build admin editors and APIs for public identity, homepage, profile, contact, navigation, and footer.
- Add navbar/mobile `Masuk` link with authenticated destination behavior and approved sidebar groups Dashboard, Website, Media, Pengaturan, and Pengguna.
- Backfill working copies from verified settings/static content.
- Integrate public resolvers domain by domain with fallbacks.
- Add preview and visual regression checks; do not redesign public pages.

Quality gates include draft-not-public, preview authorization, publish propagation, fallback on missing data, static/dynamic visual equivalence, and public route E2E.

### Sprint 5.4 — Programs, Teachers and Testimonials

- Consolidate duplicate program arrays into unrestricted School Program entities with configurable categories rather than PAUD/TK enums.
- Implement CRUD, ordering, publishing, archive, and preview.
- Migrate PAUD/TK A/TK B and enrichment programs after content verification.
- Implement public teacher/staff profiles without HR data.
- Implement testimonials with configurable source taxonomy and consent gate.
- Preserve dynamic routes and existing links.

Quality gates include slug uniqueness, route generation/resolution, ordering, archive behavior, consent validation, permission tests, and existing program interactions.

### Sprint 5.5 — Gallery and Media

- Implement media library UI and validated upload flow.
- Implement GalleryAlbum/GalleryItem CRUD, ordering, captions, alt text, cover selection, preview, and album-level publish/unpublish/archive. Gallery Item remains a working child and is never an independent publication root.
- Keep the approved local adapter for development; add the approved Vercel Blob production adapter only after environment/security provisioning approval.
- Migrate existing gallery metadata without copying placeholder duplicates as distinct real assets unnecessarily.

Quality gates include MIME/magic-byte/size/dimension validation, authorization, upload completion, failed upload, reference-safe deletion, gallery ordering, lightbox/public gallery regression, and mobile behavior.

### Sprint 5.6 — PPDB Content, Integration QA and Production Readiness

- Implement PPDB presentation editor only: status, year, configurable requirements/steps, CTA/contact-channel references, and unrestricted Program choices.
- Do not persist submissions or documents.
- Complete public-domain resolver integration and fallback review.
- Run full accessibility, visual, performance, security, secret, database, object-storage, and deployment-readiness review.
- Produce content-owner runbook and rollback plan.

Quality gates include open/closed rendering, class choices, no applicant persistence, all routes/links, admin/public E2E, migration rehearsal, backup/restore plan, and production environment review.

## Cross-Sprint Definition of Done

- Approved documentation and acceptance criteria.
- No unauthorized public redesign.
- Optimistic concurrency and transaction-safe audit for every mutation.
- Permission matrix covered by tests.
- Installation isolation assumptions and single-School resolution covered by unit, integration, API, and E2E tests.
- Upgrade tests preserve installation-specific data/configuration across the common migration history.
- Configuration collections permit new channels, links, categories, sections, and CTAs without migration.
- No secrets or local artifacts in Git.
- Lint, typecheck, unit, integration, build, and scoped Playwright suites pass actually.
- Empty test database and upgrade migration paths both pass.
- Public fallback and last publication remain safe during failures.
- Documentation and content inventory updated.

## Test Strategy

### Unit and Validation

- Draft vs publish schemas and maximum lengths.
- Slug/URL/WhatsApp normalization and unsafe input rejection.
- Publication DTO allowlisting.
- Status transitions, media readiness, consent, ordering, and delete policy.

### Permission and Service

- Every role/domain/action combination.
- Installation-local roles, School resolution, `schoolId` reference integrity, and object-level authorization.
- Stale update, transactional audit, rollback, and duplicate slug.

### PostgreSQL Integration

- Migrations from empty and current Sprint 4.3 state.
- CRUD, publication snapshot, archive, reorder, media usage, constraints, and audit retention.
- Tests refuse to run outside `arrahmah_sms_test`.

### API

- Envelopes/status codes, malformed JSON, authentication, authorization, validation, 409 conflicts, 422 publish failures, pagination, and rate limits.

### E2E Admin

- Login/logout/protection, responsive sidebar, unsaved warning, save, preview, publish, archive, media lifecycle, keyboard operation, and role visibility.

### E2E Public

- Draft does not leak; publish updates expected content; archive/fallback works; all current routes, links, carousel, galleries, program sliders, and PPDB prototype remain operational.

### Media

- MIME spoofing, oversized file, invalid dimensions, duplicate checksum, interrupted upload, unauthorized completion, replacement, referenced deletion, and alt-text requirements.

## Data Migration Approach

1. Inventory and verify content with school administrator.
2. Add schema without destructive column drops.
3. Backfill working copies idempotently and record source/version.
4. Preview against the existing page.
5. Publish only approved content.
6. Switch resolver to publication with static fallback.
7. Remove static source only after a later explicit cleanup approval.

## Rollback

- Application rollback must remain compatible with additive migrations.
- Publication failure retains the previous snapshot.
- Domain feature flag/resolver switch can return to static fallback.
- Media replacement preserves the former asset until the new publication is verified.

## Risks

| Risk | Mitigation |
| --- | --- |
| CMS scope becomes a generic page builder | Fixed domain forms and structured blocks |
| Draft leaks to public | Separate publication snapshot read model |
| Static content is inaccurate | Administrative verification before publish |
| Public design regression | Incremental resolver integration and visual/E2E checks |
| Media vendor lock-in | Provider abstraction and storage-key identity |
| Child image/testimonial consent gap | Publish validation and explicit policy decision |
| Concurrent admin edits | `updatedAt` optimistic locking and collection version |
| Audit relation cannot cover new entities | Generalize safely in Sprint 5.2 migration design |
| Existing dirty UI files are overwritten | Snapshot/status checks and selective file work |

## Approved Decisions Entering Sprint 5.2

1. One Product Core, Multiple Independent Installations.
2. Configuration over Hardcode for all new designs.
3. Draft → Preview → Publish with immutable ContentPublication history and one current ContentPublicationHead pointer.
4. School Admin may publish within the installation.
5. No rich HTML editor in the pilot.
6. Media binary is never stored in PostgreSQL.
7. Local storage for development and Vercel Blob as production direction.
8. PPDB Sprint 5 manages content only.
9. Sidebar groups are Dashboard, Website, Media, Pengaturan, and Pengguna.

## Remaining Decisions Before Relevant Implementation Gates

1. Confirm child-photo and testimonial consent evidence/takedown policy.
2. Confirm unused-media retention period.
3. **Resolved for Sprint 5.2.1:** Option B adds a dedicated canonical School root and retains SchoolSettings/`PRIMARY_SCHOOL` as an additive compatibility bridge, without SchoolMembership.
4. Approve Vercel Blob environment plan, credentials, region, and budget before production adapter activation.

## Reusable Installation and Upgrade Contract

New school activation uses the same product release:

1. Provision independent runtime, database, storage, environment, domain, and secrets.
2. Run the canonical Prisma migration history.
3. Initialize one School and create installation-local Super Admin.
4. Configure identity, branding, feature visibility, navigation, content, and media.
5. Verify and deploy without source-code customization.

Updates are developed/tested once and released once. Each installation applies the same release and ordered migrations after backup/rehearsal. Upgrade tests must demonstrate that School data, users, media, branding, configuration, publications, and audit logs remain intact.

Explicitly excluded from Sprint 5.2: shared-database multi-tenancy, tenant switcher, centralized identity, organization selector, cross-school session, control plane, billing, fleet analytics, mass deployment automation, and school-specific repositories/branches/app copies.
