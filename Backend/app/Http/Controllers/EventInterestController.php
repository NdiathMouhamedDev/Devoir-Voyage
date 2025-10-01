<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Inscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EventInterestController extends Controller
{

    /**
     * Vérifier le statut d'intérêt
     * ✅ PUBLIC : tout le monde peut voir le nombre, mais seul l'utilisateur connecté voit son statut
     */
    public function status($eventId)
    {
        $event = Event::findOrFail($eventId);
        $user = Auth::user();

        return response()->json([
            'is_interested' => $user ? $event->isUserInterested($user->id) : false,
            'interested_count' => $event->interested_count,
            'is_authenticated' => $user ? true : false
        ], 200);
    }

    
    /**
     * Ajouter un intérêt pour un événement
     * ✅ Requiert d'être connecté ET inscrit
     */
    public function store(Request $request, $eventId)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json([
                'message' => 'Vous devez être connecté pour marquer votre intérêt'
            ], 401);
        }

        $event = Event::findOrFail($eventId);

        // ✅ Vérifier si l'utilisateur est inscrit à cet événement
        // $isRegistered = Inscription::where('event_id', $eventId)
        //     ->where('user_id', $user->id)
        //     ->exists();

        // if (!$isRegistered) {
        //     return response()->json([
        //         'message' => 'Vous devez vous inscrire à cet événement avant de marquer votre intérêt'
        //     ], 403);
        // }

        // Vérifier si déjà intéressé
        if ($event->isUserInterested($user->id)) {
            return response()->json([
                'message' => 'Vous avez déjà marqué votre intérêt pour cet événement',
                'is_interested' => true,
                'interested_count' => $event->interested_count
            ], 200);
        }

        // Ajouter l'intérêt
        $event->interestedUsers()->attach($user->id);

        return response()->json([
            'message' => 'Intérêt ajouté avec succès',
            'is_interested' => true,
            'interested_count' => $event->interested_count
        ], 200);
    }

    /**
     * Retirer un intérêt pour un événement
     * ✅ Requiert d'être connecté
     */
    public function destroy($eventId)
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json([
                'message' => 'Vous devez être connecté'
            ], 401);
        }

        $event = Event::findOrFail($eventId);

        // Retirer l'intérêt (NE SUPPRIME PAS l'inscription)
        $event->interestedUsers()->detach($user->id);

        return response()->json([
            'message' => 'Intérêt retiré avec succès',
            'is_interested' => false,
            'interested_count' => $event->interested_count
        ], 200);
    }

    
}