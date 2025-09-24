<?php
namespace App\Http\Controllers\Auth;

use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use App\Models\User;

class VerifyEmailController extends Controller
{
    /**
     * Version utilisant la logique standard Laravel
     */
    public function verify(EmailVerificationRequest $request)
    {
        if ($request->user()->hasVerifiedEmail()) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Email déjà vérifié'], 200);
            }
            
            return redirect('http://localhost:5173/dashboard')
                ->with('success', 'Email déjà vérifié');
        }

        if ($request->user()->markEmailAsVerified()) {
            event(new Verified($request->user()));
        }

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Email vérifié avec succès !',
                'user' => $request->user()
            ], 200);
        }

        return redirect('http://localhost:5173/dashboard')
            ->with('success', 'Email vérifié avec succès !');
    }

    /**
     * Version manuelle pour API (sans authentification requise)
     */
    public function __invoke(Request $request, $id, $hash)
    {
        try {
            $user = User::findOrFail($id);
            
            // Calculer le hash attendu selon la logique Laravel
            $expectedHash = sha1($user->getEmailForVerification());
            
            // Debug
            \Log::info('Email verification attempt', [
                'user_id' => $id,
                'provided_hash' => $hash,
                'expected_hash' => $expectedHash,
                'email' => $user->getEmailForVerification()
            ]);
            
            if (! hash_equals((string) $hash, $expectedHash)) {
                \Log::warning('Hash mismatch in email verification');
                
                return response()->json([
                    'message' => 'Lien de vérification invalide',
                    'debug' => [
                        'provided' => $hash,
                        'expected' => $expectedHash
                    ]
                ], 403);
            }
            
            if ($user->hasVerifiedEmail()) {
                return response()->json(['message' => 'Email déjà vérifié'], 200);
            }
            
            if ($user->markEmailAsVerified()) {
                event(new Verified($user));
            }
            
            return response()->json([
                'message' => 'Email vérifié avec succès !',
                'user' => $user->fresh()
            ], 200);
            
        } catch (\Exception $e) {
            \Log::error('Email verification error: ' . $e->getMessage());
            
            return response()->json([
                'message' => 'Erreur lors de la vérification',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}