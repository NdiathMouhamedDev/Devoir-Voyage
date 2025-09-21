<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use Illuminate\Support\Facades\Log;


class WebVerifyEmailController extends Controller
{
    /**
     * Vérifier l'email depuis un lien web (navigateur)
     */
    public function verify(Request $request): View|RedirectResponse
    {
        try {
            $user = User::find($request->route('id'));

            if (!$user) {
                return $this->showError('Utilisateur non trouvé');
            }

            // Vérifier la signature du lien
            if (!$request->hasValidSignature()) {
                return $this->showError('Lien de vérification invalide ou expiré');
            }

            if (!hash_equals((string) $request->route('hash'), sha1($user->getEmailForVerification()))) {
                return $this->showError('Lien de vérification invalide');
            }

            if ($user->hasVerifiedEmail()) {
                return $this->showSuccess('Email déjà vérifié', $user, true);
            }

            if ($user->markEmailAsVerified()) {
                event(new Verified($user));
            }

            return $this->showSuccess('Email vérifié avec succès', $user);

        } catch (\Exception $e) {
            Log::error('Email verification error: ' . $e->getMessage());
            return $this->showError('Une erreur est survenue lors de la vérification');
        }
    }

    private function showSuccess(string $message, User $user, bool $alreadyVerified = false): View
    {
        return view('auth.verification-success', [
            'message' => $message,
            'user' => $user,
            'already_verified' => $alreadyVerified
        ]);
    }

    private function showError(string $message): View
    {
        return view('auth.verification-failed', [
            'message' => $message
        ]);
    }
}