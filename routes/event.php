<?php

use App\Http\Controllers\EventReminderController;
use Illuminate\Support\Facades\Route;

Route::controller(EventReminderController::class)
    ->prefix('event')
    ->middleware(['auth', 'verified'])
    ->group(function () {
        Route::get('', 'index');
        Route::post('', 'import');
        Route::patch('', 'store');

        Route::middleware('authUserId')->group(function () {
            $param = '{event}';
            Route::get($param, 'show');
            Route::put($param, 'update');
            Route::delete($param, 'destroy');
        });
    });
