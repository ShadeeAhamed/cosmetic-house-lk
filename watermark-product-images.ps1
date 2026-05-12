param(
  [string]$SourceDir = ".\assets\products",
  [string]$OutputDir = ".\assets\products-watermarked",
  [string]$LogoPath = ".\assets\brand\cosmetic-house-logo-inverse-diamond.png"
)

Add-Type -AssemblyName System.Drawing

function Get-EncoderInfo([string]$mimeType) {
  [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq $mimeType } | Select-Object -First 1
}

function New-RoundedRectanglePath([float]$x, [float]$y, [float]$w, [float]$h, [float]$r) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d = $r * 2
  $path.AddArc($x, $y, $d, $d, 180, 90)
  $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
  $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
  $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
  $path.CloseFigure()
  return $path
}

$resolvedSource = Resolve-Path -LiteralPath $SourceDir
$resolvedLogo = Resolve-Path -LiteralPath $LogoPath
New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null

$files = Get-ChildItem -LiteralPath $resolvedSource -File | Where-Object {
  $_.Extension -match '^\.(jpg|jpeg|png|webp)$'
}

$jpegEncoder = Get-EncoderInfo "image/jpeg"
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters 1
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 92L

$logoOriginal = [System.Drawing.Image]::FromFile($resolvedLogo)
$processed = 0

foreach ($file in $files) {
  $image = $null
  $canvas = $null
  $graphics = $null
  $logo = $null
  $badgePath = $null
  $brush = $null
  $textBrush = $null
  $font = $null

  try {
    $image = [System.Drawing.Image]::FromFile($file.FullName)
    $canvas = New-Object System.Drawing.Bitmap $image.Width, $image.Height
    $graphics = [System.Drawing.Graphics]::FromImage($canvas)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.DrawImage($image, 0, 0, $image.Width, $image.Height)

    $badgeHeight = [Math]::Max(34, [Math]::Round($image.Height * 0.055))
    $badgeHeight = [Math]::Min($badgeHeight, 58)
    $badgePaddingX = [Math]::Round($badgeHeight * 0.38)
    $logoSize = [Math]::Round($badgeHeight * 0.72)
    $fontSize = [Math]::Max(9, [Math]::Round($badgeHeight * 0.28))
    $font = New-Object System.Drawing.Font "Arial", $fontSize, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)
    $label = "Cosmetic House.lk"
    $textSize = $graphics.MeasureString($label, $font)
    $badgeWidth = [Math]::Round($logoSize + $textSize.Width + ($badgePaddingX * 2.6))
    $badgeWidth = [Math]::Min($badgeWidth, [Math]::Round($image.Width * 0.34))
    $margin = [Math]::Max(10, [Math]::Round([Math]::Min($image.Width, $image.Height) * 0.025))
    $x = $image.Width - $badgeWidth - $margin
    $y = $image.Height - $badgeHeight - $margin

    $badgePath = New-RoundedRectanglePath $x $y $badgeWidth $badgeHeight ([Math]::Round($badgeHeight / 2))
    $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(168, 10, 8, 10))
    $graphics.FillPath($brush, $badgePath)

    $logo = New-Object System.Drawing.Bitmap $logoOriginal, $logoSize, $logoSize
    $logoX = $x + [Math]::Round($badgePaddingX * 0.72)
    $logoY = $y + [Math]::Round(($badgeHeight - $logoSize) / 2)
    $graphics.DrawImage($logo, $logoX, $logoY, $logoSize, $logoSize)

    $textBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(245, 255, 255, 255))
    $textX = $logoX + $logoSize + [Math]::Round($badgePaddingX * 0.5)
    $textY = $y + [Math]::Round(($badgeHeight - $fontSize) / 2) - 1
    $graphics.DrawString($label, $font, $textBrush, $textX, $textY)

    $outputPath = Join-Path $OutputDir $file.Name
    if ($file.Extension -match '^\.(jpg|jpeg|webp)$') {
      $canvas.Save($outputPath, $jpegEncoder, $encoderParams)
    } else {
      $canvas.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    }
    $processed += 1
  } finally {
    if ($badgePath) { $badgePath.Dispose() }
    if ($font) { $font.Dispose() }
    if ($textBrush) { $textBrush.Dispose() }
    if ($brush) { $brush.Dispose() }
    if ($logo) { $logo.Dispose() }
    if ($graphics) { $graphics.Dispose() }
    if ($canvas) { $canvas.Dispose() }
    if ($image) { $image.Dispose() }
  }
}

$logoOriginal.Dispose()
Write-Output "Watermarked $processed images into $OutputDir"
