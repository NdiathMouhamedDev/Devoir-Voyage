<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ValidateEmailVerification
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Vérifier si tous les paramètres requis sont présents
        if (!$request->hasValidSignature(false)) {
            return redirect(env('FRONTEND_URL', 'http://localhost:3173') . '/email-verification/error?message=invalid_signature');
        }

        return $next($request);
    }
}