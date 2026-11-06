Add-Type -AssemblyName System.Drawing

$srcPath = "public\assets\thehealthystitch-logo-original.jpg"
if (-not (Test-Path $srcPath)) {
    $srcPath = "public\assets\thehealthystitch-logo.jpg"
}

$src = New-Object System.Drawing.Bitmap($srcPath)

# 740x740 centered at (500, 405)
$cropSize = 740
$cropX = 130
$cropY = 35

$cropped = New-Object System.Drawing.Bitmap($cropSize, $cropSize)
$g = [System.Drawing.Graphics]::FromImage($cropped)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

$srcRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropSize, $cropSize)
$destRect = New-Object System.Drawing.Rectangle(0, 0, $cropSize, $cropSize)

$g.DrawImage($src, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
$g.Dispose()

# Saturation and contrast enhancement:
# Saturation: 1.25, Contrast: 1.08, brightness offset: -0.02
$sat = 1.24
$r = 0.2126; $gr = 0.7152; $b = 0.0722
$sr = (1.0 - $sat) * $r
$sg = (1.0 - $sat) * $gr
$sb = (1.0 - $sat) * $b

$c = 1.08
$t = -0.02

$matrix = New-Object System.Drawing.Imaging.ColorMatrix
$matrix.Matrix00 = [float](($sr + $sat) * $c)
$matrix.Matrix01 = [float]($sr * $c)
$matrix.Matrix02 = [float]($sr * $c)

$matrix.Matrix10 = [float]($sg * $c)
$matrix.Matrix11 = [float](($sg + $sat) * $c)
$matrix.Matrix12 = [float]($sg * $c)

$matrix.Matrix20 = [float]($sb * $c)
$matrix.Matrix21 = [float]($sb * $c)
$matrix.Matrix22 = [float](($sb + $sat) * $c)

$matrix.Matrix33 = 1.0
$matrix.Matrix40 = [float]$t
$matrix.Matrix41 = [float]$t
$matrix.Matrix42 = [float]$t
$matrix.Matrix44 = 1.0

$ia = New-Object System.Drawing.Imaging.ImageAttributes
$ia.SetColorMatrix($matrix)

$enhanced = New-Object System.Drawing.Bitmap($cropSize, $cropSize)
$g2 = [System.Drawing.Graphics]::FromImage($enhanced)
$g2.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g2.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g2.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

$g2.DrawImage($cropped, $destRect, 0, 0, $cropSize, $cropSize, [System.Drawing.GraphicsUnit]::Pixel, $ia)
$g2.Dispose()
$ia.Dispose()
$cropped.Dispose()
$src.Dispose()

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]97)

$enhanced.Save("public\assets\thehealthystitch-logo.jpg", $codec, $encoderParams)
$enhanced.Dispose()

Write-Output "Successfully cropped and enhanced public\assets\thehealthystitch-logo.jpg"

