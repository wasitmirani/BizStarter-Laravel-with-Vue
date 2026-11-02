<?php

namespace App\Http\Controllers\Backend\Crm;

use App\Http\Controllers\Controller;
use App\Models\WhatsAppAccount;
use App\Services\Crm\CrmService;
use App\Services\WhatsApp\WhatsAppCloudApi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * Public webhook used by Meta. No auth middleware: Meta signs the payload.
 */
class WhatsAppWebhookController extends Controller
{
    public function __construct(
        private readonly CrmService $crm,
        private readonly WhatsAppCloudApi $api,
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

        $account = WhatsAppAccount::where('verify_token', $token)->first();

        if (! $account && hash_equals((string) config('services.whatsapp.verify_token'), (string) $token)) {
            $account = WhatsAppAccount::query()->first();
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
            foreach ($entry['changes'] ?? [] as $change) {
                $value = $change['value'] ?? [];
                $phoneNumberId = $value['metadata']['phone_number_id'] ?? null;

                if (! $phoneNumberId) {
                    continue;
                }

                $account = WhatsAppAccount::where('phone_number_id', $phoneNumberId)->first();

                if (! $account) {
                    Log::warning('WhatsApp webhook for unknown phone number id: ' . $phoneNumberId);
                    continue;
                }

                foreach ($value['messages'] ?? [] as $message) {
                    $profile = $value['contacts'][0] ?? [];

                    try {
                        $this->crm->receive($account, $value, $message, $profile);
                    } catch (\Throwable $exception) {
                        report($exception);
                    }
                }

                foreach ($value['statuses'] ?? [] as $status) {
                    if (empty($status['id']) || empty($status['status'])) {
                        continue;
                    }

                    $this->crm->applyStatus(
                        (string) $status['id'],
                        (string) $status['status'],
                        isset($status['timestamp']) ? (int) $status['timestamp'] : null,
                        (int) $account->workspace_id
                    );
                }
            }
        }

        return response()->json(['status' => 'received']);
    }
}
