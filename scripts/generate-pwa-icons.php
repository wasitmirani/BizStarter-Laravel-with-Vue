<?php

/**
 * Generates minimal PWA icons (brand color + monogram) for public/icons/.
 * Requires ext-gd. Run: php scripts/generate-pwa-icons.php
 */

$base = dirname(__DIR__) . '/public/icons';
if (!is_dir($base)) {
    mkdir($base, 0755, true);
}

$sizes = [192, 512];

foreach ($sizes as $s) {
    $im = imagecreatetruecolor($s, $s);
    $bg = imagecolorallocate($im, 0, 40, 85); // matches --color-primary
    imagefill($im, 0, 0, $bg);
    $fg = imagecolorallocate($im, 255, 255, 255);
    $pad = (int) ($s * 0.18);
    $font = 5; // built-in font
    $text = 'LB';
    $tw = imagefontwidth($font) * strlen($text);
    $th = imagefontheight($font);
    $x = (int) (($s - $tw) / 2);
    $y = (int) (($s - $th) / 2);
    imagestring($im, $font, $x, $y, $text, $fg);
    $path = $base . '/icon-' . $s . '.png';
    imagepng($im, $path, 6);
    imagedestroy($im);
    fwrite(STDERR, "Wrote {$path}\n");
}

echo "Done.\n";
