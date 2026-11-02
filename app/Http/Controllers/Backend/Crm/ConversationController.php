<?php

namespace App\Http\Controllers\Backend\Crm;

use App\Http\Controllers\Backend\Workspace\Concerns\ResolvesWorkspace;
use App\Http\Controllers\Controller;
use App\Models\CrmContact;
use App\Models\CrmConversation;
use App\Models\CrmMessage;
use App\Models\User;
use App\Models\Workspace;
use App\Services\Crm\CrmService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ConversationController extends Controller
{
    use ResolvesWorkspace;

    public function __construct(private readonly CrmService $crm)
    {
    }

    public function index(Request $request)
    {
        $workspace = $this->workspace($request);

        $query = $workspace->conversations()
            ->with(['contact.tags', 'assignee:id,name']);

        if ($status = $request->query('status')) {
            if ($status !== 'all') {
                $query->where('status', $status);
            }
        }

        if ($assignee = $request->query('assignee')) {
            if ($assignee === 'me') {
                $query->where('assigned_to', $request->user()->id);
            } elseif ($assignee === 'unassigned') {
                $query->whereNull('assigned_to');
            } else {
                $query->where('assigned_to', (int) $assignee);
            }
        }

        if ($request->boolean('unread')) {
            $query->where('unread_count', '>', 0);
        }

        if ($search = trim((string) $request->query('search'))) {
            $needle = '%' . mb_strtolower($search) . '%';
            $query->whereHas('contact', function ($builder) use ($needle) {
                $builder->whereRaw('LOWER(name) LIKE ?', [$needle])
                    ->orWhereRaw('LOWER(phone) LIKE ?', [$needle]);
            });
        }

        $paginator = $query->orderByDesc('is_pinned')
            ->orderByDesc('last_message_at')
            ->orderByDesc('id')
            ->paginate((int) $request->query('per_page', 30));

        $counts = $workspace->conversations()
            ->selectRaw('status, count(*) as aggregate')
            ->groupBy('status')
            ->pluck('aggregate', 'status');

        return responseJson('Conversations fetched successfully', [
            'conversations' => collect($paginator->items())
                ->map(fn (CrmConversation $conversation) => $conversation->toConversationArray())
                ->values(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'total' => $paginator->total(),
            ],
            'counts' => [
                'open' => (int) ($counts['open'] ?? 0),
                'pending' => (int) ($counts['pending'] ?? 0),
                'closed' => (int) ($counts['closed'] ?? 0),
                'unread' => (int) $workspace->conversations()->sum('unread_count'),
            ],
            'assignables' => $this->assignables($workspace),
            'statuses' => ['open', 'pending', 'closed'],
        ], true);
    }

    public function show(Request $request, CrmConversation $conversation)
    {
        $workspace = $this->workspace($request);
        abort_unless((int) $conversation->workspace_id === (int) $workspace->id, 404);

        $conversation->load(['contact.tags', 'assignee:id,name', 'account']);

        $messages = $conversation->messages()
            ->with('user:id,name')
            ->orderByDesc('id')
            ->limit(60)
            ->get()
            ->reverse()
            ->values();

        return responseJson('Conversation fetched successfully', [
            'conversation' => $conversation->toConversationArray(),
            'messages' => $messages->map(fn (CrmMessage $message) => $message->toMessageArray()),
            'assignables' => $this->assignables($workspace),
            'account' => [
                'connected' => (bool) $conversation->account?->isConfigured(),
                'phone_number' => $conversation->account?->phone_number,
            ],
        ], true);
    }

    /**
     * Load older messages before a given message id.
     */
    public function messages(Request $request, CrmConversation $conversation)
    {
        $workspace = $this->workspace($request);
        abort_unless((int) $conversation->workspace_id === (int) $workspace->id, 404);

        $before = (int) $request->query('before', 0);

        $messages = $conversation->messages()
            ->with('user:id,name')
            ->when($before > 0, fn ($query) => $query->where('id', '<', $before))
            ->orderByDesc('id')
            ->limit(60)
            ->get();

        return responseJson('Messages fetched successfully', [
            'messages' => $messages->reverse()->values()->map(fn (CrmMessage $message) => $message->toMessageArray()),
            'has_more' => $messages->count() === 60,
        ], true);
    }

    public function reply(Request $request, CrmConversation $conversation)
    {
        $workspace = $this->workspace($request);
        abort_unless((int) $conversation->workspace_id === (int) $workspace->id, 404);

        $data = $request->validate([
            'body' => ['required', 'string', 'max:4096'],
        ]);

        $message = $this->crm->reply($conversation->load('contact'), $request->user(), $data['body']);

        return responseJson(
            $message->status === 'failed' ? 'Message could not be delivered' : 'Message sent successfully',
            ['message' => $message->toMessageArray()],
            $message->status !== 'failed'
        );
    }

    public function update(Request $request, CrmConversation $conversation)
    {
        $workspace = $this->workspace($request);
        abort_unless((int) $conversation->workspace_id === (int) $workspace->id, 404);

        $data = $request->validate([
            'status' => ['nullable', Rule::in(['open', 'pending', 'closed'])],
            'priority' => ['nullable', Rule::in(['low', 'normal', 'high', 'urgent'])],
            'assigned_to' => ['nullable', 'integer'],
            'is_pinned' => ['nullable', 'boolean'],
        ]);

        if (array_key_exists('assigned_to', $data) && $data['assigned_to']) {
            $this->assertAssignable($workspace, (int) $data['assigned_to']);
        }

        if (($data['status'] ?? null) === 'closed') {
            $data['closed_at'] = now();
        } elseif (! empty($data['status'])) {
            $data['closed_at'] = null;
        }

        $conversation->update($data);

        return responseJson('Conversation updated successfully', [
            'conversation' => $conversation->fresh(['contact.tags', 'assignee:id,name'])->toConversationArray(),
        ], true);
    }

    public function markRead(Request $request, CrmConversation $conversation)
    {
        $workspace = $this->workspace($request);
        abort_unless((int) $conversation->workspace_id === (int) $workspace->id, 404);

        $this->crm->markRead($conversation->load('account'));

        return responseJson('Conversation marked as read', ['unread_count' => 0], true);
    }

    /**
     * Start a new conversation with an existing contact.
     */
    public function store(Request $request)
    {
        $workspace = $this->workspace($request);

        $data = $request->validate([
            'contact_id' => ['required', 'integer'],
            'body' => ['nullable', 'string', 'max:4096'],
        ]);

        $contact = $workspace->contacts()->findOrFail($data['contact_id']);
        $conversation = $this->crm->conversationFor($workspace, $contact);

        if (! empty($data['body'])) {
            $this->crm->reply($conversation, $request->user(), $data['body']);
        }

        return responseJson('Conversation ready', [
            'conversation' => $conversation->fresh(['contact.tags', 'assignee'])->toConversationArray(),
        ], true, 201);
    }

    public function destroy(Request $request, CrmConversation $conversation)
    {
        $workspace = $this->workspace($request);
        $this->authorizeManagement($request, $workspace);
        abort_unless((int) $conversation->workspace_id === (int) $workspace->id, 404);

        $conversation->delete();

        return responseJson('Conversation deleted successfully', null, true);
    }

    protected function assignables(Workspace $workspace): array
    {
        $ids = $workspace->memberRecords()->pluck('user_id')->push($workspace->owner_id)->unique();

        return User::whereIn('id', $ids)
            ->orderBy('name')
            ->get(['id', 'name', 'email'])
            ->map(fn (User $user) => ['id' => $user->id, 'name' => $user->name, 'email' => $user->email])
            ->values()
            ->all();
    }

    protected function assertAssignable(Workspace $workspace, int $userId): void
    {
        $allowed = $workspace->memberRecords()->where('user_id', $userId)->exists()
            || (int) $workspace->owner_id === $userId;

        abort_unless($allowed, 422, 'That person is not a member of this workspace.');
    }
}
