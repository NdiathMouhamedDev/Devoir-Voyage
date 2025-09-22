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
    Route::apiResource('events', EventController::class); //crée auto les link crud
});


//-------------------------------- 
// Events interesting
// -------------------------------
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/events/{event}/interested', [EventController::class, 'interested']);
    Route::delete('/events/{event}/interested', [EventController::class, 'uninterested']);
});


