<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class CrmMessage extends Model
{
    protected $table = 'crm_messages';

    protected $guarded = [];

    protected $casts = [
        'payload' => 'array',
        'sent_at' => 'datetime',
        'delivered_at' => 'datetime',
        'read_at' => 'datetime',
    ];

    public function conversation(): BelongsTo
    {
        return $this->belongsTo(CrmConversation::class, 'conversation_id');
    }

    public function contact(): BelongsTo
    {
        return $this->belongsTo(CrmContact::class, 'contact_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isInbound(): bool
    {
        return $this->direction === 'in';
    }

    public function preview(): string
    {
        if ($this->type === 'text') {
            return Str::limit((string) $this->body, 120);
        }

        return '[' . ucfirst($this->type) . '] ' . Str::limit((string) $this->body, 100);
    }

    /**
     * Media attached to an inbound webhook message, if any.
     *
     * @return array{type:string,mime_type:?string,filename:?string,download_url:string}|null
     */
    public function inboundMedia(): ?array
    {
        $payload = is_array($this->payload) ? $this->payload : [];

        // Instagram messaging webhooks carry attachments on message.attachments.
        $instagramAttachments = $payload['message']['attachments'] ?? null;

        if (is_array($instagramAttachments) && $instagramAttachments !== []) {
            $attachment = $instagramAttachments[0];
            $type = (string) ($attachment['type'] ?? 'file');
            $url = $attachment['payload']['url'] ?? null;

            if (blank($url)) {
                return null;
            }

            return [
                'type' => $type,
                'mime_type' => $this->media_mime,
                'filename' => $attachment['payload']['title'] ?? $this->media_filename,
                'direct_url' => $url,
                'download_url' => $url,
            ];
        }

        $type = (string) ($payload['type'] ?? $this->type);

        if (! in_array($type, ['image', 'video', 'document', 'audio', 'sticker'], true)) {
            return null;
        }

        $media = $payload[$type] ?? null;

        if (! is_array($media) || blank($media['id'] ?? null)) {
            return null;
        }

        return [
            'type' => $type,
            'mime_type' => $media['mime_type'] ?? $this->media_mime,
            'filename' => $media['filename'] ?? $this->media_filename,
            'direct_url' => null,
            'download_url' => '/api/app/crm/messages/' . $this->id . '/media',
        ];
    }

    public function toMessageArray(): array
    {
        return [
            'id' => $this->id,
            'conversation_id' => $this->conversation_id,
            'direction' => $this->direction,
            'type' => $this->type,
            'body' => $this->body,
            'media_url' => $this->media_url,
            'media_mime' => $this->media_mime,
            'media_filename' => $this->media_filename,
            'media' => $this->inboundMedia(),
            'template_name' => $this->template_name,
            'status' => $this->status,
            'error' => $this->error,
            'sent_at' => $this->sent_at,
            'delivered_at' => $this->delivered_at,
            'read_at' => $this->read_at,
            'created_at' => $this->created_at,
            'agent' => $this->relationLoaded('user') && $this->user
                ? ['id' => $this->user->id, 'name' => $this->user->name]
                : null,
        ];
    }
}
