<?php

namespace App\Http\Controllers\Backend\media;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UploadController extends Controller
{
    public function uploadSingleImage(Request $request){
        $path = getImagePath(request('type'));

        $image = uploadImage($path);
        return response()->json(['name' => $image], 200);
    }
}
