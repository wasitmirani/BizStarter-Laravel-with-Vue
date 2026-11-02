<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CrmCampaign extends Model
{
    protected $table = 'crm_campaigns';

    protected $guarded = [];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'sent_at' => 'datetime',
        'total_recipients' => 'integer',
        'sent_count' => 'integer',
        'delivered_count' => 'integer',
        'failed_count' => 'integer',
    ];

    public const STATUS_DRAFT = 'draft';
    public const STATUS_SCHEDULED = 'scheduled';
    public const STATUS_SENDING = 'sending';
    public const STATUS_SENT = 'sent';
    public const STATUS_FAILED = 'failed';
    public const STATUS_CANCELLED = 'cancelled';

    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(CrmTemplate::class, 'template_id');
    }

    public function audienceTag(): BelongsTo
    {
        return $this->belongsTo(CrmTag::class, 'audience_tag_id');
    }

    public function recipients(): HasMany
    {
        return $this->hasMany(CrmCampaignRecipient::class, 'campaign_id');
    }

    public function isDraft(): bool
    {
        return $this->status === self::STATUS_DRAFT;
    }

    public function canSend(): bool
    {
        return in_array($this->status, [self::STATUS_DRAFT, self::STATUS_FAILED, self::STATUS_SCHEDULED], true);
    }

    public function deliveryRate(): float
    {
        $sent = (int) $this->sent_count;

        if ($sent === 0) {
            return 0.0;
        }

        return round((int) $this->delivered_count / $sent * 100, 1);
    }

    public function toCampaignArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'message_body' => $this->message_body,
            'status' => $this->status,
            'scheduled_at' => $this->scheduled_at,
            'sent_at' => $this->sent_at,
            'total_recipients' => $this->total_recipients,
            'sent_count' => $this->sent_count,
            'delivered_count' => $this->delivered_count,
            'failed_count' => $this->failed_count,
            'delivery_rate' => $this->deliveryRate(),
            'template' => $this->relationLoaded('template') && $this->template
                ? $this->template->toTemplateArray()
                : null,
            'audience_tag' => $this->relationLoaded('audienceTag') && $this->audienceTag
                ? $this->audienceTag->toTagArray()
                : null,
            'created_at' => $this->created_at,
        ];
    }
}
