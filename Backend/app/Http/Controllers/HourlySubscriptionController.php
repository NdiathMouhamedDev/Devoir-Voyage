<?php

namespace App\Http\Controllers;

use App\Models\Hourly;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Events\HourlyUpdated;

class HourlySubscriptionController extends Controller
{
    public function subscribe(Request $request, $hourlyId)
    {
        $user = Auth::user();
        $hourly = Hourly::findOrFail($hourlyId);

        // Créer une notification de confirmation d'abonnement
        $notification = Notification::create([
            'user_id' => $user->id,
            'hourly_id' => $hourly->id,
            'type' => 'subscription',
            'message' => "Vous venez de vous abonner aux notifications pour \"{$hourly->title}\"",
        ]);

        // Envoyer la notification en temps réel
        event(new HourlyUpdated(
            $hourly->id,
            "Vous venez de vous abonner aux notifications pour \"{$hourly->title}\""
        ));

        return response()->json([
            'message' => 'Abonnement réussi',
            'notification' => $notification
        ], 200);
    }
}