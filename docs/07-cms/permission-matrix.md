# Admin CMS Permission Matrix

Version: 0.1
Status: APPROVED
Implementation Authority: ALLOWED
Owner: Product Owner
Date: 2026-07-20

## Roles

- **Super Admin**: all CMS content, users/access, technical identity, publish, archive, eligible hard delete, and media lifecycle.
- **Admin Sekolah**: public content and media management, preview, and approved direct publication within the installation; no auth/security settings, user management, or technical identity mutation.
- **Staff**: no CMS permissions in the pilot beyond any separately retained School Settings read access.
- **Teacher**: reserved for future design; deny all CMS permissions by default.

UI visibility follows this matrix, but authorization is always enforced again in application services.

Permissions are evaluated from the authenticated User role inside the installation's single authentication boundary. `schoolId` is resolved from the installation School, not selected by the user. SchoolMembership, tenant switching, and global cross-school accounts are deliberately not required in the initial model. Configuration collections use the permission of their owning domain; adding a new configured channel, term, CTA, section, or footer link does not require a new role or migration.

## Domain Matrix

Legend: ✓ allowed, R read only, — denied, C conditional.

| Domain | Role | View | Create | Edit | Publish | Archive | Delete | Manage media/order |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Technical School Identity | Super Admin | ✓ | — | ✓ | ✓ | — | — | — |
| Technical School Identity | Admin Sekolah | R | — | — | — | — | — | — |
| Public School Identity | Super Admin | ✓ | — | ✓ | ✓ | ✓ | — | ✓ |
| Public School Identity | Admin Sekolah | ✓ | — | ✓ | ✓ | — | — | ✓ |
| Homepage | Super Admin | ✓ | — | ✓ | ✓ | ✓ | — | ✓ |
| Homepage | Admin Sekolah | ✓ | — | ✓ | ✓ | C | — | ✓ |
| Profile | Super Admin | ✓ | — | ✓ | ✓ | ✓ | — | ✓ |
| Profile | Admin Sekolah | ✓ | — | ✓ | ✓ | C | — | ✓ |
| Programs | Super Admin | ✓ | ✓ | ✓ | ✓ | ✓ | C | ✓ |
| Programs | Admin Sekolah | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ |
| Teachers & Staff | Super Admin | ✓ | ✓ | ✓ | ✓ | ✓ | C | ✓ |
| Teachers & Staff | Admin Sekolah | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ |
| Gallery | Super Admin | ✓ | ✓ | ✓ | ✓ | ✓ | C | ✓ |
| Gallery | Admin Sekolah | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ |
| Testimonials | Super Admin | ✓ | ✓ | ✓ | ✓ | ✓ | C | ✓ |
| Testimonials | Admin Sekolah | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ |
| Contact | Super Admin | ✓ | — | ✓ | ✓ | ✓ | — | ✓ |
| Contact | Admin Sekolah | ✓ | — | ✓ | ✓ | C | — | ✓ |
| PPDB Content | Super Admin | ✓ | — | ✓ | ✓ | ✓ | — | ✓ |
| PPDB Content | Admin Sekolah | ✓ | — | ✓ | ✓ | C | — | ✓ |
| Navigation & Footer | Super Admin | ✓ | ✓ | ✓ | ✓ | ✓ | C | ✓ |
| Navigation & Footer | Admin Sekolah | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ |
| Media Library | Super Admin | ✓ | ✓ | ✓ | — | ✓ | C | ✓ |
| Media Library | Admin Sekolah | ✓ | ✓ | ✓ | — | ✓ | — | ✓ |
| Users & Access | Super Admin | ✓ | ✓ | ✓ | — | ✓ | C | — |
| Users & Access | Admin Sekolah | — | — | — | — | — | — | — |

School Admin direct publishing is approved within the installation. Another school's content/media resides in another database/storage/auth boundary.

`C` hard delete means only never-published, unreferenced drafts or unused media after retention. For singleton sections, archive may be restricted if it would leave required public identity unavailable; fallback remains active.

## Permission Codes

```text
cms.identity.view|edit|publish|archive
cms.homepage.view|edit|publish|archive
cms.profile.view|edit|publish|archive
cms.program.view|create|edit|publish|archive|delete|reorder
cms.teacher.view|create|edit|publish|archive|delete|reorder
cms.gallery.view|create|edit|publish|archive|delete|reorder
cms.testimonial.view|create|edit|publish|archive|delete|reorder
cms.contact.view|edit|publish|archive
cms.ppdb.view|edit|publish|archive
cms.navigation.view|create|edit|publish|archive|delete|reorder
cms.media.view|create|edit|archive|delete|manage_media
cms.access.view|create|edit|archive|delete
cms.preview.create
cms.audit.view
cms.configuration.read
cms.contact_channel.manage
cms.social_link.manage
cms.cta.manage
```

### Sprint 5.2.3 Configuration Permissions

| Permission | Super Admin | Admin Sekolah | Staff | Teacher |
| --- | ---: | ---: | ---: | ---: |
| `cms.configuration.read` | ✓ | ✓ | — | — |
| `cms.contact_channel.manage` | ✓ | ✓ | — | — |
| `cms.social_link.manage` | ✓ | ✓ | — | — |
| `cms.cta.manage` | ✓ | ✓ | — | — |

Configuration read uses one shared explicit permission in Sprint 5.2.3. There is no wildcard, implicit grant, role inheritance, or per-entity read permission. Manage permissions remain separate by configuration domain.

Existing `school_settings.initialize/read/update` remains during compatibility. Sprint 5.2 must map new permissions explicitly rather than infer them from route names.

## Sensitive Operations

Super Admin only:

- Change `schoolCode`, technical singleton identity, role grants, auth/security settings.
- Manage users and access.
- Hard delete eligible records/media.
- Change a published slug when link continuity could break.
- View the broad audit log.

School Admin may see audit entries for content they manage but not authentication/session details.

## Authorization Rules

1. Authenticate through Better Auth.
2. Derive actor and school scope server-side; do not accept authority from request data.
3. Check named permission in application service.
4. Resolve the installation School and verify every entity/reference matches its `schoolId`.
5. Enforce lifecycle, media usage, consent, and concurrency policies.
6. Audit successful material changes and meaningful permission denials.

There is no cross-school authorization path in the initial product. Super Admin authority is installation-local; operating another school requires access to that school's independent installation.

## Future Teacher Role

The schema may retain `TEACHER`, but all CMS grants remain empty. A later sprint may add narrow content contribution permissions only after defining ownership, review, and publication policies.
