<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    // Récupérer profil
    public function profile()
    {
        return Auth::user();
    }

    // Mettre à jour profil
    public function update(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'telephone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Profil mis à jour',
            'user' => $user
        ]);
    }
}
