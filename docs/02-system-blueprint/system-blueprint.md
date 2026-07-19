# System Blueprint

## Document Status

- Version: 1.1
- Status: **APPROVED**
- Document Owner: Product Owner
- Prepared By: Codex based on Product Owner locked decisions
- Approved By: Product Owner
- Approval Date: 2026-07-19
- Implementation Authority: **ALLOWED**

> Sprint 4.3 amendment: bootstrap is minimal and idempotent; admin-managed operational/profile/media content is nullable and never overwritten. See `docs/07-cms/dynamic-content-mapping.md`.

## System Objective

Menyediakan sistem internal sekolah yang aman, modular, dapat diaudit, dan type-safe. Implementasi awal mendukung satu sekolah. Modul pertama mengelola School Settings sebagai sumber identitas dan informasi operasional internal.

## Scope

Sprint 4.1 mencakup:

- Area admin terisolasi pada `/admin`.
- Halaman School Settings pada `/admin/settings/school`.
- Membaca singleton School Settings.
- Memperbarui editable fields secara parsial.
- Validasi client dan server.
- Authorization pada page, API, dan service.
- Audit update berhasil.
- Initial setup foundation pada `/admin/settings/school/setup`.
- State loading, populated, empty/not-found, saving, success, error, dan read-only.

## Actors

| Actor | Capability |
| --- | --- |
| SUPER_ADMIN | Melakukan provisioning, membaca, dan memperbarui School Settings. |
| SCHOOL_ADMIN | Membaca dan memperbarui School Settings. |
| STAFF | Membaca melalui halaman read-only. |
| TEACHER | Tidak dapat mengakses halaman, GET, PATCH, atau initialize. |
| Unauthenticated user | Ditolak sebelum mengakses data. |

| Role | Initialize | Read | Update |
| --- | ---: | ---: | ---: |
| SUPER_ADMIN | Ya | Ya | Ya |
| SCHOOL_ADMIN | Tidak | Ya | Ya |
| STAFF | Tidak | Ya | Tidak |
| TEACHER | Tidak | Tidak | Tidak |

## Modules

```text
Admin Shell
└── School Administration
    └── School Settings
        ├── Read Settings
        ├── Update Settings
        ├── Initialize Settings
        └── Audit Change

Cross-cutting
├── Authentication Adapter
├── Authorization Policy
├── Validation
├── Persistence
├── Error Mapping
└── Request Tracing
```

## User Journeys

### Read School Settings

1. Pengguna membuka `/admin/settings/school`.
2. Sistem memverifikasi session dan `school_settings.read`.
3. UI menampilkan loading state saat data dimuat.
4. Sistem mengambil record dengan key `PRIMARY_SCHOOL`.
5. Jika tersedia, form terisi; STAFF melihat mode read-only.
6. Jika tidak tersedia, UI menampilkan empty/not-found state.
7. Unauthenticated menerima 401 pada API; user tanpa permission menerima 403.

### Update School Settings

1. SUPER_ADMIN atau SCHOOL_ADMIN mengubah editable fields.
2. Client memvalidasi dan mengirim hanya perubahan melalui PATCH.
3. API memverifikasi session dan `school_settings.update`.
4. Server menolak unknown/non-editable fields dan memvalidasi payload.
5. Service melakukan update atomic terhadap `PRIMARY_SCHOOL`.
6. Service mencatat `updatedByUserId` dan AuditLog before/after dengan request ID.
7. Response mengembalikan data terbaru; UI menampilkan success feedback.
8. Konflik concurrent update yang terdeteksi menghasilkan 409.

### Initial Provisioning

1. GET yang tidak menemukan `PRIMARY_SCHOOL` mengembalikan 404.
2. Hanya SUPER_ADMIN dengan `school_settings.initialize` dapat membuka `/admin/settings/school/setup` atau menjalankan `npm run setup:school`/mekanisme server-side setara.
3. Provisioning menerima seluruh mandatory fields dan optional fields yang diberikan, lalu memvalidasi payload tanpa placeholder.
4. Service memeriksa singleton, membuat record dan audit `SCHOOL_SETTINGS_INITIALIZED` secara atomic, lalu mengembalikan 201.
5. Attempt berikutnya menerima 409 `SCHOOL_SETTINGS_ALREADY_INITIALIZED`.
6. UI setup, bila termasuk implementasi Sprint 4.1, mengarahkan pengguna ke `/admin/settings/school` setelah sukses.

