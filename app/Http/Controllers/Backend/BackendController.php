<?php

namespace App\Http\Controllers\backend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class BackendController extends Controller
{
    //

    public function index(){
        return view('backend.pages.index');
    }
}
