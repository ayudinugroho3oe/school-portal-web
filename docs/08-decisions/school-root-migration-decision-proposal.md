# School Root Migration Decision Proposal

Title: School Root Migration Decision Proposal
Version: 0.1
Status: APPROVED
Implementation Authority: ALLOWED FOR SPRINT 5.2.1
Owner: Product Owner
Date: 2026-07-20
Decision Scope: Sprint 5.2 additive migration path from `SchoolSettings` and `PRIMARY_SCHOOL` to the single-School installation root

## Purpose

This proposal presents two migration paths for Product Owner review. It does not authorize a Prisma schema change, migration, seed, backfill, compatibility bridge, route, API, or source-code implementation.

Both options preserve the approved initial operating model:

- one product core with one canonical schema and migration history;
- multiple independent installations;
- one School per installation, database, storage, domain, environment, and authentication boundary;
- UUIDs for primary entities;
- no `SchoolMembership`, tenant selector, shared-database tenant routing, or global cross-school account;
- additive migration and continued public fallback compatibility;
- bootstrap and backfill operations must be idempotent and must never overwrite administrator-managed data.

## Current State

The current `SchoolSettings` record combines:

- stable technical identity such as UUID, `key`, `schoolCode`, `schoolName`, active status, timezone, and locale;
- editable public profile, contact, branding, operational, PPDB, announcement, and footer content;
- the compatibility key `PRIMARY_SCHOOL`;
- the current direct relation used by `AuditLog`.

Sprint 5.2 needs a stable School owner for new CMS records and `schoolId` foreign keys. Selecting that owner now affects every later CMS entity and the cost of future migration.

## Option A — Retain `SchoolSettings` as the Physical School Root

Keep the existing `SchoolSettings` row and UUID as the physical School root during Sprint 5.2. New CMS entities reference `SchoolSettings.id` through `schoolId`. `PRIMARY_SCHOOL` remains the single-installation lookup key. The model may be presented as School at the domain/service boundary while the database table remains `school_settings`.

Existing public fields remain in place. Typed profile and configuration records may be introduced incrementally in later milestones, with compatibility reads from the current columns until each public domain is migrated.

### Advantages

- Lowest immediate migration and rollback risk.
- Preserves the existing UUID, API behavior, bootstrap, public resolver, and audit relationship.
- Avoids copying technical identity during the CMS foundation milestone.
- Follows the additive and backward-compatible migration requirement.
- Smallest operational change for the pilot installation.

### Disadvantages

- Continues mixing technical School identity with mutable website settings.
- The physical name `SchoolSettings` does not clearly express its role as the aggregate root.
- New foreign keys become coupled to a compatibility-era table.
- A later separation may require moving or retargeting many foreign keys after more CMS tables exist.
- `PRIMARY_SCHOOL` remains part of runtime lookup longer than the Constitution's intended temporary bridge.

### Risks

- Compatibility structure may become permanent through inertia.
- Later migration becomes broader and more expensive as CMS entities accumulate.
- Developers may continue adding unrelated mutable fields to the root record.
- Domain documentation and physical schema remain semantically misaligned.

## Option B — Add a Dedicated `School` Root and Preserve `SchoolSettings` as a Compatibility Record

Add a dedicated `School` table with a UUID primary key and only stable installation-level fields required by the approved domain, including school code, display/name identity required for installation, active status, timezone, locale, and timestamps. New CMS entities reference `School.id` through `schoolId`.

Add an explicit one-to-one relationship from the existing `SchoolSettings` record to `School`. The additive backfill creates exactly one School from the existing `PRIMARY_SCHOOL` record, preserves the existing SchoolSettings UUID and data, and links it to the new root. Existing APIs and public resolvers continue reading `SchoolSettings` during the compatibility period. No current column or table is dropped or renamed in Sprint 5.2.

Provisioning for a new installation creates one School first, then its compatibility/settings record and installation-local Super Admin. Re-running provisioning or backfill must detect the existing records and must not overwrite administrator-managed content.

### Advantages

- Establishes a clear canonical School aggregate root before new CMS foreign keys proliferate.
- Separates stable installation identity from mutable website content and settings.
- Aligns physical data ownership with the approved DDD, ERD, architecture, and Product Constitution.
- Allows later removal of `PRIMARY_SCHOOL` lookup without retargeting every CMS entity.
- Gives new installations a school-neutral provisioning model using the same product release.
- Keeps the transition additive and preserves the current public website and API behavior.

### Disadvantages

- Requires a more carefully reviewed initial migration and backfill.
- Temporarily maintains both `School` and `SchoolSettings` concepts.
- Requires explicit rules for which duplicated identity values are authoritative during transition.
- Requires integration tests for clean installation, upgraded pilot data, idempotent reruns, and rollback/recovery.

### Risks

- Incorrect backfill could create duplicate roots or link the settings record incorrectly.
- Dual-write behavior could cause divergence if technical identity ownership is not defined precisely.
- A premature switch in public resolvers could cause regression.
- Rollback is more involved once new CMS entities reference the new School UUID.

## Recommendation

Recommend **Option B: add a dedicated `School` root with an additive one-to-one compatibility relationship to the existing `SchoolSettings` record**.

This option best satisfies the Product Constitution because it:

- preserves one product core and one canonical migration history;
- creates a school-neutral root suitable for every independent installation;
- prevents pilot-era `SchoolSettings` and `PRIMARY_SCHOOL` semantics from becoming the permanent product model;
- gives all new CMS entities a stable canonical owner from their first migration;
- separates technical identity from public content while preserving backward compatibility;
- avoids a later high-impact foreign-key migration after CMS data volume and entity count increase.

The recommendation is conditional on an additive implementation contract. If approved, the implementation plan must specify and test all of the following before migration execution:

1. No existing `SchoolSettings` field, record, or public fallback is dropped or overwritten in Sprint 5.2.
2. The existing pilot record produces exactly one School and exactly one one-to-one link.
3. The backfill and provisioning command are idempotent.
4. Stable technical fields have one documented source of truth during the transition; mutable CMS content remains outside the new School root.
5. Existing public APIs and resolvers retain their behavior until their separately approved migration milestone.
6. New CMS entities reference the new School UUID.
7. No SchoolMembership or shared-database tenant routing is introduced.
8. Clean-database installation and current-database upgrade paths are both tested against isolated PostgreSQL test databases.
9. Rollback and recovery steps are reviewed before the development migration runs.
10. Existing administrator-managed content, users, sessions, audit data, and public presentation remain intact.

## Decision Required

Product Owner must select one of the following before any Sprint 5.2 schema or migration implementation begins:

- **APPROVE OPTION A** — retain `SchoolSettings` as the physical School root for Sprint 5.2; or
- **APPROVE OPTION B** — add a dedicated School root with an additive compatibility relationship and backfill; or
- **REVISE** — request changes to this proposal.

Until that decision is recorded, migration implementation remains blocked.

## Decision Record

- Status: APPROVED
- Decision: Option B
- Selected option: Add a dedicated School root with an additive SchoolSettings compatibility relationship
- Decision date: 2026-07-20
- Owner: Product Owner
- Approved by: Product Owner
- Implementation authority for migration: ALLOWED FOR SPRINT 5.2.1 ONLY
