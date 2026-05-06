param(
    [Parameter(Mandatory=$true)]
    [string]$ExePath,

    [Parameter(Mandatory=$false)]
    [string]$OutputPath = ([System.IO.Path]::ChangeExtension($ExePath, ".ico"))
)

Add-Type -AssemblyName System.Drawing

$icon = [System.Drawing.Icon]::ExtractAssociatedIcon($ExePath)
if ($icon) {
    $icon.ToBitmap().Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Icon)
    Write-Output "Icon saved to: $OutputPath"
} else {
    Write-Error "No icon found in $ExePath"
}
