# Sprint 5.2.3 Configuration Domain Report

Version: 0.1
Status: IMPLEMENTED — NEEDS PRODUCT OWNER REVIEW
Implementation Authority: Sprint 5.2.3 only
Owner: Product Owner
Date: 2026-07-20

## Scope

Implemented structured School-owned Contact Channel, Social Link, and Call to Action configuration domains. Every operation uses the Sprint 5.2.2 CMS context, canonical server-resolved School, explicit permission, strict validation, and a School-scoped repository. No CMS user interface or publishing workflow is included.

## Domain Rules

- UUID entity identity and required canonical `schoolId`.
- Client payloads cannot provide `schoolId`.
- Deterministic `sortOrder` then UUID ordering.
- Explicit `isActive` lifecycle; no hard-delete API.
- Optimistic concurrency for update and active-state mutation.
- Collection concurrency token for transactional reorder.
- Contact uniqueness: `(schoolId, typeCode)`.
- Social uniqueness: `(schoolId, platformCode)`.
- CTA uniqueness: `(schoolId, code)`.
- The same code is structurally valid in another School, while repository reads never cross the requested School scope.

## Schema and Migration

Migration `20260720010000_add_cms_configuration_domain` additively creates:

- `contact_channels`;
- `social_links`;
- `call_to_actions`.

All tables use restrictive foreign keys to canonical School and School-aware unique/index boundaries. The migration drops or rewrites no existing table, SchoolSettings field, user, session, account, audit, or public content. No installation-specific seed is added.

## Repository Implementation

Concrete Prisma adapters implement list, find, create, update, active-state mutation, and transactional reorder. Every method requires `schoolId`; no unscoped list/find method exists. Prisma types remain inside infrastructure.

Reorder verifies that the submitted IDs are the complete School-owned collection and that the collection token is current before writing. Invalid or stale input performs no partial reorder.

## Authorization

Approved explicit permissions:

- `cms.configuration.read` — Super Admin and School Admin;
- `cms.contact_channel.manage` — Super Admin and School Admin;
- `cms.social_link.manage` — Super Admin and School Admin;
- `cms.cta.manage` — Super Admin and School Admin.

Staff and Teacher are denied. There is no wildcard, inheritance, implicit role shortcut, or new role. Application services authorize before School resolution and repository access.

## API Boundaries

Only approved API Contract resources were implemented:

- `/api/v1/cms/contact-channels` and item/order routes;
- `/api/v1/cms/social-links` and item/order routes;
- `/api/v1/cms/ctas` and item/order routes.

GET lists, POST creates, PATCH updates or changes active state, and PUT `/order` reorders. Responses use the common request-ID envelope. Strict schemas reject mass assignment and unknown properties. No Prisma error or environment data is exposed.

## Validation

- Contact types: `WHATSAPP`, `PHONE`, `EMAIL`, `ADDRESS`, `GOOGLE_MAPS`.
- Social platforms: `INSTAGRAM`, `FACEBOOK`, `YOUTUBE`, `TIKTOK`.
- CTA uses a bounded safe configurable code rather than hardcoded CTA instances.
- Email, phone, WhatsApp, labels, safe URL protocols, description text, ordering, state, UUIDs, and concurrency tokens are validated explicitly.
- `javascript:`, `data:`, `file:`, protocol-relative, malformed, unknown, and executable values are rejected.

## Testing and Migration Rehearsal

Coverage includes domain validation, explicit role grants, authorization-before-access, server-derived School context, mass-assignment rejection, scoped CRUD, cross-School isolation, per-School uniqueness, deactivate, reorder, rollback on invalid reorder, API envelopes, database-empty migration, Sprint 4 upgrade, Sprint 5.2.1 upgrade, and existing migration ambiguity safety.

## Risks and Recommendations

- Initial Contact and Social allowlists are intentionally small. A new behavior-bearing type requires an approved registry/schema addition, not a database migration.
- One channel/platform per code per School is the approved Sprint 5.2.3 uniqueness rule. Supporting multiple accounts of the same platform later requires an additive domain decision, not weakening repository scope.
- CTA presentation style/icon registries should be introduced only with an approved consuming UI/domain.
- Generalized audit is deferred; configuration mutations currently retain actor metadata but do not introduce an out-of-scope generalized audit framework.

## Deferred Scope

Publishing, preview, drafts, media, homepage sections, navigation, footer rendering, taxonomy, program, teacher, gallery, testimonial, CMS UI, cache framework, generalized audit, SchoolMembership, tenant switching, and Sprint 5.2.4 remain unimplemented.
