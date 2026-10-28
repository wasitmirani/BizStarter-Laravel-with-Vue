<?php

namespace App\Services\Admissions;

use App\Models\OfficialSource;
use App\Models\SourceSnapshot;
use App\Models\University;
use Illuminate\Http\Client\Pool;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Throwable;

/**
 * Re-checks the official catalogue URLs stored in the catalog.
 *
 * The service deliberately does not write programme facts (tuition, grades,
 * deadlines). It only records what the source returned so a human can review
 * it: HTTP status, a content hash, the page title/description and whether the
 * content changed since the previous snapshot.
 */
class CatalogSyncService
{
    /** Upper bound per request so one click cannot hold a worker forever. */
    public const MAX_SOURCES = 40;

    public const CONNECT_TIMEOUT = 5;

    public const TIMEOUT = 8;

    public function sync(?University $university = null): array
    {
        $sources = OfficialSource::query()
            ->when($university, fn ($query) => $query->where('university_id', $university->id))
            ->orderBy('id')
            ->limit(self::MAX_SOURCES)
            ->get();

        if ($sources->isEmpty()) {
            return [
                'checked' => 0,
                'ok' => 0,
                'failed' => 0,
                'remaining' => 0,
                'sources' => [],
            ];
        }

        $safeSources = $sources->filter(fn (OfficialSource $source) => $this->isSafeUrl((string) $source->url));
        $blocked = $sources->reject(fn (OfficialSource $source) => $this->isSafeUrl((string) $source->url));

        $responses = $safeSources->isEmpty()
            ? collect()
            : Http::pool(fn (Pool $pool) => $safeSources->map(
                fn (OfficialSource $source) => $pool
                    ->as((string) $source->id)
                    ->accept('text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8')
                    ->withHeaders([
                        'User-Agent' => 'UniPilotCatalogSync/1.0 (+https://unipilot.app/about)',
                    ])
                    ->connectTimeout(self::CONNECT_TIMEOUT)
                    ->timeout(self::TIMEOUT)
                    ->get((string) $source->url),
            )->all());

        $results = [];
        $ok = 0;
        $failed = 0;

        foreach ($sources as $source) {
            if ($blocked->contains('id', $source->id)) {
                $results[] = $this->record($source, 'blocked', null, null, 'Source URL is not a public HTTP(S) address.');
                $failed++;

                continue;
            }

            $response = $responses[(string) $source->id] ?? null;

            if ($response instanceof Response) {
                $status = $this->statusFor($response);
                $body = $response->body();
                $hash = hash('sha256', $body);
                $excerpt = $this->excerpt($body, $response);

                $results[] = $this->record($source, $status, $response->status(), $hash, $excerpt);
                $status === 'ok' ? $ok++ : $failed++;

                continue;
            }

            $message = $response instanceof Throwable ? $response->getMessage() : 'No response received.';
            $results[] = $this->record($source, 'error', null, null, Str::limit($message, 400));
            $failed++;
        }

        $remaining = OfficialSource::query()
            ->when($university, fn ($query) => $query->where('university_id', $university->id))
            ->count() - $sources->count();

        return [
            'checked' => count($results),
            'ok' => $ok,
            'failed' => $failed,
            'remaining' => max(0, $remaining),
            'sources' => $results,
        ];
    }

    private function statusFor(Response $response): string
    {
        if ($response->successful()) {
            return 'ok';
        }

        if ($response->redirect()) {
            return 'redirect';
        }

        return 'http_'.$response->status();
    }

    /**
     * Persist one source check and return the payload the UI consumes.
     */
    private function record(
        OfficialSource $source,
        string $status,
        ?int $httpStatus,
        ?string $hash,
        ?string $excerpt,
    ): array {
        $previous = $source->snapshots()->latest('captured_at')->first();

        $changed = $hash !== null
            && $previous?->content_hash !== null
            && ! hash_equals((string) $previous->content_hash, $hash);

        $source->forceFill([
            'last_checked_at' => now(),
            'last_status' => $status,
        ])->save();

        SourceSnapshot::create([
            'official_source_id' => $source->id,
            'content_hash' => $hash,
            'http_status' => $httpStatus,
            'changed' => $changed,
            'payload_excerpt' => $excerpt,
            'captured_at' => now(),
        ]);

        $this->prune($source);

        return [
            'id' => $source->id,
            'name' => $source->name,
            'url' => $source->url,
            'university_id' => $source->university_id,
            'status' => $status,
            'http_status' => $httpStatus,
            'changed' => $changed,
            'checked_at' => $source->last_checked_at?->toIso8601String(),
            'excerpt' => $excerpt,
        ];
    }

    /**
     * Keep the snapshot history useful without letting it grow forever.
     */
    private function prune(OfficialSource $source): void
    {
        $stale = $source->snapshots()
            ->orderByDesc('captured_at')
            ->pluck('id')
            ->slice(30)
            ->values();

        if ($stale->isNotEmpty()) {
            SourceSnapshot::whereIn('id', $stale)->delete();
        }
    }

    /**
     * Build a short, human-readable excerpt from the fetched page.
     */
    private function excerpt(string $body, Response $response): ?string
    {
        $title = null;
        if (preg_match('/<title[^>]*>(.*?)<\/title>/is', $body, $matches)) {
            $title = $this->clean($matches[1]);
        }

        $description = null;
        if (preg_match('/<meta[^>]+(?:name|property)=["\'](?:description|og:description)["\'][^>]+content=["\'](.*?)["\']/is', $body, $matches)) {
            $description = $this->clean($matches[1]);
        }

        $parts = array_values(array_filter([
            $title,
            $description,
            $response->header('Last-Modified') ? 'Last-Modified: '.$response->header('Last-Modified') : null,
        ]));

        if ($parts === []) {
            return null;
        }

        return Str::limit(implode(' — ', $parts), 500);
    }

    private function clean(string $value): string
    {
        $value = html_entity_decode(strip_tags($value), ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $value = preg_replace('/\s+/u', ' ', $value) ?? $value;

        return trim($value);
    }

    /**
     * Only allow public HTTP(S) endpoints. Source URLs are seeded by the
     * catalog team, but the check keeps a bad row from becoming an SSRF vector.
     */
    private function isSafeUrl(string $url): bool
    {
        $parts = parse_url($url);

        if (! is_array($parts) || ! in_array(strtolower($parts['scheme'] ?? ''), ['http', 'https'], true)) {
            return false;
        }

        $host = $parts['host'] ?? '';

        if ($host === '' || strcasecmp($host, 'localhost') === 0) {
            return false;
        }

        $ip = filter_var($host, FILTER_VALIDATE_IP);

        if ($ip !== false) {
            return filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false;
        }

        return true;
    }

    /**
     * @return Collection<int, array<string, mixed>>
     */
    public function history(OfficialSource $source): Collection
    {
        return $source->snapshots()->latest('captured_at')->limit(10)->get();
    }
}
