$APP = "planclock-ui"
$projectDir = "ui"
$dockerfile = Join-Path $projectDir "Dockerfile"
$hashPath = Join-Path $projectDir "docker.hash"
$envSource = Join-Path $projectDir "env-prod"
$envTarget = Join-Path $projectDir ".env"

$noCacheFlag = if ($args -contains "--force" -or $args -contains "--no-cache") { "--no-cache" } else { $null }
$envScript = Join-Path $projectDir "scripts\write-env.js"

Write-Host "[Build] Starting Docker build for $APP..." -ForegroundColor Cyan
Write-Host ("=" * 80) -ForegroundColor Cyan

if (-not (Test-Path $envSource)) {
    Write-Host "[Build] Missing env file: $envSource" -ForegroundColor Red
    exit 1
}

$envSourceResolved = (Resolve-Path $envSource).Path

if (-not (Test-Path $envScript)) {
    Write-Host "[Build] Missing env script: $envScript" -ForegroundColor Red
    exit 1
}

node $envScript $envSourceResolved
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

$buildArgs = @()
if ($noCacheFlag) {
    $buildArgs += $noCacheFlag
}
$buildArgs += @("-f", $dockerfile, "-t", $APP, $projectDir)

docker build @buildArgs
$buildExitCode = $LASTEXITCODE
Write-Host ("=" * 80) -ForegroundColor Cyan

if ($buildExitCode -ne 0) {
    Write-Host "`n[Build] Docker build failed with exit code $buildExitCode" -ForegroundColor Red
    exit $buildExitCode
}

Write-Host "`nExtracting image hash..." -ForegroundColor Cyan
$newHash = docker images --no-trunc --format "{{.ID}}" $APP | Select-Object -First 1

if (-not $newHash) {
    Write-Host "Failed to extract image hash" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $projectDir)) {
    New-Item -ItemType Directory -Path $projectDir -Force | Out-Null
}

$oldHash = if (Test-Path $hashPath) { Get-Content $hashPath } else { "" }

$newHash | Set-Content $hashPath -Force
Write-Host "Image ID: $newHash" -ForegroundColor Yellow

Write-Host "`n" -ForegroundColor Cyan
if ($oldHash -eq "") {
    Write-Host "[Build] Docker image built (first build)" -ForegroundColor Green
} elseif ($newHash -ne $oldHash) {
    Write-Host "[Build] Docker image built (new hash detected)" -ForegroundColor Green
    Write-Host "  Old hash: $oldHash" -ForegroundColor Gray
    Write-Host "  New hash: $newHash" -ForegroundColor Gray
} else {
    Write-Host "[Build] Docker image unchanged (same hash as last build)" -ForegroundColor Yellow
}

Write-Host "`n[Build] Build complete!" -ForegroundColor Green
