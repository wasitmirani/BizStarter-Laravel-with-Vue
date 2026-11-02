<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WhatsAppAccount extends Model
{
    protected $table = 'whatsapp_accounts';

    protected $guarded = [];

    protected $casts = [
        'access_token' => 'encrypted',
        'is_active' => 'boolean',
        'connected_at' => 'datetime',
    ];

    protected $hidden = ['access_token', 'verify_token'];

    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    public function conversations(): HasMany
    {
        return $this->hasMany(CrmConversation::class);
    }

    public function isConfigured(): bool
    {
        return filled($this->phone_number_id) && filled($this->access_token);
    }

    public function maskedToken(): ?string
    {
        $token = (string) $this->access_token;

        if ($token === '') {
            return null;
        }

        return str_repeat('•', 12) . substr($token, -6);
    }
}
