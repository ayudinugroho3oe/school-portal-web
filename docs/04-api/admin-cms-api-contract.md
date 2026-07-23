# Admin CMS API Contract

Version: 0.2
Status: APPROVED
Implementation Authority: ALLOWED
Owner: Product Owner
Date: 2026-07-20

## Conventions

Configuration over Hardcode is an API invariant: extensible lists are exposed as School configuration CRUD/order resources instead of adding a fixed endpoint field for every new channel, network, CTA, category, menu, section, or footer link. Every independent installation exposes the same API contract.

- Base path: `/api/v1`.
- Authentication: Better Auth session cookie; no credentials in URL or response.
- Authorization: service-layer permission check on every command/query.
- JSON request/response, UTF-8, `id-ID` content, ISO-8601 timestamps with offset.
- UUID for entity IDs.
- Installation scope: each request resolves the installation's single active School server-side. `schoolId` in ordinary mutation bodies is rejected.
- Mutations require `expectedUpdatedAt` unless creating.
- Collection reorder requires `expectedCollectionUpdatedAt` and the complete ordered UUID list.
- Public APIs return publication DTOs only; admin APIs return working-copy DTOs.

Success envelope follows Sprint 4.3:

```json
{ "data": {}, "meta": { "requestId": "uuid" } }
```

Error envelope:

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "Safe message", "details": [] }, "meta": { "requestId": "uuid" } }
```

## Status Codes

| Status | Meaning |
| --- | --- |
| 200 | Successful read/update/publish/archive |
| 201 | Created |
| 204 | Successful eligible hard delete |
| 400 | Malformed JSON or invalid command |
| 401 | Missing/invalid session |
| 403 | Authenticated but forbidden |
| 404 | Entity not found in the actor's school |
| 409 | Stale update, duplicate slug, invalid lifecycle, media still used |
| 413 | Upload exceeds allowed size |
| 415 | Unsupported media type |
| 422 | Publish validation failed |
| 429 | Rate limit exceeded |

## Permission Naming

`cms.<domain>.<action>`, where action is `view`, `create`, `edit`, `publish`, `archive`, `delete`, `reorder`, or `manage_media`. Existing `school_settings.*` permissions remain during compatibility.

School Admin has approved publish authority within the installation. No tenant-context endpoint, school selector, shared identity directory, or cross-school session is included. Services resolve the single School root and still pass `schoolId` internally for domain clarity and portability.

## Endpoint Summary

Implementation checkpoint: Sprint 5.3.1 exposes School Identity and School Profile singleton working-copy APIs, immutable publish/unpublish/status operations, and read-only public snapshot APIs in addition to the Sprint 5.2.6 APIs. Homepage/contact/navigation/footer, preview-session, and media HTTP routes remain roadmap contracts.

### School Identity

| Method | Route | Permission | Purpose |
| --- | --- | --- | --- |
| GET | `/api/v1/cms/school-identity` | `cms.identity.view` | Read working copy |
| PUT | `/api/v1/cms/school-identity` | `cms.identity.edit` | Replace allowlisted editable identity fields with optimistic concurrency |
| POST | `/api/v1/cms/school-identity/publish` | `cms.identity.publish` | Publish validated snapshot |
| POST | `/api/v1/cms/school-identity/unpublish` | `cms.identity.archive` | Remove current head and return working copy to Draft |
| GET | `/api/v1/cms/school-identity/publication-status` | `cms.identity.view` | Read lifecycle/head/change status |
| GET | `/api/v1/public/school-identity` | Public | Read current immutable snapshot; 404 when unpublished |

Technical fields such as `schoolCode`, key, role rules, and auth configuration are rejected from the public identity payload. Super Admin-only technical updates remain a separate settings command.

### School Profile

| Method | Route | Permission | Purpose |
| --- | --- | --- | --- |
| GET | `/api/v1/cms/school-profile` | `cms.profile.view` | Read working copy |
| PUT | `/api/v1/cms/school-profile` | `cms.profile.edit` | Replace allowlisted profile fields with optimistic concurrency |
| POST | `/api/v1/cms/school-profile/publish` | `cms.profile.publish` | Publish validated immutable snapshot |
| POST | `/api/v1/cms/school-profile/unpublish` | `cms.profile.archive` | Remove current head and return working copy to Draft |
| GET | `/api/v1/cms/school-profile/publication-status` | `cms.profile.view` | Read lifecycle/head/change status |
| GET | `/api/v1/public/school-profile` | Public | Read current immutable snapshot; 404 when unpublished |

### Tenant-Singleton Content

The following planned shape applies to `homepage`, `profile`, `contact`, `ppdb`, and `footer` after their authorized implementation milestone:

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/v1/cms/{domain}` | Read working copy plus publication metadata |
| PATCH | `/api/v1/cms/{domain}` | Save working copy |
| POST | `/api/v1/cms/{domain}/preview` | Issue short-lived preview context |
| POST | `/api/v1/cms/{domain}/publish` | Validate and publish atomically |
| POST | `/api/v1/cms/{domain}/unpublish` | Remove the current head while preserving immutable history |

