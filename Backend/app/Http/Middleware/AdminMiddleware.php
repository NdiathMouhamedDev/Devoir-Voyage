<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

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
        if (!$request->user()->isAdmin()) {
            return response()->json([
                'message' => 'Admin access required. Only administrators can access the dashboard.',
                'user_role' => $request->user()->role
            ], 403);
        }

        return $next($request);
    }
}