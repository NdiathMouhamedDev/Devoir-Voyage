<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use Illuminate\Foundation\Auth\EmailVerificationRequest;

// -------------------------
// Auth routes
// -------------------------
Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [AuthController::class, 'login']); // ton contrôleur qui retourne token + user
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth:sanctum');

// -------------------------
// User info (protégé)
// -------------------------
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// -------------------------
// Events (protégés par Sanctum)
// -------------------------
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('events', EventController::class); //crée auto les link crud
});

//-------------------------------- 
// Events interesting
// -------------------------------
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/events/{event}/interested', [EventController::class, 'interested']);
    Route::delete('/events/{event}/interested', [EventController::class, 'uninterested']);
});

// ---------------------------------
// Routes de vérification d'email - VERSION CONTRÔLEUR
// --------------------------------

// Route avec contrôleur dédié
Route::get('/verify-email/{id}/{hash}', [App\Http\Controllers\Auth\VerifyEmailController::class, '__invoke'])
    ->name('verification.verify');

Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
    ->middleware(['auth:sanctum', 'throttle:6,1'])
    ->name('verification.send');

// Route pour la page de vérification d'email (si nécessaire)
Route::get('/email/verify', function () {
    return view('auth.verify-email');
})->middleware('auth')->name('verification.notice');