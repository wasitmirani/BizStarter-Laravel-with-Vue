<?php

namespace App\Http\Controllers\Backend\Crm;

use App\Http\Controllers\Backend\Workspace\Concerns\ResolvesWorkspace;
use App\Http\Controllers\Controller;
use App\Models\CrmTemplate;
use App\Models\Workspace;
use App\Services\Crm\CrmService;
use App\Services\WhatsApp\WhatsAppCloudApi;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Throwable;

class TemplateController extends Controller
{
    use ResolvesWorkspace;

    public function __construct(private readonly CrmService $crm)
    {
    }

    public function index(Request $request)
    {
        $workspace = $this->workspace($request);

        $query = $workspace->crmTemplates()->orderByDesc('id');

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($category = $request->query('category')) {
            $query->where('category', $category);
        }

        return responseJson('Templates fetched successfully', [
            'templates' => $query->get()
                ->map(fn (CrmTemplate $template) => $template->toTemplateArray())
                ->values(),
            'categories' => CrmTemplate::CATEGORIES,
            'statuses' => CrmTemplate::STATUSES,
        ], true);
    }

    public function store(Request $request)
    {
        $workspace = $this->workspace($request);
        $this->authorizeManagement($request, $workspace);

        $data = $this->validated($request, $workspace);

        $template = $workspace->crmTemplates()->create($data);

        return responseJson('Template created successfully', [
            'template' => $template->toTemplateArray(),
        ], true, 201);
    }

    public function update(Request $request, CrmTemplate $template)
    {
        $workspace = $this->workspace($request);
        $this->authorizeManagement($request, $workspace);
        abort_unless((int) $template->workspace_id === (int) $workspace->id, 404);

        $data = $this->validated($request, $workspace, $template);
        $template->update($data);

        return responseJson('Template updated successfully', [
            'template' => $template->fresh()->toTemplateArray(),
        ], true);
    }

    public function destroy(Request $request, CrmTemplate $template)
    {
        $workspace = $this->workspace($request);
        $this->authorizeManagement($request, $workspace);
        abort_unless((int) $template->workspace_id === (int) $workspace->id, 404);

        $template->delete();

        return responseJson('Template deleted successfully', null, true);
    }

    /**
     * Mirror templates from the WhatsApp Business account into the CRM.
     */
    public function sync(Request $request)
    {
        $workspace = $this->workspace($request);
        $this->authorizeManagement($request, $workspace);

        $account = $this->crm->account($workspace);

        try {
            $remote = app(WhatsAppCloudApi::class)->for($account)->fetchTemplates();
        } catch (Throwable $exception) {
            return responseJson('Could not sync templates', ['error' => $exception->getMessage()], false, 422);
        }

        $created = 0;
        $updated = 0;

        foreach ($remote as $item) {
            $components = collect($item['components'] ?? []);
            $header = $components->firstWhere('type', 'HEADER');
            $body = $components->firstWhere('type', 'BODY');
            $footer = $components->firstWhere('type', 'FOOTER');
            $buttons = $components->firstWhere('type', 'BUTTONS');

            $template = $workspace->crmTemplates()->updateOrCreate(
                [
                    'name' => $item['name'] ?? 'untitled',
                    'language' => $item['language'] ?? 'en_US',
                ],
                [
                    'category' => strtolower($item['category'] ?? 'marketing'),
                    'header_type' => isset($header['format']) ? strtolower($header['format']) : null,
                    'header_text' => $header['text'] ?? null,
                    'body' => $body['text'] ?? '',
                    'footer' => $footer['text'] ?? null,
                    'buttons' => $buttons['buttons'] ?? [],
                    'status' => strtolower($item['status'] ?? 'draft'),
                    'external_id' => isset($item['id']) ? (string) $item['id'] : null,
                    'last_synced_at' => now(),
                ]
            );

            $template->wasRecentlyCreated ? $created++ : $updated++;
        }

        return responseJson('Templates synced successfully', compact('created', 'updated', 'remote'), true);
    }

    protected function validated(Request $request, Workspace $workspace, ?CrmTemplate $template = null): array
    {
        $data = $request->validate([
            'name' => [
                'required', 'string', 'max:120', 'regex:/^[a-z0-9_]+$/i',
                Rule::unique('crm_templates', 'name')
                    ->where('workspace_id', $workspace->id)
                    ->where('language', $request->input('language', 'en_US'))
                    ->ignore($template?->id),
            ],
            'category' => ['required', Rule::in(CrmTemplate::CATEGORIES)],
            'language' => ['required', 'string', 'max:16'],
            'header_type' => ['nullable', Rule::in(['text', 'image', 'video', 'document'])],
            'header_text' => ['nullable', 'string', 'max:255'],
            'body' => ['required', 'string', 'max:1024'],
            'footer' => ['nullable', 'string', 'max:255'],
            'buttons' => ['nullable', 'array'],
            'status' => ['nullable', Rule::in(CrmTemplate::STATUSES)],
        ]);

        $data['status'] = $data['status'] ?? $template?->status ?? 'draft';

        return $data;
    }
}
