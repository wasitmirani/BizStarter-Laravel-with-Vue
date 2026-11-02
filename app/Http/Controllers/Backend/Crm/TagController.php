<?php

namespace App\Http\Controllers\Backend\Crm;

use App\Http\Controllers\Backend\Workspace\Concerns\ResolvesWorkspace;
use App\Http\Controllers\Controller;
use App\Models\CrmTag;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TagController extends Controller
{
    use ResolvesWorkspace;

    public function index(Request $request)
    {
        $workspace = $this->workspace($request);

        return responseJson('Tags fetched successfully', [
            'tags' => $workspace->tags()
                ->withCount('contacts')
                ->orderBy('name')
                ->get()
                ->map(fn (CrmTag $tag) => $tag->toTagArray())
                ->values(),
        ], true);
    }

    public function store(Request $request)
    {
        $workspace = $this->workspace($request);
        $this->authorizeManagement($request, $workspace);

        $data = $request->validate([
            'name' => [
                'required', 'string', 'max:60',
                Rule::unique('crm_tags', 'name')->where('workspace_id', $workspace->id),
            ],
            'color' => ['nullable', 'string', 'max:16'],
        ]);

        $tag = $workspace->tags()->create([
            'name' => trim($data['name']),
            'color' => $data['color'] ?? '#059669',
        ]);

        return responseJson('Tag created successfully', ['tag' => $tag->toTagArray()], true, 201);
    }

    public function update(Request $request, CrmTag $tag)
    {
        $workspace = $this->workspace($request);
        abort_unless((int) $tag->workspace_id === (int) $workspace->id, 404);

        $data = $request->validate([
            'name' => [
                'required', 'string', 'max:60',
                Rule::unique('crm_tags', 'name')->where('workspace_id', $workspace->id)->ignore($tag->id),
            ],
            'color' => ['nullable', 'string', 'max:16'],
        ]);

        $tag->update($data);

        return responseJson('Tag updated successfully', ['tag' => $tag->fresh()->toTagArray()], true);
    }

    public function destroy(Request $request, CrmTag $tag)
    {
        $workspace = $this->workspace($request);
        $this->authorizeManagement($request, $workspace);

        abort_unless((int) $tag->workspace_id === (int) $workspace->id, 404);

        $tag->contacts()->detach();
        $tag->delete();

        return responseJson('Tag deleted successfully', null, true);
    }
}
