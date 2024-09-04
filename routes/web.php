<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')
    ->prefix('profile')
    ->controller(ProfileController::class)
    ->group(function () {
        Route::get('', 'edit')->name('profile.edit');
        Route::patch('', 'update')->name('profile.update');
        Route::delete('', 'destroy')->name('profile.destroy');
    });

require_once __DIR__ . '/auth.php';
