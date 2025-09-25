<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use App\Models\Event;
use App\Models\User;

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
        $user = $request->user();
        
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,'.$user->id,
            'phone_number' => 'sometimes|string|max:20|nullable',
            'bio' => 'sometimes|string|nullable',
            'address' => 'sometimes|string|nullable',
            'current_password' => 'required_with:password|string',
            'password' => 'sometimes|string|min:8|confirmed',
        ]);

        if ($request->hasFile('profile_photo')) {
            $path = $request->file('profile_photo')->store('profile-photos', 'public');
            $user->profile_photo = $path;
        }

        // Met à jour les champs validés
        $user->fill($validated);
        
        // Génère/actualise le QR Code avec les infos utilisateur (JSON) en PNG
        Storage::disk('public')->makeDirectory('qrcodes');
        $qrCodePath = 'qrcodes/'.$user->id.'.png';
        $payload = json_encode([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'phone_number' => $user->phone_number,
            'address' => $user->address,
            'bio' => $user->bio,
        ]);
        QrCode::format('png')->size(300)
            ->generate($payload, storage_path('app/public/'.$qrCodePath));
        $user->qr_code = $qrCodePath;

        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ]);
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
                'message' => 'Current password is incorrect'
            ], 400);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            'message' => 'Password updated successfully'
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

