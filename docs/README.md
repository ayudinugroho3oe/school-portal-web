# Project Documentation

Dokumen di folder ini adalah sumber kebenaran proyek **School Management System — TK Islam Ar Rahmah 48**.

## Document Authority

```text
DDD
→ System Blueprint
→ ERD
→ API Contract
→ Architecture Blueprint
→ PRD
→ Implementation
```

Implementasi dilarang bila dokumen terkait berstatus `DRAFT`, `PENDING CONTENT HANDOFF`, `NEEDS REVIEW`, atau `REJECTED`. Implementasi hanya boleh dimulai setelah seluruh dokumen terkait berstatus `APPROVED`.

## Sprint 4.1B Finalization Status

Product Owner memisahkan schema migration dan initial provisioning. Migration hanya membuat schema; provisioning idempotent membuat singleton `PRIMARY_SCHOOL` dari runtime-supplied valid values. Seluruh keputusan Better Auth, PostgreSQL, Prisma, Zod, React Hook Form, Vitest, Playwright, UUID, optimistic concurrency, audit retention, component isolation, dan field contract telah disinkronkan.

Keenam dokumen fondasi berada pada version **1.0**, status **APPROVED**, dan Implementation Authority **ALLOWED** untuk Sprint 4.2.

## Conflict Resolution

- Codex tidak boleh menebak ketika dokumen bertentangan.
- Konflik wajib dilaporkan.
- Product Owner memberikan keputusan akhir sebelum implementasi dilanjutkan.

## Public Website Freeze

Website publik berstatus **FREEZE**. Pengembangan admin SMS harus diisolasi dan tidak boleh mengubah halaman, komponen, styling, routing, asset, atau behavior website publik. Integrasi School Settings dengan website publik memerlukan pekerjaan dan approval terpisah.

## Required Document Metadata

Setiap dokumen wajib memiliki version, status, document owner, prepared by, approved by, approval date, implementation authority, dan change log.

## Document Index

- [Domain-Driven Design](./01-ddd/school-management-domain.md)
- [System Blueprint](./02-system-blueprint/system-blueprint.md)
- [Entity Relationship Diagram](./03-data/erd.md)
- [API Contract](./04-api/api-contract.md)
- [Architecture Blueprint](./05-architecture/architecture-blueprint.md)
- [PRD School Settings](./06-prd/school-settings-prd.md)
