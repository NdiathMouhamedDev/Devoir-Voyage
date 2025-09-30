<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Hourly;
use App\Events\HourlyUpdated;
use Illuminate\Http\Request;

class HourlyController extends Controller
{
    // Liste des horaires
    public function index() {
        return Hourly::orderBy('startup', 'asc')->get();
    }

    public function getByEvent($eventId)
    {
        $hourlies = \App\Models\Hourly::where('event_id', $eventId)->get();

        if ($hourlies->isEmpty()) {
            return response()->json(['message' => 'Aucun planning trouvé'], 404);
        }

        return response()->json($hourlies);
    }

    public function storeForEvent(Request $request, $id)
    {
        $event = Event::findOrFail($id);

        // Validation
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'startup' => 'required|date',
            'end' => 'nullable|date|after_or_equal:startup',
            'place' => 'nullable|string|max:255',
        ]);

        // Vérifier si l'event a déjà un planning (optionnel)
        if ($event->planning) {
            return response()->json(['message' => 'Cet event a déjà un planning'], 400);
        }

        $hourly = new Hourly($validated);
        $hourly->event_id = $event->id;
        $hourly->save();

        return response()->json([
            'message' => 'Planning créé avec succès',
            'planning' => $hourly
        ], 201);
    }

    public function show($id)
    {
        $hourly = Hourly::find($id);

        if (!$hourly) {
            return response()->json([
                "success" => false,
                "message" => "Horaire introuvable"
            ], 404);
        }

        return response()->json([
            "success" => true,
            "data" => $hourly
        ], 200);
    }


    // Ajouter un Hourly
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'required|string|max:255',
            'place' => 'string',
            'startup' => 'required',
            'end' => 'nullable',
        ]);

        $hourly = Hourly::create($validated);

        return response()->json($hourly, 201);
    }


    // Mettre à jour un Hourly
    public function update(Request $request, Hourly $hourly)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'required|date',
            'place' => 'nullable|string',
            'startup' => 'required',
            'end' => 'nullable',
        ]);

        $planning = hourly::findOrFail($id);
        $planning->update($request->all());

        broadcast(new HourlyUpdated($hourly->id, "Le planning a été mis à jour !"))->toOthers();

        $hourly->update($validated);

        return response()->json($hourly, 201);

    }


    // Supprimer
    public function destroy(Hourly $hourly) {
        $hourly->delete();
        return response()->json(['message' => 'horaire supprimé']);
    }

    public function showByEvent($id)
    {
        $hourly = Hourly::where('event_id', $id)->first();

        if (!$hourly) {
            return response()->json(['message' => 'No planning found'], 404);
        }

        return response()->json($hourly);
    }

}
