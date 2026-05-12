param(
  [string]$SourceDir = ".\assets\products",
  [string]$OutputDir = ".\assets\products",
  [string]$BackupDir = ".\assets\products-badge-watermark-backup",
  [string]$WatermarkText = "cosmetic_house.lk"
)

Add-Type -AssemblyName System.Drawing

function Get-EncoderInfo([string]$mimeType) {
  [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq $mimeType } | Select-Object -First 1
}

function Average-Color($bitmap, [int]$x1, [int]$y1, [int]$x2, [int]$y2) {
  $r = 0L; $g = 0L; $b = 0L; $count = 0L
  $x1 = [Math]::Max(0, $x1); $y1 = [Math]::Max(0, $y1)
  $x2 = [Math]::Min($bitmap.Width - 1, $x2); $y2 = [Math]::Min($bitmap.Height - 1, $y2)
  $stepX = [Math]::Max(1, [Math]::Floor(($x2 - $x1 + 1) / 24))
  $stepY = [Math]::Max(1, [Math]::Floor(($y2 - $y1 + 1) / 12))
  for ($y = $y1; $y -le $y2; $y += $stepY) {
    for ($x = $x1; $x -le $x2; $x += $stepX) {
      $c = $bitmap.GetPixel($x, $y)
      $r += $c.R; $g += $c.G; $b += $c.B; $count += 1
    }
  }
  if ($count -eq 0) { return [System.Drawing.Color]::White }
  return [System.Drawing.Color]::FromArgb([int]($r / $count), [int]($g / $count), [int]($b / $count))
}

function Color-Distance($a, $b) {
  return [Math]::Abs($a.R - $b.R) + [Math]::Abs($a.G - $b.G) + [Math]::Abs($a.B - $b.B)
}

function Is-Light($color) {
  return (($color.R * 0.299) + ($color.G * 0.587) + ($color.B * 0.114)) -gt 150
}

function Blend-Colors($a, $b, [double]$amount) {
  $amount = [Math]::Max(0, [Math]::Min(1, $amount))
  $r = [int](($a.R * (1 - $amount)) + ($b.R * $amount))
  $g = [int](($a.G * (1 - $amount)) + ($b.G * $amount))
  $bb = [int](($a.B * (1 - $amount)) + ($b.B * $amount))
  return [System.Drawing.Color]::FromArgb($r, $g, $bb)
}

function Fill-CoverFromEdges($bitmap, [int]$x, [int]$y, [int]$w, [int]$h) {
  $aboveY = [Math]::Max(0, $y - 3)
  $leftX = [Math]::Max(0, $x - 3)
  $fallback = Average-Color $bitmap ([Math]::Max(0, $x - $w)) ([Math]::Max(0, $y - $h)) ([Math]::Min($bitmap.Width - 1, $x + $w)) ([Math]::Min($bitmap.Height - 1, $y + $h))

  for ($py = $y; $py -lt [Math]::Min($bitmap.Height, $y + $h); $py++) {
    $verticalAmount = if ($h -gt 1) { [double](($py - $y) / $h) } else { 0 }
    for ($px = $x; $px -lt [Math]::Min($bitmap.Width, $x + $w); $px++) {
      $fromAbove = if ($aboveY -ge 0) { $bitmap.GetPixel($px, $aboveY) } else { $fallback }
      $fromLeft = if ($leftX -ge 0) { $bitmap.GetPixel($leftX, $py) } else { $fallback }
      $mixed = Blend-Colors $fromAbove $fromLeft 0.32
      $softened = Blend-Colors $mixed $fallback ([Math]::Min(0.28, $verticalAmount * 0.28))
      $bitmap.SetPixel($px, $py, $softened)
    }
  }
}

