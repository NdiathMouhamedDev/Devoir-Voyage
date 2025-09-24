<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Models\User;
use Illuminate\Auth\Events\Verified;

// -------------------------
// Auth routes
// -------------------------
Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [AuthController::class, 'login']);
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
});

// Events interesting
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/events/{event}/interested', [EventController::class, 'interested']);
    Route::delete('/events/{event}/interested', [EventController::class, 'uninterested']);
});

// ---------------------------------
// Routes de vérification d'email - CORRIGÉES
// ---------------------------------

// Route principale - SANS auth:sanctum car l'utilisateur n'est pas connecté quand il clique sur le lien
Route::get('/verify-email/{id}/{hash}', function (Request $request, $id, $hash) {
    try {
        $user = User::findOrFail($id);
        
        // Vérifier le hash
        if (!hash_equals((string) $hash, sha1($user->getEmailForVerification()))) {
            return redirect(env('FRONTEND_URL', 'http://localhost:5173') . '/email-verification?status=invalid');
        }
        
        // Si déjà vérifié
        if ($user->hasVerifiedEmail()) {
            return redirect(env('FRONTEND_URL', 'http://localhost:5173') . '/dashboard?verified=already');
        }
        
        // Marquer comme vérifié
        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }
        
        // Rediriger vers le frontend avec succès
        return redirect(env('FRONTEND_URL', 'http://localhost:5173') . '/dashboard?verified=success');
        
    } catch (\Exception $e) {
        \Log::error('Email verification error: ' . $e->getMessage());
        return redirect(env('FRONTEND_URL', 'http://localhost:5173') . '/email-verification?status=error');
    }
})->name('verification.verify');

// Route pour renvoyer l'email de vérification
Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
    ->middleware(['auth:sanctum', 'throttle:6,1'])
    ->name('verification.send');

// Route pour vérifier le statut de vérification
Route::middleware('auth:sanctum')->get('/email/verification-status', function (Request $request) {
    return response()->json([
        'email_verified' => $request->user()->hasVerifiedEmail(),
        'email_verified_at' => $request->user()->email_verified_at
    ]);
});