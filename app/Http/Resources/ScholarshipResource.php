<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ScholarshipResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $call = $this->relationLoaded('calls')
            ? $this->calls
                ->filter(fn ($item) => $item->deadline === null || ! $item->deadline->isPast())
                ->sortBy(fn ($item) => $item->deadline?->timestamp ?? PHP_INT_MAX)
                ->first()
            : $this->nextCall();

        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'provider' => $this->provider,
            'region' => $this->region,
            'type' => $this->type,
            'description' => $this->description,
            'eligibility_criteria' => $this->eligibility_criteria ?? [],
            'benefits' => $this->benefits,
            'required_documents' => $this->required_documents ?? [],
            'application_url' => $this->application_url,
            'source_url' => $this->source_url,
            'verification_status' => $this->verification_status,
            'verified_at' => $this->verified_at?->toDateString(),
            'is_sample' => $this->is_sample,
            'next_call' => $call ? [
                'intake_year' => $call->intake_year,
                'opens_at' => $call->opens_at?->toDateString(),
                'deadline' => $call->deadline?->toDateString(),
                'source_url' => $call->source_url,
                'status' => $call->status,
            ] : null,
        ];
    }
}