PATCH body contains domain fields plus `expectedUpdatedAt`. Publish body contains `expectedUpdatedAt`. Response includes `status`, `updatedAt`, `publishedAt`, and `hasUnpublishedChanges`. Singleton means one row per School, never one global row.

### Configuration Collections

Configuration-first resources use the standard list/detail/create/update/active-state/order pattern. Implemented Sprint 5.2.3 resources are:

- `/api/v1/cms/contact-channels`
- `/api/v1/cms/social-links`
- `/api/v1/cms/ctas`

Planned resources for their later milestones are:

- `/api/v1/cms/taxonomies/{namespace}/terms`
- `/api/v1/cms/homepage/sections`
- `/api/v1/cms/footer/columns`
- `/api/v1/cms/footer/columns/{columnId}/links`

Common create/update fields: School-unique code where applicable, display label/title, safe `iconKey`, order, visibility, and resource-specific value/URL/reference. New records and new type codes do not require schema migration. A type code requiring a new renderer or behavior cannot publish until its server-side validation/renderer registry supports it.

`PUT .../order` submits all ordered UUIDs plus `expectedCollectionUpdatedAt`. All IDs must belong to the installation School and collection.

Sprint 5.2.3 authorization is explicit: all three collection GET operations require `cms.configuration.read`; Contact Channel mutations require `cms.contact_channel.manage`; Social Link mutations require `cms.social_link.manage`; CTA mutations require `cms.cta.manage`. PATCH handles structured field updates or explicit active-state changes with `expectedUpdatedAt`. Client payloads never accept `schoolId`.

### Programs

| Method | Route | Permission |
| --- | --- | --- |
| GET | `/api/v1/cms/programs?kind=&status=&q=&cursor=` | `cms.program.view` |
| POST | `/api/v1/cms/programs` | `cms.program.create` |
| GET | `/api/v1/cms/programs/{id}` | `cms.program.view` |
| PATCH | `/api/v1/cms/programs/{id}` | `cms.program.edit` |
| POST | `/api/v1/cms/programs/{id}/preview` | `cms.program.view` (planned) |
| POST | `/api/v1/cms/programs/{id}/publish` | `cms.program.publish` |
| POST | `/api/v1/cms/programs/{id}/unpublish` | `cms.program.archive` |
| GET | `/api/v1/cms/programs/{id}/publication-status` | `cms.program.view` |
| POST | `/api/v1/cms/programs/{id}/archive` | `cms.program.archive` (planned working-copy lifecycle route) |
| DELETE | `/api/v1/cms/programs/{id}` | `cms.program.delete` (planned eligible hard delete) |
| PUT | `/api/v1/cms/programs/order` | `cms.program.reorder` |

