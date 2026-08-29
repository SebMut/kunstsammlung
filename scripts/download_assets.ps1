param(
    [Parameter(Mandatory = $true)]
    [string]$ManifestPath,

    [Parameter(Mandatory = $true)]
    [string]$RepositoryRoot
)

$ErrorActionPreference = "Stop"
$manifest = Get-Content -Raw -LiteralPath $ManifestPath | ConvertFrom-Json
$temporaryDirectory = Join-Path ([System.IO.Path]::GetTempPath()) "kunstsammlung-chatgpt-assets"
$cookieJar = Join-Path $temporaryDirectory "cookies.txt"
$sharePage = Join-Path $temporaryDirectory "share.html"

New-Item -ItemType Directory -Force -Path $temporaryDirectory | Out-Null
curl.exe -sS -L -c $cookieJar "https://chatgpt.com/share/$($manifest.shareId)" -o $sharePage

$completed = 0
foreach ($file in $manifest.files) {
    $destination = Join-Path $RepositoryRoot $file.targetPath
    $destinationDirectory = Split-Path -Parent $destination
    New-Item -ItemType Directory -Force -Path $destinationDirectory | Out-Null

    if ((Test-Path -LiteralPath $destination) -and (Get-Item -LiteralPath $destination).Length -gt 1000) {
        $completed++
        continue
    }

    $encodedShareId = [Uri]::EscapeDataString($manifest.shareId)
    $endpoint = "https://chatgpt.com/backend-api/files/download/$($file.fileId)?shared_conversation_id=$encodedShareId&inline=true&download_intent=false"
    $metadataPath = Join-Path $temporaryDirectory "$($file.fileId).json"
    curl.exe -sS -L -b $cookieJar $endpoint -o $metadataPath
    $metadata = Get-Content -Raw -LiteralPath $metadataPath | ConvertFrom-Json

    if ($metadata.status -ne "success" -or -not $metadata.download_url) {
        throw "Could not resolve $($file.fileId)."
    }

    curl.exe -sS -L $metadata.download_url -o $destination
    if ((Get-Item -LiteralPath $destination).Length -lt 1000) {
        throw "Downloaded file $destination is unexpectedly small."
    }

    $completed++
    if (($completed % 10) -eq 0 -or $completed -eq $manifest.files.Count) {
        Write-Output "Downloaded $completed / $($manifest.files.Count)"
    }
}

Write-Output "All $completed files are available."
