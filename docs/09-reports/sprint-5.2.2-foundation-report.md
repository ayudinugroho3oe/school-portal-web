# Sprint 5.2.2 CMS Foundation Implementation Report

Version: 0.1
Status: IMPLEMENTED — NEEDS PRODUCT OWNER REVIEW
Implementation Authority: Sprint 5.2.2 only
Owner: Product Owner
Date: 2026-07-20

## Scope Classification

- Request class: Reusable Product Feature foundation.
- Governing principles: One Product Core, Configuration over Hardcode, Structured and Safe Configuration, Clear Boundaries, Security by Default, Test as Product Contract, and No Silent Scope Expansion.
- Installation model: one active School per independent installation; no tenant selector, SchoolMembership, shared database routing, or cross-school session.

## Implemented Foundation

### Domain contracts

- UUID-oriented entity and School ID aliases.
- Required `schoolId`, `createdAt`, and `updatedAt` shape for future School-owned entities.
- Cursor-page and list-query DTOs.
- Generic School-scoped repository contract whose operations always require `schoolId`.
- Clock, ID generator, and transaction-runner dependency interfaces.

These are contracts only. They do not add a CMS entity, table, route, or public behavior.

### Shared application context

`createCmsRequestContext` authorizes the actor before resolving the canonical installation School. The resulting actor, server-derived `schoolId`, and request ID are immutable. Ordinary payloads do not supply school scope.

### Configuration registry

The registry accepts only application-registered codes backed by Zod schemas. Codes are normalized, duplicate or unsafe registration is rejected, and unknown codes cannot be parsed. The registry stores data validation/behavior selection only; it does not execute configured code, component paths, JavaScript, SQL, or HTML.

No initial ContactChannel, SocialLink, CTA, HomepageSection, taxonomy, navigation, footer, or renderer registration is included in Sprint 5.2.2.

### Validation foundation

- UUID identity.
- Safe configuration codes and icon keys.
- Bounded ordering and visibility.
- Offset-aware optimistic-concurrency token.
- Safe local/HTTP(S)/mail/tel links.
- Structured plain-text rejection of executable patterns.

Domain-specific create, update, and publish schemas remain the responsibility of their future approved milestones.

### Common errors

`ApplicationError` supplies a safe code, HTTP status, message, and optional non-sensitive details. The existing School Settings `DomainError` now extends this common type, preserving its codes and behavior. The API error envelope recognizes the common type without changing existing routes.

### Infrastructure adapter

`CanonicalSchoolContextResolver` adapts the approved canonical School service to the application-context interface. Application context depends on an interface; PostgreSQL/Prisma remains behind the adapter.

## Dependency Direction

```text
HTTP route or future admin action
  -> Zod boundary
  -> shared/domain application service
  -> repository or resolver interface
  -> Prisma/storage adapter
  -> isolated installation infrastructure
```

Domain contracts and validation do not import Next.js, Prisma, React, public components, or admin components. The CMS application context does not accept a client-supplied `schoolId`.

## Explicitly Not Implemented

- CMS database entities or migrations.
- ContactChannel, SocialLink, CTA, HomepageSection, taxonomy, navigation, or footer records.
- Publishing, preview, archive, or media services.
- CMS routes, forms, sidebar, or UI.
- Permission expansion beyond the existing approved runtime permissions.
- Cache invalidation, audit generalization, or provider integration.
- Sprint 5.2.3 scope.

## Test Contract

- Registry accepts registered typed configuration and rejects duplicate, invalid, or unknown codes.
- Validation rejects unsafe links, executable content patterns, invalid concurrency tokens, and invalid codes.
- Authorization occurs before School resolution.
- Request context receives School scope only from the canonical server-side resolver.
- PostgreSQL integration proves the resolved context uses the provisioned canonical School UUID.
- Existing School Settings/API behavior remains covered by regression tests.

## Risks and Recommendations

- Future configuration domains must define domain-specific schemas and permission codes; they must not use an unbounded JSON escape hatch.
- Repository implementations must include `schoolId` in every lookup and uniqueness boundary even in a single-School installation.
- Permission expansion should occur only with the first approved consuming CMS domain and permission tests.
- Publishing and audit transaction interfaces should be added with their approved engine milestone, not inferred from this foundation.

## Sprint 5.2.1 Operational Backlog

The Product Owner classified the unverifiable local development Super Admin credential as a Known Development Limitation. It is unrelated to the School migration and remains an operational backlog item requiring separate authorization. Sprint 5.2.2 does not change authentication or credentials.