Current create/update schema uses `code`, `title`, `slug`, `summary`, `description`, optional `featuredMediaId`, `sortOrder`, and `isActive`, as defined in the canonical alignment below. Category, repeatable lists, and eligible hard delete remain planned additive contracts.

### Teachers and Testimonials

Current Teacher and Testimonial routes use list/detail/create/update/order plus publish/unpublish/publication-status. Preview, explicit archive route, and eligible hard delete remain planned:

- `/api/v1/cms/teachers`
- `/api/v1/cms/testimonials`

Teacher name ≤120, position ≤120, education ≤200, bio ≤2,000. Testimonial name ≤120, relationship label ≤120, message ≤2,000, and optional School-owned source taxonomy UUID; publish requires consent timestamp.

### Galleries

| Method | Route | Purpose |
| --- | --- | --- |
| GET/POST | `/api/v1/cms/galleries` | List/create albums |
| GET/PATCH | `/api/v1/cms/galleries/{id}` | Album detail/mutation |
| DELETE | `/api/v1/cms/galleries/{id}` | Eligible hard delete (planned) |
| POST | `/api/v1/cms/galleries/{id}/items` | Attach media item |
| PATCH | `/api/v1/cms/galleries/{id}/items/{itemId}` | Caption/update working item |
| DELETE | `/api/v1/cms/galleries/{id}/items/{itemId}` | Remove item (planned) |
| PUT | `/api/v1/cms/galleries/{id}/items/order` | Reorder all items |
| POST | `/api/v1/cms/galleries/{id}/preview` | Preview album (planned) |
| POST | `/api/v1/cms/galleries/{id}/publish` | Publish album snapshot |
| POST | `/api/v1/cms/galleries/{id}/unpublish` | Remove album head and preserve history |
| GET | `/api/v1/cms/galleries/{id}/publication-status` | Read lifecycle/head status |
| POST | `/api/v1/cms/galleries/{id}/archive` | Archive working album (planned route) |

Current album fields and publish validation follow the canonical alignment below. Event date, taxonomy, expanded item-count rules, and additional alt-text policy gates remain planned additions; gallery categories and album counts are not fixed product enums.

### Navigation (planned Sprint 5.3 contract)

- `GET/POST /api/v1/cms/navigation`
- `PATCH/DELETE /api/v1/cms/navigation/{id}`
- `PUT /api/v1/cms/navigation/order`
- `POST /api/v1/cms/navigation/preview`
- `POST /api/v1/cms/navigation/publish`

Label ≤40. Internal href must begin with `/` and be allowlisted; external links require HTTPS. `javascript:`, `data:`, protocol-relative URLs, and admin routes are rejected. The system `Masuk` link cannot be repointed by School Admin.

Navigation locations are validated configuration codes rather than a closed database enum. Footer columns/links and reusable CTAs use their configuration collection APIs above.

