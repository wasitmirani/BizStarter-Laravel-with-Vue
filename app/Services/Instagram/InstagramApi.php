<?php

namespace App\Services\Instagram;

use App\Models\WhatsAppAccount;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

/**
 * Thin client for the official Instagram Messaging API (Meta Graph).
 *
 * Instagram professional accounts are driven through the linked Facebook
 * Page token, so credentials live on the workspace's "instagram" channel
 * account and never reach the browser.
 */
class InstagramApi
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
        return $this->account?->isInstagram() === true && $this->account->isConfigured();
    }

    /**
     * @return string The Instagram message id (`mid`).
     */
    public function sendText(string $recipientId, string $body): string
    {
        $response = $this->post('messages', [
            'recipient' => ['id' => $recipientId],
            'message' => ['text' => $body],
        ]);

        $id = $response->json('message_id');

        if (blank($id)) {
            throw new RuntimeException('Instagram accepted the request but returned no message id.');
        }

        return (string) $id;
    }

    /**
     * @return string The Instagram message id (`mid`).
     */
    public function sendAttachment(string $recipientId, string $type, string $url): string
    {
        $response = $this->post('messages', [
            'recipient' => ['id' => $recipientId],
            'message' => [
                'attachment' => [
                    'type' => $type,
                    'payload' => ['url' => $url],
                ],
            ],
        ]);

        $id = $response->json('message_id');

        if (blank($id)) {
            throw new RuntimeException('Instagram accepted the request but returned no message id.');
        }

        return (string) $id;
    }

    /**
     * Resolve a public profile for an Instagram-scoped id (IGSID).
     *
     * @return array<string, mixed>
     */
    public function fetchProfile(string $igsid): array
    {
        if (! $this->configured()) {
            return [];
        }

        try {
            $response = Http::withToken($this->account->access_token)
                ->acceptJson()
                ->timeout(15)
                ->get($this->url($igsid), [
                    'fields' => 'name,username,profile_pic',
                ]);

            $this->ensureOk($response);

            return $response->json() ?? [];
        } catch (RuntimeException $exception) {
            // Profile enrichment is best effort; the webhook still works without it.
            Log::debug('Instagram profile lookup failed: ' . $exception->getMessage());

            return [];
        }
    }

    /**
     * Cheap connectivity check used by the settings screen.
     *
     * @return array<string, mixed>
     */
    public function verifyConnection(): array
    {
        if (! $this->configured()) {
            throw new RuntimeException('Add an Instagram account ID and access token first.');
        }

        $response = Http::withToken($this->account->access_token)
            ->acceptJson()
            ->timeout(20)
            ->get($this->url((string) $this->account->instagram_user_id), [
                'fields' => 'id,username,name,profile_picture_url,followers_count',
            ]);

        $this->ensureOk($response);

        return $response->json() ?? [];
    }

    public function verifySignature(string $payload, ?string $signature): bool
    {
        $secret = (string) (config('services.instagram.app_secret') ?: config('services.whatsapp.app_secret'));

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
            throw new RuntimeException('Instagram is not connected for this workspace.');
        }

        $response = Http::withToken($this->account->access_token)
            ->acceptJson()
            ->timeout(25)
            ->post($this->url($this->account->instagram_user_id . '/' . ltrim($path, '/')), $payload);

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
            ?? 'Instagram API request failed (' . $response->status() . ').';

        throw new RuntimeException($message);
    }

    protected function url(string $path): string
    {
        $version = $this->account?->api_version
            ?: config('services.instagram.api_version', config('services.whatsapp.api_version', 'v21.0'));

        return rtrim('https://graph.facebook.com/' . trim($version, '/') . '/' . ltrim($path, '/'), '/');
    }
}
