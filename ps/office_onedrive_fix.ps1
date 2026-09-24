$path = $env:LOCALAPPDATA + "\Microsoft\Office\16.0\OfficeFileCache\0"

Write-Output "Clearing: $path"

try {
    Remove-Item -Path $path -Recurse -Force -ErrorAction Stop
    Write-Output "Cleared $path. Press Enter to continue..."
}
catch [System.Management.Automation.ItemNotFoundException] {
    Write-Output "Path does not exist. Press Enter to continue..."
}
catch {
    Write-Output "Failed to clear $path"
}
finally {
    Read-Host
}
