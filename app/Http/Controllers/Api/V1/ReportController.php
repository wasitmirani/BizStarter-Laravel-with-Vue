<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\Admissions\DigestService;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function __construct(protected DigestService $digests) {}

    public function index(Request $request)
    {
        $reports = $request->user()->dailyReports()
            ->latest('report_date')
            ->paginate((int) $request->input('per_page', 10));

        return responseJson('Reports fetched successfully', [
            'reports' => $reports->items(),
            'meta' => [
                'current_page' => $reports->currentPage(),
                'last_page' => $reports->lastPage(),
                'per_page' => $reports->perPage(),
                'total' => $reports->total(),
            ],
        ]);
    }

    public function generate(Request $request)
    {
        $report = $this->digests->generate($request->user());

        return responseJson('Report generated successfully', ['report' => $report], true, 201);
    }
}
