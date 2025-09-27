<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventInterestController;
use App\Http\Controllers\HourlyController;
use App\Http\Controllers\InscriptionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;



// ----------------------
// Routes public events
// ---------------------
Route::get('/events/public', [EventController::class, 'publicEvents']);


// ----------------
// user
// --------------

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [UserController::class, 'profile']); 
    Route::put('/user', [UserController::class, 'update']); 
});

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

// Route pour vérifier les rôles admin
Route::middleware('auth:sanctum')->get('/user/role', function (Request $request) {
    return response()->json([
        'user' => $request->user(),
        'is_admin' => $request->user()->isAdmin(),
        'role' => $request->user()->role,
        'can_access_dashboard' => $request->user()->isAdmin()
    ]);
});

// Route de vérification d'accès dashboard
Route::middleware('auth:sanctum')->get('/dashboard/access-check', function (Request $request) {
    if (!$request->user()->isAdmin()) {
        return response()->json([
            'message' => 'Access denied to dashboard',
            'reason' => 'Admin role required',
            'user_role' => $request->user()->role,
            'redirect_to' => '/unauthorized'
        ], 403);
    }
    
    return response()->json([
        'message' => 'Dashboard access granted',
        'user' => $request->user()->name,
        'role' => $request->user()->role
    ]);
});

// -------------------------
// Events (protégés par Sanctum seulement)
// -------------------------
Route::middleware(['auth:sanctum',])->group(function () {
    Route::apiResource('events', EventController::class); //crée auto les link crud
});

//-------------------------------- 
// Events interesting 
// -------------------------------
Route::middleware('auth:sanctum',)->group(function () {
    Route::post('/events/{event}/interested', [EventInterestController::class, 'store']);
    Route::delete('/events/{event}/interested', [EventInterestController::class, 'destroy']);
    Route::get('/events/{event}/interest-status', [EventInterestController::class, 'status']);
});

// -------------------------
// Routes Dashboard Admin
// -------------------------
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/dashboard/stats', function (Request $request) {
        return response()->json([
            'message' => 'Welcome to admin dashboard!',
            'admin_user' => $request->user()->name,
            'total_users' => \App\Models\User::count(),
            'total_events' => \App\Models\Event::count() ?? 0
        ]);
    });
    
    Route::get('/dashboard/users', function (Request $request) {
        return response()->json([
            'users' => \App\Models\User::select('id', 'name', 'email', 'role', 'created_at')->get()
        ]);
    });
});

// ---------------------------------
// Routes de vérification d'email - DÉSACTIVÉES
// --------------------------------

// // Routes de vérification d'email sont supprimées pour l'instant

// -------------------------
// Routes Profile
// -------------------------
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password.update');
    Route::get('/profile/interested-events', [ProfileController::class, 'interestedEvents'])->name('profile.interested-events');
    Route::get('/profile/{id}', [ProfileController::class, 'publicProfil'])->whereNumber('id')->name('profile.public');
});


// ----------------------
// Hourly
// -----------------------
Route::middleware('auth:sanctum',)->group(function () {
    Route::apiResource('hourly', HourlyController::class);
});

// ----------------------
// Les inscriptions
// ----------------------
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/hourly/{id}/inscrire', [InscriptionController::class, 'store']);
    Route::delete('/hourly/{id}/desinscrire', [InscriptionController::class, 'destroy']);
});