$resolvedSource = Resolve-Path -LiteralPath $SourceDir
New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
if (-not (Test-Path -LiteralPath $BackupDir)) {
  New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
  Copy-Item -Path (Join-Path $SourceDir "*.jpg") -Destination $BackupDir -Force
}

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
  $textBrush = $null
  $outputPath = Join-Path $OutputDir $file.Name
  $tempOutputPath = Join-Path ([System.IO.Path]::GetTempPath()) ("cosmetic-house-watermark-" + [System.Guid]::NewGuid().ToString() + $file.Extension)
  $savedTempPath = $null

  try {
    $image = [System.Drawing.Image]::FromFile($file.FullName)
    $canvas = New-Object System.Drawing.Bitmap $image.Width, $image.Height
    $graphics = [System.Drawing.Graphics]::FromImage($canvas)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.DrawImage($image, 0, 0, $image.Width, $image.Height)

    # Remove the previous rounded badge from the bottom-right corner.
    $badgeHeight = [Math]::Max(44, [Math]::Round($image.Height * 0.085))
    $badgeWidth = [Math]::Max(150, [Math]::Round($image.Width * 0.32))
    $margin = [Math]::Max(8, [Math]::Round([Math]::Min($image.Width, $image.Height) * 0.015))
    $coverX = [Math]::Max(0, $image.Width - $badgeWidth - ($margin * 2))
    $coverY = [Math]::Max(0, $image.Height - $badgeHeight - ($margin * 2))
    $coverW = [Math]::Min($image.Width - $coverX, $badgeWidth + ($margin * 2))
    $coverH = [Math]::Min($image.Height - $coverY, $badgeHeight + ($margin * 2))
    $stripHeight = [Math]::Min($coverH, [Math]::Max(1, $coverY))
    $stripY = [Math]::Max(0, $coverY - $stripHeight)
    $stripRect = New-Object System.Drawing.Rectangle $coverX, $stripY, $coverW, $stripHeight
    $strip = $canvas.Clone($stripRect, $canvas.PixelFormat)
    $destRect = New-Object System.Drawing.Rectangle $coverX, $coverY, $coverW, $coverH
    $graphics.DrawImage($strip, $destRect)
    $strip.Dispose()

    # Add a slight word-only watermark, away from product labels where possible.
    $fontSize = [Math]::Max(10, [Math]::Round([Math]::Min($image.Width, $image.Height) * 0.026))
    $fontSize = [Math]::Min($fontSize, 20)
    $font = New-Object System.Drawing.Font "Arial", $fontSize, ([System.Drawing.FontStyle]::Regular), ([System.Drawing.GraphicsUnit]::Pixel)
    $wmMargin = [Math]::Max(10, [Math]::Round([Math]::Min($image.Width, $image.Height) * 0.035))
    $x = $wmMargin
    $y = $wmMargin
    $placementColor = Average-Color $canvas ([int]$x) ([int]$y) ([int]($x + 180)) ([int]($y + 36))
    if (Is-Light $placementColor) {
      $textBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(72, 15, 15, 15))
    } else {
      $textBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(82, 255, 255, 255))
    }
    $graphics.DrawString($WatermarkText, $font, $textBrush, $x, $y)

    if ($file.Extension -match '^\.(jpg|jpeg|webp)$') {
      $canvas.Save($tempOutputPath, $jpegEncoder, $encoderParams)
    } else {
      $canvas.Save($tempOutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    }
    $savedTempPath = $tempOutputPath
    $processed += 1
  } catch {
    Write-Warning ("Skipped " + $file.Name + ": " + $_.Exception.Message)
  } finally {
    if ($textBrush) { $textBrush.Dispose() }
    if ($font) { $font.Dispose() }
    if ($graphics) { $graphics.Dispose() }
    if ($canvas) { $canvas.Dispose() }
    if ($image) { $image.Dispose() }
  }

  if ($savedTempPath -and (Test-Path -LiteralPath $savedTempPath)) {
    Move-Item -LiteralPath $savedTempPath -Destination $outputPath -Force
  }
}

Write-Output "Replaced badge with text watermark on $processed images"
