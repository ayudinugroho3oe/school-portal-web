# School Root Migration and Recovery Runbook

Version: 0.1
Status: IMPLEMENTED — NEEDS CHECKPOINT REVIEW
Implementation Authority: Sprint 5.2.1 only
Owner: Product Owner
Date: 2026-07-20

## Approved Path

Option B adds `School` as the canonical root for one independent installation. `SchoolSettings` remains an additive one-to-one compatibility record. New CMS services must resolve `School.id`; legacy settings and public resolvers may temporarily retain `PRIMARY_SCHOOL`.

## Preflight

Before applying the migration:

1. Back up the installation database using the approved operational process.
2. Confirm the target is not production unless separately authorized.
3. Confirm the current migration history is healthy.
4. Confirm `school_settings` contains zero or one record.
5. If it contains one record, confirm that record is active and its technical identity is valid.
6. Stop if multiple settings records, an inactive legacy root, or inconsistent migration history is found.

No reset, database deletion, or destructive cleanup is permitted against an existing installation.

## Additive Migration Behavior

1. Abort before mutation when legacy data is ambiguous.
2. Create the `schools` table and canonical indexes.
3. For an existing installation, copy technical identity into exactly one School using the existing SchoolSettings UUID. This makes the mapping deterministic.
4. Add `school_settings.schoolId`, backfill it with the same UUID, make it required and unique, and add a restrictive foreign key.
5. Do not drop, rename, or rewrite existing SchoolSettings content, API fields, audit logs, users, sessions, or public fallback data.
6. For a clean database, leave School creation to the idempotent installation provisioning boundary.

## Provisioning Behavior

- Zero School and zero SchoolSettings: create one active School from validated installation configuration.
- One active School: return it without mutation or duplication.
- One active School with linked SchoolSettings: return it without overwriting settings.
- Multiple active Schools, an inactive-only root, multiple SchoolSettings records, or a mismatched relation: fail safely.
- School code and name come from installation configuration; pilot identity is not a product default.

## Compatibility Bridge

`PRIMARY_SCHOOL` is deprecated and permitted only for unchanged Sprint 4 boundaries. New School-root and CMS code must use the canonical resolver.

During Sprint 5.2.1, `School` owns canonical installation identity: School UUID, school code, installation name, installation active state, timezone, and locale. The similarly named fields retained in SchoolSettings preserve the existing public/admin compatibility contract and are not a second canonical root. They are copied during upgrade/provisioning but are not silently dual-written by legacy settings updates. A later approved content migration must explicitly move each consumer to the appropriate canonical or public-profile field before compatibility columns are retired.

Known remaining code locations at this checkpoint:

- `modules/school-settings/domain/constants.ts`
- `modules/school-settings/application/service.ts`
- `lib/public-school-content.ts`
- `scripts/setup-school.ts` compatibility lookup
- `app/admin/page.tsx` and `app/admin/settings/school/setup/page.tsx` compatibility copy
- existing School Settings and migration tests

## Exit Criteria

The compatibility key may be removed only after:

1. all new resolvers use canonical `School.id`;
2. SchoolSettings uses the official one-to-one relation;
3. every public content resolver has a tested canonical path;
4. active services and provisioning no longer query by the compatibility key;
5. clean migration, upgrade migration, rollback, login, settings, audit, and public regression tests pass;
6. Product Owner separately approves removal.

## Recovery and Rollback

### Before application completion

If the migration fails, Prisma/PostgreSQL transactional migration behavior should leave the migration unapplied. Record the failure without secrets, correct the preflight condition, and retry only after review.

### After successful migration, before new CMS data

Preferred recovery is restoring the verified pre-migration backup. Do not manually drop tables on an installation database.

### After new records reference School

Do not roll back by dropping `schools` or `schoolId`. Restore the coordinated database backup or apply a separately reviewed forward-fix migration. Dropping the root would violate referential integrity and risk CMS data loss.

## Required Verification

- Prisma validate and generate.
- Canonical migrations on an empty isolated test database.
- Upgrade rehearsal from the Sprint 4 migration state.
- Idempotent provisioning with no duplicate root.
- One-to-one School–SchoolSettings relationship.
- Existing login, Super Admin, settings read/update, audit, public data/fallback, build, lint, and typecheck remain valid.
- Repository and output contain no secrets.

## Sprint 5.2.1 Closure

Status: APPROVED AND CLOSED by Product Owner on 2026-07-20.

The development Super Admin credential could not be verified against the existing local account after migration. This is recorded as a **Known Development Limitation**, not an implementation blocker: the migration does not modify authentication tables, and the existing user, role, account, password record, and audit history remained intact. Migration, provisioning, compatibility, test-database authentication, and public regression gates passed. Any future local credential verification or rotation is an operational development backlog item and requires separate authorization; it is not part of Sprint 5.2.1 or Sprint 5.2.2.
