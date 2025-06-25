# verify_rebuild.ps1: PowerShell-native version of the verification script
param(
    [Parameter(Mandatory=$true)][string]$Old,
    [Parameter(Mandatory=$true)][string]$New
)

function ExitWithError($msg) {
    Write-Host $msg -ForegroundColor Red
    exit 1
}

# 1. Inventory and diff
$oldFiles = Get-ChildItem -Path $Old -Recurse -File | ForEach-Object { $_.FullName.Substring($Old.Length+1) } | Sort-Object
$newFiles = Get-ChildItem -Path $New -Recurse -File | ForEach-Object { $_.FullName.Substring($New.Length+1) } | Sort-Object
$missing = Compare-Object $oldFiles $newFiles -PassThru | Where-Object { $_ -in $oldFiles }
if ($missing) {
    $missing | ForEach-Object { Write-Host "<missing> $_" }
    exit 1
}

# 2. Large-asset folders
$assetDirs = @('assets','static','media','models','data')
function GetAssetFiles($root) {
    $dirs = Get-ChildItem -Path $root -Recurse -Directory | Where-Object { $assetDirs -contains $_.Name }
    $files = @()
    foreach ($d in $dirs) {
        $files += Get-ChildItem -Path $d.FullName -Recurse -File
    }
    return $files
}
$oldAssetFiles = GetAssetFiles $Old
$newAssetFiles = GetAssetFiles $New
function GetFileHashTable($files) {
    $table = @{}
    foreach ($f in $files) {
        $table[$f.FullName.Substring($f.FullName.IndexOf(':')+2)] = (Get-FileHash $f.FullName -Algorithm SHA256).Hash
    }
    return $table
}
$oldAssetHashes = GetFileHashTable $oldAssetFiles
$newAssetHashes = GetFileHashTable $newAssetFiles
foreach ($k in $oldAssetHashes.Keys) {
    if (-not $newAssetHashes.ContainsKey($k) -or $oldAssetHashes[$k] -ne $newAssetHashes[$k]) {
        ExitWithError "Large-asset file checksum mismatch: $k"
    }
}

# 3. Build frontend and diff build/dist
function FindFrontend($root) {
    Get-ChildItem -Path $root -Recurse -Directory | Where-Object { $_.Name -eq 'frontend' } | Select-Object -First 1
}
$oldFE = FindFrontend $Old
$newFE = FindFrontend $New
if (-not $oldFE -or -not $newFE) { ExitWithError "No frontend found in one of the apps" }
Push-Location $oldFE.FullName
if (Test-Path package.json) { npm install; npm run build }
$oldBuild = Get-ChildItem -Directory -Path . | Where-Object { $_.Name -in @('build','dist') } | Select-Object -First 1
Pop-Location
Push-Location $newFE.FullName
if (Test-Path package.json) { npm install; npm run build }
$newBuild = Get-ChildItem -Directory -Path . | Where-Object { $_.Name -in @('build','dist') } | Select-Object -First 1
Pop-Location
if (-not $oldBuild -or -not $newBuild) { ExitWithError "Build/dist folder missing after build" }
$diff = Compare-Object -ReferenceObject (Get-ChildItem -Recurse -File -Path (Join-Path $oldFE.FullName $oldBuild.Name) | ForEach-Object { $_.FullName.Substring($oldFE.FullName.Length+1) }) -DifferenceObject (Get-ChildItem -Recurse -File -Path (Join-Path $newFE.FullName $newBuild.Name) | ForEach-Object { $_.FullName.Substring($newFE.FullName.Length+1) })
if ($diff) { ExitWithError "Frontend build/dist output differs" }

# 4. Backend tests
$testsDir = Join-Path $New 'tests'
if (Test-Path $testsDir) {
    Push-Location $New
    python -m unittest discover tests
    if ($LASTEXITCODE -ne 0) { ExitWithError "Backend tests failed" }
    Pop-Location
}

# 5. Start backend and check endpoints
$backendMain = Join-Path $New 'backend/main.py'
if (-not (Test-Path $backendMain)) { ExitWithError "No backend/main.py found" }
$uvicorn = Get-Command uvicorn -ErrorAction SilentlyContinue
if (-not $uvicorn) { ExitWithError "Uvicorn not found in PATH" }
$proc = Start-Process -FilePath "uvicorn" -ArgumentList "backend.main:app --host 127.0.0.1 --port 8000" -WorkingDirectory $New -PassThru
Start-Sleep -Seconds 5
function CheckEndpoint($url, $expected) {
    try {
        $resp = Invoke-WebRequest -Uri "http://127.0.0.1:8000$url" -Method GET -SkipCertificateCheck -UseBasicParsing -ErrorAction Stop
        $code = $resp.StatusCode
    } catch {
        $code = $_.Exception.Response.StatusCode.value__
    }
    if ($code -eq $expected) {
        Write-Host ("`u2713 $url -> $code") -ForegroundColor Green
    } else {
        Write-Host ("x $url returned $code (expected $expected)") -ForegroundColor Red
        Stop-Process -Id $proc.Id -Force
        exit 1
    }
}
CheckEndpoint "/health/" 200
CheckEndpoint "/api/status/" 200
CheckEndpoint "/login" 401
Stop-Process -Id $proc.Id -Force

Write-Host "ALL CHECKS PASSED" -ForegroundColor Green
exit 0
