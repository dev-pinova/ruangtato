Get-ChildItem -Path "src" -Include "*.tsx", "*.ts" -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if ($content -match "/app/studio") {
        $newContent = $content -replace "/app/studio/", "/studio/"
        $newContent = $newContent -replace "/app/studio`"", "/studio`""
        Set-Content -Path $_.FullName -Value $newContent -NoNewline
        Write-Host "Updated $($_.FullName)"
    }
}
