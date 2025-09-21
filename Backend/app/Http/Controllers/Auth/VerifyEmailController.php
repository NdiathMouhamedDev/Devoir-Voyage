<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     * Cette route est publique - pas besoin de token
     */
    public function __invoke(Request $request)
    {
        Log::info('Email verification attempt', [
            'id' => $request->route('id'),
            'hash' => $request->route('hash'),
            'expires' => $request->get('expires'),
            'signature' => $request->get('signature'),
            'url' => $request->fullUrl(),
            'headers' => $request->headers->all()
        ]);

        try {
            $userId = $request->route('id');
            $hash = $request->route('hash');

            // Validation basique des paramètres
            if (!$userId || !$hash) {
                Log::error('Missing required parameters', compact('userId', 'hash'));
                return $this->redirectToError('missing_params');
            }

            // Trouver l'utilisateur
            $user = User::find($userId);
            if (!$user) {
                Log::error('User not found', ['id' => $userId]);
                return $this->redirectToError('user_not_found');
            }

            Log::info('User found for verification', [
                'user_id' => $user->id,
                'email' => $user->email,
                'already_verified' => $user->hasVerifiedEmail()
            ]);

            // Vérifier le hash (sans signature pour le moment)
            $expectedHash = sha1($user->getEmailForVerification());
            if (!hash_equals($hash, $expectedHash)) {
                Log::error('Hash verification failed', [
                    'received' => $hash,
                    'expected' => $expectedHash,
                    'user_email' => $user->email
                ]);
                return $this->redirectToError('invalid_hash');
            }

            // Si déjà vérifié
            if ($user->hasVerifiedEmail()) {
                Log::info('Email already verified');
                return $this->redirectToSuccess('already_verified', $user->name);
            }

            // Marquer comme vérifié
            if ($user->markEmailAsVerified()) {
                event(new Verified($user));
                Log::info('Email verified successfully', ['user_id' => $user->id]);
                return $this->redirectToSuccess('verified', $user->name);
            }

            Log::error('Failed to mark email as verified');
            return $this->redirectToError('verification_failed');

        } catch (\Exception $e) {
            Log::error('Email verification exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return $this->redirectToError('server_error');
        }
    }

    private function redirectToSuccess(string $message, string $userName)
    {
        $url = $this->getFrontendUrl("/email-verification/success?message={$message}&user=" . urlencode($userName));
        Log::info('Redirecting to success page', ['url' => $url]);
        return redirect($url);
    }

    private function redirectToError(string $message)
    {
        $url = $this->getFrontendUrl("/email-verification/error?message={$message}");
        Log::info('Redirecting to error page', ['url' => $url]);
        return redirect($url);
    }

    private function getFrontendUrl(string $path): string
    {
        return env('FRONTEND_URL', 'http://localhost:5173') . $path;
    }
}