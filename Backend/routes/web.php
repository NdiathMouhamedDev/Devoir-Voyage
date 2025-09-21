<?php
// routes/web.php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\VerifyEmailController;

Route::get('/', function () {
    return view('welcome');
});

// Route pour la vérification d'email (accessible depuis un navigateur)
// Route::get('/verify-email/{id}/{hash}', VerifyEmailController::class)
//     ->middleware(['signed'])
//     ->name('verification.verify');

// Si vous avez des routes d'authentification web, assurez-vous qu'elles n'interfèrent pas
// Commentez ou supprimez les routes qui causent des conflits

// Route::get('/login', ...); // Cette route peut causer le problème
// Route::post('/login', ...);