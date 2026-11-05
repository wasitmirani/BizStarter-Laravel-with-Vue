<?php

namespace App\Http\Controllers\Backend\Crm;

use App\Http\Controllers\Backend\Workspace\Concerns\ResolvesWorkspace;
use App\Http\Controllers\Controller;
use App\Models\WhatsAppAccount;
use App\Services\Crm\CrmService;
use App\Services\Instagram\InstagramApi;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Throwable;

class InstagramAccountController extends Controller
{
    use ResolvesWorkspace;

    public function __construct(private readonly CrmService $crm)
    {
    }

    public function show(Request $request)
    {
        $workspace = $this->workspace($request);
        $account = $this->crm->account($workspace, WhatsAppAccount::CHANNEL_INSTAGRAM);

        return responseJson('Instagram account fetched successfully', [
            'account' => $this->payload($account),
            'webhook_url' => url('/api/instagram/webhook'),
            'api_version' => $account->api_version,
            'configured' => $account->isConfigured(),
        ], true);
    }

    public function update(Request $request)
    {
        $workspace = $this->workspace($request);
        $this->authorizeManagement($request, $workspace);

        $data = $request->validate([
            'name' => ['nullable', 'string', 'max:80'],
            'instagram_user_id' => ['nullable', 'string', 'max:64'],
            'instagram_username' => ['nullable', 'string', 'max:80'],
            'page_id' => ['nullable', 'string', 'max:64'],
            'access_token' => ['nullable', 'string', 'max:2048'],
            'verify_token' => ['nullable', 'string', 'max:80'],
            'api_version' => ['nullable', 'string', 'max:16'],
            'is_active' => ['nullable', 'boolean'],
        ]);

        $account = $this->crm->account($workspace, WhatsAppAccount::CHANNEL_INSTAGRAM);

        // Blank access token means "keep the current token".
        if (empty($data['access_token'])) {
            unset($data['access_token']);
        }

        if (empty($data['verify_token'])) {
            $data['verify_token'] = $account->verify_token ?: Str::random(32);
        }

        foreach (['instagram_user_id', 'page_id'] as $field) {
            if (! empty($data[$field])) {
                $data[$field] = preg_replace('/\D+/', '', (string) $data[$field]);
            }
        }

        if (! empty($data['instagram_username'])) {
            $data['instagram_username'] = ltrim(trim((string) $data['instagram_username']), '@');
        }

        $data['channel'] = WhatsAppAccount::CHANNEL_INSTAGRAM;

        $account->update($data);

        if ($account->isConfigured() && $account->connected_at === null) {
            $account->forceFill(['connected_at' => now()])->save();
        }

        return responseJson('Instagram settings saved', [
            'account' => $this->payload($account->fresh()),
            'configured' => $account->isConfigured(),
        ], true);
    }

    public function test(Request $request)
    {
        $workspace = $this->workspace($request);
        $this->authorizeManagement($request, $workspace);

        $account = $this->crm->account($workspace, WhatsAppAccount::CHANNEL_INSTAGRAM);

        try {
            $result = app(InstagramApi::class)->for($account)->verifyConnection();
        } catch (Throwable $exception) {
            $account->update(['last_error' => $exception->getMessage()]);

            return responseJson('Connection failed', [
                'error' => $exception->getMessage(),
            ], false, 422);
        }

        $account->update([
            'connected_at' => now(),
            'last_error' => null,
            'instagram_user_id' => $result['id'] ?? $account->instagram_user_id,
            'instagram_username' => $result['username'] ?? $account->instagram_username,
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

        $account = $this->crm->account($workspace, WhatsAppAccount::CHANNEL_INSTAGRAM);
        $account->update(['verify_token' => Str::random(40)]);

        return responseJson('Verify token rotated', ['account' => $this->payload($account->fresh())], true);
    }

    protected function payload($account): array
    {
        return [
            'id' => $account->id,
            'channel' => $account->channel,
            'name' => $account->name,
            'instagram_user_id' => $account->instagram_user_id,
            'instagram_username' => $account->instagram_username,
            'page_id' => $account->page_id,
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
