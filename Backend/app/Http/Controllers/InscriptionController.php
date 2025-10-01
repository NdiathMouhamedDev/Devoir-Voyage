<?php
namespace App\Http\Controllers;

use App\Models\Inscription;
use App\Models\Hourly;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\Notifications\PlanningNotification;


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

        $inscription->notify(new PlanningNotification($hourly, 'inscription'));

        return response()->json([
            'message' => 'Inscription réussie',
            'data' => [
                'inscription' => $inscription,
                'user' => $user
            ]
        ], 201);
    }

    public function checkRegistration($eventId)
    {
        $user = Auth::user();
        
        $inscription = Inscription::where('event_id', $eventId)
            ->where('user_id', $user->id)
            ->first();
        
        if ($inscription) {
            return response()->json([
                'is_registered' => true,
                'statuts' => $inscription->statuts,
                'inscription' => $inscription
            ], 200);
        }
        
        return response()->json([
            'is_registered' => false
        ], 404);
    }
}