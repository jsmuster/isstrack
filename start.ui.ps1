$APP = "planclock-ui"
$projectDir = "ui"
$envSource = Join-Path $projectDir "env-local"
$envScript = Join-Path $projectDir "scripts\write-env.js"

if (-not (Test-Path $envSource)) {
    Write-Host "[Start] Missing env file: $envSource" -ForegroundColor Red
    exit 1
}

$envSourceResolved = (Resolve-Path $envSource).Path

if (-not (Test-Path $envScript)) {
    Write-Host "[Start] Missing env script: $envScript" -ForegroundColor Red
    exit 1
}

node $envScript $envSourceResolved
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

Write-Host "[Start] Launching UI..." -ForegroundColor Green
Set-Location $projectDir
npm start
