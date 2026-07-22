# Admin CMS Media Strategy

Version: 0.2
Status: APPROVED
Implementation Authority: ALLOWED
Owner: Product Owner
Date: 2026-07-20

## Decision Summary

Use a provider abstraction with an ignored local-filesystem adapter for development and **Vercel Blob as the approved production direction**, subject to environment provisioning, budget, production database readiness, and secret review. Each school installation uses independent storage and credentials. Preserve a migration path to S3-compatible storage by storing stable provider/key/checksum metadata rather than binding entities to one permanent URL. Every asset retains `schoolId`, and every storage key begins with the installation School namespace.

Repository checkpoint: Sprint 5.2.4 implemented MediaAsset metadata, validation, provider interfaces, and an ignored local-filesystem development adapter. No media HTTP API, Admin Media Library, production Vercel Blob adapter, or deployment credentials are implemented.

Media usage is configuration-first: new CMS domains and placements reference MediaAsset UUIDs/usage metadata without adding provider-specific binary columns.

## Option Comparison

| Option | Local development | Vercel production | Operations | Portability | Decision |
| --- | --- | --- | --- | --- | --- |
| `public/uploads` | Simple | Unsafe: Vercel filesystem is ephemeral | Manual backup | Medium | Development adapter only |
| Vercel Blob | Requires adapter/mock | Native fit | Low operational burden | Medium | Approved production direction |
| Cloudinary | Good SDK/API | Good | Strong transforms, extra vendor model | Medium | Alternative if transformations become essential |
| Supabase Storage | Good | Good | Adds a second platform/control plane | Medium | Not selected for pilot |
| S3-compatible | Good with local emulator | Good | Most setup and policy work | High | Long-term migration option |

## Metadata Stored in PostgreSQL

- UUID, school ID
- provider and storage key
- resolved/public URL when provider requires it
- original filename and normalized extension
- MIME type and byte size
- width and height
- SHA-256 checksum
- alt text
- lifecycle status
- uploader UUID and timestamps
- replacement relationship
- usage references

No image binary, provider master key, signed upload token, session cookie, or EXIF payload is stored.

## Storage Key Format

```text
schools/{schoolCode}/{yyyy}/{mm}/{assetUuid}/{safe-basename}.{ext}
```

The database UUID and `schoolId` are canonical. Original filenames are display metadata only. User-controlled paths are never concatenated without normalization. Media transfer between independent installations is not a runtime CMS operation; it requires an explicit export/import process if approved later.

## Allowed Types and Limits

| Use | MIME | Maximum | Recommended dimensions |
| --- | --- | --- | --- |
| Favicon | `image/png`, `image/x-icon` | 512 KB | 32×32 through 512×512 |
| Logo | JPEG, PNG, WebP | 2 MB | at least 512×512; transparent PNG/WebP where needed |
| Principal/teacher | JPEG, PNG, WebP | 5 MB | about 800×1000 portrait |
| Hero/building | JPEG, PNG, WebP | 8 MB | about 1600×1000, minimum 1200 px wide |
| Program/gallery | JPEG, PNG, WebP | 8 MB | about 1200×800 |

SVG upload is deferred because safe sanitization is not yet provided. Animated images and executable/polyglot files are rejected in the pilot.

## Upload Flow

1. Authenticated user requests an upload intent with intended use and metadata.
2. Server authorizes `manage_media`, checks rate limits, extension, declared MIME, and size.
3. Server creates `PENDING` MediaAsset and returns an opaque short-lived target.
4. Client uploads directly to the provider or local adapter.
5. Completion endpoint verifies actual provider metadata, magic bytes/MIME, checksum, dimensions, and ownership.
6. Valid assets become `READY`; invalid assets become `FAILED` and cannot be referenced or published.

Filename extension alone is never trusted. Production should add malware scanning if the provider does not offer adequate controls; until then, strict raster-image allowlisting and magic-byte verification are mandatory.

## Alt Text Policy

- Required before publication for meaningful images.
- 5–250 characters, describing subject and educational context.
- Decorative assets are explicitly marked decorative and render with empty alt text.
- Captions and alt text are separate fields.
- Generic values such as `foto 1` are rejected during publish review.

## Replacement and Deletion

- Replacement creates a new MediaAsset and updates the working-copy reference; it does not mutate the old object.
- Publishing appends an immutable snapshot and atomically moves ContentPublicationHead.
- Old assets remain while referenced by any working copy or retained publication; physical history-aware usage/deletion remains deferred.
- Archive first; physical deletion requires zero usages, Super Admin permission, a retention window, successful provider deletion, and an audit event.
- Failed physical deletion is retryable and must not delete database metadata falsely.

## Image Delivery

- Store dimensions to prevent layout shift.
- Use Next.js Image and approved remote-host configuration.
- Provider transformation URLs may supply responsive sizes; public components retain object-fit rules and local fallbacks.
- Strip unnecessary EXIF metadata where supported, especially location data.
- Cache immutable objects using UUID keys; replacement generates a new key.

## Security

- Installation-School ownership checks for every asset reference, upload intent, completion, usage query, replacement, and deletion.
- Signed targets expire quickly and are scoped to one object.
- Provider credentials remain server-only environment secrets.
- No arbitrary remote URL import in the pilot.
- Rate-limit upload intents and completion calls.
- Audit upload completion, replacement, archival, deletion, and denied operations without signed URL values.

## Local Development

- Use `public/uploads` only through the storage interface.
- Add `/public/uploads/` to `.gitignore` during implementation.
- Test fixtures use a temporary directory outside committed assets.
- Development URLs use `/uploads/...`; fallback images remain in current `public/` paths.

## Migration Path

1. Implement provider interface and local adapter in Sprint 5.2.
2. Implement the approved Vercel Blob adapter only when the production environment, credentials, plan, and deployment security are approved in Sprint 5.5/5.6.
3. Copy objects to a future S3-compatible provider.
4. Update provider/storage key metadata in a verified migration job.
5. Preserve entity IDs and alt text; public content references MediaAsset UUID, not provider URL.

## Remaining Operational Decisions

- Confirm Vercel Blob plan, region, retention, cost, and environment credentials; the provider direction itself is approved.
- Confirm child-photo consent and takedown procedure.
- Confirm retention duration before unused assets are physically deleted.
- Confirm whether automated malware scanning is required for production launch.
