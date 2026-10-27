<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admissions\TaskRequest;
use App\Models\UserTask;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $tasks = $request->user()->tasks()
            ->with('application.program')
            ->when($request->filled('status'), fn ($builder) => $builder->where('status', $request->string('status')))
            ->when($request->boolean('open_only'), fn ($builder) => $builder->where('status', '!=', 'done'))
            ->orderByRaw('CASE WHEN due_date IS NULL THEN 1 ELSE 0 END')
            ->orderBy('due_date')
            ->get();

        return responseJson('Tasks fetched successfully', ['tasks' => $tasks]);
    }

    public function store(TaskRequest $request)
    {
        $this->assertApplicationOwnership($request);

        $task = $request->user()->tasks()->create($request->validated() + ['status' => 'pending']);

        return responseJson('Task created successfully', ['task' => $task], true, 201);
    }

    public function update(TaskRequest $request, UserTask $task)
    {
        $this->authorize('update', $task);
        $this->assertApplicationOwnership($request);

        $data = $request->validated();

        if (($data['status'] ?? null) === 'done' && $task->completed_at === null) {
            $data['completed_at'] = now();
        }

        if (($data['status'] ?? null) !== 'done') {
            $data['completed_at'] = null;
        }

        $task->update($data);

        return responseJson('Task updated successfully', ['task' => $task->fresh()]);
    }

    public function destroy(Request $request, UserTask $task)
    {
        $this->authorize('delete', $task);
        $task->delete();

        return responseJson('Task deleted successfully');
    }

    private function assertApplicationOwnership(Request $request): void
    {
        if (! $request->filled('user_application_id')) {
            return;
        }

        $ownsApplication = $request->user()->applications()
            ->whereKey($request->integer('user_application_id'))
            ->exists();

        abort_unless($ownsApplication, 403, 'You cannot attach tasks to this application.');
    }
}
