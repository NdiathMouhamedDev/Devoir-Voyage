<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )

    

    ->withMiddleware(function (Middleware $middleware) {

         // Middleware globaux
        $middleware->append([
            \Illuminate\Http\Middleware\HandleCors::class,
        ]);

        // Middleware API - SANS EnsureFrontendRequestsAreStateful pour éviter les problèmes
        $middleware->api(prepend: [
            // Ne pas ajouter EnsureFrontendRequestsAreStateful ici
        ]);

        // Alias de middleware
        $middleware->alias([
            'verified' => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,
            'sanctum.stateful' => \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Gérer les erreurs d'authentification pour les routes API
        $exceptions->render(function (\Illuminate\Auth\AuthenticationException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => 'Unauthenticated',
                    'error' => 'Token required or invalid',
                    'code' => 401
                ], 401);
            }
            
            // Pour les autres routes, retourner une erreur JSON aussi (mode API pur)
            return response()->json([
                'message' => 'Authentication required',
                'error' => 'Please login first'
            ], 401);
        });
        
        // Gérer les erreurs de routes non trouvées
        $exceptions->render(function (\Symfony\Component\Routing\Exception\RouteNotFoundException $e, $request) {
            return response()->json([
                'message' => 'Route not found',
                'error' => $e->getMessage(),
                'code' => 404
            ], 404);
        });
    })
    ->create();