<?php

namespace App\Http\Controllers\Backend\Crm;

use App\Http\Controllers\Backend\Workspace\Concerns\ResolvesWorkspace;
use App\Http\Controllers\Controller;
use App\Services\Crm\CrmService;
use App\Services\WhatsApp\WhatsAppCloudApi;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Throwable;

class WhatsAppAccountController extends Controller
{
    use ResolvesWorkspace;

    public function __construct(private readonly CrmService $crm)
    {
    }

    public function show(Request $request)
    {
        $workspace = $this->workspace($request);
        $account = $this->crm->account($workspace);

        return responseJson('WhatsApp account fetched successfully', [
            'account' => $this->payload($account),
            'webhook_url' => url('/api/whatsapp/webhook'),
            'api_version' => $account->api_version,
            'configured' => $account->isConfigured(),
            'recent_errors' => [],
        ], true);
    }

    public function update(Request $request)
    {
        $workspace = $this->workspace($request);
        $this->authorizeManagement($request, $workspace);

        $data = $request->validate([
            'name' => ['nullable', 'string', 'max:80'],
            'phone_number' => ['nullable', 'string', 'max:32'],
            'phone_number_id' => ['nullable', 'string', 'max:64'],
            'business_account_id' => ['nullable', 'string', 'max:64'],
            'access_token' => ['nullable', 'string', 'max:2048'],
            'verify_token' => ['nullable', 'string', 'max:80'],
            'api_version' => ['nullable', 'string', 'max:16'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $account = $this->crm->account($workspace);

        // Blank access token means "keep the current token".
        if (empty($data['access_token'])) {
            unset($data['access_token']);
        }

        if (empty($data['verify_token'])) {
            $data['verify_token'] = $account->verify_token ?: Str::random(32);
        }

        if (! empty($data['phone_number'])) {
            $data['phone_number'] = preg_replace('/\D+/', '', $data['phone_number']);
        }

        $account->update($data);

        if ($account->isConfigured() && $account->connected_at === null) {
            $account->forceFill(['connected_at' => now()])->save();
        }

        return responseJson('WhatsApp settings saved', [
            'account' => $this->payload($account->fresh()),
            'configured' => $account->isConfigured(),
        ], true);
    }

    public function test(Request $request)
    {
        $workspace = $this->workspace($request);
        $this->authorizeManagement($request, $workspace);

        $account = $this->crm->account($workspace);

        try {
            $result = app(WhatsAppCloudApi::class)->for($account)->verifyConnection();
        } catch (Throwable $exception) {
            $account->update(['last_error' => $exception->getMessage()]);

            return responseJson('Connection failed', [
                'error' => $exception->getMessage(),
            ], false, 422);
        }

        $account->update([
            'connected_at' => now(),
            'last_error' => null,
            'phone_number' => preg_replace('/\D+/', '', (string) ($result['display_phone_number'] ?? $account->phone_number)),
        ]);

        return responseJson('Connection successful', [
            'account' => $this->payload($account->fresh()),
            'remote' => $result,
        ], true);
    }

    /**
     * Rotate the webhook verify token.
     */
    public function rotateVerifyToken(Request $request)
    {
        $workspace = $this->workspace($request);
        $this->authorizeManagement($request, $workspace);

        $account = $this->crm->account($workspace);
        $account->update(['verify_token' => Str::random(40)]);

        return responseJson('Verify token rotated', ['account' => $this->payload($account->fresh())], true);
    }

    protected function payload($account): array
    {
        return [
            'id' => $account->id,
            'name' => $account->name,
            'phone_number' => $account->phone_number,
            'phone_number_id' => $account->phone_number_id,
            'business_account_id' => $account->business_account_id,
            'verify_token' => $account->verify_token,
            'api_version' => $account->api_version,
            'is_active' => $account->is_active,
            'configured' => $account->isConfigured(),
            'connected_at' => $account->connected_at,
            'last_error' => $account->last_error,
            'token_preview' => $account->maskedToken(),
            'has_token' => filled($account->access_token),
        ];
    }
}
