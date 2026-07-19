# API Contract

## Document Status

- Version: 1.1
- Status: **APPROVED**
- Document Owner: Product Owner
- Prepared By: Codex based on Product Owner locked decisions
- Approved By: Product Owner
- Approval Date: 2026-07-19
- Implementation Authority: **ALLOWED**

> Sprint 4.3 amendment: initialize requires only `schoolCode` and `schoolName`; `isActive`, timezone, and locale receive safe defaults. All operational/profile/media fields are optional nullable PATCH fields. This supersedes older requiredness tables below.

## API Principles

- Internal versioned JSON API with server-side authentication, authorization, and validation.
- Responses use a consistent envelope and request ID.
- PATCH is partial, allowlisted, normalized, validated, and atomic.
- Errors never expose stack traces, queries, secrets, or infrastructure details.

## Base Path

`/api/v1`

## Authentication

Session-based authentication is provided by **Better Auth** through an application adapter. Actor IDs are UUID. A missing or invalid session receives 401.

## Authorization

| Role | POST initialize | GET | PATCH |
| --- | ---: | ---: | ---: |
| SUPER_ADMIN | `school_settings.initialize` | `school_settings.read` | `school_settings.update` |
| SCHOOL_ADMIN | Forbidden | `school_settings.read` | `school_settings.update` |
| STAFF | Forbidden | `school_settings.read` | Forbidden |
| TEACHER | Forbidden | Forbidden | Forbidden |

Authorization is enforced again in the application/service layer.

## Headers

- Request: `Accept: application/json`; PATCH and POST initialize also use `Content-Type: application/json`.
- Session credentials follow the approved auth adapter.
- Response: `Content-Type: application/json`.
- Every response includes a server-issued `meta.requestId`.

## Standard Response Envelope

```json
{
  "success": true,
  "data": {},
  "meta": { "requestId": "string" }
}
```

## Error Response

```json
{
  "success": false,
  "error": {
    "code": "STRING_CODE",
    "message": "Human readable message",
    "fieldErrors": {}
  },
  "meta": { "requestId": "string" }
}
```

`fieldErrors` is required for `VALIDATION_ERROR` and may be omitted otherwise.

## Status Codes

| Condition | Status | Error code |
| --- | ---: | --- |
| GET success | 200 | — |
| PATCH success | 200 | — |
| Initialize success | 201 | — |
| Not authenticated | 401 | `UNAUTHENTICATED` |
| Authenticated without permission | 403 | `FORBIDDEN` |
| Singleton not available | 404 | `SCHOOL_SETTINGS_NOT_FOUND` |
| Detected concurrent update/conflict | 409 | `SCHOOL_SETTINGS_CONFLICT` |
| Singleton already initialized | 409 | `SCHOOL_SETTINGS_ALREADY_INITIALIZED` |
| Invalid payload | 422 | `VALIDATION_ERROR` |
| Unexpected internal failure | 500 | `INTERNAL_ERROR` |

## Endpoint Catalogue

### GET `/api/v1/school-settings`

- Permission: `school_settings.read`.
- Request body: none.
- Lookup: exact key `PRIMARY_SCHOOL`.
- Responses: 200, 401, 403, 404, 500.

### PATCH `/api/v1/school-settings`

- Permission: `school_settings.update`.
- Request body: required concurrency token `expectedUpdatedAt` plus at least one editable field.
- Unknown and non-editable fields are rejected.
- Omitted fields remain unchanged.
- Responses: 200, 401, 403, 404, 409, 422, 500.

### POST `/api/v1/school-settings/initialize`

- Permission: `school_settings.initialize`; SUPER_ADMIN only.
- Available only while `PRIMARY_SCHOOL` does not exist.
- Request carries every mandatory School Settings field and may carry optional fields.
- Operation validates, normalizes, creates the singleton, and appends `SCHOOL_SETTINGS_INITIALIZED` atomically.
- Success: 201 with complete initialized School Settings.
- Existing singleton: 409 `SCHOOL_SETTINGS_ALREADY_INITIALIZED`.
- Other responses: 401, 403, 422, or 500.

## Request Schemas

### PATCH editable-field allowlist

```text
schoolName
shortName
npsn
schoolLevel
ownershipStatus
foundationName
principalName
operationalPermitNumber
accreditation
email
phone
whatsapp
websiteUrl
addressLine
village
district
city
province
postalCode
timezone
locale
academicYearLabel
logoUrl
logoDarkUrl
schoolMotto
vision
mission
```

