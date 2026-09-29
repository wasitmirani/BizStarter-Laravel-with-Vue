<?php

use Carbon\Carbon;
use Illuminate\Support\Str;
use Jenssegers\Agent\Agent;
use App\Models\DeviceHistory;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\HtmlString;

function perPage(): int
{
    return (int) config('app.per_page', 15);
}

/**
 * Send JSON response.
 */
function responseJson($message = 'success', $result = [], $status = true, $code = 200)
{
    return response()->json([
        'message' => $message,
        'status' => $status,
        'result' => $result,
    ], $code);
}

function genUUID(): string
{
    return (string) Str::uuid();
}

function mapFirstNameLastSlug($val, $val2 = null): string
{
    return Str::slug($val . '-' . $val2, '-');
}

function setSlug($val): string
{
    return (string) Str::slug($val, '-');
}

function setDateTimeFormat($date): ?string
{
    if (!$date) {
        return null;
    }

    return Carbon::parse($date)
        ->timezone(config('app.timezone', 'UTC'))
        ->format('d-m-Y h:i:s a');
}

function formatDate($date): string
{
    return date('Y-m-d', strtotime($date));
}

function uploadImage($path): string
{
    if (request()->hasFile('image')) {
        $name = '/' . request()->file('image')->store($path);
        $name = str_replace($path . '/', '', $name);
    } else {
        $name = '';
    }

    return $name;
}

function getImagePath($type): string
{
    return '/public/images/' . $type;
}

function getCurrency(): string
{
    return env('CURRENCY', '$');
}

function getYears(): array
{
    $years = range(1980, (int) date('Y'));

    return array_reverse($years);
}

function removeUrlFromThumbnail(string $type, string $value): string
{
    $type = trim($type, '/');
    $pattern = url("/storage/images/{$type}/");

    return str_replace($pattern, '', $value);
}

function fetchGeoLocation()
{
    $ip = request()->ip();
    if ($ip === '127.0.0.1') {
        return null;
    }

    try {
        $raw = @file_get_contents('http://ip-api.com/php/' . $ip);
        if (!$raw) {
            return null;
        }

        return unserialize($raw) ?: null;
    } catch (\Throwable $e) {
        return null;
    }
}

function logDeviceHistory(): void
{
    try {
        $agent = new Agent();
        $agent->setUserAgent(request()->header('User-Agent'));

        if ($agent->isPhone()) {
            $deviceType = 'mobile';
        } elseif ($agent->isTablet()) {
            $deviceType = 'tablet';
        } else {
            $deviceType = 'desktop';
        }

        DeviceHistory::create([
            'user_id' => auth()->id(),
            'device_name' => $agent->device(),
            'browser' => $agent->browser(),
            'platform' => $agent->platform(),
            'device_id' => request()->header('X-Device-ID'),
            'device_type' => $deviceType,
            'os_version' => $agent->version($agent->platform()),
            'app_version' => request()->header('X-App-Version'),
            'ip_address' => request()->ip(),
            'device_information' => fetchGeoLocation(),
            'last_login_at' => now(),
        ]);
    } catch (\Throwable $th) {
        Log::error('logDeviceHistory failed: ' . $th->getMessage());
    }
}

function shortTimer()
{
    return now()->addSeconds(60);
}

function sessionTimer()
{
    return now()->addMinutes(30);
}

function generateUserName($request): string
{
    return !empty($request->user_name)
        ? $request->user_name
        : strtolower(trim($request->first_name . ' ' . $request->last_name)) . rand(10, 1000900);
}

function responseMessage(string $msg, int $status_code = 422, $status = false): array
{
    return [
        'message' => $msg,
        'status_code' => $status_code,
        'status' => $status,
    ];
}

/**
 * Dynamically load built assets from Vite manifest.
 */
function loadBuiltAssets($entry = 'resources/ts/backend/app.ts')
{
    $manifestPath = public_path('build/manifest.json');

    if (!file_exists($manifestPath)) {
        return new HtmlString('<!-- Build manifest not found. Run: npm run build -->');
    }

    $manifest = json_decode(file_get_contents($manifestPath), true);

    if (!isset($manifest[$entry])) {
        return new HtmlString('<!-- Entry point not found in manifest -->');
    }

    $entryData = $manifest[$entry];
    $html = '';

    if (isset($entryData['css'])) {
        foreach ($entryData['css'] as $cssFile) {
            if (!empty($cssFile) && preg_match('/\.css$/', $cssFile)) {
                $html .= '<link rel="stylesheet" href="' . asset('build/' . $cssFile) . '">' . PHP_EOL;
            }
        }
    }

    if (isset($entryData['file']) && !empty($entryData['file']) && preg_match('/\.js$/', $entryData['file'])) {
        $html .= '<script type="module" src="' . asset('build/' . $entryData['file']) . '"></script>' . PHP_EOL;
    }

    return new HtmlString($html);
}
