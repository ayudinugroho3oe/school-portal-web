# Product Constitution

Title: Product Constitution
Version: 1.0
Status: APPROVED
Implementation Authority: ALLOWED
Owner: Product Owner
Applies To: All Product Modules, Installations, Releases, and Future Sprints
Supersedes: Informal architecture principles discussed before Sprint 5.1B
Date: 2026-07-20

## Preamble

School Management System is governed as **One Product Core, Multiple Independent Installations**. TK Islam Ar Rahmah 48 is the pilot installation, not the permanent identity of the product core. A new school is a newly provisioned installation of the same product—not a new software project.

This Constitution is a permanent governance contract for product decisions, architecture, implementation, review, release, installation, and future sprint planning. It is not a feature PRD, feature blueprint, or implementation plan. All lower-level documents and source code must conform to it.

## Article 1 — Product First

The system is one reusable software product, not a collection of school projects. A request from one school must not become permanent school-specific source customization when configuration, structured data, branding, feature visibility, or a reusable product capability can satisfy it.

A new school must be activatable from the product core without rebuilding the application. Pilot urgency does not justify architecture that prevents reuse by another installation.

## Article 2 — One Product Core

All supported installations use:

- one canonical repository;
- one product mainline;
- one source-code line;
- one Prisma schema;
- one ordered migration history;
- one test suite;
- one release-versioning scheme;
- one product documentation set.

Permanent school forks, school branches, copied application folders, schema variants, migration forks, or duplicated feature modules are prohibited as the normal operating model.

## Article 3 — Independent Installations

Each school initially runs as an independent installation with its own:

- deployment and domain;
- database and backup;
- storage and media;
- environment and secrets;
- authentication boundary;
- users and sessions;
- School root and configuration;
- content and publications;
- audit history and operational logs.

The initial model does not use shared-database multi-tenancy. Operational isolation must not be confused with source-code duplication: installations remain instances of the same product release.

## Article 4 — Configuration over Hardcode

School variation must be represented as validated configuration, structured data, branding, and feature visibility. This includes, without limitation:

- school name, logo, favicon, colors, and typography tokens;
- navigation, homepage sections, footer columns, links, and labels;
- contact channels and social links;
- programs, taxonomies, CTAs, galleries, and testimonials;
- PPDB content and feature visibility.

The product core must not hardcode the identity, content, programs, contacts, colors, or school-specific rules of TK Islam Ar Rahmah 48. Existing pilot fallback values are temporary compatibility/installation seed data and must not become permanent product defaults.

## Article 5 — No-Code Before Custom Development

When a need can be fulfilled through the dashboard, configuration, structured content, provisioning, or safe module activation, those mechanisms take precedence over source-code changes.

Developers are appropriately required for new reusable features, defects, integrations, security, performance, architecture, and platform capability. They should not be required merely to change a logo, color, menu, program, contact, footer, banner, section order, or public copy.

## Article 6 — Reusable Features

New features must be designed as reusable product-core capabilities whenever another school could reasonably use them. Examples include attendance, finance, library, pickup, clinic, payment, and WhatsApp integration.

Optional features must use a safe activation/visibility mechanism rather than school-specific source variants. A feature is implemented once, tested once as a product capability, released through the product line, and made available to appropriate installations.

## Article 7 — Simple Before Flexible

The preferred design is the simplest design that satisfies the pilot, remains reusable, does not block reasonable evolution, and is easy to understand and operate.

The current phase must not build:

- an unrestricted visual page builder;
- arbitrary executable configuration;
- a rich HTML editor;
- multi-level approval chains;
- scheduled publishing;
- complete version history;
- a plugin marketplace;
- a control plane;
- centralized billing or fleet analytics;
- mass-deployment automation;
- a tenant switcher or organization selector;
- centralized identity or cross-school sessions.

Future capability is not a reason to implement current complexity without approved need.

## Article 8 — Structured and Safe Configuration

Configuration must be structured, typed, validated, bounded, and auditable. The system must not store or execute arbitrary JavaScript, component paths, SQL, raw unsafe HTML, unvalidated remote resources, or any executable code supplied as configuration.

