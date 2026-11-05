<?php

namespace App\Http\Controllers\Backend\Crm;

use App\Http\Controllers\Controller;
use App\Models\WhatsAppAccount;
use App\Services\Crm\CrmService;
use App\Services\Instagram\InstagramApi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * Public webhook used by Meta for Instagram messaging. No auth middleware:
 * Meta signs every payload with the app secret.
 */
class InstagramWebhookController extends Controller
{
    public function __construct(
        private readonly CrmService $crm,
        private readonly InstagramApi $api,
    ) {
    }

    public function verify(Request $request)
    {
        $mode = $request->query('hub_mode', $request->query('hub.mode'));
        $token = $request->query('hub_verify_token', $request->query('hub.verify_token'));
        $challenge = $request->query('hub_challenge', $request->query('hub.challenge'));

        if ($mode !== 'subscribe' || blank($token)) {
            return response('Forbidden', 403);
        }

        $account = WhatsAppAccount::where('channel', WhatsAppAccount::CHANNEL_INSTAGRAM)
            ->where('verify_token', $token)
            ->first();

        $sharedToken = (string) config('services.instagram.verify_token');

        if (! $account && $sharedToken !== '' && hash_equals($sharedToken, (string) $token)) {
            $account = WhatsAppAccount::where('channel', WhatsAppAccount::CHANNEL_INSTAGRAM)->first();
        }

        if (! $account) {
            return response('Forbidden', 403);
        }

        return response((string) $challenge, 200)->header('Content-Type', 'text/plain');
    }

    public function receive(Request $request)
    {
        $raw = $request->getContent();

        if (! $this->api->verifySignature($raw, $request->header('X-Hub-Signature-256'))) {
            return response('Invalid signature', 403);
        }

        $payload = json_decode($raw, true) ?: [];

        foreach ($payload['entry'] ?? [] as $entry) {
            foreach ($entry['messaging'] ?? [] as $event) {
                $recipientId = (string) ($event['recipient']['id'] ?? $entry['id'] ?? '');

                if ($recipientId === '') {
                    continue;
                }

                $account = WhatsAppAccount::where('channel', WhatsAppAccount::CHANNEL_INSTAGRAM)
                    ->where(function ($query) use ($recipientId) {
                        $query->where('instagram_user_id', $recipientId)
                            ->orWhere('page_id', $recipientId);
                    })
                    ->first();

                if (! $account) {
                    Log::warning('Instagram webhook for unknown account: ' . $recipientId);
                    continue;
                }

                try {
                    $this->crm->receiveInstagram($account, $entry, $event);
                } catch (\Throwable $exception) {
                    report($exception);
                }
            }
        }

        return response()->json(['status' => 'received']);
    }
}
