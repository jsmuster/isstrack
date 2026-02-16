$header = @'
/*
 * © Arseniy Tomkevich. All rights reserved.
 * Proprietary software. Unauthorized copying, modification,
 * distribution, or commercial use is strictly prohibited.
 */

'@

$javaFiles = Get-ChildItem -Path "api" -Filter "*.java" -Recurse

foreach ($file in $javaFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Check if file already starts with the header
    if ($content.StartsWith("/*") -and $content.Contains("© Arseniy Tomkevich")) {
        Write-Host "Skipping $($file.Name) (already has header)"
        continue
    }
    
    # Add header to the beginning
    $newContent = $header + $content
    Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8
    Write-Host "Added header to $($file.Name)"
}

Write-Host "Done!"
