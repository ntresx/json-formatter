<?php

namespace App\Http\Controllers;

use Illuminate\View\View;

class JsonFormatterController extends Controller
{
    public function index(): View
    {
        return view('json-formatter');
    }
}
