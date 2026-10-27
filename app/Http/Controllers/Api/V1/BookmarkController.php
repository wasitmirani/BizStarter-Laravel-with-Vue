<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProgramResource;
use App\Models\Program;
use App\Models\UserProgramBookmark;
use Illuminate\Http\Request;

class BookmarkController extends Controller
{
    public function index(Request $request)
    {
        $programs = $request->user()->bookmarks()
            ->with([
                'program.university',
                'program.admissionCalls',
                'program.assessments' => fn ($query) => $query->where('user_id', $request->user()->id),
            ])
            ->latest()
            ->get()
            ->pluck('program')
            ->filter()
            ->each(fn (Program $program) => $program->setAttribute('bookmarked', true));

        return responseJson('Bookmarks fetched successfully', [
            'programs' => ProgramResource::collection($programs)->resolve(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'program_id' => ['required', 'integer', 'exists:programs,id'],
        ]);

        $bookmark = UserProgramBookmark::firstOrCreate([
            'user_id' => $request->user()->id,
            'program_id' => $data['program_id'],
        ]);

        return responseJson(
            $bookmark->wasRecentlyCreated ? 'Program bookmarked' : 'Program already bookmarked',
            ['bookmark' => $bookmark],
            true,
            $bookmark->wasRecentlyCreated ? 201 : 200,
        );
    }

    public function destroy(Request $request, Program $program)
    {
        $request->user()->bookmarks()->where('program_id', $program->id)->delete();

        return responseJson('Bookmark removed successfully');
    }
}