`expectedUpdatedAt` is required request metadata and is not an editable School Settings field. The request rejects `id`, `key`, `schoolCode`, `createdAt`, `updatedAt`, `updatedByUserId`, and every unknown field. `schoolCode` is immutable after provisioning.

Request example:

```json
{
  "expectedUpdatedAt": "2026-07-19T00:00:00.000Z",
  "schoolName": "TK Islam Ar Rahmah 48",
  "whatsapp": "081234567890",
  "academicYearLabel": "2026/2027"
}
```

## Response Schemas

### Initialize request schema

Required fields:

```text
schoolCode
schoolName
schoolLevel
ownershipStatus
principalName
whatsapp
addressLine
city
province
timezone
locale
academicYearLabel
```

All other editable optional settings may also be sent. The initialize request rejects `id`, `key`, audit metadata, `expectedUpdatedAt`, and unknown fields. It rejects placeholders and empty mandatory values.

Example shape only; example values are not fixed production data:

```json
{
  "schoolCode": "AR-48",
  "schoolName": "Nama sekolah yang valid",
  "schoolLevel": "PAUD_TK",
  "ownershipStatus": "PRIVATE",
  "principalName": "Nama kepala sekolah yang valid",
  "whatsapp": "6281234567890",
  "addressLine": "Alamat sekolah yang valid",
  "city": "Kota yang valid",
  "province": "Provinsi yang valid",
  "timezone": "Asia/Jakarta",
  "locale": "id-ID",
  "academicYearLabel": "2026/2027"
}
```

### School Settings response

Successful GET, PATCH, and initialize return the complete current School Settings object:

- Immutable after provisioning: `id`, `key`, `schoolCode`, `createdAt`, `updatedAt`, `updatedByUserId`.
- Editable: every field in the PATCH allowlist.
- Optional fields: string or null.
- Enum fields: specified enum string.
- DateTime fields: ISO 8601 string.

Success example (values illustrate shape only and are not seed data):

```json
{
  "success": true,
  "data": {
    "id": "3cb95b0d-d64f-4d85-87e0-8bfb45a59eb5",
    "key": "PRIMARY_SCHOOL",
    "schoolCode": "AR48",
    "schoolName": "TK Islam Ar Rahmah 48",
    "shortName": null,
    "npsn": null,
    "schoolLevel": "PAUD_TK",
    "ownershipStatus": "PRIVATE",
    "foundationName": null,
    "principalName": "Nama kepala sekolah",
    "operationalPermitNumber": null,
    "accreditation": null,
    "email": null,
    "phone": null,
    "whatsapp": "6281234567890",
    "websiteUrl": null,
    "addressLine": "Alamat sekolah",
    "village": null,
    "district": null,
    "city": "Jakarta Timur",
    "province": "DKI Jakarta",
    "postalCode": null,
    "timezone": "Asia/Jakarta",
    "locale": "id-ID",
    "academicYearLabel": "2026/2027",
    "logoUrl": null,
    "logoDarkUrl": null,
    "schoolMotto": null,
    "vision": null,
    "mission": null,
    "createdAt": "2026-07-19T00:00:00.000Z",
    "updatedAt": "2026-07-19T01:00:00.000Z",
    "updatedByUserId": "actor-id"
  },
  "meta": { "requestId": "req_example" }
}
```

## Validation Rules

