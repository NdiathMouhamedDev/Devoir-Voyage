<?php
// routes/api.php

// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\Auth\AuthenticatedSessionController;
// use App\Http\Controllers\Auth\RegisteredUserController;
// use App\Http\Controllers\EventController;
// use App\Http\Controllers\AuthController;

// use App\Http\Controllers\Auth\EmailVerificationNotificationController;
// use App\Http\Controllers\Auth\VerifyEmailController;


// Routes d'authentification
// Route::post('/register', [RegisteredUserController::class, 'store']);
// Route::post('/login', [AuthenticatedSessionController::class, 'store']);

// Login / Logout
// Route::post('/login', [AuthenticatedSessionController::class, 'store']);
// Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
//     ->middleware('auth:sanctum');

// Route::post('/login', [AuthController::class, 'login']);

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

// Route::middleware('auth:sanctum')->post('/events', [EventController::class, 'store']);


// Routes de vérification d'email
// Route::get('/verify-email/{id}/{hash}', VerifyEmailController::class)
//     ->middleware(['auth:sanctum', 'signed'])
//     ->name('verification.verify');

// Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
//     ->middleware(['auth:sanctum', 'throttle:6,1'])
//     ->name('verification.send');

// Events protégés
// Route::middleware('auth:sanctum')->group(function () {
//     Route::get('/events', [EventController::class, 'index']);
//     Route::post('/events', [EventController::class, 'store']);
//     Route::get('/events/{id}', [EventController::class, 'show']);
// });

// Route::apiResource('events', EventController::class);

// Route pour la page de vérification d'email (si nécessaire)
// Route::get('/email/verify', function () {
//     return view('auth.verify-email');
// })->middleware('auth')->name('verification.notice');

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\AuthController;

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
    Route::get('/events', [EventController::class, 'index']);   // liste des events
    Route::post('/events', [EventController::class, 'store']);  // créer un event
    Route::get('/events/{id}', [EventController::class, 'show']); // voir un event
    Route::put('/events/{id}', [EventController::class, 'update']); // maj event
    Route::delete('/events/{id}', [EventController::class, 'destroy']); // suppr event
});