Section types, renderers, icon keys, navigation locations, style tokens, and other behavior-affecting codes use safe application registries/allowlists. Configuration may select from supported behavior but cannot inject new behavior.

## Article 9 — Data Isolation

Each installation may read and modify only its own data. Initial isolation is primarily enforced by separate databases, storage, environments, secrets, domains, and authentication boundaries.

`School` is the root configuration entity for one installation. `schoolId` may remain for domain clarity, referential integrity, publication/media/audit ownership, testing, portability, and future compatibility. It must not be used to introduce tenant switching or shared-runtime complexity without explicit approval.

## Article 10 — Security by Default

Every feature must apply least privilege, server-side authorization, secure secret handling, validated input, safely encoded output, auditability, secure media processing, and a protected authentication boundary.

Global cross-school roles are not part of the initial model. Super Admin and School Admin authority applies only within the installation where the account exists. School Admin may publish in accordance with the approved product decision.

Credentials, tokens, cookies, connection strings, signed upload targets, personal data, and security-sensitive logs must never be exposed through source code, content data, Git history, client output, or reports.

## Article 11 — Stable Upgrade Path

Every supported product release must be applicable to supported installations without loss of users, data, branding, configuration, media, publications, or audit history.

Migrations must:

- come from one ordered canonical history;
- contain no school-specific name or operational data;
- work on a clean database;
- support upgrade from the previous supported version;
- be additive and backward-compatible where practical;
- document backup, rollback, or recovery considerations;
- be tested using isolated test databases.

## Article 12 — Backward Compatibility

Product-core changes must not break operating installations without an explicit, reviewed migration plan. Temporary compatibility bridges are permitted only when their scope, tests, constraints, exit criteria, and removal path are documented.

`PRIMARY_SCHOOL` is a temporary compatibility bridge. It may remain only until an approved installation provisioning flow and School root replace its pilot-specific role. Compatibility code must not be presented as the final product model.

## Article 13 — Canonical Domain Model

The domain model and schema must remain school-neutral and reusable. Fixed columns or enums are prohibited for naturally variable school concepts.

Collections or taxonomies should represent program category, gallery category, testimonial source, contact type, social network, navigation, footer links, CTAs, homepage sections, and similar extensible concepts. Enums are reserved for genuinely closed, stable product invariants.

## Article 14 — Clear Boundaries

The product must explicitly separate:

- product core;
- installation configuration;
- school content;
- infrastructure;
- environment secrets;
- media binary;
- publication state;
- compatibility fallback.

School content must not be embedded in product source code. Secrets must not be stored in the content database or repository. Large media binary must not be stored in PostgreSQL; the database stores metadata and storage references.

## Article 15 — Test as Product Contract

Tests verify reusable product capabilities, not only pilot outcomes. Depending on scope, reviews must consider unit, validation, permission, service, PostgreSQL integration, API authorization, migration, upgrade, clean-database, seeded-installation, publishing, configuration, media-abstraction, accessibility, security-regression, and public-regression tests.

Cross-tenant runtime testing is not required for the initial independent-installation model. Instead, the product must prove that a new installation can be provisioned and configured from the same product release without source-code modification.

Tests that touch PostgreSQL must guard against running on an unintended development or production database.

## Article 16 — Performance and Operational Simplicity

Architecture must be appropriate for small-to-medium schools. Prefer a modular monolith, predictable database access, controlled queries, safe caching, practical media optimization, simple deployment, observable errors, and straightforward backup/recovery.

Product scale is achieved initially through repeatable installation and reliable upgrade, not premature distributed infrastructure. Every new operational component must justify its maintenance, security, recovery, and cost burden.

## Article 17 — Documentation Is Part of the Product

Material changes must update relevant DDD, blueprint, ERD, API contract, architecture, PRD, permission, implementation, provisioning, migration, release, and operational documents.

Documentation must not lag behind implementation. Implementation Authority may be granted only after the governing documents for the scope receive explicit Product Owner approval.

## Article 18 — No Silent Scope Expansion

