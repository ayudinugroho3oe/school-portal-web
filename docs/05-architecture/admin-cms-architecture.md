# Admin CMS Architecture

Version: 0.2
Status: APPROVED
Implementation Authority: ALLOWED
Owner: Product Owner
Date: 2026-07-20

## Architectural Style

The CMS remains inside the existing Next.js modular monolith and follows **One Product Core, Multiple Independent Installations**. TK Islam Ar Rahmah 48 is the pilot installation. Each bounded context separates domain policy, application services, validation, persistence adapters, admin presentation, and public read models. PostgreSQL is the source of truth; Prisma is the persistence adapter; Better Auth supplies sessions; Zod owns boundary validation.

No database, dependency, route, or runtime implementation is authorized by this document.

## Component Boundaries

```text
components/
  shared/  reusable primitives with no public/admin business policy
  public/  public website components and published-content DTOs
  admin/   authenticated CMS forms, tables, status, preview controls
```

- `shared/` must be presentation-only and accessible by default.
- `public/` must never import admin components, working-copy repositories, or authorization rules.
- `admin/` must never be rendered from public routes and must require server-side session protection.

Existing components may migrate incrementally; no large relocation is required in one sprint.

## Installation Architecture

- One installation serves exactly one active School in the initial phase.
- Each installation has an independent database, storage, domain, environment, Better Auth boundary, secrets, users, sessions, configuration, publications, audit, backups, and logs.
- Application services resolve the installation School and retain `schoolId` in domain records/signatures for clarity, portability, testing, and future compatibility.
- Existing User role remains sufficient for initial authorization; no SchoolMembership, tenant switcher, global account, or shared-database router is required.
- `PRIMARY_SCHOOL` may remain a compatibility key during an additive transition, but source code and schema remain generic and reusable across installations.

## Configuration Registry

Configuration over Hardcode is mandatory. Ordered School configuration collections provide SocialLink, ContactChannel, CallToAction, HomepageSection, TaxonomyTerm, NavigationItem, FooterColumn, and FooterLink. `typeCode` and `iconKey` values are validated data, while renderers, schemas, and icon components come from an application allowlist. This permits new instances, categories, channels, and ordering without migration while preventing executable configuration or an unbounded page builder.

## Layering

```text
Route/Page
  -> Zod input boundary
  -> Application service
  -> Domain policy + authorization
  -> Repository interface
  -> Prisma adapter / media provider
  -> PostgreSQL / object storage
```

Routes handle HTTP only. Services own transactions, concurrency, audit, and cache invalidation. Prisma types do not leak to client components. Admin forms consume explicit DTOs.

## Read Models

- **Admin working-copy resolver**: authenticated, uncached, includes status and concurrency token.
- **Preview resolver**: authenticated and scoped by short-lived preview session; renders working-copy DTO.
- **Public resolver**: reads only the immutable snapshot referenced by `ContentPublicationHead`; falls back to current static content until that domain is migrated.

The fallback is domain-specific. A database error must not silently expose drafts; it returns the approved static fallback or the previous publication.

## Publishing Service

`publish(entityType, entityId, expectedUpdatedAt, actor, requestId)`:

1. Authorize publish.
2. Load working copy within actor school.
3. Match `updatedAt`.
4. Run strict publish schema and cross-entity checks.
5. Serialize allowlisted public DTO only.
6. Determine the next version and insert immutable ContentPublication history.
7. Create or move the same-School/type/entity ContentPublicationHead.
8. Transition the working copy to `PUBLISHED` and write `PUBLISH` or `REPUBLISH` audit data in the same transaction.
9. Commit, then invalidate affected public cache tags.

`unpublish` validates ownership, active head, and concurrency; deletes the head; returns the working copy to `DRAFT`; and writes `UNPUBLISH` audit data atomically. It never deletes or modifies publication history.

Gallery Album is the publication aggregate root. Its deterministic snapshot embeds active ordered Gallery Items and allowlisted media metadata. Gallery Item has no independent publication head or public mutable join.

Publication failure leaves the previous public snapshot unchanged.

## Media Abstraction

