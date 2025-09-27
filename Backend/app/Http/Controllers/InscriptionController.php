<?php

namespace App\Http\Controllers;

use App\Models\Hourly;
use App\Models\Inscription;
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

        // Vérifier si l’événement a déjà commencé
        if (Carbon::now()->greaterThanOrEqualTo($hourly->date_heure)) {
            return response()->json(['message' => 'Impossible de s’inscrire, l’événement a déjà commencé'], 403);
        }

        // Vérifier si déjà inscrit
        $exists = Inscription::where('user_id', $user->id)
            ->where('hourly_id', $hourly->id)
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Vous êtes déjà inscrit à cet horaire'], 409);
        }

        $inscription = Inscription::create([
            'user_id' => $user->id,
            'hourly_id' => $hourly->id,
        ]);

        return response()->json([
            'message' => 'Inscription réussie',
            'data' => $inscription,
        ], 201);
    }

    public function destroy($hourlyId)
    {
        $user = Auth::user();
        $inscription = Inscription::where('user_id', $user->id)
            ->where('hourly_id', $hourlyId)
            ->first();

        if (!$inscription) {
            return response()->json(['message' => 'Non inscrit'], 404);
        }

        $inscription->delete();

        return response()->json(['message' => 'Désinscription réussie']);
    }
}