### Media (planned HTTP contract; foundation service exists)

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/api/v1/cms/media?q=&status=&cursor=` | Media library |
| POST | `/api/v1/cms/media/upload-intents` | Validate metadata and create upload intent |
| POST | `/api/v1/cms/media/{id}/complete` | Verify stored object and mark ready |
| PATCH | `/api/v1/cms/media/{id}` | Update alt text/display metadata |
| POST | `/api/v1/cms/media/{id}/archive` | Archive unused asset |
| DELETE | `/api/v1/cms/media/{id}` | Super Admin physical deletion workflow |
| GET | `/api/v1/cms/media/{id}/usages` | Show references |

Upload-intent body: filename, MIME, bytes, checksum, intended use. The server returns an opaque, short-lived upload target; it never returns provider master credentials. Completion verifies provider metadata before `READY`.

### Preview and Public Reads

- `POST /api/v1/cms/preview-sessions`: authenticated, rate-limited, short-lived preview cookie bound to user and school.
- `DELETE /api/v1/cms/preview-sessions/current`: revoke preview.
- Public content is normally consumed server-side, not through a broad unauthenticated CMS endpoint.
- If JSON public endpoints are later needed, use `/api/v1/public/{domain}` and expose publication DTOs only.

## Mutation Examples

```json
{
  "title": "MPLS 2026",
  "slug": "mpls-2026",
  "description": "Momen pengenalan lingkungan sekolah.",
  "eventDate": "2026-07-15",
  "category": "SCHOOL_EVENT",
  "expectedUpdatedAt": "2026-07-20T09:00:00+07:00"
}
```

```json
{ "expectedUpdatedAt": "2026-07-20T09:00:00+07:00" }
```

## Concurrency and Conflict Handling

Update queries match both UUID and `updatedAt`. Zero updated rows returns `409 STALE_UPDATE`. Publish checks the same token, media readiness, slug uniqueness, and required fields inside one transaction. Collection reorder uses a collection-level version to avoid silent overwrites.

## Sprint 5.2.6 Canonical Structured-Content Alignment

This section supersedes earlier structured-content field/lifecycle wording. Working-copy resources are Program (`code`, `title`, `slug`, `summary`, `description`, `featuredMediaId`, `sortOrder`), Teacher Profile (`name`, `position`, `biography`, `qualification`, `photoMediaId`, `sortOrder`), Gallery Album (`title`, `slug`, `description`, `coverMediaId`, `sortOrder`) with working-only Gallery Items, and Testimonial (`authorName`, `authorRole`, `quote`, `avatarMediaId`, `sortOrder`). Canonical lifecycle is `DRAFT`, `PUBLISHED`, `ARCHIVED`; `updatedAt` is the concurrency token.

For each publishable collection (`programs`, `teachers`, `galleries`, `testimonials`): `GET/POST /api/v1/cms/{collection}`, `GET/PATCH /api/v1/cms/{collection}/{id}`, `PUT /api/v1/cms/{collection}/order`, `POST /api/v1/cms/{collection}/{id}/publish`, `POST /api/v1/cms/{collection}/{id}/unpublish`, and `GET /api/v1/cms/{collection}/{id}/publication-status`. Publish/unpublish bodies contain only `expectedUpdatedAt`. Client `schoolId`, lifecycle status, audit fields, and publication fields are rejected.

Gallery Item remains a working record under `POST /api/v1/cms/galleries/{albumId}/items`, `PATCH /api/v1/cms/galleries/{albumId}/items/{itemId}`, and `PUT /api/v1/cms/galleries/{albumId}/items/order`; it has no publish/head route. Publishing the album embeds ordered active items and allowlisted public media metadata in one immutable snapshot.

Public snapshot reads require no admin authentication: `GET /api/v1/public/{programs|teachers|galleries|testimonials}` and `GET /api/v1/public/{collection}/{id}`. They resolve the installation School server-side, read only active publication heads, return snapshot payload plus public publication metadata, and never expose working copies, audit data, storage keys, actor IDs, or concurrency internals.

Every publish/republish inserts an immutable `ContentPublication` and atomically moves `ContentPublicationHead`. Unpublish deletes the head, changes the working status to `DRAFT`, preserves history, and writes an audit event. Status responses expose lifecycle, current public snapshot metadata, and `hasUnpublishedChanges`.

## Security Requirements

- Origin/CSRF protection from Better Auth plus same-origin mutation checks.
- Session required for every `/cms/` route.
- Object-level School scoping from the installation root; never trust `schoolId` from request bodies, cache input, media metadata, or URL parameters.
- Rate limits: login managed separately; CMS writes 60/user/minute, publish 20/user/minute, upload intent 30/user/hour as starting limits.
- Structured text only. Any future rich-text input must be sanitized server-side against an allowlist.
- Audit successful creates, updates, publishes, archives, deletes, reorder operations, and material permission denials.
