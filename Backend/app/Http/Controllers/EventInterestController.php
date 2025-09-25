<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class EventInterestController extends Controller
{
    public function store(Event $event)
    {
        $user = auth()->user();

        if ($event->interestedUsers()->where("user_id", $user->id)->exists()) {
            return response()->json(["message" => "Déjà intéressé"], 400);
        }

        $event->interestedUsers()->attach($user->id);

        return response()->json(["message" => "Vous êtes intéressé par cet événement"]);
    }

    public function destroy(Event $event)
    {
        $user = auth()->user();

        $event->interestedUsers()->detach($user->id);

        return response()->json(["message" => "Vous n'êtes plus intéressé par cet événement"]);
    }
}
