# School Management Domain

## Document Status

- Version: 1.1
- Status: **APPROVED**
- Document Owner: Product Owner
- Prepared By: Codex based on Product Owner locked decisions
- Approved By: Product Owner
- Approval Date: 2026-07-19
- Implementation Authority: **ALLOWED**

> Sprint 4.3 amendment: only `key`, `schoolCode`, `schoolName`, and active technical status are mandatory identity. Operational/profile/media fields are nullable dynamic content. This amendment supersedes older required-field statements below; see `docs/07-cms/dynamic-content-mapping.md`.

## Purpose

Menetapkan model domain awal School Management System (SMS) TK Islam Ar Rahmah 48, dengan fokus pertama pada pengelolaan identitas dan informasi operasional sekolah melalui modul School Settings.

## Domain Vision

SMS adalah sistem internal satu sekolah yang modular, dapat diaudit, aman, dan dapat berkembang. Implementasi awal bukan multi-tenant, tetapi model domain tidak boleh menghalangi evolusi multi-school pada masa mendatang.

## Core Domain

Administrasi sekolah merupakan domain awal. Kapabilitas pertama adalah membaca dan memperbarui School Settings secara terkontrol.

## Supporting Domains

- Identity and Access: menyediakan actor terautentikasi, role, dan permission melalui contract/adapter.
- Audit: merekam perubahan berhasil terhadap aggregate.

## Generic Domains

- Persistence melalui repository abstraction.
- Request tracing melalui request ID.
- Validasi format teknis pada application boundary.

Authentication provider, framework UI, database, dan ORM bukan bagian dari model domain.

## Bounded Contexts

### School Administration

Bounded context awal yang memiliki `SchoolSettings` sebagai aggregate root. Modul lain hanya boleh membaca settings melalui service atau contract; tidak boleh menulis tabel secara langsung.

### Identity and Access

Context eksternal terhadap domain School Administration. Menyediakan identitas actor dan permission tanpa mengikat domain pada provider autentikasi tertentu.

### Audit

Menerima fakta perubahan berhasil dan menyimpan jejak before/after secara append-only.

## Context Map

```text
Identity and Access ── actor + permissions ──> School Administration
School Administration ── SchoolSettingsUpdated ──> Audit
Other Modules ── read contract only ──> School Administration
Public Website ── no integration in Sprint 4.1 ──> School Administration
```

## Ubiquitous Language

| Term | Definition |
| --- | --- |
| School Settings | Identitas, legalitas, kontak, alamat, preferensi operasional, dan branding sekolah utama. |
| Primary School | Satu sekolah aktif yang diidentifikasi oleh key stabil `PRIMARY_SCHOOL`. |
| Aggregate Root | `SchoolSettings`, satu-satunya jalur perubahan state settings. |
| Actor | Pengguna sesi yang meminta operasi. |
| Permission | Hak granular `school_settings.initialize`, `school_settings.read`, atau `school_settings.update`. |
| Initial Provisioning | Proses satu kali untuk membuat singleton `PRIMARY_SCHOOL` dari payload lengkap dan valid. |
| Read-only mode | Tampilan data tanpa kemampuan mutation. |
| Audit Log | Catatan append-only atas update yang berhasil. |
| Request ID | Identifier korelasi request, response, dan audit record. |

## Aggregates

### SchoolSettings

Aggregate root menyimpan:

- Identity: `id`, `key`, `schoolCode`, `schoolName`, `shortName`, `npsn`, `schoolLevel`, `ownershipStatus`.
- Legal/organization: `foundationName`, `principalName`, `operationalPermitNumber`, `accreditation`.
- Contact: `email`, `phone`, `whatsapp`, `websiteUrl`.
- Address: `addressLine`, `village`, `district`, `city`, `province`, `postalCode`.
- Operational preferences: `timezone`, `locale`, `academicYearLabel`.
- Profile and branding: `schoolMotto`, `vision`, `mission`, `logoUrl`, `logoDarkUrl`.
- Audit metadata: `createdAt`, `updatedAt`, `updatedByUserId`.

## Entities

### SchoolSettings

Entity singleton dengan identity UUID, school identity `schoolCode`, dan business key unik `PRIMARY_SCHOOL`.

### AuditLog

Entity UUID append-only yang merekam `id`, UUID `actorUserId`, `action`, `entityType`, UUID `entityId`, `beforeData`, `afterData`, `requestId`, dan `createdAt`.

## Value Objects

Konsep berikut diperlakukan sebagai validated values di domain/application boundary:

