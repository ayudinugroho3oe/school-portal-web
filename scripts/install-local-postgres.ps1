param(
  [Parameter(Mandatory = $true)][string]$ArchivePath,
  [Parameter(Mandatory = $true)][string]$WorkspacePath
)

$ErrorActionPreference = "Stop"
$errorLog = Join-Path $env:TEMP "arrahmah-pg-install-error.log"
Remove-Item -LiteralPath $errorLog -Force -ErrorAction SilentlyContinue
trap {
  [IO.File]::WriteAllText($errorLog, $_.Exception.Message, [Text.UTF8Encoding]::new($false))
  exit 1
}
$installRoot = "C:\Program Files\PostgreSQL\17"
$dataRoot = "C:\ProgramData\ArRahmahSMS\PostgreSQL17\data"
$serviceName = "ArRahmahSMSPostgreSQL17"

function New-Secret([int]$length = 48) {
  $alphabet = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  $bytes = [byte[]]::new($length)
  $generator = [Security.Cryptography.RandomNumberGenerator]::Create()
  try { $generator.GetBytes($bytes) } finally { $generator.Dispose() }
  -join ($bytes | ForEach-Object { $alphabet[$_ % $alphabet.Length] })
}

if (Get-Service -Name $serviceName -ErrorAction SilentlyContinue) {
  Write-Output "PostgreSQL service already exists; installation skipped."
  exit 0
}
if (-not (Test-Path -LiteralPath "$installRoot\bin\postgres.exe")) {
  if (Test-Path -LiteralPath $installRoot) { throw "PostgreSQL install target is incomplete and requires manual inspection." }
  New-Item -ItemType Directory -Path $installRoot -Force | Out-Null
  tar.exe -xf $ArchivePath -C $installRoot --strip-components=1
}
if (-not (Test-Path -LiteralPath "$installRoot\bin\postgres.exe")) { throw "PostgreSQL binary extraction failed." }

New-Item -ItemType Directory -Path $dataRoot -Force | Out-Null
$postgresPassword = New-Secret
$devPassword = New-Secret
$testPassword = New-Secret
$authSecret = New-Secret 64
$testAuthSecret = New-Secret 64
$bootstrapPassword = New-Secret 40
$passwordFile = Join-Path $env:TEMP ("pg-init-" + [guid]::NewGuid().ToString("N") + ".txt")

try {
  [IO.File]::WriteAllText($passwordFile, $postgresPassword, [Text.UTF8Encoding]::new($false))
  & "$installRoot\bin\initdb.exe" -D $dataRoot -U postgres -E UTF8 --locale=C --auth-host=scram-sha-256 --auth-local=scram-sha-256 --pwfile=$passwordFile
  if ($LASTEXITCODE -ne 0) { throw "initdb failed." }
} finally {
  Remove-Item -LiteralPath $passwordFile -Force -ErrorAction SilentlyContinue
}

Add-Content -LiteralPath "$dataRoot\postgresql.conf" -Value "`nlisten_addresses = '127.0.0.1,::1'`nport = 5432`npassword_encryption = 'scram-sha-256'"
& "$installRoot\bin\pg_ctl.exe" register -N $serviceName -D $dataRoot -S auto
if ($LASTEXITCODE -ne 0) { throw "Windows service registration failed." }
Start-Service -Name $serviceName

$env:PGPASSWORD = $postgresPassword
$sql = @"
CREATE ROLE arrahmah_sms_dev_app LOGIN PASSWORD '$devPassword' NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT;
CREATE ROLE arrahmah_sms_test_app LOGIN PASSWORD '$testPassword' NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT;
CREATE DATABASE arrahmah_sms_dev OWNER arrahmah_sms_dev_app ENCODING 'UTF8' TEMPLATE template0;
CREATE DATABASE arrahmah_sms_test OWNER arrahmah_sms_test_app ENCODING 'UTF8' TEMPLATE template0;
REVOKE CONNECT ON DATABASE arrahmah_sms_dev FROM PUBLIC;
REVOKE CONNECT ON DATABASE arrahmah_sms_test FROM PUBLIC;
GRANT CONNECT ON DATABASE arrahmah_sms_dev TO arrahmah_sms_dev_app;
GRANT CONNECT ON DATABASE arrahmah_sms_test TO arrahmah_sms_test_app;
"@
$sql | & "$installRoot\bin\psql.exe" -h 127.0.0.1 -p 5432 -U postgres -d postgres -v ON_ERROR_STOP=1 --quiet
if ($LASTEXITCODE -ne 0) { throw "Database and role provisioning failed." }
Remove-Item Env:PGPASSWORD

$devUrl = "postgresql://arrahmah_sms_dev_app:$devPassword@127.0.0.1:5432/arrahmah_sms_dev"
$testUrl = "postgresql://arrahmah_sms_test_app:$testPassword@127.0.0.1:5432/arrahmah_sms_test"
$devEnv = @"
DATABASE_URL="$devUrl"
DIRECT_URL="$devUrl"
BETTER_AUTH_SECRET="$authSecret"
BETTER_AUTH_URL="http://localhost:3000"
BOOTSTRAP_SUPER_ADMIN_EMAIL="admin@arrahmah.local"
BOOTSTRAP_SUPER_ADMIN_PASSWORD="$bootstrapPassword"
BOOTSTRAP_SUPER_ADMIN_NAME="Super Admin"
BOOTSTRAP_SCHOOL_CODE="AR48"
BOOTSTRAP_SCHOOL_NAME="TK Islam Ar Rahmah 48"
"@
$testEnv = @"
DATABASE_URL="$testUrl"
DIRECT_URL="$testUrl"
BETTER_AUTH_SECRET="$testAuthSecret"
BETTER_AUTH_URL="http://localhost:3100"
"@
[IO.File]::WriteAllText((Join-Path $WorkspacePath ".env.local"), $devEnv, [Text.UTF8Encoding]::new($false))
[IO.File]::WriteAllText((Join-Path $WorkspacePath ".env.test"), $testEnv, [Text.UTF8Encoding]::new($false))

Write-Output "PostgreSQL native installation and isolated database provisioning completed."
