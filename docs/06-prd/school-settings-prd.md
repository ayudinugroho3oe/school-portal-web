# School Settings Product Requirements Document

## Document Status

- Version: 1.1
- Status: **APPROVED**
- Document Owner: Product Owner
- Prepared By: Codex based on Product Owner locked decisions
- Approved By: Product Owner
- Approval Date: 2026-07-19
- Implementation Authority: **ALLOWED**

> Sprint 4.3 amendment: technical identity alone is mandatory at bootstrap. Principal, contact, address, profile, operational, narrative, and media values are nullable dynamic content managed after bootstrap. See the authoritative mapping in `docs/07-cms/dynamic-content-mapping.md`.

## Feature Overview

School Settings adalah modul pertama SMS untuk melihat dan mengelola identitas serta informasi operasional utama satu sekolah melalui area admin yang terisolasi.

## Problem Statement

Informasi inti sekolah belum memiliki sumber data internal terstruktur dengan validation, role-based access, singleton protection, dan audit trail. Pengelolaan tanpa kontrak berisiko menghasilkan data tidak konsisten atau perubahan tanpa jejak.

## Objective

- Menyediakan satu record School Settings yang dapat dibaca sesuai permission.
- Memungkinkan admin berwenang memperbarui editable fields secara aman.
- Menyediakan validasi, normalization, auditability, dan structured errors.
- Menjaga website publik tetap freeze dan tidak terintegrasi otomatis.

## Users and Roles

| Role | Read | Update | UI behavior |
| --- | ---: | ---: | --- |
| SUPER_ADMIN | Ya | Ya | Editable form dan save. |
| SCHOOL_ADMIN | Ya | Ya | Editable form dan save. |
| STAFF | Ya | Tidak | Seluruh field read-only; save hidden/disabled. |
| TEACHER | Tidak | Tidak | Page dan API forbidden. |

Permissions: `school_settings.read` and `school_settings.update`.

## User Stories

- Sebagai SUPER_ADMIN/SCHOOL_ADMIN, saya dapat melihat dan memperbarui data sekolah agar informasi internal tetap akurat.
- Sebagai SUPER_ADMIN, saya dapat melakukan initial provisioning satu kali ketika singleton belum tersedia.
- Sebagai STAFF, saya dapat melihat data sekolah tanpa dapat mengubahnya.
- Sebagai TEACHER, saya tidak dapat mengakses data pengaturan yang bukan wewenang saya.
- Sebagai auditor, saya dapat menelusuri actor, waktu, request, serta state sebelum dan sesudah update berhasil.

## Functional Requirements

1. Admin page tersedia di `/admin/settings/school` setelah implementation approval.
2. Data dibaca melalui GET `/api/v1/school-settings` berdasarkan `PRIMARY_SCHOOL`.
3. Editable update menggunakan PATCH `/api/v1/school-settings` dan boleh parsial.
4. Unknown/non-editable fields ditolak.
5. Valid update atomic, tidak membuat duplicate singleton, dan mengembalikan state terbaru.
6. Successful state change mencatat AuditLog append-only.
7. Page mendukung loading, populated, not-found, error, saving, success, dirty, dan read-only states.
8. Client dan server validation mengikuti field catalogue yang sama.
9. Authorization ditegakkan pada page, endpoint, dan application service.
10. SUPER_ADMIN dapat melakukan one-time provisioning melalui `/admin/settings/school/setup` atau mekanisme server-side aman yang setara.
11. Schema migration tidak membuat data produksi; provisioning terpisah membuat singleton dan initialization audit secara atomic.

## Field Catalogue

### Identity

| Field | Type | Required | Editable | Default |
| --- | --- | ---: | ---: | --- |
| id | UUID | Ya | Tidak | Generated |
| key | String | Ya | Tidak | `PRIMARY_SCHOOL` |
| schoolCode | String | Ya | Tidak setelah provisioning | Diberikan saat provisioning |
| schoolName | String | Ya | Ya | — |
| shortName | String | Tidak | Ya | null |
| npsn | String | Tidak | Ya | null |
| schoolLevel | Enum | Ya | Ya | `PAUD_TK` |
| ownershipStatus | Enum | Ya | Ya | `PRIVATE` |

