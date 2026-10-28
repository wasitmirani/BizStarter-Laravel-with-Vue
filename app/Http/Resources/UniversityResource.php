<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UniversityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $sources = $this->relationLoaded('officialSources') ? $this->officialSources : collect();
        $latestSource = $sources->sortByDesc('last_checked_at')->first();

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'official_website' => $this->official_website,
            'city' => $this->city,
            'region' => $this->region,
            'country' => $this->country,
            'country_name' => $this->country_name,
            'type' => $this->type,
            'admissions_page_url' => $this->admissions_page_url,
            'scholarship_source_url' => $this->scholarship_source_url,
            'description' => $this->description,
            'initials' => $this->initials(),
            'programs_count' => $this->whenCounted('programs'),
            'last_checked_at' => $latestSource?->last_checked_at?->toIso8601String(),
            'source_status' => $latestSource?->last_status,
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }

    /**
     * Two or three letter mark used by the catalog cards when no logo exists.
     */
    private function initials(): string
    {
        $ignored = ['university', 'universita', 'università', 'of', 'di', 'degli', 'della', 'del', 'the', 'and', 'e'];

        $words = collect(preg_split('/\s+/', (string) $this->name))
            ->map(fn ($word) => trim($word, ".,()'’"))
            ->filter()
            ->reject(fn ($word) => in_array(mb_strtolower($word), $ignored, true))
            ->values();

        if ($words->isEmpty()) {
            return mb_strtoupper(mb_substr((string) $this->name, 0, 2));
        }

        if ($words->count() === 1) {
            return mb_strtoupper(mb_substr($words->first(), 0, 2));
        }

        return mb_strtoupper($words->take(3)->map(fn ($word) => mb_substr($word, 0, 1))->implode(''));
    }
}
