<?php

namespace App\Http\Controllers\Backend\Crm;

use App\Http\Controllers\Backend\Workspace\Concerns\ResolvesWorkspace;
use App\Http\Controllers\Controller;
use App\Models\CrmContact;
use App\Models\CrmTag;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ContactController extends Controller
{
    use ResolvesWorkspace;

    public function index(Request $request)
    {
        $workspace = $this->workspace($request);

        $query = $workspace->contacts()->with('tags');

        if ($search = trim((string) $request->query('search'))) {
            $needle = '%' . mb_strtolower($search) . '%';
            $query->where(function ($builder) use ($needle) {
                $builder->whereRaw('LOWER(name) LIKE ?', [$needle])
                    ->orWhereRaw('LOWER(phone) LIKE ?', [$needle])
                    ->orWhereRaw('LOWER(COALESCE(email, \'\')) LIKE ?', [$needle])
                    ->orWhereRaw('LOWER(COALESCE(company, \'\')) LIKE ?', [$needle]);
            });
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        if ($tag = $request->query('tag')) {
            $query->whereHas('tags', fn ($builder) => $builder->where('crm_tags.id', $tag));
        }

        $paginator = $query->orderByDesc('last_message_at')->orderByDesc('id')
            ->paginate((int) $request->query('per_page', perPage()));

        return responseJson('Contacts fetched successfully', [
            'contacts' => collect($paginator->items())
                ->map(fn (CrmContact $contact) => $contact->toContactArray())
                ->values(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
            'tags' => $this->tags($workspace),
        ], true);
    }

    public function store(Request $request)
    {
        $workspace = $this->workspace($request);

        $data = $this->validated($request, $workspace);
        $data['phone'] = CrmContact::normalizePhone($data['phone']);
        unset($data['tags']);

        $contact = $workspace->contacts()->create($data);
        $this->syncTags($contact, $request->input('tags', []), $workspace);

        return responseJson('Contact created successfully', [
            'contact' => $contact->fresh('tags')->toContactArray(),
        ], true, 201);
    }

    public function show(Request $request, CrmContact $contact)
    {
        $workspace = $this->workspace($request);
        abort_unless((int) $contact->workspace_id === (int) $workspace->id, 404);

        $contact->load('tags');

        return responseJson('Contact fetched successfully', [
            'contact' => $contact->toContactArray(),
            'conversations' => $contact->conversations()
                ->orderByDesc('last_message_at')
                ->limit(10)
                ->get()
                ->map(fn ($conversation) => $conversation->toConversationArray(false)),
        ], true);
    }

    public function update(Request $request, CrmContact $contact)
    {
        $workspace = $this->workspace($request);
        abort_unless((int) $contact->workspace_id === (int) $workspace->id, 404);

        $data = $this->validated($request, $workspace, $contact);
        $data['phone'] = CrmContact::normalizePhone($data['phone']);
        unset($data['tags']);

        $contact->update($data);
        $this->syncTags($contact, $request->input('tags', []), $workspace);

        return responseJson('Contact updated successfully', [
            'contact' => $contact->fresh('tags')->toContactArray(),
        ], true);
    }

    public function destroy(Request $request, CrmContact $contact)
    {
        $workspace = $this->workspace($request);
        abort_unless((int) $contact->workspace_id === (int) $workspace->id, 404);

        $contact->delete();

        return responseJson('Contact deleted successfully', null, true);
    }

    /**
     * Import contacts from a CSV with name,phone,email,company,tags columns.
     */
    public function import(Request $request)
    {
        $workspace = $this->workspace($request);
        $this->authorizeManagement($request, $workspace);

        $request->validate([
            'file' => ['required', 'file', 'mimes:csv,txt', 'max:5120'],
        ]);

        $handle = fopen($request->file('file')->getRealPath(), 'r');
        $header = null;
        $created = 0;
        $updated = 0;
        $skipped = 0;

        while (($row = fgetcsv($handle)) !== false) {
            if ($header === null) {
                $header = array_map(fn ($column) => strtolower(trim((string) $column)), $row);
                continue;
            }

            $record = array_combine(
                array_slice($header, 0, count($row)),
                array_slice($row, 0, count($header))
            ) ?: [];

            $phone = CrmContact::normalizePhone($record['phone'] ?? $row[1] ?? '');

            if ($phone === '') {
                $skipped++;
                continue;
            }

            $existing = $workspace->contacts()->where('phone', $phone)->first();

            $contact = $existing ?? new CrmContact(['workspace_id' => $workspace->id, 'phone' => $phone]);
            $contact->fill([
                'name' => $record['name'] ?? $row[0] ?? ('+' . $phone),
                'email' => $record['email'] ?? null,
                'company' => $record['company'] ?? null,
                'source' => 'import',
                'status' => $record['status'] ?? $contact->status ?? 'lead',
                'opt_in' => true,
            ]);
            $contact->workspace_id = $workspace->id;
            $contact->save();

            $existing ? $updated++ : $created++;

            if (! empty($record['tags'])) {
                $this->syncTags($contact, explode('|', $record['tags']), $workspace);
            }
        }

        fclose($handle);

        return responseJson('Import complete', compact('created', 'updated', 'skipped'), true);
    }

    public function export(Request $request): StreamedResponse
    {
        $workspace = $this->workspace($request);

        $contacts = $workspace->contacts()->with('tags')->orderBy('name')->get();

        return response()->streamDownload(function () use ($contacts) {
            $out = fopen('php://output', 'w');
            fputcsv($out, ['name', 'phone', 'email', 'company', 'status', 'tags']);

            foreach ($contacts as $contact) {
                fputcsv($out, [
                    $contact->name,
                    $contact->phone,
                    $contact->email,
                    $contact->company,
                    $contact->status,
                    $contact->tags->pluck('name')->implode('|'),
                ]);
            }

            fclose($out);
        }, 'contacts-' . now()->format('Ymd-His') . '.csv', ['Content-Type' => 'text/csv']);
    }

    protected function validated(Request $request, $workspace, ?CrmContact $contact = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'phone' => [
                'required', 'string', 'max:32',
                Rule::unique('crm_contacts', 'phone')
                    ->where('workspace_id', $workspace->id)
                    ->ignore($contact?->id),
            ],
            'email' => ['nullable', 'email', 'max:190'],
            'company' => ['nullable', 'string', 'max:120'],
            'status' => ['nullable', Rule::in(['lead', 'customer', 'blocked'])],
            'notes' => ['nullable', 'string', 'max:2000'],
            'opt_in' => ['nullable', 'boolean'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['nullable'],
        ]);
    }

    protected function syncTags(CrmContact $contact, array $tags, $workspace): void
    {
        $ids = collect($tags)
            ->filter()
            ->map(function ($tag) use ($workspace) {
                if (is_numeric($tag)) {
                    return (int) $tag;
                }

                return $workspace->tags()->firstOrCreate(
                    ['name' => trim((string) $tag)],
                    ['color' => '#059669']
                )->id;
            })
            ->filter()
            ->unique()
            ->values()
            ->all();

        $contact->tags()->sync($ids);
    }

    protected function tags($workspace): array
    {
        return $workspace->tags()
            ->withCount('contacts')
            ->orderBy('name')
            ->get()
            ->map(fn (CrmTag $tag) => $tag->toTagArray())
            ->values()
            ->all();
    }
}
