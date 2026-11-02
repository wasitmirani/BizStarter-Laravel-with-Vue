<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class CrmContact extends Model
{
    protected $table = 'crm_contacts';

    protected $guarded = [];

    protected $casts = [
        'opt_in' => 'boolean',
        'custom_fields' => 'array',
        'last_message_at' => 'datetime',
    ];

    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(CrmTag::class, 'crm_contact_tag', 'contact_id', 'tag_id');
    }

    public function conversations(): HasMany
    {
        return $this->hasMany(CrmConversation::class, 'contact_id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(CrmMessage::class, 'contact_id');
    }

    /**
     * Store phone numbers as digits only so lookups are stable.
     */
    public static function normalizePhone(?string $phone): string
    {
        return preg_replace('/\D+/', '', (string) $phone) ?? '';
    }

    public function displayPhone(): string
    {
        return $this->phone ? '+' . $this->phone : '';
    }

    public function initials(): string
    {
        return Str::of($this->name ?: '?')
            ->explode(' ')
            ->filter()
            ->take(2)
            ->map(fn ($part) => Str::upper(Str::substr($part, 0, 1)))
            ->implode('');
    }

    public function toContactArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'phone' => $this->phone,
            'display_phone' => $this->displayPhone(),
            'email' => $this->email,
            'company' => $this->company,
            'avatar_url' => $this->avatar_url,
            'source' => $this->source,
            'status' => $this->status,
            'notes' => $this->notes,
            'opt_in' => $this->opt_in,
            'custom_fields' => $this->custom_fields ?? [],
            'last_message_at' => $this->last_message_at,
            'created_at' => $this->created_at,
            'tags' => $this->relationLoaded('tags')
                ? $this->tags->map(fn (CrmTag $tag) => $tag->toTagArray())->values()->all()
                : [],
        ];
    }
}
