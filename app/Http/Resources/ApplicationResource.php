<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApplicationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'priority' => $this->priority,
            'notes' => $this->notes,
            'submitted_at' => $this->submitted_at?->toDateTimeString(),
            'decision_at' => $this->decision_at?->toDateTimeString(),
            'created_at' => $this->created_at?->toDateTimeString(),
            'program' => new ProgramResource($this->whenLoaded('program')),
            'admission_call' => $this->whenLoaded('admissionCall', fn () => [
                'id' => $this->admissionCall->id,
                'intake_year' => $this->admissionCall->intake_year,
                'deadline' => $this->admissionCall->deadline?->toDateString(),
            ]),
            'documents_count' => $this->whenCounted('documents'),
            'documents' => ApplicationDocumentResource::collection($this->whenLoaded('documents')),
            'tasks' => $this->whenLoaded('tasks'),
        ];
    }
}
