<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use App\Models\Event;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();
        $interestedEvents = Event::whereHas('interestedUsers', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->get();

        // Génère le QR code s'il est manquant ou le fichier n'existe pas
        Storage::disk('public')->makeDirectory('qrcodes');
        $expectedPath = 'qrcodes/'.$user->id.'.png';
        if (!$user->qr_code || !Storage::disk('public')->exists($user->qr_code)) {
            $payload = json_encode([
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone_number' => $user->phone_number,
                'address' => $user->address,
                'bio' => $user->bio,
            ]);
            QrCode::format('png')->size(300)
                ->generate($payload, storage_path('app/public/'.$expectedPath));
            $user->qr_code = $expectedPath;
            $user->save();
        }

        return response()->json([
            'user' => $user,
            'interested_events' => $interestedEvents
        ]);
    }

    public function update(Request $request)
    {
        try {
            $user = $request->user();
            
            // 1. Debug initial
            Log::info('=== DEBUT MISE A JOUR PROFIL ===');
            Log::info('User ID: ' . $user->id);
            Log::info('Has file: ' . ($request->hasFile('profile_photo') ? 'YES' : 'NO'));
            
            if ($request->hasFile('profile_photo')) {
                $file = $request->file('profile_photo');
                Log::info('File info:', [
                    'name' => $file->getClientOriginalName(),
                    'size' => $file->getSize(),
                    'type' => $file->getMimeType(),
                    'error' => $file->getError()
                ]);
            }

            // 2. Validation basique d'abord
            Log::info('=== VALIDATION ===');
            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'email' => 'sometimes|string|email|max:255|unique:users,email,'.$user->id,
                'phone_number' => 'sometimes|string|max:20|nullable',
                'bio' => 'sometimes|string|nullable',
                'address' => 'sometimes|string|nullable',
                'profile_photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
            ]);
            Log::info('Validation passed');

            // 3. Test de base des dossiers
            Log::info('=== TEST STORAGE ===');
            $publicPath = storage_path('app/public');
            $profilePhotosPath = $publicPath . '/profile-photos';
            
            Log::info('Public path exists: ' . (is_dir($publicPath) ? 'YES' : 'NO'));
            Log::info('Public path writable: ' . (is_writable($publicPath) ? 'YES' : 'NO'));
            
            if (!is_dir($profilePhotosPath)) {
                Log::info('Creating profile-photos directory');
                if (!mkdir($profilePhotosPath, 0755, true)) {
                    throw new \Exception('Cannot create profile-photos directory');
                }
            }
            Log::info('Profile photos path exists: ' . (is_dir($profilePhotosPath) ? 'YES' : 'NO'));
            Log::info('Profile photos path writable: ' . (is_writable($profilePhotosPath) ? 'YES' : 'NO'));

            // 4. Gestion simple de l'upload
            if ($request->hasFile('profile_photo')) {
                Log::info('=== UPLOAD PHOTO ===');
                
                $file = $request->file('profile_photo');
                
                // Vérification des erreurs d'upload
                if ($file->getError() !== UPLOAD_ERR_OK) {
                    throw new \Exception('Upload error: ' . $file->getErrorMessage());
                }
                
                // Supprimer l'ancienne photo
                if ($user->profile_photo) {
                    $oldPath = storage_path('app/public/' . $user->profile_photo);
                    if (file_exists($oldPath)) {
                        unlink($oldPath);
                        Log::info('Old photo deleted: ' . $oldPath);
                    }
                }
                
                // Générer un nom unique
                $filename = 'profile_' . $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();
                $relativePath = 'profile-photos/' . $filename;
                $fullPath = $publicPath . '/' . $relativePath;
                
                Log::info('Saving to: ' . $fullPath);
                
                // Sauvegarder le fichier
                if ($file->move($profilePhotosPath, $filename)) {
                    $user->profile_photo = $relativePath;
                    Log::info('File moved successfully to: ' . $relativePath);
                } else {
                    throw new \Exception('Failed to move uploaded file');
                }
            }

            // 5. Mise à jour des autres champs
            Log::info('=== UPDATE FIELDS ===');
            $fieldsToUpdate = collect($validated)->except(['profile_photo'])->toArray();
            if (!empty($fieldsToUpdate)) {
                $user->fill($fieldsToUpdate);
                Log::info('Fields to update:', array_keys($fieldsToUpdate));
            }

            // 6. Sauvegarde
            Log::info('=== SAVE USER ===');
            $user->save();
            Log::info('User saved successfully');

            // 7. QR Code (simplifié pour debug)
            Log::info('=== QR CODE ===');
            try {
                $this->updateQrCodeSimple($user);
                Log::info('QR Code updated');
            } catch (\Exception $e) {
                Log::warning('QR Code update failed: ' . $e->getMessage());
                // Ne pas faire échouer toute la requête pour le QR code
            }

            Log::info('=== SUCCESS ===');
            return response()->json([
                'message' => 'Profil mis à jour avec succès',
                'user' => $user->fresh()
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation failed:', $e->errors());
            return response()->json([
                'message' => 'Erreur de validation',
                'errors' => $e->errors()
            ], 422);
            
        } catch (\Exception $e) {
            Log::error('=== ERROR ===');
            Log::error('Message: ' . $e->getMessage());
            Log::error('File: ' . $e->getFile());
            Log::error('Line: ' . $e->getLine());
            Log::error('Trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'message' => 'Erreur serveur: ' . $e->getMessage()
            ], 500);
        }
    }

    private function updateQrCodeSimple(User $user)
    {
        $qrCodesPath = storage_path('app/public/qrcodes');
        if (!is_dir($qrCodesPath)) {
            mkdir($qrCodesPath, 0755, true);
        }

        $qrCodePath = 'qrcodes/' . $user->id . '.png';
        $fullQrPath = storage_path('app/public/' . $qrCodePath);

        $payload = json_encode([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone_number' => $user->phone_number,
            'address' => $user->address,
            'bio' => $user->bio,
        ]);

        QrCode::format('png')->size(300)->generate($payload, $fullQrPath);
        $user->qr_code = $qrCodePath;
        $user->save();
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Le mot de passe actuel est incorrect'
            ], 400);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            'message' => 'Mot de passe mis à jour avec succès'
        ]);
    }

    public function interestedEvents(Request $request)
    {
        $user = $request->user();
        $events = Event::whereHas('interestedUsers', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->get();

        return response()->json($events);
    }

    public function publicProfil($id)
    {
        return User::select('id','name','email')->findOrFail($id);
    }
}