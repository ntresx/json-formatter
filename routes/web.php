<?php

use App\Http\Controllers\JsonFormatterController;
use Illuminate\Support\Facades\Route;

Route::get('/', [JsonFormatterController::class, 'index'])
    ->name('json-formatter');
