<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class EventInterestController extends Controller
{
    public function status(Event $event): JsonResponse
    {
        $user = auth()->user(); // null si non connecté
        $isInterested = $user ? $event->interestedUsers()->where('user_id', $user->id)->exists() : false;
        $count = $event->interestedUsers()->count();

        return response()->json([
            'is_interested' => $isInterested,
            'interested_count' => $count
        ]);
    }

    public function store(Event $event): JsonResponse
    {
        $user = Auth::user();

        if ($event->interestedUsers()->where("user_id", $user->id)->exists()) {
            return response()->json([
                "message" => "Déjà intéressé",
                "interested_count" => $event->interestedUsers()->count(),
                "is_interested" => true
            ], 400);
        }

        $event->interestedUsers()->attach($user->id);
        $count = $event->interestedUsers()->count();

        return response()->json([
            "message" => "Vous êtes intéressé par cet événement",
            "interested_count" => $count,
            "is_interested" => true
        ]);
    }

    public function destroy(Event $event)
    {
        $user = Auth::user();

        $event->interestedUsers()->detach($user->id);
        $count = $event->interestedUsers()->count();

        return response()->json([
            "message" => "Vous n'êtes plus intéressé par cet événement",
            "interested_count" => $count,
            "is_interested" => false
        ]);
    }
}
