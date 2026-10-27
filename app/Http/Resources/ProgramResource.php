<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProgramResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $call = $this->relationLoaded('admissionCalls')
            ? $this->admissionCalls
                ->filter(fn ($item) => $item->deadline === null || ! $item->deadline->isPast())
                ->sortBy(fn ($item) => $item->deadline?->timestamp ?? PHP_INT_MAX)
                ->first()
            : $this->nextOpenCall();

        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'subject_area' => $this->subject_area,
            'degree_type' => $this->degree_type,
            'language' => $this->language,
            'duration_months' => $this->duration_months,
            'tuition' => [
                'min' => $this->tuition_min,
                'max' => $this->tuition_max,
                'currency' => $this->currency,
                'label' => $this->tuitionLabel(),
            ],
            'university' => new UniversityResource($this->whenLoaded('university')),
            'next_call' => $call ? [
                'id' => $call->id,
                'intake_year' => $call->intake_year,
                'intake_label' => $call->intake_label,
                'deadline' => $call->deadline?->toDateString(),
                'days_left' => $call->daysLeft(),
                'source_url' => $call->source_url,
                'verification_status' => $call->verification_status,
            ] : null,
            'requirements' => [
                'required_degree_level' => $this->required_degree_level,
                'minimum_grade_percentage' => $this->minimum_grade_percentage,
                'required_subjects' => $this->required_subjects ?? [],
                'required_language_test' => $this->required_language_test,
                'minimum_language_score' => $this->minimum_language_score,
                'minimum_work_experience_months' => $this->minimum_work_experience_months,
                'prerequisites' => $this->admission_prerequisites,
            ],
            'required_documents' => $this->required_documents ?? [],
            'application_url' => $this->application_url,
            'source_url' => $this->source_url,
            'verification_status' => $this->verification_status,
            'source_verified_at' => $this->source_verified_at?->toDateString(),
            'is_sample' => $this->is_sample,
            'assessment' => $this->whenLoaded('assessments', fn () => $this->assessments->first()),
            'bookmarked' => (bool) ($this->bookmarked ?? false),
        ];
    }
}
