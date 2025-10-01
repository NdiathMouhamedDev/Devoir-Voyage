<?php

namespace App\Http\Controllers;

use App\Models\Hourly;
use App\Models\Notification;
use App\Models\Inscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Events\HourlyUpdated;
use App\Notifications\PlanningNotification;

class HourlySubscriptionController extends Controller
{
    public function subscribe(Request $request, $hourlyId)
    {
        $user = Auth::user();
        $hourly = Hourly::findOrFail($hourlyId);

        // Créer ou récupérer l'inscription
        $inscription = Inscription::firstOrCreate([
            'user_id' => $user->id,
            'hourly_id' => $hourly->id,
        ]);

        // Créer une notification de confirmation d'abonnement
        $notification = Notification::create([
            'user_id' => $user->id,
            'hourly_id' => $hourly->id,
            'type' => 'subscription',
            'message' => "Vous venez de vous abonner aux notifications pour \"{$hourly->title}\"",
        ]);

        // 🔥 ENVOYER LA NOTIFICATION WHATSAPP IMMÉDIATEMENT
        try {
            $inscription->notify(new PlanningNotification($hourly, 'inscription'));
        } catch (\Exception $e) {
            \Log::error('Erreur envoi WhatsApp', ['error' => $e->getMessage()]);
        }

        // Envoyer la notification en temps réel
        event(new HourlyUpdated(
            $hourly->id,
            "Vous venez de vous abonner aux notifications pour \"{$hourly->title}\""
        ));

        return response()->json([
            'message' => 'Abonnement réussi et notification WhatsApp envoyée',
            'notification' => $notification
        ], 200);
    }
}