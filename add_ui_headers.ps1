$header = @"
/**
 * © Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */

"@

$files = Get-ChildItem -Path "c:\work\angjava\isstrack\ui\src" -Filter "*.ts" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Check if file already has the header
    if ($content -notlike $header + "*") {
        # Add header to the beginning
        $newContent = $header + $content
        Set-Content $file.FullName -Value $newContent -NoNewline
        Write-Host "Added header to: $($file.FullName)"
    } else {
        Write-Host "Header already exists: $($file.FullName)"
    }
}

Write-Host "Completed adding headers to all TypeScript files in UI folder."
