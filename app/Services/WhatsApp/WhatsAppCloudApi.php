<?php

namespace App\Services\WhatsApp;

use App\Models\CrmTemplate;
use App\Models\WhatsAppAccount;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

/**
 * Thin client for the official WhatsApp Business Cloud API.
 *
 * Every call is scoped to a workspace's WhatsApp account, so the same
 * application can serve multiple businesses with their own numbers.
 */
class WhatsAppCloudApi
{
    protected ?WhatsAppAccount $account = null;

    public function for(?WhatsAppAccount $account): static
    {
        $clone = clone $this;
        $clone->account = $account;

        return $clone;
    }

    public function configured(): bool
    {
        return $this->account?->isConfigured() ?? false;
    }

    /**
     * @return string The WhatsApp message id.
     */
    public function sendText(string $to, string $body): string
    {
        $response = $this->post('messages', [
            'messaging_product' => 'whatsapp',
            'recipient_type' => 'individual',
            'to' => $this->normalize($to),
            'type' => 'text',
            'text' => [
                'preview_url' => false,
                'body' => $body,
            ],
        ]);

        return $this->messageId($response);
    }

    /**
     * @param  array<int, string>  $parameters  Values for {{1}}, {{2}}, ...
     * @return string The WhatsApp message id.
     */
    public function sendTemplate(string $to, CrmTemplate $template, array $parameters = []): string
    {
        $payload = [
            'messaging_product' => 'whatsapp',
            'to' => $this->normalize($to),
            'type' => 'template',
            'template' => [
                'name' => $template->name,
                'language' => ['code' => $template->language ?: 'en_US'],
            ],
        ];

        if ($parameters !== []) {
            $payload['template']['components'] = [[
                'type' => 'body',
                'parameters' => array_map(
                    fn ($value) => ['type' => 'text', 'text' => (string) $value],
                    array_values($parameters)
                ),
            ]];
        }

        return $this->messageId($this->post('messages', $payload));
    }

    public function markRead(string $waMessageId): void
    {
        if (! $this->configured()) {
            return;
        }

        try {
            $this->post('messages', [
                'messaging_product' => 'whatsapp',
                'status' => 'read',
                'message_id' => $waMessageId,
            ]);
        } catch (RuntimeException $exception) {
            // Read receipts are cosmetic; never fail the request over them.
            Log::debug('WhatsApp read receipt failed: ' . $exception->getMessage());
        }
    }

    /**
     * Pull the message templates that live in the WhatsApp Business account.
     *
     * @return array<int, array<string, mixed>>
     */
    public function fetchTemplates(): array
    {
        if (! $this->configured() || blank($this->account->business_account_id)) {
            throw new RuntimeException('Add a business account ID before syncing templates.');
        }

        $response = Http::withToken($this->account->access_token)
            ->acceptJson()
            ->timeout(20)
            ->get($this->url($this->account->business_account_id . '/message_templates'), [
                'fields' => 'id,name,status,category,language,components',
                'limit' => 200,
            ]);

        $this->ensureOk($response);

        return $response->json('data') ?? [];
    }

    /**
     * Cheap connectivity check used by the settings screen.
     *
     * @return array<string, mixed>
     */
    public function verifyConnection(): array
    {
        if (! $this->configured()) {
            throw new RuntimeException('Add a phone number ID and access token first.');
        }

        $response = Http::withToken($this->account->access_token)
            ->acceptJson()
            ->timeout(20)
            ->get($this->url((string) $this->account->phone_number_id), [
                'fields' => 'display_phone_number,verified_name,quality_rating,status',
            ]);

        $this->ensureOk($response);

        return $response->json() ?? [];
    }

    public function verifySignature(string $payload, ?string $signature): bool
    {
        $secret = (string) config('services.whatsapp.app_secret');

        if ($secret === '') {
            // Without a secret we cannot verify; accept so local testing works.
            return true;
        }

        if (blank($signature)) {
            return false;
        }

        $expected = 'sha256=' . hash_hmac('sha256', $payload, $secret);

        return hash_equals($expected, $signature);
    }

    protected function post(string $path, array $payload): Response
    {
        if (! $this->configured()) {
            throw new RuntimeException('WhatsApp is not connected for this workspace.');
        }

        $response = Http::withToken($this->account->access_token)
            ->acceptJson()
            ->timeout(25)
            ->post($this->url($this->account->phone_number_id . '/' . ltrim($path, '/')), $payload);

        $this->ensureOk($response);

        return $response;
    }

    protected function ensureOk(Response $response): void
    {
        if ($response->successful()) {
            return;
        }

        $message = $response->json('error.message')
            ?? $response->json('error.error_user_msg')
            ?? 'WhatsApp API request failed (' . $response->status() . ').';

        throw new RuntimeException($message);
    }

    protected function messageId(Response $response): string
    {
        $id = $response->json('messages.0.id');

        if (blank($id)) {
            throw new RuntimeException('WhatsApp accepted the request but returned no message id.');
        }

        return (string) $id;
    }

    protected function url(string $path): string
    {
        $version = $this->account?->api_version
            ?: config('services.whatsapp.api_version', 'v21.0');

        return rtrim('https://graph.facebook.com/' . trim($version, '/') . '/' . ltrim($path, '/'), '/');
    }

    protected function normalize(string $phone): string
    {
        return preg_replace('/\D+/', '', $phone) ?? '';
    }
}