```ts
interface MediaStorage {
  createUploadIntent(input: UploadIntentInput): Promise<UploadIntent>;
  verifyObject(key: string): Promise<StoredObjectMetadata>;
  resolvePublicUrl(key: string): string;
  deleteObject(key: string): Promise<void>;
}
```

- Local development adapter: filesystem under ignored `public/uploads`, development only.
- Production adapter: Vercel Blob, approved as product direction; credentials and deployment still require environment-specific security approval.
- Migration target: S3-compatible storage using stable `storageKey`, checksum, and provider metadata.

Database records store no binary payload. Public URLs are derived when possible rather than treated as permanent identifiers.

## Authentication and Authorization

- Better Auth remains the authentication provider.
- Server layouts protect `/admin`; API services also authorize every operation.
- Client-side menu hiding is convenience only, never the security boundary.
- Super Admin manages users, technical identity, archives/deletes, and all content.
- School Admin manages and publishes content/media within the installation but cannot change auth/security configuration or manage users.
- Future Teacher role has no CMS permissions by default.

## Preview Design

- Preview action creates a short-lived, HttpOnly, SameSite=Lax preview cookie bound to user, school, entity, and expiry.
- Preview URL uses the existing public route with a non-sensitive marker or dedicated `/admin/preview/...` wrapper.
- Middleware/server resolver validates the session; query parameters alone never unlock drafts.
- Preview pages set `noindex`, `no-store`, and visually indicate Preview Mode.
- Logout and explicit close revoke preview state.

## Validation and Content Safety

- Prefer structured fields and repeatable configuration collections; rich HTML editor is explicitly not used in the pilot.
- Preserve line breaks as plain text; rendering escapes HTML by default.
- Reject `<script`, event-handler attributes, `javascript:`, `data:` URLs, unsafe protocols, and unapproved embeds.
- If formatted content becomes necessary, introduce a constrained block model before considering sanitized rich HTML.

## Cache and Runtime

- Tag publications by school/domain/entity.
- Mutation routes are dynamic and authenticated.
- Public pages remain Server Components where practical.
- Media uses Next.js Image with approved remote patterns only; dynamic hosts require explicit configuration review.
- Publishing invalidates tags after successful commit, never before.

## Audit and Observability

- Reuse request IDs and error envelopes from Sprint 4.3.
- Audit before/after values for content commands, excluding secrets and signed URLs.
- Log safe identifiers and failure codes, never full request bodies containing personal or credential data.
- Unlimited audit retention remains the approved rule; operational log retention is separate.

## Deployment Topology

Development: Next.js + local PostgreSQL on loopback + local ignored media adapter.

Each future school production installation: Vercel application + its own managed PostgreSQL + its own Vercel Blob scope + its own domain/environment credentials. Production provisioning is outside Sprint 5.1 and requires a secret/deployment review.

## Canonical Repository and Release Strategy

- One canonical repository, mainline, schema, Prisma migration history, test suite, documentation set, and product version.
- No school-specific repository, permanent branch, copied app folder, schema fork, or duplicate module.
- Features are developed and tested once, then included in a product release usable by every installation.
- Installation upgrades apply the same ordered migrations and must preserve local School data, users, media, branding, configuration, publications, and audit logs.
- Release compatibility and migration rehearsal are tested against a clean database and an upgraded prior-version database.
- Mass deployment automation, control plane, centralized identity, billing, and fleet analytics are deferred; architecture must not block them but does not implement them now.

## Failure Modes

- Database unavailable: public uses existing fallback/last publication; admin shows explicit failure.
- Media upload incomplete: asset remains `PENDING` and cannot publish.
- Concurrent edit: `409 STALE_UPDATE`; admin reloads and reapplies changes.
- Publish validation error: working copy remains; previous public snapshot stays live.
- Storage deletion failure: asset remains archived and retryable; metadata is not falsely deleted.

## Incremental Migration

1. Add CMS foundation and publication mechanism.
2. Migrate identity/home/profile/navigation with fallback.
3. Migrate program/teacher/testimonial lists.
4. Migrate galleries and media.
5. Migrate PPDB presentation, run public visual regression, then retire static sources selectively.

At every step, existing public design and routes remain stable.
