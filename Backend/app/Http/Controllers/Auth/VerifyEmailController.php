<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class VerifyEmailController extends Controller
{
    public function __invoke(Request $request, $id, $hash)
    {
        Log::info('Email verification started', [
            'id' => $id,
            'hash' => $hash,
            'url' => $request->fullUrl()
        ]);

        try {
            // Trouver l'utilisateur
            $user = User::find($id);
            
            if (!$user) {
                Log::warning('User not found', ['id' => $id]);
                return redirect('http://localhost:5173/email-verification?status=user_not_found');
            }

            Log::info('User found', [
                'user_id' => $user->id,
                'email' => $user->email,
                'current_verified_at' => $user->email_verified_at
            ]);

            // Vérifier le hash
            $expectedHash = sha1($user->getEmailForVerification());
            if (!hash_equals((string) $hash, $expectedHash)) {
                Log::warning('Hash mismatch', [
                    'provided' => $hash,
                    'expected' => $expectedHash
                ]);
                return redirect('http://localhost:5173/email-verification?status=invalid_hash');
            }

            Log::info('Hash verification passed');

            // Si déjà vérifié
            if ($user->email_verified_at) {
                Log::info('Email already verified');
                return redirect('http://localhost:5173/dashboard?verified=already');
            }

            // ESSAYER PLUSIEURS MÉTHODES DE MISE À JOUR

            // Méthode 1: DB::table direct
            $method1Result = DB::table('users')
                ->where('id', $id)
                ->update([
                    'email_verified_at' => now(),
                    'updated_at' => now()
                ]);

            Log::info('Method 1 (DB::table) result', ['result' => $method1Result]);

            // Vérifier si ça a marché
            $checkAfterMethod1 = DB::table('users')->where('id', $id)->value('email_verified_at');
            Log::info('After method 1 check', ['email_verified_at' => $checkAfterMethod1]);

            if (!$checkAfterMethod1) {
                // Méthode 2: Raw SQL
                $method2Result = DB::statement(
                    'UPDATE users SET email_verified_at = ?, updated_at = ? WHERE id = ?',
                    [now(), now(), $id]
                );
                Log::info('Method 2 (raw SQL) result', ['result' => $method2Result]);
                
                $checkAfterMethod2 = DB::table('users')->where('id', $id)->value('email_verified_at');
                Log::info('After method 2 check', ['email_verified_at' => $checkAfterMethod2]);
            }

            if (!$checkAfterMethod1 && !isset($checkAfterMethod2)) {
                // Méthode 3: Eloquent avec forceFill
                $user->forceFill([
                    'email_verified_at' => now(),
                ])->save();
                
                Log::info('Method 3 (forceFill) attempted');
                $checkAfterMethod3 = $user->fresh()->email_verified_at;
                Log::info('After method 3 check', ['email_verified_at' => $checkAfterMethod3]);
            }

            // Vérification finale
            $finalUser = User::find($id);
            Log::info('Final verification check', [
                'email_verified_at' => $finalUser->email_verified_at,
                'updated_at' => $finalUser->updated_at
            ]);

            if ($finalUser->email_verified_at) {
                // Déclencher l'événement
                event(new Verified($finalUser));
                Log::info('Verification successful - event dispatched');
                
                return redirect('http://localhost:5173/dashboard?verified=success');
            } else {
                Log::error('All update methods failed');
                return redirect('http://localhost:5173/email-verification?status=update_failed');
            }

        } catch (\Exception $e) {
            Log::error('Email verification exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect('http://localhost:5173/email-verification?status=server_error');
        }
    }
}