`schoolLevel`: `PAUD_TK | TK | PAUD`. `ownershipStatus`: `PRIVATE | PUBLIC`.

### Legal and Organization

| Field | Type | Required | Editable |
| --- | --- | ---: | ---: |
| foundationName | String | Tidak | Ya |
| principalName | String | Ya | Ya |
| operationalPermitNumber | String | Tidak | Ya |
| accreditation | String | Tidak | Ya |

### Contact

| Field | Type | Required | Editable |
| --- | --- | ---: | ---: |
| email | String | Tidak | Ya |
| phone | String | Tidak | Ya |
| whatsapp | String | Ya | Ya |
| websiteUrl | String | Tidak | Ya |

### Address

| Field | Type | Required | Editable |
| --- | --- | ---: | ---: |
| addressLine | String | Ya | Ya |
| village | String | Tidak | Ya |
| district | String | Tidak | Ya |
| city | String | Ya | Ya |
| province | String | Ya | Ya |
| postalCode | String | Tidak | Ya |

### Operational Preferences

| Field | Type | Required | Editable | Default |
| --- | --- | ---: | ---: | --- |
| timezone | String | Ya | Ya | `Asia/Jakarta` |
| locale | String | Ya | Ya | `id-ID` |
| academicYearLabel | String | Ya | Ya | — |

`academicYearLabel` adalah label aktif sementara, bukan pengganti modul Academic Year.

### Profile and Branding

| Field | Type | Required | Editable |
| --- | --- | ---: | ---: |
| logoUrl | String | Tidak | Ya |
| logoDarkUrl | String | Tidak | Ya |
| schoolMotto | String | Tidak | Ya |
| vision | String | Tidak | Ya |
| mission | String | Tidak | Ya |

Only URL/path storage and preview are in scope for both logo variants; upload/storage integration is excluded.

### Audit Metadata

| Field | Type | Required | Editable |
| --- | --- | ---: | ---: |
| createdAt | DateTime | Ya | Tidak |
| updatedAt | DateTime | Ya | Tidak |
| updatedByUserId | UUID | Tidak | Tidak |

## Validation Rules

| Field | Validation and normalization |
| --- | --- |
| schoolCode | Required saat provisioning; trim; uppercase; 2–20 characters; regex `^[A-Z0-9_-]+$`; immutable afterward. `AR48`, `TKAR48`, and `AR-48` are examples only. |
| schoolName | Required; trim; 3–150 characters. |
| shortName | Optional; trim; max 50; empty → null. |
| npsn | Optional; exactly 8 numeric digits; empty → null. |
| schoolLevel | Required; one of `PAUD_TK`, `TK`, `PAUD`. |
| ownershipStatus | Required; one of `PRIVATE`, `PUBLIC`. |
| foundationName | Optional; trim; empty → null. |
| principalName | Required; trim; 2–120 characters. |
| operationalPermitNumber | Optional; trim; empty → null. |
| accreditation | Optional; trim; empty → null. |
| email | Optional; valid email; lowercase; empty → null. |
| phone | Optional; normalized to 8–15 digits; empty → null. |
| whatsapp | Required; normalize Indonesian leading `0` to `62`; store 10–15 digits without `+`. |
| websiteUrl | Optional; HTTP/HTTPS only; empty → null. |
| addressLine | Required; trim; 5–250 characters. |
| village | Optional; trim; empty → null. |
| district | Optional; trim; empty → null. |
| city | Required; trim; max 100. |
| province | Required; trim; max 100. |
| postalCode | Optional; exactly 5 digits; empty → null. |
| timezone | Required; valid IANA timezone recognized by the application runtime; default `Asia/Jakarta`. |
| locale | Required; only `id-ID`; default `id-ID`. |
| academicYearLabel | Required; `YYYY/YYYY`; second year equals first + 1. |
| logoUrl | Optional; relative app path or HTTP/HTTPS URL; empty → null. |
| logoDarkUrl | Optional; relative app path or HTTP/HTTPS URL; empty → null. |
| schoolMotto | Optional; trim; empty → null. |
| vision | Optional; trim; empty → null. |
| mission | Optional; trim; empty → null. |

Mandatory empty strings are validation errors. Omitted PATCH fields remain unchanged.

## Permissions

