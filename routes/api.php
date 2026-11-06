<?php

use App\Http\Controllers\Backend\Activity\ActivityLogController;
use App\Http\Controllers\Backend\Billing\BillingController;
use App\Http\Controllers\Backend\Billing\PlanController;
use App\Http\Controllers\Backend\Crm\CampaignController;
use App\Http\Controllers\Backend\Crm\ContactController;
use App\Http\Controllers\Backend\Crm\ConversationController;
use App\Http\Controllers\Backend\Crm\InstagramAccountController;
use App\Http\Controllers\Backend\Crm\InstagramWebhookController;
use App\Http\Controllers\Backend\Crm\TagController;
use App\Http\Controllers\Backend\Crm\TemplateController;
use App\Http\Controllers\Backend\Crm\WhatsAppAccountController;
use App\Http\Controllers\Backend\Crm\WhatsAppWebhookController;
use App\Http\Controllers\Backend\Dashboard\DashboardController;
use App\Http\Controllers\Backend\Dropdown\DropDownController;
use App\Http\Controllers\Backend\Media\UploadController;
use App\Http\Controllers\Backend\Permission\PermissionController;
use App\Http\Controllers\Backend\Profile\ProfileController;
use App\Http\Controllers\Backend\Report\ReportController;
use App\Http\Controllers\Backend\Role\RoleController;
use App\Http\Controllers\Backend\Search\SearchController;
use App\Http\Controllers\Backend\Security\ApiTokenController;
use App\Http\Controllers\Backend\User\UserController;
use App\Http\Controllers\Backend\Workspace\WorkspaceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/me', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('/app')->middleware('auth:sanctum')->group(function () {
    Route::get('/permissions', function (Request $request) {
        return response()->json([
            'permissions' => $request->user()->getAllPermissions()->pluck('name')->values()->all(),
        ]);
    });

    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Own profile
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::patch('/profile', [ProfileController::class, 'update']);

    // Global search
    Route::get('/search', [SearchController::class, 'index'])->middleware('throttle:60,1');

    // Audit log
    Route::get('/activity', [ActivityLogController::class, 'index'])
        ->middleware('permission:activity-list');

    // Reports
    Route::get('/reports/summary', [ReportController::class, 'summary'])
        ->middleware('permission:reports-list');
    Route::get('/reports/users', [ReportController::class, 'users'])
        ->middleware('permission:reports-list');

    // Workspaces the signed-in user can switch between
    Route::get('/workspaces', [WorkspaceController::class, 'index']);
    Route::post('/workspaces', [WorkspaceController::class, 'store']);
    Route::post('/workspaces/switch', [WorkspaceController::class, 'switchCurrent']);

    // Workspace (SaaS account)
    Route::get('/workspace', [WorkspaceController::class, 'show']);
    Route::patch('/workspace', [WorkspaceController::class, 'update']);
    Route::post('/workspace/invitations', [WorkspaceController::class, 'invite']);
    Route::delete('/workspace/invitations/{invitation}', [WorkspaceController::class, 'revokeInvitation']);
    Route::post('/workspace/invitations/{token}/accept', [WorkspaceController::class, 'acceptInvitation']);
    Route::patch('/workspace/members/{member}', [WorkspaceController::class, 'updateMember']);
    Route::delete('/workspace/members/{member}', [WorkspaceController::class, 'removeMember']);
    Route::post('/workspace/leave', [WorkspaceController::class, 'leave']);
    Route::delete('/workspace', [WorkspaceController::class, 'destroy']);

    // Billing & subscriptions
    Route::get('/billing', [BillingController::class, 'index']);
    Route::post('/billing/subscribe', [BillingController::class, 'subscribe']);
    Route::post('/billing/cancel', [BillingController::class, 'cancel']);
    Route::post('/billing/resume', [BillingController::class, 'resume']);
    Route::get('/billing/invoices/{invoice}', [BillingController::class, 'invoice']);

    // Plan catalog (platform admins)
    Route::get('/plans', [PlanController::class, 'index'])->middleware('permission:plans-manage');
    Route::post('/plans', [PlanController::class, 'store'])->middleware('permission:plans-manage');
    Route::put('/plans/{plan}', [PlanController::class, 'update'])->middleware('permission:plans-manage');
    Route::delete('/plans/{plan}', [PlanController::class, 'destroy'])->middleware('permission:plans-manage');

    // Personal API tokens
    Route::get('/tokens', [ApiTokenController::class, 'index']);
    Route::post('/tokens', [ApiTokenController::class, 'store']);
    Route::delete('/tokens/{token}', [ApiTokenController::class, 'destroy']);

    // WhatsApp CRM
    Route::prefix('crm')->group(function () {
        Route::get('contacts', [ContactController::class, 'index']);
        Route::post('contacts', [ContactController::class, 'store']);
        Route::post('contacts/import', [ContactController::class, 'import']);
        Route::get('contacts/export', [ContactController::class, 'export']);
        Route::get('contacts/{contact}', [ContactController::class, 'show']);
        Route::put('contacts/{contact}', [ContactController::class, 'update']);
        Route::delete('contacts/{contact}', [ContactController::class, 'destroy']);

        Route::get('tags', [TagController::class, 'index']);
        Route::post('tags', [TagController::class, 'store']);
        Route::put('tags/{tag}', [TagController::class, 'update']);
        Route::delete('tags/{tag}', [TagController::class, 'destroy']);

        Route::get('conversations', [ConversationController::class, 'index']);
        Route::post('conversations', [ConversationController::class, 'store']);
        Route::get('conversations/{conversation}', [ConversationController::class, 'show']);
        Route::patch('conversations/{conversation}', [ConversationController::class, 'update']);
        Route::delete('conversations/{conversation}', [ConversationController::class, 'destroy']);
        Route::get('conversations/{conversation}/messages', [ConversationController::class, 'messages']);
        Route::post('conversations/{conversation}/reply', [ConversationController::class, 'reply']);
        Route::post('conversations/{conversation}/read', [ConversationController::class, 'markRead']);

        Route::get('messages/{message}/media', [ConversationController::class, 'media']);

        Route::get('templates', [TemplateController::class, 'index']);
        Route::post('templates', [TemplateController::class, 'store']);
        Route::post('templates/sync', [TemplateController::class, 'sync']);
        Route::put('templates/{template}', [TemplateController::class, 'update']);
        Route::delete('templates/{template}', [TemplateController::class, 'destroy']);

        Route::get('campaigns', [CampaignController::class, 'index']);
        Route::post('campaigns', [CampaignController::class, 'store']);
        Route::get('campaigns/{campaign}', [CampaignController::class, 'show']);
        Route::put('campaigns/{campaign}', [CampaignController::class, 'update']);
        Route::delete('campaigns/{campaign}', [CampaignController::class, 'destroy']);
        Route::post('campaigns/{campaign}/send', [CampaignController::class, 'send']);
        Route::get('campaigns/{campaign}/preview', [CampaignController::class, 'preview']);

        Route::get('whatsapp', [WhatsAppAccountController::class, 'show']);
        Route::put('whatsapp', [WhatsAppAccountController::class, 'update']);
        Route::post('whatsapp/test', [WhatsAppAccountController::class, 'test']);
        Route::post('whatsapp/rotate-verify-token', [WhatsAppAccountController::class, 'rotateVerifyToken']);

        Route::get('instagram', [InstagramAccountController::class, 'show']);
        Route::put('instagram', [InstagramAccountController::class, 'update']);
        Route::post('instagram/test', [InstagramAccountController::class, 'test']);
        Route::post('instagram/rotate-verify-token', [InstagramAccountController::class, 'rotateVerifyToken']);
    });

    // Users
    Route::get('user', [UserController::class, 'index'])->middleware('permission:users-list');
    Route::post('user', [UserController::class, 'store'])->middleware('permission:create-user');
    Route::get('user/{user}', [UserController::class, 'show'])->middleware('permission:show-user');
    Route::put('user/{user}', [UserController::class, 'update'])->middleware('permission:edit-user');
    Route::patch('user/{user}', [UserController::class, 'update'])->middleware('permission:edit-user');
    Route::delete('user/{user}', [UserController::class, 'destroy'])->middleware('permission:delete-user');
    Route::post('/password/update', [UserController::class, 'updatePassword']);
    Route::post('user/{uuid}/impersonate', [UserController::class, 'impersonate']);
    Route::post('impersonate/leave', [UserController::class, 'leaveImpersonate']);

    // Roles
    Route::get('role', [RoleController::class, 'index'])->middleware('permission:roles-list');
    Route::post('role', [RoleController::class, 'store'])->middleware('permission:create-role');
    Route::get('role/{role}', [RoleController::class, 'show'])->middleware('permission:show-role');
    Route::put('role/{role}', [RoleController::class, 'update'])->middleware('permission:edit-role');
    Route::patch('role/{role}', [RoleController::class, 'update'])->middleware('permission:edit-role');
    Route::delete('role/{role}', [RoleController::class, 'destroy'])->middleware('permission:delete-role');

    // Permissions
    Route::get('permission', [PermissionController::class, 'index'])->middleware('permission:permissions-list');
    Route::post('permission', [PermissionController::class, 'store'])->middleware('permission:create-permission');
    Route::get('permission/{permission}', [PermissionController::class, 'show'])->middleware('permission:show-permission');
    Route::put('permission/{permission}', [PermissionController::class, 'update'])->middleware('permission:edit-permission');
    Route::patch('permission/{permission}', [PermissionController::class, 'update'])->middleware('permission:edit-permission');
    Route::delete('permission/{permission}', [PermissionController::class, 'destroy'])->middleware('permission:delete-permission');

    // Uploads
    Route::prefix('upload')->group(function () {
        Route::post('/{type}/image', [UploadController::class, 'uploadSingleImage']);
    });

    Route::prefix('/dropdown')->group(function () {
        Route::get('/options-list', [DropDownController::class, 'getListOptions']);
        Route::get('/languages-list', [DropDownController::class, 'getLanguages']);
        Route::get('/timezones-list', [DropDownController::class, 'getTimezones']);
        Route::get('/countries-list', [DropDownController::class, 'getCountries']);
        Route::get('/roles-list', [RoleController::class, 'getRoles']);
        Route::get('/users-list', [UserController::class, 'getUsers']);
        Route::get('/permissions-list', [PermissionController::class, 'getPermissionsList']);
    });
});

// Meta WhatsApp Cloud API webhook (public, signature-verified).
Route::get('/whatsapp/webhook', [WhatsAppWebhookController::class, 'verify']);
Route::post('/whatsapp/webhook', [WhatsAppWebhookController::class, 'receive'])
    ->middleware('throttle:120,1');

// Meta Instagram Messaging webhook (public, signature-verified).
Route::get('/instagram/webhook', [InstagramWebhookController::class, 'verify']);
Route::post('/instagram/webhook', [InstagramWebhookController::class, 'receive'])
    ->middleware('throttle:120,1');
