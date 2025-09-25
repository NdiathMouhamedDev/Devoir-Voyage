<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\AdminRequestNotification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\URL;

class AdminRequestController extends Controller
{
    /**
     * Demander le rôle admin
     */
    public function requestAdmin(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // Vérifier si l'utilisateur est déjà admin
        if ($user->role === 'admin') {
            return response()->json([
                'message' => 'Vous êtes déjà administrateur',
                'status' => 'already_admin'
            ]);
        }
        
        // Vérifier si une demande est déjà en cours
        if ($user->admin_request_status === 'pending') {
            return response()->json([
                'message' => 'Une demande est déjà en cours. Vérifiez votre email.',
                'status' => 'pending',
                'requested_at' => $user->admin_requested_at
            ]);
        }
        
        try {
            // Marquer la demande comme en attente
            $user->update([
                'admin_request_status' => 'pending',
                'admin_requested_at' => now(),
                'admin_verification_token' => sha1($user->email . now())
            ]);
            
            // Générer l'URL de vérification sécurisée
            $verificationUrl = URL::temporarySignedRoute(
                'admin.verify',
                now()->addHours(24), // Expire dans 24h
                [
                    'id' => $user->id,
                    'hash' => sha1($user->email)
                ]
            );
            
            // Envoyer l'email de vérification
            $user->notify(new AdminRequestNotification($verificationUrl));
            
            \Log::info('Admin request sent', [
                'user_id' => $user->id,
                'email' => $user->email,
                'url' => $verificationUrl
            ]);
            
            return response()->json([
                'message' => 'Demande envoyée ! Vérifiez votre email pour confirmer.',
                'status' => 'email_sent',
                'expires_in' => '24 heures'
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Admin request failed', [
                'user_id' => $user->id,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'message' => 'Erreur lors de l\'envoi de la demande',
                'error' => 'Veuillez réessayer plus tard'
            ], 500);
        }
    }
    
    /**
     * Vérifier le statut de la demande admin
     */
    public function getStatus(Request $request): JsonResponse
    {
        $user = $request->user();
        
        return response()->json([
            'current_role' => $user->role,
            'admin_request_status' => $user->admin_request_status,
            'requested_at' => $user->admin_requested_at,
            'can_request' => $user->role !== 'admin' && $user->admin_request_status !== 'pending'
        ]);
    }
    
    /**
     * Vérifier la demande admin depuis l'email
     */
    public function verifyAdminRequest(Request $request)
    {
        try {
            $userId = $request->route('id');
            $hash = $request->route('hash');
            
            \Log::info('Admin verification attempt', [
                'user_id' => $userId,
                'hash' => $hash,
                'url' => $request->fullUrl()
            ]);
            
            $user = User::find($userId);
            
            if (!$user) {
                return $this->redirectToFrontend('/admin-verification/error?message=user_not_found');
            }
            
            // Vérifier la signature
            if (!$request->hasValidSignature()) {
                \Log::warning('Invalid signature for admin verification');
                return $this->redirectToFrontend('/admin-verification/error?message=invalid_link');
            }
            
            // Vérifier le hash
            if (!hash_equals($hash, sha1($user->email))) {
                \Log::warning('Hash mismatch for admin verification');
                return $this->redirectToFrontend('/admin-verification/error?message=invalid_hash');
            }
            
            // Vérifier si la demande est en attente
            if ($user->admin_request_status !== 'pending') {
                $message = $user->role === 'admin' ? 'already_admin' : 'no_pending_request';
                return $this->redirectToFrontend("/admin-verification/error?message={$message}");
            }
            
            // Promouvoir l'utilisateur en admin
            $user->update([
                'role' => 'admin',
                'admin_request_status' => 'approved',
                'admin_approved_at' => now(),
                'admin_verification_token' => null
            ]);
            
            \Log::info('User promoted to admin', [
                'user_id' => $user->id,
                'email' => $user->email
            ]);
            
            return $this->redirectToFrontend('/admin-verification/success?message=promoted&user=' . urlencode($user->name));
            
        } catch (\Exception $e) {
            \Log::error('Admin verification error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return $this->redirectToFrontend('/admin-verification/error?message=server_error');
        }
    }
    
    private function redirectToFrontend(string $path): \Illuminate\Http\RedirectResponse
    {
        $baseUrl = env('FRONTEND_URL', 'http://localhost:5173');
        return redirect($baseUrl . $path);
    }
}