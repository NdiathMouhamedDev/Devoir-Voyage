<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EventController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $user = auth()->user();

        if (!$user) {
            if ($user->role !== 'admin' && $user->id !== $event->user_id) {
                return response()->json(['error' => 'Accès refusé'], 403);
            }
            return response()->json(['error' => 'Utilisateur non authentifié'], 401);
        }

        $validatedData = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'category'    => 'required|string|in:' . implode(',', array_keys(Event::CATEGORIES)),
            'location'    => 'required|string',
            'start_at'    => 'required|date',
            'end_at'      => 'required|date|after:start_at',
        ]);

        $event = Event::create([
            ...$validatedData,
            'user_id' => $user->id,
        ]);

        return response()->json([
            'message' => 'Event created successfully',
            'data'    => $event
        ], 201);
    }

    public function index(): JsonResponse
    {
        $user = auth()->user();

        $events = Event::withCount('interestedUsers')->get()
            ->map(function ($event) use ($user) {
                $event->is_user_interested = $user 
                    ? $event->interestedUsers->contains($user->id)
                    : false;
                return $event;
            });

        return response()->json([
            'message' => 'Events retrieved successfully',
            'data' => $events,
            'total' => $events->count()
        ]);
    }



    public function show(Event $event): JsonResponse
    {
        return response()->json([
            'message' => 'Event retrieved successfully',
            'data'    => $event
        ]);
    }

    public function update(Request $request, Event $event): JsonResponse
    {
        $validatedData = $request->validate([
            'title'       => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'start_at'    => 'sometimes|date',
            'end_at'      => 'sometimes|date|after:start_at',
            'location'    => 'nullable|string',
        ]);

        $event->update($validatedData);

        return response()->json([
            'message' => 'Event updated successfully',
            'data'    => $event
        ]);
    }

    public function destroy(Event $event): JsonResponse
    {
        $user = auth()->user();

        if ($user->role !== 'admin' && $user->id !== $event->user_id) {
            return response()->json(['error' => 'Accès refusé'], 403);
        }

        $event->delete();

        return response()->json([
            'message' => 'Event deleted successfully'
        ]);
    }

    public function interested(Event $event)
    {
        $user = auth()->user();

        $user->interestedEvents()->syncWithoutDetaching([$event->id]);

        return response()->json([
            'message' => 'Vous vous êtes intéressé à cet événement',
            'event' => $event
        ]);
    }

    public function uninterested(Event $event)
    {
        $user = auth()->user();

        $user->interestedEvents()->detach($event->id);

        return response()->json([
            'message' => 'Vous n’êtes plus intéressé par cet événement',
            'event' => $event
        ]);
    }

}
