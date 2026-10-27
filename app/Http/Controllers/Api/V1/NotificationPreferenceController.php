<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admissions\NotificationPreferenceRequest;
use App\Models\NotificationPreference;
use Illuminate\Http\Request;

class NotificationPreferenceController extends Controller
{
    public function show(Request $request)
    {
        $preferences = NotificationPreference::firstOrCreate(
            ['user_id' => $request->user()->id],
            ['email' => $request->user()->email, 'timezone' => config('app.timezone', 'UTC')],
        );

        return responseJson('Notification preferences fetched successfully', [
            'notification_preferences' => $preferences,
            'slack_webhook_configured' => filled($preferences->slack_webhook_url),
        ]);
    }

    public function update(NotificationPreferenceRequest $request)
    {
        $preferences = NotificationPreference::firstOrCreate(['user_id' => $request->user()->id]);
        $data = $request->validated();

        // Never accept a masked/empty value as a replacement for a saved secret.
        if (empty($data['slack_webhook_url'])) {
            unset($data['slack_webhook_url']);
        }

        $preferences->update($data);

        return responseJson('Notification preferences updated successfully', [
            'notification_preferences' => $preferences->fresh(),
            'slack_webhook_configured' => filled($preferences->slack_webhook_url),
        ]);
    }
}
