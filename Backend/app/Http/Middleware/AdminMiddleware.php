<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;


class AdminMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Vérifier si l'utilisateur est connecté
        if (!$request->user()) {
            return response()->json([
                'message' => 'Authentication required'
            ], 401);
        }

        // Vérifier si l'utilisateur est admin
        if (!Auth::check() || Auth::user()->role !== 'admin') {
                return response()->json([
                    'message' => 'Accès refusé : admin requis',
                    'role' => Auth::user()->role ?? 'guest'
                ], 403);
            }

        return $next($request);
    }
}