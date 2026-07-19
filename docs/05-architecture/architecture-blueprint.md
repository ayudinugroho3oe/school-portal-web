# Architecture Blueprint

## Document Status

- Version: 1.1
- Status: **APPROVED**
- Document Owner: Product Owner
- Prepared By: Codex based on Product Owner locked decisions
- Approved By: Product Owner
- Approval Date: 2026-07-19
- Implementation Authority: **ALLOWED**

> Sprint 4.3 amendment: public content resolves from PostgreSQL with unchanged static fallback. Media stores references/metadata only; object storage and full CMS aggregates remain a separately approved scope.

## Existing System Baseline

- Next.js App Router, React, TypeScript, and Tailwind CSS.
- Repository currently contains a frozen public website.
- No approved admin module, database, ORM, authentication, authorization, form/validation library, or test framework exists in the current baseline.

## Target Architecture

Use a **modular monolith** in the same Next.js repository. The admin surface remains isolated through route groups/layouts, admin-only components, module boundaries, internal API, and authorization middleware/policies. Microservices and multi-tenancy are out of scope.

## Application Layers

Pragmatic separation inside the School Settings module:

1. Presentation: admin page, form, view states.
2. API boundary: route handlers, envelope, request ID, schema parsing, error mapping.
3. Application: read/update use cases and permission enforcement.
4. Domain: SchoolSettings aggregate rules and normalization-independent invariants.
5. Infrastructure: Prisma repositories, transaction, audit persistence, auth adapter.

Dependencies point inward; domain code does not import Next.js, Prisma, or an auth provider.

## Folder Structure

Target conceptual structure (subject to approval before implementation):

```text
app/
├── (public)/ or existing public routes    # frozen; migration not implied
├── (admin)/
│   └── admin/
│       └── settings/school/
└── api/v1/school-settings/

components/
├── shared/
├── public/
└── admin/
modules/school-settings/
├── domain/
├── application/
├── infrastructure/
└── presentation/

lib/auth/
lib/authorization/
lib/api/
prisma/
```

Component responsibilities:

- `components/shared/`: presentation primitives that are explicitly safe and dependency-neutral for both surfaces; changes require regression review.
- `components/public/`: components owned exclusively by the frozen public website.
- `components/admin/`: components owned exclusively by the authenticated admin area.

Imports must not allow admin-only behavior or styling to leak into public components. This is an architectural target, not authority to move existing public files during School Settings implementation.

## Frontend Architecture

- Route: `/admin/settings/school` under an admin-specific layout.
- Initial setup route: `/admin/settings/school/setup`, restricted to SUPER_ADMIN and usable only before initialization.
- Breadcrumb, title, description, and six form sections.
- React Hook Form manages form state and integrates with the approved Zod schema.
- Client state covers initial loading, populated, not found, global error, saving, saved, dirty, and read-only.
- Field-level errors are associated with accessible labels/descriptions.
- Save is disabled when unchanged and guarded against double submission.
- Unsaved changes warning protects dirty edits.
- STAFF receives read-only rendering; TEACHER cannot access the page.
- Successful setup redirects to `/admin/settings/school`; an initialized installation cannot reuse the setup route.
- Admin styling/components must not modify global styles or public components in ways that affect the frozen site.

## Backend Architecture

- Route handlers: GET and PATCH `/api/v1/school-settings`.
- Initialization route handler: POST `/api/v1/school-settings/initialize`.
- Application use cases: `GetSchoolSettings` and `UpdateSchoolSettings`.
- Repository finds singleton by exact key `PRIMARY_SCHOOL`.
- `InitializeSchoolSettings` creates the singleton once through `npm run setup:school` or an equivalent secure server-side flow.
- PATCH maps only allowlisted fields, validates with Zod, normalizes, checks `expectedUpdatedAt`, updates atomically, and returns refreshed data.
- Successful state change appends AuditLog and updates actor metadata in the same transaction when supported.

The shared School Settings contract contains `id`, `key`, `schoolCode`, `schoolName`, `shortName`, `npsn`, `schoolLevel`, `ownershipStatus`, `foundationName`, `principalName`, `operationalPermitNumber`, `accreditation`, `email`, `phone`, `whatsapp`, `websiteUrl`, `addressLine`, `village`, `district`, `city`, `province`, `postalCode`, `timezone`, `locale`, `academicYearLabel`, `logoUrl`, `logoDarkUrl`, `schoolMotto`, `vision`, `mission`, `createdAt`, `updatedAt`, and `updatedByUserId`. Presentation, application, API, and persistence mappings must derive from this contract without independent field lists.

`schoolCode` is supplied during provisioning, normalized to uppercase, validated against `^[A-Z0-9_-]{2,20}$`, and immutable afterward.

## Database and ORM

- PostgreSQL target.
- Prisma ORM target.
- `SchoolSettings.key` unique with value `PRIMARY_SCHOOL`.
- UUID primary keys, timestamps, nullable fields, and enums follow ERD.
- AuditLog is append-only.
- UUID is used for SchoolSettings, AuditLog, and Better Auth user identities.
- Schema migration creates schema only and never inserts production School Settings data.
- Separate provisioning validates mandatory values and creates exactly one `PRIMARY_SCHOOL` record atomically.

