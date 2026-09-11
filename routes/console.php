<?php

use Illuminate\Support\Facades\Artisan;

Artisan::command('about', function () {
    $this->comment('JSON Formatter — a small Laravel developer utility.');
})->purpose('Display application information');
