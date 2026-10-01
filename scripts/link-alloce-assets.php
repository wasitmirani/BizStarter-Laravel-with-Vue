<?php

/**
 * Alloce theme JS hard-imports absolute "/assets/..." paths.
 * Point public/assets at public/backend/assets so those imports resolve.
 */

$public = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'public';
$link = $public . DIRECTORY_SEPARATOR . 'assets';
$target = $public . DIRECTORY_SEPARATOR . 'backend' . DIRECTORY_SEPARATOR . 'assets';

if (!is_dir($target)) {
    fwrite(STDERR, "[alloce] Missing target: {$target}\n");
    exit(1);
}

if (is_link($link) || (is_dir($link) && !is_dir($link . DIRECTORY_SEPARATOR . '..'))) {
    // Already linked or present
    if (realpath($link) === realpath($target)) {
        echo "[alloce] public/assets already linked.\n";
        exit(0);
    }
}

if (file_exists($link) || is_link($link)) {
    echo "[alloce] public/assets already exists; leave as-is.\n";
    exit(0);
}

if (PHP_OS_FAMILY === 'Windows') {
    $cmd = sprintf(
        'cmd /c mklink /J "%s" "%s"',
        str_replace('/', '\\', $link),
        str_replace('/', '\\', $target),
    );
    exec($cmd, $output, $code);
    if ($code !== 0) {
        fwrite(STDERR, "[alloce] Failed to create junction. Run manually:\n{$cmd}\n");
        exit($code);
    }
} else {
    if (!symlink($target, $link)) {
        fwrite(STDERR, "[alloce] Failed to symlink {$link} -> {$target}\n");
        exit(1);
    }
}

echo "[alloce] Linked public/assets -> public/backend/assets\n";