## Authentication

**Better Auth** provides session-based authentication behind an adapter interface that supplies:

```text
getCurrentActor(): actor | unauthenticated
actor.id
actor.roles
actor.permissions
```

Better Auth integration remains infrastructure-facing; domain and application policy do not import provider UI APIs directly.

## Authorization

Central policy evaluates `school_settings.initialize`, `school_settings.read`, and `school_settings.update`.

| Role | Initialize | Read | Update |
| --- | ---: | ---: | ---: |
| SUPER_ADMIN | Ya | Ya | Ya |
| SCHOOL_ADMIN | Tidak | Ya | Ya |
| STAFF | Tidak | Ya | Tidak |
| TEACHER | Tidak | Tidak | Tidak |

Enforcement occurs at admin route/page, API boundary, and application mutation/read service. UI hiding is supplementary only.

## Validation

- Client validation improves UX but never replaces server validation.
- Zod is the authoritative schema system for allowlist, types, formats, normalization, and unknown-field rejection.
- Optional empty strings become null; mandatory empty strings fail.
- Validation result maps to 422 `VALIDATION_ERROR` with field errors.
- React Hook Form consumes compatible Zod validation results for field-level feedback.

## Error Handling

- Application errors map to contract codes and status 401, 403, 404, 409, 422, or 500.
- Unexpected errors are logged with request ID and returned as sanitized `INTERNAL_ERROR`.
- Stack, SQL, secret, and provider details never reach the client.

## Logging and Audit

- Generate/propagate a request ID for every API response.
- Successful PATCH writes `SCHOOL_SETTINGS_UPDATED` with actor, entity, before/after, request ID, and timestamp.
- Successful provisioning writes `SCHOOL_SETTINGS_INITIALIZED` with SUPER_ADMIN or auditable system actor, null before state, and initialized after state.
- Audit writes are append-only and contain no secrets.
- AuditLog retention is unlimited; no automated cleanup is configured.
- Infrastructure logging format/provider remains an implementation decision after approval.

## File Storage

Not included. `logoUrl` and `logoDarkUrl` store only application-relative paths or valid HTTP/HTTPS URLs. Upload, media service, and storage integration are out of scope.

## Environment Management

Future implementation will require database and auth configuration through server-only environment variables. Names and production values must be approved; Sprint 4.1B creates no `.env` and changes no environment.

Operational defaults are `timezone = Asia/Jakarta` and `locale = id-ID`; timezone validation accepts IANA identifiers recognized by the application runtime.

## Testing Strategy

After implementation authority is granted:

- Vitest unit tests: normalization, Zod validation, permission policy, and aggregate invariants.
- Vitest integration tests: read/update use cases, singleton behavior, optimistic concurrency, and audit transaction.
- API contract tests: 200/401/403/404/409/422/500 envelopes and unknown-field rejection.
- Playwright end-to-end tests: page states, Better Auth access behavior, read-only STAFF behavior, validation, dirty warning, and double-submit protection.
- Playwright regression: frozen public routes remain visually and behaviorally identical.
- Responsive and accessibility checks on desktop and mobile.

## Deployment Strategy

- Remain Vercel-compatible.
- Use reviewed Prisma migrations against PostgreSQL before application rollout.
- No deployment, production environment change, reset, force push, or destructive migration in documentation sprint.

## Public Website Isolation

- Existing public routes/components/assets/styles remain frozen.
- School Settings does not feed public header, footer, logo, address, or WhatsApp in Sprint 4.1.
- Admin-specific UI should use an isolated layout and components.
- Moving existing public routes into a route group is not implied and requires separate regression-reviewed work.

## Architecture Decision Records

Required before implementation:

- ADR: Better Auth session adapter boundary.
- ADR: optimistic concurrency using `updatedAt` and required `expectedUpdatedAt` request token.
- ADR: Zod + React Hook Form validation integration.
- ADR: Vitest and Playwright test layers.
- ADR: component ownership under `shared`, `public`, and `admin`.
- ADR: schema-only migration and idempotent initial provisioning boundary.

## Migration Strategy

- Use additive Prisma migration for enums, SchoolSettings, unique key, AuditLog, and indexes.
- Validate generated SQL before execution.
- Never use destructive reset or force schema push in production.
- Do not touch public-site data.
- Migration creates schema only and contains no production or placeholder School Settings data.
- Idempotent provisioning checks existence, validates all mandatory fields, rejects a second record, and creates singleton plus initialization audit atomically.
- Optimistic concurrency compares request `expectedUpdatedAt` with persisted `updatedAt` inside the update transaction.

## Open Issues

None.

## Approval Record

Approved by Product Owner on 2026-07-19.

## Change Log

| Version | Date | Author | Change | Status |
| --- | --- | --- | --- | --- |
| 1.0 | 2026-07-19 | Codex | Schema migration and provisioning lifecycle finalized and approved | APPROVED |
