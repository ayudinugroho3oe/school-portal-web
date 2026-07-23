# Sprint 5.3.1 — Identity & School Profile Foundation

Version: 1.0
Status: APPROVED — CLOSED
Implementation Authority: ALLOWED
Date: 2026-07-23

## Delivered

- One School-scoped, non-deletable `SchoolIdentity` and `SchoolProfile` working copy per School.
- Forward-only migration with safe backfill from canonical School and verified SchoolSettings content.
- Explicit administrator permissions, authorization before repository access, optimistic concurrency, same-School media validation, transactional update audit, and immutable publish/republish/unpublish history.
- CMS GET/PUT/publish/unpublish/status endpoints and public current-snapshot endpoints using the standard API envelope.
- Standard plain-text Admin CMS editors. No rich text editor or visual builder.
- Static public fallback retained; no public component or visual behavior changed.

## Deferred by Scope

- Public page resolver adoption and visual-equivalence switching.
- Preview sessions.
- Media picker/upload UI; editors accept optional managed MediaAsset references.
- Homepage, Contact, Navigation, Footer, and other later Sprint 5.3 domains.