## Functional Capabilities

- Read singleton School Settings.
- Partial update dengan allowlist.
- Normalize optional empty strings menjadi null.
- Normalize email dan nomor kontak.
- Enforce enum, format, panjang, dan required rules.
- Role-based read/read-only/update behavior.
- Dirty-state tracking dan unsaved changes warning.
- Optimistic concurrency menggunakan `expectedUpdatedAt` terhadap `updatedAt` tersimpan.
- Structured API success/error envelope.
- Append-only audit trail untuk update berhasil.
- Idempotent one-time initial provisioning.

### School Settings field contract

```text
id, key, schoolCode, schoolName, shortName, npsn, schoolLevel,
ownershipStatus, foundationName, principalName,
operationalPermitNumber, accreditation, email, phone, whatsapp,
websiteUrl, addressLine, village, district, city, province,
postalCode, timezone, locale, academicYearLabel, logoUrl,
logoDarkUrl, schoolMotto, vision, mission, createdAt, updatedAt,
updatedByUserId
```

`schoolCode` is required during provisioning and immutable afterward. It is trimmed, uppercased, 2–20 characters, and accepts only `A-Z`, `0-9`, hyphen, and underscore. `AR48` is an example, not a fixed value. `logoDarkUrl`, `schoolMotto`, `vision`, and `mission` are optional.
Operational defaults are `timezone = Asia/Jakarta` and `locale = id-ID`.

## Cross-Module Dependencies

| Dependency | Direction | Contract |
| --- | --- | --- |
| Identity and Access | Into School Settings | Better Auth session, UUID actor ID, roles/permissions through adapter. |
| PostgreSQL/Prisma | Infrastructure | Singleton persistence and transactional update. |
| Audit | From School Settings | Before/after data, actor, request ID, action. |
| Future modules | Read-only consumer | Service/contract, never direct table mutation. |
| Public website | None in Sprint 4.1 | Explicitly isolated. |

## Non-Functional Requirements

- Server-side authentication, authorization, and validation.
- Accessible labels, error association, focus visibility, and keyboard operation.
- Responsive admin UI for desktop and mobile.
- Structured errors without stack trace, query, secret, or database details.
- Request ID returned in all API envelopes and persisted with audit records.
- Atomic update and audit write when supported by implementation architecture.
- Non-destructive migration.
- Modular separation and type safety.
- Vercel-compatible deployment target.
- Zod validation, React Hook Form, Vitest, and Playwright as approved technical standards.

## Security Principles

- Deny by default.
- UI visibility is not an authorization boundary.
- Mutation accepts only explicit editable-field allowlist.
- Secrets never enter School Settings payload or response.
- Errors expose stable codes, not implementation details.
- Domain and authorization remain independent from authentication provider UI.

## Audit Requirements

Every successful PATCH produces one append-only AuditLog with action `SCHOOL_SETTINGS_UPDATED`, UUID entity identity, UUID actor identity, before/after JSON, request ID, and timestamp. Failed requests do not create a successful-change audit record. Audit retention is unlimited.

Successful initial provisioning produces `SCHOOL_SETTINGS_INITIALIZED`; `beforeData` is null and `afterData` contains initialized settings.

## Public Website Isolation

The existing public site remains frozen. School Settings does not automatically update public logo, name, address, WhatsApp, content, layout, CSS, or assets.

## Out of Scope

- Multi-school CRUD and multi-tenancy.
- Logo upload/media storage.
- Full Academic Year management.
- User/role management UI.
- PPDB, student, teacher, classroom, attendance, billing, payment, notification, analytics.
- Import/export.
- Localization beyond `id-ID`.
- Public website integration.
- Microservices.

## Open Issues

None.

## Approval Record

Approved by Product Owner on 2026-07-19.

## Change Log

| Version | Date | Author | Change | Status |
| --- | --- | --- | --- | --- |
| 1.0 | 2026-07-19 | Codex | Schema migration and initial provisioning separated; approved | APPROVED |