Codex must not add features, dependencies, infrastructure, schema, migrations, providers, integrations, deployment automation, or architectural patterns outside approved scope.

Additional findings are reported as recommendations, risks, contradictions, open decisions, or blockers. They are not silently implemented. Existing user changes outside scope must be preserved.

## Article 19 — Decision Hierarchy

Authority is ordered as follows:

1. Product Constitution
2. Explicit Product Owner decisions
3. Approved DDD and Architecture
4. Approved Blueprint and ERD
5. Approved API Contract and PRD
6. Implementation Plan
7. Source code

When conflict exists, the lower-authority artifact must be reviewed and brought into alignment. Codex must not resolve a material product, data, security, or architectural conflict by assumption.

## Article 20 — Primary Product KPI

The primary architecture KPI is:

> A second school can be activated without rebuilding the application.

Supporting indicators:

- no school-specific repository or permanent branch;
- no schema or migration fork;
- no duplicated source code or module;
- no hardcoded school branding in the product core;
- onboarding is primarily provisioning and configuration;
- new product features are implemented once;
- supported installations can adopt the same release line;
- each installation retains independent data and configuration.

## Request Classification Framework

Every material request must be classified before design or implementation.

### A. Installation Configuration

Examples: logo, colors, menu, program, contact, footer, homepage order, CTA, branding, and public content.

Action: use existing dashboard/configuration capability. Do not modify the product core when the configuration capability already exists. If the capability is missing but broadly reusable, classify the missing capability itself under B.

### B. Reusable Product Feature

Examples: attendance, payment, library, progress report, or reusable integration.

Action: design as a product-core capability that can be tested, released, documented, and optionally enabled for installations without a source variant.

### C. Installation-Specific Operational Need

Examples: initial import, domain setup, environment values, initial admin, an installation migration operation, or backup restoration.

Action: handle through provisioning, safe scripts, runbooks, data import, or operational procedure without forking the product core.

### D. Product Exception

A truly non-reusable need that cannot safely be configuration.

Action: implementation requires explicit Product Owner approval. The exception must document rationale, maintenance/security/upgrade impact, affected installation, exit strategy where possible, and why it must not automatically become a product pattern. A permanent fork requires a separate exceptional decision.

## Constitutional Definition of Done

A major feature or architecture review is not complete until all applicable checks pass:

- conforms to One Product Core;
- creates no school-specific source code;
- creates no schema or migration fork;
- uses configuration for branding/content variation;
- is reusable when it is a feature;
- keeps configuration structured and safe;
- applies server-side security and least privilege;
- validates inputs and safely handles outputs/media;
- is testable as a product capability;
- is backward-compatible or has an approved migration/recovery plan;
- updates all governing documentation;
- does not silently expand scope;
- can be used by a newly provisioned installation;
- does not break a supported existing installation;
- stores no media binary in PostgreSQL;
- exposes no secrets;
- audits sensitive/material changes;
- receives approval according to the Decision Hierarchy;
- passes actual quality gates without claiming unexecuted checks.

## Governance and Amendment

This Constitution may be changed only through:

1. a written amendment proposal;
2. rationale and problem statement;
3. impact analysis, including compatibility and installation effects;
4. a list of affected documents, modules, migrations, releases, and operations;
5. Product Owner review;
6. explicit Product Owner approval;
7. a Constitution version change;
8. an Amendment History entry;
9. synchronization of all lower-authority artifacts.

Codex must not amend this Constitution unilaterally. An urgent implementation request does not override this process unless the Product Owner explicitly issues a constitutional amendment or an approved time-bounded exception.

## Constitutional Review Record

Every major sprint review should record:

- request classification (A/B/C/D);
- applicable Articles;
- detected conflicts and resolution authority;
- configuration vs feature decision;
- installation and upgrade impact;
- security, migration, test, and documentation evidence;
- Product Owner approval state.

## Amendment History

| Version | Date | Amendment |
| --- | --- | --- |
| 1.0 | 2026-07-20 | Initial Product Constitution established after Sprint 5.1 Product-First Architecture Correction. |
