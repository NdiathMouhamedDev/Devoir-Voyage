<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EventController extends Controller
{
    public function __construct()
    {
        // protége toutes les actions par auth:sanctum et vérification d'email
        $this->middleware(['auth:sanctum','verified']);
    }

    // GET /api/events
    public function index(Request $request): JsonResponse
    {
        // pagination simple, retourner les events les plus récents
        $events = Event::orderBy('starts_at', 'desc')->paginate(10);
        return response()->json($events);
    }

    // POST /api/events
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'location'    => 'nullable|string|max:255',
            'starts_at'   => 'required|date',
            'ends_at'     => 'nullable|date|after_or_equal:starts_at',
        ]);

        // associer l'event à l'utilisateur connecté
        $data['user_id'] = $request->user()->id;

        $event = Event::create($data);

        return response()->json($event, 201);
    }

    // GET /api/events/{event}
    public function show(Event $event): JsonResponse
    {
        return response()->json($event);
    }

    // PUT/PATCH /api/events/{event}
    public function update(Request $request, Event $event): JsonResponse
    {
        $user = $request->user();

        // autorisation simple : propriétaire ou admin
        if ($user->id !== $event->user_id && ($user->role ?? 'user') !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $data = $request->validate([
            'title'       => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'location'    => 'nullable|string|max:255',
            'starts_at'   => 'sometimes|required|date',
            'ends_at'     => 'nullable|date|after_or_equal:starts_at',
        ]);

        $event->update($data);

        return response()->json($event);
    }

    // DELETE /api/events/{event}
    public function destroy(Request $request, Event $event): JsonResponse
    {
        $user = $request->user();

        if ($user->id !== $event->user_id && ($user->role ?? 'user') !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $event->delete();

        // 204 No Content est correct, mais on retourne 200 avec message si tu préfères
        return response()->json(['message' => 'Event deleted'], 200);
    }
}
