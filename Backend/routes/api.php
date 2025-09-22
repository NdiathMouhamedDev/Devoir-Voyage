<?php

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
    Route::apiResource('events', EventController::class);

    // Route::get('/events', [EventController::class, 'index']);   // liste des events
    // Route::post('/events', [EventController::class, 'store']);  // créer un event
    // Route::get('/events/{id}', [EventController::class, 'show']); // voir un event
    // Route::put('/events/{id}', [EventController::class, 'update']); // maj event
    // Route::delete('/events/{id}', [EventController::class, 'destroy']); // suppr event
});


