<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\University;
use App\Services\Admissions\CatalogSyncService;
use Illuminate\Http\Request;

class CatalogSyncController extends Controller
{
    public function sync(Request $request, CatalogSyncService $sync)
    {
        $data = $request->validate([
            'university_id' => ['nullable', 'integer', 'exists:universities,id'],
        ]);

        $university = isset($data['university_id'])
            ? University::find($data['university_id'])
            : null;

        $result = $sync->sync($university);

        return responseJson(
            $university ? 'University sources checked' : 'Catalog sources checked',
            $result,
        );
    }
}