| Field | Required | Rules |
| --- | ---: | --- |
| expectedUpdatedAt | Ya untuk PATCH | Valid ISO 8601 DateTime; must equal stored `updatedAt`; request metadata only. |
| schoolCode | Ya saat initialize | Trim; uppercase; 2–20 characters; regex `^[A-Z0-9_-]+$`; immutable afterward. `AR48`, `TKAR48`, and `AR-48` are examples only. |
| schoolName | Ya | Trim; 3–150 characters. |
| shortName | Tidak | Trim; max 50; empty → null. |
| npsn | Tidak | Exactly 8 numeric digits; empty → null. |
| schoolLevel | Ya | `PAUD_TK`, `TK`, or `PAUD`. |
| ownershipStatus | Ya | `PRIVATE` or `PUBLIC`. |
| foundationName | Tidak | Trim; empty → null. |
| principalName | Ya | Trim; 2–120 characters. |
| operationalPermitNumber | Tidak | Trim; empty → null. |
| accreditation | Tidak | Trim; empty → null. |
| email | Tidak | Valid email; lowercase; empty → null. |
| phone | Tidak | Normalize to 8–15 digits; empty → null. |
| whatsapp | Ya | Normalize Indonesian leading 0 to 62; digits only; 10–15 digits; no stored `+`. |
| websiteUrl | Tidak | HTTP/HTTPS URL only; empty → null. |
| addressLine | Ya | Trim; 5–250 characters. |
| village | Tidak | Trim; empty → null. |
| district | Tidak | Trim; empty → null. |
| city | Ya | Trim; max 100; not empty. |
| province | Ya | Trim; max 100; not empty. |
| postalCode | Tidak | Exactly 5 digits; empty → null. |
| timezone | Ya | Valid IANA timezone recognized by the application runtime; default `Asia/Jakarta`. |
| locale | Ya | `id-ID` only; default `id-ID`. |
| academicYearLabel | Ya | `YYYY/YYYY`; second year equals first + 1. |
| logoUrl | Tidak | App-relative path or HTTP/HTTPS URL; empty → null. |
| logoDarkUrl | Tidak | App-relative path or HTTP/HTTPS URL; empty → null. |
| schoolMotto | Tidak | Trim; empty → null. |
| vision | Tidak | Trim; empty → null. |
| mission | Tidak | Trim; empty → null. |

Mandatory fields submitted as empty strings produce validation errors.

## Error Examples

Validation (422):

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Data pengaturan sekolah tidak valid.",
    "fieldErrors": {
      "npsn": ["NPSN harus terdiri dari tepat 8 digit."],
      "academicYearLabel": ["Tahun kedua harus satu tahun setelah tahun pertama."]
    }
  },
  "meta": { "requestId": "req_422" }
}
```

Other errors:

```json
{ "success": false, "error": { "code": "UNAUTHENTICATED", "message": "Autentikasi diperlukan." }, "meta": { "requestId": "req_401" } }
```

```json
{ "success": false, "error": { "code": "FORBIDDEN", "message": "Anda tidak memiliki izin untuk melakukan tindakan ini." }, "meta": { "requestId": "req_403" } }
```

```json
{ "success": false, "error": { "code": "SCHOOL_SETTINGS_NOT_FOUND", "message": "Pengaturan sekolah belum tersedia." }, "meta": { "requestId": "req_404" } }
```

```json
{ "success": false, "error": { "code": "SCHOOL_SETTINGS_CONFLICT", "message": "Data telah berubah. Muat ulang lalu coba kembali." }, "meta": { "requestId": "req_409" } }
```

```json
{ "success": false, "error": { "code": "INTERNAL_ERROR", "message": "Terjadi kesalahan internal." }, "meta": { "requestId": "req_500" } }
```

## Idempotency

No idempotency-key protocol is defined for Sprint 4.1. Repeating an identical valid PATCH with a stale `expectedUpdatedAt` returns 409. A new PATCH using the latest token never creates another School Settings record. Every successful PATCH, including one whose normalized values equal stored values, produces the required audit record and a new `updatedAt`. Initialize is idempotent with respect to singleton creation: once `PRIMARY_SCHOOL` exists, every subsequent attempt returns 409 and creates no second record.

## Audit and Logging

- Every successful PATCH updates `updatedByUserId` and appends action `SCHOOL_SETTINGS_UPDATED`.
- Audit stores before/after, actor, entity, request ID, and timestamp without secrets.
- Update and audit should execute in one transaction.
- Failed requests do not create a successful-change audit record.
- Actor and entity identifiers are UUID.
- Audit retention is unlimited.
- Successful initialization appends `SCHOOL_SETTINGS_INITIALIZED` with UUID actor/entity, initialized `afterData`, null `beforeData`, request ID, and timestamp.

## Versioning

Contract version is `v1`. Breaking changes require a new version or an approved compatibility strategy.

## Initialization Error Example

```json
{
  "success": false,
  "error": {
    "code": "SCHOOL_SETTINGS_ALREADY_INITIALIZED",
    "message": "Pengaturan sekolah sudah diinisialisasi."
  },
  "meta": { "requestId": "req_initialize_409" }
}
```

## Open Issues

None.

## Approval Record

Approved by Product Owner on 2026-07-19.

## Change Log

| Version | Date | Author | Change | Status |
| --- | --- | --- | --- | --- |
| 1.0 | 2026-07-19 | Codex | One-time initialization endpoint and immutable school code approved | APPROVED |