| Operation | Required permission | SUPER_ADMIN | SCHOOL_ADMIN | STAFF | TEACHER |
| --- | --- | ---: | ---: | ---: | ---: |
| Initial setup/POST initialize | `school_settings.initialize` | Allow | Deny | Deny | Deny |
| Open/read page | `school_settings.read` | Allow | Allow | Allow | Deny |
| GET API | `school_settings.read` | Allow | Allow | Allow | Deny |
| Edit/save UI | `school_settings.update` | Allow | Allow | Deny | Deny |
| PATCH API/service | `school_settings.update` | Allow | Allow | Deny | Deny |

Unauthenticated requests receive 401; authenticated denials receive 403.

## Page States

| State | Expected behavior |
| --- | --- |
| Initial loading | Skeleton or clear loading indicator; no stale editable form. |
| Populated | Six sections populated from API. |
| Empty/not found | Clear message that settings are unavailable; no invented data. |
| Read-only | STAFF can inspect values; fields non-editable; save unavailable. |
| Dirty | Save enabled for authorized updater; navigation warning active. |
| Unchanged | Save disabled. |
| Saving | Save disabled with progress state; double submit blocked. |
| Success | Latest server state displayed and success notification announced. |
| Field error | Error connected to relevant field and accessible to assistive tech. |
| Global error | Sanitized recoverable error with retry/reload guidance. |
| Forbidden | Page access denied according to admin pattern. |
| Initial setup required | Missing singleton shows setup direction only to SUPER_ADMIN; other users receive the appropriate not-found/forbidden behavior. |

## User Flow

### Read

Authenticate → authorize read → load singleton → show populated/read-only state or not-found/error state.

### Update

Authorize update → edit → client validation → send `expectedUpdatedAt` and changed allowlisted fields → server authorization and Zod validation → compare persisted `updatedAt` → atomic update + audit → return latest data → clear dirty state and announce success.

### Initial Provisioning

Missing singleton → SUPER_ADMIN opens `/admin/settings/school/setup` or secure server-side setup → supplies all mandatory fields → validation and existence check → atomic singleton + `SCHOOL_SETTINGS_INITIALIZED` audit → 201 → redirect to `/admin/settings/school`. Existing singleton causes 409 and disables reuse of setup.

## API Dependencies

- GET `/api/v1/school-settings`
- PATCH `/api/v1/school-settings`
- POST `/api/v1/school-settings/initialize`
- Standard envelopes, request ID, and status/error codes from API Contract v0.9.

## Data Dependencies

- PostgreSQL and Prisma targets.
- Unique singleton key `PRIMARY_SCHOOL`.
- School Settings and append-only AuditLog entities.
- Better Auth session adapter supplies UUID actor and permissions.
- Zod, React Hook Form, Vitest, and Playwright are the approved validation, form, and testing standards.
- Schema migration creates schema only. Idempotent provisioning creates `PRIMARY_SCHOOL` from runtime-supplied valid values.

## Acceptance Criteria