- `SchoolLevel`: `PAUD_TK | TK | PAUD`.
- `OwnershipStatus`: `PRIVATE | PUBLIC`.
- Normalized Indonesian contact number.
- HTTP(S) website URL.
- IANA timezone yang dikenali runtime, dengan default `Asia/Jakarta`.
- Locale yang saat ini hanya `id-ID` dan menjadi default.
- Academic year label dengan format tahun berurutan `YYYY/YYYY`.
- School code yang wajib saat provisioning, di-trim, di-uppercase, 2–20 karakter, dan cocok dengan `^[A-Z0-9_-]+$`.
- Relative path atau HTTP(S) URL untuk logo terang dan gelap.

## Domain Rules

1. Hanya satu `SchoolSettings` dengan key `PRIMARY_SCHOOL` yang boleh ada.
2. `id`, `key`, `schoolCode`, `createdAt`, dan `updatedAt` tidak dapat diubah setelah provisioning.
3. PATCH hanya menerima editable field yang telah ditetapkan.
4. Update parsial mempertahankan field yang tidak dikirim.
5. Update valid dilakukan secara atomic dan tidak membuat record kedua.
6. PATCH membawa nilai `expectedUpdatedAt`; update hanya berhasil bila sama dengan `updatedAt` tersimpan.
7. Setiap update berhasil mencatat actor UUID terakhir dan menghasilkan audit record.
8. Modul selain School Administration tidak boleh mengubah persistence School Settings secara langsung.
9. School Settings tidak otomatis mengubah website publik pada Sprint 4.1.
10. Migration hanya membuat schema; initial provisioning membuat singleton.
11. Provisioning hanya dapat dilakukan SUPER_ADMIN dengan `school_settings.initialize`, wajib idempotent, atomic, dan hanya berhasil bila singleton belum ada.
12. Provisioning memvalidasi seluruh mandatory fields, menolak placeholder/kosong, dan menghasilkan audit `SCHOOL_SETTINGS_INITIALIZED` dengan actor SUPER_ADMIN atau system actor yang dapat diaudit serta `beforeData = null`.

## Domain Events

### SchoolSettingsInitialized

Conceptual event emitted after successful one-time provisioning. It creates audit action `SCHOOL_SETTINGS_INITIALIZED` with actor, initialized entity data, request ID, timestamp, and `beforeData = null`.

### SchoolSettingsUpdated

Event konseptual setelah perubahan valid berhasil disimpan.

Payload konseptual:

- `schoolSettingsId`
- `actorUserId`
- `beforeData`
- `afterData`
- `requestId`
- `occurredAt`

Event digunakan untuk membuat audit action `SCHOOL_SETTINGS_UPDATED`. Implementasi event tidak mengharuskan message broker.

## Invariants

- Business key selalu `PRIMARY_SCHOOL` dan unik.
- Field mandatory tidak boleh kosong setelah normalisasi.
- Enum harus berasal dari daftar yang ditetapkan.
- Actor UUID harus terautentikasi melalui Better Auth dan memiliki permission update sebelum mutation.
- Audit before/after harus sesuai update yang committed dan tidak menyimpan secret.
- Perbedaan `expectedUpdatedAt` dan `updatedAt` tersimpan menghasilkan conflict dan tidak boleh menimpa data.
- AuditLog disimpan tanpa batas waktu (unlimited retention).

## Actors and Permissions

| Role | Initialize | Read | Update |
| --- | ---: | ---: | ---: |
| SUPER_ADMIN | Ya | Ya | Ya |
| SCHOOL_ADMIN | Tidak | Ya | Ya |
| STAFF | Tidak | Ya | Tidak |
| TEACHER | Tidak | Tidak | Tidak |

Permission ditegakkan pada page, endpoint, dan application/service layer.

## Initial Provisioning Rules

- `schoolCode` required, trimmed, uppercased, 2–20 characters, and limited to `A-Z`, `0-9`, hyphen, and underscore.
- `AR48`, `TKAR48`, and `AR-48` are format examples only, not fixed production values.
- All mandatory values are supplied at provisioning time; documentation and migration contain no placeholder business data.
- A second initialization attempt is rejected as already initialized.

## Open Issues

None.

## Approval Record

Approved by Product Owner on 2026-07-19.

## Change Log

| Version | Date | Author | Change | Status |
| --- | --- | --- | --- | --- |
| 1.0 | 2026-07-19 | Codex | Provisioning model finalized and approved by Product Owner | APPROVED |
