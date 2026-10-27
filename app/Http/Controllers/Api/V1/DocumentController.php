<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admissions\DocumentRequest;
use App\Http\Resources\ApplicationDocumentResource;
use App\Models\ApplicationDocument;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        $documents = $request->user()->documents()
            ->when($request->filled('type'), fn ($builder) => $builder->where('type', $request->string('type')))
            ->when($request->filled('status'), fn ($builder) => $builder->where('status', $request->string('status')))
            ->latest()
            ->get();

        return responseJson('Documents fetched successfully', [
            'documents' => ApplicationDocumentResource::collection($documents)->resolve(),
        ]);
    }

    public function store(DocumentRequest $request)
    {
        $user = $request->user();
        $file = $request->file('file');

        if ($request->filled('user_application_id')) {
            $ownsApplication = $user->applications()->whereKey($request->integer('user_application_id'))->exists();
            abort_unless($ownsApplication, 403, 'You cannot attach documents to this application.');
        }

        $path = $file->store("admissions/{$user->id}/documents", 'local');

        $document = $user->documents()->create([
            'user_application_id' => $request->input('user_application_id'),
            'type' => $request->string('type'),
            'name' => $request->input('name') ?: $file->getClientOriginalName(),
            'disk' => 'local',
            'path' => $path,
            'original_name' => $file->getClientOriginalName(),
            'mime_type' => $file->getClientMimeType(),
            'size' => $file->getSize(),
            'status' => 'pending',
        ]);

        AuditLog::record('document.uploaded', $document, ['type' => $document->type]);

        return responseJson(
            'Document uploaded successfully',
            ['document' => (new ApplicationDocumentResource($document))->resolve()],
            true,
            201,
        );
    }

    public function download(Request $request, ApplicationDocument $document): StreamedResponse
    {
        $this->authorize('view', $document);

        abort_unless(Storage::disk($document->disk)->exists($document->path), 404, 'File not found.');

        AuditLog::record('document.downloaded', $document);

        return Storage::disk($document->disk)->download($document->path, $document->original_name ?: $document->name);
    }

    public function destroy(Request $request, ApplicationDocument $document)
    {
        $this->authorize('delete', $document);

        Storage::disk($document->disk)->delete($document->path);
        $document->delete();

        return responseJson('Document deleted successfully');
    }
}
