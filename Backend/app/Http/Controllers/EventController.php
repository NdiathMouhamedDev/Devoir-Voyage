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
            return response()->json(['error' => 'Utilisateur non authentifié'], 401);
        }

        $event = Event::create([
            'title'       => $request->title,
            'description' => $request->description,
            'location'    => $request->location,
            'start_at'    => $request->start_at,
            'end_at'      => $request->end_at,
            'user_id'     => $user->id,
        ]);

        return response()->json([
            'message' => 'Event created successfully',
            'data'    => $event
        ], 201);
    }

    public function index(): JsonResponse
    {
        $events = Event::all();
        
        return response()->json([
            'message' => 'Events retrieved successfully',
            'data'    => $events,
            'total'   => $events->count()
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
        $event->delete();

        return response()->json([
            'message' => 'Event deleted successfully'
        ]);
    }
}
