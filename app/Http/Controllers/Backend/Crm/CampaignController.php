<?php

namespace App\Http\Controllers\Backend\Crm;

use App\Http\Controllers\Backend\Workspace\Concerns\ResolvesWorkspace;
use App\Http\Controllers\Controller;
use App\Models\CrmCampaign;
use App\Models\CrmTag;
use App\Models\CrmTemplate;
use App\Services\Crm\CampaignService;
use App\Services\Crm\CrmService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Throwable;

class CampaignController extends Controller
{
    use ResolvesWorkspace;

    public function __construct(
        private readonly CampaignService $campaigns,
        private readonly CrmService $crm,
    ) {
    }

    public function index(Request $request)
    {
        $workspace = $this->workspace($request);

        $query = $workspace->campaigns()->with(['template', 'audienceTag'])->orderByDesc('id');

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        return responseJson('Campaigns fetched successfully', [
            'campaigns' => $query->get()
                ->map(fn (CrmCampaign $campaign) => $campaign->toCampaignArray())
                ->values(),
            'templates' => $workspace->crmTemplates()
                ->orderBy('name')
                ->get()
                ->map(fn (CrmTemplate $template) => $template->toTemplateArray())
                ->values(),
            'tags' => $workspace->tags()
                ->withCount('contacts')
                ->orderBy('name')
                ->get()
                ->map(fn (CrmTag $tag) => $tag->toTagArray())
                ->values(),
            'stats' => [
                'total' => $workspace->campaigns()->count(),
                'sent' => $workspace->campaigns()->where('status', CrmCampaign::STATUS_SENT)->count(),
                'drafts' => $workspace->campaigns()->where('status', CrmCampaign::STATUS_DRAFT)->count(),
                'messages_sent' => (int) $workspace->campaigns()->sum('sent_count'),
            ],
        ], true);
    }

    public function store(Request $request)
    {
        $workspace = $this->workspace($request);
        $this->authorizeManagement($request, $workspace);

        $data = $this->validated($request, $workspace);
        $campaign = $workspace->campaigns()->create($data);

        return responseJson('Campaign created successfully', [
            'campaign' => $campaign->load(['template', 'audienceTag'])->toCampaignArray(),
            'preview' => $this->campaigns->preview($campaign),
        ], true, 201);
    }

    public function show(Request $request, CrmCampaign $campaign)
    {
        $workspace = $this->workspace($request);
        abort_unless((int) $campaign->workspace_id === (int) $workspace->id, 404);

        $campaign->load(['template', 'audienceTag']);

        return responseJson('Campaign fetched successfully', [
            'campaign' => $campaign->toCampaignArray(),
            'preview' => $this->campaigns->preview($campaign),
            'failures' => $this->campaigns->failedRecipients($campaign),
        ], true);
    }

    public function update(Request $request, CrmCampaign $campaign)
    {
        $workspace = $this->workspace($request);
        $this->authorizeManagement($request, $workspace);
        abort_unless((int) $campaign->workspace_id === (int) $workspace->id, 404);

        if (! $campaign->canSend()) {
            return responseJson('A campaign that is already sending cannot be edited.', null, false, 422);
        }

        $data = $this->validated($request, $workspace);
        $campaign->update($data);

        return responseJson('Campaign updated successfully', [
            'campaign' => $campaign->fresh(['template', 'audienceTag'])->toCampaignArray(),
            'preview' => $this->campaigns->preview($campaign),
        ], true);
    }

    public function destroy(Request $request, CrmCampaign $campaign)
    {
        $workspace = $this->workspace($request);
        $this->authorizeManagement($request, $workspace);
        abort_unless((int) $campaign->workspace_id === (int) $workspace->id, 404);

        $campaign->delete();

        return responseJson('Campaign deleted successfully', null, true);
    }

    public function send(Request $request, CrmCampaign $campaign)
    {
        $workspace = $this->workspace($request);
        $this->authorizeManagement($request, $workspace);
        abort_unless((int) $campaign->workspace_id === (int) $workspace->id, 404);

        if (! $campaign->canSend()) {
            return responseJson('This campaign has already been sent.', null, false, 422);
        }

        try {
            $result = $this->campaigns->send($campaign->load(['template', 'workspace']), $request->user());
        } catch (Throwable $exception) {
            $campaign->update(['status' => CrmCampaign::STATUS_FAILED]);

            return responseJson('Campaign could not be sent', ['error' => $exception->getMessage()], false, 422);
        }

        return responseJson('Campaign sent', [
            'result' => $result,
            'campaign' => $campaign->fresh(['template', 'audienceTag'])->toCampaignArray(),
        ], $result['sent'] > 0);
    }

    /**
     * Dry-run audience count for the campaign builder.
     */
    public function preview(Request $request, CrmCampaign $campaign)
    {
        $workspace = $this->workspace($request);
        abort_unless((int) $campaign->workspace_id === (int) $workspace->id, 404);

        return responseJson('Audience preview', $this->campaigns->preview($campaign), true);
    }

    protected function validated(Request $request, $workspace): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'template_id' => [
                'nullable', 'integer',
                Rule::exists('crm_templates', 'id')->where('workspace_id', $workspace->id),
            ],
            'message_body' => ['nullable', 'string', 'max:4096'],
            'audience_tag_id' => [
                'nullable', 'integer',
                Rule::exists('crm_tags', 'id')->where('workspace_id', $workspace->id),
            ],
            'scheduled_at' => ['nullable', 'date'],
        ]);
    }
}
