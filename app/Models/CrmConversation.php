<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CrmConversation extends Model
{
    protected $table = 'crm_conversations';

    public const STATUS_OPEN = 'open';
    public const STATUS_PENDING = 'pending';
    public const STATUS_CLOSED = 'closed';

    public const CHANNEL_WHATSAPP = 'whatsapp';
    public const CHANNEL_INSTAGRAM = 'instagram';

    protected $guarded = [];

    protected $casts = [
        'last_message_at' => 'datetime',
        'closed_at' => 'datetime',
        'is_pinned' => 'boolean',
        'unread_count' => 'integer',
    ];

    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class);
    }

    public function contact(): BelongsTo
    {
        return $this->belongsTo(CrmContact::class, 'contact_id');
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(WhatsAppAccount::class, 'whatsapp_account_id');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(CrmMessage::class, 'conversation_id');
    }

    public function latestMessage(): HasMany
    {
        return $this->messages()->latest('id');
    }

    public function unreadMessages(): HasMany
    {
        return $this->messages()->where('direction', 'in')->whereNull('read_at');
    }

    public function isClosed(): bool
    {
        return $this->status === self::STATUS_CLOSED;
    }

    public function isInstagram(): bool
    {
        return $this->channel === self::CHANNEL_INSTAGRAM;
    }

    public function channelLabel(): string
    {
        return $this->isInstagram() ? 'Instagram' : 'WhatsApp';
    }

    public function touchActivity(CrmMessage $message): void
    {
        $this->forceFill([
            'last_message_at' => $message->created_at ?? now(),
            'last_message_preview' => $message->preview(),
            'unread_count' => $message->direction === 'in'
                ? $this->unread_count + 1
                : $this->unread_count,
        ])->save();
    }

    public function toConversationArray(bool $withContact = true): array
    {
        return [
            'id' => $this->id,
            'channel' => $this->channel ?: self::CHANNEL_WHATSAPP,
            'channel_label' => $this->channelLabel(),
            'status' => $this->status,
            'priority' => $this->priority,
            'subject' => $this->subject,
            'last_message_preview' => $this->last_message_preview,
            'last_message_at' => $this->last_message_at,
            'unread_count' => $this->unread_count,
            'is_pinned' => $this->is_pinned,
            'closed_at' => $this->closed_at,
            'assigned_to' => $this->assigned_to,
            'contact' => $withContact && $this->relationLoaded('contact')
                ? $this->contact->toContactArray()
                : null,
            'assignee' => $this->relationLoaded('assignee') && $this->assignee
                ? ['id' => $this->assignee->id, 'name' => $this->assignee->name]
                : null,
            'account' => $this->relationLoaded('account') && $this->account
                ? [
                    'id' => $this->account->id,
                    'name' => $this->account->name,
                    'channel' => $this->account->channel,
                    'username' => $this->account->instagram_username,
                    'phone_number' => $this->account->phone_number,
                    'configured' => $this->account->isConfigured(),
                ]
                : null,
            'latest_message' => $this->relationLoaded('latestMessage') && $this->latestMessage->first()
                ? $this->latestMessage->first()->toMessageArray()
                : null,
        ];
    }
}
