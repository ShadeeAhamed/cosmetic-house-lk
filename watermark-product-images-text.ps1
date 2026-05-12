param(
  [string]$SourceDir = ".\assets\products-original-before-watermark",
  [string]$OutputDir = ".\assets\products",
  [string]$WatermarkText = "cosmetic_house.lk"
)

Add-Type -AssemblyName System.Drawing

function Get-EncoderInfo([string]$mimeType) {
  [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq $mimeType } | Select-Object -First 1
}

$resolvedSource = Resolve-Path -LiteralPath $SourceDir
$resolvedOutput = Resolve-Path -LiteralPath $OutputDir

New-Item -ItemType Directory -Path $resolvedOutput -Force | Out-Null

$files = Get-ChildItem -LiteralPath $resolvedSource -File | Where-Object {
  $_.Extension -match '^\.(jpg|jpeg|png|webp)$'
}

$jpegEncoder = Get-EncoderInfo "image/jpeg"
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters 1
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 92L

$processed = 0

foreach ($file in $files) {
  $image = $null
  $canvas = $null
  $graphics = $null
  $font = $null
  $shadowBrush = $null
  $textBrush = $null

  try {
    $image = [System.Drawing.Image]::FromFile($file.FullName)
    $canvas = New-Object System.Drawing.Bitmap $image.Width, $image.Height
    $graphics = [System.Drawing.Graphics]::FromImage($canvas)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.DrawImage($image, 0, 0, $image.Width, $image.Height)

    $fontSize = [Math]::Max(10, [Math]::Round([Math]::Min($image.Width, $image.Height) * 0.028))
    $fontSize = [Math]::Min($fontSize, 22)
    $font = New-Object System.Drawing.Font "Arial", $fontSize, ([System.Drawing.FontStyle]::Regular), ([System.Drawing.GraphicsUnit]::Pixel)
    $textSize = $graphics.MeasureString($WatermarkText, $font)
    $margin = [Math]::Max(10, [Math]::Round([Math]::Min($image.Width, $image.Height) * 0.035))

    # Top-left is least likely to cover product labels on most product packshots.
    $x = $margin
    $y = $margin

    $shadowBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(70, 255, 255, 255))
    $textBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(98, 15, 15, 15))
    $graphics.DrawString($WatermarkText, $font, $shadowBrush, $x + 1, $y + 1)
    $graphics.DrawString($WatermarkText, $font, $textBrush, $x, $y)

    $outputPath = Join-Path $resolvedOutput $file.Name
    if ($file.Extension -match '^\.(jpg|jpeg|webp)$') {
      $canvas.Save($outputPath, $jpegEncoder, $encoderParams)
    } else {
      $canvas.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    }
    $processed += 1
  } finally {
    if ($textBrush) { $textBrush.Dispose() }
    if ($shadowBrush) { $shadowBrush.Dispose() }
    if ($font) { $font.Dispose() }
    if ($graphics) { $graphics.Dispose() }
    if ($canvas) { $canvas.Dispose() }
    if ($image) { $image.Dispose() }
  }
}

Write-Output "Text-watermarked $processed images into $OutputDir"