- **SS-AC-001** Authorized SUPER_ADMIN and SCHOOL_ADMIN can open `/admin/settings/school` and receive populated data when the singleton exists.
- **SS-AC-002** STAFF can open the page in read-only mode and cannot submit an update.
- **SS-AC-003** TEACHER cannot access the page; GET and PATCH return 403.
- **SS-AC-004** Unauthenticated GET and PATCH return 401 with `UNAUTHENTICATED` and request ID.
- **SS-AC-005** GET reads exactly `PRIMARY_SCHOOL`; a missing singleton returns 404 `SCHOOL_SETTINGS_NOT_FOUND`.
- **SS-AC-006** PATCH accepts any valid non-empty subset of editable fields and preserves omitted fields.
- **SS-AC-007** PATCH rejects unknown, immutable, or audit fields with 422 and field-level information where applicable.
- **SS-AC-008** All mandatory, format, length, enum, URL, contact, timezone, locale, postal, and academic-year rules are enforced server-side.
- **SS-AC-009** Client validation presents accessible field errors before invalid submission where possible.
- **SS-AC-010** Optional empty strings persist as null; mandatory empty strings return validation errors.
- **SS-AC-011** Email persists lowercase; WhatsApp and phone persist normalized digits; Indonesian WhatsApp leading 0 becomes 62.
- **SS-AC-012** Successful PATCH returns 200 with complete latest state and does not create a second School Settings row.
- **SS-AC-013** Every successful PATCH updates `updatedByUserId` and appends one `SCHOOL_SETTINGS_UPDATED` audit record with before/after and request ID, including when normalized values equal stored values.
- **SS-AC-014** PATCH requires `expectedUpdatedAt`; a mismatch with persisted `updatedAt` returns 409 without update or successful-change audit.
- **SS-AC-015** Save is disabled with no changes and while saving; double submit is prevented.
- **SS-AC-016** Dirty form triggers an unsaved changes warning when the user attempts to leave.
- **SS-AC-017** Every API success/error follows the v1 envelope and contains `meta.requestId`.
- **SS-AC-018** Internal failures return sanitized 500 `INTERNAL_ERROR` without stack, query, secret, or database detail.
- **SS-AC-019** Admin page is usable on desktop and mobile with labels, keyboard navigation, focus visibility, and announced feedback.
- **SS-AC-020** School Settings implementation makes no data, styling, component, route, asset, or behavior change to the frozen public website.
- **SS-AC-021** Logo URL supports preview when valid; no upload or storage integration is exposed.
- **SS-AC-022** Migration is additive, enforces unique singleton key, and does not reset or destructively alter existing data.
- **SS-AC-023** Website publik harus tetap identik setelah implementasi School Settings. Tidak boleh ada perubahan tampilan maupun perilaku website publik.
- **SS-AC-024** Jika `PRIMARY_SCHOOL` belum tersedia, GET School Settings mengembalikan 404 dengan code `SCHOOL_SETTINGS_NOT_FOUND`.
- **SS-AC-025** SUPER_ADMIN dapat melakukan initial provisioning satu kali dengan payload valid.
- **SS-AC-026** Provisioning kedua ditolak dengan HTTP 409 dan code `SCHOOL_SETTINGS_ALREADY_INITIALIZED`.
- **SS-AC-027** Provisioning tidak menerima placeholder atau field mandatory kosong.
- **SS-AC-028** Migration tidak membuat data sekolah produksi.
- **SS-AC-029** Initial provisioning tidak mengubah website publik.

## Edge Cases

- Singleton missing.
- Partial payload contains only one field.
- Empty PATCH object.
- Unknown or immutable field included.
- Optional field cleared using empty string.
- Mandatory field sent as whitespace only.
- Indonesian, international, symbol-containing, too-short, or too-long contact values.
- Academic year has invalid shape or non-sequential years.
- URL uses a non-HTTP protocol.
- Invalid/unsupported timezone or locale.
- Session expires while form is open.
- STAFF attempts direct PATCH.
- Duplicate/double submit.
- Data changes concurrently after initial load.
- Valid PATCH produces no effective value change; it still creates the required successful PATCH audit record.
- Setup route is accessed after singleton already exists; access is denied or redirected without mutation.

## Out of Scope

- Multi-school CRUD, multi-tenancy, logo upload, media storage.
- Complete Academic Year management.
- User/role management UI.
- PPDB, student, teacher, classroom, attendance, billing/payment, notification, analytics.
- Import/export and localization beyond `id-ID`.
- Public website integration.

## Definition of Done

After documents become APPROVED and implementation occurs:

- Admin page, GET, and PATCH match approved route/contract.
- PostgreSQL/Prisma schema migration is validated, non-destructive, and creates no production School Settings data.
- Idempotent provisioning validates runtime-supplied mandatory values and creates exactly one `PRIMARY_SCHOOL` with initialization audit.
- Client/server validation and permission enforcement pass tests.
- All required page states and accessibility behavior work responsively.
- Quality gates (typecheck, lint, build, available tests, migration validation, API/auth checks) pass.
- Public website regression check passes without public-source changes.
- No deployment, production change, or unrequested push occurs.

## Open Issues

None.

## Approval Record

Approved by Product Owner on 2026-07-19.

## Change Log

| Version | Date | Author | Change | Status |
| --- | --- | --- | --- | --- |
| 1.0 | 2026-07-19 | Codex | Initial provisioning flow and SS-AC-024 through SS-AC-029 approved | APPROVED |
