<?php

use App\Http\Controllers\EventReminderController;
use Illuminate\Support\Facades\Route;

Route::controller(EventReminderController::class)
    ->prefix('event')
    ->middleware(['auth', 'verified'])
    ->group(function () {
        $param = '{event}';

        Route::get('', 'index');
        Route::get($param, 'show');
        Route::post('', 'store');
        Route::patch($param, 'update');
        // Route::put('', 'import');
        Route::delete($param, 'destroy');
    });
