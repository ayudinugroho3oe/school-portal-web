import { createHash, randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { config } from "dotenv";
import { Client } from "pg";

config({ path: ".env.test", override: true, quiet: true });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("DATABASE_URL is required for migration verification.");
const parsed = new URL(databaseUrl);
if (parsed.pathname !== "/arrahmah_sms_test") {
  throw new Error("Migration verification refuses to run outside arrahmah_sms_test.");
}

const projectRoot = resolve(import.meta.dirname, "..");
const sprint4Migrations = ["20260719000000_sms_foundation", "20260719010000_dynamic_school_content"];
const sprint521Migrations = [...sprint4Migrations, "20260720000000_add_canonical_school_root"];
const sprint523Migrations = [...sprint521Migrations, "20260720010000_add_cms_configuration_domain"];
const sprint524Migrations = [...sprint523Migrations, "20260720020000_add_media_foundation"];
const sprint525Migrations = [...sprint524Migrations, "20260720030000_add_structured_content_domain"];

function urlForSchema(schema: string) {
  const url = new URL(databaseUrl!);
  url.searchParams.set("schema", schema);
  return url.toString();
}

function runPrisma(url: string) {
  const result = spawnSync(process.execPath, ["node_modules/prisma/build/index.js", "migrate", "deploy"], {
    cwd: projectRoot,
    env: { ...process.env, DATABASE_URL: url },
    encoding: "utf8",
  });
  if (result.status !== 0) {
    throw new Error(`Prisma migration command failed without exposing connection details.\n${result.stderr}`);
  }
}

function runPrismaExpectFailure(url: string) {
  const result = spawnSync(process.execPath, ["node_modules/prisma/build/index.js", "migrate", "deploy"], {
    cwd: projectRoot,
    env: { ...process.env, DATABASE_URL: url },
    encoding: "utf8",
  });
  if (result.status === 0) throw new Error("Ambiguous Sprint 4 data must stop migration safely.");
}

async function withSearchPath<T>(schema: string, operation: (client: Client) => Promise<T>) {
  const client = new Client({ connectionString: databaseUrl });
  await client.connect();
  try {
    await client.query(`SET search_path TO "${schema}"`);
    return await operation(client);
  } finally {
    await client.end();
  }
}

async function applyHistoricalState(schema: string, migrations: readonly string[]) {
  await withSearchPath(schema, async (client) => {
    await client.query(`CREATE TABLE "_prisma_migrations" (
      "id" VARCHAR(36) PRIMARY KEY,
      "checksum" VARCHAR(64) NOT NULL,
      "finished_at" TIMESTAMPTZ,
      "migration_name" VARCHAR(255) NOT NULL,
      "logs" TEXT,
      "rolled_back_at" TIMESTAMPTZ,
      "started_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
      "applied_steps_count" INTEGER NOT NULL DEFAULT 0
    )`);

    for (const migration of migrations) {
      const sql = await readFile(resolve(projectRoot, "prisma", "migrations", migration, "migration.sql"), "utf8");
      const checksum = createHash("sha256").update(sql).digest("hex");
      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query(
          'INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "applied_steps_count") VALUES ($1, $2, NOW(), $3, 1)',
          [randomUUID(), checksum, migration],
        );
        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    }
  });
}

async function main() {
  const suffix = randomUUID().replaceAll("-", "").slice(0, 12);
  const emptySchema = `school_root_empty_${suffix}`;
  const upgradeSchema = `school_root_upgrade_${suffix}`;
  const sprint521Schema = `configuration_upgrade_${suffix}`;
  const sprint523Schema = `media_upgrade_${suffix}`;
  const sprint524Schema = `content_upgrade_${suffix}`;
  const sprint525Schema = `publishing_upgrade_${suffix}`;
  const ambiguousSchema = `school_root_ambiguous_${suffix}`;
  const admin = new Client({ connectionString: databaseUrl });
  await admin.connect();

  try {
    await admin.query(`CREATE SCHEMA "${emptySchema}"`);
    await admin.query(`CREATE SCHEMA "${upgradeSchema}"`);
    await admin.query(`CREATE SCHEMA "${sprint521Schema}"`);
    await admin.query(`CREATE SCHEMA "${sprint523Schema}"`);
    await admin.query(`CREATE SCHEMA "${sprint524Schema}"`);
    await admin.query(`CREATE SCHEMA "${sprint525Schema}"`);
    await admin.query(`CREATE SCHEMA "${ambiguousSchema}"`);

    runPrisma(urlForSchema(emptySchema));
    await withSearchPath(emptySchema, async (client) => {
      const counts = await client.query('SELECT (SELECT COUNT(*) FROM "schools")::int AS schools, (SELECT COUNT(*) FROM "school_settings")::int AS settings');
      if (counts.rows[0].schools !== 0 || counts.rows[0].settings !== 0) {
        throw new Error("Clean migration must not invent installation identity or content.");
      }
    });

    await applyHistoricalState(upgradeSchema, sprint4Migrations);
    const settingsId = randomUUID();
    const actorId = randomUUID();
    const auditId = randomUUID();
    await withSearchPath(upgradeSchema, async (client) => {
      await client.query(
        'INSERT INTO "users" ("id", "name", "email", "emailVerified", "role", "createdAt", "updatedAt") VALUES ($1, $2, $3, false, \'SUPER_ADMIN\', NOW(), NOW())',
        [actorId, "Migration Test Admin", `migration-${suffix}@example.invalid`],
      );
      await client.query(
        'INSERT INTO "school_settings" ("id", "key", "schoolCode", "schoolName", "isActive", "timezone", "locale", "createdAt", "updatedAt") VALUES ($1, \'PRIMARY_SCHOOL\', $2, $3, true, \'Asia/Jakarta\', \'id-ID\', NOW(), NOW())',
        [settingsId, `TEST_${suffix.toUpperCase()}`, "Migration Test School"],
      );
      await client.query(
        'INSERT INTO "audit_logs" ("id", "actorUserId", "action", "entityType", "entityId", "afterData", "requestId", "createdAt") VALUES ($1, $2, \'TEST_EXISTING_AUDIT\', \'SchoolSettings\', $3, \'{}\'::jsonb, $4, NOW())',
        [auditId, actorId, settingsId, `migration-${suffix}`],
      );
    });

    runPrisma(urlForSchema(upgradeSchema));
    await withSearchPath(upgradeSchema, async (client) => {
      const result = await client.query(
        'SELECT s."id" AS "schoolId", ss."id" AS "settingsId", ss."schoolId" AS "linkedSchoolId", (SELECT COUNT(*) FROM "users")::int AS users, (SELECT COUNT(*) FROM "audit_logs")::int AS audits FROM "schools" s JOIN "school_settings" ss ON ss."schoolId" = s."id"',
      );
      const row = result.rows[0];
      if (result.rowCount !== 1 || row.schoolId !== settingsId || row.settingsId !== settingsId || row.linkedSchoolId !== settingsId) {
        throw new Error("Sprint 4 data was not mapped deterministically to one canonical School.");
      }
      if (row.users !== 1 || row.audits !== 1) throw new Error("Upgrade migration did not preserve existing user and audit records.");
    });

    await applyHistoricalState(sprint521Schema, sprint521Migrations);
    const sprint521SchoolId = randomUUID();
    await withSearchPath(sprint521Schema, async (client) => {
      await client.query(
        'INSERT INTO "schools" ("id", "schoolCode", "schoolName", "isActive", "timezone", "locale", "createdAt", "updatedAt") VALUES ($1, $2, $3, true, \'Asia/Jakarta\', \'id-ID\', NOW(), NOW())',
        [sprint521SchoolId, `S521_${suffix.toUpperCase()}`, "Sprint 5.2.1 Upgrade School"],
      );
      await client.query(
        'INSERT INTO "school_settings" ("id", "schoolId", "key", "schoolCode", "schoolName", "isActive", "timezone", "locale", "createdAt", "updatedAt") VALUES ($1, $1, \'PRIMARY_SCHOOL\', $2, $3, true, \'Asia/Jakarta\', \'id-ID\', NOW(), NOW())',
        [sprint521SchoolId, `S521_${suffix.toUpperCase()}`, "Sprint 5.2.1 Upgrade School"],
      );
    });

    await applyHistoricalState(sprint523Schema, sprint523Migrations);
    const sprint523SchoolId = randomUUID();
    await withSearchPath(sprint523Schema, async (client) => {
      await client.query(
        'INSERT INTO "schools" ("id", "schoolCode", "schoolName", "isActive", "timezone", "locale", "createdAt", "updatedAt") VALUES ($1, $2, $3, true, \'Asia/Jakarta\', \'id-ID\', NOW(), NOW())',
        [sprint523SchoolId, `S523_${suffix.toUpperCase()}`, "Sprint 5.2.3 Upgrade School"],
      );
      await client.query(
        'INSERT INTO "school_settings" ("id", "schoolId", "key", "schoolCode", "schoolName", "isActive", "timezone", "locale", "createdAt", "updatedAt") VALUES ($1, $1, \'PRIMARY_SCHOOL\', $2, $3, true, \'Asia/Jakarta\', \'id-ID\', NOW(), NOW())',
        [sprint523SchoolId, `S523_${suffix.toUpperCase()}`, "Sprint 5.2.3 Upgrade School"],
      );
      await client.query('INSERT INTO "contact_channels" ("id", "schoolId", "typeCode", "label", "value", "sortOrder", "isActive", "createdAt", "updatedAt", "updatedByUserId") VALUES ($1,$2,\'EMAIL\',\'Email\',\'test@example.invalid\',0,true,NOW(),NOW(),$3)', [randomUUID(), sprint523SchoolId, randomUUID()]);
    });

    await applyHistoricalState(sprint524Schema, sprint524Migrations);
    const sprint524SchoolId=randomUUID();
    await withSearchPath(sprint524Schema,async client=>{await client.query('INSERT INTO "schools" ("id","schoolCode","schoolName","isActive","timezone","locale","createdAt","updatedAt") VALUES ($1,$2,$3,true,\'Asia/Jakarta\',\'id-ID\',NOW(),NOW())',[sprint524SchoolId,`S524_${suffix.toUpperCase()}`,"Sprint 5.2.4 School"]);await client.query('INSERT INTO "media_assets" ("id","schoolId","storageProvider","storageKey","originalFilename","mimeType","sizeBytes","checksum","status","createdBy","createdAt","updatedAt") VALUES ($1,$2,\'TEST\',\'test/key.jpg\',\'key.jpg\',\'image/jpeg\',3,$3,\'ACTIVE\',$4,NOW(),NOW())',[randomUUID(),sprint524SchoolId,"c".repeat(64),randomUUID()]);});
    runPrisma(urlForSchema(sprint524Schema));
    await withSearchPath(sprint524Schema,async client=>{const r=await client.query('SELECT (SELECT COUNT(*) FROM "media_assets")::int media,(SELECT COUNT(*) FROM "programs")::int programs');if(r.rows[0].media!==1||r.rows[0].programs!==0)throw new Error("Sprint 5.2.4 upgrade did not preserve media or initialize structured content safely.");});

    await applyHistoricalState(sprint525Schema,sprint525Migrations);
    const sprint525SchoolId=randomUUID();
    await withSearchPath(sprint525Schema,async client=>{await client.query('INSERT INTO "schools" ("id","schoolCode","schoolName","isActive","timezone","locale","createdAt","updatedAt") VALUES ($1,$2,$3,true,\'Asia/Jakarta\',\'id-ID\',NOW(),NOW())',[sprint525SchoolId,`S525_${suffix.toUpperCase()}`,"Sprint 5.2.5 School"]);await client.query('INSERT INTO "programs" ("id","schoolId","code","title","slug","summary","description","sortOrder","isActive","createdAt","updatedAt") VALUES ($1,$2,\'EXISTING\',\'Existing\',\'existing\',\'Summary\',\'Description\',0,true,NOW(),NOW())',[randomUUID(),sprint525SchoolId]);});
    runPrisma(urlForSchema(sprint525Schema));
    await withSearchPath(sprint525Schema,async client=>{const r=await client.query('SELECT (SELECT COUNT(*) FROM "programs")::int programs,(SELECT COUNT(*) FROM "content_publications")::int publications,(SELECT "status"::text FROM "programs" LIMIT 1) status');if(r.rows[0].programs!==1||r.rows[0].publications!==0||r.rows[0].status!=="DRAFT")throw new Error("Sprint 5.2.5 upgrade did not preserve working content or initialize publishing safely.");});
    runPrisma(urlForSchema(sprint523Schema));
    await withSearchPath(sprint523Schema, async (client) => {
      const result = await client.query('SELECT (SELECT COUNT(*) FROM "schools")::int AS schools, (SELECT COUNT(*) FROM "contact_channels")::int AS contacts, (SELECT COUNT(*) FROM "media_assets")::int AS media');
      if (result.rows[0].schools !== 1 || result.rows[0].contacts !== 1 || result.rows[0].media !== 0) throw new Error("Sprint 5.2.3 upgrade did not preserve configuration data or initialize media safely.");
    });
    runPrisma(urlForSchema(sprint521Schema));
    await withSearchPath(sprint521Schema, async (client) => {
      const result = await client.query(
        'SELECT (SELECT COUNT(*) FROM "schools")::int AS schools, (SELECT COUNT(*) FROM "school_settings")::int AS settings, (SELECT COUNT(*) FROM "contact_channels")::int AS contacts, (SELECT COUNT(*) FROM "social_links")::int AS socials, (SELECT COUNT(*) FROM "call_to_actions")::int AS ctas',
      );
      const row = result.rows[0];
      if (row.schools !== 1 || row.settings !== 1 || row.contacts !== 0 || row.socials !== 0 || row.ctas !== 0) {
        throw new Error("Sprint 5.2.1 upgrade did not preserve the canonical root or initialize empty configuration tables safely.");
      }
    });

    await applyHistoricalState(ambiguousSchema, sprint4Migrations);
    await withSearchPath(ambiguousSchema, async (client) => {
      for (const index of [1, 2]) {
        await client.query(
          'INSERT INTO "school_settings" ("id", "key", "schoolCode", "schoolName", "isActive", "timezone", "locale", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, true, \'Asia/Jakarta\', \'id-ID\', NOW(), NOW())',
          [randomUUID(), `LEGACY_${index}`, `AMB_${suffix.toUpperCase()}_${index}`, `Ambiguous School ${index}`],
        );
      }
    });
    runPrismaExpectFailure(urlForSchema(ambiguousSchema));
    await withSearchPath(ambiguousSchema, async (client) => {
      const settings = await client.query('SELECT COUNT(*)::int AS count FROM "school_settings"');
      const schoolTable = await client.query("SELECT to_regclass('schools') AS table_name");
      if (settings.rows[0].count !== 2 || schoolTable.rows[0].table_name !== null) {
        throw new Error("Failed ambiguous migration must preserve legacy records and leave no partial School table.");
      }
    });

    console.log("Migration verification passed for clean, Sprint 4, Sprint 5.2.1, Sprint 5.2.3, Sprint 5.2.4, Sprint 5.2.5, and ambiguous-data safety states.");
  } finally {
    await admin.query(`DROP SCHEMA IF EXISTS "${emptySchema}" CASCADE`);
    await admin.query(`DROP SCHEMA IF EXISTS "${upgradeSchema}" CASCADE`);
    await admin.query(`DROP SCHEMA IF EXISTS "${sprint521Schema}" CASCADE`);
    await admin.query(`DROP SCHEMA IF EXISTS "${sprint523Schema}" CASCADE`);
    await admin.query(`DROP SCHEMA IF EXISTS "${sprint524Schema}" CASCADE`);
    await admin.query(`DROP SCHEMA IF EXISTS "${sprint525Schema}" CASCADE`);
    await admin.query(`DROP SCHEMA IF EXISTS "${ambiguousSchema}" CASCADE`);
    await admin.end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "School root migration verification failed.");
  process.exitCode = 1;
});
