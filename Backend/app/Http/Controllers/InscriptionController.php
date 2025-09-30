<?php
namespace App\Http\Controllers;

use App\Models\Inscription;
use App\Models\Hourly;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class InscriptionController extends Controller
{
    public function store(Request $request, $hourlyId)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Vous devez être connecté'], 401);
        }

        $hourly = Hourly::findOrFail($hourlyId);

        // Vérifier si l'événement a déjà commencé
        if ($hourly->startup && Carbon::now()->greaterThanOrEqualTo($hourly->startup)) {
            return response()->json(['message' => 'Impossible de s\'inscrire, l\'événement a déjà commencé'], 403);
        }

        $validated = $request->validate([
            'payment' => 'required|in:cash,online',
            'phone_number' => 'required|string',
            'address' => 'required|string',
            'statuts'=>'string',
        ]);

        // Vérifier doublon
        $exists = Inscription::where('user_id', $user->id)
            ->where('hourly_id', $hourly->id)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Vous êtes déjà inscrit à cet horaire'], 409);
        }

        $inscription = Inscription::create([
            'user_id' => $user->id,
            'hourly_id' => $hourly->id,
            'event_id' => $hourly->event_id,
            'payment' => $validated['payment'],        
            'phone_number' => $validated['phone_number'], 
            'address' => $validated['address'],        
            'statuts' => $validated['statuts'],
        ]);

        return response()->json([
            'message' => 'Inscription réussie',
            'data' => [
                'inscription' => $inscription,
                'user' => $user
            ]
        ], 201);
    }
}