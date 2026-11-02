<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CrmTemplate extends Model
{
    protected $table = 'crm_templates';

    protected $guarded = [];

    protected $casts = [
        'buttons' => 'array',
        'variables' => 'array',
        'last_synced_at' => 'datetime',
    ];

    public const CATEGORIES = ['marketing', 'utility', 'authentication'];
    public const STATUSES = ['draft', 'pending', 'approved', 'rejected', 'paused'];

    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    public function variableCount(): int
    {
        preg_match_all('/{{\s*\d+\s*}}/', (string) $this->body, $matches);

        return count($matches[0]);
    }

    public function toTemplateArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'category' => $this->category,
            'language' => $this->language,
            'header_type' => $this->header_type,
            'header_text' => $this->header_text,
            'body' => $this->body,
            'footer' => $this->footer,
            'buttons' => $this->buttons ?? [],
            'variables' => $this->variables ?? [],
            'variable_count' => $this->variableCount(),
            'status' => $this->status,
            'external_id' => $this->external_id,
            'last_synced_at' => $this->last_synced_at,
            'created_at' => $this->created_at,
        ];
    }
}
